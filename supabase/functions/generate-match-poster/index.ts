
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log("Prompt reçu:", prompt);

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));

    console.log("Génération de l'image en cours...");
    const image = await hf.textToImage({
      inputs: `professional esports tournament poster, gaming event, ${prompt}, modern design, high quality, 4k, detailed, sharp focus, professional photography, epic lighting, dramatic composition`,
      model: 'runwayml/stable-diffusion-v1-5',
      parameters: {
        negative_prompt: "blurry, low quality, distorted, bad anatomy, text, watermark",
        num_inference_steps: 30,
        guidance_scale: 7.5
      }
    });

    // Convertir le blob en base64
    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    console.log("Image générée avec succès");

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur dans la fonction generate-match-poster:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
