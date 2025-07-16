
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PropertyBasics from "@/components/host/PropertyBasics";
import PropertyDetails from "@/components/host/PropertyDetails";
import PropertyPhotos from "@/components/host/PropertyPhotos";
import PropertyPricing from "@/components/host/PropertyPricing";
import PropertyReview from "@/components/host/PropertyReview";

const HostOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: "",
    title: "",
    description: "",
    address: "",
    city: "",
    bedrooms: 1,
    bathrooms: 1,
    guests: 1,
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

  const handleNext = () => {
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
              onClick={handleNext}
              disabled={currentStep === totalSteps}
            >
              {currentStep === totalSteps ? "Publish Listing" : "Next"}
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
