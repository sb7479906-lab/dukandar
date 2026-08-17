import React, { useState } from 'react';
import { Search, Users, Phone, Mail, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export const AdminCustomers: React.FC = () => {
  const { customers, currency, language, t, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminCustomers')} ({customers.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'رجسٹرڈ گاہکوں کے آرڈرز، خرچ اور رابطے کی تفصیلات' : 'Customer buyer profiles, total lifetime spending, and contact directory'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'ur' ? 'کسٹمر کا نام، ای میل یا شہر تلاش کریں...' : 'Search customers by name, phone, city...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customer Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={cust.avatar}
                alt={cust.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{cust.name}</h3>
                <p className="text-[11px] text-slate-400">Joined: {cust.joinedDate}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{cust.phone}</span>
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{cust.email}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {cust.address}, {cust.city}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {t('totalOrders')}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {cust.totalOrders} Orders
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Lifetime Spent
                </span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {formatPrice(cust.totalSpent, currency, settings.usdRate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
