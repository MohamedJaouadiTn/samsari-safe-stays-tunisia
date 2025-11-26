
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastViewedTime, setLastViewedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load last viewed time from localStorage
    const stored = localStorage.getItem(`notifications_last_viewed_${user.id}`);
    if (stored) {
      setLastViewedTime(stored);
    }

    const fetchNotifications = async () => {
      try {
        // Count pending reservation requests for hosts created after last view
        const { data: reservationRequests, error: reservationError } = await supabase
          .from("bookings")
          .select("id, created_at")
          .eq("host_id", user.id)
          .eq("status", "pending");

        if (reservationError) {
          console.error("Error fetching reservation requests:", reservationError);
          return;
        }

        // Only count requests created after last viewed time
        let count = 0;
        if (reservationRequests) {
          const lastViewed = stored || new Date(0).toISOString();
          count = reservationRequests.filter(req => req.created_at > lastViewed).length;
        }

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

  const markAsViewed = () => {
    if (!user) return;
    const now = new Date().toISOString();
    localStorage.setItem(`notifications_last_viewed_${user.id}`, now);
    setLastViewedTime(now);
    setNotificationCount(0);
  };

  return { notificationCount, markAsViewed };
};
