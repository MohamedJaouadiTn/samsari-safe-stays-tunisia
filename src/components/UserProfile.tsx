
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "./Header";
import Footer from "./Footer";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserProperties();
      fetchUserRating();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', userId)
        .eq('status', 'published')
        .eq('is_public', true);
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching user properties:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .in('property_id', properties.map(p => p.id));
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setRating(Math.round(avgRating * 10) / 10);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>User not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const userInitial = profile.full_name?.charAt(0) || "U";

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || "User"} />
                  <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.full_name || "User"}
                  </h1>
                  
                  {profile.bio && (
                    <p className="text-muted-foreground mb-4">
                      {profile.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{rating}</span>
                      <span className="text-muted-foreground">({reviewCount} reviews)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">{properties.length} properties</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {properties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Properties</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-muted">
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
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{property.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.city}, {property.governorate}
                        </p>
                        <p className="font-medium">{property.price_per_night} {property.currency}/night</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
