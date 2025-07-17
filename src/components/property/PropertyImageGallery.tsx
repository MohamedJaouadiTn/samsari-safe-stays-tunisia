
import { useState } from "react";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Handle empty or invalid images array
  const validImages = images && Array.isArray(images) && images.length > 0 
    ? images 
    : ["/placeholder.svg"];

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={validImages[selectedImageIndex]}
          alt={title}
          className="w-full h-96 object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
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
              src={image}
              alt={`${title} ${index + 1}`}
              className={`w-20 h-20 object-cover rounded cursor-pointer flex-shrink-0 ${
                index === selectedImageIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedImageIndex(index)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;
