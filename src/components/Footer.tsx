
import { Shield, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <span className="text-lg font-bold">Samsari</span>
                <span className="text-sm">.tn</span>
              </div>
            </div>
            <p className="text-sm text-background/80 mb-4">
              منصة سمسار موثوقة للإيجار قصير المدى في تونس. 
              نحن نربط المضيفين بالضيوف بطريقة آمنة ومضمونة.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-background/60 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-background/60 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">كيف يعمل</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الأمان والثقة</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">كن مضيفاً</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">قانوني</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الإلغاء</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الأضرار</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">التأمين</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">اتصل بنا</h3>
            <div className="space-y-3 text-sm text-background/80">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@samsari.tn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+216 XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>تونس، تونس</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-background/20 pt-8 mb-8">
          <h3 className="font-semibold mb-4 text-center">طرق الدفع المقبولة</h3>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="bg-background/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Paymee</span>
            </div>
            <div className="bg-background/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Flouci</span>
            </div>
            <div className="bg-background/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">D17 - La Poste</span>
            </div>
            <div className="bg-background/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Visa / Mastercard</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2025 Samsari.tn. جميع الحقوق محفوظة.</p>
          <p className="mt-2">منصة تونسية 100% - مصنوعة بـ ❤️ في تونس</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
