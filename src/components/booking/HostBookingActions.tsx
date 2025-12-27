import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  LogIn, 
  LogOut, 
  XCircle, 
  Clock, 
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import CancellationDialog from './CancellationDialog';

interface Booking {
  id: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  actual_check_in: string | null;
  actual_check_out: string | null;
  guest_name: string;
  property_title: string;
  total_price: number;
  deposit_amount: number;
}

interface HostBookingActionsProps {
  booking: Booking;
  onUpdate: () => void;
}

const HostBookingActions: React.FC<HostBookingActionsProps> = ({ booking, onUpdate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCheckIn = async () => {
    setLoading('checkin');
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'checked_in' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Check-in Recorded",
        description: `${booking.guest_name} has been checked in.`
      });
      onUpdate();
    } catch (error: any) {
      console.error('Error recording check-in:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record check-in",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCheckOut = async () => {
    setLoading('checkout');
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'checked_out' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Check-out Recorded",
        description: "Guest has been checked out. Settlement will process after the dispute window."
      });
      onUpdate();
    } catch (error: any) {
      console.error('Error recording check-out:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record check-out",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const canCheckIn = ['deposit_paid', 'payment_authorized', 'payment_held'].includes(booking.status);
  const canCheckOut = booking.status === 'checked_in';
  const canCancel = ['pending', 'confirmed', 'awaiting_payment', 'deposit_paid', 'payment_authorized', 'payment_held'].includes(booking.status);

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Booking Actions</span>
            <Badge variant="outline">{booking.status.replace(/_/g, ' ')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Check-in/Check-out status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-in Date</span>
              <span className={isToday(booking.check_in_date) ? 'font-medium text-primary' : ''}>
                {format(new Date(booking.check_in_date), 'MMM d, yyyy')}
                {isToday(booking.check_in_date) && ' (Today)'}
              </span>
            </div>
            {booking.actual_check_in && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-3 w-3" />
                Checked in: {format(new Date(booking.actual_check_in), 'MMM d, h:mm a')}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-out Date</span>
              <span className={isToday(booking.check_out_date) ? 'font-medium text-primary' : ''}>
                {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
                {isToday(booking.check_out_date) && ' (Today)'}
              </span>
            </div>
            {booking.actual_check_out && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-3 w-3" />
                Checked out: {format(new Date(booking.actual_check_out), 'MMM d, h:mm a')}
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            {canCheckIn && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    disabled={loading === 'checkin'}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Record Check-in
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Check-in</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to record check-in for {booking.guest_name}? 
                      This confirms the guest has arrived at the property.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCheckIn}>
                      Confirm Check-in
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canCheckOut && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    disabled={loading === 'checkout'}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Record Check-out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Check-out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to record check-out for {booking.guest_name}?
                      A 48-hour dispute window will begin, after which funds will be released.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCheckOut}>
                      Confirm Check-out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canCancel && (
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            )}
          </div>

          {/* Settlement info */}
          {['settlement_pending', 'dispute_window'].includes(booking.status) && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Settlement Pending</p>
                  <p className="text-yellow-700">
                    Funds will be released after the 48-hour dispute window closes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {booking.status === 'disputed' && (
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Dispute Filed</p>
                  <p className="text-red-700">
                    The guest has filed a dispute. Payment is on hold pending resolution.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CancellationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        bookingId={booking.id}
        cancelledBy="host"
        onCancelled={onUpdate}
      />
    </>
  );
};

export default HostBookingActions;
