
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, XCircle, Clock, FileText, User, Home, 
  Search, Ban, Snowflake, Trash2, ShieldAlert, AlertTriangle,
  Shield, Eye, EyeOff
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  
  // Search states
  const [propertySearch, setPropertySearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  
  // Dialog states
  const [rejectionDialog, setRejectionDialog] = useState<{
    open: boolean;
    verificationId: string | null;
    notes: string;
    allowResubmit: boolean;
  }>({
    open: false,
    verificationId: null,
    notes: '',
    allowResubmit: true
  });

  const [propertyActionDialog, setPropertyActionDialog] = useState<{
    open: boolean;
    propertyId: string | null;
    action: 'freeze' | 'ban' | 'delete' | null;
    reason: string;
  }>({
    open: false,
    propertyId: null,
    action: null,
    reason: ''
  });

  const [userActionDialog, setUserActionDialog] = useState<{
    open: boolean;
    userId: string | null;
    action: 'ban' | 'warn' | 'role' | null;
    reason: string;
    selectedRole: string;
  }>({
    open: false,
    userId: null,
    action: null,
    reason: '',
    selectedRole: ''
  });

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

      // Load user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*');
      setUserRoles(rolesData || []);

      // Helper function to get signed URL from edge function
      const getSignedUrl = async (path: string): Promise<string | null> => {
        try {
          const { data, error } = await supabase.functions.invoke('get-signed-url', {
            body: { path }
          });
          if (error) {
            console.error('Error getting signed URL:', error);
            return null;
          }
          return data?.url || null;
        } catch (err) {
          console.error('Failed to get signed URL:', err);
          return null;
        }
      };

      // Merge verifications with profiles and generate signed URLs for images
      const verificationsWithProfiles = await Promise.all(
        (verificationsData || []).map(async (ver: any) => {
          const profile = profilesData?.find((p: any) => p.id === ver.user_id);
          
          // Get signed URLs for ID verification images (secure, time-limited)
          const [cinFrontUrl, cinBackUrl, selfieUrl] = await Promise.all([
            ver.cin_front_url ? getSignedUrl(`id-verification/${ver.cin_front_url}`) : null,
            ver.cin_back_url ? getSignedUrl(`id-verification/${ver.cin_back_url}`) : null,
            ver.selfie_url ? getSignedUrl(`id-verification/${ver.selfie_url}`) : null
          ]);
          
          return {
            ...ver,
            cin_front_signed_url: cinFrontUrl,
            cin_back_signed_url: cinBackUrl,
            selfie_signed_url: selfieUrl,
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
      const propertiesWithProfiles = propertiesData?.map((prop: any) => {
        const profile = profilesData?.find((p: any) => p.id === prop.host_id);
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

  const handleVerificationUpdate = async (verificationId: string, status: string, notes?: string, allowResubmit: boolean = true) => {
    try {
      const verification = verifications.find((v: any) => v.id === verificationId);
      
      // Update verification record
      const { error } = await supabase
        .from('id_verifications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: notes || null,
          allow_resubmit: allowResubmit,
          warning_count: status === 'rejected' ? (verification?.warning_count || 0) + 1 : verification?.warning_count || 0
        })
        .eq('id', verificationId);

      if (error) throw error;

      // Update profile verification status
      if (verification) {
        const newStatus = status === 'approved' 
          ? 'verified' 
          : (status === 'rejected_final' ? 'rejected' : 'unverified');
        
        const updateData: any = {
          verification_status: newStatus
        };

        // Add warning if rejected
        if (status === 'rejected' || status === 'rejected_final') {
          updateData.warning_count = (profiles.find((p: any) => p.id === verification.user_id)?.warning_count || 0) + 1;
          updateData.last_warning_at = new Date().toISOString();
          updateData.last_warning_reason = notes || 'ID verification rejected';
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
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

  const openRejectionDialog = (verificationId: string) => {
    setRejectionDialog({
      open: true,
      verificationId,
      notes: '',
      allowResubmit: true
    });
  };

  const handleReject = () => {
    if (!rejectionDialog.verificationId) return;
    
    const status = rejectionDialog.allowResubmit ? 'rejected' : 'rejected_final';
    handleVerificationUpdate(
      rejectionDialog.verificationId, 
      status, 
      rejectionDialog.notes,
      rejectionDialog.allowResubmit
    );
    
    setRejectionDialog({
      open: false,
      verificationId: null,
      notes: '',
      allowResubmit: true
    });
  };

  // Property actions
  const handlePropertyAction = async () => {
    if (!propertyActionDialog.propertyId || !propertyActionDialog.action) return;

    try {
      const now = new Date().toISOString();

      if (propertyActionDialog.action === 'delete') {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', propertyActionDialog.propertyId);
        if (error) throw error;
      } else if (propertyActionDialog.action === 'freeze') {
        const property = properties.find((p: any) => p.id === propertyActionDialog.propertyId);
        const { error } = await supabase
          .from('properties')
          .update({
            is_frozen: !property?.is_frozen,
            frozen_at: !property?.is_frozen ? now : null,
            frozen_reason: !property?.is_frozen ? propertyActionDialog.reason : null
          })
          .eq('id', propertyActionDialog.propertyId);
        if (error) throw error;
      } else if (propertyActionDialog.action === 'ban') {
        const property = properties.find((p: any) => p.id === propertyActionDialog.propertyId);
        const { error } = await supabase
          .from('properties')
          .update({
            is_banned: !property?.is_banned,
            banned_at: !property?.is_banned ? now : null,
            banned_reason: !property?.is_banned ? propertyActionDialog.reason : null,
            is_public: false // Always hide banned properties
          })
          .eq('id', propertyActionDialog.propertyId);
        if (error) throw error;
      }

      toast({
        title: t('common.success'),
        description: `Property ${propertyActionDialog.action}ed successfully`
      });

      setPropertyActionDialog({ open: false, propertyId: null, action: null, reason: '' });
      loadAdminData();
    } catch (error) {
      console.error('Property action error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to perform action',
        variant: "destructive"
      });
    }
  };

  // User actions
  const handleUserAction = async () => {
    if (!userActionDialog.userId || !userActionDialog.action) return;

    try {
      const now = new Date().toISOString();
      const profile = profiles.find((p: any) => p.id === userActionDialog.userId);

      if (userActionDialog.action === 'ban') {
        const { error } = await supabase
          .from('profiles')
          .update({
            is_banned: !profile?.is_banned,
            banned_at: !profile?.is_banned ? now : null,
            banned_reason: !profile?.is_banned ? userActionDialog.reason : null
          })
          .eq('id', userActionDialog.userId);
        if (error) throw error;
      } else if (userActionDialog.action === 'warn') {
        const { error } = await supabase
          .from('profiles')
          .update({
            warning_count: (profile?.warning_count || 0) + 1,
            last_warning_at: now,
            last_warning_reason: userActionDialog.reason
          })
          .eq('id', userActionDialog.userId);
        if (error) throw error;
      } else if (userActionDialog.action === 'role' && userActionDialog.selectedRole) {
        // Check if role already exists
        const existingRole = userRoles.find(
          (r: any) => r.user_id === userActionDialog.userId && r.role === userActionDialog.selectedRole
        );
        
        if (existingRole) {
          // Remove role
          const { error } = await supabase
            .from('user_roles')
            .delete()
            .eq('id', existingRole.id);
          if (error) throw error;
        } else {
          // Add role - cast to bypass strict typing until types are regenerated
          const { error } = await supabase
            .from('user_roles')
            .insert([{
              user_id: userActionDialog.userId,
              role: userActionDialog.selectedRole as 'admin' | 'moderator' | 'support',
              created_by: user?.id
            }]);
          if (error) throw error;
        }
      }

      toast({
        title: t('common.success'),
        description: `User ${userActionDialog.action} action completed`
      });

      setUserActionDialog({ open: false, userId: null, action: null, reason: '', selectedRole: '' });
      loadAdminData();
    } catch (error) {
      console.error('User action error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to perform action',
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
      case 'rejected_final':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t('status.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserRoleBadges = (userId: string) => {
    const roles = userRoles.filter((r: any) => r.user_id === userId);
    return roles.map((r: any) => (
      <Badge key={r.id} variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200">
        <Shield className="w-3 h-3 mr-1" />
        {r.role}
      </Badge>
    ));
  };

  // Filter properties
  const filteredProperties = properties.filter((property: any) => {
    if (!propertySearch) return true;
    const search = propertySearch.toLowerCase();
    return (
      property.title?.toLowerCase().includes(search) ||
      property.id?.toLowerCase().includes(search) ||
      property.short_code?.toLowerCase().includes(search)
    );
  });

  // Filter users
  const filteredProfiles = profiles.filter((profile: any) => {
    if (!userSearch) return true;
    const search = userSearch.toLowerCase();
    return (
      profile.full_name?.toLowerCase().includes(search) ||
      profile.username?.toLowerCase().includes(search) ||
      profile.phone?.toLowerCase().includes(search) ||
      profile.id?.toLowerCase().includes(search)
    );
  });

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
                {verifications.map((verification: any) => (
                  <Card key={verification.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg">{verification.profiles?.full_name || t('admin.unknown_user')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {t('admin.submitted')}: {new Date(verification.submitted_at).toLocaleDateString()}
                            {verification.warning_count > 0 && (
                              <span className="ml-2 text-orange-600">
                                • {verification.warning_count} warning(s)
                              </span>
                            )}
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
                            onClick={() => openRejectionDialog(verification.id)}
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
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, username, phone, or ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-4">
                {filteredProfiles.map((profile: any) => (
                  <Card key={profile.id} className={profile.is_banned ? 'border-red-300 bg-red-50/30' : ''}>
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
                            <CardTitle className="flex items-center">
                              {profile.full_name || 'No name'}
                              {getUserRoleBadges(profile.id)}
                              {profile.is_banned && (
                                <Badge variant="destructive" className="ml-2">
                                  <Ban className="w-3 h-3 mr-1" />
                                  Banned
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {t('admin.joined')}: {new Date(profile.created_at).toLocaleDateString()}
                              {profile.warning_count > 0 && (
                                <span className="ml-2 text-orange-600">
                                  • {profile.warning_count} warning(s)
                                </span>
                              )}
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
                      <div className="flex justify-between items-end">
                        <div className="text-sm text-muted-foreground">
                          <p>{t('admin.phone')}: {profile.phone || t('admin.not_provided')}</p>
                          <p>{t('admin.username')}: {profile.username || t('admin.not_set')}</p>
                          <p className="text-xs mt-1 font-mono">{profile.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserActionDialog({
                              open: true,
                              userId: profile.id,
                              action: 'role',
                              reason: '',
                              selectedRole: ''
                            })}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Roles
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserActionDialog({
                              open: true,
                              userId: profile.id,
                              action: 'warn',
                              reason: '',
                              selectedRole: ''
                            })}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Warn
                          </Button>
                          <Button
                            variant={profile.is_banned ? "default" : "destructive"}
                            size="sm"
                            onClick={() => setUserActionDialog({
                              open: true,
                              userId: profile.id,
                              action: 'ban',
                              reason: '',
                              selectedRole: ''
                            })}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            {profile.is_banned ? 'Unban' : 'Ban'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, ID, or short code..."
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-4">
                {filteredProperties.map((property: any) => (
                  <Card 
                    key={property.id} 
                    className={
                      property.is_banned ? 'border-red-300 bg-red-50/30' : 
                      property.is_frozen ? 'border-blue-300 bg-blue-50/30' : ''
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {property.title}
                            {property.is_frozen && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                <Snowflake className="w-3 h-3 mr-1" />
                                Frozen
                              </Badge>
                            )}
                            {property.is_banned && (
                              <Badge variant="destructive">
                                <Ban className="w-3 h-3 mr-1" />
                                Banned
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {t('admin.host')}: {property.profiles?.full_name} • {property.city}, {property.governorate}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            ID: {property.id} {property.short_code && `• Code: ${property.short_code}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(property.status)}
                          {property.is_public ? (
                            <Badge variant="default"><Eye className="w-3 h-3 mr-1" />{t('admin.public')}</Badge>
                          ) : (
                            <Badge variant="secondary"><EyeOff className="w-3 h-3 mr-1" />{t('admin.private')}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-end">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
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
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPropertyActionDialog({
                              open: true,
                              propertyId: property.id,
                              action: 'freeze',
                              reason: ''
                            })}
                          >
                            <Snowflake className="w-4 h-4 mr-1" />
                            {property.is_frozen ? 'Unfreeze' : 'Freeze'}
                          </Button>
                          <Button
                            variant={property.is_banned ? "default" : "destructive"}
                            size="sm"
                            onClick={() => setPropertyActionDialog({
                              open: true,
                              propertyId: property.id,
                              action: 'ban',
                              reason: ''
                            })}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            {property.is_banned ? 'Unban' : 'Ban'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPropertyActionDialog({
                              open: true,
                              propertyId: property.id,
                              action: 'delete',
                              reason: ''
                            })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Rejection Dialog */}
      <Dialog 
        open={rejectionDialog.open} 
        onOpenChange={(open) => setRejectionDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.reject_verification')}</DialogTitle>
            <DialogDescription>
              {t('admin.reject_description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-notes">{t('admin.rejection_reason')}</Label>
              <Textarea
                id="rejection-notes"
                placeholder={t('admin.rejection_placeholder')}
                value={rejectionDialog.notes}
                onChange={(e) => setRejectionDialog(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow-resubmit"
                checked={rejectionDialog.allowResubmit}
                onCheckedChange={(checked) => 
                  setRejectionDialog(prev => ({ ...prev, allowResubmit: checked === true }))
                }
              />
              <Label htmlFor="allow-resubmit" className="text-sm font-normal">
                {t('admin.allow_resubmit')}
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectionDialog(prev => ({ ...prev, open: false }))}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionDialog.notes.trim()}
            >
              {t('admin.confirm_reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Property Action Dialog */}
      <Dialog 
        open={propertyActionDialog.open} 
        onOpenChange={(open) => setPropertyActionDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {propertyActionDialog.action === 'delete' && 'Delete Property'}
              {propertyActionDialog.action === 'freeze' && 'Freeze/Unfreeze Property'}
              {propertyActionDialog.action === 'ban' && 'Ban/Unban Property'}
            </DialogTitle>
            <DialogDescription>
              {propertyActionDialog.action === 'delete' && 'This action cannot be undone.'}
              {propertyActionDialog.action === 'freeze' && 'Frozen properties cannot receive new bookings.'}
              {propertyActionDialog.action === 'ban' && 'Banned properties will be hidden from search.'}
            </DialogDescription>
          </DialogHeader>
          
          {propertyActionDialog.action !== 'delete' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  placeholder="Enter reason..."
                  value={propertyActionDialog.reason}
                  onChange={(e) => setPropertyActionDialog(prev => ({ ...prev, reason: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPropertyActionDialog(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button 
              variant={propertyActionDialog.action === 'delete' ? 'destructive' : 'default'}
              onClick={handlePropertyAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Action Dialog */}
      <Dialog 
        open={userActionDialog.open} 
        onOpenChange={(open) => setUserActionDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userActionDialog.action === 'ban' && 'Ban/Unban User'}
              {userActionDialog.action === 'warn' && 'Warn User'}
              {userActionDialog.action === 'role' && 'Manage User Roles'}
            </DialogTitle>
            <DialogDescription>
              {userActionDialog.action === 'ban' && 'Banned users cannot access the platform.'}
              {userActionDialog.action === 'warn' && 'Send a warning to this user.'}
              {userActionDialog.action === 'role' && 'Assign or remove roles for this user.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {userActionDialog.action === 'role' ? (
              <div className="space-y-2">
                <Label>Select Role</Label>
                <Select
                  value={userActionDialog.selectedRole}
                  onValueChange={(value) => setUserActionDialog(prev => ({ ...prev, selectedRole: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Current roles: {userRoles.filter((r: any) => r.user_id === userActionDialog.userId).map((r: any) => r.role).join(', ') || 'None'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  placeholder="Enter reason..."
                  value={userActionDialog.reason}
                  onChange={(e) => setUserActionDialog(prev => ({ ...prev, reason: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUserActionDialog(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button 
              variant={userActionDialog.action === 'ban' ? 'destructive' : 'default'}
              onClick={handleUserAction}
              disabled={userActionDialog.action === 'role' && !userActionDialog.selectedRole}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
