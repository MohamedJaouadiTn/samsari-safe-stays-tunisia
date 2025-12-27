import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Home, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import CancellationDialog from './CancellationDialog';
import DisputeDialog from './DisputeDialog';

interface Reservation {
  id: string;
  property_id: string;
  property_title: string;
  property_photo: string | null;
  host_id: string;
  host_name: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  deposit_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  host_response: string | null;
  actual_check_out: string | null;
  settlement_due_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<any> }> = {
  pending: { label: 'Pending Approval', variant: 'secondary', icon: Clock },
  confirmed: { label: 'Confirmed - Payment Required', variant: 'default', icon: CreditCard },
  awaiting_payment: { label: 'Awaiting Payment', variant: 'default', icon: CreditCard },
  deposit_paid: { label: 'Deposit Paid', variant: 'default', icon: CheckCircle },
  payment_authorized: { label: 'Payment Authorized', variant: 'default', icon: CheckCircle },
  payment_held: { label: 'Payment Held', variant: 'default', icon: CheckCircle },
  checked_in: { label: 'Checked In', variant: 'default', icon: Home },
  checked_out: { label: 'Checked Out', variant: 'secondary', icon: CheckCircle },
  settlement_pending: { label: 'Settlement Pending', variant: 'secondary', icon: Clock },
  dispute_window: { label: 'Dispute Window', variant: 'outline', icon: AlertCircle },
  settled: { label: 'Completed', variant: 'default', icon: CheckCircle },
  disputed: { label: 'Disputed', variant: 'destructive', icon: AlertCircle },
  refunded: { label: 'Refunded', variant: 'secondary', icon: CreditCard },
  declined: { label: 'Declined', variant: 'destructive', icon: XCircle },
  cancelled_by_guest: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
  cancelled_by_host: { label: 'Cancelled by Host', variant: 'destructive', icon: XCircle },
};

const MyReservations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: bookingsData, error } = await supabase
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
          created_at,
          host_response,
          actual_check_out,
          settlement_due_at,
          properties (
            title,
            photos
          )
        `)
        .eq('guest_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get host profiles
      const hostIds = [...new Set(bookingsData?.map(b => b.host_id) || [])];
      const { data: hostProfiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', hostIds);

      const hostMap = new Map(hostProfiles?.map(p => [p.id, p]) || []);

      const formattedReservations: Reservation[] = bookingsData?.map(booking => {
        const host = hostMap.get(booking.host_id);
        const photos = (booking.properties as any)?.photos;
        const firstPhoto = Array.isArray(photos) && photos.length > 0 ? photos[0]?.url : null;
        
        return {
          id: booking.id,
          property_id: booking.property_id,
          property_title: (booking.properties as any)?.title || 'Property',
          property_photo: firstPhoto,
          host_id: booking.host_id,
          host_name: host?.full_name || 'Host',
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_price: booking.total_price,
          deposit_amount: booking.deposit_amount || Math.round(booking.total_price * 0.2),
          status: booking.status || 'pending',
          payment_status: booking.payment_status || 'pending',
          created_at: booking.created_at,
          host_response: booking.host_response,
          actual_check_out: booking.actual_check_out,
          settlement_due_at: booking.settlement_due_at
        };
      }) || [];

      setReservations(formattedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load your reservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextAction = (reservation: Reservation): { text: string; action: () => void; variant?: "default" | "secondary" | "outline" } | null => {
    switch (reservation.status) {
      case 'confirmed':
      case 'awaiting_payment':
        return {
          text: 'Pay Deposit',
          action: () => navigate(`/payment/${reservation.id}`),
          variant: 'default'
        };
      case 'deposit_paid':
      case 'payment_authorized':
      case 'payment_held':
        return {
          text: 'View Details',
          action: () => navigate(`/property/${reservation.property_id}`),
          variant: 'secondary'
        };
      case 'checked_out':
      case 'settlement_pending':
      case 'dispute_window':
        return {
          text: 'Leave Review',
          action: () => navigate(`/property/${reservation.property_id}#reviews`),
          variant: 'secondary'
        };
      case 'pending':
        return {
          text: 'View Property',
          action: () => navigate(`/property/${reservation.property_id}`),
          variant: 'outline'
        };
      default:
        return null;
    }
  };

  const handleCancelBooking = async (reservationId: string, currentStatus: string) => {
    if (!['pending', 'confirmed', 'awaiting_payment'].includes(currentStatus)) {
      toast({
        title: "Cannot Cancel",
        description: "This booking cannot be cancelled at this stage",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled_by_guest' })
        .eq('id', reservationId);

      if (error) throw error;

      // Refresh reservations
      fetchReservations();

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled"
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Reservations</h2>
        <p className="text-muted-foreground">
          View and manage your booking requests and reservations
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No reservations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring properties and book your first stay!
            </p>
            <Button onClick={() => navigate('/search')}>
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const statusConfig = STATUS_CONFIG[reservation.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            const nextAction = getNextAction(reservation);
            const canCancel = ['pending', 'confirmed', 'awaiting_payment'].includes(reservation.status);

            return (
              <Card key={reservation.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      {reservation.property_photo ? (
                        <img 
                          src={reservation.property_photo} 
                          alt={reservation.property_title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Home className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          {reservation.property_title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Hosted by {reservation.host_name}
                        </p>
                        <Badge 
                          variant={statusConfig.variant}
                          className="mt-2 flex items-center gap-1 w-fit"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{reservation.total_price} TND</p>
                      <p className="text-sm text-muted-foreground">
                        Deposit: {reservation.deposit_amount} TND
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Check-in</p>
                      <p className="font-medium">{format(new Date(reservation.check_in_date), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Check-out</p>
                      <p className="font-medium">{format(new Date(reservation.check_out_date), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Booked on</p>
                      <p className="font-medium">{format(new Date(reservation.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment</p>
                      <p className="font-medium capitalize">{reservation.payment_status}</p>
                    </div>
                  </div>

                  {reservation.host_response && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-1 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        Host Response
                      </p>
                      <p className="text-sm text-muted-foreground">{reservation.host_response}</p>
                    </div>
                  )}

                  {/* Action buttons based on status */}
                  {(nextAction || canCancel) && (
                    <>
                      <Separator />
                      <div className="flex gap-2 flex-wrap">
                        {nextAction && (
                          <Button 
                            onClick={nextAction.action}
                            variant={nextAction.variant}
                            className="flex items-center gap-2"
                          >
                            {nextAction.text}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                        {canCancel && (
                          <Button 
                            variant="outline"
                            onClick={() => handleCancelBooking(reservation.id, reservation.status)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
