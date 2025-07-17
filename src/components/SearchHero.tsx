
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "./SearchableSelect";

const SearchHero = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const tunisianLocations = [
    // Governorates
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", 
    "Béja", "Jendouba", "Le Kef", "Siliana", "Kairouan", "Kasserine", "Sidi Bouzid", 
    "Sousse", "Monastir", "Mahdia", "Sfax", "Gafsa", "Tozeur", "Kebili", "Gabès", 
    "Medenine", "Tataouine",
    
    // Major cities and towns
    "Tunis City", "La Marsa", "Carthage", "Sidi Bou Said", "Hammamet", "Nabeul City", 
    "Sousse City", "Monastir City", "Mahdia City", "Sfax City", "Kairouan City", 
    "Bizerte City", "Tabarka", "Ain Draham", "Djerba", "Houmt Souk", "Midoun", 
    "Zarzis", "Gabès City", "Gafsa City", "Tozeur City", "Douz", "Tataouine City", 
    "Kasserine City", "Sidi Bouzid City", "Le Kef City", "Béja City", "Jendouba City", 
    "Siliana City", "Zaghouan City", "Grombalia", "Kelibia", "Korba", "Menzel Bourguiba", 
    "Mateur", "Akouda", "Kalaa Kebira", "Kalaa Seghira", "Msaken", "Bekalta", 
    "Jemmal", "Moknine", "Ksour Essef", "El Jem", "Chebba", "Agareb", "Bir Ali Ben Khalifa", 
    "Sakiet Ezzit", "Matmata", "El Hamma", "Mareth", "Métlaoui", "Moularès", "Redeyef", 
    "Nefta", "Degache", "Souk Lahad", "Jemna", "Ben Gardane", "Ajim", "Remada", 
    "Ghomrassen", "Dehiba"
  ];

  const handleSearch = () => {
    // Build search params with consistent naming
    const params = new URLSearchParams();
    if (searchLocation.trim()) {
      // Use city parameter name for consistency with search results page
      params.set("city", searchLocation.trim());
      // Also set location for backward compatibility
      params.set("location", searchLocation.trim());
    }
    if (checkIn) {
      params.set("checkIn", checkIn);
    }
    if (checkOut) {
      params.set("checkOut", checkOut);
    }
    if (guests) {
      params.set("guests", guests.toString());
    }

    // Navigate to search results page
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Find Your Perfect Stay in Tunisia
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover unique accommodations across Tunisia, from the medinas of Tunis to the beaches of Djerba
          </p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Where to?
                </label>
                <SearchableSelect
                  value={searchLocation}
                  onValueChange={setSearchLocation}
                  options={tunisianLocations}
                  placeholder="Select location"
                  searchPlaceholder="Search cities, towns, or regions..."
                  emptyMessage="No location found."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Check-in
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Check-out
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Guests
                </label>
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  min="1"
                  max="16"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSearch}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SearchHero;
