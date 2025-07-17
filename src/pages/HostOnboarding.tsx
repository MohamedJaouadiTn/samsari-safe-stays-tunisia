
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
import PropertyBasics from "@/components/host/PropertyBasics";
import PropertyDetails from "@/components/host/PropertyDetails";
import PropertyPhotos from "@/components/host/PropertyPhotos";
import PropertyPricing from "@/components/host/PropertyPricing";
import PropertyReview from "@/components/host/PropertyReview";

const HostOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    propertyType: "",
    title: "",
    description: "",
    address: "",
    city: "",
    latitude: null,
    longitude: null,
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
    basePrice: "",
    currency: "TND"
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Property Basics", component: PropertyBasics },
    { number: 2, title: "Property Details", component: PropertyDetails },
    { number: 3, title: "Photos", component: PropertyPhotos },
    { number: 4, title: "Pricing", component: PropertyPricing },
    { number: 5, title: "Review", component: PropertyReview }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Property Basics
        if (!formData.propertyType || !formData.title || !formData.address || !formData.city) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2: // Property Details
        if (!formData.maxGuests || formData.maxGuests < 4) {
          toast({
            title: "Invalid Guest Count",
            description: "Maximum guests must be at least 4",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3: // Photos
        const requiredPhotoTypes = ['exterior', 'kitchen', 'bathroom', 'living_room'];
        const hasAllRequired = requiredPhotoTypes.every(type => 
          formData.photos.some((photo: any) => photo.type === type)
        );
        const hasBedroomPhotos = formData.bedrooms <= new Set(
          formData.photos.filter((photo: any) => photo.type?.startsWith('bedroom_')).map((p: any) => p.type)
        ).size;
        
        if (!hasAllRequired || !hasBedroomPhotos) {
          toast({
            title: "Missing Required Photos",
            description: "Please upload all required room photos",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 4: // Pricing
        if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
          toast({
            title: "Invalid Price",
            description: "Please set a valid base price",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataUpdate = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  const publishListing = async () => {
    if (!validateCurrentStep() || !user) return;
    
    setLoading(true);
    
    try {
      // Here you would typically save to your database
      // For now, we'll just show a success message
      
      const listingId = `listing_${Date.now()}`;
      const shareUrl = `${window.location.origin}/property/${listingId}`;
      
      // Store in localStorage for demo purposes
      const existingListings = JSON.parse(localStorage.getItem('userListings') || '[]');
      const newListing = {
        id: listingId,
        ...formData,
        hostId: user.id,
        createdAt: new Date().toISOString(),
        shareUrl,
        status: 'published'
      };
      
      existingListings.push(newListing);
      localStorage.setItem('userListings', JSON.stringify(existingListings));
      
      toast({
        title: "Listing Published!",
        description: `Your property is now live. Share URL: ${shareUrl}`,
      });
      
      // Navigate to a success page or listings page
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
      
    } catch (error) {
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
