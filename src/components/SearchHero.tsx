import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Search, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchableSelect from "./SearchableSelect";
const SearchHero = () => {
  const {
    t
  } = useLanguage();
  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    minPrice: "",
    maxPrice: "",
    currency: "TND"
  });
  const tunisianGovernorates = ["Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Beja", "Jendouba", "Kef (El Kef)", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"];
  const currencies = [{
    code: "TND",
    symbol: "د.ت"
  }, {
    code: "USD",
    symbol: "$"
  }, {
    code: "EUR",
    symbol: "€"
  }, {
    code: "GBP",
    symbol: "£"
  }];
  return <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            {t('hero.title')}
            <span className="text-primary block">{t('hero.subtitle')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-trust rounded-full"></div>
              <span>{t('hero.trust_500_hosts')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-trust rounded-full"></div>
              <span>{t('hero.trust_secure_payment')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-trust rounded-full"></div>
              <span>{t('hero.trust_insurance')}</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="max-w-5xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* City Selection */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {t('search.city')}
                </Label>
                <SearchableSelect value={searchData.city} onValueChange={value => setSearchData({
                ...searchData,
                city: value
              })} options={tunisianGovernorates} placeholder={t('search.select_city')} searchPlaceholder="Search governorates..." emptyMessage="No governorate found." />
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <Label htmlFor="checkin" className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {t('search.checkin')}
                </Label>
                <Input id="checkin" type="date" value={searchData.checkIn} onChange={e => setSearchData({
                ...searchData,
                checkIn: e.target.value
              })} />
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <Label htmlFor="checkout" className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {t('search.checkout')}
                </Label>
                <Input id="checkout" type="date" value={searchData.checkOut} onChange={e => setSearchData({
                ...searchData,
                checkOut: e.target.value
              })} />
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" />
                  Currency
                </Label>
                <Select value={searchData.currency} onValueChange={value => setSearchData({
                ...searchData,
                currency: value
              })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" />
                  {t('search.price')}
                </Label>
                <div className="flex space-x-2">
                  <Input placeholder={t('search.from')} type="number" value={searchData.minPrice} onChange={e => setSearchData({
                  ...searchData,
                  minPrice: e.target.value
                })} className="w-full mx-0 my-0 px-[2px]" />
                  <Input placeholder={t('search.to')} type="number" value={searchData.maxPrice} onChange={e => setSearchData({
                  ...searchData,
                  maxPrice: e.target.value
                })} className="w-full" />
                </div>
              </div>

              {/* Search Button */}
              <Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
                {t('search.search')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Searches */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">{t('search.popular_searches')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Tunis", "Sousse", "Hammamet", "Sfax", "Monastir"].map(city => <Button key={city} variant="outline" size="sm" className="text-xs">
                {city}
              </Button>)}
          </div>
        </div>
      </div>
    </section>;
};
export default SearchHero;