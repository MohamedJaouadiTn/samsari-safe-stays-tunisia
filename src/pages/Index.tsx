
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <SearchHero />
      <TrustSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
