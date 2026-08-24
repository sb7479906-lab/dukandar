import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  MessageCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, generateWhatsAppOrderUrl } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    currency,
    language,
    t,
    setIsCheckoutOpen,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.freeDeliveryThreshold || 3000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl(
      settings?.whatsappNumber || '923001234567',
      cart,
      cartTotal
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {t('shoppingCart')} ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                {language === 'ur' ? 'خالی کریں' : 'Clear'}
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart.length > 0 && (
          <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 px-5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>
                  {freeShippingRemaining === 0
                    ? t('freeDeliveryUnlocked')
                    : t('freeDeliveryNotice', {
                        amount: formatPrice(freeShippingRemaining, currency, settings?.usdRate),
                      })}
                </span>
              </div>
              <span>{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{t('emptyCartTitle')}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">{t('emptyCartDesc')}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md cursor-pointer"
              >
                {t('startShopping')}
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const itemImg = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
              const itemTitle = language === 'ur' ? (item.product?.titleUrdu || item.product?.title) : item.product?.title;

              return (
                <div key={idx} className="py-3.5 flex items-center gap-3">
                  <img
                    src={itemImg}
                    alt={itemTitle}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {itemTitle}
                    </h4>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && (
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      {formatPrice((item.product?.price || 0) * item.quantity, currency, settings?.usdRate)}
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedColor?.name,
                            item.selectedSize
                          )
                        }
                        className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedColor?.name,
                            item.selectedSize
                          )
                        }
                        className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedColor?.name,
                          item.selectedSize
                        )
                      }
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
            {/* Coupon Code Box */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span>
                    {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  {language === 'ur' ? 'ہٹائیں' : 'Remove'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('enterCouponCode')}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  {t('applyCoupon')}
                </button>
              </form>
            )}

            {couponMessage && (
              <p
                className={`text-xs font-semibold ${
                  couponMessage.success ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {couponMessage.text}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(cartSubtotal, currency, settings?.usdRate)}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('discount')}</span>
                  <span>-{formatPrice(cartDiscount, currency, settings?.usdRate)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span className="font-bold text-slate-900">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-extrabold uppercase">
                      {t('freeDelivery')}
                    </span>
                  ) : (
                    formatPrice(cartDeliveryFee, currency, settings?.usdRate)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('total')}</span>
                <span className="text-emerald-700">
                  {formatPrice(cartTotal, currency, settings?.usdRate)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ur' ? 'واٹس ایپ پر فوری آرڈر دیں' : 'Checkout via WhatsApp Direct'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
