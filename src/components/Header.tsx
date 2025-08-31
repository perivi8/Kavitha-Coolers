import { useState } from "react";
import { Search, ShoppingCart, Menu, User, Plus, Minus, Trash2, LogOut, Package, Calendar, Phone, X, Wrench } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [loginError, setLoginError] = useState("");
  const { cart, removeFromCart, updateCartQuantity, getTotalItems, getTotalPrice } = useCart();
  const { user, isLoggedIn, login, logout, register } = useAuth();
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    flatNumber: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    password: ""
  });

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Services", href: "/services" },
    { label: "Brands", href: "/brands" },
    { label: "Offers", href: "/offers" },
    { label: "About", href: "/about" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const result = login(loginData.email, loginData.password);
    
    if (result.success) {
      setIsLoginOpen(false);
      setLoginData({ email: "", password: "" });
    } else {
      setLoginError(result.message);
    }
  };

  const handleRegister = () => {
    setRegistrationError("");
    const { password, ...userDataWithoutPassword } = registerData;
    const result = register(userDataWithoutPassword);
    
    if (result.success) {
      setIsLoginOpen(false);
      setIsRegister(false);
      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        flatNumber: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        password: ""
      });
    } else {
      setRegistrationError(result.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">KC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">Kavita Cooler</h1>
                <p className="text-xs text-muted-foreground">Appliances & Services</p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-medium hover:text-primary transition-colors duration-200 ${
                  location.pathname === item.href 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-secondary'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search appliances..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[500px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Shopping Cart</h2>
                    <span className="text-sm text-muted-foreground">{getTotalItems()} items</span>
                  </div>
                  
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                      <p className="text-muted-foreground mb-4">Add some products to get started</p>
                      <Button onClick={() => setIsCartOpen(false)} className="btn-hero">
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm leading-tight mb-1">{item.name}</h4>
                              <p className="text-sm font-semibold text-primary">₹{item.price.toLocaleString()}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-lg font-bold text-primary">₹{getTotalPrice().toLocaleString()}</span>
                        </div>
                        <Button 
                          className="btn-hero w-full mb-2"
                          onClick={() => {
                            if (!isLoggedIn) {
                              setIsCartOpen(false);
                              setIsLoginOpen(true);
                              return;
                            }
                            setIsCartOpen(false);
                            navigate('/checkout');
                          }}
                        >
                          Proceed to Checkout
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Call Icon */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Phone className="w-4 h-4" />
            </Button>

            {/* Profile */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative w-8 h-8 rounded-full p-0">
                    <span className="text-sm font-semibold">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-services')}>
                    <Wrench className="w-4 h-4 mr-2" />
                    My Services
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLoginOpen(true)}
              >
                <User className="w-4 h-4" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Search appliances..."
                      className="pl-10 w-full"
                    />
                  </div>
                  
                  <nav className="space-y-4">
                    {navigationItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className={`block font-medium hover:text-primary transition-colors duration-200 ${
                          location.pathname === item.href 
                            ? 'text-primary bg-primary/10 px-3 py-2 rounded-lg' 
                            : 'text-secondary'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

    {/* Login/Register Modal */}
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isRegister ? "Create Account" : "Login"}
          </DialogTitle>
        </DialogHeader>
        
        {registrationError && isRegister && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-destructive font-medium">{registrationError}</p>
          </div>
        )}
        
        {loginError && !isRegister && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-destructive font-medium">{loginError}</p>
          </div>
        )}
        
        {!isRegister ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Email</label>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Password</label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-hero">
              Login
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => setIsRegister(true)}
            >
              Create New Account
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">First Name</label>
                <Input
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Last Name</label>
                <Input
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-2">Email</label>
              <Input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Mobile</label>
              <Input
                type="tel"
                value={registerData.mobile}
                onChange={(e) => setRegisterData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Mobile number"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Password</label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create password"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-hero">
              Register
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => setIsRegister(false)}
            >
              Back to Login
            </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;