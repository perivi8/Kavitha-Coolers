import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Users, 
  Clock, 
  Star, 
  Shield, 
  Wrench, 
  Phone, 
  MapPin, 
  Mail,
  CheckCircle,
  Heart,
  Target,
  Zap
} from "lucide-react";

const About = () => {
  const [activeTab, setActiveTab] = useState<"story" | "team" | "values">("story");
  const navigate = useNavigate();

  const handleVisitStore = () => {
    navigate('/stores');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Clock, label: "Years Experience", value: "25+" },
    { icon: Award, label: "Certified Technicians", value: "50+" },
    { icon: Star, label: "Customer Rating", value: "4.8/5" }
  ];

  const services = [
    {
      icon: Wrench,
      title: "Expert Installation",
      description: "Professional installation by certified technicians with warranty coverage."
    },
    {
      icon: Shield,
      title: "Genuine Products",
      description: "100% authentic appliances from authorized dealers with full manufacturer warranty."
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your appliance needs and queries."
    },
    {
      icon: Zap,
      title: "Quick Service",
      description: "Same-day service and repair for most appliances with genuine spare parts."
    }
  ];

  const teamMembers = [
    {
      name: "Kavita Sharma",
      role: "Founder & CEO",
      experience: "25+ years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "Started the business with a vision to provide quality appliances and reliable service to every home."
    },
    {
      name: "Rajesh Kumar",
      role: "Technical Head",
      experience: "20+ years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Expert in appliance repair and maintenance with extensive knowledge of all major brands."
    },
    {
      name: "Priya Patel",
      role: "Customer Relations Manager",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Ensures every customer receives personalized attention and exceptional service experience."
    },
    {
      name: "Amit Singh",
      role: "Service Operations",
      experience: "18+ years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Manages our service network and ensures timely delivery and installation across the region."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is centered around providing the best experience for our customers."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "We never compromise on quality - from products to service, excellence is our standard."
    },
    {
      icon: Target,
      title: "Reliability",
      description: "Our customers trust us because we consistently deliver on our promises, every time."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "We're not just a business, we're part of the community, supporting local families and homes."
    }
  ];

  const milestones = [
    { year: "1998", event: "Founded Kavita Cooler with a small shop and big dreams" },
    { year: "2005", event: "Became authorized dealer for major appliance brands" },
    { year: "2010", event: "Expanded to include comprehensive repair and maintenance services" },
    { year: "2015", event: "Reached 5,000+ satisfied customers milestone" },
    { year: "2020", event: "Launched online platform and home delivery services" },
    { year: "2023", event: "Achieved 10,000+ customers and 4.8-star rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-1 mb-6">About Kavita Appliance Pros</h1>
            <p className="body-large mb-8">
              For over 25 years, we've been your trusted partner in bringing comfort and convenience 
              to homes across the region. From humble beginnings as a small cooler shop to becoming 
              a leading appliance dealer and service provider, our journey is built on trust, quality, and dedication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us Today
              </Button>
              <Button variant="outline" size="lg" onClick={handleVisitStore}>
                <MapPin className="w-4 h-4 mr-2" />
                Visit Our Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="heading-3 text-primary mb-1">{stat.value}</div>
                <p className="body-small text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="container-custom">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={activeTab === "story" ? "default" : "ghost"}
                onClick={() => setActiveTab("story")}
                className="rounded-md"
              >
                Our Story
              </Button>
              <Button
                variant={activeTab === "team" ? "default" : "ghost"}
                onClick={() => setActiveTab("team")}
                className="rounded-md"
              >
                Our Team
              </Button>
              <Button
                variant={activeTab === "values" ? "default" : "ghost"}
                onClick={() => setActiveTab("values")}
                className="rounded-md"
              >
                Our Values
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "story" && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="heading-2 mb-6">From Small Beginnings to Big Dreams</h2>
                  <p className="body-text mb-4">
                    Founded in 1998 by Kavita Sharma, our company started as a small shop specializing 
                    in air coolers. With a passion for helping families stay comfortable and a commitment 
                    to honest service, we quickly earned the trust of our local community.
                  </p>
                  <p className="body-text mb-6">
                    Over the years, we've grown from a single-product store to a comprehensive appliance 
                    destination, offering everything from refrigerators and washing machines to complete 
                    home service solutions. But our core values remain the same: treat every customer 
                    like family and never compromise on quality.
                  </p>
                  <Badge className="bg-primary/10 text-primary">
                    Serving the community since 1998
                  </Badge>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                    alt="Our store"
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border">
                    <div className="text-2xl font-bold text-primary">25+</div>
                    <div className="text-sm text-muted-foreground">Years of Excellence</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="heading-3 text-center mb-8">Our Journey</h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="w-20 text-right">
                        <Badge variant="outline" className="font-bold">
                          {milestone.year}
                        </Badge>
                      </div>
                      <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="body-text">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="heading-2 mb-4">Meet Our Expert Team</h2>
                <p className="body-large text-muted-foreground">
                  The dedicated professionals who make your appliance experience exceptional
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-white">
                          {member.experience}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="heading-4 mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="body-small text-muted-foreground">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "values" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="heading-2 mb-4">What Drives Us</h2>
                <p className="body-large text-muted-foreground">
                  The principles that guide everything we do
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-4 mb-2">{value.title}</h3>
                      <p className="body-text text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Why Choose Us</h2>
            <p className="body-large text-muted-foreground">
              Experience the difference that comes with 25+ years of expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-4 mb-2">{service.title}</h3>
                <p className="body-small text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 mb-4">Ready to Experience the Difference?</h2>
            <p className="body-large mb-8">
              Join thousands of satisfied customers who trust us for their appliance needs. 
              Contact us today to see how we can help make your home more comfortable.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="font-medium">+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium">info@kavitacooler.com</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">Visit Our Showroom</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" size="lg" onClick={handleVisitStore}>
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
