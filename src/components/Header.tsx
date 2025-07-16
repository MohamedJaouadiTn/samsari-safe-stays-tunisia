
import { Button } from "@/components/ui/button";
import { Shield, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">Samsari</span>
            <span className="text-xs text-muted-foreground">.tn</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            استكشف العقارات
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            كن مضيفاً
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            الأمان
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            المساعدة
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            تسجيل الدخول
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <User className="w-4 h-4 mr-2" />
            إنشاء حساب
          </Button>
          
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
