
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HostInteraction from "@/components/booking/HostInteraction";
import PropertyBookingDetails from "@/components/booking/PropertyBookingDetails";
import ReservationDeposit from "@/components/booking/ReservationDeposit";
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
    const stored = localStorage.getItem('bookingDetails');
    if (stored) {
      const details = JSON.parse(stored);
      setBookingDetails(details);
    }
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
          <div>
            <HostInteraction
              property={property}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              guestMessage={guestMessage}
              setGuestMessage={setGuestMessage}
              onSubmitBooking={handleSubmitBooking}
              submitting={submitting}
            />
          </div>

          {/* Right Side - Property Details & Pricing */}
          <div>
            <PropertyBookingDetails
              property={property}
              bookingDetails={bookingDetails}
            />
            <div className="mt-6">
              <ReservationDeposit />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
