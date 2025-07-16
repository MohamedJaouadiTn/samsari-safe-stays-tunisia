
import { Shield, Lock, Camera, CreditCard, CheckCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TrustSection = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: "تحقق من الهوية",
      description: "جميع المضيفين معتمدون ومتحقق من هويتهم",
      color: "text-trust"
    },
    {
      icon: Lock,
      title: "دفع آمن بضمان",
      description: "20% مقدماً، 80% بعد الوصول، حماية كاملة",
      color: "text-primary"
    },
    {
      icon: Camera,
      title: "صور الوصول للحماية",
      description: "التقط صور العقار عند الوصول للحماية من الأضرار",
      color: "text-accent"
    },
    {
      icon: CreditCard,
      title: "طرق دفع تونسية",
      description: "Paymee، Flouci، D17 - جميع طرق الدفع المحلية",
      color: "text-secondary"
    },
    {
      icon: CheckCircle,
      title: "تقييمات معتمدة",
      description: "فقط النزلاء الذين دفعوا عبر المنصة يمكنهم التقييم",
      color: "text-trust"
    },
    {
      icon: Users,
      title: "دعم عملاء محلي",
      description: "فريق دعم تونسي متاح من 10ص إلى 6م يومياً",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            لماذا سمسار.تن موثوق؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن نضع الأمان والثقة في المقدمة. منصتنا تحمي كل من المضيف والضيف
            من خلال نظام حماية متكامل ومدروس بعناية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <feature.icon className={`w-12 h-12 mx-auto ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">مضيف معتمد</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">حجز آمن</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-trust mb-2">4.8/5</div>
            <div className="text-sm text-muted-foreground">تقييم المستخدمين</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary mb-2">18</div>
            <div className="text-sm text-muted-foreground">محافظة تونسية</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
