import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { Footer } from './components/Footer';

// Admin Components
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminSettings } from './components/admin/AdminSettings';

import {
  ArrowUpDown,
  Sparkles,
  ShoppingBag,
  Truck,
  MessageCircle,
  X,
  Search,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    adminTab,
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    language,
    t,
    setIsSupportOpen,
    setIsTrackingOpen,
    cart,
    setIsCartOpen,
    settings,
  } = useStore();

  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange] = useState<number>(500000);

  // Filter products based on search, category, stock, and price
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.titleUrdu?.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesStock = !inStockOnly || product.stock > 0;
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'discount':
        return (b.discountPercent || 0) - (a.discountPercent || 0);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  // Render Admin View
  if (activeView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <AdminHeader />
        <div className="flex-1 flex flex-col md:flex-row">
          <AdminSidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-100 text-slate-900 min-h-[calc(100vh-65px)]">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'analytics' && <AdminAnalytics />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'customers' && <AdminCustomers />}
            {adminTab === 'coupons' && <AdminCoupons />}
            {adminTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    );
  }

  // Render Customer Storefront View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-[11px] sm:text-xs py-2 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>{language === 'ur' ? settings?.announcementTextUrdu : settings?.announcementText}</span>
      </div>

      {/* Main Store Navbar */}
      <Navbar />

      {/* Hero Banner Slider */}
      <HeroBanner />

      {/* Category Section Bar */}
      <CategorySection />

      {/* Product Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Section Header & Filters Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'all'
                  ? t('allCategories')
                  : language === 'ur'
                  ? activeCategoryObj?.nameUrdu
                  : activeCategoryObj?.name}
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {sortedProducts.length} {language === 'ur' ? 'اشیاء' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ur'
                ? 'تمام مصنوعات پر کیش آن ڈلیوری اور 7 دن کی تبدیلی گارنٹی دستیاب ہے'
                : '100% genuine with Cash on Delivery and direct courier doorstep tracking'}
            </p>
          </div>

          {/* Controls: Sorting & In-Stock Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer select-none hover:border-slate-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md cursor-pointer accent-emerald-600"
              />
              <span>{language === 'ur' ? 'صرف دستیاب سٹاک' : 'In-Stock Only'}</span>
            </label>

            <div className="flex items-center bg-white px-3 py-1.5 rounded-2xl border border-slate-200 text-xs gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer py-1"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price_asc">{t('sortPriceLowHigh')}</option>
                <option value="price_desc">{t('sortPriceHighLow')}</option>
                <option value="rating">{t('sortRating')}</option>
                <option value="discount">{t('sortDiscount')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-slate-400 font-bold">
              {language === 'ur' ? 'فلٹرز:' : 'Active Filters:'}
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                <span>
                  {language === 'ur' ? activeCategoryObj?.nameUrdu : activeCategoryObj?.name}
                </span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-emerald-950 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-blue-950 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                <span>In Stock Only</span>
                <button
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-amber-950 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="text-xs text-rose-600 hover:underline font-bold ml-1 cursor-pointer"
            >
              {language === 'ur' ? 'تمام فلٹرز ختم کریں' : 'Clear All'}
            </button>
          </div>
        )}

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-white rounded-3xl border border-slate-200 my-6 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {language === 'ur' ? 'کوئی پروڈکٹ نہیں ملی' : 'No Products Match Your Criteria'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {language === 'ur'
                  ? 'براہ کرم تلاش کا لفظ تبدیل کریں یا تمام کیٹیگریز منتخب کریں۔'
                  : 'Try adjusting your search terms or filter selection.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
            >
              {t('allCategories')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* VIP Customer Assistance Banner */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              24/7 Dedicated Support
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'ur'
                ? 'کیا آپ کو خریداری یا سائز کے انتخاب میں رہنمائی چاہیے؟'
                : 'Need immediate help placing your order or choosing sizes?'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {language === 'ur'
                ? 'ہمارے نمائندے واٹس ایپ پر لائیو موجود ہیں۔ آپ براہ راست میسج کر کے آرڈر بک کروا سکتے ہیں۔'
                : 'Chat directly with our verified customer service agents on WhatsApp for instant order confirmation and recommendations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => setIsSupportOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'ur' ? 'واٹس ایپ چیٹ شروع کریں' : 'Live WhatsApp Help'}</span>
            </button>

            <button
              onClick={() => setIsTrackingOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-2xl flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>{t('trackOrder')}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => {
            const url = `https://wa.me/${settings?.whatsappNumber || '923008899776'}?text=${encodeURIComponent(
              'Salam! I want to inquire about products on Dukandar store.'
            )}`;
            window.open(url, '_blank');
          }}
          title="Direct WhatsApp Helpline"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border-2 border-white animate-bounce"
        >
          <MessageCircle className="w-7 h-7" />
        </button>

        {cart.length > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black cursor-pointer border border-slate-700"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>
              {cart.reduce((a, b) => a + b.quantity, 0)} {language === 'ur' ? 'اشیاء' : 'Items'}
            </span>
          </button>
        )}
      </div>

      {/* Store Footer */}
      <Footer />

      {/* All Drawers and Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <WishlistModal />
      <AuthModal />
      <CustomerProfileModal />
      <NotificationDrawer />
      <CustomerSupportModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
