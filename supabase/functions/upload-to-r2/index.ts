import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

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

// AWS Signature V4 signing functions
function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): ArrayBuffer {
  const kDate = createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = createHmac('sha256', kDate).update(regionName).digest();
  const kService = createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

async function sha256(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hmacSha256(key: ArrayBuffer | Uint8Array, data: string): string {
  const hmac = createHmac('sha256', Buffer.from(key));
  hmac.update(data);
  return hmac.digest('hex');
}

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

    // Convert base64 to Uint8Array
    const fileData = Uint8Array.from(atob(file), c => c.charCodeAt(0));

    // Get R2 credentials
    const accessKeyId = Deno.env.get('CLOUDFLARE_ACCESS_KEY_ID')!;
    const secretAccessKey = Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY')!;
    const bucketName = Deno.env.get('CLOUDFLARE_BUCKET_NAME')!;
    const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID')!;

    // Build the request
    const objectKey = `${bucketPath}/${sanitizedFileName}`;
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const url = `https://${host}/${bucketName}/${objectKey}`;
    
    // AWS Signature V4 signing
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);
    const region = 'auto';
    const service = 's3';
    
    const payloadHash = await sha256(fileData);
    
    const canonicalHeaders = 
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;
    
    const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
    
    const canonicalRequest = 
      `PUT\n` +
      `/${bucketName}/${objectKey}\n` +
      `\n` +
      `${canonicalHeaders}\n` +
      `${signedHeaders}\n` +
      `${payloadHash}`;
    
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    
    const canonicalRequestHash = await sha256(new TextEncoder().encode(canonicalRequest));
    
    const stringToSign = 
      `${algorithm}\n` +
      `${amzDate}\n` +
      `${credentialScope}\n` +
      `${canonicalRequestHash}`;
    
    const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
    const signature = hmacSha256(signingKey, stringToSign);
    
    const authorizationHeader = 
      `${algorithm} ` +
      `Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;
    
    console.log('Uploading to R2:', url);
    
    // Upload using native fetch
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Host': host,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        'Authorization': authorizationHeader,
      },
      body: fileData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('R2 upload failed:', response.status, errorText);
      throw new Error(`R2 upload failed: ${response.status} ${errorText}`);
    }

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
