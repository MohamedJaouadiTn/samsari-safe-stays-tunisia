
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, AlertTriangle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Safety = () => {
  const { t } = useLanguage();

  const safetyFeatures = [
    {
      icon: Shield,
      title: "Identity Verification",
      description: "All hosts and guests must verify their identity with government-issued ID"
    },
    {
      icon: CheckCircle,
      title: "Property Verification",
      description: "Every property is verified by our team before being listed"
    },
    {
      icon: AlertTriangle,
      title: "24/7 Safety Support",
      description: "Our safety team is available around the clock for emergencies"
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Local emergency contacts provided for each booking"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Safety is Our Priority
            </h1>
            <p className="text-lg text-muted-foreground">
              We've built comprehensive safety measures to ensure your peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {safetyFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>Safety Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">For Guests:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Always verify the property location before arrival</li>
                  <li>Keep emergency contacts readily available</li>
                  <li>Report any safety concerns immediately</li>
                  <li>Follow local laws and property rules</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">For Hosts:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ensure all safety equipment is functional</li>
                  <li>Provide accurate property information</li>
                  <li>Maintain clean and safe accommodations</li>
                  <li>Be available for guest communication</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Safety;
