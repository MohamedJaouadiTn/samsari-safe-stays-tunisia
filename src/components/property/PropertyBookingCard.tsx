
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface PropertyBookingCardProps {
  property: Property;
}

const PropertyBookingCard = ({ property }: PropertyBookingCardProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfSaved();
  }, [property.id]);

  const checkIfSaved = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("saved_properties")
        .select("id")
        .eq("property_id", property.id)
        .eq("user_id", user.id)
        .single();

      setIsSaved(!!data);
    } catch (error) {
      // Property not saved
    }
  };

  const toggleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save properties",
          variant: "destructive"
        });
        return;
      }

      if (isSaved) {
        await supabase
          .from("saved_properties")
          .delete()
          .eq("property_id", property.id)
          .eq("user_id", user.id);
        
        setIsSaved(false);
        toast({
          title: "Property Removed",
          description: "Property removed from saved list"
        });
      } else {
        await supabase
          .from("saved_properties")
          .insert({
            property_id: property.id,
            user_id: user.id
          });
        
        setIsSaved(true);
        toast({
          title: "Property Saved",
          description: "Property added to your saved list"
        });
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive"
      });
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("property_id", property.id)
        .or(`and(check_in_date.lte.${checkOut},check_out_date.gte.${checkIn})`);

      if (error) throw error;

      const isAvailable = !data || data.length === 0;
      
      if (isAvailable) {
        toast({
          title: "Available!",
          description: "This property is available for your selected dates",
        });
      } else {
        toast({
          title: "Not Available",
          description: "This property is booked for your selected dates",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make a reservation",
          variant: "destructive"
        });
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * Number(property.price_per_night);

      const { error } = await supabase
        .from("bookings")
        .insert({
          property_id: property.id,
          guest_id: user.id,
          host_id: property.host_id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          total_price: totalPrice,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Reservation Created",
        description: "Your reservation has been submitted successfully!"
      });

      setCheckIn("");
      setCheckOut("");
      setGuests(1);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description: "Failed to create reservation",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {property.price_per_night} TND
          </span>
          <span className="text-sm text-muted-foreground">per night</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkin">Check-in</Label>
            <Input
              id="checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="checkout">Check-out</Label>
            <Input
              id="checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            min="1"
            max={property.max_guests}
          />
        </div>
        
        <Button 
          onClick={checkAvailability}
          className="w-full"
          disabled={!checkIn || !checkOut || loading}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {loading ? "Checking..." : "Check Availability"}
        </Button>
        
        <Button 
          onClick={createReservation}
          className="w-full"
          disabled={!checkIn || !checkOut}
        >
          Reserve Now
        </Button>

        <Button 
          variant="outline" 
          onClick={toggleSave}
          className="w-full"
        >
          <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save Property'}
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <p>You won't be charged yet</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBookingCard;
