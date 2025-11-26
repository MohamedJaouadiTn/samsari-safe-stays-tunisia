
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, FileText, User, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [verifications, setVerifications] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin', {
        user_email: user.email
      });

      if (error) throw error;

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadAdminData();
    } catch (error) {
      console.error('Admin check error:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      // Load ID verifications
      const { data: verificationsData, error: verError } = await supabase
        .from('id_verifications')
        .select(`
          *,
          profiles!inner(full_name, avatar_url)
        `)
        .order('submitted_at', { ascending: false });

      if (verError) throw verError;
      setVerifications(verificationsData || []);

      // Load all profiles
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;
      setProfiles(profilesData || []);

      // Load all properties
      const { data: propertiesData, error: propError } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });

      if (propError) throw propError;
      setProperties(propertiesData || []);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    }
  };

  const handleVerificationUpdate = async (verificationId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('id_verifications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: notes || null
        })
        .eq('id', verificationId);

      if (error) throw error;

      // Update profile verification status
      const verification = verifications.find(v => v.id === verificationId);
      if (verification) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            verification_status: status === 'approved' ? 'verified' : 'rejected'
          })
          .eq('id', verification.user_id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: `Verification ${status} successfully`,
      });

      loadAdminData();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: "Failed to update verification",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
          
          <Tabs defaultValue="verifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verifications">
                <FileText className="w-4 h-4 mr-2" />
                ID Verifications ({verifications.length})
              </TabsTrigger>
              <TabsTrigger value="users">
                <User className="w-4 h-4 mr-2" />
                Users ({profiles.length})
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Home className="w-4 h-4 mr-2" />
                Properties ({properties.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verifications" className="space-y-4">
              <div className="grid gap-4">
                {verifications.map((verification) => (
                  <Card key={verification.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg">{verification.profiles?.full_name || 'Unknown User'}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(verification.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(verification.status)}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="font-medium mb-2">CIN Front</p>
                          <img 
                            src={verification.cin_front_url} 
                            alt="CIN Front" 
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                        <div>
                          <p className="font-medium mb-2">CIN Back</p>
                          <img 
                            src={verification.cin_back_url} 
                            alt="CIN Back" 
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                        <div>
                          <p className="font-medium mb-2">Selfie with CIN</p>
                          <img 
                            src={verification.selfie_url} 
                            alt="Selfie" 
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      </div>
                      
                      {verification.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            onClick={() => handleVerificationUpdate(verification.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleVerificationUpdate(verification.id, 'rejected', 'Rejected by admin')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {verification.reviewer_notes && (
                        <div className="mt-4 p-3 bg-muted rounded">
                          <p className="font-medium">Reviewer Notes:</p>
                          <p className="text-sm">{verification.reviewer_notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="grid gap-4">
                {profiles.map((profile) => (
                  <Card key={profile.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            {profile.avatar_url ? (
                              <img 
                                src={profile.avatar_url} 
                                alt={profile.full_name || 'User'} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <CardTitle>{profile.full_name || 'No name'}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Joined: {new Date(profile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(profile.verification_status)}
                          {profile.is_host && <Badge variant="outline">Host</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p>Phone: {profile.phone || 'Not provided'}</p>
                        <p>Username: {profile.username || 'Not set'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <div className="grid gap-4">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{property.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Host: {property.profiles?.full_name} • {property.city}, {property.governorate}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(property.status)}
                          {property.is_public ? (
                            <Badge variant="default">Public</Badge>
                          ) : (
                            <Badge variant="secondary">Private</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Price</p>
                          <p>{property.price_per_night} TND/night</p>
                        </div>
                        <div>
                          <p className="font-medium">Guests</p>
                          <p>{property.max_guests} guests</p>
                        </div>
                        <div>
                          <p className="font-medium">Bedrooms</p>
                          <p>{property.bedrooms} bedrooms</p>
                        </div>
                        <div>
                          <p className="font-medium">Bathrooms</p>
                          <p>{property.bathrooms} bathrooms</p>
                        </div>
                      </div>
                      {property.description && (
                        <p className="mt-4 text-sm text-muted-foreground">
                          {property.description.substring(0, 150)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
