import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, UserRound, Send, Clock, Home, Calendar, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
type Conversation = {
  id: string;
  property_id: string;
  property_title?: string;
  other_user_id: string;
  other_user_name?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  booking_id?: string;
  check_in_date?: string;
  check_out_date?: string;
  deleted_by_host?: boolean;
  deleted_by_guest?: boolean;
};
type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
};
const Inbox: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (user) {
      fetchConversations();

      // Set up real-time subscription for conversations
      const conversationChannel = supabase.channel('conversations-changes').on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        fetchConversations();
      }).on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, payload => {
        console.log('Message event:', payload);
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message;
          // If it's a new message in the active conversation, add it to messages
          if (activeConversation && newMessage.conversation_id === activeConversation.id) {
            setMessages(prev => [...prev, newMessage]);
          }
          // Refresh conversations to update last message and unread count
          fetchConversations();
        }
        if (payload.eventType === 'UPDATE') {
          const updatedMessage = payload.new as Message;
          // If message was marked as read, update local state
          if (activeConversation && updatedMessage.conversation_id === activeConversation.id) {
            setMessages(prev => prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
          }
          // Refresh conversations to update unread count
          fetchConversations();
        }
      }).subscribe();
      return () => {
        supabase.removeChannel(conversationChannel);
      };
    }
  }, [user, activeConversation?.id]);
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      markMessagesAsRead(activeConversation.id);
    }
  }, [activeConversation]);
  const fetchConversations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data: conversationsData,
        error
      } = await supabase.from('conversations').select(`
          id,
          property_id,
          host_id,
          guest_id,
          booking_id,
          created_at,
          updated_at,
          deleted_by_host,
          deleted_by_guest,
          properties (
            title
          )
        `).or(`host_id.eq.${user.id},guest_id.eq.${user.id}`).order('updated_at', {
        ascending: false
      });
      if (error) throw error;

      // Filter out conversations that the current user has deleted
      const filteredConversations = conversationsData?.filter(conv => {
        const isHost = conv.host_id === user.id;
        if (isHost && conv.deleted_by_host) return false;
        if (!isHost && conv.deleted_by_guest) return false;
        return true;
      }) || [];

      // Get profiles for other users
      const otherUserIds = filteredConversations?.map(conv => conv.host_id === user.id ? conv.guest_id : conv.host_id) || [];
      const {
        data: profilesData
      } = await supabase.from('profiles').select('id, full_name').in('id', otherUserIds);

      // Get last messages and unread counts
      const conversationIds = filteredConversations?.map(conv => conv.id) || [];
      const {
        data: lastMessages
      } = await supabase.from('messages').select('conversation_id, content, created_at').in('conversation_id', conversationIds).order('created_at', {
        ascending: false
      });
      const {
        data: unreadCounts
      } = await supabase.from('messages').select('conversation_id, sender_id').in('conversation_id', conversationIds).eq('read', false).neq('sender_id', user.id);
      const formattedConversations: Conversation[] = filteredConversations?.map(conv => {
        const otherUserId = conv.host_id === user.id ? conv.guest_id : conv.host_id;
        const otherUser = profilesData?.find(p => p.id === otherUserId);
        const lastMessage = lastMessages?.find(m => m.conversation_id === conv.id);
        const unreadCount = unreadCounts?.filter(m => m.conversation_id === conv.id).length || 0;
        return {
          id: conv.id,
          property_id: conv.property_id,
          property_title: (conv.properties as any)?.title || 'Property',
          other_user_id: otherUserId,
          other_user_name: otherUser?.full_name || 'Unknown User',
          last_message: lastMessage?.content || 'No messages yet',
          last_message_time: lastMessage?.created_at || conv.created_at,
          unread_count: unreadCount,
          booking_id: conv.booking_id,
          deleted_by_host: conv.deleted_by_host,
          deleted_by_guest: conv.deleted_by_guest
        };
      }) || [];
      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const loadMessages = async (conversationId: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', {
        ascending: true
      });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;
    try {
      const {
        error
      } = await supabase.from('messages').update({
        read: true
      }).eq('conversation_id', conversationId).eq('read', false).neq('sender_id', user.id);
      if (error) throw error;

      // Update unread count in local state
      setConversations(prev => prev.map(conv => conv.id === conversationId ? {
        ...conv,
        unread_count: 0
      } : conv));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;
    setSendingMessage(true);
    try {
      const {
        data,
        error
      } = await supabase.from('messages').insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: newMessage.trim()
      }).select().single();
      if (error) throw error;

      // Update conversation's last message time
      await supabase.from('conversations').update({
        updated_at: new Date().toISOString()
      }).eq('id', activeConversation.id);
      setNewMessage('');

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };
  const deleteConversation = async (conversationId: string) => {
    if (!user) return;
    try {
      // First, get the conversation to determine user role
      const {
        data: conversation,
        error: fetchError
      } = await supabase.from('conversations').select('host_id, guest_id, deleted_by_host, deleted_by_guest').eq('id', conversationId).single();
      if (fetchError) throw fetchError;
      const isHost = conversation.host_id === user.id;
      const updateField = isHost ? 'deleted_by_host' : 'deleted_by_guest';

      // Mark as deleted by current user
      const {
        error: updateError
      } = await supabase.from('conversations').update({
        [updateField]: true
      }).eq('id', conversationId);
      if (updateError) throw updateError;

      // Check if both users have now deleted it
      const bothDeleted = isHost ? true && conversation.deleted_by_guest : conversation.deleted_by_host && true;
      if (bothDeleted) {
        // If both have deleted, actually delete the conversation and all messages
        await supabase.from('messages').delete().eq('conversation_id', conversationId);
        await supabase.from('conversations').delete().eq('id', conversationId);
      }

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
      toast({
        title: "Conversation deleted",
        description: bothDeleted ? "The conversation has been permanently removed" : "The conversation has been removed from your view"
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive"
      });
    }
  };
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return format(date, 'HH:mm');
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMM d');
    }
  };
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  if (!user) return null;
  return <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="bookings">Booking Related</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="py-3">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Conversations
                </CardTitle>
              </CardHeader>
              
              <ScrollArea className="flex-1">
                <CardContent className="p-3">
                  {loading ? <div className="text-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading conversations...</p>
                    </div> : conversations.length === 0 ? <div className="text-center py-10">
                      <p className="text-muted-foreground">No messages yet</p>
                    </div> : <div className="space-y-2">
                      {conversations.map(conversation => <div key={conversation.id} className="relative group">
                          <div className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`} onClick={() => setActiveConversation(conversation)}>
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-medium flex items-center">
                                <UserRound className="h-4 w-4 mr-1.5" />
                                {conversation.other_user_name}
                                {conversation.unread_count > 0 && <Badge variant="default" className="ml-2 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                                    {conversation.unread_count}
                                  </Badge>}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(conversation.last_message_time)}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                                <span className="inline-flex items-center">
                                  <Home className="h-3 w-3 mr-1 inline" />
                                  {conversation.property_title}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm truncate mt-1">
                              {conversation.last_message}
                            </p>
                          </div>
                          
                          {/* Delete button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this conversation? This will remove it from your view, but the other person will still see it unless they also delete it.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteConversation(conversation.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>)}
                    </div>}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
          
          {/* Message Detail */}
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {!activeConversation ? <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a conversation from the list to view messages
                    </p>
                  </div>
                </div> : <>
                  <CardHeader className="py-3 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base">{activeConversation.other_user_name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Home className="h-3.5 w-3.5 mr-1" />
                          {activeConversation.property_title}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(message => {
                    const isCurrentUser = message.sender_id === user.id;
                    return <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p>{message.content}</p>
                              <div className={`text-xs mt-1 flex items-center ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                <Clock className="h-3 w-3 mr-1" />
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                          </div>;
                  })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }} />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sendingMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>}
            </Card>
          </div>
        </div>
      </Tabs>
    </div>;
};
export default Inbox;