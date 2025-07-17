
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Users, Moon, Bed, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PropertyDetailsProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PropertyDetails = ({ data, onUpdate }: PropertyDetailsProps) => {
  const [customAmenity, setCustomAmenity] = useState("");

  const commonAmenities = [
    "WiFi", "Air Conditioning", "Parking", "Kitchen", "Washing Machine", 
    "TV", "Balcony", "Garden", "Pool", "Gym", "Elevator", "Security",
    "Beach Access", "Mountain View", "City View", "Heating", "Fireplace"
  ];

  const bedTypes = [
    "Single Bed", "Double Bed", "Queen Bed", "King Bed", "Sofa Bed", "Bunk Bed"
  ];

  const handleNumberChange = (field: string, value: number) => {
    onUpdate({ [field]: Math.max(0, value) });
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = data.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    onUpdate({ amenities: updatedAmenities });
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim()) {
      const currentAmenities = data.amenities || [];
      onUpdate({ amenities: [...currentAmenities, customAmenity.trim()] });
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    const currentAmenities = data.amenities || [];
    onUpdate({ amenities: currentAmenities.filter((a: string) => a !== amenity) });
  };

  const handleBedTypeChange = (roomIndex: number, bedType: string) => {
    const currentBedTypes = data.bed_types || [];
    const updatedBedTypes = [...currentBedTypes];
    updatedBedTypes[roomIndex] = bedType;
    onUpdate({ bed_types: updatedBedTypes });
  };

  const renderBedTypeSelectors = () => {
    const bedrooms = data.bedrooms || 1;
    const bedTypeSelectors = [];
    
    for (let i = 0; i < bedrooms; i++) {
      bedTypeSelectors.push(
        <div key={i} className="space-y-2">
          <Label>Bedroom {i + 1} Bed Type</Label>
          <Select 
            value={data.bed_types?.[i] || ""} 
            onValueChange={(value) => handleBedTypeChange(i, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bed type" />
            </SelectTrigger>
            <SelectContent>
              {bedTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    return bedTypeSelectors;
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Property Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Describe your property</Label>
              <Textarea
                id="description"
                value={data.description || ""}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Example: Spacious apartment on the 3rd floor with stunning beach view. Features modern amenities and comfortable living spaces perfect for families..."
                rows={4}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                💡 Focus on the ambiance, location highlights, and what makes your property special. 
                Don't worry about bed/bathroom counts - you'll specify those next.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Capacity & Accommodation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Maximum Visitors</Label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('max_guests', (data.max_guests || 1) - 1)}
                  disabled={data.max_guests <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{data.max_guests || 1}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('max_guests', (data.max_guests || 1) + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Allow Sleepovers
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.allow_sleepovers || false}
                  onCheckedChange={(checked) => onUpdate({ allow_sleepovers: checked })}
                />
                <span className="text-sm text-muted-foreground">
                  {data.allow_sleepovers ? "Guests can stay overnight" : "Day visits only"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('bedrooms', (data.bedrooms || 1) - 1)}
                  disabled={data.bedrooms <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{data.bedrooms || 1}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('bedrooms', (data.bedrooms || 1) + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('bathrooms', (data.bathrooms || 1) - 1)}
                  disabled={data.bathrooms <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{data.bathrooms || 1}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('bathrooms', (data.bathrooms || 1) + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Extra Beds</Label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('extra_beds', (data.extra_beds || 0) - 1)}
                  disabled={data.extra_beds <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{data.extra_beds || 0}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('extra_beds', (data.extra_beds || 0) + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bed Types */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Bed Types per Room
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderBedTypeSelectors()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={amenity}
                    checked={data.amenities?.includes(amenity) || false}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={amenity} className="text-sm cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Add custom amenity"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()}
              />
              <Button type="button" onClick={addCustomAmenity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.amenities && data.amenities.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Amenities:</Label>
                <div className="flex flex-wrap gap-2">
                  {data.amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetails;
