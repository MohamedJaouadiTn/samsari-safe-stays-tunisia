
import { useState } from "react";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Handle empty or invalid images array
  const validImages = images && Array.isArray(images) && images.length > 0 
    ? images 
    : ["/placeholder.svg"];

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
  };

  const getImageUrl = (imageUrl: string, index: number) => {
    if (imageErrors.has(index)) {
      return "/placeholder.svg";
    }

    // If it's already a full URL, return it
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // For Supabase storage URLs that start with /storage/
    if (imageUrl.startsWith('/storage/')) {
      return `https://gigzciepwjrwbljdnixh.supabase.co${imageUrl}`;
    }

    // For other relative URLs
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }

    // Default fallback
    return "/placeholder.svg";
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={getImageUrl(validImages[selectedImageIndex], selectedImageIndex)}
          alt={title}
          className="w-full h-96 object-cover rounded-lg"
          onError={() => handleImageError(selectedImageIndex)}
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {selectedImageIndex + 1} / {validImages.length}
        </div>
      </div>
      
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {validImages.map((image, index) => (
            <img
              key={index}
              src={getImageUrl(image, index)}
              alt={`${title} ${index + 1}`}
              className={`w-20 h-20 object-cover rounded cursor-pointer flex-shrink-0 ${
                index === selectedImageIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedImageIndex(index)}
              onError={() => handleImageError(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;
