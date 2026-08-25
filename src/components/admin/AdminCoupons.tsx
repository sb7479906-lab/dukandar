import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export const AdminCoupons: React.FC = () => {
  const { coupons, createCoupon, toggleCouponActive, currency, language, t, settings } = useStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [minSpend, setMinSpend] = useState<number>(2000);
  
  // Dynamic default expiry date (30 days ahead from current time)
  const defaultExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [expiryDate, setExpiryDate] = useState(defaultExpiry);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    await createCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      minSpend: Number(minSpend),
      expiryDate,
      isActive: true,
    });

    setIsAddOpen(false);
    setCode('');
    setDiscountPercent(15);
    setMinSpend(2000);
    setExpiryDate(defaultExpiry);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminCoupons')} ({coupons.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'ڈسکاؤنٹ اور پروموشنل کوپنز بنائیں اور انتظام کریں' : 'Create promotional discount codes and manage coupon eligibility'}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createCoupon')}</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <span className="font-mono font-black text-base text-slate-900 tracking-wider">
                  {c.code}
                </span>
              </div>

              <button
                onClick={() => toggleCouponActive(c.id)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  c.isActive
                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
                title={c.isActive ? "Deactivate Coupon" : "Activate Coupon"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between font-bold">
                <span>Discount Rate:</span>
                <span className="text-emerald-700 text-sm">{c.discountPercent}% OFF</span>
              </div>
              <div className="flex justify-between">
                <span>Min Order Spend:</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(c.minSpend, currency, settings?.usdRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expiry Date:</span>
                <span className="text-slate-500">{c.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Times Redeemed:</span>
                <span className="font-bold text-slate-900">{c.timesUsed || 0} times</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className={`w-4 h-4 ${c.isActive ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>{c.isActive ? 'Active Promotion' : 'Disabled'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">{t('createCoupon')}</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. EIDSPECIAL or SAVE20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount Percentage (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Minimum Order Spend (PKR) *
                </label>
                <input
                  type="number"
                  required
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-xl shadow-md cursor-pointer text-xs"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
