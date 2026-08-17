export type Language = 'en' | 'ur';
export type Currency = 'PKR' | 'USD';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'card' | 'easypaisa' | 'jazzcash' | 'bank';
export type PaymentStatus = 'paid' | 'unpaid' | 'pending';

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  price: number; // In PKR base
  originalPrice: number;
  discountPercent: number;
  category: string;
  categoryUrdu: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  tags: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specs?: { label: string; labelUrdu: string; value: string }[];
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharges: number;
  deliveryMethod: 'standard' | 'express';
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingHistory: OrderTrackingStep[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  avatar: string;
  status: 'active' | 'inactive';
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minSpend: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  timesUsed: number;
  description: string;
  descriptionUrdu: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  titleUrdu: string;
  message: string;
  messageUrdu: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'system' | 'stock';
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

export interface StoreSettings {
  storeName: string;
  storeNameUrdu: string;
  tagline: string;
  taglineUrdu: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryThreshold: number;
  announcementText: string;
  announcementTextUrdu: string;
  showAnnouncement: boolean;
  usdRate: number; // 1 USD = X PKR
}

export type AdminTab = 'dashboard' | 'analytics' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings';
