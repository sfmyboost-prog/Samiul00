export type Currency = 'BDT' | 'USD';

export interface Product {
  id: string;
  name: string;
  category: string;
  category_id: string;
  subcategory?: string;
  price: number; // Base price in BDT
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  discount?: number;
  status: 'active' | 'inactive';
  coinReward?: number; // How many coins earned by buying
  maxCoinDeduction?: number; // Max coins that can be used for this product
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  thumbnail: string;
  is_popular: boolean;
  status: 'active' | 'inactive';
  subcategories?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Paid';
  date: string;
  items: CartItem[];
  coinsUsed?: number;
  coinDiscount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  ordersCount: number;
  dateJoined: string;
  avatar: string;
  status: 'active' | 'blocked';
  coins: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DashboardStats {
  totalEarnings: number;
  totalOrders: number;
  totalCustomers: number;
  balance: number;
  earningTrend: number[];
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  link?: string;
}

export interface SiteMedia {
  heroSlides: MediaItem[];
  promoBanner: MediaItem;
}

export interface LibraryItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  createdAt: string;
}

export interface AdminProfile {
  firstName: string;
  lastName: string;
  address: string;
  contact: string;
  email: string;
  role: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
}

export interface LoginSettings {
  googleEnabled: boolean;
  googleClientId: string;
  googleClientSecret: string;
  facebookEnabled: boolean;
  facebookAppId: string;
  facebookAppSecret: string;
}

export interface SocialSettings {
  google_enabled: boolean;
  google_client_id: string;
  google_client_secret: string;
  facebook_enabled: boolean;
  facebook_app_id: string;
  facebook_app_secret: string;
}