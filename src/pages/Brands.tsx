import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Award, Users, Clock } from "lucide-react";

const Brands = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const brands = [
    {
      id: 1,
      name: "Godrej",
      logo: "https://img.favpng.com/15/19/3/godrej-group-logo-godrej-agrovet-godrej-consumer-products-ltd-png-favpng-sN8xgh9beLiKQ2CeAVy79Afae.jpg",
      description: "Leading Indian brand known for innovative home appliances and sustainable solutions.",
      categories: ["Refrigerators", "Air Conditioners", "Washing Machines", "Microwaves"],
      rating: 4.5,
      yearsPartnership: 15,
      productsCount: 120
    },
    {
      id: 2,
      name: "Panasonic",
      logo: "https://img.favpng.com/11/10/25/logo-brand-panasonic-air-conditioning-product-png-favpng-rDWEC9BGjjBGpsSNKR1g5r7GW.jpg",
      description: "Japanese multinational corporation offering cutting-edge electronics and appliances.",
      categories: ["Air Conditioners", "Televisions", "Audio Systems", "Kitchen Appliances"],
      rating: 4.7,
      yearsPartnership: 12,
      productsCount: 95
    },
    {
      id: 3,
      name: "Bosch",
      logo: "https://e7.pngegg.com/pngimages/1006/243/png-clipart-logo-robert-bosch-gmbh-alternator-product-electric-battery-bosch-text-trademark-thumbnail.png",
      description: "German engineering excellence in home appliances with premium quality and durability.",
      categories: ["Dishwashers", "Washing Machines", "Refrigerators", "Kitchen Appliances"],
      rating: 4.8,
      yearsPartnership: 10,
      productsCount: 85
    },
    {
      id: 4,
      name: "Siemens",
      logo: "https://img.favpng.com/8/9/22/siemens-technology-and-services-organization-logo-siemens-plm-software-png-favpng-AES6DxNH3wXCsj79vVmQZALs3.jpg",
      description: "Global technology powerhouse delivering innovative solutions for modern homes.",
      categories: ["Built-in Appliances", "Washing Machines", "Dishwashers", "Ovens"],
      rating: 4.6,
      yearsPartnership: 8,
      productsCount: 75
    },
    {
      id: 5,
      name: "Liebherr",
      logo: "https://img.favpng.com/22/19/1/liebherr-group-caterpillar-inc-heavy-machinery-loader-logo-png-favpng-dudZrat9zJCQLeV7ahcCjisEE.jpg",
      description: "Premium German brand specializing in high-end refrigeration and freezing solutions.",
      categories: ["Refrigerators", "Freezers", "Wine Coolers", "Commercial Refrigeration"],
      rating: 4.9,
      yearsPartnership: 6,
      productsCount: 45
    },
    {
      id: 6,
      name: "V Guard",
      logo: "https://img.favpng.com/9/0/4/v-guard-corporate-office-v-guard-industries-ltd-company-manufacturing-png-favpng-Xu97EwmRM4ZhH93911uChaZ4q.jpg",
      description: "Trusted Indian brand for electrical protection and home appliances.",
      categories: ["Voltage Stabilizers", "Water Heaters", "Fans", "UPS Systems"],
      rating: 4.3,
      yearsPartnership: 18,
      productsCount: 110
    }
  ];

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.categories.some(category => 
      category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    { icon: Award, label: "Authorized Brands", value: "6+" },
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Clock, label: "Years Experience", value: "25+" },
    { icon: Star, label: "Average Rating", value: "4.6" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-1 mb-4">Our Trusted Brands</h1>
            <p className="body-large mb-8">
              We are authorized dealers for premium appliance brands, ensuring you get genuine products 
              with full warranty and expert support.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search brands or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12"
              />
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

      {/* Brands Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Authorized Brand Partners</h2>
            <p className="body-large text-muted-foreground">
              Explore our collection of premium brands and their product categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow duration-300">
                {/* Brand Logo */}
                <div className="w-24 h-16 mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Brand Info */}
                <div className="text-center mb-6">
                  <h3 className="heading-4 mb-2">{brand.name}</h3>
                  <p className="body-small text-muted-foreground mb-4">{brand.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{brand.rating}</span>
                    <span className="text-muted-foreground text-sm">rating</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Product Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {brand.categories.map((category, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div>
                    <div className="font-semibold text-primary">{brand.yearsPartnership}+</div>
                    <div className="text-sm text-muted-foreground">Years Partnership</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{brand.productsCount}+</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full btn-hero"
                  onClick={() => window.location.href = `/shop?brand=${brand.name.toLowerCase()}`}
                >
                  View Products
                </Button>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <h3 className="heading-4 mb-2">No brands found</h3>
              <p className="text-muted-foreground">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Why Choose Our Authorized Brands?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-4 mb-2">Genuine Products</h3>
              <p className="body-small text-muted-foreground">
                100% authentic products with manufacturer warranty and quality assurance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-4 mb-2">Expert Support</h3>
              <p className="body-small text-muted-foreground">
                Professional installation, maintenance, and repair services by certified technicians.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-4 mb-2">Best Prices</h3>
              <p className="body-small text-muted-foreground">
                Competitive pricing with exclusive deals and offers on premium appliances.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Brands;
