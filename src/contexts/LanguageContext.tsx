
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.explore': 'Explore Properties',
    'header.become_host': 'Become a Host',
    'header.safety': 'Safety',
    'header.help': 'Help',
    'header.login': 'Login',
    'header.signup': 'Sign Up',
    
    // Hero Section
    'hero.title': 'Trusted Broker in',
    'hero.subtitle': 'Beloved Tunisia',
    'hero.description': 'Find safe and guaranteed temporary accommodation through our trusted platform. Secure payment, comprehensive insurance, and certified hosts throughout Tunisia',
    'hero.trust_500_hosts': '+500 certified hosts',
    'hero.trust_secure_payment': '100% secure payment',
    'hero.trust_insurance': 'Comprehensive insurance',
    
    // Search Form
    'search.city': 'City',
    'search.select_city': 'Select City',
    'search.checkin': 'Check-in Date',
    'search.checkout': 'Check-out Date',
    'search.price': 'Price',
    'search.from': 'From',
    'search.to': 'To',
    'search.search': 'Search',
    'search.popular_searches': 'Popular searches:',
    
    // Trust Section
    'trust.title': 'Why Choose Samsari.tn?',
    'trust.secure_payment': 'Secure Payment',
    'trust.secure_payment_desc': 'Escrow protection with 20% upfront, 80% after check-in',
    'trust.verified_hosts': 'Verified Hosts',
    'trust.verified_hosts_desc': 'All hosts are ID verified and rated by previous guests',
    'trust.insurance': 'Full Insurance',
    'trust.insurance_desc': 'Comprehensive damage and liability protection included',
    'trust.support': '24/7 Support',
    'trust.support_desc': 'Local customer service team available anytime',
    
    // How It Works
    'how.title': 'How It Works',
    'how.search': 'Search & Filter',
    'how.search_desc': 'Find your perfect accommodation by city, dates, and budget',
    'how.book': 'Book Securely',
    'how.book_desc': 'Pay safely with escrow protection and chat with your host',
    'how.enjoy': 'Enjoy Your Stay',
    'how.enjoy_desc': 'Check-in with photo verification and enjoy your experience',
    
    // Footer
    'footer.about': 'About Samsari.tn',
    'footer.about_desc': 'Tunisia\'s first trusted online platform for short-term rentals with full insurance and secure payments.',
    'footer.quick_links': 'Quick Links',
    'footer.support': 'Support',
    'footer.payment_methods': 'Accepted Payment Methods',
    'footer.rights': 'All rights reserved.'
  },
  fr: {
    // Header
    'header.explore': 'Explorer les Propriétés',
    'header.become_host': 'Devenir Hôte',
    'header.safety': 'Sécurité',
    'header.help': 'Aide',
    'header.login': 'Connexion',
    'header.signup': 'S\'inscrire',
    
    // Hero Section
    'hero.title': 'Courtier de Confiance en',
    'hero.subtitle': 'Tunisie Bien-Aimée',
    'hero.description': 'Trouvez un hébergement temporaire sûr et garanti via notre plateforme de confiance. Paiement sécurisé, assurance complète et hôtes certifiés dans toute la Tunisie',
    'hero.trust_500_hosts': '+500 hôtes certifiés',
    'hero.trust_secure_payment': 'Paiement 100% sécurisé',
    'hero.trust_insurance': 'Assurance complète',
    
    // Search Form
    'search.city': 'Ville',
    'search.select_city': 'Sélectionner une Ville',
    'search.checkin': 'Date d\'Arrivée',
    'search.checkout': 'Date de Départ',
    'search.price': 'Prix',
    'search.from': 'De',
    'search.to': 'À',
    'search.search': 'Rechercher',
    'search.popular_searches': 'Recherches populaires:',
    
    // Trust Section
    'trust.title': 'Pourquoi Choisir Samsari.tn?',
    'trust.secure_payment': 'Paiement Sécurisé',
    'trust.secure_payment_desc': 'Protection séquestre avec 20% d\'avance, 80% après l\'enregistrement',
    'trust.verified_hosts': 'Hôtes Vérifiés',
    'trust.verified_hosts_desc': 'Tous les hôtes sont vérifiés par ID et notés par les invités précédents',
    'trust.insurance': 'Assurance Complète',
    'trust.insurance_desc': 'Protection complète contre les dommages et responsabilité incluse',
    'trust.support': 'Support 24/7',
    'trust.support_desc': 'Équipe de service client local disponible à tout moment',
    
    // How It Works
    'how.title': 'Comment Ça Marche',
    'how.search': 'Rechercher et Filtrer',
    'how.search_desc': 'Trouvez votre hébergement parfait par ville, dates et budget',
    'how.book': 'Réserver en Sécurité',
    'how.book_desc': 'Payez en toute sécurité avec protection séquestre et chattez avec votre hôte',
    'how.enjoy': 'Profitez de Votre Séjour',
    'how.enjoy_desc': 'Enregistrement avec vérification photo et profitez de votre expérience',
    
    // Footer
    'footer.about': 'À Propos de Samsari.tn',
    'footer.about_desc': 'La première plateforme en ligne de confiance de Tunisie pour les locations à court terme avec assurance complète et paiements sécurisés.',
    'footer.quick_links': 'Liens Rapides',
    'footer.support': 'Support',
    'footer.payment_methods': 'Méthodes de Paiement Acceptées',
    'footer.rights': 'Tous droits réservés.'
  },
  ar: {
    // Header
    'header.explore': 'استكشف العقارات',
    'header.become_host': 'كن مضيفاً',
    'header.safety': 'الأمان',
    'header.help': 'المساعدة',
    'header.login': 'تسجيل الدخول',
    'header.signup': 'إنشاء حساب',
    
    // Hero Section
    'hero.title': 'سمسار موثوق في',
    'hero.subtitle': 'تونس الحبيبة',
    'hero.description': 'ابحث عن إقامة مؤقتة آمنة ومضمونة عبر منصتنا الموثوقة. دفع آمن، تأمين شامل، ومضيفون معتمدون في جميع أنحاء تونس',
    'hero.trust_500_hosts': '+500 مضيف معتمد',
    'hero.trust_secure_payment': 'دفع آمن 100%',
    'hero.trust_insurance': 'تأمين شامل',
    
    // Search Form
    'search.city': 'المدينة',
    'search.select_city': 'اختر المدينة',
    'search.checkin': 'تاريخ الوصول',
    'search.checkout': 'تاريخ المغادرة',
    'search.price': 'السعر',
    'search.from': 'من',
    'search.to': 'إلى',
    'search.search': 'بحث',
    'search.popular_searches': 'عمليات البحث الشائعة:',
    
    // Trust Section
    'trust.title': 'لماذا تختار Samsari.tn؟',
    'trust.secure_payment': 'دفع آمن',
    'trust.secure_payment_desc': 'حماية الضمان مع 20% مقدماً، 80% بعد تسجيل الوصول',
    'trust.verified_hosts': 'مضيفون موثقون',
    'trust.verified_hosts_desc': 'جميع المضيفين موثقون بالهوية ومقيمون من الضيوف السابقين',
    'trust.insurance': 'تأمين شامل',
    'trust.insurance_desc': 'حماية شاملة من الأضرار والمسؤولية متضمنة',
    'trust.support': 'دعم 24/7',
    'trust.support_desc': 'فريق خدمة العملاء المحلي متاح في أي وقت',
    
    // How It Works
    'how.title': 'كيف يعمل',
    'how.search': 'البحث والتصفية',
    'how.search_desc': 'اعثر على الإقامة المثالية حسب المدينة والتواريخ والميزانية',
    'how.book': 'احجز بأمان',
    'how.book_desc': 'ادفع بأمان مع حماية الضمان وتحدث مع المضيف',
    'how.enjoy': 'استمتع بإقامتك',
    'how.enjoy_desc': 'تسجيل الوصول مع التحقق من الصور واستمتع بتجربتك',
    
    // Footer
    'footer.about': 'حول Samsari.tn',
    'footer.about_desc': 'أول منصة موثوقة عبر الإنترنت في تونس للإيجارات قصيرة المدى مع تأمين شامل ومدفوعات آمنة.',
    'footer.quick_links': 'روابط سريعة',
    'footer.support': 'الدعم',
    'footer.payment_methods': 'طرق الدفع المقبولة',
    'footer.rights': 'جميع الحقوق محفوظة.'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
