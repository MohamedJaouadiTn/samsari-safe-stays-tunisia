
import React, { useEffect } from 'react';
import { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface PropertySharingMetaProps {
  property: Property;
}

const PropertySharingMeta: React.FC<PropertySharingMetaProps> = ({ property }) => {
  useEffect(() => {
    // Set page title
    const title = `${property.title} - ${property.price_per_night} TND per night in ${property.city}, ${property.governorate}`;
    document.title = title;

    // Create meta description
    const description = `${property.max_guests} guests • ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''} • ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''} in ${property.city}, ${property.governorate}. ${property.description?.substring(0, 100) || ''}...`;
    
    // Get the first valid image URL
    const getFirstImageUrl = () => {
      if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
        const firstPhoto = property.photos[0] as any;
        if (firstPhoto && typeof firstPhoto === 'object' && firstPhoto.url) {
          const imageUrl = firstPhoto.url;
          // If it's already a full URL, return it; otherwise make it absolute
          if (imageUrl.startsWith('http')) {
            return imageUrl;
          }
          // For Supabase storage URLs that start with /storage/
          if (imageUrl.startsWith('/storage/')) {
            return `https://gigzciepwjrwbljdnixh.supabase.co${imageUrl}`;
          }
          return `${window.location.origin}${imageUrl}`;
        }
      }
      // Return a default image with full URL
      return `${window.location.origin}/placeholder.svg`;
    };

    const imageUrl = getFirstImageUrl();
    const currentUrl = window.location.href;

    // Update meta description
    updateOrCreateMetaTag('description', description);

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: currentUrl },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'Samsari - Tunisia Safe Stays' },
      { property: 'og:locale', content: 'en_US' },
    ];

    ogTags.forEach(({ property: prop, content }) => {
      updateOrCreateMetaTag(prop, content, 'property');
    });

    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:site', content: '@samsari_tunisia' },
      { name: 'twitter:creator', content: '@samsari_tunisia' },
    ];

    twitterTags.forEach(({ name, content }) => {
      updateOrCreateMetaTag(name, content, 'name');
    });

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Samsari - Discover Tunisia';
      // Remove dynamic meta tags
      const metasToRemove = document.querySelectorAll('meta[data-dynamic="true"]');
      metasToRemove.forEach(meta => meta.remove());
    };
  }, [property]);

  const updateOrCreateMetaTag = (identifier: string, content: string, attributeType: 'name' | 'property' = 'name') => {
    let meta = document.querySelector(`meta[${attributeType}="${identifier}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attributeType, identifier);
      meta.setAttribute('data-dynamic', 'true'); // Mark as dynamic for cleanup
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // This component doesn't render anything visible
  return null;
};

export default PropertySharingMeta;
