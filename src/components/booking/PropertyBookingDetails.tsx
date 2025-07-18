
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, CalendarDays, CreditCard } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface BookingDetails {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  pricePerNight?: number;
}

interface PropertyBookingDetailsProps {
  property: Property;
  bookingDetails: BookingDetails;
}

const PropertyBookingDetails = ({ property, bookingDetails }: PropertyBookingDetailsProps) => {
  // Use pricePerNight from booking details if available, otherwise fall back to property price
  const pricePerNight = bookingDetails.pricePerNight || property.price_per_night;
  
  return (
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
              <span>TND {pricePerNight} × {bookingDetails.nights} nights</span>
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
  );
};

export default PropertyBookingDetails;
