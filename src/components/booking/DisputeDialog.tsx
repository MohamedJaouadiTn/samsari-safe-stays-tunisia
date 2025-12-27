import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, Shield } from 'lucide-react';

interface DisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  propertyTitle: string;
  onDisputeFiled: () => void;
}

const DISPUTE_REASONS = [
  { value: 'property_not_as_described', label: 'Property not as described' },
  { value: 'cleanliness_issues', label: 'Cleanliness issues' },
  { value: 'amenities_missing', label: 'Amenities missing or broken' },
  { value: 'safety_concerns', label: 'Safety concerns' },
  { value: 'host_behavior', label: 'Issues with host behavior' },
  { value: 'early_checkout_forced', label: 'Forced to leave early' },
  { value: 'other', label: 'Other issue' },
];

const DisputeDialog: React.FC<DisputeDialogProps> = ({
  open,
  onOpenChange,
  bookingId,
  propertyTitle,
  onDisputeFiled
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmitDispute = async () => {
    if (!selectedReason) {
      toast({
        title: "Select a Reason",
        description: "Please select a reason for your dispute",
        variant: "destructive"
      });
      return;
    }

    if (description.trim().length < 20) {
      toast({
        title: "Description Required",
        description: "Please provide more details about your dispute (at least 20 characters)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const reasonLabel = DISPUTE_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;
      const fullReason = `${reasonLabel}: ${description}`;

      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'disputed',
          dispute_reason: fullReason
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Dispute Filed",
        description: "Your dispute has been submitted. Our team will review it within 48 hours."
      });

      onDisputeFiled();
      onOpenChange(false);
      setSelectedReason('');
      setDescription('');
    } catch (error: any) {
      console.error('Error filing dispute:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to file dispute",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            File a Dispute
          </DialogTitle>
          <DialogDescription>
            Report an issue with your stay at {propertyTitle}. Our team will review your dispute.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg flex items-start gap-2">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Guest Protection</p>
              <p className="text-muted-foreground">
                Disputes must be filed within 48 hours of checkout. Funds are held in escrow until resolution.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>What's the issue?</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {DISPUTE_REASONS.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="font-normal cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe the issue in detail</Label>
            <Textarea
              id="description"
              placeholder="Please provide specific details about what happened, including dates, times, and any evidence you have..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 20 characters. Be specific to help us resolve your issue quickly.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitDispute}
            disabled={loading || !selectedReason || description.length < 20}
          >
            {loading ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDialog;
