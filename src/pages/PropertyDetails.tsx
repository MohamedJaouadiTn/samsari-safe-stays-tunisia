import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Bed, Bath, ArrowLeft, Share2, CheckCircle, Wifi, Car, Coffee, Tv, AirVent, Waves, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyImageGallery from "@/components/property/PropertyImageGallery";
import PropertyReviews from "@/components/property/PropertyReviews";
import PropertyBookingCard from "@/components/property/PropertyBookingCard";

type Property = Tables<"properties">;

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Update page title and meta tags when property loads
  useEffect(() => {
    if (property) {
      updateSEOTags();
    }
  }, [property]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("is_public", true)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error",
          description: "Property not found",
          variant: "destructive"
        });
        navigate("/search");
        return;
      }

      setProperty(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load property",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSEOTags = () => {
    if (!property) return;

    const title = `${property.title} - ${property.price_per_night} TND per night`;
    const description = `${property.max_guests} guests max • ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''} • ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''} in ${property.city}, ${property.governorate}`;
    const amenitiesText = Array.isArray(property.amenities) ? property.amenities.slice(0, 3).join(', ') : '';
    const fullDescription = `${description}${amenitiesText ? ` • ${amenitiesText}` : ''}`;

    // Update page title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', fullDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = fullDescription;
      document.head.appendChild(meta);
    }

    // Update Open Graph tags for social sharing
    updateOpenGraphTags(title, fullDescription);
  };

  const updateOpenGraphTags = (title: string, description: string) => {
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:card', content: 'summary_large_image' }
    ];

    // Add property image if available
    if (property?.photos && Array.isArray(property.photos) && property.photos.length > 0) {
      // Fix: Type check and safely access the url property
      const photoObj = property.photos[0] as any;
      const firstImage = photoObj && typeof photoObj === 'object' && photoObj.url ? photoObj.url : "/placeholder.svg";
      
      ogTags.push(
        { property: 'og:image', content: firstImage },
        { property: 'twitter:image', content: firstImage }
      );
    }

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  const getPropertyImages = (photos: any) => {
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return ["/placeholder.svg"];
    }
    // Fix: Type check and safely access the url property
    return photos.map((photo: any) => {
      return (photo && typeof photo === 'object' && photo.url) ? photo.url : "/placeholder.svg";
    });
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'kitchen': return <Coffee className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'air conditioning': return <AirVent className="h-4 w-4" />;
      case 'pool': return <Waves className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || "Property",
        text: `Check out this property: ${property?.title} - ${property?.price_per_night} TND per night`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Property link copied to clipboard"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Property not found</p>
            <Button onClick={() => navigate("/search")} className="mt-4">
              Back to Search
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = getPropertyImages(property.photos);
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={shareProperty}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <MapPin className="h-4 w-4" />
            <span>{property.city}, {property.governorate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <PropertyImageGallery images={images} title={property.title} />

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Hosted by Verified User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                <Badge variant="outline">{property.property_type}</Badge>
                
                <p className="text-muted-foreground">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <PropertyReviews propertyId={property.id} />
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <PropertyBookingCard property={property} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
