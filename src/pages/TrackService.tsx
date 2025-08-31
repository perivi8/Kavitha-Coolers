import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServiceStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  appliance: string;
  serviceType: string;
  technician?: string;
  scheduledDate: string;
  estimatedTime?: string;
  contactNumber: string;
  address: string;
  notes?: string;
}

const TrackService = () => {
  const [trackingId, setTrackingId] = useState('');
  const [serviceData, setServiceData] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockServiceData: Record<string, ServiceStatus> = {
    'SRV001': {
      id: 'SRV001',
      status: 'in-progress',
      appliance: 'Samsung Refrigerator',
      serviceType: 'Repair',
      technician: 'Rajesh Kumar',
      scheduledDate: '2024-08-31',
      estimatedTime: '2:00 PM - 4:00 PM',
      contactNumber: '+91 98765 43210',
      address: '123 Main Street, Electronics Market',
      notes: 'Cooling issue reported. Technician on the way.'
    },
    'SRV002': {
      id: 'SRV002',
      status: 'completed',
      appliance: 'LG Washing Machine',
      serviceType: 'Installation',
      technician: 'Amit Sharma',
      scheduledDate: '2024-08-30',
      contactNumber: '+91 98765 43210',
      address: '456 Park Avenue, Residential Complex',
      notes: 'Installation completed successfully. Warranty activated.'
    },
    'SRV003': {
      id: 'SRV003',
      status: 'confirmed',
      appliance: 'Whirlpool AC',
      serviceType: 'Maintenance',
      scheduledDate: '2024-09-02',
      estimatedTime: '10:00 AM - 12:00 PM',
      contactNumber: '+91 98765 43210',
      address: '789 Business District, Office Complex'
    }
  };

  const handleTrack = () => {
    if (!trackingId.trim()) {
      setError('Please enter a valid service ID');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const service = mockServiceData[trackingId.toUpperCase()];
      if (service) {
        setServiceData(service);
        setError('');
      } else {
        setError('Service ID not found. Please check your service ID and try again.');
        setServiceData(null);
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'in-progress':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation';
      case 'confirmed':
        return 'Confirmed';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-custom py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-1 mb-4">Track Your Service</h1>
            <p className="text-muted-foreground">
              Enter your service ID to track the status of your appliance service request
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Service Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Service ID (e.g., SRV001)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  className="flex-1"
                />
                <Button onClick={handleTrack} disabled={loading}>
                  {loading ? 'Tracking...' : 'Track'}
                </Button>
              </div>
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Service Details */}
          {serviceData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Service Details</CardTitle>
                  <Badge className={getStatusColor(serviceData.status)}>
                    {getStatusIcon(serviceData.status)}
                    <span className="ml-2">{getStatusText(serviceData.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Service ID</h4>
                    <p className="font-mono">{serviceData.id}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Appliance</h4>
                    <p>{serviceData.appliance}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Service Type</h4>
                    <p>{serviceData.serviceType}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Scheduled Date</h4>
                    <p>{new Date(serviceData.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  {serviceData.estimatedTime && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">Time Slot</h4>
                      <p>{serviceData.estimatedTime}</p>
                    </div>
                  )}
                  {serviceData.technician && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">Technician</h4>
                      <p>{serviceData.technician}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Service Address</h4>
                  <p>{serviceData.address}</p>
                </div>

                {serviceData.notes && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Notes</h4>
                    <p className="text-sm">{serviceData.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">Need help? Call us at {serviceData.contactNumber}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Service IDs for testing */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Sample Service IDs for Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono font-semibold">SRV001</p>
                  <p className="text-muted-foreground">In Progress</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono font-semibold">SRV002</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono font-semibold">SRV003</p>
                  <p className="text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackService;
