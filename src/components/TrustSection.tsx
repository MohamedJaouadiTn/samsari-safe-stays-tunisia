
import { Shield, Users, Umbrella, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrustSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('trust.secure_payment'),
      description: t('trust.secure_payment_desc'),
      color: 'primary',
      delay: '0s'
    },
    {
      icon: Users,
      title: t('trust.verified_hosts'),
      description: t('trust.verified_hosts_desc'),
      color: 'trust',
      delay: '0.1s'
    },
    {
      icon: Umbrella,
      title: t('trust.insurance'),
      description: t('trust.insurance_desc'),
      color: 'accent',
      delay: '0.2s'
    },
    {
      icon: HeartHandshake,
      title: t('trust.support'),
      description: t('trust.support_desc'),
      color: 'secondary',
      delay: '0.3s'
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            {t('trust.title')}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group text-center p-6 rounded-2xl bg-card hover:bg-muted/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`w-20 h-20 bg-${feature.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <Icon className={`w-10 h-10 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
