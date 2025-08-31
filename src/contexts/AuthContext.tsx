import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  flatNumber: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  addresses?: any[];
}

interface Order {
  // Add properties for Order interface
}

interface BookedService {
  // Add properties for BookedService interface
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => { success: boolean; message: string };
  orders: Order[];
  bookedServices: BookedService[];
  addOrder: (order: Order) => void;
  addBookedService: (service: BookedService) => void;
  updateUserAddresses: (addresses: any[]) => void;
  checkUserExists: (email: string, mobile: string) => { emailExists: boolean; mobileExists: boolean };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user-auth');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [orders, setOrders] = useState<any[]>(() => {
    const savedOrders = localStorage.getItem('user-orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [bookedServices, setBookedServices] = useState<any[]>(() => {
    const savedServices = localStorage.getItem('user-booked-services');
    return savedServices ? JSON.parse(savedServices) : [];
  });

  useEffect(() => {
    if (user?.id) {
      console.log('Loading user data for:', user.id);
      
      // Load user-specific cart data
      const savedCart = localStorage.getItem(`cart-items-${user.id}`);
      if (savedCart) {
        console.log('Found saved cart for user:', user.id);
      }
      
      // DON'T load orders here - let MyOrders component handle its own order loading
      // This prevents overwriting cancelled/returned statuses
      console.log('Skipping order loading in AuthContext to prevent status override');
      
      // Load user-specific services
      const savedServices = localStorage.getItem(`user-services-${user.id}`);
      if (savedServices) {
        setBookedServices(JSON.parse(savedServices));
        console.log('Loaded services for user:', user.id);
      } else {
        setBookedServices([]);
      }
      
      // Load user-specific addresses
      const savedAddresses = localStorage.getItem(`user-addresses-${user.id}`);
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        const updatedUser = { ...user, addresses };
        setUser(updatedUser);
        console.log('Loaded addresses for user:', user.id);
      }
    } else {
      setOrders([]);
      setBookedServices([]);
    }
  }, [user?.id]);

  // Get all registered users from localStorage
  const getAllUsers = (): User[] => {
    const allUsers = localStorage.getItem('all-registered-users');
    return allUsers ? JSON.parse(allUsers) : [];
  };

  // Save user to the registered users list
  const saveUserToRegistry = (userData: User) => {
    const allUsers = getAllUsers();
    const updatedUsers = [...allUsers, userData];
    localStorage.setItem('all-registered-users', JSON.stringify(updatedUsers));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user-auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('user-auth');
    }
  }, [user]);

  // Removed automatic order saving to prevent overwriting status updates
  // Orders are now managed directly in MyOrders component

  useEffect(() => {
    if (user && bookedServices.length > 0) {
      localStorage.setItem(`user-booked-services-${user.id}`, JSON.stringify(bookedServices));
    }
  }, [bookedServices, user]);

  const login = (email: string, password: string) => {
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, message: "User does not exist. Please register first." };
    }
    
    // For now, we'll accept any password since we don't store passwords securely
    // In a real app, you'd verify the hashed password
    setUser(user);
    
    // Load user-specific data
    const userServices = localStorage.getItem(`user-booked-services-${user.id}`);
    
    // Don't load orders on login - let MyOrders component handle this
    console.log('Skipping order loading on login to prevent status override');
    if (userServices) {
      setBookedServices(JSON.parse(userServices));
    }
    
    return { success: true, message: "Login successful" };
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    setBookedServices([]);
    localStorage.removeItem('user-auth');
    
    // Note: We don't remove user-specific cart and address data on logout
    // This allows users to retain their cart and addresses when they log back in
  };

  const checkUserExists = (email: string, mobile: string) => {
    const allUsers = getAllUsers();
    const emailExists = allUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    const mobileExists = allUsers.some(user => user.mobile === mobile);
    return { emailExists, mobileExists };
  };

  const register = (userData: Omit<User, 'id'>) => {
    const { emailExists, mobileExists } = checkUserExists(userData.email, userData.mobile);
    
    if (emailExists && mobileExists) {
      return { success: false, message: "Email and mobile number are already registered" };
    } else if (emailExists) {
      return { success: false, message: "Email is already registered" };
    } else if (mobileExists) {
      return { success: false, message: "Mobile number is already registered" };
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    setUser(newUser);
    saveUserToRegistry(newUser);
    return { success: true, message: "Registration successful" };
  };

  const addOrder = (order: any) => {
    // Only add new orders, don't manage existing order updates here
    if (user) {
      const existingOrders = localStorage.getItem(`user-orders-${user.id}`);
      const currentOrders = existingOrders ? JSON.parse(existingOrders) : [];
      const updatedOrders = [...currentOrders, order];
      localStorage.setItem(`user-orders-${user.id}`, JSON.stringify(updatedOrders));
      console.log('Added new order:', order.reference);
    }
  };

  const addBookedService = (service: any) => {
    const updatedServices = [...bookedServices, service];
    setBookedServices(updatedServices);
    localStorage.setItem('user-booked-services', JSON.stringify(updatedServices));
    
    // Also save services with user-specific key
    if (user) {
      localStorage.setItem(`user-services-${user.id}`, JSON.stringify(updatedServices));
    }
  };

  const updateUserAddresses = (addresses: any[]) => {
    if (user) {
      const updatedUser = { ...user, addresses };
      setUser(updatedUser);
      localStorage.setItem('user-auth', JSON.stringify(updatedUser));
      
      // Also save addresses with user-specific key for better persistence
      localStorage.setItem(`user-addresses-${user.id}`, JSON.stringify(addresses));
      console.log('Addresses saved for user:', user.id, addresses);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      register,
      orders,
      bookedServices,
      addOrder,
      addBookedService,
      updateUserAddresses,
      checkUserExists
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
