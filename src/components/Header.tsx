
import { Button } from "@/components/ui/button";
import { Shield, User, Menu, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { t } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">Samsari</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.explore')}
          </Link>
          <Link to="/become-host" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.become_host')}
          </Link>
          <Link to="/safety" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.safety')}
          </Link>
          <Link to="/help" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.help')}
          </Link>
        </nav>

        {/* Auth Buttons & Language Selector */}
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/bookings')}>
                      My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex"
                    onClick={() => navigate('/auth')}
                  >
                    {t('header.login')}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/auth')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('header.signup')}
                  </Button>
                </>
              )}
            </>
          )}
          
          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
