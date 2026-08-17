import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  Sparkles,
  LayoutDashboard,
  Store,
  Compass,
  MessageCircle,
  Truck,
  Globe,
  DollarSign,
  ChevronDown,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    activeView,
    setActiveView,
    t,
    cartCount,
    wishlist,
    unreadNotificationCount,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    products,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsTrackingOpen,
    setIsAuthOpen,
    setIsProfileOpen,
    setIsSupportOpen,
    setIsNotificationsOpen,
    setActiveProductModal,
    currentUser,
    settings,
  } = useStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filtered preview for live search dropdown
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.titleUrdu.includes(searchQuery) ||
            p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-between">
          <div className="hidden sm:block flex-1"></div>
          <div className="flex items-center justify-center gap-2 flex-1 text-center font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>
              {language === 'ur' ? settings.announcementTextUrdu : settings.announcementText}
            </span>
          </div>
          <div className="flex items-center justify-end gap-3 flex-1 text-xs">
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:underline flex items-center gap-1 cursor-pointer text-emerald-100 hover:text-white"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t('trackOrder')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Store Logo & Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('shop');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <span>د</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    {language === 'ur' ? 'دکان دار' : 'Dukandar'}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {language === 'ur' ? 'سٹور' : 'Store'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {language === 'ur' ? 'آن لائن خریداری کا مرکز' : 'Premium Shopping & Logistics'}
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar with Live Suggestions */}
          {activeView === 'shop' && (
            <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 hidden md:block">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 rounded-full border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                    {language === 'ur' ? 'تلاش کے نتائج' : 'Products matching search'}
                  </div>
                  {searchSuggestions.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {searchSuggestions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setActiveProductModal(product);
                            setSearchFocused(false);
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-11 h-11 object-cover rounded-lg border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {language === 'ur' ? product.titleUrdu : product.title}
                            </p>
                            <p className="text-xs text-emerald-600 font-bold">
                              {formatPrice(product.price, currency, settings.usdRate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      {t('noProductsFound')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Language & Currency Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                title="Toggle Language (اردو / English)"
                className="px-2 py-1 text-xs font-bold rounded-lg transition-all text-slate-700 hover:text-emerald-700 hover:bg-white flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'اردو' : 'English'}</span>
              </button>
              
              <div className="w-[1px] h-4 bg-slate-300 mx-0.5"></div>
              
              <button
                onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
                title="Toggle Currency (PKR / USD)"
                className="px-2 py-1 text-xs font-bold rounded-lg transition-all text-slate-700 hover:text-emerald-700 hover:bg-white cursor-pointer"
              >
                {currency === 'PKR' ? '₨ PKR' : '$ USD'}
              </button>
            </div>

            {/* WhatsApp Quick Help Trigger */}
            <button
              onClick={() => setIsSupportOpen(true)}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors relative cursor-pointer"
              title={t('whatsappHelp')}
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative cursor-pointer hidden sm:flex"
              title={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button with Count & Subtotal */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-bold">
                {cartCount > 0 ? formatPrice(useStore().cartSubtotal, currency, settings.usdRate) : t('cart')}
              </span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title={currentUser.name}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500"
                />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title={t('login')}
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Admin Portal Toggle Button */}
            <button
              onClick={() => setActiveView(activeView === 'shop' ? 'admin' : 'shop')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              {activeView === 'shop' ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span className="hidden lg:inline">{t('adminPortal')}</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>{t('storeFront')}</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        {activeView === 'shop' && (
          <div className="pb-3 md:hidden">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-10 py-2 bg-slate-100 text-sm text-slate-800 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
