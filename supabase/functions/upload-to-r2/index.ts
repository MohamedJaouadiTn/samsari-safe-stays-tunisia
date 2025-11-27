import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { file, fileName, contentType, bucketPath } = await req.json();

    // Initialize R2 client
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: Deno.env.get('CLOUDFLARE_S3_ENDPOINT'),
      credentials: {
        accessKeyId: Deno.env.get('CLOUDFLARE_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY')!,
      },
    });

    // Convert base64 to Uint8Array
    const fileData = Uint8Array.from(atob(file), c => c.charCodeAt(0));

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: Deno.env.get('CLOUDFLARE_BUCKET_NAME'),
      Key: `${bucketPath}/${fileName}`,
      Body: fileData,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return public URL
    const publicUrl = `${Deno.env.get('CLOUDFLARE_BUCKET_URL')}/${bucketPath}/${fileName}`;

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
