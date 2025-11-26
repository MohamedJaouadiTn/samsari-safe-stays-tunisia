
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        // Count pending reservation requests for hosts
        const { data: reservationRequests, error: reservationError } = await supabase
          .from("bookings")
          .select("id")
          .eq("host_id", user.id)
          .eq("status", "pending");

        if (reservationError) {
          console.error("Error fetching reservation requests:", reservationError);
          return;
        }

        // Count pending verification status updates
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("verification_status")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          return;
        }

        // Only count pending reservation requests
        // Don't include verification status as a permanent notification
        const count = reservationRequests?.length || 0;

        setNotificationCount(count);
      } catch (error) {
        console.error("Error in fetchNotifications:", error);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for bookings
    const bookingsSubscription = supabase
      .channel(`notifications-bookings-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `host_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      supabase.removeChannel(bookingsSubscription);
      clearInterval(interval);
    };
  }, [user]);

  return notificationCount;
};
