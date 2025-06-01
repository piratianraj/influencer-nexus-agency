
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Natural language search query:', query);

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!deepseekApiKey) {
      console.log('DeepSeek API key not found, falling back to basic search');
      return new Response(JSON.stringify({
        searchTerm: query,
        filters: {}
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

Examples:
- "fitness creators with high engagement" → {"searchTerm": "fitness", "filters": {"niche": ["fitness"], "engagement_rate": {"operator": ">", "value": 5.0}}}
- "tech YouTubers from US with 100k+ followers" → {"searchTerm": "tech", "filters": {"niche": ["tech"], "platform": ["YouTube"], "country": ["United States"], "followers": {"operator": ">", "value": 100000}}}
- "fashion influencers in India" → {"searchTerm": "fashion", "filters": {"niche": ["fashion"], "country": ["India"]}}
- "active creators with low engagement" → {"searchTerm": "", "filters": {"collab_status": "active", "engagement_rate": {"operator": "<", "value": 2.0}}}
- "Alex" → {"searchTerm": "Alex", "filters": {}}

Only return the JSON object, no other text.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, response.statusText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    console.log('DeepSeek response:', content);
    
    // Parse the JSON response
    let result;
    try {
      // Clean the response in case it has markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      result = JSON.parse(cleanContent);
      
      // Validate and transform the result to match existing filter structure
      const transformedResult = {
        searchTerm: result.searchTerm || '',
        filters: {}
      };

      // Transform filters to match existing FilterOptions interface
      if (result.filters.platform) {
        transformedResult.filters.platform = result.filters.platform;
      }
      if (result.filters.niche) {
        transformedResult.filters.niche = result.filters.niche;
      }
      if (result.filters.country) {
        transformedResult.filters.location = result.filters.country; // Map country to location
      }
      if (result.filters.followers) {
        const followerFilter = result.filters.followers;
        if (followerFilter.operator === '>') {
          transformedResult.filters.followers = { min: followerFilter.value, max: 0 };
        } else if (followerFilter.operator === '<') {
          transformedResult.filters.followers = { min: 0, max: followerFilter.value };
        } else if (followerFilter.operator === '>=') {
          transformedResult.filters.followers = { min: followerFilter.value, max: 0 };
        } else if (followerFilter.operator === '<=') {
          transformedResult.filters.followers = { min: 0, max: followerFilter.value };
        } else {
          transformedResult.filters.followers = { min: followerFilter.value, max: followerFilter.value };
        }
      }
      if (result.filters.engagement_rate) {
        const engagementFilter = result.filters.engagement_rate;
        if (engagementFilter.operator === '>') {
          transformedResult.filters.engagement = { min: engagementFilter.value, max: 0 };
        } else if (engagementFilter.operator === '<') {
          transformedResult.filters.engagement = { min: 0, max: engagementFilter.value };
        } else if (engagementFilter.operator === '>=') {
          transformedResult.filters.engagement = { min: engagementFilter.value, max: 0 };
        } else if (engagementFilter.operator === '<=') {
          transformedResult.filters.engagement = { min: 0, max: engagementFilter.value };
        } else {
          transformedResult.filters.engagement = { min: engagementFilter.value, max: engagementFilter.value };
        }
      }

      result = transformedResult;
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response as JSON:', parseError);
      // Fallback to basic search
      result = {
        searchTerm: query,
        filters: {}
      };
    }

    console.log('Final transformed result:', result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in intelligent-search function:', error);
    
    // Always return a fallback response instead of an error
    const fallback = {
      searchTerm: (await req.json()).query || '',
      filters: {}
    };
    
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
