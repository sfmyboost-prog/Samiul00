
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Category, Order, Customer, Currency, SiteMedia, MediaItem, LibraryItem, AdminProfile, LoginSettings, SocialSettings } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, ORDERS as INITIAL_ORDERS, CUSTOMERS as INITIAL_CUSTOMERS } from '../data/mockData';

const DEFAULT_MEDIA: SiteMedia = {
  heroSlides: [
    {
      id: 'h1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1470',
      title: 'Next-Gen Aerial Systems',
      subtitle: 'Experience the world from a new perspective with our professional 8K drone series.',
      cta: 'Explore Drones'
    },
    {
      id: 'h2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=1470',
      title: 'FPV Racing Revolution',
      subtitle: 'High-speed, low-latency digital FPV systems for the ultimate competitive edge.',
      cta: 'Shop Racing'
    },
    {
      id: 'h3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?q=80&w=1399',
      title: 'Mini Drones, Maxi Power',
      subtitle: 'Compact, portable, and powerful. No registration required for our sub-249g models.',
      cta: 'Order Now'
    }
  ],
  promoBanner: {
    id: 'p1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1527142879024-c6c91aa6423c?q=80&w=1470',
    title: 'Precision Agriculture',
    subtitle: 'Optimize your yield with our automated crop spraying and mapping solutions.'
  }
};

const DEFAULT_LIBRARY: LibraryItem[] = [
  { id: 'lib-1', name: 'Cinema Drone', url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=1470', type: 'image', createdAt: '2023-11-20' },
  { id: 'lib-2', name: 'Racing Unit', url: 'https://images.unsplash.com/photo-1533560235473-19e31f711f14?q=80&w=1470', type: 'image', createdAt: '2023-11-21' },
  { id: 'lib-3', name: 'Mini Drone White', url: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?q=80&w=1399', type: 'image', createdAt: '2023-11-22' },
];

const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  firstName: 'Admin',
  lastName: 'DroneStore',
  address: 'Drone Innovation Hub, Silicon Valley',
  contact: '+1 800 DRONE PRO',
  email: 'admin@dronestore.com',
  role: 'Systems Administrator'
};

const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  google_enabled: true,
  google_client_id: '852233669-google-id-example.apps.googleusercontent.com',
  google_client_secret: 'GOCSPX-secret-example-key-12345',
  facebook_enabled: true,
  facebook_app_id: '154856210235485',
  facebook_app_secret: 'fb-secret-example-key-98765'
};

