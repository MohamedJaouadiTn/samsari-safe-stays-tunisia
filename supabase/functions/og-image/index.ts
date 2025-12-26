import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shortCode = url.searchParams.get('code');
    const propertyId = url.searchParams.get('id');
    const siteUrl = url.searchParams.get('siteUrl') || 'https://samsari.lovable.app';

    if (!shortCode && !propertyId) {
      return new Response(JSON.stringify({ error: 'Missing property identifier' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch property data
    let query = supabase
      .from('properties')
      .select('*');

    if (shortCode) {
      query = query.eq('short_code', shortCode);
    } else if (propertyId) {
      query = query.eq('id', propertyId);
    }

    const { data: property, error } = await query.single();

    if (error || !property) {
      console.error('Property not found:', error);
      return new Response(JSON.stringify({ error: 'Property not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the first image URL
    let imageUrl = `${siteUrl}/placeholder.svg`;
    if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
      const firstPhoto = property.photos[0] as any;
      if (firstPhoto && typeof firstPhoto === 'object' && firstPhoto.url) {
        imageUrl = firstPhoto.url;
        if (!imageUrl.startsWith('http')) {
          if (imageUrl.startsWith('/storage/')) {
            imageUrl = `${supabaseUrl}${imageUrl}`;
          } else {
            imageUrl = `${siteUrl}${imageUrl}`;
          }
        }
      }
    }

    // Build property URL - always use the actual app URL for redirect
    const propertyUrl = shortCode 
      ? `${siteUrl}/p/${shortCode}`
      : `${siteUrl}/property/${propertyId}`;

    // Create title and description
    const title = `${property.title} - ${property.price_per_night} TND/night in ${property.city}`;
    const description = `${property.max_guests} guests · ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''} · ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''} in ${property.city}, ${property.governorate}. ${(property.description || '').substring(0, 100)}...`;

    console.log('Serving OG tags for property:', property.title, 'Image:', imageUrl);

    // Always return HTML with OG tags - JavaScript redirect handles real users
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${propertyUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Samsari - Tunisia Safe Stays">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${propertyUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Instant redirect for real users (crawlers don't execute JS) -->
  <script>window.location.replace("${propertyUrl}");</script>
</head>
<body>
  <p>Redirecting to <a href="${propertyUrl}">${property.title}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
