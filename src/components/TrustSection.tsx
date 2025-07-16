
import { Shield, Users, Umbrella, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrustSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('trust.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('trust.secure_payment')}</h3>
            <p className="text-muted-foreground text-sm">{t('trust.secure_payment_desc')}</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-trust/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-trust/20 transition-colors">
              <Users className="w-8 h-8 text-trust" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('trust.verified_hosts')}</h3>
            <p className="text-muted-foreground text-sm">{t('trust.verified_hosts_desc')}</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
              <Umbrella className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('trust.insurance')}</h3>
            <p className="text-muted-foreground text-sm">{t('trust.insurance_desc')}</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
              <HeartHandshake className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('trust.support')}</h3>
            <p className="text-muted-foreground text-sm">{t('trust.support_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
