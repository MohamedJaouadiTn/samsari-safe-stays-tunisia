
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I book a property on Samsari?",
      answer: "Simply search for your desired location and dates, browse available properties, and click 'Book Now' on your chosen property. You'll need to create an account and complete the secure payment process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and secure online payment methods. All payments are processed through our secure platform for your protection."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Cancellation policies vary by property and are clearly displayed before booking. Most hosts offer flexible cancellation options, but please review the specific policy for your booking."
    },
    {
      question: "How do I become a host on Samsari?",
      answer: "Click 'Become a Host' in the header, complete the property listing process with photos and descriptions, set your pricing, and we'll review your listing before it goes live."
    },
    {
      question: "What if the property doesn't match the listing?",
      answer: "Take photos within 5 hours of check-in and contact our support team immediately. We'll work with you and the host to resolve any issues or provide alternative accommodations."
    },
    {
      question: "Is it safe to book through Samsari?",
      answer: "Yes! We verify all properties and hosts, require secure payments through our platform, and provide 24/7 support. Never pay in cash or outside our platform."
    },
    {
      question: "How do I contact my host?",
      answer: "Use the messaging system in your Samsari account to communicate with your host. This keeps all communication secure and documented."
    },
    {
      question: "What should I do in case of an emergency?",
      answer: "For immediate emergencies, contact local emergency services. For booking-related urgent issues, contact our support team using the emergency contact information provided in your booking confirmation."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              How Can We Help You?
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <span>Live Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Available 9 AM - 6 PM</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <span>Email Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us a detailed message
                </p>
                <p className="text-sm font-medium">support@samsari.tn</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-primary" />
                  <span>Phone Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our team
                </p>
                <p className="text-sm font-medium">+216 XX XXX XXX</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>9 AM - 6 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/safety" className="text-primary hover:underline">Safety Guidelines</a>
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              <a href="/become-host" className="text-primary hover:underline">Become a Host</a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
