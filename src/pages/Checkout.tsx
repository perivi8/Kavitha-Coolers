import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, MapPin, Phone, User, Mail, Calendar, Tag, Download, Plus, Edit } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import jsPDF from 'jspdf';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, getOriginalTotal, getTotalDiscount, clearCart } = useCart();
  const { user, isLoggedIn, updateUserAddresses, addOrder } = useAuth();
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    flatNumber: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    paymentMethod: ""
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const [countries] = useState([
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "CN", name: "China" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "AR", name: "Argentina" },
    { code: "ZA", name: "South Africa" },
    { code: "EG", name: "Egypt" },
    { code: "NG", name: "Nigeria" },
    { code: "KE", name: "Kenya" },
    { code: "SA", name: "Saudi Arabia" }
  ]);

  const [statesByCountry] = useState({
    US: ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"],
    CA: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island"],
    GB: ["England", "Scotland", "Wales", "Northern Ireland"],
    AU: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"],
    DE: ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Lower Saxony", "Hesse", "Saxony", "Rhineland-Palatinate", "Schleswig-Holstein", "Brandenburg", "Saxony-Anhalt"],
    FR: ["Île-de-France", "Auvergne-Rhône-Alpes", "Hauts-de-France", "Occitanie", "Nouvelle-Aquitaine", "Grand Est", "Provence-Alpes-Côte d'Azur", "Pays de la Loire", "Bourgogne-Franche-Comté", "Bretagne"],
    IN: ["Maharashtra", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal", "Rajasthan", "Andhra Pradesh", "Odisha", "Telangana", "Kerala", "Jharkhand", "Assam", "Punjab", "Chhattisgarh", "Haryana", "Bihar", "Madhya Pradesh", "Uttarakhand", "Goa"]
  });

  const [citiesByState] = useState({
    "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
    "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne"],
    "England": ["London", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Newcastle", "Nottingham", "Leicester"],
    "Scotland": ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Stirling", "Perth", "Inverness", "Paisley", "East Kilbride", "Livingston"],
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Maitland", "Albury", "Wagga Wagga", "Port Macquarie", "Tamworth", "Orange"],
    "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton", "Wodonga", "Warrnambool", "Traralgon", "Mildura", "Horsham"],
    "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Würzburg", "Regensburg", "Ingolstadt", "Fürth", "Erlangen", "Bayreuth", "Bamberg"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"],
    "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Créteil", "Nanterre", "Colombes", "Aulnay-sous-Bois", "Rueil-Malmaison"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Villeurbanne", "Clermont-Ferrand", "Annecy", "Chambéry", "Valence", "Bourg-en-Bresse", "Roanne"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli", "Malegaon"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Baharampur", "Habra", "Kharagpur"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Pali"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Eluru"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kannur", "Kasaragod"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Batala", "Pathankot", "Moga"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Baripada", "Bhadrak", "Jharsuguda"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Sivasagar"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwar", "Ramnagar", "Manglaur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund"],
    "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Cuncolim", "Quepem"]
  });

  useEffect(() => {
    if (cart.length === 0 && !isOrderConfirmed) {
      navigate('/shop');
    }
  }, [cart, navigate, isOrderConfirmed]);

  // Load saved addresses and form data when user is logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      // Load saved addresses
      if (user.addresses && user.addresses.length > 0) {
        setSavedAddresses(user.addresses);
        setIsAddingNewAddress(false);
      } else {
        setSavedAddresses([]);
        setIsAddingNewAddress(true); // Auto-enable address form when no addresses exist
      }
      
      // Auto-fill form with user data
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        flatNumber: user.flatNumber || "",
        landmark: user.landmark || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        paymentMethod: ""
      });
    } else {
      // Clear form data when not logged in
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        flatNumber: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        paymentMethod: ""
      });
      setSavedAddresses([]);
      setSelectedAddressId(null);
      setIsAddingNewAddress(false);
      setEditingAddressId(null);
    }
  }, [isLoggedIn, user]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    
    // Reset dependent fields when parent changes
    if (field === 'country') {
      updatedData.state = '';
      updatedData.city = '';
    } else if (field === 'state') {
      updatedData.city = '';
    }
    
    setFormData(updatedData);
    
    // Save to localStorage (excluding payment method for security)
    const { paymentMethod, ...dataToSave } = updatedData;
    localStorage.setItem('checkoutFormData', JSON.stringify(dataToSave));
  };

  const handleCardDetailsChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const saveCurrentAddress = () => {
    if (!isLoggedIn || !user) return;
    
    const addressData = {
      id: Date.now().toString(),
      flatNumber: formData.flatNumber,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      isDefault: savedAddresses.length === 0
    };
    
    const updatedAddresses = [...savedAddresses, addressData];
    setSavedAddresses(updatedAddresses);
    updateUserAddresses(updatedAddresses);
    setIsAddingNewAddress(false);
  };

  const selectAddress = (addressId: string) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setFormData(prev => ({
        ...prev,
        flatNumber: address.flatNumber,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country
      }));
      setSelectedAddressId(addressId);
    }
  };

  const editAddress = (addressId: string) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setFormData(prev => ({
        ...prev,
        flatNumber: address.flatNumber,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country
      }));
      setEditingAddressId(addressId);
      setIsAddingNewAddress(true);
    }
  };

  const updateAddress = () => {
    if (!editingAddressId) return;
    
    const updatedAddresses = savedAddresses.map(addr => 
      addr.id === editingAddressId 
        ? {
            ...addr,
            flatNumber: formData.flatNumber,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            country: formData.country
          }
        : addr
    );
    
    setSavedAddresses(updatedAddresses);
    updateUserAddresses(updatedAddresses);
    setEditingAddressId(null);
    setIsAddingNewAddress(false);
  };

  const generateOrderReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KC${timestamp}${random}`;
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    if (!formData.flatNumber.trim()) errors.flatNumber = "Flat/House number is required";
    if (!formData.landmark.trim()) errors.landmark = "Landmark is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.paymentMethod) errors.paymentMethod = "Please select a payment method";
    
    // Validate card details if payment method is credit/debit card
    if ((formData.paymentMethod === 'credit-card' || formData.paymentMethod === 'debit-card')) {
      if (!cardDetails.cardholderName.trim()) errors.cardholderName = "Cardholder name is required";
      if (!cardDetails.cardNumber.trim()) errors.cardNumber = "Card number is required";
      if (!cardDetails.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
      if (!cardDetails.cvv.trim()) errors.cvv = "CVV is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reference = generateOrderReference();
    const orderDate = new Date();
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(orderDate.getDate() + 7); // 7 days from order date
    
    const order = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.mobile,
      cardDetails: formData.paymentMethod !== 'cod' ? cardDetails : null,
      items: cart,
      reference,
      orderDate: orderDate.toLocaleDateString('en-IN'),
      expectedDeliveryDate: expectedDeliveryDate.toLocaleDateString('en-IN'),
      totalAmount: getTotalPrice(),
      originalAmount: getOriginalTotal(),
      discount: getTotalDiscount(),
      status: 'Processing'
    };
    
    setOrderReference(reference);
    setConfirmedOrder(order);
    setIsSubmitting(false);
    setIsOrderConfirmed(true);
    
    // Save order to user's profile
    addOrder(order);
    
    // Clear cart after setting confirmation to prevent redirect
    setTimeout(() => {
      clearCart();
    }, 100);
  };

  const downloadReceipt = () => {
    if (!confirmedOrder) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KAVITA COOLER', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Appliances & Electronics', pageWidth / 2, 40, { align: 'center' });
    
    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(20, 50, pageWidth - 20, 50);
    
    // Receipt Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ORDER RECEIPT', pageWidth / 2, 65, { align: 'center' });
    
    // Order Details
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
    
    addLine('Order Reference', orderReference);
    addLine('Customer Name', confirmedOrder.name);
    addLine('Email', confirmedOrder.email);
    addLine('Mobile Number', confirmedOrder.phone);
    addLine('Order Date', confirmedOrder.orderDate);
    addLine('Payment Method', confirmedOrder.paymentMethod);
    
    // Address (multiline if needed)
    pdf.setFont('helvetica', 'bold');
    pdf.text('Shipping Address:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    const fullAddress = `${confirmedOrder.address}, ${confirmedOrder.city}, ${confirmedOrder.state}, ${confirmedOrder.country}`;
    const addressLines = pdf.splitTextToSize(fullAddress, pageWidth - 100);
    pdf.text(addressLines, 80, yPosition);
    yPosition += addressLines.length * 7 + 15;
    
    // Items Section
    pdf.setFont('helvetica', 'bold');
    pdf.text('Items Ordered:', 20, yPosition);
    yPosition += 15;
    
    confirmedOrder.items.forEach((item: any, index: number) => {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${index + 1}. ${item.name}`, 25, yPosition);
      pdf.text(`Qty: ${item.quantity}`, 25, yPosition + 10);
      pdf.text(`₹${item.price.toLocaleString()} each`, 25, yPosition + 20);
      
      if (item.appliedCoupon) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Coupon Applied: ${item.appliedCoupon}`, 25, yPosition + 30);
        pdf.text(`Discount: ${item.discount}%`, 25, yPosition + 40);
        yPosition += 50;
      } else {
        yPosition += 30;
      }
      yPosition += 10;
    });
    
    // Pricing Summary
    yPosition += 10;
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Order Summary:', 20, yPosition);
    yPosition += 15;
    
    if (confirmedOrder.discount > 0) {
      addLine('Original Amount', `₹${confirmedOrder.originalAmount.toLocaleString()}`);
      addLine('Coupon Discount', `-₹${confirmedOrder.discount.toLocaleString()}`);
    }
    addLine('Total Amount', `₹${confirmedOrder.totalAmount.toLocaleString()}`);
    
    // Footer
    yPosition += 20;
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank you for shopping with Kavita Cooler!', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Contact: +91 98765 43210', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text('Email: info@kavitacooler.com', pageWidth / 2, yPosition + 10, { align: 'center' });
    
    // Save the PDF
    pdf.save(`Order-Receipt-${orderReference}.pdf`);
  };

  const getAvailableStates = () => {
    const states = statesByCountry[formData.country as keyof typeof statesByCountry] || [];
    console.log('Available states for', formData.country, ':', states);
    return states;
  };

  const getAvailableCities = () => {
    const cities = citiesByState[formData.state as keyof typeof citiesByState] || [];
    console.log('Available cities for', formData.state, ':', cities);
    return cities;
  };

  // Debug cart state
  console.log('Cart state in checkout:', cart);
  console.log('Cart length:', cart.length);
  console.log('Is order confirmed:', isOrderConfirmed);

  // Force reload cart from localStorage if empty
  useEffect(() => {
    if (cart.length === 0) {
      const savedCart = localStorage.getItem('appliance-cart');
      console.log('Checkout: Checking localStorage for cart:', savedCart);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Checkout: Found cart in localStorage, length:', parsedCart.length);
      }
    }
  }, [cart.length]);

  // Show order confirmation modal if order is confirmed
  if (isOrderConfirmed && confirmedOrder) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-16">
          <Dialog open={true} onOpenChange={() => {
            setIsOrderConfirmed(false);
            setConfirmedOrder(null);
            navigate('/');
          }} modal={true}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-success">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Order Confirmed!</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Your order has been placed successfully!</h3>
                  <p className="text-muted-foreground">We'll send you updates about your order status.</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order Reference:</span>
                    <span className="text-primary font-bold">{orderReference}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Customer Name:</span>
                    <span>{confirmedOrder.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email:</span>
                    <span>{confirmedOrder.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phone:</span>
                    <span>{confirmedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">{confirmedOrder.paymentMethod.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order Date:</span>
                    <span>{confirmedOrder.orderDate}</span>
                  </div>
                  {confirmedOrder.discount > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Original Amount:</span>
                        <span>₹{confirmedOrder.originalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-success">
                        <span className="font-medium">Coupon Savings:</span>
                        <span>-₹{confirmedOrder.discount.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center font-bold text-lg border-t border-border pt-2">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{confirmedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You'll receive an order confirmation email shortly</li>
                    <li>• We'll process your order within 24 hours</li>
                    <li>• Delivery will be completed within 3-5 business days</li>
                    <li>• Track your order using the reference number</li>
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
                      onClick={() => navigate('/shop')}
                      className="flex-1"
                    >
                      Continue Shopping
                    </Button>
                    <Button 
                      className="btn-hero flex-1"
                      onClick={() => {
                        setIsOrderConfirmed(false);
                        setConfirmedOrder(null);
                        navigate('/');
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="section-spacing">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="heading-2 mb-4">Checkout</h1>
            <p className="body-text">Complete your order details below</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">First Name *</label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="Enter your first name"
                          required
                          className={validationErrors.firstName ? "border-red-500" : ""}
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Last Name *</label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Enter your last name"
                          required
                          className={validationErrors.lastName ? "border-red-500" : ""}
                        />
                        {validationErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          required
                          className={validationErrors.email ? "border-red-500" : ""}
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Mobile Number *</label>
                        <Input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange("mobile", e.target.value)}
                          placeholder="Enter your mobile number"
                          required
                          className={validationErrors.mobile ? "border-red-500" : ""}
                        />
                        {validationErrors.mobile && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.mobile}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Shipping Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Flat/House Number *</label>
                        <Input
                          value={formData.flatNumber}
                          onChange={(e) => handleInputChange("flatNumber", e.target.value)}
                          placeholder="e.g., Flat 101, Building A"
                          required
                          className={validationErrors.flatNumber ? "border-red-500" : ""}
                        />
                        {validationErrors.flatNumber && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.flatNumber}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Landmark *</label>
                        <Input
                          value={formData.landmark}
                          onChange={(e) => handleInputChange("landmark", e.target.value)}
                          placeholder="e.g., Near City Mall"
                          required
                          className={validationErrors.landmark ? "border-red-500" : ""}
                        />
                        {validationErrors.landmark && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.landmark}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Country *</label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block font-medium mb-2">State *</label>
                        <Select 
                          value={formData.state} 
                          onValueChange={(value) => handleInputChange("state", value)}
                        >
                          <SelectTrigger className={validationErrors.state ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableStates().map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block font-medium mb-2">City *</label>
                        <Select 
                          value={formData.city} 
                          onValueChange={(value) => handleInputChange("city", value)}
                          disabled={!formData.state}
                        >
                          <SelectTrigger className={validationErrors.city ? "border-red-500" : ""}>
                            <SelectValue placeholder={formData.state ? "Select city" : "Select state first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableCities().length > 0 ? (
                              getAvailableCities().map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-cities" disabled>
                                No cities available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Saved Addresses Section */}
                    {isLoggedIn && savedAddresses.length > 0 && !isAddingNewAddress && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-medium mb-4">Saved Addresses</h4>
                        <div className="space-y-3">
                          {savedAddresses.map((address) => (
                            <div
                              key={address.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedAddressId === address.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => selectAddress(address.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {address.flatNumber}, {address.landmark}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.city}, {address.state}, {countries.find(c => c.code === address.country)?.name}
                                  </p>
                                  {address.isDefault && (
                                    <Badge variant="secondary" className="mt-2">Default</Badge>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editAddress(address.id);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address Management Buttons */}
                    {isLoggedIn && (
                      <div className="mt-6 pt-6 border-t border-border">
                        {!isAddingNewAddress && savedAddresses.length > 0 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddingNewAddress(true)}
                            className="w-full flex items-center justify-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Another Address</span>
                          </Button>
                        ) : isAddingNewAddress ? (
                          <div className="flex space-x-3">
                            <Button
                              type="button"
                              onClick={editingAddressId ? updateAddress : saveCurrentAddress}
                              className="flex-1"
                            >
                              {editingAddressId ? 'Update Address' : savedAddresses.length === 0 ? 'Save Address' : 'Save Address'}
                            </Button>
                            {savedAddresses.length > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsAddingNewAddress(false);
                                  setEditingAddressId(null);
                                }}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Payment Method</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "credit-card", label: "Credit Card", icon: CreditCard },
                        { value: "debit-card", label: "Debit Card", icon: CreditCard },
                        { value: "cod", label: "Cash on Delivery", icon: Truck }
                      ].map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <div
                            key={method.value}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              formData.paymentMethod === method.value
                                ? 'border-primary bg-primary/5'
                                : validationErrors.paymentMethod
                                ? 'border-red-500 hover:border-red-400'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleInputChange("paymentMethod", method.value)}
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-5 h-5" />
                              <span className="font-medium">{method.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {validationErrors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-2">{validationErrors.paymentMethod}</p>
                    )}

                    {/* Card Details Form */}
                    {(formData.paymentMethod === 'credit-card' || formData.paymentMethod === 'debit-card') && (
                      <div className="border-t border-border pt-6">
                        <h4 className="font-semibold mb-4">Card Details</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block font-medium mb-2">Cardholder Name *</label>
                            <Input
                              value={cardDetails.cardholderName}
                              onChange={(e) => handleCardDetailsChange("cardholderName", e.target.value)}
                              placeholder="Enter cardholder name"
                              required
                              className={validationErrors.cardholderName ? "border-red-500" : ""}
                            />
                            {validationErrors.cardholderName && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.cardholderName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium mb-2">Card Number *</label>
                            <Input
                              value={cardDetails.cardNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                                if (value.length <= 19) handleCardDetailsChange("cardNumber", value);
                              }}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2">Expiry Date *</label>
                              <Input
                                value={cardDetails.expiryDate}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
                                  if (value.length <= 5) handleCardDetailsChange("expiryDate", value);
                                }}
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                              />
                            </div>
                            <div>
                              <label className="block font-medium mb-2">CVV *</label>
                              <Input
                                value={cardDetails.cvv}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= 3) handleCardDetailsChange("cvv", value);
                                }}
                                placeholder="123"
                                maxLength={3}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'cod' && (
                      <div className="border-t border-border pt-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">Cash on Delivery</h4>
                          <p className="text-sm text-blue-800">
                            Pay when your order is delivered to your doorstep. 
                            Please keep the exact amount ready for a smooth delivery experience.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full btn-hero" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No items in cart</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Cart length: {cart.length}
                        </p>
                        <Button 
                          onClick={() => {
                            const savedCart = localStorage.getItem('appliance-cart');
                            console.log('Manual check - localStorage cart:', savedCart);
                          }}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          Check localStorage
                        </Button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            {item.appliedCoupon && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  {item.appliedCoupon}
                                </span>
                                <span className="text-xs text-green-600">
                                  {item.discount}% off
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            {item.appliedCoupon && item.originalPrice > item.price && (
                              <p className="text-sm text-muted-foreground line-through">
                                ₹{(item.originalPrice * item.quantity).toLocaleString()}
                              </p>
                            )}
                            <p className="font-medium">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {getTotalDiscount() > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span>Original Total:</span>
                          <span>₹{getOriginalTotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-success">
                          <span>Coupon Discount:</span>
                          <span>-₹{getTotalDiscount().toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                      <span>Total:</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Order Confirmation Modal */}
      <Dialog open={isOrderConfirmed} onOpenChange={() => {}} modal={true}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-success">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span>Order Confirmed!</span>
            </DialogTitle>
          </DialogHeader>
          
          {confirmedOrder && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Your order has been placed successfully!</h3>
                <p className="text-muted-foreground">We'll send you updates about your order status.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order Reference:</span>
                  <span className="text-primary font-bold">{orderReference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Customer Name:</span>
                  <span>{confirmedOrder.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Email:</span>
                  <span>{confirmedOrder.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Phone:</span>
                  <span>{confirmedOrder.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Method:</span>
                  <span className="capitalize">{confirmedOrder.paymentMethod.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order Date:</span>
                  <span>{confirmedOrder.orderDate}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Original Amount:</span>
                      <span>₹{confirmedOrder.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-success">
                      <span className="font-medium">Coupon Savings:</span>
                      <span>-₹{confirmedOrder.discount.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center font-bold text-lg border-t border-border pt-2">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{confirmedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You'll receive an order confirmation email shortly</li>
                  <li>• We'll process your order within 24 hours</li>
                  <li>• Delivery will be completed within 3-5 business days</li>
                  <li>• Track your order using the reference number</li>
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
                    onClick={() => navigate('/shop')}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    className="btn-hero flex-1"
                    onClick={() => setIsOrderConfirmed(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Checkout;
