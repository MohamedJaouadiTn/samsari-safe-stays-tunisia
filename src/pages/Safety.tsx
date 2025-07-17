
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, AlertTriangle, Phone, Camera, CreditCard, Clock, Ban, Eye, MessageSquare } from "lucide-react";
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
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Safety & Trust Guidelines
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              At Samsari, your safety and peace of mind come first. By using our platform, you agree to these safety terms.
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

          {/* Guest Responsibilities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Camera className="h-6 w-6 text-primary" />
                <span>📷 Guest Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <span>Take Proof Photos Within 5 Hours of Check-In</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>Take clear pictures or short videos of the property (inside and outside) within the first 5 hours</li>
                  <li>Upload them through the app to protect yourself in case of disputes</li>
                  <li>Failure to do so may limit your ability to request a refund later</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Do Not Pay in Cash</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>Always use Samsari's secure payment system</li>
                  <li>Paying outside the platform is strictly prohibited and violates our terms</li>
                  <li>If you pay in cash, Samsari is not responsible for any problems, scams, or lost money</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Report Issues Immediately</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>If the property is not as described or you feel unsafe, contact support within 12 hours</li>
                  <li>Include photos and detailed descriptions of the issues</li>
                  <li>Our team will respond quickly to resolve problems fairly</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Host Responsibilities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary" />
                <span>🏠 Host Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Accurate Listings</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>Property photos, descriptions, and availability must be honest and updated</li>
                  <li>Misleading listings will be removed immediately</li>
                  <li>Repeated violations may lead to a permanent ban from the platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span>Respect Guest Privacy & Rights</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>No unexpected visits or surveillance without clear disclosure in your listing</li>
                  <li>Guests should feel safe and undisturbed during their stay</li>
                  <li>Always respect privacy and personal space</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Ban className="h-5 w-5 text-destructive" />
                  <span>Do Not Request Cash</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
                  <li>Hosts must never ask guests for cash or off-platform payments</li>
                  <li>Doing so breaks our terms and will result in immediate removal from the platform</li>
                  <li>All payments must go through Samsari's secure system</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Off-Platform Activity Warning */}
          <Card className="mb-8 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-destructive">
                <Ban className="h-6 w-6" />
                <span>🚫 Off-Platform Activity is Prohibited</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All communications, bookings, and payments must go through Samsari</li>
                <li>Going off the platform for deals or discussions makes you ineligible for any support or protection</li>
                <li>Violators may be banned permanently from the platform</li>
              </ul>
            </CardContent>
          </Card>

          {/* Trust & Safety Tips */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary" />
                <span>🔒 General Trust & Safety Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Always verify identity through our secure system before booking or hosting</li>
                <li>Read reviews and check ratings before confirming any booking</li>
                <li>Keep all communication within the app chat to stay protected</li>
                <li>Report any suspicious behavior or safety concerns immediately</li>
                <li>Trust your instincts - if something feels wrong, contact support</li>
              </ul>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span>✅ We're Here for You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If anything feels wrong, unusual, or unsafe:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                <li>Contact support during official hours (9 AM - 6 PM)</li>
                <li>We'll step in quickly to help resolve any issues fairly</li>
                <li>Emergency support available for urgent safety concerns</li>
              </ul>
              <div className="bg-background p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Emergency Contact:</h4>
                <p className="text-sm"><strong>Email:</strong> support@samsari.tn</p>
                <p className="text-sm"><strong>Phone:</strong> +216 XX XXX XXX</p>
                <p className="text-sm text-muted-foreground">For immediate emergencies, contact local emergency services first</p>
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
