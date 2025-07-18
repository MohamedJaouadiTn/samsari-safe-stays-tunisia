
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyBasics from "@/components/host/PropertyBasics";
import PropertyDetails from "@/components/host/PropertyDetails";
import PropertyPhotos from "@/components/host/PropertyPhotos";
import PropertyPricing from "@/components/host/PropertyPricing";
import PropertyReview from "@/components/host/PropertyReview";
import SafetyFeaturesForm from "@/components/host/SafetyFeaturesForm";

const HostOnboarding = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Initial property data with defaults
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    property_type: "",
    governorate: "",
    city: "",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 4,
    price_per_night: 0,
    amenities: [],
    photos: [],
    safety_features: [],
    sleeping_arrangements: [],
    bed_types: [],
    extra_beds: 0,
    minimum_stay: 1,
    cancellation_policy: "Moderate",
    check_in_time: "10:00",
    check_out_time: "12:00",
    house_rules: "",
    coordinates: null,
    google_maps_url: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // If propertyId exists, we're editing an existing property
    if (propertyId) {
      setIsEditing(true);
      fetchPropertyData();
    }
  }, [user, navigate, propertyId]);

  const fetchPropertyData = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .eq("host_id", user!.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setPropertyData({
          title: data.title || "",
          description: data.description || "",
          property_type: data.property_type || "",
          governorate: data.governorate || "",
          city: data.city || "",
          address: data.address || "",
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          max_guests: data.max_guests || 4,
          price_per_night: data.price_per_night || 0,
          amenities: data.amenities || [],
          photos: data.photos || [],
          safety_features: data.safety_features || [],
          sleeping_arrangements: data.sleeping_arrangements || [],
          bed_types: data.bed_types || [],
          extra_beds: data.extra_beds || 0,
          minimum_stay: data.minimum_stay || 1,
          cancellation_policy: data.cancellation_policy || "Moderate",
          check_in_time: data.check_in_time || "10:00",
          check_out_time: data.check_out_time || "12:00",
          house_rules: data.house_rules || "",
          coordinates: data.coordinates || null,
          google_maps_url: data.google_maps_url || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching property:", error);
      toast({
        title: "Error",
        description: "Failed to load property data",
        variant: "destructive"
      });
      navigate("/profile?tab=properties");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Property Basics", component: PropertyBasics },
    { number: 2, title: "Property Details", component: PropertyDetails },
    { number: 3, title: "Photos", component: PropertyPhotos },
    { number: 4, title: "Safety Features", component: SafetyFeaturesForm },
    { number: 5, title: "Pricing", component: PropertyPricing },
    { number: 6, title: "Review & Publish", component: PropertyReview }
  ];

  const updatePropertyData = (updates: any) => {
    setPropertyData(prev => ({ ...prev, ...updates }));
    // Clear any existing errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Property Basics
        if (!propertyData.title?.trim()) {
          newErrors.title = "Property title is required";
        }
        if (!propertyData.property_type) {
          newErrors.propertyType = "Property type is required";
        }
        if (!propertyData.governorate) {
          newErrors.governorate = "Governorate is required";
        }
        if (!propertyData.city) {
          newErrors.city = "City is required";
        }
        break;

      case 2: // Property Details
        if (!propertyData.bedrooms || propertyData.bedrooms < 1) {
          newErrors.bedrooms = "At least 1 bedroom is required";
        }
        if (!propertyData.bathrooms || propertyData.bathrooms < 1) {
          newErrors.bathrooms = "At least 1 bathroom is required";
        }
        if (!propertyData.max_guests || propertyData.max_guests < 1) {
          newErrors.maxGuests = "Maximum guests must be at least 1";
        }
        break;

      case 3: // Photos
        if (!propertyData.photos || propertyData.photos.length === 0) {
          newErrors.photos = "At least one photo is required";
        }
        break;

      case 4: // Safety Features
        // Safety features are optional, no validation needed
        break;

      case 5: // Pricing
        if (!propertyData.price_per_night || propertyData.price_per_night <= 0) {
          newErrors.price_per_night = "Price per night is required and must be greater than 0";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveProperty = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      const propertyPayload = {
        ...propertyData,
        host_id: user!.id,
        is_public: true,
        status: 'published',
        booking_enabled: true
      };

      if (isEditing && propertyId) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyPayload)
          .eq("id", propertyId)
          .eq("host_id", user!.id);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your property has been updated successfully"
        });
      } else {
        // Create new property
        const { data, error } = await supabase
          .from("properties")
          .insert([propertyPayload])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your property has been published successfully"
        });
      }

      navigate("/profile?tab=properties");
    } catch (error: any) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (loading && isEditing) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading property data...</div>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/profile?tab=properties")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
            
            <h1 className="text-3xl font-bold mb-4">
              {isEditing ? "Edit Your Property" : "List Your Property"}
            </h1>
            <Progress value={(currentStep / steps.length) * 100} className="mb-6" />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{steps[currentStep - 1].title}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent
                data={propertyData}
                onUpdate={updatePropertyData}
                errors={errors}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button onClick={saveProperty} disabled={loading}>
                {loading ? (
                  isEditing ? "Updating..." : "Publishing..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {isEditing ? "Update Property" : "Publish Property"}
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HostOnboarding;
