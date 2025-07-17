
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  UserRound, 
  Send, 
  Clock, 
  Home,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';

type Conversation = {
  id: string;
  property_id: string;
  property_title: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  booking_id?: string;
  check_in_date?: string;
  check_out_date?: string;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // For now, since we don't have a real messaging system implemented,
  // we'll use this mock data for demonstration purposes
  useEffect(() => {
    if (user) {
      // Simulating API call with timeout
      setTimeout(() => {
        const mockConversations: Conversation[] = [
          {
            id: '1',
            property_id: 'prop1',
            property_title: 'Beautiful Villa in Hammamet',
            other_user_id: 'user1',
            other_user_name: 'Ahmed Ben Ali',
            last_message: 'Hello, I have a question about your property',
            last_message_time: new Date().toISOString(),
            unread_count: 2,
            booking_id: 'book1',
            check_in_date: '2025-08-01',
            check_out_date: '2025-08-05'
          },
          {
            id: '2',
            property_id: 'prop2',
            property_title: 'Cozy Apartment in Sousse',
            other_user_id: 'user2',
            other_user_name: 'Leila Mejri',
            last_message: 'Thanks for accepting my booking!',
            last_message_time: new Date(Date.now() - 86400000).toISOString(), // yesterday
            unread_count: 0
          }
        ];

        setConversations(mockConversations);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      
      // Mark messages as read
      if (activeConversation.unread_count > 0) {
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === activeConversation.id 
              ? { ...conv, unread_count: 0 }
              : conv
          )
        );
      }
    }
  }, [activeConversation]);

  const loadMessages = (conversationId: string) => {
    // Simulate loading messages
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: 'm1',
          conversation_id: conversationId,
          sender_id: 'user1', // the other person
          content: 'Hello, I have a question about your property',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: true
        },
        {
          id: 'm2',
          conversation_id: conversationId,
          sender_id: user?.id || '', // current user
          content: 'Hi there! What would you like to know?',
          created_at: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
          read: true
        },
        {
          id: 'm3',
          conversation_id: conversationId,
          sender_id: 'user1',
          content: 'Is the property close to the beach?',
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          read: conversationId !== '1'
        }
      ];
      
      setMessages(mockMessages);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !user) return;
    
    setSendingMessage(true);
    
    // Simulate sending a message
    setTimeout(() => {
      const newMsg: Message = {
        id: `m${Date.now()}`,
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: newMessage,
        created_at: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // Update last message in conversation list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation.id 
            ? { 
                ...conv, 
                last_message: newMessage,
                last_message_time: new Date().toISOString()
              }
            : conv
        )
      );
      
      setNewMessage('');
      setSendingMessage(false);
    }, 500);
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

  if (!user) return null;

  return (
    <div className="w-full">
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
                  {loading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading conversations...</p>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                            activeConversation?.id === conversation.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setActiveConversation(conversation)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium flex items-center">
                              <UserRound className="h-4 w-4 mr-1.5" />
                              {conversation.other_user_name}
                              {conversation.unread_count > 0 && (
                                <Badge variant="default" className="ml-2 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                                  {conversation.unread_count}
                                </Badge>
                              )}
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
          
          {/* Message Detail */}
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {!activeConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a conversation from the list to view messages
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <CardHeader className="py-3 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base">{activeConversation.other_user_name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Home className="h-3.5 w-3.5 mr-1" />
                          {activeConversation.property_title}
                        </p>
                      </div>
                      
                      {activeConversation.booking_id && (
                        <div className="bg-muted rounded-md p-2 text-xs">
                          <div className="flex items-center font-medium mb-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Booking Details
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Check-in:</span>
                            <span className="font-medium">
                              {activeConversation.check_in_date ? 
                                format(new Date(activeConversation.check_in_date), 'MMM d, yyyy') : 
                                'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Check-out:</span>
                            <span className="font-medium">
                              {activeConversation.check_out_date ? 
                                format(new Date(activeConversation.check_out_date), 'MMM d, yyyy') : 
                                'N/A'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isCurrentUser = message.sender_id === user.id;
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                isCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div 
                                className={`text-xs mt-1 flex items-center ${
                                  isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                }`}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Inbox;
