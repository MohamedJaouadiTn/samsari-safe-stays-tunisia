import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  Calendar,
  Home,
  AlertCircle,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetails {
  id: string;
  property_id: string;
  property_title: string;
  property_photo: string | null;
  host_name: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  deposit_amount: number;
  status: string;
  payment_status: string;
}

const Payment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [user, bookingId]);

  const fetchBookingDetails = async () => {
    if (!bookingId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          property_id,
          host_id,
          check_in_date,
          check_out_date,
          total_price,
          deposit_amount,
          status,
          payment_status,
          properties (
            title,
            photos
          )
        `)
        .eq('id', bookingId)
        .eq('guest_id', user?.id)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Booking Not Found",
          description: "Could not find this booking",
          variant: "destructive"
        });
        navigate('/profile?tab=reservations');
        return;
      }

      // Get host profile
      const { data: hostProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.host_id)
        .single();

      const photos = (data.properties as any)?.photos;
      const firstPhoto = Array.isArray(photos) && photos.length > 0 ? photos[0]?.url : null;
      
      // Calculate 20% deposit if not set
      const depositAmount = data.deposit_amount || Math.round(data.total_price * 0.2);

      setBooking({
        id: data.id,
        property_id: data.property_id,
        property_title: (data.properties as any)?.title || 'Property',
        property_photo: firstPhoto,
        host_name: hostProfile?.full_name || 'Host',
        check_in_date: data.check_in_date,
        check_out_date: data.check_out_date,
        total_price: data.total_price,
        deposit_amount: depositAmount,
        status: data.status || 'pending',
        payment_status: data.payment_status || 'pending'
      });

      // Check if already paid
      if (data.payment_status === 'paid' || data.status === 'deposit_paid') {
        setPaymentComplete(true);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayDeposit = async () => {
    if (!booking || !user) return;

    // Check if booking is in a valid state for payment
    if (!['confirmed', 'awaiting_payment'].includes(booking.status)) {
      toast({
        title: "Cannot Process Payment",
        description: "This booking is not ready for payment",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Demo payment - in production this would integrate with Stripe
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update booking status to deposit_paid
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'deposit_paid',
          payment_status: 'paid',
          deposit_amount: booking.deposit_amount
        })
        .eq('id', booking.id);

      if (error) throw error;

      setPaymentComplete(true);
      toast({
        title: "Payment Successful!",
        description: `Your deposit of ${booking.deposit_amount} TND has been received.`
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading payment details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find the booking you're looking for.
            </p>
            <Button onClick={() => navigate('/profile?tab=reservations')}>
              View My Reservations
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  if (paymentComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Your deposit of {booking.deposit_amount} TND has been received. Your booking is now secured!
                </p>
                
                <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-medium mb-3">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property</span>
                      <span className="font-medium">{booking.property_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{format(new Date(booking.check_in_date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{format(new Date(booking.check_out_date), 'MMM d, yyyy')}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit Paid</span>
                      <span className="font-medium text-green-600">{booking.deposit_amount} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Balance</span>
                      <span>{booking.total_price - booking.deposit_amount} TND</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate('/profile?tab=reservations')}>
                    View My Reservations
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/property/${booking.property_id}`)}>
                    View Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if booking is not in a payable state
  if (!['confirmed', 'awaiting_payment'].includes(booking.status)) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile?tab=reservations')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reservations
            </Button>

            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Payment Not Available</h2>
                <p className="text-muted-foreground mb-4">
                  {booking.status === 'pending' 
                    ? 'Your booking is still pending approval from the host. You will be able to pay once the host confirms your booking.'
                    : `This booking is currently in "${booking.status}" status and cannot accept payment.`}
                </p>
                <Button onClick={() => navigate('/profile?tab=reservations')}>
                  View My Reservations
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile?tab=reservations')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reservations
          </Button>

          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {booking.property_photo ? (
                    <img 
                      src={booking.property_photo}
                      alt={booking.property_title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{booking.property_title}</h3>
                    <p className="text-sm text-muted-foreground">Hosted by {booking.host_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(booking.check_in_date), 'MMM d')} - {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  A 20% deposit is required to secure your booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Booking Price</span>
                    <span>{booking.total_price} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit (20%)</span>
                    <span className="font-semibold">{booking.deposit_amount} TND</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Due Now</span>
                    <span className="font-bold text-primary">{booking.deposit_amount} TND</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Remaining Balance (due at check-in)</span>
                    <span>{booking.total_price - booking.deposit_amount} TND</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Secure Escrow Payment</p>
                      <p className="text-xs text-muted-foreground">
                        Your payment is held securely until checkout. Funds are released to the host only after your stay is complete.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo Payment Notice */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-yellow-800">Demo Payment Mode</p>
                      <p className="text-xs text-yellow-700">
                        This is a demo payment. In production, you would enter your card details via Stripe.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayDeposit}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay {booking.deposit_amount} TND Deposit
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms of Service and Cancellation Policy
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

export default Payment;
