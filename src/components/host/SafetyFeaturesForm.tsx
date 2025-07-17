
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SAFETY_FEATURES = [
  { id: 'smoke_detector', label: 'Smoke Detector' },
  { id: 'carbon_monoxide_detector', label: 'Carbon Monoxide Detector' },
  { id: 'first_aid_kit', label: 'First Aid Kit' },
  { id: 'fire_extinguisher', label: 'Fire Extinguisher' },
  { id: 'emergency_exit_plan', label: 'Emergency Exit Plan' },
];

interface SafetyFeaturesFormProps {
  data: string[];
  onUpdate: (features: string[]) => void;
}

const SafetyFeaturesForm: React.FC<SafetyFeaturesFormProps> = ({ data, onUpdate }) => {
  const handleToggle = (feature: string) => {
    const newFeatures = data.includes(feature)
      ? data.filter(f => f !== feature)
      : [...data, feature];
    onUpdate(newFeatures);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Safety Features</h3>
      <div className="grid grid-cols-2 gap-4">
        {SAFETY_FEATURES.map((feature) => (
          <div key={feature.id} className="flex items-center space-x-2">
            <Checkbox 
              id={feature.id}
              checked={data.includes(feature.id)}
              onCheckedChange={() => handleToggle(feature.id)}
            />
            <Label htmlFor={feature.id}>{feature.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyFeaturesForm;
