
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Home, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type BookingRequest = {
  id: string;
  property_id: string;
  property_title: string;
  guest_id: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  request_message: string;
  status: string;
  created_at: string;
};

const ReservationRequests: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [respondingToId, setRespondingToId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  const fetchBookingRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          property_id,
          guest_id,
          check_in_date,
          check_out_date,
          total_price,
          request_message,
          status,
          created_at,
          properties (
            title
          )
        `)
        .eq('host_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get guest profiles
      const guestIds = bookingsData?.map(booking => booking.guest_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', guestIds);

      const formattedRequests: BookingRequest[] = bookingsData?.map(booking => {
        const guest = profilesData?.find(p => p.id === booking.guest_id);
        return {
          id: booking.id,
          property_id: booking.property_id,
          property_title: (booking.properties as any)?.title || 'Property',
          guest_id: booking.guest_id,
          guest_name: guest?.full_name || 'Unknown Guest',
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_price: booking.total_price,
          request_message: booking.request_message || '',
          status: booking.status,
          created_at: booking.created_at
        };
      }) || [];

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      toast({
        title: "Error",
        description: "Failed to load booking requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId: string, action: 'accept' | 'decline') => {
    if (!user) return;
    
    try {
      const status = action === 'accept' ? 'confirmed' : 'declined';
      
      const { error } = await supabase
        .from('bookings')
        .update({
          status,
          host_response: responseMessage.trim() || null,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Create or update conversation if accepted
      if (action === 'accept') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          // Check if conversation exists
          const { data: existingConv } = await supabase
            .from('conversations')
            .select('id')
            .eq('property_id', request.property_id)
            .eq('host_id', user.id)
            .eq('guest_id', request.guest_id)
            .single();

          if (!existingConv) {
            // Create new conversation
            await supabase
              .from('conversations')
              .insert({
                property_id: request.property_id,
                host_id: user.id,
                guest_id: request.guest_id,
                booking_id: requestId
              });
          } else {
            // Update existing conversation with booking_id
            await supabase
              .from('conversations')
              .update({ booking_id: requestId })
              .eq('id', existingConv.id);
          }
        }
      }

      // Remove from requests list
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setRespondingToId(null);
      setResponseMessage('');

      toast({
        title: action === 'accept' ? "Request Accepted" : "Request Declined",
        description: `The booking request has been ${action}ed. The guest will be notified.`
      });

    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: "Error",
        description: "Failed to respond to booking request",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Reservation Requests</h2>
        <p className="text-muted-foreground">
          Review and respond to booking requests from guests
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No pending requests</h3>
            <p className="text-muted-foreground">
              You'll see booking requests from guests here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-lg">
                      <Home className="h-5 w-5 mr-2" />
                      {request.property_title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" />
                      Request from {request.guest_name}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(request.created_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Check-in</Label>
                    <p className="text-sm">{format(new Date(request.check_in_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Check-out</Label>
                    <p className="text-sm">{format(new Date(request.check_out_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Price</Label>
                    <p className="text-sm font-semibold">{request.total_price} TND</p>
                  </div>
                </div>

                {request.request_message && (
                  <div>
                    <Label className="text-sm font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Guest Message
                    </Label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                      {request.request_message}
                    </p>
                  </div>
                )}

                <Separator />

                {respondingToId === request.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="response">Your Response (Optional)</Label>
                      <Textarea
                        id="response"
                        placeholder="Add a message for the guest..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRequestResponse(request.id, 'accept')}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRequestResponse(request.id, 'decline')}
                        className="flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRespondingToId(null);
                          setResponseMessage('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setRespondingToId(request.id)}>
                      Respond to Request
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationRequests;
