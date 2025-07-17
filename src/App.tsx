
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import PropertyDetails from "./pages/PropertyDetails";
import SearchResults from "./pages/SearchResults";
import HostOnboarding from "./pages/HostOnboarding";
import BookingConfirmation from "./pages/BookingConfirmation";
import BecomeHost from "./pages/BecomeHost";
import Admin from "./pages/Admin";
import Help from "./pages/Help";
import Safety from "./pages/Safety";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/booking/:id" element={<BookingConfirmation />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/host/onboarding" element={<HostOnboarding />} />
                <Route path="/become-host" element={<BecomeHost />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/help" element={<Help />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
