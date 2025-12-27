import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface CancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  cancelledBy: 'guest' | 'host';
  onCancelled: () => void;
}

interface RefundCalculation {
  refund_percentage: number;
  refund_amount: number;
  reason: string;
  days_until_checkin: number;
  cancellation_policy: string;
  deposit_paid: number;
  error?: string;
}

const CancellationDialog: React.FC<CancellationDialogProps> = ({
  open,
  onOpenChange,
  bookingId,
  cancelledBy,
  onCancelled
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(true);
  const [refundInfo, setRefundInfo] = useState<RefundCalculation | null>(null);

  useEffect(() => {
    if (open && bookingId) {
      calculateRefund();
    }
  }, [open, bookingId]);

  const calculateRefund = async () => {
    setCalculating(true);
    try {
      const { data, error } = await supabase.rpc('calculate_cancellation_refund', {
        p_booking_id: bookingId,
        p_cancelled_by: cancelledBy
      });

      if (error) throw error;
      setRefundInfo(data as unknown as RefundCalculation);
    } catch (error) {
      console.error('Error calculating refund:', error);
      toast({
        title: "Error",
        description: "Could not calculate refund amount",
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleConfirmCancellation = async () => {
    setLoading(true);
    try {
      const newStatus = cancelledBy === 'guest' ? 'cancelled_by_guest' : 'cancelled_by_host';
      
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          refund_amount: refundInfo?.refund_amount || 0,
          refund_reason: refundInfo?.reason || '',
          refund_status: refundInfo && refundInfo.refund_amount > 0 ? 'pending' : 'none'
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: refundInfo && refundInfo.refund_amount > 0 
          ? `Refund of ${refundInfo.refund_amount} TND will be processed.`
          : "Your booking has been cancelled."
      });

      onCancelled();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPolicyBadgeColor = (policy: string) => {
    switch (policy) {
      case 'flexible': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'strict': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Review the cancellation details and refund policy before confirming.
          </DialogDescription>
        </DialogHeader>

        {calculating ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Calculating refund...</p>
          </div>
        ) : refundInfo?.error ? (
          <div className="py-4 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive">{refundInfo.error}</p>
          </div>
        ) : refundInfo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cancellation Policy</span>
              <Badge className={getPolicyBadgeColor(refundInfo.cancellation_policy)}>
                {refundInfo.cancellation_policy || 'Standard'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Days Until Check-in</span>
              <span className="font-medium">{refundInfo.days_until_checkin} days</span>
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deposit Paid</span>
                <span>{refundInfo.deposit_paid} TND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Refund Percentage</span>
                <span>{refundInfo.refund_percentage}%</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Refund Amount</span>
                <span className={refundInfo.refund_amount > 0 ? 'text-green-600' : 'text-destructive'}>
                  {refundInfo.refund_amount} TND
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              {refundInfo.refund_percentage === 100 ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : refundInfo.refund_percentage > 0 ? (
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              )}
              <p className="text-muted-foreground">{refundInfo.reason}</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Keep Booking
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirmCancellation}
            disabled={loading || calculating}
          >
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationDialog;
