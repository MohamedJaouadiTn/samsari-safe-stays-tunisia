
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Trash2, Users, Globe, Mail, Phone } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Your privacy is our priority. Learn how we protect and handle your data.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Full name and contact information (email, phone)</li>
                    <li>Profile pictures and account preferences</li>
                    <li>Identity verification documents (CIN) - temporarily stored for verification only</li>
                    <li>Property information for hosts (location, photos, descriptions)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Booking history and preferences</li>
                    <li>Communication records between guests and hosts</li>
                    <li>Platform usage analytics and performance data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-green-600" />
                  <span>How We Use Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Account Management:</strong> To create and maintain your account, process bookings, and provide customer support.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Safety & Verification:</strong> To verify user identities, prevent fraud, and ensure platform safety.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Service Improvement:</strong> To analyze usage patterns and improve our platform features.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Communication:</strong> To send booking confirmations, safety updates, and platform notifications.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-6 w-6 text-purple-600" />
                  <span>Identity Verification & Document Handling</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🛡️ Legal Compliance</h3>
                  <p className="text-blue-700 text-sm">
                    According to Tunisian Law 2004‑63 of 27 July 2004 on the Protection of Personal Data:
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Purpose Limitation:</strong> CIN documents are collected solely for identity verification to ensure platform safety.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Secure Storage:</strong> All verification documents are encrypted and stored in secure, access-controlled systems.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <strong>Automatic Deletion:</strong> CIN documents are permanently deleted within 24 hours of verification completion.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <strong>No Public Display:</strong> Identity documents are never displayed publicly or shared with other users.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-orange-600" />
                  <span>Information Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">We Share Information Only When:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Required by law or legal process</li>
                    <li>Necessary to protect user safety or prevent fraud</li>
                    <li>With your explicit consent for specific purposes</li>
                    <li>Between guests and hosts for booking purposes (limited contact info only)</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">
                    We never sell your personal data to third parties.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trash2 className="h-6 w-6 text-red-600" />
                  <span>Data Retention & Deletion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Retention Periods:</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Identity Verification Documents</span>
                        <span className="font-semibold text-red-600">24 hours max</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Account Information</span>
                        <span className="font-semibold">Until account deletion</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Booking Records</span>
                        <span className="font-semibold">7 years (tax compliance)</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Communication Logs</span>
                        <span className="font-semibold">2 years (dispute resolution)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <span>Your Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Access & Portability</h3>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of your personal data in a machine-readable format.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Rectification</h3>
                    <p className="text-sm text-muted-foreground">
                      Update or correct your personal information at any time.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Deletion</h3>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your account and associated data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Objection</h3>
                    <p className="text-sm text-muted-foreground">
                      Object to processing of your data for specific purposes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-green-600" />
                  <span>Contact Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    For privacy-related questions, concerns, or to exercise your rights, contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">privacy@samsari.tn</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-sm text-muted-foreground">+216 XX XXX XXX</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Response Time:</strong> We respond to privacy requests within 30 days as required by Tunisian law.
                    </p>
                  </div>
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
