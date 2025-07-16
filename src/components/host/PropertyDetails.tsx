
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";

interface PropertyDetailsProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PropertyDetails = ({ data, onUpdate }: PropertyDetailsProps) => {
  const amenities = [
    "WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "Heating",
    "TV", "Parking", "Pool", "Gym", "Balcony", "Garden", "Pets Allowed"
  ];

  const updateCount = (field: string, increment: boolean) => {
    const currentValue = data[field] || 1;
    const newValue = increment ? currentValue + 1 : Math.max(1, currentValue - 1);
    onUpdate({ [field]: newValue });
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = data.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    onUpdate({ amenities: updatedAmenities });
  };

  return (
    <div className="space-y-6">
      {/* Guest Capacity */}
      <div>
        <Label>Maximum Guests</Label>
        <div className="flex items-center space-x-4 mt-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('guests', false)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{data.guests || 1}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('guests', true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <Label>Bedrooms</Label>
        <div className="flex items-center space-x-4 mt-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('bedrooms', false)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{data.bedrooms || 1}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('bedrooms', true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <Label>Bathrooms</Label>
        <div className="flex items-center space-x-4 mt-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('bathrooms', false)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{data.bathrooms || 1}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('bathrooms', true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={(data.amenities || []).includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
