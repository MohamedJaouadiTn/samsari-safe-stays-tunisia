
import React, { useEffect } from 'react';
import { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface PropertySharingMetaProps {
  property: Property;
}

const PropertySharingMeta: React.FC<PropertySharingMetaProps> = ({ property }) => {
  useEffect(() => {
    // Set page title
    const title = `${property.title} - ${property.price_per_night} TND per night`;
    document.title = title;

    // Create meta description
    const description = `${property.max_guests} guests max • ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''} • ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''} in ${property.city}, ${property.governorate}`;
    const amenitiesText = Array.isArray(property.amenities) ? 
      (property.amenities as string[]).slice(0, 3).join(', ') : '';
    const fullDescription = `${description}${amenitiesText ? ` • ${amenitiesText}` : ''}`;

    // Get the first valid image URL
    const getFirstImageUrl = () => {
      if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
        const firstPhoto = property.photos[0] as any;
        if (firstPhoto && typeof firstPhoto === 'object' && firstPhoto.url) {
          // Return full URL if it's already absolute, otherwise make it absolute
          const imageUrl = firstPhoto.url;
          if (imageUrl.startsWith('http')) {
            return imageUrl;
          }
          return `${window.location.origin}${imageUrl}`;
        }
      }
      // Return a default image with full URL
      return `${window.location.origin}/placeholder.svg`;
    };

    const imageUrl = getFirstImageUrl();

    // Update meta description
    updateOrCreateMetaTag('description', fullDescription);

    // Update Open Graph tags
    updateOpenGraphTags(title, fullDescription, imageUrl);

    // Update Twitter Card tags
    updateTwitterCardTags(title, fullDescription, imageUrl);

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Discover Tunisia';
    };
  }, [property]);

  const updateOrCreateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const updateOpenGraphTags = (title: string, description: string, imageUrl: string) => {
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'Samsari - Tunisia Safe Stays' },
    ];

    ogTags.forEach(({ property: prop, content }) => {
      let meta = document.querySelector(`meta[property="${prop}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', prop);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  const updateTwitterCardTags = (title: string, description: string, imageUrl: string) => {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:site', content: '@samsari_tunisia' },
    ];

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  // This component doesn't render anything visible
  return null;
};

export default PropertySharingMeta;
