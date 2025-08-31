import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import Services from '@/pages/Services';
import Brands from "@/pages/Brands";
import Offers from "@/pages/Offers";
import About from "@/pages/About";
import BookService from "@/pages/BookService";
import Checkout from '@/pages/Checkout';
import MyOrders from '@/pages/MyOrders';
import MyServices from '@/pages/MyServices';
import TrackService from '@/pages/TrackService';
import StoreLocator from '@/pages/StoreLocator';
import ProductDetails from '@/pages/ProductDetails';
import TVRepair from '@/pages/TVRepair';
import ACService from '@/pages/ACService';
import RefrigeratorService from '@/pages/RefrigeratorService';
import WashingMachineRepair from '@/pages/WashingMachineRepair';
import WaterHeaterService from '@/pages/WaterHeaterService';
import FanInstallation from '@/pages/FanInstallation';
import ApplianceMaintenance from '@/pages/ApplianceMaintenance';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import './App.css';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/about" element={<About />} />
              <Route path="/book-service" element={<BookService />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/my-services" element={<MyServices />} />
              <Route path="/services/track" element={<TrackService />} />
              <Route path="/stores" element={<StoreLocator />} />
              <Route path="/services/tv-repair" element={<TVRepair />} />
              <Route path="/services/ac-service" element={<ACService />} />
              <Route path="/services/refrigerator" element={<RefrigeratorService />} />
              <Route path="/services/washing-machine" element={<WashingMachineRepair />} />
              <Route path="/services/water-heater" element={<WaterHeaterService />} />
              <Route path="/services/fan-installation" element={<FanInstallation />} />
              <Route path="/services/maintenance" element={<ApplianceMaintenance />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
