
import { Search, CreditCard, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('how.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary-foreground" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-trust rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('how.search')}</h3>
            <p className="text-muted-foreground">{t('how.search_desc')}</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <CreditCard className="w-10 h-10 text-accent-foreground" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-trust rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('how.book')}</h3>
            <p className="text-muted-foreground">{t('how.book_desc')}</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Home className="w-10 h-10 text-secondary-foreground" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-trust rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('how.enjoy')}</h3>
            <p className="text-muted-foreground">{t('how.enjoy_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
