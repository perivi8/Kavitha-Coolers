import { useState } from "react";
import { Calendar, Clock, MapPin, Phone, User, Mail, Wrench, Home, Building } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BookService = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    appliance: "",
    issue: "",
    propertyType: "residential"
  });

  const services = [
    {
      id: "ac-service",
      name: "AC Service & Repair",
      price: "₹499",
      description: "Complete AC cleaning, gas refill, and maintenance",
      duration: "2-3 hours",
      icon: "❄️"
    },
    {
      id: "refrigerator-service",
      name: "Refrigerator Service",
      price: "₹299",
      description: "Cleaning, maintenance, and repair services",
      duration: "1-2 hours",
      icon: "🧊"
    },
    {
      id: "washing-machine-service",
      name: "Washing Machine Service",
      price: "₹399",
      description: "Deep cleaning and repair services",
      duration: "1.5-2 hours",
      icon: "👕"
    },
    {
      id: "tv-service",
      name: "TV Installation & Service",
      price: "₹199",
      description: "Wall mounting, setup, and repair",
      duration: "1-2 hours",
      icon: "📺"
    },
    {
      id: "water-heater-service",
      name: "Water Heater Service",
      price: "₹249",
      description: "Maintenance and repair services",
      duration: "1 hour",
      icon: "🚿"
    },
    {
      id: "microwave-service",
      name: "Microwave Service",
      price: "₹199",
      description: "Cleaning and repair services",
      duration: "1 hour",
      icon: "🔥"
    }
  ];

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Service booking submitted:", {
      ...formData,
      selectedService,
      selectedDate,
      selectedTime
    });
    alert("Service booked successfully! You will receive a confirmation call within 30 minutes.");
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-IN', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-spacing">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Wrench className="w-6 h-6 text-primary" />
              <span className="text-primary font-semibold">Professional Service</span>
            </div>
            <h1 className="heading-1 mb-4">Book Your Service</h1>
            <p className="body-text max-w-2xl mx-auto">
              Get expert technicians at your doorstep. Professional service with genuine parts and warranty.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Types */}
              <div>
                <h2 className="heading-3 mb-6">Select Service Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedService === service.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            <Badge variant="secondary">{service.price}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              {selectedService && (
                <div>
                  <h2 className="heading-3 mb-6">Select Date & Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Date</label>
                      <Select value={selectedDate} onValueChange={setSelectedDate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateDateOptions().map((date) => (
                            <SelectItem key={date.value} value={date.value}>
                              {date.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Time</label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Details Form */}
              {selectedService && selectedDate && selectedTime && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="heading-3">Customer Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="tel"
                          className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Type</label>
                      <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">
                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4" />
                              Residential
                            </div>
                          </SelectItem>
                          <SelectItem value="commercial">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Commercial
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Complete Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your complete address with landmark"
                        rows={3}
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Description</label>
                    <textarea
                      className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Describe the issue you're facing (optional)"
                      rows={3}
                      value={formData.issue}
                      onChange={(e) => handleInputChange('issue', e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    Book Service Now
                  </Button>
                </form>
              )}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="heading-4 mb-4">Booking Summary</h3>
                  
                  {selectedService ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Service:</span>
                        <span className="font-medium text-sm">
                          {services.find(s => s.id === selectedService)?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Price:</span>
                        <span className="font-medium text-primary">
                          {services.find(s => s.id === selectedService)?.price}
                        </span>
                      </div>
                      
                      {selectedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Date:</span>
                          <span className="font-medium text-sm">
                            {generateDateOptions().find(d => d.value === selectedDate)?.label}
                          </span>
                        </div>
                      )}
                      
                      {selectedTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Time:</span>
                          <span className="font-medium text-sm">{selectedTime}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Total:</span>
                          <span className="font-semibold text-primary text-lg">
                            {services.find(s => s.id === selectedService)?.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Please select a service to see booking details.
                    </p>
                  )}
                </div>

                {/* Service Features */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span>Certified Technicians</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-success" />
                    </div>
                    <span>Genuine Parts</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <span>Same Day Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookService;
