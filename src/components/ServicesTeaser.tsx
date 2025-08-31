import { CheckCircle, Clock, Shield, Wrench, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import serviceTechnicianImage from "@/assets/service-technician.jpg";

const ServicesTeaser = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleBookService = () => {
    navigate('/services');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleTrackService = () => {
    if (isLoggedIn) {
      navigate('/my-services');
    } else {
      // Redirect to login with return URL
      alert('Please log in to track your services');
      // You can implement a proper login modal or redirect here
    }
  };

  const features = [
    {
      icon: User,
      title: "Certified Technicians",
      description: "Factory-trained professionals with years of experience"
    },
    {
      icon: Shield,
      title: "Genuine Parts",
      description: "Only authentic spare parts with manufacturer warranty"
    },
    {
      icon: Clock,
      title: "Same Day Service",
      description: "Quick response for urgent repairs and installations"
    },
    {
      icon: Award,
      title: "Service Warranty",
      description: "All service work backed by comprehensive warranty"
    }
  ];

  return (
    <section className="section-spacing bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              <img
                src={serviceTechnicianImage}
                alt="Professional Technician Service"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Service Badge */}
              <div className="absolute top-6 left-6 bg-success text-success-foreground rounded-lg px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Authorized Service</span>
                </div>
              </div>

              {/* Emergency Badge */}
              <div className="absolute bottom-6 right-6 bg-accent text-accent-foreground rounded-lg px-4 py-3 shadow-lg">
                <div className="text-center">
                  <p className="font-bold text-lg">24/7</p>
                  <p className="text-sm">Emergency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wrench className="w-6 h-6 text-primary" />
                <span className="text-primary font-semibold">Professional Services</span>
              </div>
              
              <h2 className="heading-2">
                Expert Repair & Maintenance for All Your Appliances
              </h2>
              
              <p className="body-text">
                From installation to emergency repairs, our certified technicians provide 
                comprehensive service solutions to keep your appliances running perfectly. 
                We service all major brands with genuine parts and warranties.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary mb-1">{feature.title}</h4>
                      <p className="body-small">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-hero" onClick={handleBookService}>
                Book Service Now
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleTrackService}>
                Track Your Service
              </Button>
            </div>

            {/* Emergency Contact */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-secondary">Emergency Service</p>
                  <p className="body-small">Available 24/7 for urgent repairs</p>
                </div>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesTeaser;