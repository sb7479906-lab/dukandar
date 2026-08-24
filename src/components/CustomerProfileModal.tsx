import React from 'react';
import {
  X,
  Package,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, formatDate } from '../utils/formatters';

export const CustomerProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    currentUser,
    logoutUser,
    orders = [],
    currency,
    language,
    t,
    setIsTrackingOpen,
    setCurrentTrackingOrder,
    settings,
  } = useStore();

  if (!isProfileOpen || !currentUser) return null;

  const userOrders = orders.filter(
    (o) =>
      (o.customer?.email && currentUser.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (o.customer?.name && currentUser.name && o.customer.name.toLowerCase() === currentUser.name.toLowerCase())
  );

  const handleTrackOrder = (order: any) => {
    setCurrentTrackingOrder(order);
    setIsProfileOpen(false);
    setIsTrackingOpen(true);
  };

  const userAvatar = currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={userAvatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-sm"
            />
            <div>
              <h2 className="text-lg font-black text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutUser();
                setIsProfileOpen(false);
              }}
              title={t('logout')}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* User Information Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              {language === 'ur' ? 'اکاؤنٹ کی معلومات' : 'Saved Shipping Information'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {currentUser.address || 'No default address saved'}, {currentUser.city || ''}
                </span>
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>
                {t('myOrders')} ({userOrders.length})
              </span>
            </h3>

            {userOrders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                {language === 'ur' ? 'آپ نے ابھی تک کوئی آرڈر نہیں کیا۔' : 'You have not placed any orders yet.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {ord.orderNumber}
                        </span>
                        <p className="text-[11px] text-slate-400">{formatDate(ord.createdAt)}</p>
                      </div>
                      <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <div>
                        <span className="text-slate-500">Items: </span>
                        <span className="font-bold text-slate-800">{ord.items?.length || 0} items</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900">
                          {formatPrice(ord.total, currency, settings?.usdRate)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTrackOrder(ord)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t('trackOrder')}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
