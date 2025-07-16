
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, DollarSign, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BecomeHost = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Extra Income",
      description: "Turn your extra space into a source of income. Hosts in Tunisia earn an average of 2,000 TND per month."
    },
    {
      icon: Users,
      title: "Meet New People",
      description: "Welcome travelers from around the world and share the beauty of Tunisia with them."
    },
    {
      icon: Shield,
      title: "Host Protection",
      description: "We provide host protection insurance and 24/7 support to ensure your peace of mind."
    },
    {
      icon: Home,
      title: "Full Control",
      description: "Set your own prices, availability, and house rules. You're in complete control of your listing."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Listing",
      description: "Tell us about your space with photos and a description"
    },
    {
      number: "2",
      title: "Set Your Price",
      description: "Choose competitive pricing with our smart pricing tools"
    },
    {
      number: "3",
      title: "Publish & Earn",
      description: "Once approved, start welcoming guests and earning money"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Become a Host
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share your space and earn money by hosting travelers in Tunisia
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/host/onboarding')}
            >
              Start Hosting Today
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Host with Samsari?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Hosting?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of hosts already earning with Samsari
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/host/onboarding')}
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeHost;
