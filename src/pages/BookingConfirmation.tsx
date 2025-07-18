import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, MessageSquare, Phone, CreditCard } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+216 ");
  const [guestMessage, setGuestMessage] = useState("");
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    nights: 0,
    totalPrice: 0
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (id) {
      fetchProperty();
      loadBookingDetails();
    }
  }, [id, user, navigate]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error("Error fetching property:", error);
      toast({
        title: "Error",
        description: "Property not found",
        variant: "destructive"
      });
      navigate("/search");
    } finally {
      setLoading(false);
    }
  };

  const loadBookingDetails = () => {
    // Load booking details from localStorage or URL params
    const stored = localStorage.getItem('bookingDetails');
    if (stored) {
      const details = JSON.parse(stored);
      setBookingDetails(details);
    }
  };

  const calculateExchangeRates = () => {
    const depositTND = 100;
    return {
      usd: (depositTND * 0.34).toFixed(2),
      eur: (depositTND * 0.293).toFixed(2)
    };
  };

  const getHostWelcomeMessage = () => {
    if (property?.welcome_message) {
      return property.welcome_message;
    }
    
    return `Welcome to ${property?.city || 'our beautiful location'} where the past & future mix & mingle! A traveler myself, I love interacting and I'd be happy to host & guide you through some local stuff! Let me know if you have any questions.`;
  };

  const handleSubmitBooking = async () => {
    if (!property || !user) return;

    if (!phoneNumber || phoneNumber === "+216 ") {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        property_id: property.id,
        host_id: property.host_id,
        guest_id: user.id,
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        total_price: bookingDetails.totalPrice,
        status: 'pending'
      };

      const { error } = await supabase
        .from("bookings")
        .insert([bookingData]);

      if (error) throw error;

      // Clear booking details from localStorage
      localStorage.removeItem('bookingDetails');

      toast({
        title: "Booking Request Submitted",
        description: "Your booking request has been sent to the host for approval"
      });

      navigate("/profile?tab=inbox");
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit booking",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const exchangeRates = calculateExchangeRates();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Property not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Host Interaction */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message from Host
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm whitespace-pre-line">
                    {getHostWelcomeMessage()}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Label>Send a message to your host</Label>
                  <Textarea
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Let your host know:
• Why you're visiting
• Who's joining you
• Questions about check-in
• Local recommendation requests"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {property.house_rules ? (
                    <p className="whitespace-pre-line">{property.house_rules}</p>
                  ) : (
                    <>
                      <p>• Check-in: {property.check_in_time || "15:00"}</p>
                      <p>• Check-out: {property.check_out_time || "11:00"}</p>
                      <p>• No events allowed</p>
                      <p>• No pets allowed</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    By clicking "Continue", you agree to pay the total amount shown, 
                    which includes Service Fees, and to the Terms of Service, House Rules, 
                    and Cancellation Policy.
                  </div>
                  
                  <Button 
                    onClick={handleSubmitBooking} 
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Submitting..." : "Confirm Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Property Details & Pricing */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {property.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.city}, {property.governorate}, Tunisia</span>
                  </div>
                  
                  <Badge variant="outline">{property.property_type}</Badge>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{bookingDetails.guests} Guest{bookingDetails.guests !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{bookingDetails.nights} night{bookingDetails.nights !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {bookingDetails.checkIn && bookingDetails.checkOut && (
                    <div className="bg-muted p-3 rounded">
                      <p className="text-sm font-medium">Dates</p>
                      <p className="text-sm">
                        {new Date(bookingDetails.checkIn).toLocaleDateString()} to {new Date(bookingDetails.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>TND {property.price_per_night} × {bookingDetails.nights} nights</span>
                    <span>TND {bookingDetails.totalPrice}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>TND {bookingDetails.totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reservation Deposit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="font-medium text-yellow-800">Required Down Payment</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      A non-refundable reservation deposit is required to secure your booking.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Deposit (TND)</span>
                      <span className="font-medium">100.00 TND</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Equivalent (USD)</span>
                      <span>${exchangeRates.usd}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Equivalent (EUR)</span>
                      <span>€{exchangeRates.eur}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-2">
                  {property.cancellation_policy || "Moderate"}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {property.cancellation_policy === 'Flexible' && 
                    'Full refund if cancelled at least 24 hours before check-in.'}
                  {property.cancellation_policy === 'Moderate' && 
                    'Full refund if cancelled 5 days before check-in.'}
                  {property.cancellation_policy === 'Strict' && 
                    'Full refund if cancelled 14 days before check-in.'}
                  {property.cancellation_policy === 'Super Strict' && 
                    'No refunds for cancellations.'}
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

export default BookingConfirmation;
