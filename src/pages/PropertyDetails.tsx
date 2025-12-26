import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Users, Bed, Bath, ArrowLeft, Share2, 
  CheckCircle, Wifi, Car, Coffee, Tv, AirVent, Waves, Shield,
  AlarmSmoke, FireExtinguisher, Heart, Loader2, Pencil
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyImageGallery from "@/components/property/PropertyImageGallery";
import PropertyReviews from "@/components/property/PropertyReviews";
import PropertyBookingCard from "@/components/property/PropertyBookingCard";
import PropertySharingMeta from "@/components/property/PropertySharingMeta";
import AdminPropertyEditor from "@/components/admin/AdminPropertyEditor";
import { usePropertyTranslation } from "@/hooks/usePropertyTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

type Property = Tables<"properties">;

const ADMIN_EMAIL = "samsari.app@gmail.com";

const PropertyDetails = () => {
  const { id, shortCode } = useParams<{ id?: string; shortCode?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [propertyStatus, setPropertyStatus] = useState<string>("Loading...");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { translatedContent, isTranslating } = usePropertyTranslation(property);
  const { language } = useLanguage();
  
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (id || shortCode) {
      fetchProperty();
    }
  }, [id, shortCode]);

  useEffect(() => {
    if (property) {
      checkPropertyStatus();
    }
  }, [property]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_public", true)
        .eq("status", "published");
      
      // Query by short_code or id
      if (shortCode) {
        query = query.eq("short_code", shortCode);
      } else if (id) {
        query = query.eq("id", id);
      }
      
      const { data, error } = await query.single();

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

  const checkPropertyStatus = async () => {
    if (!property) return;
    
    try {
      // Check for active or upcoming bookings
      const { data, error } = await supabase
        .from("bookings")
        .select("id, property_id, check_in_date, check_out_date, status")
        .eq("property_id", property.id)
        .gte("check_out_date", new Date().toISOString().split('T')[0]);

      if (error) {
        console.error("Error checking bookings:", error);
        setPropertyStatus("Available");
        return;
      }

      if (!data || data.length === 0) {
        setPropertyStatus("Available");
        return;
      }
      
      // Check if there's a current booking (check-in date <= today <= check-out date)
      const today = new Date().toISOString().split('T')[0];
      const currentBooking = data.find(booking => 
        booking.check_in_date <= today && booking.check_out_date >= today
      );
      
      if (currentBooking) {
        setPropertyStatus("Occupied");
        return;
      }
      
      setPropertyStatus("Reserved");
    } catch (error) {
      console.error("Error checking property status:", error);
      setPropertyStatus("Available");
    }
  };

  const shareProperty = async () => {
    if (!property) return;
    
    // Use edge function URL for sharing - serves proper OG tags to social media crawlers
    // Real users get instant JavaScript redirect to the clean app URL
    const identifier = property.short_code || property.id;
    const queryParam = property.short_code ? `code=${identifier}` : `id=${identifier}`;
    const shareUrl = `https://gigzciepwjrwbljdnixh.supabase.co/functions/v1/og-image?${queryParam}&siteUrl=${encodeURIComponent(window.location.origin)}`;
    
    const shareTitle = `${property.title} - ${property.price_per_night} TND per night`;
    const shareText = `Check out this beautiful ${property.property_type} in ${property.city}, ${property.governorate}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          });
          
          toast({
            title: "Shared successfully",
            description: "Property shared with others"
          });
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            toast({
              title: "Link Copied",
              description: "Property link copied to clipboard"
            });
          }
        }
      } else {
        toast({
          title: "Link Copied",
          description: "Property link copied to clipboard"
        });
      }
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: "Could not share the property",
        variant: "destructive"
      });
    }
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

  // Get safety features with icons
  const getSafetyFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'smoke_detector': return <AlarmSmoke className="h-4 w-4" />;
      case 'carbon_monoxide_detector': return <AlarmSmoke className="h-4 w-4" />;
      case 'first_aid_kit': return <Heart className="h-4 w-4" />;
      case 'fire_extinguisher': return <FireExtinguisher className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
  const safetyFeatures = Array.isArray(property.safety_features) ? property.safety_features : [];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Property sharing metadata */}
      {property && <PropertySharingMeta property={property} />}
      
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {translatedContent?.title || property.title}
              </h1>
              {isTranslating && (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(propertyStatus)}>
                {propertyStatus}
              </Badge>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
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
                
                <p className="text-muted-foreground">{translatedContent?.description || property.description}</p>

                {/* Display minimum stay */}
                {property.minimum_stay && property.minimum_stay > 1 && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="font-medium">Minimum stay: {property.minimum_stay} nights</p>
                  </div>
                )}

                {/* Check-in/out times */}
                {(property.check_in_time || property.check_out_time) && (
                  <div className="flex flex-wrap gap-6 text-sm">
                    {property.check_in_time && (
                      <div>
                        <p className="font-medium">Check-in time</p>
                        <p className="text-muted-foreground">{property.check_in_time}</p>
                      </div>
                    )}
                    {property.check_out_time && (
                      <div>
                        <p className="font-medium">Check-out time</p>
                        <p className="text-muted-foreground">{property.check_out_time}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sleeping Arrangements */}
            {property.bed_types && Array.isArray(property.bed_types) && property.bed_types.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sleeping Arrangements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {property.bed_types.map((bedConfig: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="font-medium">Bedroom {index + 1}</span>
                        </div>
                        <p className="text-sm">
                          {bedConfig.beds} {bedConfig.type} bed{bedConfig.beds !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ))}
                    
                    {property.extra_beds > 0 && (
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="font-medium">Extra beds</span>
                        </div>
                        <p className="text-sm">
                          {property.extra_beds} extra bed{property.extra_beds !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safety Features */}
            {safetyFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Safety Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {safetyFeatures.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {getSafetyFeatureIcon(feature)}
                        <span className="text-sm">
                          {feature.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* House Rules */}
            {(property.house_rules || translatedContent?.house_rules) && (
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{translatedContent?.house_rules || property.house_rules}</p>
                </CardContent>
              </Card>
            )}

            {/* Cancellation Policy */}
            {property.cancellation_policy && (
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-2">{property.cancellation_policy}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {property.cancellation_policy === 'Flexible' && 
                      'Full refund if cancelled at least 24 hours before check-in. Partial refund thereafter.'}
                    {property.cancellation_policy === 'Moderate' && 
                      'Full refund if cancelled 5 days before check-in. Partial refund thereafter.'}
                    {property.cancellation_policy === 'Strict' && 
                      'Full refund if cancelled 14 days before check-in. No refund thereafter.'}
                    {property.cancellation_policy === 'Super Strict' && 
                      'No refunds for cancellations. We recommend travel insurance for this property.'}
                  </p>
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
      
      {/* Admin Property Editor Dialog */}
      {isAdmin && property && (
        <AdminPropertyEditor
          property={property}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onPropertyUpdated={fetchProperty}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
