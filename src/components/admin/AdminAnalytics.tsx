import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

export const AdminAnalytics: React.FC = () => {
  const { language, currency, t, orders, products, settings } = useStore();
  const [salesTimeframe, setSalesTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Dynamic order status distribution from real orders
  const orderStatusCounts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    out_for_delivery: orders.filter((o) => o.status === 'out_for_delivery').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const orderStatusData = [
    { name: language === 'ur' ? 'پہنچ چکے (Delivered)' : 'Delivered', count: orderStatusCounts.delivered, color: '#10b981' },
    { name: language === 'ur' ? 'راستے میں (In Transit)' : 'Out for Delivery / Shipped', count: orderStatusCounts.shipped + orderStatusCounts.out_for_delivery, color: '#3b82f6' },
    { name: language === 'ur' ? 'پیکنگ (Processing)' : 'Processing', count: orderStatusCounts.processing, color: '#8b5cf6' },
    { name: language === 'ur' ? 'نئے آرڈرز (Pending)' : 'Pending', count: orderStatusCounts.pending, color: '#f59e0b' },
    { name: language === 'ur' ? 'منسوخ (Cancelled)' : 'Cancelled', count: orderStatusCounts.cancelled, color: '#ef4444' },
  ].filter(d => d.count > 0);

  // Stock levels from real products in Firestore
  const stockData = products.slice(0, 8).map((p) => ({
    name: p.title.length > 18 ? p.title.substring(0, 18) + '...' : p.title,
    stock: p.stock,
    price: p.price,
  }));

  // Computing Category Share from Real Products
  const categoryCountMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryCountMap[p.category] = (categoryCountMap[p.category] || 0) + 1;
  });

  const categoryDistribution = Object.keys(categoryCountMap).map((catKey, index) => ({
    name: catKey.toUpperCase(),
    value: Math.round((categoryCountMap[catKey] / (products.length || 1)) * 100),
    color: COLORS[index % COLORS.length],
  }));

  // Computing Top Selling Products from Live Orders
  const productSalesMap: Record<string, { name: string; units: number }> = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const pId = item.product.id;
      if (!productSalesMap[pId]) {
        productSalesMap[pId] = { name: item.product.title, units: 0 };
      }
      productSalesMap[pId].units += item.quantity;
    });
  });

  const topProductsData = Object.values(productSalesMap)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      units: p.units,
    }));

  // Dynamically group live orders by Date / Period
  const getActiveSalesData = (): Array<{ label: string; sales: number; orders: number }> => {
    const groupedSales: Record<string, { sales: number; orders: number }> = {};

    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt || Date.now());
      let key = orderDate.toLocaleDateString('en-US', { weekday: 'short' });

      if (salesTimeframe === 'weekly') {
        key = `Week ${Math.ceil(orderDate.getDate() / 7)}`;
      } else if (salesTimeframe === 'monthly') {
        key = orderDate.toLocaleDateString('en-US', { month: 'short' });
      }

      if (!groupedSales[key]) {
        groupedSales[key] = { sales: 0, orders: 0 };
      }

      groupedSales[key].sales += o.total || 0;
      groupedSales[key].orders += 1;
    });

    const result = Object.keys(groupedSales).map((k) => ({
      label: k,
      sales: groupedSales[k].sales,
      orders: groupedSales[k].orders,
    }));

    return result.length > 0 ? result : [{ label: 'Today', sales: 0, orders: 0 }];
  };

  const activeSalesData = getActiveSalesData();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminAnalytics')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'لائیو ریونیو، سیلز کے رجحانات، اور مصنوعات کی کارکردگی کا موازنہ' : 'Real-time sales revenue, volume performance, and product analytics'}
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setSalesTimeframe('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              salesTimeframe === 'daily'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('daily')}
          </button>
          <button
            onClick={() => setSalesTimeframe('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              salesTimeframe === 'weekly'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('weekly')}
          </button>
          <button
            onClick={() => setSalesTimeframe('monthly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              salesTimeframe === 'monthly'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('monthly')}
          </button>
        </div>
      </div>

      {/* Main Sales & Revenue Chart */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('salesOverview')}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'سیلز اور آرڈرز کی ترقی' : 'Revenue generated vs. volume'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>{language === 'ur' ? 'سیلز ریونیو' : 'Sales Revenue'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span>{language === 'ur' ? 'آرڈرز کی تعداد' : 'Order Volume'}</span>
            </div>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeSalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `₨ ${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'sales' ? formatPrice(value, currency, settings?.usdRate) : value,
                  name === 'sales' ? 'Revenue' : 'Orders Count',
                ]}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Top Selling Products Bar Chart & Category Share Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('topSellingProducts')}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'سب سے زیادہ فروخت ہونے والی اشیاء کا موازنہ' : 'Unit sales leaderboard comparison'}
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData.length > 0 ? topProductsData : [{ name: 'No Sales Yet', units: 0 }]} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} width={90} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Units Sold`, 'Sales Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="units" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('salesByCategory')}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'اقسام کے لحاظ سے فیصد حصہ' : 'Revenue percentage split by department'}
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution.length > 0 ? categoryDistribution : [{ name: 'EMPTY', value: 100, color: '#e2e8f0' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}% Share`, 'Category Contribution']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Live Order Status Distribution & Inventory Stock Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('orderStatusBreakdown')}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'آرڈرز کی تکمیل کا تناسب' : 'Fulfillment stage pipeline status'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Inventory Stock Bar Graph */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('stockStatus')}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'سٹور میں موجود سامان کی تعداد' : 'Live stock inventory units in warehouse'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val} Units in Stock`, 'Inventory']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="stock" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
