
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchSession {
  id: string;
  user_query: string;
  parsed_filters: any;
  results_count: number;
}

interface SimilarQuery {
  query_text: string;
  output_structure: any;
  success_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sessionId } = await req.json();
    console.log('RAG search query:', query, 'sessionId:', sessionId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Generate embedding for the query
    let queryEmbedding = null;
    if (openaiApiKey) {
      try {
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: query,
          }),
        });
        
        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          queryEmbedding = embeddingData.data[0].embedding;
          console.log('Generated query embedding');
        }
      } catch (error) {
        console.log('Failed to generate embedding:', error);
      }
    }

    // Step 2: Retrieve similar successful queries using vector similarity
    let similarQueries: SimilarQuery[] = [];
    if (queryEmbedding) {
      try {
        const { data: similarQueriesData } = await supabase
          .rpc('match_similar_queries', {
            query_embedding: queryEmbedding,
            match_threshold: 0.7,
            match_count: 5
          });

        if (similarQueriesData) {
          similarQueries = similarQueriesData;
          console.log('Found similar queries:', similarQueries.length);
        }
      } catch (error) {
        console.log('Vector search failed, falling back to text search:', error);
      }
    }

    // Step 3: Fallback to text-based pattern matching
    if (similarQueries.length === 0) {
      const { data: patternData } = await supabase
        .from('learned_patterns')
        .select('input_text, output_structure, confidence_score')
        .eq('pattern_type', 'successful_query')
        .gte('confidence_score', 0.5)
        .order('confidence_score', { ascending: false })
        .limit(3);

      if (patternData) {
        similarQueries = patternData.map(p => ({
          query_text: p.input_text,
          output_structure: p.output_structure,
          success_score: p.confidence_score
        }));
      }
    }

    // Step 4: Build dynamic prompt with retrieved examples
    let dynamicExamples = '';
    if (similarQueries.length > 0) {
      dynamicExamples = '\n\nLearned examples from successful searches:\n';
      similarQueries.forEach((sq, index) => {
        dynamicExamples += `${index + 1}. "${sq.query_text}" → ${JSON.stringify(sq.output_structure)}\n`;
      });
    }

    const prompt = `You are an AI assistant that converts natural language search queries into structured JSON filters for a creator/influencer database.

Available database fields:
- name (text): Creator's full name
- handle (text): Creator's social media handle/username
- platform (text): Social media platform (Instagram, YouTube, TikTok, etc.)
- niche (text): Content category/niche (fitness, tech, fashion, food, travel, etc.)
- country (text): Creator's location/country
- followers (bigint): Number of followers
- engagement_rate (float): Engagement rate percentage
- collab_status (text): Collaboration status
- email (text): Contact email
- contact_number (text): Contact number
- last_active (text): Last activity date

${dynamicExamples}

Convert this search query: "${query}"

Return ONLY a JSON object with this exact structure:
{
  "searchTerm": "main search keywords for text matching",
  "filters": {
    "platform": ["Instagram", "YouTube", "TikTok"] (array, only if mentioned),
    "niche": ["fitness", "tech", "fashion"] (array, only if mentioned),
    "country": ["United States", "Canada", "India"] (array, only if mentioned),
    "followers": {"operator": ">", "value": 50000} (only if mentioned, operators: >, <, >=, <=, =),
    "engagement_rate": {"operator": ">", "value": 5.0} (only if mentioned, operators: >, <, >=, <=, =),
    "collab_status": "active" (only if mentioned)
  }
}

Only return the JSON object, no other text.`;

    // Step 5: Generate response using AI
    let result = { searchTerm: query, filters: {} };
    
    if (deepseekApiKey) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content?.trim();
          
          const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
          const parsedResult = JSON.parse(cleanContent);
          
          // Transform to match existing filter structure
          result = {
            searchTerm: parsedResult.searchTerm || '',
            filters: {}
          };

          if (parsedResult.filters.platform) result.filters.platform = parsedResult.filters.platform;
          if (parsedResult.filters.niche) result.filters.niche = parsedResult.filters.niche;
          if (parsedResult.filters.country) result.filters.location = parsedResult.filters.country;
          
          if (parsedResult.filters.followers) {
            const followerFilter = parsedResult.filters.followers;
            if (followerFilter.operator === '>') {
              result.filters.followers = { min: followerFilter.value, max: 0 };
            } else if (followerFilter.operator === '<') {
              result.filters.followers = { min: 0, max: followerFilter.value };
            } else if (followerFilter.operator === '>=') {
              result.filters.followers = { min: followerFilter.value, max: 0 };
            } else if (followerFilter.operator === '<=') {
              result.filters.followers = { min: 0, max: followerFilter.value };
            } else {
              result.filters.followers = { min: followerFilter.value, max: followerFilter.value };
            }
          }
          
          if (parsedResult.filters.engagement_rate) {
            const engagementFilter = parsedResult.filters.engagement_rate;
            if (engagementFilter.operator === '>') {
              result.filters.engagement = { min: engagementFilter.value, max: 0 };
            } else if (engagementFilter.operator === '<') {
              result.filters.engagement = { min: 0, max: engagementFilter.value };
            } else if (engagementFilter.operator === '>=') {
              result.filters.engagement = { min: engagementFilter.value, max: 0 };
            } else if (engagementFilter.operator === '<=') {
              result.filters.engagement = { min: 0, max: engagementFilter.value };
            } else {
              result.filters.engagement = { min: engagementFilter.value, max: engagementFilter.value };
            }
          }
        }
      } catch (error) {
        console.error('AI processing failed:', error);
      }
    }

    // Step 6: Store search session for learning
    const { data: sessionData } = await supabase
      .from('search_sessions')
      .insert({
        user_query: query,
        parsed_filters: result.filters,
        results_count: 0, // Will be updated later
      })
      .select()
      .single();

    if (sessionData && queryEmbedding) {
      // Store query embedding
      await supabase
        .from('query_embeddings')
        .insert({
          search_session_id: sessionData.id,
          query_text: query,
          embedding: queryEmbedding,
          success_score: 0.0
        });
    }

    // Step 7: Return result with session ID for tracking
    const finalResult = {
      ...result,
      sessionId: sessionData?.id || sessionId
    };

    console.log('Final RAG result:', finalResult);
    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in RAG search function:', error);
    
    const fallback = {
      searchTerm: (await req.json()).query || '',
      filters: {},
      sessionId: null
    };
    
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
