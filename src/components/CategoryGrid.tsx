import { Tv, Fan, Refrigerator, AirVent, WashingMachine, Droplets, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CategoryGrid = () => {
  const navigate = useNavigate();
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string, categorySlug: string) => {
    setLoadingCategory(categoryName);
    
    setTimeout(() => {
      navigate(`/shop?category=${categorySlug}`);
      setLoadingCategory(null);
    }, 800);
  };
  
  const categories = [
    {
      name: "Television",
      icon: Tv,
      description: "Smart TVs, LED, OLED",
      category: "tv",
      image: "https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGVkJTIwdHZ8ZW58MHx8MHx8fDA%3D"
    },
    {
      name: "Fans",
      icon: Fan,
      description: "Ceiling, Table, Exhaust",
      category: "fans",
      image: "https://media.istockphoto.com/id/97850902/photo/brushed-metal-ceiling-fan.jpg?s=612x612&w=0&k=20&c=OqKUKRQVcYVJ3ZTr_tZKV8BcUO5POGob1YzX_YqhjyI="
    },
    {
      name: "Refrigerator",
      icon: Refrigerator,
      description: "Single Door, Double Door",
      category: "refrigerator",
      image: "https://images.unsplash.com/photo-1721613877687-c9099b698faa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Air Conditioner",
      icon: AirVent,
      description: "Split, Window, Inverter",
      category: "ac",
      image: "https://cdn.pixabay.com/photo/2021/09/08/07/20/air-conditioner-6605973_1280.jpg"
    },
    {
      name: "Washing Machine",
      icon: WashingMachine,
      description: "Front Load, Top Load",
      category: "washing-machine",
      image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Air Cooler",
      icon: Droplets,
      description: "Desert, Personal, Tower",
      category: "air-cooler",
      image: "https://media.istockphoto.com/id/820247696/photo/evaporative-air-cooler-fan.jpg?s=612x612&w=0&k=20&c=Vo6hEw2Yq6QEZ5xp-ImKWq0qSfuEh9TVZfpk7706V_k="
    },
    {
      name: "Water Heater",
      icon: Zap,
      description: "Electric, Gas, Solar",
      category: "water-heater",
      image: "https://media.istockphoto.com/id/1476147000/photo/electric-storage-water-heater.jpg?s=612x612&w=0&k=20&c=2BSWWH-_0cMxlXAgmIPsFHOYls3svo_m1rEJ6LryJaM="
    },
  ];

  return (
    <section className="section-spacing">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Shop by Category</h2>
          <p className="body-text max-w-2xl mx-auto">
            Find the perfect appliance for your home from our extensive collection 
            of premium brands and latest models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name, category.category)}
                className="category-card group cursor-pointer relative"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {loadingCategory === category.name && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="text-sm font-medium text-primary">Loading {category.name}...</span>
                    </div>
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="heading-4 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="body-small mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium text-sm">Explore Now</span>
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                      <span className="text-primary group-hover:text-primary-foreground text-lg">→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;