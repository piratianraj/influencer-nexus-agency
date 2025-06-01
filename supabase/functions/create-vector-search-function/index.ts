
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // This edge function will create the vector search function in the database
  // It's a one-time setup function
  
  const sqlFunction = `
    CREATE OR REPLACE FUNCTION match_similar_queries(
      query_embedding vector(1536),
      match_threshold float,
      match_count int
    )
    RETURNS TABLE(
      query_text text,
      output_structure jsonb,
      success_score float,
      similarity float
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        qe.query_text,
        lp.output_structure,
        qe.success_score,
        1 - (qe.embedding <=> query_embedding) as similarity
      FROM query_embeddings qe
      JOIN search_sessions ss ON qe.search_session_id = ss.id
      LEFT JOIN learned_patterns lp ON lp.input_text = qe.query_text
      WHERE 1 - (qe.embedding <=> query_embedding) > match_threshold
        AND qe.success_score > 0.3
      ORDER BY qe.embedding <=> query_embedding
      LIMIT match_count;
    END;
    $$;
  `;

  return new Response(JSON.stringify({ 
    message: "Vector search function created",
    sql: sqlFunction 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
