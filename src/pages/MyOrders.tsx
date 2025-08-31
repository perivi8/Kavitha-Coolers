import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, Phone, MapPin, X, Truck, CheckCircle, Clock, User, CreditCard, RotateCcw, AlertTriangle, Star, Shield, Zap, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
  const { user, isLoggedIn, orders } = useAuth();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [refundCardDetails, setRefundCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Load user-specific orders
    if (user?.id) {
      const savedOrders = localStorage.getItem(`user-orders-${user.id}`);
      console.log('Loading orders from localStorage:', savedOrders);
      if (savedOrders) {
        try {
          const orders = JSON.parse(savedOrders);
          console.log('Parsed orders:', orders);
          // Sort orders by date (newest first)
          const sortedOrders = orders.sort((a: any, b: any) => {
            const dateA = new Date(a.orderDate).getTime();
            const dateB = new Date(b.orderDate).getTime();
            return dateB - dateA;
          });
          console.log('Setting userOrders to:', sortedOrders);
          setUserOrders(sortedOrders);
        } catch (error) {
          console.error('Error parsing orders:', error);
          setUserOrders([]);
        }
      } else {
        setUserOrders([]);
      }
    }
  }, [isLoggedIn, user, navigate]);

  const getOrderStatus = (order: any) => {
    if (!order || !order.orderDate) return 'Processing';
    
    console.log('getOrderStatus called for order:', order.reference, 'with status:', order.status);
    
    // If order has been manually cancelled or returned, use that status - this takes priority
    if (order.status === 'Cancelled' || order.status === 'Returned') {
      console.log('Returning manual status:', order.status);
      return order.status;
    }
    
    // Parse order date properly
    const orderDateParts = order.orderDate.split('/');
    let orderDate;
    if (orderDateParts.length === 3) {
      // Assume DD/MM/YYYY format for Indian dates
      const day = parseInt(orderDateParts[0]);
      const month = parseInt(orderDateParts[1]) - 1; // Month is 0-indexed
      const year = parseInt(orderDateParts[2]);
      orderDate = new Date(year, month, day);
    } else {
      orderDate = new Date(order.orderDate);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    orderDate.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // Calculate days since order
    const daysSinceOrder = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check if we have an expected delivery date
    if (order.expectedDeliveryDate) {
      // Handle different date formats (DD/MM/YYYY or MM/DD/YYYY)
      const dateParts = order.expectedDeliveryDate.split('/');
      let expectedDeliveryDate;
      
      if (dateParts.length === 3) {
        // Assume DD/MM/YYYY format for Indian dates
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2]);
        expectedDeliveryDate = new Date(year, month, day);
      } else {
        expectedDeliveryDate = new Date(order.expectedDeliveryDate);
      }
      
      // Only show delivered if today is >= expected delivery date
      if (today >= expectedDeliveryDate) {
        return 'Delivered';
      }
    }
    
    // Status progression based on days since order
    // Day 0 (today): Processing
    // Day 1 (tomorrow): Processing  
    if (daysSinceOrder === 0 || daysSinceOrder === 1) {
      return 'Processing';
    }
    // Day 2 onwards until expected date: Shipped
    return 'Shipped';
  };

  const canCancelOrder = (order: any) => {
    const status = getOrderStatus(order);
    // Don't allow cancellation if already cancelled or returned
    if (order.status === 'Cancelled' || order.status === 'Returned') {
      return false;
    }
    return (status === 'Processing' || status === 'Shipped');
  };

  const canReturnOrder = (order: any) => {
    const status = getOrderStatus(order);
    // Don't allow return if already cancelled or returned
    if (order.status === 'Cancelled' || order.status === 'Returned') {
      return false;
    }
    return status === 'Delivered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg';
      case 'Shipped':
        return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg';
      case 'Delivered':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg';
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg';
      case 'Returned':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg';
    }
  };

  const getOrderTrackingSteps = (order: any) => {
    const status = getOrderStatus(order);
    const isCancelled = order.status === 'Cancelled';
    const isReturned = order.status === 'Returned';
    
    if (isCancelled) {
      // For cancelled orders, show all steps as cancelled (red)
      const steps = [
        { label: 'Order Placed', status: 'cancelled', icon: CheckCircle },
        { label: 'Processing', status: 'cancelled', icon: Package },
        { label: 'Order Cancelled', status: 'cancelled', icon: X },
        { label: 'Refund Processed', status: 'cancelled', icon: CreditCard }
      ];
      return steps;
    }
    
    if (isReturned) {
      // For returned orders, show return flow (red)
      const steps = [
        { label: 'Order Delivered', status: 'cancelled', icon: CheckCircle },
        { label: 'Return Requested', status: 'cancelled', icon: RotateCcw },
        { label: 'Item Collected', status: 'cancelled', icon: Truck },
        { label: 'Refund Processed', status: 'cancelled', icon: CreditCard }
      ];
      return steps;
    }
    
    // Normal order flow
    const steps = [
      { label: 'Order Placed', status: 'completed', icon: CheckCircle },
      { label: 'Processing', status: status === 'Processing' ? 'current' : 'completed', icon: Package },
      { label: 'Shipped', status: status === 'Shipped' ? 'current' : status === 'Delivered' ? 'completed' : 'pending', icon: Truck },
      { label: 'Delivered', status: status === 'Delivered' ? 'completed' : 'pending', icon: MapPin }
    ];
    return steps;
  };

  const handleTrackOrder = (order: any) => {
    setSelectedOrder(order);
    setShowTrackingDialog(true);
  };

  const handleCancelOrder = (order: any) => {
    console.log('handleCancelOrder called for:', order.reference);
    setSelectedOrder(order);
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = () => {
    if (!selectedOrder || !user?.id) return;

    console.log('Cancelling order:', selectedOrder.reference);
    console.log('Current userOrders:', userOrders);

    const updatedOrders = userOrders.map(order => {
      if (order.reference === selectedOrder.reference) {
        console.log('Found order to cancel:', order);
        return { ...order, status: 'Cancelled', cancelledDate: new Date().toLocaleDateString('en-IN') };
      }
      return order;
    });

    console.log('Updated orders:', updatedOrders);

    // Update state and localStorage
    setUserOrders(updatedOrders);
    localStorage.setItem(`user-orders-${user.id}`, JSON.stringify(updatedOrders));
    
    // Verify localStorage was updated
    const savedOrders = localStorage.getItem(`user-orders-${user.id}`);
    console.log('Saved to localStorage:', JSON.parse(savedOrders || '[]'));
    
    setShowCancelDialog(false);
    setSelectedOrder(null);
  };

  const handleRefundSubmit = () => {
    if (!selectedOrder || !user?.id) return;
    
    // Update order status to Returned after refund details are provided
    const updatedOrders = userOrders.map(order => 
      order.reference === selectedOrder.reference 
        ? { 
            ...order, 
            status: 'Returned', 
            returnDate: new Date().toLocaleDateString('en-IN'),
            returnRequestTime: Date.now() // Track when return was requested
          }
        : order
    );

    setUserOrders(updatedOrders);
    localStorage.setItem(`user-orders-${user.id}`, JSON.stringify(updatedOrders));
    
    // Set timeout to remove product details after 30 minutes
    setTimeout(() => {
      const finalOrders = JSON.parse(localStorage.getItem(`user-orders-${user.id}`) || '[]');
      const cleanedOrders = finalOrders.map((order: any) => 
        order.reference === selectedOrder.reference 
          ? { ...order, items: [], returnProcessed: true }
          : order
      );
      localStorage.setItem(`user-orders-${user.id}`, JSON.stringify(cleanedOrders));
      setUserOrders(cleanedOrders);
    }, 30 * 60 * 1000); // 30 minutes
    
    // Process refund (in real app, this would call payment gateway)
    alert(`Refund of ₹${selectedOrder.totalAmount.toLocaleString()} will be processed to your account ending in ${refundCardDetails.cardNumber.slice(-4)} within 5-7 business days.`);
    
    setShowRefundDialog(false);
    setRefundCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    setSelectedOrder(null);
  };


  const handleReturnOrder = (order: any) => {
    setSelectedOrder(order);
    setShowReturnDialog(true);
  };

  const confirmReturnOrder = () => {
    if (!selectedOrder || !user?.id) return;

    setShowReturnDialog(false);
    
    // For COD, return directly
    if (selectedOrder.paymentMethod === 'cod') {
      const updatedOrders = userOrders.map(order => 
        order.reference === selectedOrder.reference 
          ? { ...order, status: 'Returned', returnDate: new Date().toLocaleDateString('en-IN') }
          : order
      );
      setUserOrders(updatedOrders);
      localStorage.setItem(`user-orders-${user.id}`, JSON.stringify(updatedOrders));
      alert('Return request submitted successfully. No refund required for COD orders.');
      setSelectedOrder(null);
    } else {
      // For card payments, show refund form
      setShowRefundDialog(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <Header />
        <main className="section-spacing">
          <div className="container-custom">
            <div className="text-center py-12">
              <h1 className="heading-2 mb-4">Please Login</h1>
              <p className="body-text mb-4">You need to login to view your orders</p>
              <Button onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="py-8 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            My Orders
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your purchases and manage returns with complete order visibility
          </p>
        </div>

        {userOrders.length === 0 ? (
            <div className="max-w-md mx-auto">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Start shopping for quality appliances and accessories to see your orders here
                  </p>
                  <Button 
                    onClick={() => navigate('/shop')} 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.filter(order => order && order.orderDate).map((order) => {
                const status = getOrderStatus(order);
                return (
                  <Card key={order.reference} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Package className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">Order #{order.reference}</h3>
                              <div className="flex items-center gap-6 text-purple-100 mt-2">
                                <span className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Ordered: {order.orderDate}
                                </span>
                                {order.expectedDeliveryDate && (
                                  <span className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Expected: {order.expectedDeliveryDate}
                                  </span>
                                )}
                                <span className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  {order.paymentMethod.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(status)} font-semibold px-4 py-2 text-sm shadow-lg`}>
                              {status}
                            </Badge>
                            <div className="mt-2 text-2xl font-bold text-white">
                              ₹{order.totalAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Order Items */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-purple-600" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Items Ordered</h4>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                              {(order.items || []).map((item: any, index: number) => (
                                <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center overflow-hidden">
                                      {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                      ) : (
                                        <Package className="w-8 h-8 text-purple-600" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-bold text-gray-900 mb-1">{item.name}</div>
                                      <div className="text-sm text-gray-600 mb-2">
                                        {item.brand && <span className="bg-gray-100 px-2 py-1 rounded mr-2 font-medium">Brand: {item.brand}</span>}
                                        <span className="bg-blue-100 px-2 py-1 rounded font-medium text-blue-800">Qty: {item.quantity}</span>
                                      </div>
                                      {item.appliedCoupon && (
                                        <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg inline-block">
                                          <Star className="w-3 h-3 inline mr-1" />
                                          {item.appliedCoupon} ({item.discount}% off)
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xl font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                                      {item.originalPrice > item.price && (
                                        <div className="text-sm text-gray-500 line-through">
                                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-pink-600" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Shipping Address</h4>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                              <div className="space-y-3">
                                <div className="font-bold text-gray-900 text-lg">{order.name}</div>
                                <div className="text-gray-700 leading-relaxed">
                                  <div>{order.flatNumber}</div>
                                  <div>{order.landmark}</div>
                                  <div>{order.city}, {order.state}</div>
                                  <div>{order.country}</div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-pink-200">
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-pink-600" />
                                    <span className="font-semibold text-gray-800">{order.phone}</span>
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
                              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-700 font-medium">
                                {order.status === 'Cancelled' ? (
                                  <span className="text-red-600">Order cancelled on {order.cancelledDate}</span>
                                ) : order.status === 'Returned' ? (
                                  <span className="text-purple-600">Order returned on {order.returnDate}</span>
                                ) : (
                                  `Ordered on ${order.orderDate} • Processing your order`
                                )}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              {canCancelOrder(order) && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCancelOrder(order)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 px-6 py-2 rounded-lg font-medium"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel Order
                                </Button>
                              )}
                              
                              {canReturnOrder(order) && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReturnOrder(order)}
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 px-6 py-2 rounded-lg font-medium"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Return Order
                                </Button>
                              )}
                              
                              <Button 
                                size="sm"
                                onClick={() => handleTrackOrder(order)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Track Order
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

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to cancel order #{selectedOrder?.reference}?</p>
            {selectedOrder?.paymentMethod === 'cod' ? (
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. No refund is required for COD orders.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Refund will be processed to your {selectedOrder?.paymentMethod === 'credit-card' ? 'Credit Card' : 'Debit Card'} within 2-3 business days.
              </p>
            )}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                Keep Order
              </Button>
              <Button onClick={confirmCancelOrder} className="flex-1 bg-red-600 hover:bg-red-700">
                Cancel Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Card Details Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Refund Details</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide your card details for the refund of ₹{selectedOrder?.totalAmount.toLocaleString()}
            </p>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Privacy Policy:</strong> Your card details are processed securely and used only for refund purposes. We do not store your payment information.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Card Number *</label>
                <Input
                  value={refundCardDetails.cardNumber}
                  onChange={(e) => setRefundCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Expiry Date *</label>
                  <Input
                    value={refundCardDetails.expiryDate}
                    onChange={(e) => setRefundCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">CVV *</label>
                  <Input
                    value={refundCardDetails.cvv}
                    onChange={(e) => setRefundCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-medium mb-2">Cardholder Name *</label>
                <Input
                  value={refundCardDetails.cardholderName}
                  onChange={(e) => setRefundCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                  placeholder="Enter cardholder name"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowRefundDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleRefundSubmit} 
                className="flex-1"
                disabled={!refundCardDetails.cardNumber || !refundCardDetails.expiryDate || !refundCardDetails.cvv || !refundCardDetails.cardholderName}
              >
                Confirm & Process Refund
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Return Order Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>Return Order</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to return order #{selectedOrder?.reference}?</p>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Return Policy:</strong> Items can be returned within 7 days of delivery. 
                Return pickup will be scheduled within 2-3 business days.
              </p>
            </div>
            {selectedOrder?.paymentMethod !== 'cod' && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Privacy Policy:</strong> Your return request and refund details are processed securely. Refunds will be processed to your original payment method within 5-7 business days.
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Total refund amount: ₹{selectedOrder?.totalAmount.toLocaleString()}
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowReturnDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmReturnOrder} className="flex-1 bg-orange-600 hover:bg-orange-700">
                {selectedOrder?.paymentMethod === 'cod' ? 'Confirm Return' : 'Request Return'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Track Order - {selectedOrder?.reference}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Order Tracking Progress */}
            <div className="relative">
              <div className="flex justify-between items-center">
                {selectedOrder && getOrderTrackingSteps(selectedOrder).map((step, index) => {
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
                    selectedOrder?.status === 'Cancelled' || selectedOrder?.status === 'Returned' ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${selectedOrder ? (
                      selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Returned'
                        ? (getOrderTrackingSteps(selectedOrder).filter(s => s.status === 'cancelled').length - 1) * 33.33
                        : (getOrderTrackingSteps(selectedOrder).filter(s => s.status === 'completed').length - 1) * 33.33
                    ) : 0}%` 
                  }}
                />
              </div>
            </div>

            {/* Order Status */}
            <div className={`p-4 rounded-lg ${
              selectedOrder?.status === 'Cancelled' || selectedOrder?.status === 'Returned' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedOrder?.status === 'Cancelled' || selectedOrder?.status === 'Returned' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {selectedOrder?.status === 'Cancelled' ? (
                    <X className="w-6 h-6 text-white" />
                  ) : selectedOrder?.status === 'Returned' ? (
                    <RotateCcw className="w-6 h-6 text-white" />
                  ) : (
                    <Truck className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className={`font-semibold ${
                    selectedOrder?.status === 'Cancelled' || selectedOrder?.status === 'Returned' ? 'text-red-900' : 'text-blue-900'
                  }`}>
                    {selectedOrder?.status === 'Cancelled' ? 'Order Cancelled' :
                     selectedOrder?.status === 'Returned' ? 'Order Returned' :
                     getOrderStatus(selectedOrder) === 'Delivered' ? 'Order Delivered' :
                     getOrderStatus(selectedOrder) === 'Shipped' ? 'Order Shipped' :
                     getOrderStatus(selectedOrder) === 'Processing' ? 'Order Processing' : 'Order Placed'}
                  </div>
                  <div className={`text-sm ${
                    selectedOrder?.status === 'Cancelled' || selectedOrder?.status === 'Returned' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {selectedOrder?.status === 'Cancelled' ? `Order was cancelled on ${selectedOrder.cancelledDate}` :
                     selectedOrder?.status === 'Returned' ? `Order was returned on ${selectedOrder.returnDate}` :
                     getOrderStatus(selectedOrder) === 'Delivered' ? 'Your order has been delivered successfully' :
                     getOrderStatus(selectedOrder) === 'Shipped' ? 'Your order is on the way to your location' :
                     getOrderStatus(selectedOrder) === 'Processing' ? 'Your order is being prepared for shipment' : 'Your order has been confirmed'}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order Date:</span>
                <div className="font-medium">{selectedOrder?.orderDate}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Expected Delivery:</span>
                <div className="font-medium">{selectedOrder?.expectedDeliveryDate || 'TBD'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method:</span>
                <div className="font-medium capitalize">{selectedOrder?.paymentMethod?.replace('-', ' ')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Amount:</span>
                <div className="font-medium">₹{selectedOrder?.totalAmount?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;
