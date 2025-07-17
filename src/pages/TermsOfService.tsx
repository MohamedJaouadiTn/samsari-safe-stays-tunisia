
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using Samsari, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Service Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Samsari is a platform that connects property owners (hosts) with travelers 
                  (guests) seeking short-term accommodations in Tunisia. We facilitate bookings 
                  but are not party to the rental agreements between hosts and guests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Hosts must:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Provide accurate property descriptions and photos</li>
                      <li>Maintain their properties in safe, clean condition</li>
                      <li>Comply with local laws and regulations</li>
                      <li>Honor confirmed bookings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Guests must:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Provide accurate personal information</li>
                      <li>Treat properties with respect</li>
                      <li>Follow house rules and local laws</li>
                      <li>Pay for bookings as agreed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Payment and Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Samsari charges service fees for facilitating bookings. Payment processing 
                  is handled through secure, encrypted channels. Refund policies are determined 
                  by individual hosts and clearly stated in property listings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Samsari acts as an intermediary platform. We are not responsible for the 
                  actions of hosts or guests, property conditions, or disputes between parties. 
                  Users engage at their own risk and are encouraged to purchase appropriate insurance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at 
                  legal@samsari.tn or +216 XX XXX XXX.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
