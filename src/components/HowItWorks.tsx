
import { Search, MessageCircle, CreditCard, Camera, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "ابحث واختر",
      description: "ابحث عن العقار المناسب حسب المدينة والتاريخ والميزانية",
      step: "01"
    },
    {
      icon: MessageCircle,
      title: "تواصل مع المضيف",
      description: "تحدث مباشرة مع المضيف واطرح جميع أسئلتك",
      step: "02"
    },
    {
      icon: CreditCard,
      title: "ادفع بأمان",
      description: "ادفع 20% مقدماً، والباقي بعد تأكيد الوصول",
      step: "03"
    },
    {
      icon: Camera,
      title: "التقط صور الوصول",
      description: "التقط صور العقار عند الوصول للحماية من أي مشاكل",
      step: "04"
    },
    {
      icon: Star,
      title: "قيّم تجربتك",
      description: "اترك تقييماً صادقاً لمساعدة الضيوف القادمين",
      step: "05"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            كيف يعمل سمسار.تن؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نظام بسيط وآمن للحجز في 5 خطوات فقط
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className={`flex items-start space-x-6 mb-12 ${index % 2 === 1 ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center relative">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-16 w-0.5 h-12 bg-border ${index % 2 === 1 ? '-right-8' : '-left-8'}`}></div>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 mt-2">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              جاهز للبدء؟
            </h3>
            <p className="text-muted-foreground mb-6">
              انضم إلى آلاف المضيفين والضيوف الذين يثقون في سمسار.تن
            </p>
            <div className="space-x-4">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
                ابدأ البحث الآن
              </button>
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-medium transition-colors">
                كن مضيفاً
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
