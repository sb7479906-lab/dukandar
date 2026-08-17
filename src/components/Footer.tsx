import React, { useState } from 'react';
import {
  Store,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Heart,
  Send,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { language, t, settings, setSelectedCategory, setIsSupportOpen, setIsTrackingOpen, setActiveView } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-slate-950 text-white mt-16 border-t border-slate-800">
      {/* Guarantees Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">{t('freeDeliveryTag')}</h4>
                <p className="text-[11px] text-slate-400">On all orders over Rs. 4,000</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">{t('authenticProducts')}</h4>
                <p className="text-[11px] text-slate-400">100% genuine guaranteed items</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">{t('easyReturns')}</h4>
                <p className="text-[11px] text-slate-400">7 days replacement window</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">{t('support')} 24/7</h4>
                <p className="text-[11px] text-slate-400">Live WhatsApp & helpline care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span>د</span>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {language === 'ur' ? settings.storeNameUrdu : settings.storeName}
                </span>
                <span className="text-emerald-400 text-xs font-semibold block -mt-1">
                  Pakistan's Premium E-Store
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {language === 'ur'
                ? 'دکان دار آپ کے لیے پورے پاکستان سے بہترین اور معیاری مصنوعات لائیو ٹریکنگ، کیش آن ڈلیوری اور 7 دن کی گارنٹی کے ساتھ فراہم کرتا ہے۔'
                : 'Dukandar is Pakistan’s leading modern online marketplace offering fast courier delivery, 100% genuine verified products, Cash on Delivery, and 24/7 customer satisfaction.'}
            </p>

            {/* Direct Contact details */}
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: +{settings.whatsappNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>{settings.email}</span>
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {t('categories')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setSelectedCategory('electronics')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'الیکٹرانکس و گیجٹس' : 'Electronics & Audio'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('fashion')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'فیشن و ملبوسات' : 'Fashion & Clothing'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('footwear')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'جوتے اور سینڈلز' : 'Footwear & Shoes'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('beauty')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'بیوٹی اور سکن کیئر' : 'Beauty & Care'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('lifestyle')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'لائف سٹائل و گھریلو اشیاء' : 'Lifestyle & Home'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {t('customerCare')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('trackOrder')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSupportOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'کسٹمر کیئر ہیلپ لائن' : 'Customer Support & FAQs'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  {language === 'ur' ? 'ایڈمن پورٹل لاگ ان' : 'Admin Portal Login'}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {t('specialOffers')}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'ur'
                ? 'نئی ڈیلز اور واؤچرز کے لیے اپنی ای میل درج کریں:'
                : 'Subscribe to get secret discount codes and seasonal sales alerts.'}
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full text-xs py-2.5 pl-3 pr-9 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-emerald-400 hover:text-white cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-bold">
                  {language === 'ur' ? 'شکریہ! آپ کو رعایت کا کوڈ جلد موصول ہوگا۔' : 'Subscribed! Check your inbox for your 10% coupon.'}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar with Payment Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Dukandar (دکان دار). All rights reserved across Pakistan.</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">Supported Payments:</span>
            <span className="bg-slate-900 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-800 text-slate-300">
              💵 Cash on Delivery
            </span>
            <span className="bg-slate-900 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-800 text-emerald-400">
              📱 EasyPaisa
            </span>
            <span className="bg-slate-900 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-800 text-rose-400">
              ⚡ JazzCash
            </span>
            <span className="bg-slate-900 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-800 text-blue-400">
              💳 Visa / Master
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
