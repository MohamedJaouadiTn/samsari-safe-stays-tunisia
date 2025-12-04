
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
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
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
      const { data, error } = await supabase.rpc('is_admin');

      if (error) throw error;

      if (!data) {
        toast({
          title: t('admin.access_denied'),
          description: t('admin.no_privileges'),
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
        .select('*')
        .order('submitted_at', { ascending: false });

      if (verError) throw verError;

      // Load profiles separately and merge
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;
      setProfiles(profilesData || []);

      // Merge verifications with profiles and generate signed URLs for images
      const verificationsWithProfiles = await Promise.all(
        (verificationsData || []).map(async (ver) => {
          const profile = profilesData?.find(p => p.id === ver.user_id);
          
          // Build R2 URLs directly for ID images
          const r2BaseUrl = 'https://cc8fc3ec000887e083db6cdb990774c4.r2.cloudflarestorage.com/samsari';
          
          return {
            ...ver,
            cin_front_signed_url: ver.cin_front_url ? `${r2BaseUrl}/id-verification/${ver.cin_front_url}` : null,
            cin_back_signed_url: ver.cin_back_url ? `${r2BaseUrl}/id-verification/${ver.cin_back_url}` : null,
            selfie_signed_url: ver.selfie_url ? `${r2BaseUrl}/id-verification/${ver.selfie_url}` : null,
            profiles: profile ? { full_name: profile.full_name, avatar_url: profile.avatar_url } : null
          };
        })
      );
      setVerifications(verificationsWithProfiles);

      // Load all properties
      const { data: propertiesData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propError) throw propError;

      // Merge properties with profiles
      const propertiesWithProfiles = propertiesData?.map(prop => {
        const profile = profilesData?.find(p => p.id === prop.host_id);
        return {
          ...prop,
          profiles: profile ? { full_name: profile.full_name } : null
        };
      }) || [];
      setProperties(propertiesWithProfiles);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: t('common.error'),
        description: t('admin.error_loading'),
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
        title: t('common.success'),
        description: t('admin.verification_updated'),
      });

      loadAdminData();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: t('common.error'),
        description: t('admin.error_updating'),
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t('status.pending')}</Badge>;
      case 'approved':
      case 'verified':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />{t('status.approved')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t('status.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('admin.loading')}</p>
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
          <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>
          
          <Tabs defaultValue="verifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verifications">
                <FileText className="w-4 h-4 mr-2" />
                {t('admin.verifications')} ({verifications.length})
              </TabsTrigger>
              <TabsTrigger value="users">
                <User className="w-4 h-4 mr-2" />
                {t('admin.users')} ({profiles.length})
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Home className="w-4 h-4 mr-2" />
                {t('admin.properties')} ({properties.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verifications" className="space-y-4">
              <div className="grid gap-4">
                {verifications.map((verification) => (
                  <Card key={verification.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg">{verification.profiles?.full_name || t('admin.unknown_user')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {t('admin.submitted')}: {new Date(verification.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(verification.status)}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="font-medium mb-2">{t('admin.cin_front')}</p>
                          {verification.cin_front_signed_url ? (
                            <img 
                              src={verification.cin_front_signed_url} 
                              alt={t('admin.cin_front')} 
                              className="w-full h-32 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded border flex items-center justify-center text-sm text-muted-foreground">
                              {t('common.no_image')}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium mb-2">{t('admin.cin_back')}</p>
                          {verification.cin_back_signed_url ? (
                            <img 
                              src={verification.cin_back_signed_url} 
                              alt={t('admin.cin_back')} 
                              className="w-full h-32 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded border flex items-center justify-center text-sm text-muted-foreground">
                              {t('common.no_image')}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium mb-2">{t('admin.selfie')}</p>
                          {verification.selfie_signed_url ? (
                            <img 
                              src={verification.selfie_signed_url} 
                              alt={t('admin.selfie')} 
                              className="w-full h-32 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded border flex items-center justify-center text-sm text-muted-foreground">
                              {t('common.no_image')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {verification.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            onClick={() => handleVerificationUpdate(verification.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t('admin.approve')}
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleVerificationUpdate(verification.id, 'rejected', 'Rejected by admin')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            {t('admin.reject')}
                          </Button>
                        </div>
                      )}
                      
                      {verification.reviewer_notes && (
                        <div className="mt-4 p-3 bg-muted rounded">
                          <p className="font-medium">{t('admin.reviewer_notes')}:</p>
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
                              {t('admin.joined')}: {new Date(profile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(profile.verification_status)}
                          {profile.is_host && <Badge variant="outline">{t('admin.host')}</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p>{t('admin.phone')}: {profile.phone || t('admin.not_provided')}</p>
                        <p>{t('admin.username')}: {profile.username || t('admin.not_set')}</p>
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
                            {t('admin.host')}: {property.profiles?.full_name} • {property.city}, {property.governorate}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(property.status)}
                          {property.is_public ? (
                            <Badge variant="default">{t('admin.public')}</Badge>
                          ) : (
                            <Badge variant="secondary">{t('admin.private')}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{t('admin.price')}</p>
                          <p>{property.price_per_night} TND/{t('admin.night')}</p>
                        </div>
                        <div>
                          <p className="font-medium">{t('admin.guests')}</p>
                          <p>{property.max_guests} {t('admin.guests').toLowerCase()}</p>
                        </div>
                        <div>
                          <p className="font-medium">{t('admin.bedrooms')}</p>
                          <p>{property.bedrooms} {t('admin.bedrooms').toLowerCase()}</p>
                        </div>
                        <div>
                          <p className="font-medium">{t('admin.bathrooms')}</p>
                          <p>{property.bathrooms} {t('admin.bathrooms').toLowerCase()}</p>
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
