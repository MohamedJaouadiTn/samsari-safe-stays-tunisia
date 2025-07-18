
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl">
                <CreditCard className="h-6 w-6 mr-2" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <h2 className="text-xl font-semibold">Payment Processing</h2>
                
                <p className="text-muted-foreground">
                  Payment functionality will be implemented here.
                </p>
                
                {bookingId && (
                  <p className="text-sm text-muted-foreground">
                    Booking ID: {bookingId}
                  </p>
                )}
                
                <div className="mt-8">
                  <p className="text-sm text-muted-foreground">
                    This page will include:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Secure payment processing</li>
                    <li>• Multiple payment methods</li>
                    <li>• Booking confirmation</li>
                    <li>• Receipt generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
