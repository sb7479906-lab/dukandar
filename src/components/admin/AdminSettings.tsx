import React, { useState } from 'react';
import { Save, CheckCircle2, MessageCircle, Truck, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, language, t } = useStore();

  const [storeName, setStoreName] = useState(settings?.storeName || 'Dukandar Store');
  const [storeNameUrdu, setStoreNameUrdu] = useState(settings?.storeNameUrdu || 'دکان دار سٹور');
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || '923001234567');
  const [phone, setPhone] = useState(settings?.phone || '0300-1234567');
  const [email, setEmail] = useState(settings?.email || 'support@dukandar.pk');
  const [standardDeliveryFee, setStandardDeliveryFee] = useState(settings?.standardDeliveryFee || 200);
  const [expressDeliveryFee, setExpressDeliveryFee] = useState(settings?.expressDeliveryFee || 450);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(settings?.freeDeliveryThreshold || 3000);
  const [announcementEn, setAnnouncementEn] = useState(settings?.announcementEn || 'Free Express Shipping Across Pakistan on Orders Above Rs. 3,000!');
  const [announcementUr, setAnnouncementUr] = useState(settings?.announcementUr || 'تمام آرڈرز پر 3,000 روپے سے زائد پر مفت ڈلیوری دستیاب ہے!');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      storeName,
      storeNameUrdu,
      whatsappNumber,
      phone,
      email,
      standardDeliveryFee: Number(standardDeliveryFee),
      expressDeliveryFee: Number(expressDeliveryFee),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      announcementEn,
      announcementUr,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminSettings')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'سٹور کی جنرل کنفیگریشن، ڈلیوری فیس اور واٹس ایپ نمبر' : 'Configure delivery rates, WhatsApp helpdesk number, and store branding'}
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{language === 'ur' ? 'ترتیبات کامیابی سے محفوظ کر لی گئی ہیں!' : 'Settings updated and saved successfully!'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Identity */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Store Identity & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Name (English)</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">سٹور کا نام (Urdu)</label>
              <input
                type="text"
                value={storeNameUrdu}
                onChange={(e) => setStoreNameUrdu(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp Channel */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Customer Contact & Direct WhatsApp Ordering</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                WhatsApp Order Number (with 92)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="923001234567"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Delivery Charges & Free Shipping Threshold */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Delivery & Courier Logistics Rates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Standard Delivery Charges (PKR)
              </label>
              <input
                type="number"
                value={standardDeliveryFee}
                onChange={(e) => setStandardDeliveryFee(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Express (24h) Delivery Fee (PKR)
              </label>
              <input
                type="number"
                value={expressDeliveryFee}
                onChange={(e) => setExpressDeliveryFee(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Free Delivery Threshold (PKR)
              </label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Announcement Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Top Announcement Bar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Announcement (English)</label>
              <input
                type="text"
                value={announcementEn}
                onChange={(e) => setAnnouncementEn(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">اعلان (اردو میں)</label>
              <input
                type="text"
                value={announcementUr}
                onChange={(e) => setAnnouncementUr(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer text-sm sm:text-base"
        >
          <Save className="w-5 h-5" />
          <span>{t('save')} Settings</span>
        </button>
      </form>
    </div>
  );
};
