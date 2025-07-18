
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Info, Shield, Clock, CheckCircle, XCircle, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface IdVerificationProps {
  verificationStatus: string | null;
  onVerificationSubmitted: () => void;
}

const IdVerification = ({ verificationStatus, onVerificationSubmitted }: IdVerificationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    cinFront: null as File | null,
    cinBack: null as File | null,
    selfie: null as File | null
  });

  const handleFileUpload = (type: 'cinFront' | 'cinBack' | 'selfie', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('id-verification')
      .upload(path, file);

    if (error) throw error;
    return data;
  };

  const submitVerification = async () => {
    if (!user || !files.cinFront || !files.cinBack || !files.selfie) {
      toast({
        title: "Missing documents",
        description: "Please upload all required documents",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const timestamp = Date.now();
      const userId = user.id;

      // Upload files
      const cinFrontPath = `${userId}/cin-front-${timestamp}.jpg`;
      const cinBackPath = `${userId}/cin-back-${timestamp}.jpg`;
      const selfiePath = `${userId}/selfie-${timestamp}.jpg`;

      await Promise.all([
        uploadFile(files.cinFront, cinFrontPath),
        uploadFile(files.cinBack, cinBackPath),
        uploadFile(files.selfie, selfiePath)
      ]);

      // Create verification record
      const { error } = await supabase
        .from('id_verifications')
        .insert({
          user_id: userId,
          cin_front_url: cinFrontPath,
          cin_back_url: cinBackPath,
          selfie_url: selfiePath
        });

      if (error) throw error;

      // Update profile verification status
      await supabase
        .from('profiles')
        .update({
          verification_status: 'pending',
          verification_submitted_at: new Date().toISOString()
        })
        .eq('id', userId);

      toast({
        title: "Verification submitted",
        description: "Your ID verification has been submitted for review"
      });

      onVerificationSubmitted();
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    switch (verificationStatus) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'verified':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Shield className="h-3 w-3 mr-1" />
            Not Verified
          </Badge>
        );
    }
  };

  const FileUploadSection = ({ 
    title, 
    description, 
    type, 
    icon: Icon 
  }: { 
    title: string; 
    description: string; 
    type: 'cinFront' | 'cinBack' | 'selfie';
    icon: any;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {files[type] ? (
          <div className="space-y-2">
            <p className="text-sm text-green-600">✓ {files[type]?.name}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiles(prev => ({ ...prev, [type]: null }))}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">{description}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(type, file);
              }}
              className="hidden"
              id={type}
            />
            <Label htmlFor={type}>
              <Button variant="outline" size="sm" asChild>
                <span>Choose File</span>
              </Button>
            </Label>
          </div>
        )}
      </div>
    </div>
  );

  if (verificationStatus === 'verified') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Identity Verification</span>
            </span>
            {renderStatus()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="h-5 w-5" />
            <span>Your identity has been verified successfully!</span>
          </div>
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Go to Main Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Identity Verification</span>
          </span>
          {renderStatus()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">🛡️ Build Trust & Get More Bookings</p>
            <p>Identity verification helps build trust in our community:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>For Hosts:</strong> Verified identity means more trusted listings and higher guest booking rates</li>
              <li><strong>For Guests:</strong> Verified identity gives you a higher rate of reservation approval from hosts</li>
              <li><strong>For Everyone:</strong> A safer, more trusted community experience</li>
            </ul>
            <p className="mt-2 font-medium">The more trusted you are, the more successful you'll be on Samsari!</p>
          </div>
        </div>

        <div className="flex items-start space-x-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Info className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">🔒 Privacy Information</p>
            <p>According to Law 2004‑63 of 27 July 2004, personal data (like CIN) must be:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Collected only for explicit, legitimate purpose (identity verification)</li>
              <li>Stored securely and encrypted</li>
              <li>Deleted promptly once no longer needed—within 24 hours of verification</li>
            </ul>
            <p className="mt-2">Your CIN will not be displayed publicly or shared.</p>
          </div>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm text-gray-600">⏱️ Verification takes up to 24 hours</p>
          <p className="text-xs text-gray-500">All documents are permanently deleted after verification</p>
        </div>

        {verificationStatus !== 'pending' && (
          <div className="space-y-6">
            <FileUploadSection
              title="📷 Front of CIN"
              description="Upload a clear photo of the front of your CIN"
              type="cinFront"
              icon={Camera}
            />

            <FileUploadSection
              title="📷 Back of CIN"
              description="Upload a clear photo of the back of your CIN"
              type="cinBack"
              icon={Camera}
            />

            <FileUploadSection
              title="🤳 Selfie holding CIN"
              description="Upload a selfie of yourself holding your CIN"
              type="selfie"
              icon={Camera}
            />

            <Button 
              onClick={submitVerification} 
              disabled={loading || !files.cinFront || !files.cinBack || !files.selfie}
              className="w-full"
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </div>
        )}

        {verificationStatus === 'pending' && (
          <div className="text-center space-y-4">
            <Clock className="h-12 w-12 mx-auto text-yellow-500" />
            <p className="font-medium">Verification in Progress</p>
            <p className="text-sm text-gray-600">
              Your documents are being reviewed. You'll be notified within 24 hours.
            </p>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Main Page
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdVerification;
