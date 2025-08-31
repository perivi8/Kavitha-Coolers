import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  category?: string;
  appliedCoupon?: string;
  discount?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: number; name: string; price: number; originalPrice?: number; image: string; category?: string }) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getOriginalTotal: () => number;
  getTotalDiscount: () => number;
  applyCoupons: () => void;
  loadUserCart: (userId: string) => void;
  clearUserCart: () => void;
}

interface Coupon {
  code: string;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { user, isLoggedIn } = useAuth();

  // Load user-specific cart data
  const loadUserCart = (userId: string) => {
    console.log('Loading cart for user:', userId);
    const userCart = localStorage.getItem(`cart-items-${userId}`);
    const userCoupon = localStorage.getItem(`cart-coupon-${userId}`);
    
    console.log('Found cart data:', userCart);
    console.log('Found coupon data:', userCoupon);
    
    if (userCart) {
      const parsedCart = JSON.parse(userCart);
      console.log('Setting cart to:', parsedCart);
      setCart(parsedCart);
    } else {
      console.log('No cart data found, setting empty cart');
      setCart([]);
    }
    
    if (userCoupon) {
      setAppliedCoupon(JSON.parse(userCoupon));
    } else {
      setAppliedCoupon(null);
    }
  };

  // Clear cart data
  const clearUserCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Save cart to user-specific localStorage
  useEffect(() => {
    if (user) {
      console.log('Saving cart for user:', user.id, 'Cart:', cart);
      if (cart.length > 0) {
        localStorage.setItem(`cart-items-${user.id}`, JSON.stringify(cart));
        console.log('Cart saved to localStorage');
      } else {
        // Don't remove empty cart from storage to preserve it across sessions
        console.log('Cart is empty, but keeping in storage for persistence');
      }
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      if (appliedCoupon) {
        localStorage.setItem(`cart-coupon-${user.id}`, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(`cart-coupon-${user.id}`);
      }
    }
  }, [appliedCoupon, user]);

  // Load cart when user logs in
  useEffect(() => {
    console.log('User effect triggered, user:', user);
    if (user) {
      console.log('User exists, loading cart for user ID:', user.id);
      loadUserCart(user.id);
    } else {
      console.log('No user, clearing cart');
      clearUserCart();
    }
  }, [user]);

  // Calculate discount based on claimed coupons
  const getProductDiscount = (product: { price: number; category?: string }) => {
    const claimedCoupons = JSON.parse(localStorage.getItem('claimedCoupons') || '[]');
    let additionalDiscount = 0;
    let appliedCoupon = '';
    
    if (claimedCoupons.includes('FESTIVAL40')) {
      additionalDiscount = Math.max(additionalDiscount, 40);
      appliedCoupon = 'FESTIVAL40';
    }
    if (claimedCoupons.includes('WELCOME25')) {
      additionalDiscount = Math.max(additionalDiscount, 25);
      appliedCoupon = 'WELCOME25';
    }
    if (claimedCoupons.includes('WEEKEND15') && product.category === 'Washing Machine') {
      additionalDiscount = Math.max(additionalDiscount, 15);
      appliedCoupon = 'WEEKEND15';
    }
    if (claimedCoupons.includes('BUNDLE15K')) {
      additionalDiscount = Math.max(additionalDiscount, 10);
      appliedCoupon = 'BUNDLE15K';
    }
    
    return { discount: additionalDiscount, coupon: appliedCoupon };
  };

  const getDiscountedPrice = (originalPrice: number, discount: number) => {
    return Math.round(originalPrice * (1 - discount / 100));
  };

  const addToCart = (product: { id: number; name: string; price: number; originalPrice?: number; image: string; category?: string }) => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      return;
    }
    
    const { discount, coupon } = getProductDiscount(product);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, {
        ...product,
        originalPrice: product.originalPrice || product.price,
        quantity: 1,
        discount,
        appliedCoupon: coupon
      }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    // Also clear from localStorage if user is logged in
    if (user?.id) {
      localStorage.removeItem(`cart-items-${user.id}`);
      localStorage.removeItem(`applied-coupons-${user.id}`);
      console.log('Cart cleared from localStorage for user:', user.id);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getOriginalTotal = () => {
    return cart.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
  };

  const getTotalDiscount = () => {
    return getOriginalTotal() - getTotalPrice();
  };

  const applyCoupons = () => {
    setCart(prev => prev.map(item => {
      const couponDiscount = getProductDiscount({ price: item.originalPrice, category: item.category });
      const finalPrice = couponDiscount.discount > 0 
        ? getDiscountedPrice(item.originalPrice, couponDiscount.discount)
        : item.originalPrice;
      
      return {
        ...item,
        price: finalPrice,
        appliedCoupon: couponDiscount.coupon,
        discount: couponDiscount.discount
      };
    }));
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getOriginalTotal,
      getTotalDiscount,
      applyCoupons,
      loadUserCart,
      clearUserCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
