import { Settings, Wrench, CheckCircle, Clock, Phone, Star, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ApplianceMaintenance = () => {
  const services = [
    'Preventive Maintenance',
    'Annual Service Contracts',
    'Performance Optimization',
    'Safety Inspections',
    'Filter Replacements',
    'Cleaning & Sanitization',
    'Warranty Extensions',
    'Emergency Repairs'
  ];

  const appliances = [
    'Refrigerators', 'Air Conditioners', 'Washing Machines', 'Water Heaters', 
    'Televisions', 'Microwave Ovens', 'Dishwashers', 'Fans'
  ];

  const features = [
    { icon: <CheckCircle className="w-5 h-5" />, text: 'Certified Technicians' },
    { icon: <Clock className="w-5 h-5" />, text: 'Scheduled Service' },
    { icon: <Star className="w-5 h-5" />, text: 'Extended Warranty' },
    { icon: <Shield className="w-5 h-5" />, text: 'Quality Assurance' }
  ];

  const maintenancePlans = [
    {
      name: 'Basic Plan',
      price: '₹999/year',
      features: ['2 Service Visits', 'Basic Cleaning', 'Performance Check', 'Phone Support']
    },
    {
      name: 'Premium Plan',
      price: '₹1,999/year',
      features: ['4 Service Visits', 'Deep Cleaning', 'Parts Replacement', 'Priority Support', 'Emergency Service']
    },
    {
      name: 'Comprehensive Plan',
      price: '₹2,999/year',
      features: ['6 Service Visits', 'Complete Maintenance', 'Free Parts', '24/7 Support', 'Warranty Extension']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-custom py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="heading-1 mb-4">Appliance Maintenance</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive maintenance services to keep your appliances running efficiently. 
            Prevent costly repairs with our regular maintenance programs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-4">
              <div className="flex justify-center mb-2 text-primary">
                {feature.icon}
              </div>
              <p className="text-sm font-medium">{feature.text}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Maintenance Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appliances Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {appliances.map((appliance, index) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {appliance}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-center">
                  <strong>All Brands:</strong> We maintain appliances from all major 
                  manufacturers and brands.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Plans */}
        <div className="mb-12">
          <h2 className="heading-2 text-center mb-8">Maintenance Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {maintenancePlans.map((plan, index) => (
              <Card key={index} className={index === 1 ? 'border-primary shadow-lg' : ''}>
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant={index === 1 ? 'default' : 'outline'}>
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Start Maintenance Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Keep your appliances in perfect condition with regular maintenance
              </p>
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Book Maintenance
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call +91 98765 43210
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplianceMaintenance;
