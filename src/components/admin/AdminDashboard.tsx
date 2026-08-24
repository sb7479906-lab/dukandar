import React from 'react';
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    currency,
    t,
    orders,
    products,
    customers,
    setAdminTab,
    settings,
  } = useStore();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminDashboard')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur'
              ? 'سٹور کی مجموعی کارکردگی اور فوری احکامات کا خلاصہ'
              : 'Store performance KPIs and instant operations overview'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('products')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-2xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewProduct')}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('totalRevenue')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatPrice(totalRevenue, currency, settings?.usdRate)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Live Firestore sync</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('totalOrders')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {orders.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
            <Clock className="w-4 h-4" />
            <span>
              {pendingOrders.length}{' '}
              {language === 'ur' ? 'زیر التواء آرڈرز' : 'pending fulfillment'}
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('activeProducts')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {products.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {products.reduce((acc, p) => acc + (p.stock || 0), 0)}{' '}
              {language === 'ur' ? 'کل یونٹس سٹاک' : 'total units in stock'}
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('totalCustomers')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {customers.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Verified buyer profiles</span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                {language === 'ur'
                  ? 'سٹاک الرٹ: چند مصنوعات کا سٹاک ختم ہونے والا ہے'
                  : 'Inventory Warning: Products Running Low on Stock'}
              </h4>
              <p className="text-[11px] text-amber-700">
                {lowStockProducts
                  .map((p) => `${p.title} (${p.stock} left)`)
                  .join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('products')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer shadow-xs"
          >
            {language === 'ur' ? 'سٹاک بڑھائیں' : 'Restock Now'}
          </button>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">{t('recentOrders')}</h3>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            {language === 'ur' ? 'تمام آرڈرز دیکھیں' : 'View All Orders'}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-bold">
            {language === 'ur' ? 'کوئی آرڈر نہیں ملا' : 'No recent orders placed yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">{t('customer')}</th>
                  <th className="p-3">{t('date')}</th>
                  <th className="p-3">{t('amount')}</th>
                  <th className="p-3">{t('status')}</th>
                  <th className="p-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => {
                  const customerName =
                    order.customerName ||
                    order.customer?.name ||
                    'Guest User';
                  const customerCity =
                    order.customerCity || order.customer?.city || 'Pakistan';
                  const orderAmt = order.totalAmount || order.total || 0;
                  const orderNum =
                    order.orderNumber || `#${order.id.substring(0, 8)}`;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {orderNum}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">
                          {customerName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {customerCity}
                        </div>
                      </td>
                      <td className="p-3 text-slate-500">
                        {formatDate(order.createdAt || Date.now())}
                      </td>
                      <td className="p-3 font-extrabold text-slate-900">
                        {formatPrice(orderAmt, currency, settings?.usdRate)}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {(order.status || 'pending').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setAdminTab('orders')}
                          className="text-emerald-700 hover:underline font-bold cursor-pointer"
                        >
                          {t('updateStatus')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
