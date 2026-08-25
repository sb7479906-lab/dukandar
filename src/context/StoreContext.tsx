import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { db, auth } from '../lib/firebase';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Customer,
  Coupon,
  StoreNotification,
  Language,
  Currency,
  StoreSettings,
  AdminTab,
  UserProfile,
  Review,
} from '../types';
import { getTranslation } from '../utils/translations';

// Authorized Permanent Admin Email List
const AUTHORIZED_ADMIN_EMAILS = [
  'rehanbutt506@gmail.com',
  'sb7479906@gmail.com'
];

const realCategories: Category[] = [
  { id: 'electronics', name: 'Electronics', nameUrdu: 'الیکٹرانکس', icon: 'Cpu', image: '', itemCount: 0 },
  { id: 'fashion', name: 'Fashion & Apparel', nameUrdu: 'فیشن و ملبوسات', icon: 'Shirt', image: '', itemCount: 0 },
  { id: 'footwear', name: 'Footwear', nameUrdu: 'جوتے', icon: 'Footprints', image: '', itemCount: 0 },
  { id: 'beauty', name: 'Beauty & Health', nameUrdu: 'بیوٹی و صحت', icon: 'Sparkles', image: '', itemCount: 0 },
  { id: 'home', name: 'Home & Kitchen', nameUrdu: 'گھریلو سامان', icon: 'Home', image: '', itemCount: 0 },
];

