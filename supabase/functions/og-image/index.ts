import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create SEO-friendly slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    .replace(/-+$/, '');
}

// Helper to get key feature from amenities or property type
function getKeyFeature(property: any): string {
  const amenities = property.amenities || [];
  const priorityFeatures = ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'washer', 'beach', 'garden'];
  
  for (const feature of priorityFeatures) {
    if (amenities.some((a: string) => a.toLowerCase().includes(feature))) {
      if (feature === 'wifi') return 'Fast WiFi';
      if (feature === 'pool') return 'Pool';
      if (feature === 'parking') return 'Free Parking';
      if (feature === 'ac') return 'Air Conditioning';
      if (feature === 'kitchen') return 'Full Kitchen';
      if (feature === 'washer') return 'Washer';
      if (feature === 'beach') return 'Beach Access';
      if (feature === 'garden') return 'Garden';
    }
  }
  
  // Fallback to property type
  const typeLabels: Record<string, string> = {
    'apartment': 'Modern Apartment',
    'house': 'Entire House',
    'villa': 'Luxury Villa',
    'studio': 'Cozy Studio',
    'room': 'Private Room',
    'cabin': 'Rustic Cabin',
    'traditional': 'Traditional Home'
  };
  
  return typeLabels[property.property_type] || 'Vacation Rental';
}

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

    // Fetch property data from database on the server
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

    // Get the main image URL (first photo selected by host)
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

    // Build canonical URL with SEO-friendly slug
    // Format: /property/{city}-{short-title}-{propertyId}
    const citySlug = createSlug(property.city);
    const titleSlug = createSlug(property.title);
    const identifier = property.short_code || property.id;
    const canonicalPath = `/property/${citySlug}-${titleSlug}-${identifier}`;
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    
    // Actual app URL for redirect
    const appUrl = property.short_code 
      ? `${siteUrl}/p/${property.short_code}`
      : `${siteUrl}/property/${property.id}`;

    // Get key feature for title
    const keyFeature = getKeyFeature(property);

    // Generate SEO metadata dynamically before HTML is sent
    // Title format: Rental Unit in {City} · {Bedrooms} Bedroom · {Key Feature}
    const bedroomText = property.bedrooms === 1 ? '1 Bedroom' : `${property.bedrooms} Bedrooms`;
    const seoTitle = `Rental Unit in ${property.city} · ${bedroomText} · ${keyFeature}`;
    
    // Meta description using property summary and location
    const description = `${property.max_guests} guests · ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''} · ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''} in ${property.city}, ${property.governorate}. ${property.price_per_night} TND/night. ${(property.description || '').substring(0, 120).trim()}`;

    console.log('SSR SEO - Property:', property.title, '| Canonical:', canonicalUrl, '| Image:', imageUrl);

    // Server-side rendered HTML with all SEO metadata in initial response
    // Crawlers receive correct metadata on first request - no JavaScript needed
    const html = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary SEO Meta Tags -->
  <title>${seoTitle}</title>
  <meta name="title" content="${seoTitle}">
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${seoTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${property.title} - Vacation rental in ${property.city}, Tunisia">
  <meta property="og:site_name" content="Samsari - Tunisia Safe Stays">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card (Large Image) -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${seoTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${property.title} - Vacation rental in ${property.city}, Tunisia">
  
  <!-- Additional SEO -->
  <meta property="product:price:amount" content="${property.price_per_night}">
  <meta property="product:price:currency" content="${property.currency || 'TND'}">
  <meta name="geo.region" content="TN-${property.governorate}">
  <meta name="geo.placename" content="${property.city}, Tunisia">
  
  <!-- Instant redirect for real users (crawlers don't execute JavaScript) -->
  <script>window.location.replace("${appUrl}");</script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${appUrl}">
  </noscript>
</head>
<body>
  <h1>${seoTitle}</h1>
  <p>${description}</p>
  <p>Redirecting to <a href="${appUrl}">${property.title}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});