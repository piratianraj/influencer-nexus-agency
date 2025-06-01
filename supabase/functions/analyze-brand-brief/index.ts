
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { briefText } = await req.json();
    console.log('Analyzing brand brief:', briefText.substring(0, 200) + '...');

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Analyze the brand brief with DeepSeek
    const analysisResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
    });

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices[0]?.message?.content;
    const cleanAnalysisContent = analysisContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const analysis = JSON.parse(cleanAnalysisContent);
    console.log('Brief analysis:', analysis);

    // Step 2: Get creators from database
    const { data: creators, error } = await supabase
      .from('creator database')
      .select('*');

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Found ${creators?.length || 0} creators in database`);

    // Step 3: Use DeepSeek to match and score creators
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
            content: `You are an influencer marketing expert. Analyze creators and score their match with the brand brief.

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

Only include creators with score >= 70. Limit to top 10.

Score these creators: ${JSON.stringify(creators?.slice(0, 50) || [])}`
          }
        ],
        temperature: 0.2,
      }),
    });

    const matchingData = await matchingResponse.json();
    const matchingContent = matchingData.choices[0]?.message?.content;
    const cleanMatchingContent = matchingContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const matchedCreators = JSON.parse(cleanMatchingContent);
    console.log(`AI matched ${matchedCreators.length} creators`);

    // Step 4: Build final recommendations
    const recommendations = matchedCreators.map((match: any) => {
      const creator = creators?.find(c => c.id === match.id);
      if (!creator) return null;

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
        estimated_rate: match.estimated_rate
      };
    }).filter(Boolean);

    console.log(`Returning ${recommendations.length} final recommendations`);

    return new Response(JSON.stringify({
      analysis,
      recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-brand-brief function:', error);
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