interface StoreContextType {
  // Public State
  cart: CartItem[];
  wishlist: Product[];
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (val: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  placeOrder: (customerName: string, customerEmail: string, customerPhone: string, address: string, coinsToUse?: number) => void;
  
  // Coin Logic
  userCoins: number;
  setUserCoins: (coins: number) => void;
  addCoins: (amount: number) => void;

  // Site Media
  siteMedia: SiteMedia;
  setSiteMedia: React.Dispatch<React.SetStateAction<SiteMedia>>;
  mediaLibrary: LibraryItem[];
  setMediaLibrary: React.Dispatch<React.SetStateAction<LibraryItem[]>>;

  // Settings
  adminProfile: AdminProfile;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  socialSettings: SocialSettings;
  setSocialSettings: React.Dispatch<React.SetStateAction<SocialSettings>>;

  // Currency logic
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number; // 1 USD = X BDT
  formatPrice: (priceInBDT: number) => string;

  // Admin / Database State
  isAdmin: boolean;
  setAdmin: (val: boolean) => void;
  
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('currency') as Currency) || 'BDT';
  });
  const exchangeRate = 120; // Static exchange rate for simplicity: 1 USD = 120 BDT

  // Database Simulation
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('db_categories');
    if (saved) return JSON.parse(saved);
    return INITIAL_CATEGORIES.map(c => ({ 
      id: c.id,
      name: c.name,
      slug: c.name.toLowerCase().replace(/\s+/g, '-'),
      icon: c.icon,
      thumbnail: c.thumbnail || '',
      is_popular: !!c.is_popular,
      status: c.status || 'active',
      subcategories: c.subcategories || []
    }));
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('db_products');
    const baseProducts = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return baseProducts.map((p: any) => ({
      ...p,
      category_id: p.category_id || categories.find(c => c.name === p.category)?.id || 'unknown',
      coinReward: p.coinReward ?? Math.floor(p.price * 0.1),
      maxCoinDeduction: p.maxCoinDeduction ?? Math.floor(p.price * 5)
    }));
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('db_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('db_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS.map(c => ({ ...c, status: 'active', coins: c.coins ?? 500 }));
  });

  const [userCoins, setUserCoins] = useState<number>(() => {
    const saved = localStorage.getItem('user_coins');
    return saved ? parseInt(saved) : 2100;
  });

  const [siteMedia, setSiteMedia] = useState<SiteMedia>(() => {
    const saved = localStorage.getItem('db_site_media');
    return saved ? JSON.parse(saved) : DEFAULT_MEDIA;
  });

  const [mediaLibrary, setMediaLibrary] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem('db_media_library');
    return saved ? JSON.parse(saved) : DEFAULT_LIBRARY;
  });

  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem('db_admin_profile');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_PROFILE;
  });

  const [socialSettings, setSocialSettings] = useState<SocialSettings>(() => {
    const saved = localStorage.getItem('db_social_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_SETTINGS;
  });

  // User Session State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setAdmin] = useState(() => {
    return localStorage.getItem('admin_session') === 'active';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user_session') === 'active';
  });

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // Persist "Database"
  useEffect(() => localStorage.setItem('db_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('db_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('db_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('db_customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('db_site_media', JSON.stringify(siteMedia)), [siteMedia]);
  useEffect(() => localStorage.setItem('db_media_library', JSON.stringify(mediaLibrary)), [mediaLibrary]);
  useEffect(() => localStorage.setItem('db_admin_profile', JSON.stringify(adminProfile)), [adminProfile]);
  useEffect(() => localStorage.setItem('db_social_settings', JSON.stringify(socialSettings)), [socialSettings]);
  
  // Persist User Session
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('user_session', isLoggedIn ? 'active' : 'inactive'), [isLoggedIn]);
  useEffect(() => localStorage.setItem('currency', currency), [currency]);
  useEffect(() => localStorage.setItem('user_coins', userCoins.toString()), [userCoins]);

  const setCurrency = (c: Currency) => setCurrencyState(c);

  const formatPrice = (priceInBDT: number) => {
    if (currency === 'BDT') {
      return `৳${priceInBDT.toLocaleString('en-BD')}`;
    } else {
      const priceInUSD = priceInBDT / exchangeRate;
      return `$${priceInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const addCoins = (amount: number) => {
    setUserCoins(prev => prev + amount);
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const toggleWishlist = (product: Product) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setWishlist(prev => {
      const isFav = prev.find(p => p.id === product.id);
      if (isFav) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  const clearCart = () => setCart([]);

  const placeOrder = (customerName: string, customerEmail: string, customerPhone: string, address: string, coinsToUse: number = 0) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const coinDiscount = coinsToUse / 100;
    const finalTotal = Math.max(0, subtotal + shipping - coinDiscount);

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customerName,
      customerEmail,
      customerPhone,
      address,
      total: finalTotal,
      status: 'Paid',
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      coinsUsed: coinsToUse,
      coinDiscount: coinDiscount
    };

    if (coinsToUse > 0) {
      setUserCoins(prev => prev - coinsToUse);
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      cart,
      wishlist,
      isLoggedIn,
      setIsLoggedIn,
      isLoginModalOpen,
      setLoginModalOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      isInWishlist,
      clearCart,
      placeOrder,
      userCoins,
      setUserCoins,
      addCoins,
      siteMedia,
      setSiteMedia,
      mediaLibrary,
      setMediaLibrary,
      adminProfile,
      setAdminProfile,
      socialSettings,
      setSocialSettings,
      currency,
      setCurrency,
      exchangeRate,
      formatPrice,
      isAdmin,
      setAdmin,
      categories,
      setCategories,
      products,
      setProducts,
      orders,
      setOrders,
      customers,
      setCustomers
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
