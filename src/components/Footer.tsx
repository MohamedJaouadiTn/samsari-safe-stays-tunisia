import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const Footer = () => {
  const {
    t
  } = useLanguage();
  return <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">Samsari</span>
                
              </div>
            </div>
            <p className="text-muted mb-6 max-w-md">
              {t('footer.about_desc')}
            </p>
            
            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">{t('footer.payment_methods')}</h4>
              <div className="flex space-x-4 text-sm">
                <span className="bg-background/10 px-3 py-1 rounded">Paymee</span>
                <span className="bg-background/10 px-3 py-1 rounded">Flouci</span>
                <span className="bg-background/10 px-3 py-1 rounded">credit card</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">{t('header.explore')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('header.become_host')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('header.safety')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@samsari.tn</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+216 70 123 456</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Tunis, Tunisia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-muted">
          <p>&copy; 2024 Samsari.tn. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>;
};
export default Footer;