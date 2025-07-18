
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface HostInteractionProps {
  property: Property;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  guestMessage: string;
  setGuestMessage: (value: string) => void;
  onSubmitBooking: () => void;
  submitting: boolean;
}

const HostInteraction = ({
  property,
  phoneNumber,
  setPhoneNumber,
  guestMessage,
  setGuestMessage,
  onSubmitBooking,
  submitting
}: HostInteractionProps) => {
  const [countryCode, setCountryCode] = useState("+216");

  const getHostWelcomeMessage = () => {
    if (property?.welcome_message) {
      return property.welcome_message;
    }
    
    return `Welcome to ${property?.city || 'our beautiful location'} where the past & future mix & mingle! A traveler myself, I love interacting and I'd be happy to host & guide you through some local stuff! Let me know if you have any questions.`;
  };

  const handlePhoneChange = (value: string) => {
    // Ensure the phone number always starts with the country code
    if (!value.startsWith(countryCode)) {
      setPhoneNumber(`${countryCode} ${value.replace(/^\+\d+\s*/, '')}`);
    } else {
      setPhoneNumber(value);
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    // Update phone number with new country code
    const phoneWithoutCode = phoneNumber.replace(/^\+\d+\s*/, '');
    setPhoneNumber(`${value} ${phoneWithoutCode}`);
  };

  return (
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
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Country</Label>
                <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+216">🇹🇳 Tunisia (+216)</SelectItem>
                    <SelectItem value="+1">🇺🇸 USA (+1)</SelectItem>
                    <SelectItem value="+33">🇫🇷 France (+33)</SelectItem>
                    <SelectItem value="+49">🇩🇪 Germany (+49)</SelectItem>
                    <SelectItem value="+44">🇬🇧 UK (+44)</SelectItem>
                    <SelectItem value="+39">🇮🇹 Italy (+39)</SelectItem>
                    <SelectItem value="+34">🇪🇸 Spain (+34)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Phone Number *</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="XX XXX XXX"
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              By clicking "Continue", you agree to pay the total amount shown, 
              which includes Service Fees, and to the Terms of Service, House Rules, 
              and Cancellation Policy.
            </div>
            
            <Button 
              onClick={onSubmitBooking} 
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Submitting..." : "Confirm Booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostInteraction;
