import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Allowed file types for upload
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Allowed upload paths
const ALLOWED_PATHS = ['id-verification', 'avatars', 'property-photos'];

// Max file size: 10MB (base64 encoded is ~33% larger)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { file, fileName, contentType, bucketPath } = await req.json();

    // Validate content type
    if (!contentType || !ALLOWED_CONTENT_TYPES.includes(contentType.toLowerCase())) {
      console.error('Invalid content type:', contentType);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate bucket path
    const basePath = bucketPath?.split('/')[0];
    if (!basePath || !ALLOWED_PATHS.includes(basePath)) {
      console.error('Invalid bucket path:', bucketPath);
      return new Response(
        JSON.stringify({ error: 'Invalid upload path' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file exists
    if (!file || typeof file !== 'string') {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (base64)
    if (file.length > MAX_FILE_SIZE * 1.4) { // Account for base64 overhead
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize fileName
    if (!fileName || typeof fileName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid file name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent path traversal in fileName
    const sanitizedFileName = fileName.replace(/\.\./g, '').replace(/[\/\\]/g, '_');

    // Initialize R2 client
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: Deno.env.get('CLOUDFLARE_S3_ENDPOINT'),
      credentials: {
        accessKeyId: Deno.env.get('CLOUDFLARE_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY')!,
      },
      forcePathStyle: true, // Required for Cloudflare R2
    });

    // Convert base64 to Uint8Array
    const fileData = Uint8Array.from(atob(file), c => c.charCodeAt(0));

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: Deno.env.get('CLOUDFLARE_BUCKET_NAME'),
      Key: `${bucketPath}/${sanitizedFileName}`,
      Body: fileData,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return public URL
    const publicUrl = `${Deno.env.get('CLOUDFLARE_BUCKET_URL')}/${bucketPath}/${sanitizedFileName}`;

    console.log('File uploaded successfully by user:', user.id, 'path:', `${bucketPath}/${sanitizedFileName}`);

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
      JSON.stringify({ error: 'Upload failed. Please try again.' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
