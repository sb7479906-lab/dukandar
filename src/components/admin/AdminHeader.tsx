import React from 'react';
import {
  Store,
  Bell,
  Search,
  Globe,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export const AdminHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    setActiveView,
    orders,
    products,
    settings,
    t,
  } = useStore();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Mode Tag */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
          <span>د</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight">
              {language === 'ur' ? 'دکان دار ایڈمن پینل' : 'Dukandar Admin Hub'}
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Portal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {language === 'ur' ? 'سٹور کی آمدنی، آرڈرز اور انوینٹری کا انتظام' : 'E-Commerce Operations, Analytics & Inventory Control'}
          </p>
        </div>
      </div>

      {/* Quick KPI Badges */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">{t('totalRevenue')}:</span>
          <span className="font-bold text-white">
            {formatPrice(totalRevenue, currency, settings.usdRate)}
          </span>
        </div>

        {lowStockCount > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{lowStockCount} {language === 'ur' ? 'کم سٹاک اشیاء' : 'Low Stock Items'}</span>
          </div>
        )}

        {pendingOrdersCount > 0 && (
          <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-xl border border-blue-500/30">
            <Package className="w-4 h-4 text-blue-400" />
            <span>{pendingOrdersCount} {language === 'ur' ? 'نئے آرڈرز' : 'Pending Orders'}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language & Currency Toggle */}
        <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="px-2 py-1 text-xs font-bold rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>
          <div className="w-[1px] h-3.5 bg-slate-700 mx-0.5"></div>
          <button
            onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
            className="px-2 py-1 text-xs font-bold rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {currency}
          </button>
        </div>

        {/* Back to Storefront Button */}
        <button
          onClick={() => setActiveView('shop')}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>{t('storeFront')}</span>
        </button>
      </div>
    </header>
  );
};
