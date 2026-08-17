import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import { formatPrice } from '../utils/formatters';

const pakistanCities = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Other City',
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    placeOrder,
    currency,
    language,
    t,
    currentUser,
    settings,
    setIsTrackingOpen,
    setCurrentTrackingOrder,
  } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || 'Lahore');
  const [postalCode, setPostalCode] = useState('54000');
  const [notes, setNotes] = useState('');

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Simulated card / wallet inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [walletPhone, setWalletPhone] = useState('+92 300 1234567');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const deliveryFee =
    deliveryMethod === 'express'
      ? settings.expressDeliveryFee
      : isFreeDelivery
      ? 0
      : settings.standardDeliveryFee;

  const orderTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const placed = placeOrder({
        customer: {
          name,
          email: email || 'customer@dukandar.pk',
          phone,
          address,
          city,
          postalCode,
          notes,
        },
        items: cart,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        couponCode: appliedCoupon?.code,
        deliveryCharges: deliveryFee,
        deliveryMethod,
        total: orderTotal,
        status: 'pending',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      });

      setIsSubmitting(false);
      setOrderCompleted(placed);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error', err);
      }
    }, 1200);
  };

  const handleTrackPlacedOrder = () => {
    if (orderCompleted) {
      setCurrentTrackingOrder(orderCompleted);
      setIsCheckoutOpen(false);
      setIsTrackingOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {orderCompleted ? t('orderSuccessTitle') : t('checkout')}
              </h2>
              <p className="text-xs text-slate-500">{t('securePayment')}</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success Screen */}
        {orderCompleted ? (
          <div className="p-6 sm:p-10 text-center space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {t('orderSuccessTitle')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {language === 'ur' ? 'آرڈر کی تصدیق ہو گئی ہے!' : 'Your Order is Confirmed!'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {t('orderSuccessDesc')}
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 max-w-md mx-auto text-xs sm:text-sm">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                <span className="text-slate-500">{t('yourOrderNumber')}:</span>
                <span className="text-emerald-700 font-mono text-base">{orderCompleted.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('fullName')}:</span>
                <span className="font-semibold text-slate-800">{orderCompleted.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('city')}:</span>
                <span className="font-semibold text-slate-800">{orderCompleted.customer.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('payment')}:</span>
                <span className="font-semibold text-slate-800 uppercase">{orderCompleted.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('total')}:</span>
                <span className="text-emerald-700 font-black text-base">
                  {formatPrice(orderCompleted.total, currency, settings.usdRate)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleTrackPlacedOrder}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Truck className="w-5 h-5" />
                <span>{t('viewLiveTracking')}</span>
              </button>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-2xl transition-colors cursor-pointer"
              >
                {t('continueShopping')}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Step 1: Customer Contact & Shipping Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>{t('shippingDetails')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Daniyal"
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="daniyal.pk@gmail.com"
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('city')} *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    {pakistanCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('deliveryAddress')} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Apartment #, Street #, Sector/Area, Near Famous Landmark"
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('orderNotes')}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional delivery instructions (e.g. Call before arrival)"
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Option */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>{t('deliveryMethod')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="mt-1 text-emerald-600"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {t('standardDelivery')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {isFreeDelivery ? (
                        <span className="text-emerald-700 font-bold uppercase">{t('freeDelivery')}</span>
                      ) : (
                        formatPrice(settings.standardDeliveryFee, currency, settings.usdRate)
                      )}
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="mt-1 text-emerald-600"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {t('expressDelivery')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatPrice(settings.expressDeliveryFee, currency, settings.usdRate)} (Priority Trax Express)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>{t('paymentMethod')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {t('codName')}
                    </div>
                    <div className="text-[11px] text-slate-500">{t('codDesc')}</div>
                  </div>
                </label>

                {/* Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {t('cardName')}
                    </div>
                    <div className="text-[11px] text-slate-500">{t('cardDesc')}</div>
                  </div>
                </label>

                {/* EasyPaisa */}
                <label
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'easypaisa'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {t('easyPaisaName')}
                    </div>
                    <div className="text-[11px] text-slate-500">{t('easyPaisaDesc')}</div>
                  </div>
                </label>

                {/* JazzCash */}
                <label
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'jazzcash'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {t('jazzCashName')}
                    </div>
                    <div className="text-[11px] text-slate-500">{t('jazzCashDesc')}</div>
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Details Input */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Card Information</span>
                    <span className="text-slate-400">Visa / Mastercard / UnionPay</span>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="password"
                      defaultValue="786"
                      placeholder="CVC"
                      className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mobile Wallet Account Number
                  </label>
                  <input
                    type="tel"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <p className="text-[11px] text-slate-500">
                    A USSD prompt or in-app approval notification will be sent to your mobile wallet for verification.
                  </p>
                </div>
              )}
            </div>

            {/* Order Review & Place Order CTA */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('subtotal')}:</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(cartSubtotal, currency, settings.usdRate)}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('discount')}:</span>
                  <span>-{formatPrice(cartDiscount, currency, settings.usdRate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">{t('deliveryFee')}:</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold">{t('freeDelivery')}</span>
                  ) : (
                    formatPrice(deliveryFee, currency, settings.usdRate)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('total')}:</span>
                <span className="text-emerald-700 text-lg">
                  {formatPrice(orderTotal, currency, settings.usdRate)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer text-sm sm:text-base"
            >
              {isSubmitting ? (
                <span>{t('placingOrder')}</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{t('placeOrder')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
