import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">KC</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Kavita Cooler</h2>
                <p className="text-sm text-muted-foreground">Appliances & Services</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for premium home appliances and professional service solutions. 
              Authorized dealers for top brands with certified technicians.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="heading-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Shop Appliances", href: "/shop" },
                { label: "Book Service", href: "/services" },
                { label: "Track Service", href: "/my-services" },
                { label: "Our Brands", href: "/brands" },
                { label: "Current Offers", href: "/offers" },
                { label: "Store Locator", href: "/stores" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm hover:text-primary transition-colors duration-200"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="heading-4">Our Services</h3>
            <div className="space-y-2">
              {[
                { label: "TV Repair & Installation", href: "/services/tv-repair" },
                { label: "AC Service & Repair", href: "/services/ac-service" },
                { label: "Refrigerator Service", href: "/services/refrigerator" },
                { label: "Washing Machine Repair", href: "/services/washing-machine" },
                { label: "Water Heater Service", href: "/services/water-heater" },
                { label: "Fan Installation", href: "/services/fan-installation" },
                { label: "Appliance Maintenance", href: "/services/maintenance" },
              ].map((service) => (
                <Link
                  key={service.label}
                  to={service.href}
                  className="block text-sm hover:text-primary transition-colors cursor-pointer"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="heading-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p>123 Main Street</p>
                  <p>Electronics Market</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div className="text-sm">
                  <p>+91 98765 43210</p>
                  <p>+91 87654 32109</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-sm">info@kavitacooler.com</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-muted w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              2024 Kavita Cooler. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/policies/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/policies/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/policies/returns-warranty" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Returns & Warranty
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;