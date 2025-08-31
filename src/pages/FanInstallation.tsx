import { Fan, Wrench, CheckCircle, Clock, Phone, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FanInstallation = () => {
  const services = [
    'Ceiling Fan Installation',
    'Table Fan Repair',
    'Exhaust Fan Setup',
    'Regulator Replacement',
    'Wiring & Electrical Work',
    'Balancing & Wobble Fix',
    'Motor Repair',
    'Remote Control Setup'
  ];

  const brands = [
    'Bajaj', 'Crompton', 'Havells', 'Orient', 'Usha', 'Luminous', 'Khaitan', 'Anchor'
  ];

  const features = [
    { icon: <CheckCircle className="w-5 h-5" />, text: 'Licensed Electricians' },
    { icon: <Clock className="w-5 h-5" />, text: 'Quick Installation' },
    { icon: <Star className="w-5 h-5" />, text: '2 Year Warranty' },
    { icon: <Phone className="w-5 h-5" />, text: 'Home Service' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-custom py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Fan className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="heading-1 mb-4">Fan Installation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional fan installation and repair services. From ceiling fans to exhaust fans, 
            our certified electricians ensure safe and efficient installation.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Fan Services
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
              <CardTitle>Supported Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand, index) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {brand}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-center">
                  <strong>All Types:</strong> Ceiling, Table, Pedestal, Wall Mount, 
                  and Exhaust fans.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Book Fan Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Professional fan installation and repair by certified electricians
              </p>
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Schedule Installation
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

export default FanInstallation;
