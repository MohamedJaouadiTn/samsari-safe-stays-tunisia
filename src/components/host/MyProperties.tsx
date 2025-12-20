
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Edit, Trash2, Plus, Calendar, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
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
import { Skeleton } from "@/components/ui/skeleton";

type Property = Tables<"properties">;

const MyProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyStats, setPropertyStats] = useState<Record<string, { views: number, bookings: number }>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Fetching properties for user:', user.id);
      
      // Fetch properties where the current user is the host
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }
      
      console.log('Fetched properties:', propertyData);
      setProperties(propertyData || []);

      // Fetch stats for each property
      if (propertyData && propertyData.length > 0) {
        await fetchPropertyStats(propertyData);
      }
    } catch (error) {
      console.error('Error fetching properties:',error);
      toast({
        title: "Error",
        description: "Failed to load your properties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyStats = async (properties: Property[]) => {
    const statsMap: Record<string, { views: number, bookings: number }> = {};
    
    try {
      // Initialize stats for all properties
      properties.forEach(property => {
        statsMap[property.id] = { views: 0, bookings: 0 };
      });

      if (properties.length > 0) {
        // Get booking counts using count aggregation
        const { data: bookingCounts, error: bookingsError } = await supabase
          .from('bookings')
          .select('property_id')
          .in('property_id', properties.map(p => p.id));

        if (bookingsError) throw bookingsError;

        // Count bookings per property
        if (bookingCounts) {
          bookingCounts.forEach(booking => {
            if (statsMap[booking.property_id]) {
              statsMap[booking.property_id].bookings++;
            }
          });
        }
      }
      
      setPropertyStats(statsMap);
    } catch (error) {
      console.error('Error fetching property stats:', error);
    }
  };

  const toggleVisibility = async (property: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_public: !property.is_public })
        .eq('id', property.id);

      if (error) throw error;

      // Update local state
      setProperties(prevProperties => 
        prevProperties.map(p => 
          p.id === property.id ? { ...p, is_public: !p.is_public } : p
        )
      );

      toast({
        title: "Success",
        description: `Property is now ${!property.is_public ? 'visible' : 'hidden'} to guests`
      });
    } catch (error) {
      console.error('Error updating property visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update property visibility",
        variant: "destructive"
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      // Update local state
      setProperties(prevProperties => 
        prevProperties.filter(p => p.id !== propertyId)
      );

      toast({
        title: "Success",
        description: "Property deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive"
      });
    }
  };

  const editProperty = (propertyId: string) => {
    navigate(`/host/edit-property/${propertyId}`);
  };

  const viewProperty = (property: Property) => {
    const shortCode = (property as any).short_code;
    navigate(shortCode ? `/p/${shortCode}` : `/property/${property.id}`);
  };

  const createNewProperty = () => {
    navigate('/host/onboarding');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardHeader>
          <CardTitle>No Properties Yet</CardTitle>
          <CardDescription>
            You haven't created any properties yet. Get started by creating your first listing.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center pt-4">
          <Button onClick={createNewProperty}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Property
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">My Properties</h3>
        <Button onClick={createNewProperty}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
      </div>

      {properties.map((property) => (
        <Card key={property.id} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <CardDescription>
                  {property.city}, {property.governorate}
                </CardDescription>
              </div>
              <Badge 
                variant={property.is_public ? "default" : "outline"}
              >
                {property.is_public ? "Published" : "Draft"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative h-28 w-40 bg-muted rounded overflow-hidden">
                {property.photos && Array.isArray(property.photos) && property.photos.length > 0 ? (
                  <img 
                    src={(property.photos[0] as any)?.url || "/placeholder.svg"} 
                    alt={property.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No photo
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-2">
                  {property.property_type} • {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} • {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                </div>
                <div className="flex flex-wrap gap-4 my-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{propertyStats[property.id]?.bookings || 0} Bookings</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{property.price_per_night} TND</span>
                    <span className="text-sm text-muted-foreground ml-1">/ night</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toggleVisibility(property)}
              >
                {property.is_public ? (
                  <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                ) : (
                  <><Eye className="h-4 w-4 mr-1" /> Publish</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => editProperty(property.id)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your property
                      and remove all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProperty(property.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => viewProperty(property)}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> View
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MyProperties;
