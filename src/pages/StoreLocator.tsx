import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  coordinates?: { lat: number; lng: number };
}

const StoreLocator = () => {
  const stores: Store[] = [
    {
      id: '1',
      name: 'Kavita Cooler - Main Branch',
      address: '123 Main Street, Electronics Market, City, State 12345',
      phone: '+91 98765 43210',
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM',
      services: ['Sales', 'Repair', 'Installation', 'Maintenance']
    },
    {
      id: '2',
      name: 'Kavita Cooler - Service Center',
      address: '456 Service Road, Industrial Area, City, State 12346',
      phone: '+91 87654 32109',
      hours: 'Mon-Sat: 8:00 AM - 7:00 PM, Sun: 9:00 AM - 5:00 PM',
      services: ['Repair', 'Maintenance', 'Parts']
    },
    {
      id: '3',
      name: 'Kavita Cooler - Mall Outlet',
      address: '789 Shopping Mall, 2nd Floor, Commercial District, City, State 12347',
      phone: '+91 76543 21098',
      hours: 'Daily: 10:00 AM - 10:00 PM',
      services: ['Sales', 'Installation', 'Customer Support']
    }
  ];

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-custom py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Store Locator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find our nearest store or service center. We have multiple locations to serve you better 
            with sales, repairs, installations, and maintenance services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {store.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Address</h4>
                  <p className="text-sm">{store.address}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Phone</h4>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${store.phone}`} className="text-sm hover:text-primary transition-colors">
                      {store.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Hours</h4>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-sm">{store.hours}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Services</h4>
                  <div className="flex flex-wrap gap-1">
                    {store.services.map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleGetDirections(store.address)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Need Help Finding Us?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find a store near you? Contact our customer service team for assistance.
              </p>
              <Button className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer Service
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoreLocator;
