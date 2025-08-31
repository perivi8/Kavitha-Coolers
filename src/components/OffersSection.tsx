import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Percent, Gift, Check } from "lucide-react";
import { useState, useEffect } from "react";

const OffersSection = () => {
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);
  const [visibleOffers, setVisibleOffers] = useState(3);

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
    setVisibleOffers(prev => Math.min(prev + 3, allOffers.length));
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
      borderColor: "border-accent/30"
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
      borderColor: "border-primary/30"
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
      borderColor: "border-success/30"
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
      borderColor: "border-blue-500/30"
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
      borderColor: "border-green-500/30"
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
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <section className="section-spacing">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Tag className="w-6 h-6 text-accent" />
            <span className="text-accent font-semibold">Special Offers</span>
          </div>
          <h2 className="heading-2 mb-4">Limited Time Deals</h2>
          <p className="body-text max-w-2xl mx-auto">
            Don't miss out on these exclusive offers and seasonal discounts. 
            Save big on premium appliances and services.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allOffers.slice(0, visibleOffers).map((offer, index) => {
            const isClaimed = claimedCoupons.includes(offer.code);
            return (
            <div
              key={offer.id}
              className={`${offer.bgColor} ${offer.borderColor} border rounded-2xl p-6 relative overflow-hidden hover-lift`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
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
                  {index === 0 && <Percent className="w-6 h-6 text-accent" />}
                  {index === 1 && <Tag className="w-6 h-6 text-primary" />}
                  {index === 2 && <Gift className="w-6 h-6 text-success" />}
                </div>

                <div>
                  <h3 className="heading-4 mb-2">{offer.title}</h3>
                  <p className="body-text text-secondary/80">{offer.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="body-small font-medium">Code:</span>
                    <Badge variant="outline" className="font-mono">
                      {offer.code}
                    </Badge>
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

        {/* Load More Button */}
        {visibleOffers < allOffers.length && (
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
  );
};

export default OffersSection;