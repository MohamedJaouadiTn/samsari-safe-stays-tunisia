
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        // Get all conversations for the user
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('id')
          .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`);

        if (convError) throw convError;

        if (!conversations || conversations.length === 0) {
          setUnreadCount(0);
          return;
        }

        // Get unread messages count - only messages sent by other users
        const { data: unreadMessages, error: msgError } = await supabase
          .from('messages')
          .select('id')
          .in('conversation_id', conversations.map(c => c.id))
          .eq('read', false)
          .neq('sender_id', user.id);

        if (msgError) throw msgError;

        const count = unreadMessages?.length || 0;
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
        setUnreadCount(0);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up real-time subscription with immediate updates
    const channel = supabase
      .channel('unread-messages-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        // If it's not from the current user, increment count
        if (payload.new.sender_id !== user.id) {
          fetchUnreadCount();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        // If message was marked as read, update count immediately
        if (payload.new.read === true && payload.old.read === false) {
          fetchUnreadCount();
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return unreadCount;
};
