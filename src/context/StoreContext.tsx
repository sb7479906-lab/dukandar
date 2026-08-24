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
import {
  initialCategories,
  initialProducts,
  initialOrders,
  initialCustomers,
  initialCoupons,
  initialNotifications,
  defaultSettings,
} from '../data/mockData';
import { getTranslation } from '../utils/translations';

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
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => void;

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

  // Localization
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('dukandar_lang') as Language) || 'en'
  );
  const [currency, setCurrencyState] = useState<Currency>(
    () => (localStorage.getItem('dukandar_cur') as Currency) || 'PKR'
  );
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Firestore Realtime Collections State
  const [categories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  // Filters & Controls
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  // Cart & Wishlist Local Storage State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dukandar_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('dukandar_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // User Auth & UI State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<StoreNotification[]>(initialNotifications);
  const [currentTrackingOrder, setCurrentTrackingOrder] = useState<Order | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // --- Seed Database Function ---
  const seedFirestore = async () => {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty) {
        for (const p of initialProducts) await setDoc(doc(db, 'products', p.id), p);
        for (const c of initialCoupons) await setDoc(doc(db, 'coupons', c.id), c);
        for (const o of initialOrders) await setDoc(doc(db, 'orders', o.id), o);
        for (const cust of initialCustomers) await setDoc(doc(db, 'customers', cust.id), cust);
        await setDoc(doc(db, 'settings', 'store_config'), defaultSettings);
      }
    } catch (err) {
      console.warn("Firestore Seed notice / fallback mode active:", err);
    }
  };

  // --- Realtime Firestore Subscriptions ---
  useEffect(() => {
    seedFirestore();

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
        setProducts(data.length > 0 ? data : initialProducts);
      },
      (error) => console.warn("Firestore Products snapshot listener error:", error)
    );

    const unsubCoupons = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Coupon[];
        setCoupons(data.length > 0 ? data : initialCoupons);
      },
      (error) => console.warn("Firestore Coupons snapshot listener error:", error)
    );

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[];
        setOrders(data.length > 0 ? data : initialOrders);
      },
      (error) => console.warn("Firestore Orders snapshot listener error:", error)
    );

    const unsubCustomers = onSnapshot(
      collection(db, 'customers'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Customer[];
        setCustomers(data.length > 0 ? data : initialCustomers);
      },
      (error) => console.warn("Firestore Customers snapshot listener error:", error)
    );

    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'store_config'),
      (docSnap) => {
        if (docSnap.exists()) setSettings(docSnap.data() as StoreSettings);
      },
      (error) => console.warn("Firestore Settings snapshot listener error:", error)
    );

    // Firebase Auth Observer
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: '+92 300 1234567',
          address: 'Main Street, Phase 5 DHA',
          city: 'Lahore',
          role: user.email?.includes('admin') ? 'admin' : 'customer',
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
      unsubSettings();
      unsubAuth();
    };
  }, []);

  // Sync Cart & Wishlist to Local Storage
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

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minSpend) {
    cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
      cartDiscount = appliedCoupon.maxDiscount;
    }
  }

  const freeThreshold = settings?.freeDeliveryThreshold || 3000;
  const deliveryFee = settings?.standardDeliveryFee || 200;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const cartDeliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : deliveryFee;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  // Cart Handlers
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

  // Coupon Actions
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

  // Orders Actions
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

    // Update Product Stock Levels safely in Firestore
    for (const item of orderData.items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        try {
          await updateDoc(doc(db, 'products', prod.id), {
            stock: Math.max(0, prod.stock - item.quantity),
          });
        } catch (err) {
          console.warn(`Failed to update stock for product ${prod.id}:`, err);
        }
      }
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

  // Products Operations
  const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id, rating: 5.0, reviewCount: 1, reviews: [] };
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

  // Auth Operations
  const loginUser = async (email: string, pass = '123456', role: 'customer' | 'admin' = 'customer') => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      if (role === 'admin') setActiveView('admin');
    } catch {
      await createUserWithEmailAndPassword(auth, email, pass);
      if (role === 'admin') setActiveView('admin');
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setActiveView('shop');
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const markNotificationAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotificationsAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const addNotification = (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => [
      { ...notif, id: `notif-${Date.now()}`, timestamp: 'Just now', read: false },
      ...prev,
    ]);
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
