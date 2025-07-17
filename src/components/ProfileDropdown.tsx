
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, Camera, Home, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileDropdownProps {
  profile: {
    full_name?: string;
    avatar_url?: string;
  };
  userEmail: string;
}

const ProfileDropdown = ({ profile, userEmail }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.rpc('is_admin', { user_email: userEmail });
      setIsAdmin(data || false);
    };
    
    checkAdminStatus();
  }, [userEmail]);

  const handleProfilePictureUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          // TODO: Implement profile picture upload logic
          toast({
            title: "Coming Soon",
            description: "Profile picture upload will be implemented soon.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to upload profile picture",
            variant: "destructive"
          });
        }
      }
    };
    input.click();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userInitial = profile.full_name?.charAt(0) || userEmail?.charAt(0)?.toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{profile.full_name || "User"}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleProfilePictureUpload}>
          <Camera className="mr-2 h-4 w-4" />
          Change Profile Picture
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/host/onboarding")}>
          <Home className="mr-2 h-4 w-4" />
          Advertise Your Property
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")}>
            <Shield className="mr-2 h-4 w-4" />
            Admin Panel
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
