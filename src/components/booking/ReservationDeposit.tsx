
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExchangeRates {
  usd: string;
  eur: string;
}

const ReservationDeposit = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    usd: "34.00",
    eur: "29.30"
  });

  const calculateExchangeRates = () => {
    const depositTND = 100;
    // These are approximate rates - in production, we'll fetch from an API
    return {
      usd: (depositTND * 0.34).toFixed(2),
      eur: (depositTND * 0.293).toFixed(2)
    };
  };

  useEffect(() => {
    setExchangeRates(calculateExchangeRates());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-medium text-yellow-800">Required Down Payment</p>
            <p className="text-sm text-yellow-700 mt-1">
              A non-refundable reservation deposit is required to secure your booking.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Deposit (TND)</span>
              <span className="font-medium">100.00 TND</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Equivalent (USD)</span>
              <span>${exchangeRates.usd}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Equivalent (EUR)</span>
              <span>€{exchangeRates.eur}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDeposit;
