import { useState, useEffect } from "react";
import { Star, Grid, List, Filter, Plus, ArrowRight, Heart, ShoppingCart, Tag, Ticket, X, ChevronDown } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);
  const { addToCart } = useCart();

  // Load claimed coupons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('claimedCoupons');
    if (saved) {
      setClaimedCoupons(JSON.parse(saved));
    }
  }, []);

  // Calculate discount based on claimed coupons
  const getProductDiscount = (product: any) => {
    let additionalDiscount = 0;
    let appliedCoupon = '';
    
    // FESTIVAL40 - applies to all products
    if (claimedCoupons.includes('FESTIVAL40')) {
      additionalDiscount = Math.max(additionalDiscount, 40);
      appliedCoupon = 'FESTIVAL40';
    }
    // WELCOME25 - applies to all products
    else if (claimedCoupons.includes('WELCOME25')) {
      additionalDiscount = Math.max(additionalDiscount, 25);
      appliedCoupon = 'WELCOME25';
    }
    // WEEKEND15 - only applies to washing machines
    else if (claimedCoupons.includes('WEEKEND15') && product.category === 'Washing Machine') {
      additionalDiscount = Math.max(additionalDiscount, 15);
      appliedCoupon = 'WEEKEND15';
    }
    // BUNDLE15K - only applies when cart has multiple items (not implemented here)
    // ACSERVICE - only applies to services (not products)
    // FRIDGECARE - only applies to services (not products)
    
    return { discount: additionalDiscount, coupon: appliedCoupon };
  };

  const getDiscountedPrice = (originalPrice: number, additionalDiscount: number) => {
    return Math.round(originalPrice * (1 - additionalDiscount / 100));
  };

  // Handle category and brand filtering from URL parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    
    if (category || brand) {
      setIsLoading(true);
      
      // Scroll to top when loading from URL
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        // Handle category filtering
        if (category) {
          const categoryMap: { [key: string]: string } = {
            'tv': 'TV',
            'fans': 'Fans',
            'refrigerator': 'Refrigerator',
            'ac': 'AC',
            'washing-machine': 'Washing Machine',
            'air-cooler': 'Air Cooler',
            'water-heater': 'Water Heater'
          };
          const mappedCategory = categoryMap[category];
          if (mappedCategory && !selectedCategories.includes(mappedCategory)) {
            setSelectedCategories([mappedCategory]);
          }
        }
        
        // Handle brand filtering
        if (brand) {
          const brandMap: { [key: string]: string } = {
            'godrej': 'Godrej',
            'panasonic': 'Panasonic',
            'bosch': 'Bosch',
            'siemens': 'Siemens',
            'liebherr': 'Liebherr',
            'v-guard': 'V-Guard',
            'samsung': 'Samsung',
            'lg': 'LG',
            'sony': 'Sony'
          };
          const mappedBrand = brandMap[brand.toLowerCase()];
          if (mappedBrand && !selectedBrands.includes(mappedBrand)) {
            setSelectedBrands([mappedBrand]);
          }
        }
        
        setVisibleProducts(6);
        setIsLoading(false);
      }, 500);
    }
  }, [searchParams]);

  const products = [
    {
      id: 1,
      name: "Samsung 55\" 4K Smart TV",
      brand: "Samsung",
      category: "TV",
      price: 45999,
      mrp: 55999,
      discount: 18,
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/81gdt-mAPSL.jpg",
      features: ["4K Ultra HD", "Smart TV", "HDR10+"],
      emi: 3833
    },
    {
      id: 2,
      name: "LG 1.5 Ton 5 Star Split AC",
      brand: "LG",
      category: "AC",
      price: 35999,
      mrp: 42999,
      discount: 16,
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/61JZ82cn8WL.jpg",
      features: ["5 Star Rating", "Inverter", "WiFi Control"],
      emi: 3000
    },
    {
      id: 3,
      name: "Godrej 190L Single Door Refrigerator",
      brand: "Godrej",
      category: "Refrigerator",
      price: 18999,
      mrp: 22999,
      discount: 17,
      rating: 4.2,
      image: "https://m.media-amazon.com/images/I/51qBaOixIyS.jpg",
      features: ["Direct Cool", "190L Capacity", "5 Year Warranty"],
      emi: 1583
    },
    {
      id: 4,
      name: "Bosch 7kg Front Load Washing Machine",
      brand: "Bosch",
      category: "Washing Machine",
      price: 42999,
      mrp: 49999,
      discount: 14,
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/61b2v0Kc9WL.jpg",
      features: ["7kg Capacity", "1200 RPM", "Energy Efficient"],
      emi: 3583
    },
    {
      id: 5,
      name: "Panasonic 48\" Ceiling Fan",
      brand: "Panasonic",
      category: "Fans",
      price: 3999,
      mrp: 4999,
      discount: 20,
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/61dAlm1lzTL.jpg",
      features: ["48\" Sweep", "Remote Control", "LED Light"],
      emi: 333
    },
    {
      id: 6,
      name: "V-Guard 50L Air Cooler",
      brand: "V-Guard",
      category: "Air Cooler",
      price: 8999,
      mrp: 11999,
      discount: 25,
      rating: 4.1,
      image: "https://www.vguard.in/uploads/product/d50w_sm.jpg",
      features: ["50L Tank", "Honeycomb Pads", "Remote Control"],
      emi: 750
    },
    {
      id: 7,
      name: "Siemens 15L Electric Water Heater",
      brand: "Siemens",
      category: "Water Heater",
      price: 12999,
      mrp: 15999,
      discount: 19,
      rating: 4.3,
      image: "https://www.manua.ls/thumbs/products/s/1021413-siemens-de1821415.jpg",
      features: ["15L Capacity", "5 Star Rating", "Auto Cut-off"],
      emi: 1083
    },
    {
      id: 8,
      name: "Sony 65\" OLED Smart TV",
      brand: "Sony",
      category: "TV",
      price: 89999,
      mrp: 109999,
      discount: 18,
      rating: 4.7,
      image: "https://m.media-amazon.com/images/I/81vLUuftuJL._UF1000,1000_QL80_.jpg",
      features: ["OLED Display", "Dolby Vision", "Google TV"],
      emi: 7500
    },
    {
      id: 9,
      name: "Godrej 2 Ton 3 Star Window AC",
      brand: "Godrej",
      category: "AC",
      price: 28999,
      mrp: 34999,
      discount: 17,
      rating: 4.0,
      image: "https://content.jdmagicbox.com/quickquotes/images_main/godrej-2-ton-3-star-window-air-conditioner-magnum-series-non-inverter-802098417-zsldihvj.jpg?impolicy=queryparam&im=Resize=(360,360),aspect=fit",
      features: ["2 Ton Capacity", "3 Star Rating", "Copper Coil"],
      emi: 2417
    },
    {
      id: 10,
      name: "Liebherr 350L Double Door Refrigerator",
      brand: "Liebherr",
      category: "Refrigerator",
      price: 65999,
      mrp: 78999,
      discount: 16,
      rating: 4.8,
      image: "https://assets.nikshanonline.com/wp-content/uploads/2022/07/2-70.jpg",
      features: ["Frost Free", "350L Capacity", "Energy Efficient"],
      emi: 5500
    },
    {
      id: 11,
      name: "Siemens 8kg Top Load Washing Machine",
      brand: "Siemens",
      category: "Washing Machine",
      price: 38999,
      mrp: 45999,
      discount: 15,
      rating: 4.4,
      image: "https://images-eu.ssl-images-amazon.com/images/I/71-One+AA-L._AC_UL495_SR435,495_.jpg",
      features: ["8kg Capacity", "Top Load", "Quick Wash"],
      emi: 3250
    },
    {
      id: 12,
      name: "Panasonic 52\" Premium Ceiling Fan",
      brand: "Panasonic",
      category: "Fans",
      price: 5999,
      mrp: 7999,
      discount: 25,
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/61udlOjMYRL.jpg",
      features: ["52\" Sweep", "BLDC Motor", "Smart Remote"],
      emi: 500
    },
    {
      id: 13,
      name: "Godrej 70L Tower Air Cooler",
      brand: "Godrej",
      category: "Air Cooler",
      price: 12999,
      mrp: 16999,
      discount: 24,
      rating: 4.2,
      image: "https://media.istockphoto.com/id/820247696/photo/evaporative-air-cooler-fan.jpg?s=612x612&w=0&k=20&c=Vo6hEw2Yq6QEZ5xp-ImKWq0qSfuEh9TVZfpk7706V_k=",
      features: ["70L Tank", "Tower Design", "Ice Chamber"],
      emi: 1083
    },
    {
      id: 14,
      name: "Bosch 25L Electric Water Heater",
      brand: "Bosch",
      category: "Water Heater",
      price: 16999,
      mrp: 20999,
      discount: 19,
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/51oBh4yzmXL._UF1000,1000_QL80_.jpg",
      features: ["25L Capacity", "Instant Heating", "Safety Valve"],
      emi: 1417
    },
    {
      id: 15,
      name: "LG 43\" LED Smart TV",
      brand: "LG",
      category: "TV",
      price: 32999,
      mrp: 39999,
      discount: 18,
      rating: 4.3,
      image: "https://www.lg.com/content/dam/channel/wcms/in/images/tvs/43ur8040psb_atr_eail_in_c/gallery/43UR8040PSB-D-01.jpg",
      features: ["Full HD", "WebOS", "Magic Remote"],
      emi: 2750
    },
    {
      id: 16,
      name: "Panasonic 1 Ton 5 Star Inverter AC",
      brand: "Panasonic",
      category: "AC",
      price: 32999,
      mrp: 38999,
      discount: 15,
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/51G96nyJlOL._UF1000,1000_QL80_.jpg",
      features: ["1 Ton", "5 Star", "Copper Condenser"],
      emi: 2750
    },
    {
      id: 17,
      name: "Siemens 265L Double Door Refrigerator",
      brand: "Siemens",
      category: "Refrigerator",
      price: 38999,
      mrp: 45999,
      discount: 15,
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/21Ol-Iga9BL.jpg",
      features: ["Frost Free", "265L", "LED Lighting"],
      emi: 3250
    },
    {
      id: 18,
      name: "V-Guard 6kg Semi-Automatic Washing Machine",
      brand: "V-Guard",
      category: "Washing Machine",
      price: 15999,
      mrp: 19999,
      discount: 20,
      rating: 4.1,
      image: "https://m.media-amazon.com/images/I/71TaD6TvDVL._UF350,350_QL50_.jpg",
      features: ["6kg Capacity", "Semi-Auto", "Rust Proof"],
      emi: 1333
    }
  ];

  const handleFilterChange = (type: 'category' | 'brand' | 'price', value: string, checked: boolean) => {
    setIsLoading(true);
    
    // Scroll to top immediately when filter starts loading
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      if (type === 'category') {
        setSelectedCategories(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
      } else if (type === 'brand') {
        setSelectedBrands(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
      } else if (type === 'price') {
        setSelectedPriceRanges(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
      }
      setVisibleProducts(6); // Reset to show first 6 products
      setIsLoading(false);
    }, 500);
  };

  const getPriceRange = (price: number): string => {
    if (price < 10000) return "Under ₹10,000";
    if (price <= 25000) return "₹10,000 - ₹25,000";
    if (price <= 50000) return "₹25,000 - ₹50,000";
    if (price <= 100000) return "₹50,000 - ₹1,00,000";
    return "Above ₹1,00,000";
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const priceMatch = selectedPriceRanges.length === 0 || selectedPriceRanges.includes(getPriceRange(product.price));
    
    return categoryMatch && brandMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default: // featured
        return 0;
    }
  });

  const loadMoreProducts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 6, sortedProducts.length));
      setLoadingMore(false);
    }, 800);
  };

  const displayedProducts = sortedProducts.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < sortedProducts.length;

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setSortBy(value);
      setVisibleProducts(6);
      setIsLoading(false);
    }, 500);
  };


  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h3 className="heading-4 text-primary">Filters</h3>
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRanges.length > 0) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedBrands([]);
              setSelectedPriceRanges([]);
            }}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRanges.length > 0) && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-muted-foreground">Active Filters:</h5>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <Badge key={cat} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                {cat}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleFilterChange('category', cat, false)}
                />
              </Badge>
            ))}
            {selectedBrands.map(brand => (
              <Badge key={brand} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                {brand}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleFilterChange('brand', brand, false)}
                />
              </Badge>
            ))}
            {selectedPriceRanges.map(range => (
              <Badge key={range} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                {range}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleFilterChange('price', range, false)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="border rounded-lg p-4 bg-card">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Category
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {["TV", "AC", "Refrigerator", "Washing Machine", "Fans", "Air Cooler", "Water Heater"].map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-muted transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2" 
                checked={selectedCategories.includes(cat)}
                onChange={(e) => handleFilterChange('category', cat, e.target.checked)}
              />
              <span className="text-sm font-medium">{cat}</span>
              <span className="text-xs text-muted-foreground ml-auto">({products.filter(p => p.category === cat).length})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="border rounded-lg p-4 bg-card">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          Brand
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {["Samsung", "LG", "Godrej", "Bosch", "Panasonic", "Siemens", "Sony", "V-Guard", "Liebherr"].map((brand) => (
            <label key={brand} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-muted transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-2 border-accent text-accent focus:ring-accent focus:ring-2" 
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
              />
              <span className="text-sm font-medium">{brand}</span>
              <span className="text-xs text-muted-foreground ml-auto">({products.filter(p => p.brand === brand).length})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="border rounded-lg p-4 bg-card">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          Price Range
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Under ₹10,000",
            "₹10,000 - ₹25,000",
            "₹25,000 - ₹50,000",
            "₹50,000 - ₹1,00,000",
            "Above ₹1,00,000"
          ].map((range) => (
            <label key={range} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-muted transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-2 border-success text-success focus:ring-success focus:ring-2" 
                checked={selectedPriceRanges.includes(range)}
                onChange={(e) => handleFilterChange('price', range, e.target.checked)}
              />
              <span className="text-sm font-medium">{range}</span>
              <span className="text-xs text-muted-foreground ml-auto">({products.filter(p => selectedPriceRanges.length === 0 || getPriceRange(p.price) === range).length})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: typeof products[0] }) => {
    if (viewMode === "list") {
      return (
        <div className="card-hover p-6 flex gap-6 relative">
          {(() => {
            const couponDiscount = getProductDiscount(product);
            if (couponDiscount.discount > 0) {
              return (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl z-10 flex items-center gap-1.5 border border-green-400">
                  <Tag className="w-3.5 h-3.5" />
                  {couponDiscount.coupon}
                </div>
              );
            }
            return null;
          })()}
          {/* Product Image */}
          <div 
            className="w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg bg-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-xl leading-tight mb-2">{product.name}</h3>
              <p className="body-small text-muted-foreground mb-3">Brand: {product.brand}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="body-small text-muted-foreground">({product.rating})</span>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  {(() => {
                    const couponDiscount = getProductDiscount(product);
                    const finalPrice = couponDiscount.discount > 0 
                      ? getDiscountedPrice(product.price, couponDiscount.discount)
                      : product.price;
                    const totalDiscount = couponDiscount.discount > 0 
                      ? product.discount + couponDiscount.discount
                      : product.discount;
                    
                    return (
                      <>
                        <span className="text-2xl font-bold text-primary">₹{finalPrice.toLocaleString()}</span>
                        {couponDiscount.discount > 0 && (
                          <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                        <span className="text-sm text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
                        <Badge variant="secondary" className="text-xs">
                          {totalDiscount}% OFF
                        </Badge>
                      </>
                    );
                  })()}
                </div>
                <p className="body-small text-muted-foreground">EMI from ₹{product.emi}/month</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Compare</span>
                </Button>
                <Button 
                  onClick={() => addToCart({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price, 
                    originalPrice: product.mrp,
                    image: product.image, 
                    category: product.category 
                  })}
                  className="btn-hero flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view (existing layout)
    return (
      <div className="card-hover p-4 h-full flex flex-col relative">
        {(() => {
          const couponDiscount = getProductDiscount(product);
          if (couponDiscount.discount > 0) {
            return (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl z-10 flex items-center gap-1.5 border border-green-400">
                <Tag className="w-3.5 h-3.5" />
                {couponDiscount.coupon}
              </div>
            );
          }
          return null;
        })()}
        <div 
          className="aspect-square mb-4 overflow-hidden rounded-lg bg-white cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="space-y-2 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="body-small text-muted-foreground">({product.rating})</span>
          </div>
          <div className="flex items-center space-x-2">
            {(() => {
              const couponDiscount = getProductDiscount(product);
              const finalPrice = couponDiscount.discount > 0 
                ? getDiscountedPrice(product.price, couponDiscount.discount)
                : product.price;
              const totalDiscount = couponDiscount.discount > 0 
                ? product.discount + couponDiscount.discount
                : product.discount;
              
              return (
                <>
                  <span className="text-2xl font-bold text-primary">₹{finalPrice.toLocaleString()}</span>
                  {couponDiscount.discount > 0 && (
                    <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                  )}
                  <span className="text-sm text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
                  <Badge variant="secondary" className="text-xs">
                    {totalDiscount}% OFF
                  </Badge>
                </>
              );
            })()}
          </div>
          <p className="body-small text-muted-foreground">EMI from ₹{product.emi}/month</p>
          <div className="flex flex-wrap gap-1 mt-2 flex-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <Button 
            className="w-full" 
            onClick={() => addToCart({ 
              id: product.id, 
              name: product.name, 
              price: product.price, 
              originalPrice: product.mrp,
              image: product.image, 
              category: product.category 
            })}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="body-small text-muted-foreground">Home / Shop</p>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="heading-2 mb-2">
              {selectedCategories.length === 1 && selectedBrands.length === 1 
                ? `${selectedBrands[0]} ${selectedCategories[0]} Products`
                : selectedCategories.length === 1 
                ? `${selectedCategories[0]} Products`
                : selectedBrands.length === 1
                ? `${selectedBrands[0]} Products`
                : 'Shop Appliances'}
            </h1>
            <p className="body-text">Showing {displayedProducts.length} of {sortedProducts.length} products</p>
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map(category => (
                  <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    Category: {category}
                    <button 
                      onClick={() => handleFilterChange('category', category, false)}
                      className="ml-1 hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedBrands.map(brand => (
                  <span key={brand} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                    Brand: {brand}
                    <button 
                      onClick={() => handleFilterChange('brand', brand, false)}
                      className="ml-1 hover:text-secondary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="heading-4 mb-2">Sorry, no products found</h3>
                <p className="body-text text-muted-foreground mb-4">
                  No products match your current filter selection. Try adjusting your filters or browse all products.
                </p>
                <Button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setSelectedPriceRanges([]);
                    setVisibleProducts(6);
                  }}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Load More Button */}
            {hasMoreProducts && (
              <div className="flex justify-center mt-12">
                <Button 
                  onClick={loadMoreProducts}
                  className="btn-hero px-8 py-3"
                  size="lg"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;