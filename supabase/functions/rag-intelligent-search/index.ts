
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, sessionId, userId, guestUserId } = await req.json()
    
    console.log('RAG Search Request:', { query, sessionId, userId, guestUserId })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create or update search session with user tracking
    let searchSessionId = sessionId
    
    if (!searchSessionId) {
      const sessionData: any = {
        user_query: query,
        parsed_filters: {},
        results_count: 0,
        success_score: 0.0
      }
      
      // Add user tracking
      if (userId) {
        sessionData.user_id = userId
      } else if (guestUserId) {
        sessionData.guest_user_id = guestUserId
      }
      
      const { data: newSession, error: sessionError } = await supabase
        .from('search_sessions')
        .insert(sessionData)
        .select('id')
        .single()

      if (sessionError) {
        console.error('Error creating search session:', sessionError)
        throw sessionError
      }
      
      searchSessionId = newSession.id
    }

    // Try to get embeddings using DeepSeek API for semantic similarity
    const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
    let similarQueries = []
    
    if (deepSeekApiKey) {
      try {
        // Get embedding for the current query
        const embeddingResponse = await fetch('https://api.deepseek.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepSeekApiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-embedding',
            input: query
          })
        })

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json()
          const queryEmbedding = embeddingData.data[0].embedding
          
          // Store the query embedding
          await supabase
            .from('query_embeddings')
            .insert({
              search_session_id: searchSessionId,
              query_text: query,
              embedding: JSON.stringify(queryEmbedding),
              success_score: 0.0
            })

          // Find similar successful queries (if vector search function exists)
          try {
            const { data: similarQueriesData } = await supabase
              .rpc('match_similar_queries', {
                query_embedding: JSON.stringify(queryEmbedding),
                match_threshold: 0.7,
                match_count: 3
              })
            
            if (similarQueriesData) {
              similarQueries = similarQueriesData
            }
          } catch (vectorError) {
            console.log('Vector search not available, using basic pattern matching')
          }
        }
      } catch (embeddingError) {
        console.error('Error getting embeddings:', embeddingError)
      }
    }

    // Get learned patterns for fallback
    const { data: learnedPatterns } = await supabase
      .from('learned_patterns')
      .select('*')
      .eq('pattern_type', 'successful_query')
      .order('confidence_score', { ascending: false })
      .limit(5)

    // Use DeepSeek API for intelligent parsing
    let parsedFilters = {}
    
    if (deepSeekApiKey) {
      try {
        // Build context from similar queries and learned patterns
        let context = 'Previous successful searches:\n'
        
        similarQueries.forEach((similar: any, index: number) => {
          context += `${index + 1}. Query: "${similar.query_text}" → Filters: ${JSON.stringify(similar.output_structure)}\n`
        })
        
        if (learnedPatterns) {
          context += '\nLearned patterns:\n'
          learnedPatterns.slice(0, 3).forEach((pattern: any, index: number) => {
            context += `${index + 1}. "${pattern.input_text}" → ${JSON.stringify(pattern.output_structure)}\n`
          })
        }

        const systemPrompt = `You are an intelligent search filter parser for an influencer marketing platform. Parse user queries into structured filters.

Available filter options:
- followers: object with min/max (numbers)
- engagement_rate: object with min/max (percentages as decimals)
- niche: array of strings (fashion, tech, food, fitness, travel, beauty, gaming, lifestyle, business, education, etc.)
- platform: array of strings (instagram, youtube, tiktok, twitter, linkedin)
- country: array of strings (country names)
- collab_status: array of strings (available, busy, closed)

${context}

Parse the following query into filters. Return only valid JSON with the filter structure, no explanations:`

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepSeekApiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ],
            temperature: 0.1,
            max_tokens: 500
          })
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.choices[0].message.content.trim()
          
          try {
            // Try to parse the AI response as JSON
            parsedFilters = JSON.parse(aiResponse)
            console.log('AI parsed filters:', parsedFilters)
          } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', aiResponse)
            // Fallback to basic parsing
            parsedFilters = parseBasicFilters(query)
          }
        } else {
          console.error('DeepSeek API error:', await response.text())
          parsedFilters = parseBasicFilters(query)
        }
      } catch (aiError) {
        console.error('AI parsing error:', aiError)
        parsedFilters = parseBasicFilters(query)
      }
    } else {
      // Fallback to basic parsing
      parsedFilters = parseBasicFilters(query)
    }

    // Update search session with parsed filters
    await supabase
      .from('search_sessions')
      .update({ 
        parsed_filters: parsedFilters,
        updated_at: new Date().toISOString()
      })
      .eq('id', searchSessionId)

    console.log('RAG Search completed:', { searchSessionId, parsedFilters })

    return new Response(JSON.stringify({
      searchTerm: query,
      filters: parsedFilters,
      sessionId: searchSessionId,
      similarQueries: similarQueries.length,
      learnedPatterns: learnedPatterns?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('RAG search error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      searchTerm: '',
      filters: {}
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Fallback basic parsing function
function parseBasicFilters(query: string) {
  const filters: any = {}
  const lowerQuery = query.toLowerCase()

  // Basic niche detection
  const niches = ['fashion', 'tech', 'food', 'fitness', 'travel', 'beauty', 'gaming', 'lifestyle', 'business', 'education']
  const detectedNiches = niches.filter(niche => lowerQuery.includes(niche))
  if (detectedNiches.length > 0) {
    filters.niche = detectedNiches
  }

  // Basic platform detection
  const platforms = ['instagram', 'youtube', 'tiktok', 'twitter', 'linkedin']
  const detectedPlatforms = platforms.filter(platform => lowerQuery.includes(platform))
  if (detectedPlatforms.length > 0) {
    filters.platform = detectedPlatforms
  }

  // Basic follower count detection
  const followerMatch = lowerQuery.match(/(\d+)k?\s*(followers?|subs?)/i)
  if (followerMatch) {
    const count = parseInt(followerMatch[1]) * (followerMatch[0].includes('k') ? 1000 : 1)
    filters.followers = { min: Math.max(0, count - 10000), max: count + 50000 }
  }

  return filters
}
