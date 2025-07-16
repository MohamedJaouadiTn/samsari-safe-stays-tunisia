
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyPricingProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PropertyPricing = ({ data, onUpdate }: PropertyPricingProps) => {
  const currencies = [
    { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" }
  ];

  const selectedCurrency = currencies.find(c => c.code === (data.currency || "TND"));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Set Your Price</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set competitive pricing to attract more guests. You can always adjust this later.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select 
            value={data.currency || "TND"} 
            onValueChange={(value) => onUpdate({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="basePrice">Base Price per Night</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {selectedCurrency?.symbol}
            </span>
            <Input
              id="basePrice"
              type="number"
              value={data.basePrice}
              onChange={(e) => onUpdate({ basePrice: e.target.value })}
              placeholder="0"
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      {data.basePrice && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base price per night</span>
                <span>{selectedCurrency?.symbol}{data.basePrice}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Samsari service fee (3%)</span>
                <span>{selectedCurrency?.symbol}{(parseFloat(data.basePrice) * 0.03).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-medium">
                <span>You earn per night</span>
                <span>{selectedCurrency?.symbol}{(parseFloat(data.basePrice) * 0.97).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">💡 Pricing Tips</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Research similar properties in your area</li>
            <li>• Consider seasonal demand fluctuations</li>
            <li>• Start with competitive pricing to get your first reviews</li>
            <li>• Factor in your costs (cleaning, utilities, etc.)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyPricing;
