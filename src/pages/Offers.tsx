import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Percent, Gift, Check, Search, Clock, Users, Star, Filter } from "lucide-react";

const Offers = () => {
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);
  const [visibleOffers, setVisibleOffers] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "product" | "service">("all");

  // Load claimed coupons from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('claimedCoupons');
    if (saved) {
      setClaimedCoupons(JSON.parse(saved));
    }
  }, []);

  // Save claimed coupons to localStorage
  const saveCouponsToStorage = (coupons: string[]) => {
    localStorage.setItem('claimedCoupons', JSON.stringify(coupons));
  };

  const handleClaimOffer = (code: string) => {
    if (!claimedCoupons.includes(code)) {
      const newClaimedCoupons = [...claimedCoupons, code];
      setClaimedCoupons(newClaimedCoupons);
      saveCouponsToStorage(newClaimedCoupons);
    }
  };

  const loadMoreOffers = () => {
    setVisibleOffers(prev => Math.min(prev + 6, allOffers.length));
  };

  const allOffers = [
    {
      id: 1,
      title: "Festival Mega Sale",
      description: "Up to 40% off on all appliances + Free installation",
      discount: "40% OFF",
      validUntil: "Valid till 31st Dec",
      code: "FESTIVAL40",
      type: "product",
      bgColor: "bg-gradient-to-br from-accent/20 to-accent/10",
      borderColor: "border-accent/30",
      category: "Appliances",
      savings: "₹20,000"
    },
    {
      id: 2,
      title: "AC Service Special",
      description: "Complete AC service + Gas refill at special price",
      discount: "₹499 Only",
      validUntil: "Limited Time",
      code: "ACSERVICE",
      type: "service",
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/10",
      borderColor: "border-primary/30",
      category: "AC Service",
      savings: "₹300"
    },
    {
      id: 3,
      title: "Bundle Offer",
      description: "Buy TV + AC together and save big on total purchase",
      discount: "Save ₹15,000",
      validUntil: "This Month Only",
      code: "BUNDLE15K",
      type: "product",
      bgColor: "bg-gradient-to-br from-success/20 to-success/10",
      borderColor: "border-success/30",
      category: "Electronics",
      savings: "₹15,000"
    },
    {
      id: 4,
      title: "First Time Customer",
      description: "Special discount for new customers on any purchase",
      discount: "25% OFF",
      validUntil: "Valid for 30 days",
      code: "WELCOME25",
      type: "product",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
      borderColor: "border-blue-500/30",
      category: "All Products",
      savings: "₹12,500"
    },
    {
      id: 5,
      title: "Refrigerator Service",
      description: "Complete refrigerator cleaning and maintenance",
      discount: "₹299 Only",
      validUntil: "This Week",
      code: "FRIDGECARE",
      type: "service",
      bgColor: "bg-gradient-to-br from-green-500/20 to-green-500/10",
      borderColor: "border-green-500/30",
      category: "Refrigerator Service",
      savings: "₹200"
    },
    {
      id: 6,
      title: "Weekend Special",
      description: "Extra 15% off on washing machines this weekend",
      discount: "15% OFF",
      validUntil: "Weekend Only",
      code: "WEEKEND15",
      type: "product",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-purple-500/10",
      borderColor: "border-purple-500/30",
      category: "Washing Machines",
      savings: "₹7,500"
    },
    {
      id: 7,
      title: "Summer Cooling Sale",
      description: "Special prices on all cooling appliances",
      discount: "30% OFF",
      validUntil: "Summer Season",
      code: "SUMMER30",
      type: "product",
      bgColor: "bg-gradient-to-br from-cyan-500/20 to-cyan-500/10",
      borderColor: "border-cyan-500/30",
      category: "Cooling",
      savings: "₹18,000"
    },
    {
      id: 8,
      title: "Home Appliance Combo",
      description: "Buy 3 appliances and get the cheapest one free",
      discount: "1 FREE",
      validUntil: "Limited Period",
      code: "COMBO3FREE",
      type: "product",
      bgColor: "bg-gradient-to-br from-orange-500/20 to-orange-500/10",
      borderColor: "border-orange-500/30",
      category: "Combo Deals",
      savings: "₹25,000"
    },
    {
      id: 9,
      title: "Installation & Service Package",
      description: "Free installation + 1 year service warranty",
      discount: "FREE",
      validUntil: "On All Products",
      code: "FREEINSTALL",
      type: "service",
      bgColor: "bg-gradient-to-br from-indigo-500/20 to-indigo-500/10",
      borderColor: "border-indigo-500/30",
      category: "Installation",
      savings: "₹2,500"
    }
  ];

  const filteredOffers = allOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || offer.type === filterType;
    return matchesSearch && matchesType;
  });

  const displayedOffers = filteredOffers.slice(0, visibleOffers);
  const hasMoreOffers = visibleOffers < filteredOffers.length;

  const stats = [
    { icon: Tag, label: "Active Offers", value: `${allOffers.length}+` },
    { icon: Users, label: "Happy Customers", value: "5,000+" },
    { icon: Star, label: "Average Savings", value: "₹15,000" },
    { icon: Clock, label: "New Deals", value: "Weekly" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Tag className="w-8 h-8 text-accent" />
              <span className="text-accent font-semibold text-lg">Special Offers</span>
            </div>
            <h1 className="heading-1 mb-4">Exclusive Deals & Discounts</h1>
            <p className="body-large mb-8">
              Discover amazing offers on premium appliances and services. Save big with our 
              limited-time deals and seasonal discounts.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  className="h-12"
                >
                  All
                </Button>
                <Button
                  variant={filterType === "product" ? "default" : "outline"}
                  onClick={() => setFilterType("product")}
                  className="h-12"
                >
                  Products
                </Button>
                <Button
                  variant={filterType === "service" ? "default" : "outline"}
                  onClick={() => setFilterType("service")}
                  className="h-12"
                >
                  Services
                </Button>
              </div>
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

      {/* Offers Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Current Offers</h2>
            <p className="body-large text-muted-foreground">
              {filteredOffers.length} {filterType === "all" ? "offers" : `${filterType} offers`} available
            </p>
          </div>

          {displayedOffers.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="heading-4 mb-2">No offers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedOffers.map((offer, index) => {
                const isClaimed = claimedCoupons.includes(offer.code);
                return (
                  <div
                    key={offer.id}
                    className={`${offer.bgColor} ${offer.borderColor} border rounded-2xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow duration-300`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <div className="w-full h-full bg-current rounded-full transform translate-x-16 -translate-y-16"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1">
                        {offer.discount}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="relative space-y-4">
                      <div className="w-12 h-12 bg-card/80 rounded-lg flex items-center justify-center">
                        {offer.type === "product" ? (
                          <Percent className="w-6 h-6 text-primary" />
                        ) : (
                          <Tag className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="heading-4">{offer.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {offer.category}
                          </Badge>
                        </div>
                        <p className="body-text text-secondary/80">{offer.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="body-small font-medium">Code:</span>
                          <Badge variant="outline" className="font-mono">
                            {offer.code}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="body-small font-medium">You Save:</span>
                          <span className="font-semibold text-success">{offer.savings}</span>
                        </div>
                        
                        <p className="caption text-muted-foreground">{offer.validUntil}</p>
                        
                        <Button 
                          size="sm" 
                          className={`w-full mt-4 ${
                            isClaimed 
                              ? 'bg-success text-white hover:bg-success/90' 
                              : 'bg-card text-secondary border border-border hover:bg-muted'
                          }`}
                          onClick={() => handleClaimOffer(offer.code)}
                          disabled={isClaimed}
                        >
                          {isClaimed ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Offer Claimed
                            </>
                          ) : (
                            'Claim Offer'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMoreOffers && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={loadMoreOffers}
              >
                Load More Offers
              </Button>
            </div>
          )}
        </div>
      </section>


      {/* How to Use Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">How to Use Your Offers</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="heading-4 mb-2">Claim Your Offer</h3>
              <p className="body-small text-muted-foreground">
                Click "Claim Offer" on any deal you want to use. The coupon will be saved to your account.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="heading-4 mb-2">Shop Products</h3>
              <p className="body-small text-muted-foreground">
                Browse our shop and add eligible products to your cart. Claimed coupons apply automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="heading-4 mb-2">Enjoy Savings</h3>
              <p className="body-small text-muted-foreground">
                Your discount will be applied at checkout. Enjoy your savings on premium appliances!
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Offers;
