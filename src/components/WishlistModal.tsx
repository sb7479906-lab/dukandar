import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

export const WishlistModal: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist = [],
    products = [],
    toggleWishlist,
    addToCart,
    currency,
    language,
    t,
    setActiveProductModal,
    setIsCartOpen,
    settings,
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (prod: Product) => {
    addToCart(prod, 1);
    toggleWishlist(prod.id);
  };

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((p) => {
      if (p.stock > 0) addToCart(p, 1);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t('wishlist')} ({favoriteProducts.length})
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ur' ? 'آپ کی محفوظ کردہ پسندیدہ پروڈکٹس' : 'Your saved favorite items'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {language === 'ur' ? 'پسندیدہ فہرست خالی ہے' : 'Your Wishlist is Empty'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {language === 'ur' ? 'پروڈکٹس پر موجود دل کے آئیکون پر کلک کر کے انہیں یہاں محفوظ کریں۔' : 'Tap the heart icon on any product to save it here for later.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-slate-100">
                {favoriteProducts.map((prod) => {
                  const prodImg = prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                  const prodTitle = language === 'ur' ? (prod.titleUrdu || prod.title) : prod.title;

                  return (
                    <div key={prod.id} className="py-3.5 flex items-center gap-3">
                      <img
                        src={prodImg}
                        alt={prodTitle}
                        onClick={() => {
                          setIsWishlistOpen(false);
                          setActiveProductModal(prod);
                        }}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200 cursor-pointer shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setActiveProductModal(prod);
                          }}
                          className="text-xs sm:text-sm font-bold text-slate-900 truncate hover:text-emerald-600 cursor-pointer"
                        >
                          {prodTitle}
                        </h4>
                        <div className="text-xs font-black text-slate-900 mt-1">
                          {formatPrice(prod.price, currency, settings?.usdRate)}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {prod.stock > 0 ? t('inStock') : t('outOfStock')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveToCart(prod)}
                          disabled={prod.stock <= 0}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t('quickAdd')}</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleAddAllToCart}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-2xl flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'ur' ? 'تمام اشیاء کارٹ میں ڈالیں' : 'Add All to Shopping Cart'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
