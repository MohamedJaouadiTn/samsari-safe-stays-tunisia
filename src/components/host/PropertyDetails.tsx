
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const currentValue = data[field] || (field === 'maxGuests' ? 4 : 1);
    let newValue;
    
    if (field === 'maxGuests') {
      newValue = increment ? currentValue + 1 : Math.max(4, currentValue - 1);
    } else {
      newValue = increment ? currentValue + 1 : Math.max(1, currentValue - 1);
    }
    
    onUpdate({ [field]: newValue });
  };

  const updateBedroom = (index: number, field: string, value: any) => {
    const bedrooms = data.bedroomDetails || [];
    const updatedBedrooms = [...bedrooms];
    if (!updatedBedrooms[index]) {
      updatedBedrooms[index] = { bedType: 'queen', hasPrivateBathroom: false };
    }
    updatedBedrooms[index] = { ...updatedBedrooms[index], [field]: value };
    onUpdate({ bedroomDetails: updatedBedrooms });
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = data.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    onUpdate({ amenities: updatedAmenities });
  };

  const bedroomCount = data.bedrooms || 1;
  const bedroomDetails = data.bedroomDetails || [];

  return (
    <div className="space-y-6">
      {/* Maximum Guests */}
      <div>
        <Label>Maximum Guests (Minimum 4)</Label>
        <div className="flex items-center space-x-4 mt-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('maxGuests', false)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{data.maxGuests || 4}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('maxGuests', true)}
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
          <span className="text-lg font-medium">{bedroomCount}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('bedrooms', true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bedroom Details */}
      {bedroomCount > 0 && (
        <div>
          <Label>Bedroom Details</Label>
          <div className="space-y-3 mt-2">
            {Array.from({ length: bedroomCount }, (_, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">Bedroom {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bed Type</Label>
                    <Select 
                      value={bedroomDetails[index]?.bedType || 'queen'}
                      onValueChange={(value) => updateBedroom(index, 'bedType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Bed</SelectItem>
                        <SelectItem value="double">Double Bed</SelectItem>
                        <SelectItem value="queen">Queen Bed</SelectItem>
                        <SelectItem value="king">King Bed</SelectItem>
                        <SelectItem value="bunk">Bunk Bed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id={`private-bathroom-${index}`}
                      checked={bedroomDetails[index]?.hasPrivateBathroom || false}
                      onCheckedChange={(checked) => updateBedroom(index, 'hasPrivateBathroom', checked)}
                    />
                    <Label htmlFor={`private-bathroom-${index}`}>Private Bathroom</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Extra Beds */}
      <div>
        <Label>Extra Beds (Sofa beds, air mattresses, etc.)</Label>
        <div className="flex items-center space-x-4 mt-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('extraBeds', false)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{data.extraBeds || 0}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => updateCount('extraBeds', true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visitor Policy */}
      <div>
        <Label>Visitor Policy</Label>
        <div className="space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visitors-allowed"
              checked={data.visitorsAllowed || false}
              onCheckedChange={(checked) => onUpdate({ visitorsAllowed: checked })}
            />
            <Label htmlFor="visitors-allowed">Allow visitors</Label>
          </div>
          
          {data.visitorsAllowed && (
            <div className="ml-6 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overnight-visitors"
                  checked={data.overnightVisitors || false}
                  onCheckedChange={(checked) => onUpdate({ overnightVisitors: checked })}
                />
                <Label htmlFor="overnight-visitors">Allow overnight visitors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="daytime-visitors"
                  checked={data.daytimeVisitors !== false}
                  onCheckedChange={(checked) => onUpdate({ daytimeVisitors: checked })}
                />
                <Label htmlFor="daytime-visitors">Allow daytime visitors only</Label>
              </div>
            </div>
          )}
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
