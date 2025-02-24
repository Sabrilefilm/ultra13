
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting image generation...");
    const { prompt } = await req.json();
    
    console.log("Prompt received:", prompt);
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));

    console.log("Calling Hugging Face API...");
    const blob = await hf.textToImage({
      inputs: prompt,
      model: "stabilityai/stable-diffusion-2",
      parameters: {
        negative_prompt: "blurry, bad quality, distorted",
      }
    });

    // Convert blob to base64
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        imageUrl: imageUrl 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-match-poster:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Error generating image',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
