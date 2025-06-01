
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
    console.log('Intelligent search query:', query);

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.log('Google Gemini API key not found, falling back to basic search');
      return new Response(JSON.stringify({
        searchTerm: query,
        filters: {}
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
    Analyze this search query for creator discovery: "${query}"
    
    Extract search terms and filters from the query. Return a JSON object with:
    {
      "searchTerm": "main search keywords",
      "filters": {
        "platform": ["Instagram", "YouTube", "TikTok"] (array, only if mentioned),
        "niche": ["fitness", "tech", "fashion"] (array, only if mentioned),
        "location": ["United States", "Canada"] (array, only if mentioned),
        "verified": true/false (only if mentioned),
        "followers": {"min": 0, "max": 0} (only if mentioned),
        "engagement": {"min": 0, "max": 0} (only if mentioned)
      }
    }
    
    Examples:
    - "fitness creators with high engagement" → {"searchTerm": "fitness", "filters": {"niche": ["fitness"], "engagement": {"min": 5, "max": 0}}}
    - "verified tech YouTubers from US" → {"searchTerm": "tech", "filters": {"niche": ["tech"], "platform": ["YouTube"], "location": ["United States"], "verified": true}}
    - "Alex" → {"searchTerm": "Alex", "filters": {}}
    
    Only return the JSON object, no other text.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text?.trim();
    
    console.log('Gemini response:', content);
    
    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // Fallback to basic search
      result = {
        searchTerm: query,
        filters: {}
      };
    }

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
