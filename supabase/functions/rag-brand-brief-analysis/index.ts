
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate hash for caching
function generateHash(text: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { briefText } = await req.json();
    console.log('Starting RAG brand brief analysis...');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Check cache for similar brief
    const briefHash = generateHash(briefText.substring(0, 500)); // Use first 500 chars for cache key
    
    const { data: cachedResult } = await supabase
      .from('brief_analysis_cache')
      .select('*')
      .eq('brief_hash', briefHash)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cachedResult) {
      console.log('Found cached result, returning immediately');
      return new Response(JSON.stringify({
        analysis: cachedResult.analysis,
        recommendations: cachedResult.recommendations,
        cached: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Generate brief embedding for vector search
    console.log('Generating brief embedding...');
    const embeddingResponse = await fetch('https://api.deepseek.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-embed',
        input: briefText,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate brief embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const briefEmbedding = embeddingData.data[0]?.embedding;

    if (!briefEmbedding) {
      throw new Error('No embedding returned for brief');
    }

    // Step 3: Parallel processing - Brief analysis + Vector search
    console.log('Starting parallel processing...');
    
    const [analysisResult, vectorSearchResult] = await Promise.all([
      // Brief analysis
      fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: `You are an expert marketing strategist analyzing brand briefs. Extract key information and provide structured analysis.

Return ONLY valid JSON in this exact format:
{
  "brand_name": "extracted brand name",
  "target_audience": "description of target audience",
  "campaign_goals": ["goal1", "goal2", "goal3"],
  "budget_range": "budget range or 'not specified'",
  "timeline": "timeline or 'not specified'",
  "preferred_platforms": ["platform1", "platform2"],
  "content_style": "style description",
  "key_requirements": ["requirement1", "requirement2"],
  "questions": ["question1", "question2"],
  "summary": "2-3 sentence summary of the brief"
}

Brand brief to analyze: ${briefText}`
            }
          ],
          temperature: 0.3,
        }),
      }),

      // Vector search for similar creators
      supabase.rpc('find_similar_creators', {
        query_embedding: JSON.stringify(briefEmbedding),
        similarity_threshold: 0.6,
        max_results: 30
      })
    ]);

    // Process brief analysis
    const analysisData = await analysisResult.json();
    const analysisContent = analysisData.choices[0]?.message?.content;
    const cleanAnalysisContent = analysisContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const analysis = JSON.parse(cleanAnalysisContent);
    console.log('Brief analysis completed');

    // Process vector search results
    const { data: similarCreators, error: vectorError } = vectorSearchResult;
    if (vectorError) {
      console.error('Vector search error:', vectorError);
      throw vectorError;
    }

    console.log(`Found ${similarCreators?.length || 0} similar creators via vector search`);

    // Step 4: Get full creator details for similar creators
    const creatorIds = similarCreators?.map(sc => sc.creator_id) || [];
    
    const { data: fullCreators, error: creatorsError } = await supabase
      .from('creator database')
      .select('*')
      .in('id', creatorIds);

    if (creatorsError) {
      console.error('Error fetching creator details:', creatorsError);
      throw creatorsError;
    }

    // Step 5: Enhanced matching with DeepSeek using pre-filtered creators
    console.log('Performing enhanced matching on pre-filtered creators...');
    
    const matchingResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `You are an influencer marketing expert. Analyze these pre-selected creators (already filtered by semantic similarity) and score their match with the brand brief.

Brand Analysis: ${JSON.stringify(analysis)}

For each creator, calculate a match score (0-100) and provide reasons. Return ONLY valid JSON array:
[
  {
    "id": "creator_id",
    "match_score": 85,
    "match_reasons": ["reason1", "reason2"],
    "estimated_rate": 2500
  }
]

Focus on:
- Platform alignment
- Niche relevance  
- Audience size fit
- Engagement quality
- Geographic relevance
- Content style fit

Only include creators with score >= 75. Limit to top 15.

Pre-filtered creators: ${JSON.stringify(fullCreators?.slice(0, 25) || [])}`
          }
        ],
        temperature: 0.2,
      }),
    });

    const matchingData = await matchingResponse.json();
    const matchingContent = matchingData.choices[0]?.message?.content;
    const cleanMatchingContent = matchingContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const matchedCreators = JSON.parse(cleanMatchingContent);
    console.log(`Enhanced matching completed, ${matchedCreators.length} final matches`);

    // Step 6: Build final recommendations
    const recommendations = matchedCreators.map((match: any) => {
      const creator = fullCreators?.find(c => c.id === match.id);
      if (!creator) return null;

      // Get similarity score from vector search
      const vectorMatch = similarCreators?.find(sc => sc.creator_id === match.id);
      const semanticSimilarity = vectorMatch?.similarity_score || 0;

      return {
        id: creator.id,
        name: creator.name || 'Unknown Creator',
        username: creator.handle || '@unknown',
        platform: creator.platform || 'Unknown',
        followers: creator.followers || 0,
        engagement_rate: creator.engagement_rate || 0,
        niche: creator.niche ? creator.niche.split(',').map((n: string) => n.trim()) : ['Unknown'],
        match_score: match.match_score,
        match_reasons: match.match_reasons,
        estimated_rate: match.estimated_rate,
        semantic_similarity: Math.round(semanticSimilarity * 100)
      };
    }).filter(Boolean);

    console.log(`Returning ${recommendations.length} final recommendations`);

    // Step 7: Cache the results
    try {
      await supabase
        .from('brief_analysis_cache')
        .insert({
          brief_hash: briefHash,
          brief_text: briefText,
          analysis: analysis,
          recommendations: recommendations
        });
      console.log('Results cached for future use');
    } catch (cacheError) {
      console.warn('Failed to cache results:', cacheError);
      // Don't fail the request if caching fails
    }

    return new Response(JSON.stringify({
      analysis,
      recommendations,
      cached: false,
      performance: {
        total_creators_in_db: fullCreators?.length || 0,
        vector_filtered: similarCreators?.length || 0,
        final_matches: recommendations.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in rag-brand-brief-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: null,
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
