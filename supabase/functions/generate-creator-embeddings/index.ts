
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
    console.log('Starting creator embeddings generation...');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all creators from database
    const { data: creators, error: creatorsError } = await supabase
      .from('creator database')
      .select('*');

    if (creatorsError) {
      console.error('Error fetching creators:', creatorsError);
      throw creatorsError;
    }

    console.log(`Found ${creators?.length || 0} creators to process`);

    // Check which creators already have embeddings
    const { data: existingEmbeddings } = await supabase
      .from('creator_embeddings')
      .select('creator_id');

    const existingCreatorIds = new Set(existingEmbeddings?.map(e => e.creator_id) || []);
    const creatorsToProcess = creators?.filter(c => !existingCreatorIds.has(c.id)) || [];

    console.log(`Processing ${creatorsToProcess.length} new creators`);

    let processedCount = 0;
    const batchSize = 10;

    for (let i = 0; i < creatorsToProcess.length; i += batchSize) {
      const batch = creatorsToProcess.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchPromises = batch.map(async (creator) => {
        try {
          // Create profile text for embedding
          const profileText = [
            creator.name || 'Unknown Creator',
            creator.niche || 'General',
            creator.platform || 'Unknown Platform',
            creator.country || 'Unknown Location',
            `${creator.followers || 0} followers`,
            `${creator.engagement_rate || 0}% engagement`,
            creator.handle || ''
          ].filter(Boolean).join(' | ');

          // Generate embedding using DeepSeek
          const embeddingResponse = await fetch('https://api.deepseek.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${deepseekApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'deepseek-embed',
              input: profileText,
            }),
          });

          if (!embeddingResponse.ok) {
            console.error(`Failed to generate embedding for creator ${creator.id}:`, await embeddingResponse.text());
            return null;
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0]?.embedding;

          if (!embedding) {
            console.error(`No embedding returned for creator ${creator.id}`);
            return null;
          }

          // Store embedding in database
          const { error: insertError } = await supabase
            .from('creator_embeddings')
            .insert({
              creator_id: creator.id,
              embedding: JSON.stringify(embedding),
              profile_text: profileText
            });

          if (insertError) {
            console.error(`Error storing embedding for creator ${creator.id}:`, insertError);
            return null;
          }

          console.log(`✓ Generated embedding for creator: ${creator.name}`);
          return creator.id;
        } catch (error) {
          console.error(`Error processing creator ${creator.id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      const successfulResults = batchResults.filter(Boolean);
      processedCount += successfulResults.length;

      console.log(`Batch ${Math.floor(i / batchSize) + 1} completed. ${successfulResults.length}/${batch.length} successful. Total: ${processedCount}/${creatorsToProcess.length}`);

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < creatorsToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(JSON.stringify({
      success: true,
      totalCreators: creators?.length || 0,
      processedCount,
      skippedCount: existingCreatorIds.size,
      newEmbeddings: processedCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-creator-embeddings function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
