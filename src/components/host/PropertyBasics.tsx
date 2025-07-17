
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchableSelect from "@/components/SearchableSelect";
import LocationPicker from "./LocationPicker";

interface PropertyBasicsProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PropertyBasics = ({ data, onUpdate }: PropertyBasicsProps) => {
  const propertyTypes = [
    "Apartment", "House", "Villa", "Studio", "Loft", "Penthouse"
  ];

  const tunisianCitiesAndTowns = [
    // Tunis Governorate
    "Tunis", "La Marsa", "Carthage", "El Menzah", "Le Bardo", "El Omrane", "Sidi Hassine",
    
    // Ariana
    "Ariana Ville", "La Soukra", "Raoued", "Kalaat El Andalous", "Ettadhamen", "Mnihla",
    
    // Ben Arous
    "Ben Arous Ville", "Hammam Lif", "Ezzahra", "Rades", "Mohamedia", "Mornag", "El Mourouj",
    
    // Manouba
    "Manouba Ville", "Oued Ellil", "Douar Hicher", "Tebourba", "Mornaguia", "Borj El Amri",
    
    // Nabeul
    "Nabeul Ville", "Hammamet", "Dar Chaabane", "Korba", "Kelibia", "Soliman", "Menzel Temime", "Grombalia",
    
    // Bizerte
    "Bizerte Ville", "Menzel Bourguiba", "Mateur", "Ras Jebel", "Tinja", "Sejnane",
    
    // Zaghouan
    "Zaghouan Ville", "El Fahs", "Bir Mcherga", "Nadhour", "Saouaf",
    
    // Béja
    "Béja Ville", "Medjez El Bab", "Testour", "Goubellat", "Nefza",
    
    // Jendouba
    "Jendouba Ville", "Ain Draham", "Ghardimaou", "Tabarka", "Bou Salem", "Fernana",
    
    // Le Kef
    "Le Kef Ville", "Dahmani", "Tajerouine", "Nebeur", "Kalaat Senan",
    
    // Siliana
    "Siliana Ville", "Gaafour", "Kesra", "El Krib", "Makthar", "Bou Arada",
    
    // Kairouan
    "Kairouan Ville", "Haffouz", "Nasrallah", "Chebika", "Sbikha", "Bou Hajla",
    
    // Kasserine
    "Kasserine Ville", "Sbeitla", "Thala", "Fériana", "Jedliane", "Hassi El Frid",
    
    // Sidi Bouzid
    "Sidi Bouzid Ville", "Regueb", "Menzel Bouzaiane", "Bir El Hafey", "Jelma", "Mezzouna",
    
    // Gafsa
    "Gafsa Ville", "Métlaoui", "Moularès", "El Ksar", "Redeyef", "Oum Larayes",
    
    // Tozeur
    "Tozeur Ville", "Nefta", "Degache", "Tameghza",
    
    // Kebili
    "Kebili Ville", "Douz", "Souk Lahad", "Jemna", "El Golâa",
    
    // Medenine
    "Medenine Ville", "Zarzis", "Ben Gardane", "Djerba Houmt Souk", "Djerba Midoun", "Ajim",
    
    // Tataouine
    "Tataouine Ville", "Remada", "Ghomrassen", "Bir Lahmar", "Dehiba",
    
    // Gabès
    "Gabès Ville", "Matmata", "El Hamma", "Mareth", "Ghannouch", "Métouia",
    
    // Sfax
    "Sfax Ville", "Sakiet Ezzit", "Mahres", "El Amra", "Bir Ali Ben Khalifa", "Agareb", "Kerkennah Islands",
    
    // Mahdia
    "Mahdia Ville", "Ksour Essef", "El Jem", "Melloulech", "Bou Merdes", "Chebba",
    
    // Monastir
    "Monastir Ville", "Moknine", "Sayada", "Ksibet El Mediouni", "Bekalta", "Jemmal",
    
    // Sousse
    "Sousse Ville", "Kalaa Kebira", "Kalaa Seghira", "Msaken", "Akouda", "Hammam Sousse", "Enfidha"
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
        <Label>City/Town</Label>
        <SearchableSelect
          value={data.city}
          onValueChange={(value) => onUpdate({ city: value })}
          options={tunisianCitiesAndTowns}
          placeholder="Select city or town"
          searchPlaceholder="Search cities and towns..."
          emptyMessage="No city found."
        />
      </div>

      <LocationPicker data={data} onUpdate={onUpdate} />
    </div>
  );
};

export default PropertyBasics;
