import React, { createContext, useContext, useState, useEffect } from 'react';
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
  // Localization & View
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  activeView: 'shop' | 'admin';
  setActiveView: (view: 'shop' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  t: (key: any, params?: Record<string, string | number>) => string;

  // Catalog
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

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: { name: string; hex: string }, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColorName?: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedColorName?: string, selectedSize?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createCoupon: (newCoupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  toggleCouponActive: (couponId: string) => void;

  // Orders
  orders: Order[];
  currentTrackingOrder: Order | null;
  setCurrentTrackingOrder: (order: Order | null) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, customNote?: string) => void;
  trackOrderByNumber: (orderNumber: string) => Order | null;

  // Admin Product Operations
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Reviews
  addProductReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => void;

  // Customers & Auth
  customers: Customer[];
  currentUser: UserProfile | null;
  loginUser: (email: string, role?: 'customer' | 'admin') => void;
  logoutUser: () => void;

  // Notifications
  notifications: StoreNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Modals & UI States
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization & Theme
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dukandar_lang');
    return (saved as Language) || 'en';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('dukandar_cur');
    return (saved as Currency) || 'PKR';
  });

  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Categories & Products
  const [categories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dukandar_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dukandar_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('dukandar_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('dukandar_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dukandar_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [currentTrackingOrder, setCurrentTrackingOrder] = useState<Order | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('dukandar_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  // User Profile / Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dukandar_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'usr-1',
          name: 'Muhammad Daniyal',
          email: 'daniyal.pk@gmail.com',
          phone: '+92 300 1234567',
          address: 'House 42-B, Street 7, Phase 5 DHA',
          city: 'Lahore',
          role: 'customer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
  });

  // Notifications
  const [notifications, setNotifications] = useState<StoreNotification[]>(() => {
    const saved = localStorage.getItem('dukandar_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('dukandar_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Persist state in localStorage
  useEffect(() => {
    localStorage.setItem('dukandar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dukandar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dukandar_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('dukandar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dukandar_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('dukandar_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('dukandar_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dukandar_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dukandar_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dukandar_user');
    }
  }, [currentUser]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dukandar_lang', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: any, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minSpend) {
    cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
      cartDiscount = appliedCoupon.maxDiscount;
    }
  }

  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const cartDeliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : settings.standardDeliveryFee;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  // Cart Actions
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: { name: string; hex: string },
    selectedSize?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor?.name === selectedColor?.name &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(product.stock, newQty),
        };
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
      message: `${product.title} (x${quantity}) was added to your shopping cart.`,
      messageUrdu: `${product.titleUrdu} کارٹ میں شامل کر دی گئی۔`,
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
    if (quantity <= 0) {
      removeFromCart(productId, selectedColorName, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor?.name === selectedColorName &&
          item.selectedSize === selectedSize
        ) {
          return {
            ...item,
            quantity: Math.min(item.product.stock, quantity),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        if (prod) {
          addNotification({
            title: 'Added to Wishlist ❤️',
            titleUrdu: 'پسندیدہ فہرست میں شامل ❤️',
            message: `${prod.title} added to your wishlist.`,
            messageUrdu: `${prod.titleUrdu} آپ کی پسندیدہ فہرست میں شامل کر دیا گیا۔`,
            type: 'promo',
          });
        }
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon Actions
  const applyCouponCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      return { success: false, message: t('invalidCoupon') };
    }

    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message:
          language === 'ur'
            ? `اس کوپن کے لیے کم از کم ₨ ${found.minSpend.toLocaleString('en-PK')} کی خریداری ضروری ہے۔`
            : `Minimum spend of ₨ ${found.minSpend.toLocaleString('en-PK')} required for this coupon.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: t('couponApplied') };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const createCoupon = (newCouponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const newCoupon: Coupon = {
      ...newCouponData,
      id: `coup-${Date.now()}`,
      timesUsed: 0,
      code: newCouponData.code.toUpperCase(),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Orders Actions
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>
  ): Order => {
    const orderNumber = `DKN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedTimestamp = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now.toISOString(),
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Placed',
          titleUrdu: 'آرڈر موصول ہوا',
          description: 'Your order has been registered and scheduled for dispatch.',
          descriptionUrdu: 'آپ کا آرڈر سسٹم میں درج ہو چکا ہے۔',
          timestamp: formattedTimestamp,
          completed: true,
          current: true,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    // Reduce stock of ordered products
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInOrder = orderData.items.find((i) => i.product.id === prod.id);
        if (itemInOrder) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - itemInOrder.quantity),
          };
        }
        return prod;
      })
    );

    // Update customer stats
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === orderData.customer.email.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + orderData.total,
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          city: orderData.customer.city,
          totalOrders: 1,
          totalSpent: orderData.total,
          joinedDate: new Date().toISOString().split('T')[0],
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          status: 'active',
        };
        return [newCust, ...prev];
      }
    });

    // Notify customer
    addNotification({
      title: `Order Placed: #${orderNumber} 🎉`,
      titleUrdu: `آرڈر کنفرم ہوا: #${orderNumber} 🎉`,
      message: `Total amount: ₨ ${orderData.total.toLocaleString('en-PK')}. We are preparing your shipment!`,
      messageUrdu: `کل رقم ₨ ${orderData.total.toLocaleString('en-PK')}۔ آپ کا آرڈر تیار کیا جا رہا ہے۔`,
      type: 'order',
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, customNote?: string) => {
    const now = new Date();
    const formattedTimestamp = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const statusTitles: Record<OrderStatus, { en: string; ur: string; descEn: string; descUr: string }> = {
      pending: {
        en: 'Order Received',
        ur: 'آرڈر وصول ہوا',
        descEn: 'Order is awaiting warehouse confirmation.',
        descUr: 'آرڈر کی تصدیق کا عمل جاری ہے۔',
      },
      processing: {
        en: 'Packed & Quality Inspected',
        ur: 'پیکنگ اور کوالٹی چیک',
        descEn: 'Items securely packed and prepared for courier dispatch.',
        descUr: 'سامان باحفاظت پیک کر کے روانگی کے لیے تیار ہے۔',
      },
      shipped: {
        en: 'Shipped with Courier',
        ur: 'کورئیر کو روانہ',
        descEn: 'Handed over to Trax/TCS Courier partner.',
        descUr: 'کورئیر سروس کے حوالے کر دیا گیا۔',
      },
      out_for_delivery: {
        en: 'Out for Delivery',
        ur: 'ترسیل کے لیے روانہ',
        descEn: 'Rider is currently on route to your address.',
        descUr: 'رائیڈر پارسل لے کر آپ کے پتے کی طرف روانہ ہے۔',
      },
      delivered: {
        en: 'Successfully Delivered',
        ur: 'کامیابی سے موصول ہوا',
        descEn: 'Parcel handed over to customer. Payment collected.',
        descUr: 'سامان کسٹمر کے سپرد کر دیا گیا۔',
      },
      cancelled: {
        en: 'Order Cancelled',
        ur: 'آرڈر منسوخ کر دیا گیا',
        descEn: customNote || 'Order was cancelled per customer request or stock limit.',
        descUr: customNote || 'آرڈر منسوخ کر دیا گیا ہے۔',
      },
    };

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const stepConfig = statusTitles[status];
          const newHistory = order.trackingHistory.map((s) => ({ ...s, current: false }));
          
          newHistory.push({
            status,
            title: stepConfig.en,
            titleUrdu: stepConfig.ur,
            description: customNote || stepConfig.descEn,
            descriptionUrdu: customNote || stepConfig.descUr,
            timestamp: formattedTimestamp,
            completed: true,
            current: true,
          });

          return {
            ...order,
            status,
            paymentStatus: status === 'delivered' ? 'paid' : order.paymentStatus,
            trackingHistory: newHistory,
          };
        }
        return order;
      })
    );
  };

  const trackOrderByNumber = (orderNumber: string): Order | null => {
    const clean = orderNumber.trim().toUpperCase();
    return orders.find((o) => o.orderNumber.toUpperCase() === clean) || null;
  };

  // Product Admin Operations
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      reviews: [],
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Reviews
  const addProductReview = (
    productId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>
  ) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const currentReviews = prod.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...prod,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Number(avgRating.toFixed(1)),
          };
        }
        return prod;
      })
    );
  };

  // Auth / User
  const loginUser = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const existing = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    const user: UserProfile = {
      id: existing ? existing.id : `usr-${Date.now()}`,
      name: existing ? existing.name : email.split('@')[0],
      email: email,
      phone: existing ? existing.phone : '+92 300 1234567',
      address: 'House 42-B, Street 7, DHA Phase 5',
      city: existing ? existing.city : 'Lahore',
      role: role,
      avatar: existing ? existing.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setCurrentUser(user);
    if (role === 'admin') {
      setActiveView('admin');
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActiveView('shop');
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: StoreNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
