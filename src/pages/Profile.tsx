
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Camera, Home, LogOut, Shield, Mail, Package, MessageSquare, Heart, Calendar, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import IdVerification from "@/components/IdVerification";
import ChangePassword from "@/components/ChangePassword";
import MyProperties from "@/components/host/MyProperties";
import Inbox from "@/components/messaging/Inbox";
import ReservationRequests from "@/components/ReservationRequests";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
    is_host: false,
    verification_status: "unverified"
  });

  const defaultTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    fetchSavedProperties();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error) {
      console.log("Profile fetch error:", error);
    } else if (data) {
      setProfile(data);
    }
  };

  const fetchSavedProperties = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("saved_properties")
        .select(`
          id,
          property_id,
          properties (
            id,
            title,
            city,
            governorate,
            price_per_night,
            photos,
            property_type,
            bedrooms,
            bathrooms
          )
        `)
        .eq("user_id", user.id);
      if (error) throw error;
      setSavedProperties(data || []);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
    }
  };

  const removeSavedProperty = async (savedPropertyId: string) => {
    try {
      const { error } = await supabase
        .from("saved_properties")
        .delete()
        .eq("id", savedPropertyId);
      if (error) throw error;
      setSavedProperties(prev => prev.filter(item => item.id !== savedPropertyId));
      toast({
        title: "Removed from saved",
        description: "Property removed from your saved list"
      });
    } catch (error) {
      console.error("Error removing saved property:", error);
      toast({
        title: "Error",
        description: "Failed to remove property from saved list",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString()
      });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const becomeHost = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_host: true })
      .eq("id", user.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to become a host",
        variant: "destructive"
      });
    } else {
      setProfile({ ...profile, is_host: true });
      toast({
        title: "Welcome Host!",
        description: "You can now create property listings"
      });
      navigate("/host/onboarding");
    }
    setLoading(false);
  };

  const handleVerificationSubmitted = () => {
    setProfile({ ...profile, verification_status: 'pending' });
  };

  const handleAvatarUpdate = (newUrl: string) => {
    setProfile({ ...profile, avatar_url: newUrl });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <ProfilePictureUpload 
                      currentAvatarUrl={profile.avatar_url} 
                      userInitial={profile.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"} 
                      userId={user.id} 
                      onAvatarUpdate={handleAvatarUpdate} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input 
                        id="full_name" 
                        value={profile.full_name} 
                        onChange={e => setProfile({ ...profile, full_name: e.target.value })} 
                        placeholder="Enter your full name" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profile.phone} 
                        onChange={e => setProfile({ ...profile, phone: e.target.value })} 
                        placeholder="+216 XX XXX XXX" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled className="bg-muted" />
                    </div>
                  </div>

                  <Button onClick={updateProfile} disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <IdVerification 
                verificationStatus={profile.verification_status} 
                onVerificationSubmitted={handleVerificationSubmitted} 
              />
            </TabsContent>

            <TabsContent value="properties">
              <div className="space-y-6">
                {/* Host Status Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Home className="h-5 w-5" />
                      <span>Hosting Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.is_host ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="text-green-600 font-medium">You are a verified host</span>
                        </div>
                        <p className="text-muted-foreground">
                          You can create and manage property listings below.
                        </p>
                        <Button onClick={() => navigate("/host/onboarding")}>
                          Create New Listing
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Become a host and start earning by renting out your property.
                        </p>
                        <Button onClick={becomeHost} disabled={loading}>
                          {loading ? "Processing..." : "Become a Host"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Properties Management Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>My Properties</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.is_host ? (
                      <MyProperties />
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">
                          You need to become a host to create and manage properties.
                        </p>
                        <Button onClick={becomeHost} disabled={loading}>
                          {loading ? "Processing..." : "Become a Host"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Saved Properties</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedProperties.length === 0 ? (
                    <div className="text-center py-6">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You haven't saved any properties yet.
                      </p>
                      <Button onClick={() => navigate("/search")}>
                        Browse Properties
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedProperties.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="relative h-20 w-20 bg-muted rounded overflow-hidden">
                            {item.properties.photos && Array.isArray(item.properties.photos) && item.properties.photos.length > 0 ? (
                              <img 
                                src={(item.properties.photos[0] as any)?.url || "/placeholder.svg"} 
                                alt={item.properties.title} 
                                className="object-cover w-full h-full" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                No photo
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.properties.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.properties.city}, {item.properties.governorate}
                            </p>
                            <p className="text-sm">
                              {item.properties.property_type} • {item.properties.bedrooms} bed • {item.properties.bathrooms} bath
                            </p>
                            <p className="font-medium">{item.properties.price_per_night} TND/night</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/property/${item.properties.id}`)}>
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => removeSavedProperty(item.id)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inbox">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Inbox />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5" />
                    <span>Reservation Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.is_host ? (
                    <ReservationRequests />
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        You need to be a host to receive reservation requests.
                      </p>
                      <Button onClick={becomeHost} disabled={loading}>
                        {loading ? "Processing..." : "Become a Host"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <ChangePassword />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Account created</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Email verified</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.email_confirmed_at ? "Yes" : "Pending verification"}
                        </p>
                      </div>
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
