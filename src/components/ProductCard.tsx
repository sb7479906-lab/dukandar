import React from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  MessageCircle,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPrice, generateWhatsAppProductInquiryUrl } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    currency,
    t,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveProductModal,
    settings,
  } = useStore();

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppProductInquiryUrl(settings.whatsappNumber, product);
    window.open(url, '_blank');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setActiveProductModal(product)}
      className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md">
              -{product.discountPercent}% {t('off')}
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Flame className="w-3 h-3 fill-slate-950" />
              <span>{language === 'ur' ? 'ہاٹ سیل' : 'Best Seller'}</span>
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'ur' ? 'نیا' : 'New'}</span>
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistToggle}
          title={isFavorite ? t('removeFromWishlist') : t('addToWishlist')}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-500'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
          <span className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>{t('viewDetails')}</span>
          </span>
        </div>

        {/* Stock Alert Warning Bar */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
            {t('outOfStock')}
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-slate-950 text-[10px] font-black py-0.5 text-center">
            {t('lowStock', { count: product.stock })}
          </div>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-600">
              {language === 'ur' ? product.categoryUrdu : product.category}
            </span>

            <div className="flex items-center gap-1 text-slate-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px]">{product.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {language === 'ur' ? product.titleUrdu : product.title}
          </h3>

          {/* Colors Swatches Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-slate-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {formatPrice(product.price, currency, settings.usdRate)}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice, currency, settings.usdRate)}
                </div>
              )}
            </div>

            {/* In Stock Pill */}
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{t('inStock')}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-5 gap-2">
            {/* Quick Add to Cart Button */}
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`col-span-4 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-sm shadow-emerald-600/20'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('quickAdd')}</span>
            </button>

            {/* Direct WhatsApp Inquiry Button */}
            <button
              onClick={handleWhatsAppInquiry}
              title={t('orderViaWhatsApp')}
              className="col-span-1 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
