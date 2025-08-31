import { Shield, Award, Users, Clock, Truck, Phone } from "lucide-react";

const TrustIcons = () => {
  const trustPoints = [
    {
      icon: Shield,
      title: "Authorized Dealer",
      description: "Official partner of all major brands"
    },
    {
      icon: Award,
      title: "5 Star Service",
      description: "Rated excellent by 5000+ customers"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified and experienced technicians"
    },
    {
      icon: Clock,
      title: "Same Day Service",
      description: "Quick response for urgent needs"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Complimentary delivery and setup"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round the clock customer assistance"
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-3 mb-4">Why Choose Kavita Cooler?</h2>
          <p className="body-text max-w-2xl mx-auto">
            We're committed to providing the best appliance shopping and service experience 
            with unmatched quality and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <div
                key={point.title}
                className="text-center space-y-3 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary text-sm mb-1">{point.title}</h4>
                  <p className="caption text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustIcons;