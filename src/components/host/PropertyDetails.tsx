
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface BedroomDetail {
  type: string;
  beds: number;
}

interface PropertyDetailsProps {
  data: {
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    extraBeds: number;
    bedroomDetails: BedroomDetail[];
    sleeping_arrangements: any[];
  };
  onUpdate: (data: any) => void;
  errors?: Record<string, string>;
}

const BEDROOM_TYPES = [
  'Single', 'Double', 'Twin', 'Bunk', 'Sofa Bed'
];

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ data, onUpdate, errors }) => {
  const updateBedroomDetails = (index: number, updates: Partial<BedroomDetail>) => {
    const newBedroomDetails = [...data.bedroomDetails];
    newBedroomDetails[index] = { ...newBedroomDetails[index], ...updates };
    onUpdate({ bedroomDetails: newBedroomDetails });
  };

  const addSleepingArrangement = (arrangement: string) => {
    const newArrangements = data.sleeping_arrangements.includes(arrangement)
      ? data.sleeping_arrangements.filter(a => a !== arrangement)
      : [...data.sleeping_arrangements, arrangement];
    onUpdate({ sleeping_arrangements: newArrangements });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Number of Bedrooms</Label>
        <Input 
          type="number" 
          value={data.bedrooms}
          onChange={(e) => onUpdate({ bedrooms: parseInt(e.target.value) })}
          min={1}
          className={errors?.bedrooms ? 'border-red-500' : ''}
        />
        {errors?.bedrooms && (
          <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>
        )}
      </div>

      <div>
        <Label>Number of Bathrooms</Label>
        <Input 
          type="number" 
          value={data.bathrooms}
          onChange={(e) => onUpdate({ bathrooms: parseInt(e.target.value) })}
          min={1}
          className={errors?.bathrooms ? 'border-red-500' : ''}
        />
        {errors?.bathrooms && (
          <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>
        )}
      </div>

      <div>
        <Label>Bedroom Details</Label>
        {[...Array(data.bedrooms)].map((_, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <select 
              value={data.bedroomDetails[index]?.type || ''}
              onChange={(e) => updateBedroomDetails(index, { type: e.target.value })}
              className="border rounded p-2"
            >
              <option value="">Select Bed Type</option>
              {BEDROOM_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Input 
              type="number" 
              placeholder="Number of Beds"
              value={data.bedroomDetails[index]?.beds || 1}
              onChange={(e) => updateBedroomDetails(index, { beds: parseInt(e.target.value) })}
              min={1}
            />
          </div>
        ))}
      </div>

      <div>
        <Label>Sleeping Arrangements</Label>
        <div className="grid grid-cols-2 gap-4">
          {[
            'Suitable for Children', 
            'Infant-friendly', 
            'No Stairs', 
            'Wheelchair Accessible'
          ].map((arrangement) => (
            <div key={arrangement} className="flex items-center space-x-2">
              <Checkbox 
                id={arrangement}
                checked={data.sleeping_arrangements.includes(arrangement)}
                onCheckedChange={() => addSleepingArrangement(arrangement)}
              />
              <Label htmlFor={arrangement}>{arrangement}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Maximum Guests</Label>
        <Input 
          type="number" 
          value={data.maxGuests}
          onChange={(e) => onUpdate({ maxGuests: parseInt(e.target.value) })}
          min={1}
          className={errors?.maxGuests ? 'border-red-500' : ''}
        />
        {errors?.maxGuests && (
          <p className="text-sm text-red-500 mt-1">{errors.maxGuests}</p>
        )}
      </div>

      <div>
        <Label>Extra Beds Available</Label>
        <Input 
          type="number" 
          value={data.extraBeds}
          onChange={(e) => onUpdate({ extraBeds: parseInt(e.target.value) })}
          min={0}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
