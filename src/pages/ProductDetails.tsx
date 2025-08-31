import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  ArrowLeft,
  Check,
  Share2,
  MessageCircle,
  ThumbsUp,
  Package,
  RefreshCw,
  Headphones
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Complete product data matching Shop.tsx
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
      reviewCount: 1247,
      images: [
        "https://m.media-amazon.com/images/I/81gdt-mAPSL.jpg"
      ],
      features: ["4K Ultra HD", "Smart TV", "HDR10+"],
      specifications: {
        "Display": { "Screen Size": "55 inches", "Resolution": "4K Ultra HD", "Display Type": "LED" },
        "Smart Features": { "Operating System": "Tizen OS", "WiFi": "Yes", "Bluetooth": "Yes" }
      },
      warranty: "2 Years Comprehensive Warranty",
      inStock: true,
      deliveryInfo: "Free delivery by tomorrow",
      emi: 3833,
      highlights: ["Crystal Clear 4K Display", "Smart TV with Built-in Apps", "Voice Control Support"],
      description: "Experience entertainment like never before with this Samsung 55\" 4K Smart TV featuring stunning display quality and smart features."
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
      reviewCount: 892,
      images: ["https://m.media-amazon.com/images/I/61JZ82cn8WL.jpg"],
      features: ["5 Star Rating", "Inverter", "WiFi Control"],
      specifications: {
        "Cooling": { "Capacity": "1.5 Ton", "Energy Rating": "5 Star", "Room Size": "Up to 180 sq ft" }
      },
      warranty: "1 Year + 10 Years Compressor",
      inStock: true,
      deliveryInfo: "Free installation within 24 hours",
      emi: 3000,
      highlights: ["5 Star Energy Rating", "WiFi Control", "Fast Cooling"],
      description: "Stay cool with this energy-efficient LG Split AC featuring smart controls and superior cooling performance."
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
      reviewCount: 654,
      images: ["https://m.media-amazon.com/images/I/51qBaOixIyS.jpg"],
      features: ["Direct Cool", "190L Capacity", "5 Year Warranty"],
      specifications: {
        "Cooling": { "Capacity": "190L", "Type": "Direct Cool", "Shelves": "Wire Shelves" }
      },
      warranty: "5 Years Comprehensive Warranty",
      inStock: true,
      deliveryInfo: "Free delivery within 2 days",
      emi: 1583,
      highlights: ["Energy Efficient", "Spacious Storage", "Durable Build"],
      description: "Reliable refrigeration with Godrej's trusted technology and efficient cooling performance."
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
      reviewCount: 987,
      images: ["https://m.media-amazon.com/images/I/61b2v0Kc9WL.jpg"],
      features: ["7kg Capacity", "1200 RPM", "Energy Efficient"],
      specifications: {
        "Washing": { "Capacity": "7kg", "Type": "Front Load", "Speed": "1200 RPM" }
      },
      warranty: "2 Years Product + 10 Years Motor",
      inStock: true,
      deliveryInfo: "Free installation included",
      emi: 3583,
      highlights: ["German Engineering", "Energy Efficient", "Multiple Wash Programs"],
      description: "Premium washing machine with German engineering and advanced washing technology."
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
      reviewCount: 432,
      images: ["https://m.media-amazon.com/images/I/61dAlm1lzTL.jpg"],
      features: ["48\" Sweep", "Remote Control", "LED Light"],
      specifications: {
        "Motor": { "Sweep": "48 inches", "Speed": "Variable", "Power": "75W" }
      },
      warranty: "2 Years Motor Warranty",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 333,
      highlights: ["Energy Efficient Motor", "Remote Control", "LED Lighting"],
      description: "Stylish ceiling fan with remote control and energy-efficient performance."
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
      reviewCount: 321,
      images: ["https://www.vguard.in/uploads/product/d50w_sm.jpg"],
      features: ["50L Tank", "Honeycomb Pads", "Remote Control"],
      specifications: {
        "Cooling": { "Tank Capacity": "50L", "Cooling Pads": "Honeycomb", "Air Flow": "2200 m³/hr" }
      },
      warranty: "1 Year Product Warranty",
      inStock: true,
      deliveryInfo: "Free delivery",
      emi: 750,
      highlights: ["Large Water Tank", "Efficient Cooling", "Remote Control"],
      description: "Powerful air cooler with large water tank and efficient honeycomb cooling pads."
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
      reviewCount: 567,
      images: ["https://www.manua.ls/thumbs/products/s/1021413-siemens-de1821415.jpg"],
      features: ["15L Capacity", "5 Star Rating", "Auto Cut-off"],
      specifications: {
        "Heating": { "Capacity": "15L", "Power": "2000W", "Energy Rating": "5 Star" }
      },
      warranty: "2 Years Product + 5 Years Tank",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 1083,
      highlights: ["Fast Heating", "Energy Efficient", "Safety Features"],
      description: "Reliable water heater with fast heating and energy-efficient performance."
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
      reviewCount: 1876,
      images: ["https://m.media-amazon.com/images/I/81vLUuftuJL._UF1000,1000_QL80_.jpg"],
      features: ["OLED Display", "Dolby Vision", "Google TV"],
      specifications: {
        "Display": { "Screen Size": "65 inches", "Technology": "OLED", "Resolution": "4K HDR" },
        "Smart Features": { "OS": "Google TV", "Voice Control": "Yes", "Streaming": "Built-in Apps" }
      },
      warranty: "1 Year Product + 1 Year Extended",
      inStock: true,
      deliveryInfo: "Premium delivery & setup",
      emi: 7500,
      highlights: ["Premium OLED Technology", "Dolby Vision HDR", "Google TV Platform"],
      description: "Premium OLED TV with exceptional picture quality and smart entertainment features."
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
      reviewCount: 445,
      images: ["https://content.jdmagicbox.com/quickquotes/images_main/godrej-2-ton-3-star-window-air-conditioner-magnum-series-non-inverter-802098417-zsldihvj.jpg?impolicy=queryparam&im=Resize=(360,360),aspect=fit"],
      features: ["2 Ton Capacity", "3 Star Rating", "Copper Coil"],
      specifications: {
        "Cooling": { "Capacity": "2 Ton", "Energy Rating": "3 Star", "Coil": "Copper" }
      },
      warranty: "1 Year Product + 5 Years Compressor",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 2417,
      highlights: ["Powerful Cooling", "Copper Coil", "Window Type"],
      description: "Powerful window AC with copper coil for efficient cooling and durability."
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
      reviewCount: 234,
      images: ["https://assets.nikshanonline.com/wp-content/uploads/2022/07/2-70.jpg"],
      features: ["Frost Free", "350L Capacity", "Energy Efficient"],
      specifications: {
        "Cooling": { "Capacity": "350L", "Type": "Frost Free", "Energy Rating": "4 Star" }
      },
      warranty: "2 Years Product + 10 Years Compressor",
      inStock: true,
      deliveryInfo: "Premium delivery service",
      emi: 5500,
      highlights: ["Premium German Brand", "Large Capacity", "Advanced Cooling"],
      description: "Premium German refrigerator with advanced cooling technology and spacious storage."
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
      reviewCount: 678,
      images: ["https://images-eu.ssl-images-amazon.com/images/I/71-One+AA-L._AC_UL495_SR435,495_.jpg"],
      features: ["8kg Capacity", "Top Load", "Quick Wash"],
      specifications: {
        "Washing": { "Capacity": "8kg", "Type": "Top Load", "Programs": "12 Wash Programs" }
      },
      warranty: "2 Years Product + 10 Years Motor",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 3250,
      highlights: ["Large Capacity", "Multiple Programs", "German Technology"],
      description: "High-capacity top load washing machine with German engineering and multiple wash programs."
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
      reviewCount: 543,
      images: ["https://m.media-amazon.com/images/I/61udlOjMYRL.jpg"],
      features: ["52\" Sweep", "BLDC Motor", "Smart Remote"],
      specifications: {
        "Motor": { "Sweep": "52 inches", "Type": "BLDC Motor", "Power": "28W" }
      },
      warranty: "2 Years Motor + 1 Year Product",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 500,
      highlights: ["BLDC Motor Technology", "Energy Efficient", "Smart Remote"],
      description: "Premium ceiling fan with BLDC motor technology for superior performance and energy efficiency."
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
      reviewCount: 289,
      images: ["https://media.istockphoto.com/id/820247696/photo/evaporative-air-cooler-fan.jpg?s=612x612&w=0&k=20&c=Vo6hEw2Yq6QEZ5xp-ImKWq0qSfuEh9TVZfpk7706V_k="],
      features: ["70L Tank", "Tower Design", "Ice Chamber"],
      specifications: {
        "Cooling": { "Tank Capacity": "70L", "Design": "Tower", "Air Flow": "3500 m³/hr" }
      },
      warranty: "1 Year Product Warranty",
      inStock: true,
      deliveryInfo: "Free delivery",
      emi: 1083,
      highlights: ["Large Water Tank", "Tower Design", "Ice Chamber"],
      description: "Tall tower air cooler with large water tank and ice chamber for enhanced cooling."
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
      reviewCount: 432,
      images: ["https://m.media-amazon.com/images/I/51oBh4yzmXL._UF1000,1000_QL80_.jpg"],
      features: ["25L Capacity", "Instant Heating", "Safety Valve"],
      specifications: {
        "Heating": { "Capacity": "25L", "Power": "2000W", "Type": "Storage" }
      },
      warranty: "2 Years Product + 7 Years Tank",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 1417,
      highlights: ["German Engineering", "Fast Heating", "Safety Features"],
      description: "Premium water heater with German engineering and advanced safety features."
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
      reviewCount: 765,
      images: ["https://www.lg.com/content/dam/channel/wcms/in/images/tvs/43ur8040psb_atr_eail_in_c/gallery/43UR8040PSB-D-01.jpg"],
      features: ["Full HD", "WebOS", "Magic Remote"],
      specifications: {
        "Display": { "Screen Size": "43 inches", "Resolution": "Full HD", "OS": "WebOS" }
      },
      warranty: "1 Year Product Warranty",
      inStock: true,
      deliveryInfo: "Free delivery",
      emi: 2750,
      highlights: ["Smart WebOS Platform", "Magic Remote", "Full HD Display"],
      description: "Smart TV with WebOS platform and magic remote for seamless entertainment experience."
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
      reviewCount: 623,
      images: ["https://m.media-amazon.com/images/I/51G96nyJlOL._UF1000,1000_QL80_.jpg"],
      features: ["1 Ton", "5 Star", "Copper Condenser"],
      specifications: {
        "Cooling": { "Capacity": "1 Ton", "Energy Rating": "5 Star", "Type": "Inverter" }
      },
      warranty: "1 Year Product + 10 Years Compressor",
      inStock: true,
      deliveryInfo: "Free installation",
      emi: 2750,
      highlights: ["Inverter Technology", "Energy Efficient", "Copper Condenser"],
      description: "Energy-efficient inverter AC with copper condenser for optimal cooling performance."
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
      reviewCount: 398,
      images: ["https://m.media-amazon.com/images/I/21Ol-Iga9BL.jpg"],
      features: ["Frost Free", "265L", "LED Lighting"],
      specifications: {
        "Cooling": { "Capacity": "265L", "Type": "Frost Free", "Lighting": "LED" }
      },
      warranty: "1 Year Product + 10 Years Compressor",
      inStock: true,
      deliveryInfo: "Free delivery & installation",
      emi: 3250,
      highlights: ["German Technology", "Frost Free", "LED Lighting"],
      description: "German engineered refrigerator with frost-free technology and LED lighting."
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
      reviewCount: 234,
      images: ["https://m.media-amazon.com/images/I/71TaD6TvDVL._UF350,350_QL50_.jpg"],
      features: ["6kg Capacity", "Semi-Auto", "Rust Proof"],
      specifications: {
        "Washing": { "Capacity": "6kg", "Type": "Semi-Automatic", "Material": "Rust Proof Body" }
      },
      warranty: "2 Years Product Warranty",
      inStock: true,
      deliveryInfo: "Free delivery",
      emi: 1333,
      highlights: ["Affordable Option", "Rust Proof Body", "Easy Operation"],
      description: "Budget-friendly semi-automatic washing machine with rust-proof body and reliable performance."
    }
  ];

  const product = products.find(p => p.id === parseInt(id || ''));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-custom py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.mrp,
        image: product.images[0],
        category: product.category
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="py-0">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
              <span>/</span>
              <button onClick={() => navigate('/shop')} className="hover:text-primary">Shop</button>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain p-8"
                />
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-primary shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-white p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-100 text-blue-800 font-medium">{product.brand}</Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl font-bold text-green-700">₹{product.price.toLocaleString()}</span>
                  <span className="text-xl text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
                  <Badge className="bg-green-600 text-white font-semibold">{product.discount}% OFF</Badge>
                </div>
                <p className="text-sm text-green-600 font-medium">You save ₹{(product.mrp - product.price).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">EMI starting from ₹{product.emi}/month</p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-bold text-lg mb-3">Key Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-6 border-2 hover:bg-gray-50"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Delivery & Services */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium">Free Delivery</div>
                    <div className="text-sm text-muted-foreground">{product.deliveryInfo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Warranty</div>
                    <div className="text-sm text-muted-foreground">{product.warranty}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="specifications" className="space-y-6">
                  {Object.entries(product.specifications).map(([category, specs]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold mb-4 text-gray-900">{category}</h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(specs as Record<string, string>).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                              <span className="font-medium text-gray-700">{key}</span>
                              <span className="text-gray-900 font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  {/* Rating Summary */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 mb-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-600">{product.rating}</div>
                        <div className="flex items-center justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{product.reviewCount} reviews</div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[
                      {
                        user: "Rajesh Kumar",
                        rating: 5,
                        date: "2 weeks ago",
                        title: "Excellent product quality!",
                        comment: "Amazing picture quality and smart features work perfectly.",
                        helpful: 24,
                        verified: true
                      },
                      {
                        user: "Priya Sharma", 
                        rating: 4,
                        date: "1 month ago",
                        title: "Good value for money",
                        comment: "Great features for the price point. User-friendly interface.",
                        helpful: 18,
                        verified: true
                      }
                    ].map((review, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 border shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{review.user}</span>
                                {review.verified && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
