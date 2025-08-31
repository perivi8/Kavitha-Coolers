import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Wrench, Calendar, Phone, MapPin, X, Truck, CheckCircle, Clock, User, FileText, IndianRupee, Star, Shield, Zap } from 'lucide-react';

const MyServices = () => {
  const { user, isLoggedIn, bookedServices } = useAuth();
  const navigate = useNavigate();
  const [userServices, setUserServices] = useState<any[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Load user-specific services
    if (user?.id) {
      const savedServices = localStorage.getItem(`user-services-${user.id}`);
      if (savedServices) {
        try {
          setUserServices(JSON.parse(savedServices));
        } catch (error) {
          console.error('Error parsing services:', error);
          setUserServices([]);
        }
      } else {
        setUserServices([]);
      }
    }
  }, [isLoggedIn, user, navigate]);

  const getServiceStatus = (service: any) => {
    if (!service || !service.serviceDate) return 'Scheduled';
    
    const serviceDate = new Date(service.serviceDate);
    const today = new Date();
    const daysDiff = Math.floor((serviceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) return 'Scheduled';
    if (daysDiff === 1) return 'Tomorrow';
    if (daysDiff === 0) return 'Today';
    if (daysDiff < 0) return 'Completed';
    return 'Scheduled';
  };

  const canCancelService = (service: any) => {
    const serviceDate = new Date(service.serviceDate);
    const today = new Date();
    const daysDiff = Math.floor((serviceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff > 0 && service.status !== 'Cancelled';
  };

  const handleCancelService = (service: any) => {
    setSelectedService(service);
    setShowCancelDialog(true);
  };

  const confirmCancelService = () => {
    if (!selectedService || !user?.id) return;

    const updatedServices = userServices.map(service => 
      service.id === selectedService.id 
        ? { ...service, status: 'Cancelled', cancelledDate: new Date().toLocaleDateString('en-IN') }
        : service
    );

    setUserServices(updatedServices);
    localStorage.setItem(`user-services-${user.id}`, JSON.stringify(updatedServices));
    
    setShowCancelDialog(false);
    setSelectedService(null);
  };

  const handleTrackService = (service: any) => {
    setSelectedService(service);
    setShowTrackingDialog(true);
  };

  const getServiceTrackingSteps = (service: any) => {
    const status = getServiceStatus(service);
    const isCancelled = service.status === 'Cancelled';
    
    if (isCancelled) {
      // For cancelled services, show all steps as cancelled (red)
      const steps = [
        { label: 'Service Booked', status: 'cancelled', icon: CheckCircle },
        { label: 'Technician Assigned', status: 'cancelled', icon: User },
        { label: 'Service Cancelled', status: 'cancelled', icon: X },
        { label: 'Refund Processed', status: 'cancelled', icon: Wrench }
      ];
      return steps;
    }
    
    const steps = [
      { label: 'Service Booked', status: 'completed', icon: CheckCircle },
      { label: 'Technician Assigned', status: 'completed', icon: User },
      { label: 'On the Way', status: status === 'Today' ? 'current' : status === 'Completed' ? 'completed' : 'pending', icon: Truck },
      { label: 'Service Completed', status: status === 'Completed' ? 'completed' : 'pending', icon: Wrench }
    ];
    return steps;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg';
      case 'In Progress':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg';
      case 'Completed':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg';
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg';
      case 'Pending':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-spacing">
          <div className="container-custom">
            <div className="text-center py-12">
              <h1 className="heading-2 mb-4">Please Login</h1>
              <p className="body-text mb-4">You need to login to view your services</p>
              <Button onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="py-8 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              My Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track and manage your appliance service appointments with real-time updates
            </p>
          </div>

          {userServices.length === 0 ? (
            <div className="max-w-md mx-auto">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wrench className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Booked</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Book your first appliance service to get started with professional maintenance and repair solutions
                  </p>
                  <Button 
                    onClick={() => navigate('/services')} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <Wrench className="w-5 h-5 mr-2" />
                    Book Your First Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {userServices.filter(service => service && service.serviceDate).map((service) => {
                const status = getServiceStatus(service);
                return (
                  <Card key={service.id} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Wrench className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{service.serviceName}</h3>
                              <div className="flex items-center gap-6 text-blue-100 mt-2">
                                <span className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {service.serviceDate} at {service.serviceTime}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {service.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(service.status || status)} font-semibold px-4 py-2 text-sm shadow-lg`}>
                              {service.status || status}
                            </Badge>
                            <div className="mt-2 text-2xl font-bold text-white">
                              ₹{service.price?.toLocaleString() || '599'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Service Details */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Service Details</h4>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Service Type</span>
                                <span className="font-bold text-gray-900">{service.serviceName}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Booking Date</span>
                                <span className="font-semibold text-gray-800">{service.bookingDate}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Reference ID</span>
                                <span className="font-mono text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">{service.reference}</span>
                              </div>
                              {service.description && (
                                <>
                                  <Separator />
                                  <div className="py-2">
                                    <span className="text-gray-600 font-medium block mb-2">Description</span>
                                    <p className="text-gray-800 bg-white p-4 rounded-lg border-l-4 border-blue-500">{service.description}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Service Address */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-green-600" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Service Address</h4>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                              <div className="space-y-3">
                                <div className="font-bold text-gray-900 text-lg">{service.customerName}</div>
                                <div className="text-gray-700 leading-relaxed">
                                  <div>{service.address}</div>
                                  <div>{service.city}, {service.state}</div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-green-200">
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span className="font-semibold text-gray-800">{service.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-700 font-medium">
                                {service.status === 'Cancelled' ? (
                                  <span className="text-red-600">Service cancelled on {service.cancelledDate}</span>
                                ) : (
                                  'Technician will arrive at scheduled time'
                                )}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              {canCancelService(service) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelService(service)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 px-6 py-2 rounded-lg font-medium"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel Service
                                </Button>
                              )}
                              <Button 
                                size="sm"
                                onClick={() => handleTrackService(service)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Track Service
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Cancel Service Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to cancel the service appointment for {selectedService?.serviceName}?</p>
            <p className="text-sm text-muted-foreground">
              Scheduled for: {selectedService?.serviceDate} at {selectedService?.serviceTime}
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. You can book a new appointment if needed.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                Keep Appointment
              </Button>
              <Button onClick={confirmCancelService} className="flex-1 bg-red-600 hover:bg-red-700">
                Cancel Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wrench className="w-5 h-5" />
              <span>Track Service - {selectedService?.serviceName}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Service Tracking Progress */}
            <div className="relative">
              <div className="flex justify-between items-center">
                {selectedService && getServiceTrackingSteps(selectedService).map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        step.status === 'completed' 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : step.status === 'current'
                          ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                          : step.status === 'cancelled'
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-gray-200 border-gray-300 text-gray-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`mt-2 text-xs text-center font-medium ${
                        step.status === 'completed' ? 'text-green-600' : 
                        step.status === 'current' ? 'text-blue-600' : 
                        step.status === 'cancelled' ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
                <div 
                  className={`h-full transition-all duration-500 ${
                    selectedService?.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${selectedService ? (
                      selectedService.status === 'Cancelled' 
                        ? (getServiceTrackingSteps(selectedService).filter(s => s.status === 'cancelled').length - 1) * 33.33
                        : (getServiceTrackingSteps(selectedService).filter(s => s.status === 'completed').length - 1) * 33.33
                    ) : 0}%` 
                  }}
                />
              </div>
            </div>

            {/* Technician Status */}
            <div className={`p-4 rounded-lg ${
              selectedService?.status === 'Cancelled' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedService?.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {selectedService?.status === 'Cancelled' ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className={`font-semibold ${
                    selectedService?.status === 'Cancelled' ? 'text-red-900' : 'text-blue-900'
                  }`}>
                    {selectedService?.status === 'Cancelled' ? 'Service Cancelled' :
                     getServiceStatus(selectedService) === 'Completed' ? 'Service Completed' :
                     getServiceStatus(selectedService) === 'Today' ? 'Technician En Route' :
                     getServiceStatus(selectedService) === 'Tomorrow' ? 'Technician Assigned' : 'Service Scheduled'}
                  </div>
                  <div className={`text-sm ${
                    selectedService?.status === 'Cancelled' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {selectedService?.status === 'Cancelled' ? `Service was cancelled on ${selectedService.cancelledDate}` :
                     getServiceStatus(selectedService) === 'Completed' ? 'Service completed successfully' :
                     getServiceStatus(selectedService) === 'Today' ? 'Technician is on the way to your location' :
                     getServiceStatus(selectedService) === 'Tomorrow' ? 'Technician will arrive tomorrow' : 'Service appointment confirmed'}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Service Date:</span>
                <div className="font-medium">{selectedService?.serviceDate}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Service Time:</span>
                <div className="font-medium">{selectedService?.serviceTime}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Technician:</span>
                <div className="font-medium">Will be assigned 2 hours before service</div>
              </div>
              <div>
                <span className="text-muted-foreground">Contact:</span>
                <div className="font-medium">{selectedService?.phone}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyServices;
