import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BrandStrip from "@/components/BrandStrip";
import CategoryGrid from "@/components/CategoryGrid";
import OffersSection from "@/components/OffersSection";
import ServicesTeaser from "@/components/ServicesTeaser";
import TrustIcons from "@/components/TrustIcons";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BrandStrip />
        <CategoryGrid />
        <OffersSection />
        <ServicesTeaser />
        <TrustIcons />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
