
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchableSelect from "@/components/SearchableSelect";

interface PropertyBasicsProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PropertyBasics = ({ data, onUpdate }: PropertyBasicsProps) => {
  const propertyTypes = [
    "Apartment", "House", "Villa", "Studio", "Loft", "Penthouse"
  ];

  const tunisianGovernorates = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
    "Bizerte", "Beja", "Jendouba", "Kef (El Kef)", "Siliana", "Sousse",
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
    "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select value={data.propertyType} onValueChange={(value) => onUpdate({ propertyType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title">Property Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., Beautiful apartment in Tunis center"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe your property..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          placeholder="Full address"
        />
      </div>

      <div>
        <Label>City/Governorate</Label>
        <SearchableSelect
          value={data.city}
          onValueChange={(value) => onUpdate({ city: value })}
          options={tunisianGovernorates}
          placeholder="Select governorate"
          searchPlaceholder="Search governorates..."
          emptyMessage="No governorate found."
        />
      </div>
    </div>
  );
};

export default PropertyBasics;
