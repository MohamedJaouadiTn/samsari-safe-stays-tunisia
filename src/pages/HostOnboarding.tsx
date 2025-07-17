import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PropertyBasics from "@/components/host/PropertyBasics";
import PropertyDetails from "@/components/host/PropertyDetails";
import PropertyPhotos from "@/components/host/PropertyPhotos";
import PropertyPricing from "@/components/host/PropertyPricing";
import PropertyReview from "@/components/host/PropertyReview";
import SafetyFeaturesForm from "@/components/host/SafetyFeaturesForm";

const HostOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    propertyType: "",
    title: "",
    description: "",
    governorate: "",
    city: "",
    address: "",
    latitude: null,
    longitude: null,
    google_maps_url: "",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 4,
    extraBeds: 0,
    bedroomDetails: [],
    visitorsAllowed: false,
    overnightVisitors: false,
    daytimeVisitors: true,
    amenities: [],
    photos: [],
    price_per_night: 0,
    currency: "TND",
    isPublic: true,
    bookingEnabled: true,
    safety_features: [],
    sleeping_arrangements: [],
    minimum_stay: 1,
    house_rules: "",
    check_in_time: "",
    check_out_time: "",
    cancellation_policy: "Moderate"
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Property Basics", component: PropertyBasics },
    { number: 2, title: "Property Details", component: PropertyDetails },
    { number: 3, title: "Photos", component: PropertyPhotos },
    { number: 4, title: "Pricing", component: PropertyPricing },
    { number: 5, title: "Review", component: PropertyReview },
    { 
      number: 6, 
      title: "Safety Features", 
      component: SafetyFeaturesForm 
    }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Property Basics
        if (!formData.propertyType) {
          newErrors.propertyType = "Please select a property type";
        }
        if (!formData.title?.trim()) {
          newErrors.title = "Please enter a property title";
        }
        if (!formData.governorate) {
          newErrors.governorate = "Please select a governorate";
        }
        if (!formData.city) {
          newErrors.city = "Please select a city";
        }
        break;
        
      case 2: // Property Details
        if (!formData.maxGuests || formData.maxGuests < 1) {
          newErrors.maxGuests = "Maximum guests must be at least 1";
        }
        break;
        
      case 3: // Photos
        const requiredPhotoTypes = ['exterior', 'kitchen', 'bathroom', 'living_room'];
        const hasAllRequired = requiredPhotoTypes.every(type => 
          formData.photos.some((photo: any) => photo.type === type)
        );
        
        const uniqueBedroomTypes = new Set(
          formData.photos.filter((photo: any) => photo.type?.startsWith('bedroom_')).map((p: any) => p.type)
        );
        const hasBedroomPhotos = formData.bedrooms <= uniqueBedroomTypes.size;
        
        if (!hasAllRequired) {
          newErrors.photos = "Please upload photos for exterior, kitchen, bathroom, and living room";
        }
        if (!hasBedroomPhotos) {
          newErrors.photos = (newErrors.photos || "") + " Please upload photos for all bedrooms";
        }
        break;
        
      case 4: // Pricing
        if (!formData.price_per_night || formData.price_per_night <= 0) {
          newErrors.price_per_night = "Please enter a valid price per night";
        }
        break;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields highlighted in red",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    setErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataUpdate = (newData: any) => {
    setFormData({ ...formData, ...newData });
    // Clear related errors when user updates data
    const updatedErrors = { ...errors };
    Object.keys(newData).forEach(key => {
      if (updatedErrors[key]) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };

  const publishListing = async () => {
    if (!validateCurrentStep() || !user) return;
    
    setLoading(true);
    
    try {
      const propertyData = {
        host_id: user.id,
        title: formData.title,
        description: formData.description,
        property_type: formData.propertyType,
        governorate: formData.governorate,
        city: formData.city,
        address: formData.address,
        coordinates: formData.latitude && formData.longitude ? 
          { lat: formData.latitude, lng: formData.longitude } : null,
        google_maps_url: formData.google_maps_url || null,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        max_guests: formData.maxGuests,
        extra_beds: formData.extraBeds,
        bed_types: formData.bedroomDetails || [],
        visitor_policy: formData.visitorsAllowed ? 
          (formData.overnightVisitors ? 'overnight_allowed' : 'morning_only') : 'no_visitors',
        amenities: formData.amenities,
        photos: formData.photos,
        price_per_night: formData.price_per_night,
        is_public: formData.isPublic,
        booking_enabled: formData.bookingEnabled,
        status: 'published',
        safety_features: formData.safety_features,
        sleeping_arrangements: formData.sleeping_arrangements,
        minimum_stay: formData.minimum_stay,
        house_rules: formData.house_rules,
        check_in_time: formData.check_in_time,
        check_out_time: formData.check_out_time,
        cancellation_policy: formData.cancellation_policy
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/property/${data.id}`;
      
      toast({
        title: "Listing Published!",
        description: `Your property is now live and searchable. Share URL: ${shareUrl}`,
      });
      
      // Navigate to profile after success
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
      
    } catch (error) {
      console.error('Publishing error:', error);
      toast({
        title: "Error",
        description: "Failed to publish listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Create Your Listing</h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{currentStepData?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {CurrentStepComponent && (
                <CurrentStepComponent 
                  data={formData} 
                  onUpdate={handleDataUpdate}
                  errors={errors}
                />
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={currentStep === totalSteps ? publishListing : handleNext}
              disabled={loading}
            >
              {loading ? "Publishing..." : currentStep === totalSteps ? "Publish Listing" : "Next"}
              {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HostOnboarding;
