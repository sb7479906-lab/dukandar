import React, { useState } from 'react';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  Printer,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    orders,
    currentTrackingOrder,
    setCurrentTrackingOrder,
    trackOrderByNumber,
    currency,
    language,
    t,
    settings,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isTrackingOpen) return null;

  // Selected order or fallback to first order or tracking order
  const activeOrder: Order | null =
    currentTrackingOrder || (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = trackOrderByNumber(searchQuery);
    if (found) {
      setCurrentTrackingOrder(found);
      setErrorMessage('');
    } else {
      setErrorMessage(t('noOrderFound'));
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'out_for_delivery':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t('orderTracker')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ur' ? 'اپنے پارسل کی لائیو لوکیشن اور صورتحال معلوم کریں' : 'Real-time courier dispatch status & live logistics timeline'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('enterOrderNumber')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm uppercase font-mono outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-colors cursor-pointer"
            >
              {t('trackButton')}
            </button>
          </form>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Order Tabs */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold shrink-0">
                {language === 'ur' ? 'حالیہ آرڈرز:' : 'Recent Orders:'}
              </span>
              {orders.slice(0, 4).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setCurrentTrackingOrder(ord);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeOrder?.id === ord.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {ord.orderNumber}
                </button>
              ))}
            </div>
          )}

          {/* Active Order Details */}
          {activeOrder ? (
            <div className="space-y-6">
              {/* Top Summary Banner */}
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">{t('yourOrderNumber')}:</span>
                    <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
                      {activeOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {language === 'ur' ? 'آرڈر کی تاریخ:' : 'Placed on:'}{' '}
                    {formatDate(activeOrder.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full border text-xs font-extrabold uppercase tracking-wider ${getStatusColor(
                      activeOrder.status
                    )}`}
                  >
                    {activeOrder.status.replace(/_/g, ' ')}
                  </span>

                  <button
                    onClick={handlePrint}
                    title={t('printInvoice')}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Progress Timeline */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  {t('orderTimeline')}
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeOrder.trackingHistory.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Step Circle Pin */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                          step.completed
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {language === 'ur' ? step.titleUrdu : step.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {language === 'ur' ? step.descriptionUrdu : step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items & Shipping Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Items Box */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('itemsInOrder')} ({activeOrder.items.length})
                  </h4>

                  <div className="divide-y divide-slate-200/80 space-y-2">
                    {activeOrder.items.map((item, i) => (
                      <div key={i} className="pt-2 flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {language === 'ur' ? item.product.titleUrdu : item.product.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Qty: {item.quantity}{' '}
                            {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </p>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {formatPrice(item.product.price * item.quantity, currency, settings.usdRate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('shippingDetails')}
                  </h4>

                  <div className="space-y-1.5 text-slate-600">
                    <p className="font-bold text-slate-900">{activeOrder.customer.name}</p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeOrder.customer.phone}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                      <span>
                        {activeOrder.customer.address}, {activeOrder.customer.city}
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('paymentMethod')}:</span>
                      <span className="font-bold uppercase text-slate-800">
                        {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
                      </span>
                    </div>
                    <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-1">
                      <span>{t('total')}:</span>
                      <span className="text-emerald-700">
                        {formatPrice(activeOrder.total, currency, settings.usdRate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">{t('noOrderFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
