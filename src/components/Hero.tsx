import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-appliances.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/shop');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleServiceClick = () => {
    navigate('/services');
  };

  return (
    <section className="section-spacing bg-gradient-to-br from-background to-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-6 space-y-6 animate-fade-up">
            <div className="space-y-4">
              <h1 className="heading-1">
                Premium Home Appliances & 
                <span className="text-primary"> Expert Services</span>
              </h1>
              <p className="body-text text-xl">
                Discover the latest in home technology with authorized dealer pricing 
                and professional installation. From TVs to Air Conditioners, we've got you covered.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="body-small font-medium">Authorized Dealer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="body-small font-medium">Certified Technicians</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="body-small font-medium">1 Year Warranty</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero group" onClick={handleShopClick}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Appliances
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button className="btn-secondary group" onClick={handleServiceClick}>
                <Wrench className="w-5 h-5 mr-2" />
                Book Service
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>

            {/* Emergency Service */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <p className="body-small font-medium text-accent">
                  24/7 Emergency Repair Service Available
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
              <img
                src={heroImage}
                alt="Premium Home Appliances Showroom"
                className="relative w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl hover-lift"
              />
              
              {/* Floating Card */}
              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-success text-xl font-bold">5★</span>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">4.8/5 Rating</p>
                    <p className="body-small">5000+ Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;