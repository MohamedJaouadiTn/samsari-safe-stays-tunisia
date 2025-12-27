
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
    'footer.rights': 'All rights reserved.',

    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.verifications': 'ID Verifications',
    'admin.users': 'Users',
    'admin.properties': 'Properties',
    'admin.submitted': 'Submitted',
    'admin.cin_front': 'CIN Front',
    'admin.cin_back': 'CIN Back',
    'admin.selfie': 'Selfie with CIN',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.reviewer_notes': 'Reviewer Notes',
    'admin.unknown_user': 'Unknown User',
    'admin.joined': 'Joined',
    'admin.phone': 'Phone',
    'admin.username': 'Username',
    'admin.not_provided': 'Not provided',
    'admin.not_set': 'Not set',
    'admin.host': 'Host',
    'admin.price': 'Price',
    'admin.guests': 'Guests',
    'admin.bedrooms': 'Bedrooms',
    'admin.bathrooms': 'Bathrooms',
    'admin.public': 'Public',
    'admin.private': 'Private',
    'admin.night': 'night',
    'admin.loading': 'Loading admin panel...',
    'admin.access_denied': 'Access Denied',
    'admin.no_privileges': 'You don\'t have admin privileges',
    'admin.verification_updated': 'Verification updated successfully',
    'admin.error_loading': 'Failed to load admin data',
    'admin.error_updating': 'Failed to update verification',
    
    // Status badges
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.verified': 'Verified',

    // Profile & Auth
    'profile.title': 'My Profile',
    'profile.full_name': 'Full Name',
    'profile.bio': 'Bio',
    'profile.phone': 'Phone Number',
    'profile.update': 'Update Profile',
    'profile.change_password': 'Change Password',
    'profile.id_verification': 'ID Verification',
    'profile.saved_properties': 'Saved Properties',
    'profile.my_bookings': 'My Bookings',
    'profile.upload_avatar': 'Upload Avatar',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgot_password': 'Forgot Password?',

    // Booking
    'booking.request': 'Request to Book',
    'booking.checkin': 'Check-in',
    'booking.checkout': 'Check-out',
    'booking.guests': 'Guests',
    'booking.total': 'Total',
    'booking.deposit': 'Deposit',
    'booking.service_fee': 'Service Fee',
    'booking.message_host': 'Message to Host',
    'booking.confirm': 'Confirm Booking',
    'booking.cancel': 'Cancel',

    // Messages & Notifications
    'messages.inbox': 'Inbox',
    'messages.new_message': 'New Message',
    'messages.type_message': 'Type a message...',
    'messages.send': 'Send',
    'notifications.new': 'New Notifications',
    'notifications.mark_read': 'Mark as Read',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.close': 'Close',

    // Analytics
    'analytics.title': 'Property Analytics',
    'analytics.back_to_properties': 'Back to Properties',
    'analytics.select_period': 'Select Period',
    'analytics.last_7_days': 'Last 7 Days',
    'analytics.last_30_days': 'Last 30 Days',
    'analytics.last_year': 'Last Year',
    'analytics.last_5_years': 'Last 5 Years',
    'analytics.total_views': 'Total Views',
    'analytics.unique_visitors': 'unique visitors',
    'analytics.wishlisted': 'Wishlisted',
    'analytics.people_saved': 'People saved this property',
    'analytics.total_revenue': 'Total Revenue',
    'analytics.from_bookings': 'From {count} bookings',
    'analytics.conversion_rate': 'Conversion Rate',
    'analytics.views_to_bookings': 'Views to bookings',
    'analytics.average_stay': 'Average Stay',
    'analytics.nights': 'nights',
    'analytics.per_booking': 'Per booking',
    'analytics.peak_period': 'Peak Period',
    'analytics.most_popular_month': 'Most popular booking month',
    'analytics.total_bookings': 'Total Bookings',
    'analytics.confirmed_reservations': 'Confirmed reservations',
    'analytics.views_over_time': 'Views Over Time',
    'analytics.bookings_revenue': 'Bookings & Revenue',
    'analytics.views_per_visit': 'Views Per Visit',
    'analytics.pages_per_session': 'Pages per session',
    'analytics.visit_duration': 'Visit Duration',
    'analytics.average_time_on_page': 'Average time on page',
    'analytics.bounce_rate': 'Bounce Rate',
    'analytics.left_quickly': 'Left within 10 seconds',
    'analytics.traffic_sources': 'Traffic Sources',
    'analytics.visits': 'visits',
    'analytics.no_traffic_data': 'No traffic data available yet',
    'analytics.property_not_found': 'Property not found',
    'analytics.access_denied': 'Access Denied',
    'analytics.no_access': "You don't have access to this property's analytics",
    'analytics.load_error': 'Failed to load analytics',
    
    // Share
    'share.link_copied': 'Link copied to clipboard',
    'share.copy_link': 'Copy link',
    'share.more': 'More options'
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
    'footer.rights': 'Tous droits réservés.',

    // Admin Panel
    'admin.title': 'Panneau d\'Administration',
    'admin.verifications': 'Vérifications d\'Identité',
    'admin.users': 'Utilisateurs',
    'admin.properties': 'Propriétés',
    'admin.submitted': 'Soumis',
    'admin.cin_front': 'CIN Avant',
    'admin.cin_back': 'CIN Arrière',
    'admin.selfie': 'Selfie avec CIN',
    'admin.approve': 'Approuver',
    'admin.reject': 'Rejeter',
    'admin.reviewer_notes': 'Notes du Réviseur',
    'admin.unknown_user': 'Utilisateur Inconnu',
    'admin.joined': 'Inscrit',
    'admin.phone': 'Téléphone',
    'admin.username': 'Nom d\'utilisateur',
    'admin.not_provided': 'Non fourni',
    'admin.not_set': 'Non défini',
    'admin.host': 'Hôte',
    'admin.price': 'Prix',
    'admin.guests': 'Invités',
    'admin.bedrooms': 'Chambres',
    'admin.bathrooms': 'Salles de bain',
    'admin.public': 'Public',
    'admin.private': 'Privé',
    'admin.night': 'nuit',
    'admin.loading': 'Chargement du panneau d\'administration...',
    'admin.access_denied': 'Accès Refusé',
    'admin.no_privileges': 'Vous n\'avez pas de privilèges d\'administrateur',
    'admin.verification_updated': 'Vérification mise à jour avec succès',
    'admin.error_loading': 'Échec du chargement des données d\'administration',
    'admin.error_updating': 'Échec de la mise à jour de la vérification',
    
    // Status badges
    'status.pending': 'En Attente',
    'status.approved': 'Approuvé',
    'status.rejected': 'Rejeté',
    'status.verified': 'Vérifié',

    // Profile & Auth
    'profile.title': 'Mon Profil',
    'profile.full_name': 'Nom Complet',
    'profile.bio': 'Biographie',
    'profile.phone': 'Numéro de Téléphone',
    'profile.update': 'Mettre à Jour le Profil',
    'profile.change_password': 'Changer le Mot de Passe',
    'profile.id_verification': 'Vérification d\'Identité',
    'profile.saved_properties': 'Propriétés Sauvegardées',
    'profile.my_bookings': 'Mes Réservations',
    'profile.upload_avatar': 'Télécharger un Avatar',
    'auth.login': 'Connexion',
    'auth.signup': 'S\'inscrire',
    'auth.email': 'Email',
    'auth.password': 'Mot de Passe',
    'auth.forgot_password': 'Mot de Passe Oublié?',

    // Booking
    'booking.request': 'Demander une Réservation',
    'booking.checkin': 'Arrivée',
    'booking.checkout': 'Départ',
    'booking.guests': 'Invités',
    'booking.total': 'Total',
    'booking.deposit': 'Dépôt',
    'booking.service_fee': 'Frais de Service',
    'booking.message_host': 'Message à l\'Hôte',
    'booking.confirm': 'Confirmer la Réservation',
    'booking.cancel': 'Annuler',

    // Messages & Notifications
    'messages.inbox': 'Boîte de Réception',
    'messages.new_message': 'Nouveau Message',
    'messages.type_message': 'Tapez un message...',
    'messages.send': 'Envoyer',
    'notifications.new': 'Nouvelles Notifications',
    'notifications.mark_read': 'Marquer comme Lu',

    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.submit': 'Soumettre',
    'common.close': 'Fermer',

    // Analytics
    'analytics.title': 'Analytiques de la Propriété',
    'analytics.back_to_properties': 'Retour aux Propriétés',
    'analytics.select_period': 'Sélectionner la Période',
    'analytics.last_7_days': '7 Derniers Jours',
    'analytics.last_30_days': '30 Derniers Jours',
    'analytics.last_year': 'Dernière Année',
    'analytics.last_5_years': '5 Dernières Années',
    'analytics.total_views': 'Vues Totales',
    'analytics.unique_visitors': 'visiteurs uniques',
    'analytics.wishlisted': 'Favoris',
    'analytics.people_saved': 'Personnes ont sauvegardé cette propriété',
    'analytics.total_revenue': 'Revenu Total',
    'analytics.from_bookings': 'De {count} réservations',
    'analytics.conversion_rate': 'Taux de Conversion',
    'analytics.views_to_bookings': 'Vues vers réservations',
    'analytics.average_stay': 'Séjour Moyen',
    'analytics.nights': 'nuits',
    'analytics.per_booking': 'Par réservation',
    'analytics.peak_period': 'Période de Pointe',
    'analytics.most_popular_month': 'Mois de réservation le plus populaire',
    'analytics.total_bookings': 'Total des Réservations',
    'analytics.confirmed_reservations': 'Réservations confirmées',
    'analytics.views_over_time': 'Vues au Fil du Temps',
    'analytics.bookings_revenue': 'Réservations & Revenus',
    'analytics.views_per_visit': 'Vues Par Visite',
    'analytics.pages_per_session': 'Pages par session',
    'analytics.visit_duration': 'Durée de Visite',
    'analytics.average_time_on_page': 'Temps moyen sur la page',
    'analytics.bounce_rate': 'Taux de Rebond',
    'analytics.left_quickly': 'Parti en moins de 10 secondes',
    'analytics.traffic_sources': 'Sources de Trafic',
    'analytics.visits': 'visites',
    'analytics.no_traffic_data': 'Aucune donnée de trafic disponible',
    'analytics.property_not_found': 'Propriété non trouvée',
    'analytics.access_denied': 'Accès Refusé',
    'analytics.no_access': "Vous n'avez pas accès aux analytiques de cette propriété",
    'analytics.load_error': 'Échec du chargement des analytiques',
    
    // Share
    'share.link_copied': 'Lien copié dans le presse-papiers',
    'share.copy_link': 'Copier le lien',
    'share.more': 'Plus d\'options'
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
    'footer.rights': 'جميع الحقوق محفوظة.',

    // Admin Panel
    'admin.title': 'لوحة الإدارة',
    'admin.verifications': 'التحقق من الهوية',
    'admin.users': 'المستخدمون',
    'admin.properties': 'العقارات',
    'admin.submitted': 'مقدم',
    'admin.cin_front': 'البطاقة الأمامية',
    'admin.cin_back': 'البطاقة الخلفية',
    'admin.selfie': 'صورة شخصية مع البطاقة',
    'admin.approve': 'موافقة',
    'admin.reject': 'رفض',
    'admin.reviewer_notes': 'ملاحظات المراجع',
    'admin.unknown_user': 'مستخدم غير معروف',
    'admin.joined': 'انضم',
    'admin.phone': 'الهاتف',
    'admin.username': 'اسم المستخدم',
    'admin.not_provided': 'غير متوفر',
    'admin.not_set': 'غير محدد',
    'admin.host': 'مضيف',
    'admin.price': 'السعر',
    'admin.guests': 'الضيوف',
    'admin.bedrooms': 'غرف النوم',
    'admin.bathrooms': 'الحمامات',
    'admin.public': 'عام',
    'admin.private': 'خاص',
    'admin.night': 'ليلة',
    'admin.loading': 'جاري تحميل لوحة الإدارة...',
    'admin.access_denied': 'تم رفض الوصول',
    'admin.no_privileges': 'ليس لديك امتيازات المسؤول',
    'admin.verification_updated': 'تم تحديث التحقق بنجاح',
    'admin.error_loading': 'فشل تحميل بيانات الإدارة',
    'admin.error_updating': 'فشل تحديث التحقق',
    
    // Status badges
    'status.pending': 'قيد الانتظار',
    'status.approved': 'موافق عليه',
    'status.rejected': 'مرفوض',
    'status.verified': 'موثق',

    // Profile & Auth
    'profile.title': 'ملفي الشخصي',
    'profile.full_name': 'الاسم الكامل',
    'profile.bio': 'السيرة الذاتية',
    'profile.phone': 'رقم الهاتف',
    'profile.update': 'تحديث الملف الشخصي',
    'profile.change_password': 'تغيير كلمة المرور',
    'profile.id_verification': 'التحقق من الهوية',
    'profile.saved_properties': 'العقارات المحفوظة',
    'profile.my_bookings': 'حجوزاتي',
    'profile.upload_avatar': 'تحميل الصورة الشخصية',
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.forgot_password': 'هل نسيت كلمة المرور؟',

    // Booking
    'booking.request': 'طلب حجز',
    'booking.checkin': 'تسجيل الوصول',
    'booking.checkout': 'تسجيل المغادرة',
    'booking.guests': 'الضيوف',
    'booking.total': 'المجموع',
    'booking.deposit': 'الإيداع',
    'booking.service_fee': 'رسوم الخدمة',
    'booking.message_host': 'رسالة إلى المضيف',
    'booking.confirm': 'تأكيد الحجز',
    'booking.cancel': 'إلغاء',

    // Messages & Notifications
    'messages.inbox': 'صندوق الوارد',
    'messages.new_message': 'رسالة جديدة',
    'messages.type_message': 'اكتب رسالة...',
    'messages.send': 'إرسال',
    'notifications.new': 'إشعارات جديدة',
    'notifications.mark_read': 'وضع علامة كمقروء',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.submit': 'إرسال',
    'common.close': 'إغلاق',

    // Analytics
    'analytics.title': 'تحليلات العقار',
    'analytics.back_to_properties': 'العودة إلى العقارات',
    'analytics.select_period': 'اختر الفترة',
    'analytics.last_7_days': 'آخر 7 أيام',
    'analytics.last_30_days': 'آخر 30 يوم',
    'analytics.last_year': 'السنة الماضية',
    'analytics.last_5_years': 'آخر 5 سنوات',
    'analytics.total_views': 'إجمالي المشاهدات',
    'analytics.unique_visitors': 'زوار فريدون',
    'analytics.wishlisted': 'المفضلة',
    'analytics.people_saved': 'أشخاص حفظوا هذا العقار',
    'analytics.total_revenue': 'إجمالي الإيرادات',
    'analytics.from_bookings': 'من {count} حجوزات',
    'analytics.conversion_rate': 'معدل التحويل',
    'analytics.views_to_bookings': 'المشاهدات إلى الحجوزات',
    'analytics.average_stay': 'متوسط الإقامة',
    'analytics.nights': 'ليالي',
    'analytics.per_booking': 'لكل حجز',
    'analytics.peak_period': 'فترة الذروة',
    'analytics.most_popular_month': 'أكثر شهر شعبية للحجز',
    'analytics.total_bookings': 'إجمالي الحجوزات',
    'analytics.confirmed_reservations': 'الحجوزات المؤكدة',
    'analytics.views_over_time': 'المشاهدات عبر الزمن',
    'analytics.bookings_revenue': 'الحجوزات والإيرادات',
    'analytics.views_per_visit': 'المشاهدات لكل زيارة',
    'analytics.pages_per_session': 'الصفحات لكل جلسة',
    'analytics.visit_duration': 'مدة الزيارة',
    'analytics.average_time_on_page': 'متوسط الوقت على الصفحة',
    'analytics.bounce_rate': 'معدل الارتداد',
    'analytics.left_quickly': 'غادر خلال 10 ثوان',
    'analytics.traffic_sources': 'مصادر الزيارات',
    'analytics.visits': 'زيارات',
    'analytics.no_traffic_data': 'لا توجد بيانات زيارات متاحة بعد',
    'analytics.property_not_found': 'العقار غير موجود',
    'analytics.access_denied': 'تم رفض الوصول',
    'analytics.no_access': 'ليس لديك حق الوصول إلى تحليلات هذا العقار',
    'analytics.load_error': 'فشل تحميل التحليلات',
    
    // Share
    'share.link_copied': 'تم نسخ الرابط إلى الحافظة',
    'share.copy_link': 'نسخ الرابط',
    'share.more': 'المزيد من الخيارات'
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
