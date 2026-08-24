import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Package, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications = [],
    markNotificationAsRead,
    markAllNotificationsAsRead,
    language,
  } = useStore();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-slate-900">
              {language === 'ur' ? 'اطلاعات و نوٹیفیکیشنز' : 'Notifications'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'سب پڑھیں' : 'Mark all read'}</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-10 h-10 mb-2 text-slate-300" />
              <p className="text-xs font-semibold">
                {language === 'ur' ? 'کوئی نئی اطلاع موجود نہیں۔' : 'No notifications right now.'}
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`py-3 px-2 flex items-start gap-3 rounded-xl transition-colors cursor-pointer ${
                  n.read ? 'opacity-70 hover:bg-slate-50' : 'bg-emerald-50/40 hover:bg-emerald-50/80 font-medium'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {language === 'ur' ? (n.titleUrdu || n.title) : n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {language === 'ur' ? (n.messageUrdu || n.message) : n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
