
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    console.log('Processing search query:', query);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a search query interpreter for a creator database. Parse natural language queries and return JSON with search parameters.

Available fields:
- platforms: ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"]
- niches: ["fitness", "tech", "fashion", "food", "travel", "gaming", "beauty", "lifestyle", "business", "education", "music", "art", "sports", "health", "comedy", "DIY", "pets", "family", "cars", "finance"]
- countries: any country name
- followers: numeric ranges
- engagement_rate: numeric ranges (0-100)

Return ONLY valid JSON in this format:
{
  "searchTerm": "extracted keywords for name/niche search",
  "filters": {
    "platform": ["array of platforms"],
    "niche": ["array of niches"],
    "location": ["array of countries"],
    "followers": {"min": number, "max": number},
    "engagement": {"min": number, "max": number},
    "verified": boolean or null
  }
}

Examples:
- "fitness creators with high engagement" → {"searchTerm": "fitness", "filters": {"niche": ["fitness"], "engagement": {"min": 5, "max": 0}}}
- "YouTubers from US with 100k+ followers" → {"searchTerm": "", "filters": {"platform": ["YouTube"], "location": ["United States"], "followers": {"min": 100000, "max": 0}}}
- "verified tech influencers" → {"searchTerm": "tech", "filters": {"niche": ["tech"], "verified": true}}

Set max to 0 to indicate no upper limit. Only include filters that are explicitly mentioned.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    const searchParams = JSON.parse(data.choices[0].message.content);
    console.log('Parsed search parameters:', searchParams);

    return new Response(JSON.stringify(searchParams), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in intelligent-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      searchTerm: "",
      filters: {}
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
