
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Search, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SearchHero = () => {
  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    minPrice: "",
    maxPrice: ""
  });

  const tunisianCities = [
    "تونس", "سوسة", "صفاقس", "بنزرت", "قابس", "القيروان", 
    "المنستير", "نابل", "المهدية", "باجة", "جندوبة", "الكاف"
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            سمسار موثوق في
            <span className="text-primary block">تونس الحبيبة</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ابحث عن إقامة مؤقتة آمنة ومضمونة عبر منصتنا الموثوقة. 
            دفع آمن، تأمين شامل، ومضيفون معتمدون في جميع أنحاء تونس
          </p>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-trust rounded-full"></div>
              <span>+500 مضيف معتمد</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-trust rounded-full"></div>
              <span>دفع آمن 100%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-trust rounded-full"></div>
              <span>تأمين شامل</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="max-w-5xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* City Selection */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  المدينة
                </Label>
                <select 
                  id="city"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={searchData.city}
                  onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                >
                  <option value="">اختر المدينة</option>
                  {tunisianCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <Label htmlFor="checkin" className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  تاريخ الوصول
                </Label>
                <Input
                  id="checkin"
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                />
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <Label htmlFor="checkout" className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  تاريخ المغادرة
                </Label>
                <Input
                  id="checkout"
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" />
                  السعر (دينار تونسي)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="من"
                    type="number"
                    value={searchData.minPrice}
                    onChange={(e) => setSearchData({...searchData, minPrice: e.target.value})}
                    className="w-full"
                  />
                  <Input
                    placeholder="إلى"
                    type="number"
                    value={searchData.maxPrice}
                    onChange={(e) => setSearchData({...searchData, maxPrice: e.target.value})}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
                بحث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Searches */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">عمليات البحث الشائعة:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["تونس العاصمة", "سوسة", "الحمامات", "صفاقس", "المنستير"].map((city) => (
              <Button key={city} variant="outline" size="sm" className="text-xs">
                {city}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
