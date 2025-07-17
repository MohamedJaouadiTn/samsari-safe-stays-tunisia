
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  data: any;
  onUpdate: (data: any) => void;
}

const LocationPicker = ({ data, onUpdate }: LocationPickerProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onUpdate({
          latitude,
          longitude,
          exact_location: `${latitude}, ${longitude}`
        });
        toast({
          title: "Location captured",
          description: "Your exact location has been saved"
        });
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location error",
          description: "Could not get your location. Please enter it manually.",
          variant: "destructive"
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Exact Location (Optional but Recommended)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Adding your exact GPS location helps guests find your property easily and improves your listing visibility.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={getCurrentLocation} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {loading ? "Getting location..." : "Get My Current Location"}
          </Button>

          {data.latitude && data.longitude && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                ✓ Location captured: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Or enter coordinates manually</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitude"
                value={data.latitude || ""}
                onChange={(e) => onUpdate({ latitude: parseFloat(e.target.value) || null })}
              />
              <Input
                placeholder="Longitude"
                value={data.longitude || ""}
                onChange={(e) => onUpdate({ longitude: parseFloat(e.target.value) || null })}
              />
            </div>
          </div>

          {data.latitude && data.longitude && (
            <div className="mt-4">
              <Label>Google Maps Preview</Label>
              <div className="mt-2 h-48 border rounded overflow-hidden">
                <iframe
                  src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&hl=en&z=15&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
