
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Category, Order, Customer, Currency, SiteMedia, MediaItem, LibraryItem, AdminProfile, SocialSettings } from '../types';
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

const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  firstName: 'Admin',
  lastName: 'DroneStore',
  address: 'Drone Hub, Dhaka',
  contact: '+880 1700 000 000',
  email: 'admin@superstore.com',
  role: 'Store Manager'
};

const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  google_enabled: true,
  google_client_id: '',
  google_client_secret: '',
  facebook_enabled: true,
  facebook_app_id: '',
  facebook_app_secret: ''
};

interface StoreContextType {
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
  userCoins: number;
  setUserCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  siteMedia: SiteMedia;
  setSiteMedia: React.Dispatch<React.SetStateAction<SiteMedia>>;
  mediaLibrary: LibraryItem[];
  setMediaLibrary: React.Dispatch<React.SetStateAction<LibraryItem[]>>;
  adminProfile: AdminProfile;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  socialSettings: SocialSettings;
  setSocialSettings: React.Dispatch<React.SetStateAction<SocialSettings>>;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  formatPrice: (priceInBDT: number) => string;
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
  const [currency, setCurrencyState] = useState<Currency>(() => (localStorage.getItem('currency') as Currency) || 'BDT');
  const exchangeRate = 120;

  const safeParse = (key: string, fallback: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [categories, setCategories] = useState<Category[]>(() => safeParse('db_categories', INITIAL_CATEGORIES));
  const [products, setProducts] = useState<Product[]>(() => safeParse('db_products', INITIAL_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => safeParse('db_orders', INITIAL_ORDERS));
  const [customers, setCustomers] = useState<Customer[]>(() => safeParse('db_customers', INITIAL_CUSTOMERS));
  const [userCoins, setUserCoins] = useState<number>(() => parseInt(localStorage.getItem('user_coins') || '2100'));
  const [siteMedia, setSiteMedia] = useState<SiteMedia>(() => safeParse('db_site_media', DEFAULT_MEDIA));
  const [mediaLibrary, setMediaLibrary] = useState<LibraryItem[]>(() => safeParse('db_media_library', []));
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => safeParse('db_admin_profile', DEFAULT_ADMIN_PROFILE));
  const [socialSettings, setSocialSettings] = useState<SocialSettings>(() => safeParse('db_social_settings', DEFAULT_SOCIAL_SETTINGS));
  const [cart, setCart] = useState<CartItem[]>(() => safeParse('cart', []));
  const [wishlist, setWishlist] = useState<Product[]>(() => safeParse('wishlist', []));
  const [isAdmin, setAdmin] = useState(() => localStorage.getItem('admin_session') === 'active');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('user_session') === 'active');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => localStorage.setItem('db_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('db_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('db_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('db_customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('db_site_media', JSON.stringify(siteMedia)), [siteMedia]);
  useEffect(() => localStorage.setItem('db_media_library', JSON.stringify(mediaLibrary)), [mediaLibrary]);
  useEffect(() => localStorage.setItem('db_admin_profile', JSON.stringify(adminProfile)), [adminProfile]);
  useEffect(() => localStorage.setItem('db_social_settings', JSON.stringify(socialSettings)), [socialSettings]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('user_session', isLoggedIn ? 'active' : 'inactive'), [isLoggedIn]);
  useEffect(() => localStorage.setItem('user_coins', userCoins.toString()), [userCoins]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  const formatPrice = (priceInBDT: number) => {
    if (currency === 'BDT') return `৳${priceInBDT.toLocaleString('en-BD')}`;
    return `$${(priceInBDT / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const addCoins = (amount: number) => setUserCoins(prev => prev + amount);

  const addToCart = (product: Product, quantity = 1) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const toggleWishlist = (product: Product) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setWishlist(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  const clearCart = () => setCart([]);

  const placeOrder = (customerName: string, customerEmail: string, customerPhone: string, address: string, coinsToUse: number = 0) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const coinDiscount = coinsToUse / 100;
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customerName, customerEmail, customerPhone, address,
      total: Math.max(0, subtotal - coinDiscount),
      status: 'Paid',
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      coinsUsed: coinsToUse,
      coinDiscount
    };
    if (coinsToUse > 0) setUserCoins(prev => prev - coinsToUse);
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      cart, wishlist, isLoggedIn, setIsLoggedIn, isLoginModalOpen, setLoginModalOpen,
      addToCart, removeFromCart, updateCartQuantity, toggleWishlist, isInWishlist, clearCart, placeOrder,
      userCoins, setUserCoins, addCoins, siteMedia, setSiteMedia, mediaLibrary, setMediaLibrary,
      adminProfile, setAdminProfile, socialSettings, setSocialSettings, currency, setCurrency,
      exchangeRate, formatPrice, isAdmin, setAdmin, categories, setCategories,
      products, setProducts, orders, setOrders, customers, setCustomers
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