const productionSettings: StoreSettings = {
  storeName: 'Dukandar',
  storeNameUrdu: 'دکان دار',
  tagline: 'Online Shopping Marketplace',
  taglineUrdu: 'آن لائن شاپنگ کا مرکز',
  phone: '+92 300 8899776',
  whatsappNumber: '923008899776',
  email: 'support@dukandar.pk',
  address: 'Commercial Area, Phase 5 DHA',
  city: 'Lahore',
  standardDeliveryFee: 250,
  expressDeliveryFee: 500,
  freeDeliveryThreshold: 4000,
  announcementText: '🎉 Welcome to Dukandar! Enjoy Cash on Delivery across Pakistan.',
  announcementTextUrdu: '🎉 دکان دار پر خوش آمدید! پاکستان بھر میں کیش آن ڈلیوری دستیاب ہے۔',
  showAnnouncement: true,
  usdRate: 278,
};

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  activeView: 'shop' | 'admin';
  setActiveView: (view: 'shop' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  t: (key: any, params?: Record<string, string | number>) => string;

  categories: Category[];
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;

  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: { name: string; hex: string },
    selectedSize?: string
  ) => void;
  removeFromCart: (productId: string, selectedColorName?: string, selectedSize?: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    selectedColorName?: string,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createCoupon: (newCoupon: Omit<Coupon, 'id' | 'timesUsed'>) => Promise<void>;
  toggleCouponActive: (couponId: string) => Promise<void>;

  orders: Order[];
  currentTrackingOrder: Order | null;
  setCurrentTrackingOrder: (order: Order | null) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, customNote?: string) => Promise<void>;
  trackOrderByNumber: (orderNumber: string) => Order | null;

  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  addProductReview: (
    productId: string,
    review: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>
  ) => Promise<void>;

  customers: Customer[];
  currentUser: UserProfile | null;
  loginUser: (email: string, pass?: string, role?: 'customer' | 'admin') => Promise<void>;
  logoutUser: () => Promise<void>;

  notifications: StoreNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  addNotification: (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => Promise<void>;

  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('dukandar_lang') as Language) || 'en'
  );
  const [currency, setCurrencyState] = useState<Currency>(
    () => (localStorage.getItem('dukandar_cur') as Currency) || 'PKR'
  );
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const [categories] = useState<Category[]>(realCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(productionSettings);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dukandar_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('dukandar_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentTrackingOrder, setCurrentTrackingOrder] = useState<Order | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  const initSettings = async () => {
    try {
      const docSnap = await getDocs(collection(db, 'settings'));
      if (docSnap.empty) {
        await setDoc(doc(db, 'settings', 'store_config'), productionSettings);
      }
    } catch (err) {
      console.warn('Config init notice:', err);
    }
  };

  useEffect(() => {
    initSettings();

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
      setProducts(data);
    });

    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Coupon[];
      setCoupons(data);
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[];
      setOrders(data);
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Customer[];
      setCustomers(data);
    });

    const unsubNotifications = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as StoreNotification[];
      setNotifications(data);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'store_config'), (docSnap) => {
      if (docSnap.exists()) setSettings(docSnap.data() as StoreSettings);
    });

    // Realtime Strict Admin Auth Check
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const isAdmin = AUTHORIZED_ADMIN_EMAILS.includes(user.email.toLowerCase());
        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          phone: '',
          address: '',
          city: '',
          role: isAdmin ? 'admin' : 'customer',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubProducts();
      unsubCoupons();
      unsubOrders();
      unsubCustomers();
      unsubNotifications();
      unsubSettings();
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dukandar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dukandar_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dukandar_lang', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    localStorage.setItem('dukandar_cur', cur);
  };

  const t = (key: any, params?: Record<string, string | number>) => getTranslation(language, key, params);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minSpend) {
    cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
      cartDiscount = appliedCoupon.maxDiscount;
    }
  }

  const freeThreshold = settings?.freeDeliveryThreshold || 4000;
  const deliveryFee = settings?.standardDeliveryFee || 250;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const cartDeliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : deliveryFee;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: { name: string; hex: string },
    selectedSize?: string
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor?.name === selectedColor?.name &&
          item.selectedSize === selectedSize
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(product.stock, next[idx].quantity + quantity);
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.stock, quantity),
          selectedColor: selectedColor || (product.colors ? product.colors[0] : undefined),
          selectedSize: selectedSize || (product.sizes ? product.sizes[0] : undefined),
        },
      ];
    });

    addNotification({
      title: 'Item added to Cart 🛍️',
      titleUrdu: 'پروڈکٹ کارٹ میں شامل ہو گئی 🛍️',
      message: `${product.title} was added to cart.`,
      messageUrdu: `${product.titleUrdu || product.title} کارٹ میں شامل کر دی گئی۔`,
      type: 'promo',
    });
  };

  const removeFromCart = (productId: string, selectedColorName?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor?.name === selectedColorName &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    selectedColorName?: string,
    selectedSize?: string
  ) => {
    if (quantity <= 0) return removeFromCart(productId, selectedColorName, selectedSize);
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.selectedColor?.name === selectedColorName &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCouponCode = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) return { success: false, message: t('invalidCoupon') };
    if (cartSubtotal < found.minSpend) return { success: false, message: `Minimum spend of ₨ ${found.minSpend} required.` };
    setAppliedCoupon(found);
    return { success: true, message: t('couponApplied') };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const createCoupon = async (newCouponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const id = `coup-${Date.now()}`;
    const newCoupon: Coupon = { ...newCouponData, id, timesUsed: 0, code: newCouponData.code.toUpperCase() };
    await setDoc(doc(db, 'coupons', id), newCoupon);
  };

  const toggleCouponActive = async (couponId: string) => {
    const target = coupons.find((c) => c.id === couponId);
    if (target) await updateDoc(doc(db, 'coupons', couponId), { isActive: !target.isActive });
  };

  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>
  ): Promise<Order> => {
    const id = `ord-${Date.now()}`;
    const orderNumber = `DKN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now.toISOString(),
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Placed',
          titleUrdu: 'آرڈر موصول ہوا',
          description: 'Your order has been registered in system.',
          descriptionUrdu: 'آپ کا آرڈر سسٹم میں درج ہو چکا ہے۔',
          timestamp: now.toLocaleString(),
          completed: true,
          current: true,
        },
      ],
    };

    await setDoc(doc(db, 'orders', id), newOrder);
    setLastPlacedOrder(newOrder);

    for (const item of orderData.items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        try {
          await updateDoc(doc(db, 'products', prod.id), {
            stock: Math.max(0, prod.stock - item.quantity),
          });
        } catch (err) {
          console.warn(`Failed stock reduction for product ${prod.id}:`, err);
        }
      }
    }

    const existingCust = customers.find((c) => c.email.toLowerCase() === orderData.customer.email.toLowerCase());
    if (existingCust) {
      await updateDoc(doc(db, 'customers', existingCust.id), {
        totalOrders: (existingCust.totalOrders || 0) + 1,
        totalSpent: (existingCust.totalSpent || 0) + orderData.total,
      });
    } else {
      const custId = `cust-${Date.now()}`;
      const newCust: Customer = {
        id: custId,
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        city: orderData.customer.city,
        totalOrders: 1,
        totalSpent: orderData.total,
        joinedDate: now.toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        status: 'active',
      };
      await setDoc(doc(db, 'customers', custId), newCust);
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, customNote?: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const newHistory = (target.trackingHistory || []).map((s) => ({ ...s, current: false }));
    newHistory.push({
      status,
      title: status.toUpperCase(),
      titleUrdu: 'سٹیٹس اپ ڈیٹ',
      description: customNote || `Status changed to ${status}`,
      descriptionUrdu: 'سٹیٹس تبدیل کر دیا گیا۔',
      timestamp: new Date().toLocaleString(),
      completed: true,
      current: true,
    });

    await updateDoc(doc(db, 'orders', orderId), {
      status,
      paymentStatus: status === 'delivered' ? 'paid' : target.paymentStatus,
      trackingHistory: newHistory,
    });
  };

  const trackOrderByNumber = (orderNumber: string) =>
    orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase()) || null;

  const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id, rating: 5.0, reviewCount: 0, reviews: [] };
    await setDoc(doc(db, 'products', id), newProduct);
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', productId), updates);
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
  };

  const addProductReview = async (
    productId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };
    const updatedReviews = [newReview, ...(prod.reviews || [])];
    const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

    await updateDoc(doc(db, 'products', productId), {
      reviews: updatedReviews,
      reviewCount: updatedReviews.length,
      rating: Number(avgRating.toFixed(1)),
    });
  };

  // Secure Strict Login Handler
  const loginUser = async (email: string, pass = '123456', role: 'customer' | 'admin' = 'customer') => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch {
      await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    }

    if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) || role === 'admin') {
      if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) {
        setActiveView('admin');
      }
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setActiveView('shop');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  
  const markNotificationAsRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const markAllNotificationsAsRead = async () => {
    for (const n of notifications) {
      if (!n.read) await updateDoc(doc(db, 'notifications', n.id), { read: true });
    }
  };

  const addNotification = async (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => {
    const id = `notif-${Date.now()}`;
    const newNotif: StoreNotification = {
      ...notif,
      id,
      timestamp: 'Just now',
      read: false,
    };
    await setDoc(doc(db, 'notifications', id), newNotif);
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    await updateDoc(doc(db, 'settings', 'store_config'), newSettings);
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        t,
        categories,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        createCoupon,
        toggleCouponActive,
        orders,
        currentTrackingOrder,
        setCurrentTrackingOrder,
        placeOrder,
        updateOrderStatus,
        trackOrderByNumber,
        addProduct,
        updateProduct,
        deleteProduct,
        addProductReview,
        customers,
        currentUser,
        loginUser,
        logoutUser,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        settings,
        updateSettings,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAuthOpen,
        setIsAuthOpen,
        isProfileOpen,
        setIsProfileOpen,
        isSupportOpen,
        setIsSupportOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        activeProductModal,
        setActiveProductModal,
        lastPlacedOrder,
        setLastPlacedOrder,
        loading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
