
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, ClipboardList, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationDropdown = () => {
  const { user } = useAuth();
  const notificationCount = useNotifications();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const notificationsList = [];

      // Fetch pending reservation requests for hosts
      const { data: reservationRequests } = await supabase
        .from("bookings")
        .select(`
          id,
          created_at,
          check_in_date,
          check_out_date,
          properties(title),
          profiles!guest_id(full_name)
        `)
        .eq("host_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (reservationRequests) {
        reservationRequests.forEach(request => {
          notificationsList.push({
            id: request.id,
            type: 'reservation_request',
            title: 'New Reservation Request',
            message: `${(request.profiles as any)?.full_name || 'A guest'} wants to book ${(request.properties as any)?.title}`,
            timestamp: request.created_at,
            link: '/profile?tab=requests'
          });
        });
      }

      // Check verification status
      const { data: profile } = await supabase
        .from("profiles")
        .select("verification_status")
        .eq("id", user.id)
        .single();

      if (profile?.verification_status === 'verified') {
        notificationsList.push({
          id: 'verification_approved',
          type: 'verification',
          title: 'Identity Verified',
          message: 'Your identity has been successfully verified!',
          timestamp: new Date().toISOString(),
          link: '/profile?tab=verification'
        });
      }

      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownOpen = () => {
    fetchNotifications();
  };

  if (!user) return null;

  return (
    <DropdownMenu onOpenChange={(open) => open && handleDropdownOpen()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-5"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="p-2">
          <h3 className="font-medium">Notifications</h3>
        </div>
        
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild className="p-0">
              <Link to={notification.link} className="flex items-start space-x-3 p-3 hover:bg-muted">
                <div className="flex-shrink-0 mt-1">
                  {notification.type === 'reservation_request' && (
                    <ClipboardList className="h-4 w-4 text-blue-500" />
                  )}
                  {notification.type === 'verification' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile?tab=requests" className="flex items-center justify-center p-2 text-sm">
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
