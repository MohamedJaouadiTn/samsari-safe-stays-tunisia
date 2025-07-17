
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Bed, Bath, Star, Filter, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tunisianCities } from "@/components/TunisianCities";

type Property = Tables<"properties">;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search filters
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    governorate: searchParams.get("governorate") || "",
    guests: parseInt(searchParams.get("guests") || "1"),
    priceRange: [0, 1000],
    propertyType: "",
    bedrooms: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_public", true)
        .eq("status", "published");

      // Apply filters
      const city = searchParams.get("city");
      const governorate = searchParams.get("governorate");
      const guests = searchParams.get("guests");

      if (city) {
        query = query.ilike("city", `%${city}%`);
      }
      if (governorate) {
        query = query.eq("governorate", governorate);
      }
      if (guests) {
        query = query.gte("max_guests", parseInt(guests));
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to fetch properties",
          variant: "destructive"
        });
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching properties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.guests > 1) params.set("guests", filters.guests.toString());
    
    setSearchParams(params);
    setShowFilters(false);
  };

  const getPropertyImage = (photos: any) => {
    if (!photos || !Array.isArray(photos) || photos.length === 0) return "/placeholder.svg";
    const exteriorPhoto = photos.find((p: any) => p.type === 'exterior');
    return exteriorPhoto?.url || photos[0]?.url || "/placeholder.svg";
  };

  const getPropertyStatus = (property: Property) => {
    // This would typically check booking status from a bookings table
    // For now, we'll simulate some statuses
    const statuses = ['Available', 'Reserved', 'Occupied'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      case 'Occupied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filters.priceRange[0] > 0 && property.price_per_night < filters.priceRange[0]) return false;
    if (filters.priceRange[1] < 1000 && property.price_per_night > filters.priceRange[1]) return false;
    if (filters.propertyType && property.property_type !== filters.propertyType) return false;
    if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Searching for properties...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>City</Label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {tunisianCities.flatMap(gov => 
                        gov.cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Governorate</Label>
                  <Select value={filters.governorate} onValueChange={(value) => setFilters({...filters, governorate: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select governorate" />
                    </SelectTrigger>
                    <SelectContent>
                      {tunisianCities.map(gov => (
                        <SelectItem key={gov.governorate} value={gov.governorate}>{gov.governorate}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    value={filters.guests}
                    onChange={(e) => setFilters({...filters, guests: parseInt(e.target.value) || 1})}
                  />
                </div>

                <div>
                  <Label>Price Range (TND)</Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({...filters, priceRange: value})}
                    max={1000}
                    step={10}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{filters.priceRange[0]} TND</span>
                    <span>{filters.priceRange[1]} TND</span>
                  </div>
                </div>

                <div>
                  <Label>Property Type</Label>
                  <Select value={filters.propertyType} onValueChange={(value) => setFilters({...filters, propertyType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Bedrooms</Label>
                  <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={applyFilters} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {filteredProperties.length} Properties Found
                {searchParams.get("city") && ` in ${searchParams.get("city")}`}
              </h1>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {filteredProperties.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No properties found matching your criteria.</p>
                  <Button variant="outline" onClick={() => setSearchParams({})} className="mt-4">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <img
                          src={getPropertyImage(property.photos)}
                          alt={property.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getStatusColor(getPropertyStatus(property))}>
                            {getPropertyStatus(property)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{property.title}</h3>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {property.price_per_night} TND
                            </p>
                            <p className="text-sm text-muted-foreground">per night</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{property.city}, {property.governorate}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {property.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{property.max_guests} guests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms} bedrooms</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms} bathrooms</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{property.property_type}</Badge>
                            {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 && (
                              <Badge variant="outline">
                                +{property.amenities.length} amenities
                              </Badge>
                            )}
                          </div>
                          <Button>View Details</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
