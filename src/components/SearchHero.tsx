
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tunisianCities, getCitiesByGovernorate, getAllGovernorates } from "./TunisianCities";
import { useLanguage } from "@/contexts/LanguageContext";

const SearchHero = () => {
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Update cities when governorate changes
  useEffect(() => {
    if (selectedGovernorate) {
      const cities = getCitiesByGovernorate(selectedGovernorate);
      setAvailableCities(cities);
      setSelectedCity(""); // Reset city when governorate changes
    } else {
      setAvailableCities([]);
      setSelectedCity("");
    }
  }, [selectedGovernorate]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedGovernorate) {
      params.set("governorate", selectedGovernorate);
    }
    if (selectedCity) {
      params.set("city", selectedCity);
      params.set("location", selectedCity);
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

    navigate(`/search?${params.toString()}`);
  };

  const governorates = getAllGovernorates();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 py-16 md:py-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-scale-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t('hero.trust_500_hosts')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            {t('hero.title')}{' '}
            <span className="text-primary relative">
              {t('hero.subtitle')}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="animate-scale-in" style={{ animationDelay: '0.5s' }} />
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('hero.description')}
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-5xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Governorate Select */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Governorate
                </label>
                <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select governorate" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {governorates.map((gov) => (
                      <SelectItem key={gov} value={gov}>
                        {gov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* City Select */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  City/Town
                </label>
                <Select 
                  value={selectedCity} 
                  onValueChange={setSelectedCity}
                  disabled={!selectedGovernorate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedGovernorate ? "Select city" : "Select governorate first"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('search.checkin')}
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('search.checkout')}
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('booking.guests')}
                </label>
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  min="1"
                  max="16"
                  className="bg-background"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSearch}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {t('search.search')}
            </Button>
          </CardContent>
        </Card>

        {/* Browse All Properties - Separate Card */}
        <div className="max-w-5xl mx-auto mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Card className="bg-muted/50 border-dashed border-2 border-muted-foreground/20 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground mb-3">Instead, browse all properties</p>
              <Button 
                onClick={() => navigate('/search')}
                variant="outline"
                size="lg"
                className="group transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                Browse All Properties
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-trust rounded-full animate-pulse" />
            {t('hero.trust_secure_payment')}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            {t('hero.trust_insurance')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
