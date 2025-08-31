import { useState, useEffect } from "react";
import { Calendar, Clock, Shield, Wrench, Star, Phone, MapPin, User, CheckCircle, Tag, Award, Check, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from 'jspdf';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import serviceTechnicianImage from "@/assets/service-technician.jpg";

const Services = () => {
  const navigate = useNavigate();
  const { user, addBookedService } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [bookingReference, setBookingReference] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    serviceDate: ""
  });

  // Load claimed coupons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('claimedCoupons');
    if (saved) {
      setClaimedCoupons(JSON.parse(saved));
    }
  }, []);

  // Calculate service discount based on claimed coupons
  const getServiceDiscount = (serviceType: string) => {
    let additionalDiscount = 0;
    let appliedCoupon = '';
    
    if (claimedCoupons.includes('SERVICE30')) {
      additionalDiscount = Math.max(additionalDiscount, 30);
      appliedCoupon = 'SERVICE30';
    }
    if (claimedCoupons.includes('REPAIR20')) {
      additionalDiscount = Math.max(additionalDiscount, 20);
      appliedCoupon = 'REPAIR20';
    }
    if (claimedCoupons.includes('INSTALL50') && serviceType.includes('Installation')) {
      additionalDiscount = Math.max(additionalDiscount, 50);
      appliedCoupon = 'INSTALL50';
    }
    
    return { discount: additionalDiscount, coupon: appliedCoupon };
  };

  const getDiscountedPrice = (originalPrice: number, additionalDiscount: number) => {
    return Math.round(originalPrice * (1 - additionalDiscount / 100));
  };

  const serviceCategories = [
    {
      title: "TV Installation & Repair",
      description: "LED/LCD TV mounting, setup, and repair services",
      price: 699,
      originalPrice: "Starting from ₹699",
      duration: "1-2 hours",
      features: ["Wall mounting", "Cable management", "Display calibration", "Smart TV setup"]
    },
    {
      title: "AC Service & Repair",
      description: "Gas refill, cleaning, installation, and maintenance",
      price: 899,
      originalPrice: "Starting from ₹899",
      duration: "2-3 hours",
      features: ["Gas Refill", "Deep Cleaning", "Installation", "Preventive Maintenance"]
    },
    {
      title: "Refrigerator Repair",
      description: "Expert refrigerator and freezer repair services",
      price: 899,
      originalPrice: "Starting from ₹899",
      duration: "1-3 hours",
      features: ["Gas refilling", "Compressor repair", "Temperature control", "Energy efficient"]
    },
    {
      title: "Washing Machine Service",
      description: "Complete washing machine repair and maintenance solutions",
      price: 799,
      originalPrice: "Starting from ₹799",
      duration: "1-2 hours",
      features: ["All brands supported", "Quick diagnosis", "Affordable rates", "Doorstep service"]
    },
    {
      title: "Microwave Service",
      description: "Microwave oven repair and maintenance services",
      price: 599,
      originalPrice: "Starting from ₹599",
      duration: "1 hour",
      features: ["Component replacement", "Safety checks", "Performance optimization", "Quick turnaround"]
    },
    {
      title: "AC Installation & Repair",
      description: "Professional AC installation, maintenance, and repair services",
      price: 999,
      originalPrice: "Starting from ₹999",
      duration: "2-3 hours",
      features: ["Expert technicians", "Genuine parts", "1-year warranty", "Same-day service"]
    },
  ];

  const whyChooseUs = [
    {
      icon: User,
      title: "Certified Technicians",
      description: "Factory-trained professionals with years of experience and expertise"
    },
    {
      icon: Shield,
      title: "Genuine Parts",
      description: "Only authentic spare parts with manufacturer warranty and guarantee"
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Same-day service for most repairs and quick response time"
    },
    {
      icon: Award,
      title: "Service Warranty",
      description: "All service work backed by comprehensive warranty coverage"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookService = (serviceTitle: string) => {
    if (!user) {
      alert('Please log in to book a service');
      return;
    }
    
    setSelectedService(serviceTitle);
    // Pre-fill user details from registration
    setFormData(prev => ({ 
      ...prev, 
      serviceType: serviceTitle,
      name: `${user.firstName} ${user.lastName}`,
      mobile: user.mobile
    }));
    setIsBookingOpen(true);
  };

  const generateBookingReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KC${timestamp}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reference = generateBookingReference();
    const serviceData = serviceCategories.find(s => s.title === selectedService);
    const couponDiscount = getServiceDiscount(selectedService);
    const originalPrice = serviceData?.price || 0;
    const finalPrice = couponDiscount.discount > 0 
      ? getDiscountedPrice(originalPrice, couponDiscount.discount)
      : originalPrice;
    
    const booking = {
      id: reference,
      serviceName: selectedService,
      customerName: formData.name,
      phone: formData.mobile,
      address: formData.address,
      serviceDate: formData.serviceDate,
      serviceTime: '10:00 AM - 12:00 PM', // Default time slot
      reference,
      bookingDate: new Date().toLocaleDateString('en-IN'),
      status: 'Confirmed',
      price: finalPrice,
      originalPrice,
      appliedCoupon: couponDiscount.coupon,
      discount: couponDiscount.discount,
      savings: originalPrice - finalPrice,
      description: `${selectedService} service booking`
    };
    
    // Save to user's booked services if logged in
    if (user) {
      // Save to localStorage directly for MyServices page
      const existingServices = localStorage.getItem(`user-services-${user.id}`);
      const currentServices = existingServices ? JSON.parse(existingServices) : [];
      const updatedServices = [...currentServices, booking];
      localStorage.setItem(`user-services-${user.id}`, JSON.stringify(updatedServices));
      console.log('Service saved to user services:', booking.reference);
    }
    
    setBookingReference(reference);
    setConfirmedBooking(booking);
    setIsBookingOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleNewBooking = () => {
    setIsConfirmationOpen(false);
    setFormData({ name: "", mobile: "", address: "", serviceDate: "" });
    setSelectedService("");
    setBookingReference("");
    setConfirmedBooking(null);
  };

  const downloadReceipt = () => {
    if (!confirmedBooking) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KAVITA COOLER', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Appliances & Services', pageWidth / 2, 40, { align: 'center' });
    
    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(20, 50, pageWidth - 20, 50);
    
    // Receipt Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SERVICE BOOKING RECEIPT', pageWidth / 2, 65, { align: 'center' });
    
    // Booking Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    let yPosition = 85;
    
    const addLine = (label: string, value: string) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label + ':', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, 80, yPosition);
      yPosition += 15;
    };
    
    addLine('Booking Reference', bookingReference);
    addLine('Service Type', confirmedBooking.service);
    addLine('Customer Name', confirmedBooking.name);
    addLine('Mobile Number', confirmedBooking.mobile);
    
    // Address (multiline if needed)
    pdf.setFont('helvetica', 'bold');
    pdf.text('Address:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    const addressLines = pdf.splitTextToSize(confirmedBooking.address, pageWidth - 100);
    pdf.text(addressLines, 80, yPosition);
    yPosition += addressLines.length * 7 + 8;
    
    addLine('Service Date', new Date(confirmedBooking.serviceDate).toLocaleDateString('en-IN'));
    addLine('Booking Date', confirmedBooking.bookingDate);
    addLine('Status', confirmedBooking.status);
    
    // Pricing Section
    yPosition += 10;
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Service Pricing:', 20, yPosition);
    yPosition += 15;
    
    if (confirmedBooking.appliedCoupon && confirmedBooking.discount > 0) {
      addLine('Original Price', `₹${confirmedBooking.originalPrice.toLocaleString()}`);
      addLine('Coupon Applied', confirmedBooking.appliedCoupon);
      addLine('Discount', `${confirmedBooking.discount}% OFF`);
      addLine('You Save', `₹${confirmedBooking.savings.toLocaleString()}`);
      addLine('Final Price', `₹${confirmedBooking.finalPrice.toLocaleString()}`);
    } else {
      addLine('Service Price', `₹${confirmedBooking.originalPrice.toLocaleString()}`);
    }
    
    // Next Steps Section
    yPosition += 10;
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('What\'s Next?', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const nextSteps = [
      '• Our technician will call you within 2 hours',
      '• Service will be completed on your preferred date',
      '• Keep your booking reference for future communication'
    ];
    
    nextSteps.forEach(step => {
      pdf.text(step, 25, yPosition);
      yPosition += 12;
    });
    
    // Footer
    yPosition += 20;
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank you for choosing Kavita Cooler!', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Contact: +91 98765 43210', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text('Email: info@kavitacooler.com', pageWidth / 2, yPosition + 10, { align: 'center' });
    
    // Save the PDF
    pdf.save(`Service-Receipt-${bookingReference}.pdf`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-br from-background to-muted/30">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-6 h-6 text-primary" />
                    <span className="text-primary font-semibold">Professional Services</span>
                  </div>
                  
                  <h1 className="heading-1">
                    Expert Appliance 
                    <span className="text-primary"> Service & Repair</span>
                  </h1>
                  
                  <p className="body-text text-xl">
                    Professional repair and maintenance services for all your home appliances. 
                    Certified technicians, genuine parts, and warranty on all work.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary">5000+</p>
                        <p className="body-small">Happy Customers</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary">24/7</p>
                        <p className="body-small">Emergency Service</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-hero">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now: +91 98765 43210
                  </Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Service
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative">
                  <img
                    src={serviceTechnicianImage}
                    alt="Professional Technician Service"
                    className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                  />
                  
                  <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-secondary">Emergency Service</p>
                        <p className="body-small">Available 24/7 for urgent repairs</p>
                      </div>
                      <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="section-spacing">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Our Services</h2>
              <p className="body-text max-w-2xl mx-auto">
                Comprehensive repair and maintenance solutions for all your home appliances 
                with professional expertise and genuine parts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCategories.map((service, index) => (
                <Card key={service.title} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground mb-3">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const couponDiscount = getServiceDiscount(service.title);
                          const finalPrice = couponDiscount.discount > 0 
                            ? getDiscountedPrice(service.price, couponDiscount.discount)
                            : service.price;
                          
                          return (
                            <>
                              <span className="text-2xl font-bold text-primary">Starting from ₹{finalPrice}</span>
                              {couponDiscount.discount > 0 && (
                                <>
                                  <span className="text-lg text-muted-foreground line-through">₹{service.price}</span>
                                  <div className="flex items-center space-x-1">
                                    <Tag className="w-4 h-4 text-success" />
                                    <span className="text-sm font-medium text-success">{couponDiscount.coupon}</span>
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    </div>

                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="body-small">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      size="sm"
                      onClick={() => handleBookService(service.title)}
                    >
                      Book Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Why Choose Our Services?</h2>
              <p className="body-text max-w-2xl mx-auto">
                We're committed to providing the highest quality appliance service 
                with professionalism, reliability, and customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <div
                    key={point.title}
                    className="text-center space-y-4 p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary mb-2">{point.title}</h4>
                      <p className="body-small text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container-custom">
            <div className="text-center">
              <h2 className="heading-2 mb-4">Need Help?</h2>
              <p className="body-text mb-8 max-w-2xl mx-auto">
                Our expert technicians are ready to help you with any appliance service needs. 
                Book a service above or contact us directly for immediate assistance.
              </p>
              <Button className="btn-hero">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </Button>
            </div>
          </div>
        </section>

        {/* Service Booking Modal */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Book {selectedService}</span>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Full Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Mobile Number *</label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Enter your mobile number"
                  type="tel"
                  required
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Address *</label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Service Date *</label>
                <Input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => handleInputChange("serviceDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="btn-hero flex-1">
                  Book Service
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Service Confirmation Modal */}
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-success">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span>Service Confirmed!</span>
              </DialogTitle>
            </DialogHeader>
            
            {confirmedBooking && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Your service has been booked successfully!</h3>
                  <p className="text-muted-foreground">Our team will contact you soon to confirm the appointment.</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Booking Reference:</span>
                    <span className="text-primary font-bold">{bookingReference}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Service:</span>
                    <span>{confirmedBooking.service}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Customer Name:</span>
                    <span>{confirmedBooking.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Mobile Number:</span>
                    <span>{confirmedBooking.mobile}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium">Address:</span>
                    <span className="text-right max-w-[200px]">{confirmedBooking.address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Service Date:</span>
                    <span>{new Date(confirmedBooking.serviceDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Booking Date:</span>
                    <span>{confirmedBooking.bookingDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status:</span>
                    <span className="text-success font-semibold">{confirmedBooking.status}</span>
                  </div>
                  {confirmedBooking.appliedCoupon && confirmedBooking.discount > 0 && (
                    <>
                      <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
                        <span className="font-medium">Original Price:</span>
                        <span>₹{confirmedBooking.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-success">
                        <span className="font-medium">Coupon Applied:</span>
                        <span className="font-semibold">{confirmedBooking.appliedCoupon}</span>
                      </div>
                      <div className="flex justify-between items-center text-success">
                        <span className="font-medium">Discount:</span>
                        <span className="font-semibold">{confirmedBooking.discount}% OFF</span>
                      </div>
                      <div className="flex justify-between items-center text-success">
                        <span className="font-medium">You Save:</span>
                        <span className="font-semibold">₹{confirmedBooking.savings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg border-t border-border pt-2">
                        <span>Final Price:</span>
                        <span className="text-primary">₹{confirmedBooking.finalPrice.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {!confirmedBooking.appliedCoupon && (
                    <div className="flex justify-between items-center font-bold text-lg border-t border-border pt-2">
                      <span>Service Price:</span>
                      <span className="text-primary">₹{confirmedBooking.originalPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Our technician will call you within 2 hours</li>
                    <li>• Service will be completed on your preferred date</li>
                    <li>• Keep your booking reference for future communication</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={downloadReceipt}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={handleNewBooking}
                      className="flex-1"
                    >
                      Book Another Service
                    </Button>
                    <Button 
                      className="btn-hero flex-1"
                      onClick={() => {
                        setIsConfirmationOpen(false);
                        if (user) {
                          navigate('/my-services');
                        }
                      }}
                    >
                      {user ? 'View My Services' : 'Done'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Services;