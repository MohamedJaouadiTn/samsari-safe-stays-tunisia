
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Name, email address, phone number</li>
                      <li>Government-issued ID for verification</li>
                      <li>Payment information (processed securely)</li>
                      <li>Profile photos and property images</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Usage Information:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Search queries and booking history</li>
                      <li>Messages sent through our platform</li>
                      <li>Device information and IP address</li>
                      <li>Cookies and tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Process bookings and facilitate rentals</li>
                  <li>Verify user identities and prevent fraud</li>
                  <li>Provide customer support and resolve disputes</li>
                  <li>Send booking confirmations and important updates</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    We share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>With hosts/guests for completed bookings (limited contact info)</li>
                    <li>With payment processors for transaction processing</li>
                    <li>With law enforcement when legally required</li>
                    <li>With service providers who help us operate the platform</li>
                    <li>With your explicit consent</li>
                  </ul>
                  <p className="text-muted-foreground font-semibold">
                    We never sell your personal information to third parties.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All data is encrypted in transit and at rest</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Incident response procedures for data breaches</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your data in a portable format</li>
                    <li>Opt out of marketing communications</li>
                    <li>File a complaint with data protection authorities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to improve your experience, 
                  remember your preferences, and analyze site usage. You can control 
                  cookie settings through your browser, though some features may not 
                  work properly if cookies are disabled.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  For privacy-related questions or to exercise your rights, contact us at:
                </p>
                <div className="mt-4 space-y-1">
                  <p className="font-medium">Email: privacy@samsari.tn</p>
                  <p className="font-medium">Phone: +216 XX XXX XXX</p>
                  <p className="text-muted-foreground">
                    Response time: Within 30 days for most requests
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
