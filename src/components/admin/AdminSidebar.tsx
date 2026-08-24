import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';

export const AdminSidebar: React.FC = () => {
  const { adminTab, setAdminTab, t, orders = [], products = [] } = useStore();

  const navItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'dashboard',
      label: t('adminDashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: t('adminAnalytics'),
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'products',
      label: t('adminProducts'),
      icon: <Package className="w-5 h-5" />,
      badge: products.length,
    },
    {
      id: 'orders',
      label: t('adminOrders'),
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: orders.length,
    },
    {
      id: 'customers',
      label: t('adminCustomers'),
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'coupons',
      label: t('adminCoupons'),
      icon: <Tag className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t('adminSettings'),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-3 sm:p-4 border-r border-slate-800 shrink-0">
      <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {navItems.map((item) => {
          const isActive = adminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id)}
              className={`flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
