import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Send,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const initialFaqs = [
  {
    qEn: 'How long does delivery take across Pakistan?',
    qUr: 'پاکستان بھر میں ڈلیوری کا کتنا وقت لگتا ہے؟',
    aEn: 'Standard delivery takes 2-4 working days (Lahore, Karachi, Islamabad often take 1-2 days). Express delivery takes 24 hours.',
    aUr: 'معیاری ڈلیوری 2 سے 4 دن میں ہوتی ہے۔ لاہور، کراچی اور اسلام آباد میں اکثر 1 سے 2 دن میں پارسل پہنچ جاتا ہے۔ ایکسپریس 24 گھنٹے میں کی جاتی ہے۔',
  },
  {
    qEn: 'Can I pay via Cash on Delivery (COD)?',
    qUr: 'کیا کیش آن ڈلیوری (COD) کی سہولت موجود ہے؟',
    aEn: 'Yes, 100% Cash on Delivery is available in all cities and towns of Pakistan without extra fee.',
    aUr: 'جی ہاں، پاکستان کے تمام چھوٹے بڑے شہروں اور دیہاتوں میں کیش آن ڈلیوری کی مکمل سہولت موجود ہے۔',
  },
  {
    qEn: 'What is your return and refund policy?',
    qUr: 'سامان کی واپسی اور تبدیلی کا کیا طریقہ ہے؟',
    aEn: 'We offer a 7-day no questions asked replacement and refund guarantee for any damaged or unsatisfactory items.',
    aUr: 'اگر سامان میں کوئی خرابی ہو یا پسند نہ آئے تو 7 دن کے اندر باآسانی ریپلیس یا رقم واپس کی جاتی ہے۔',
  },
];

export const CustomerSupportModal: React.FC = () => {
  const {
    isSupportOpen,
    setIsSupportOpen,
    language,
    t,
    settings,
  } = useStore();

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text:
        language === 'ur'
          ? 'السلام علیکم! دکان دار کسٹمر سپورٹ میں خوش آمدید۔ میں آپ کی کیا مدد کر سکتا ہوں؟'
          : 'Salam & Hello! Welcome to Dukandar Support. How can we assist you with your orders or products today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isSupportOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let botReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('order') || lower.includes('آرڈر') || lower.includes('track') || lower.includes('ٹریک')) {
        botReply =
          language === 'ur'
            ? 'آپ اوپر موجود "Track Order" بٹن سے اپنا آرڈر نمبر لکھ کر لائیو ٹریک کر سکتے ہیں۔'
            : 'You can track your order status live anytime using our "Track Order" tool by typing your order number (e.g. DKN-98421).';
      } else if (lower.includes('delivery') || lower.includes('ڈلیوری') || lower.includes('time')) {
        botReply =
          language === 'ur'
            ? 'ہماری معیاری ڈلیوری 2 سے 4 دن میں اور ایکسپریس 24 گھنٹے میں پہنچتی ہے۔'
            : 'Standard delivery takes 2-4 working days across Pakistan, with free delivery on orders over Rs. 4,000!';
      } else if (lower.includes('payment') || lower.includes('cod') || lower.includes('پیسے')) {
        botReply =
          language === 'ur'
            ? 'ہم کیش آن ڈلیوری، کریڈٹ کارڈ، ایزی پیسہ اور جاز کیش سپورٹ کرتے ہیں۔'
            : 'We accept Cash on Delivery, Credit/Debit Cards, EasyPaisa, and JazzCash.';
      } else {
        botReply =
          language === 'ur'
            ? 'شکریہ! ہمارے نمائندے سے فوری بات چیت کے لیے نیچے دیے گئے واٹس ایپ بٹن پر کلک کریں۔'
            : 'Thank you! For instant live agent assistance or immediate order changes, please tap the WhatsApp chat button below.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const handleDirectWhatsApp = () => {
    const message = encodeURIComponent(
      'Salam! I need assistance regarding my shopping / order on Dukandar store.'
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {language === 'ur' ? 'کسٹمر کیئر اور لائیو سپورٹ' : 'Customer Care & Live Support'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ur' ? '24/7 واٹس ایپ اور آرڈر رہنمائی' : '24/7 assistance, FAQs and WhatsApp helpdesk'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Contact Action Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDirectWhatsApp}
              className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center gap-3 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">
                  {language === 'ur' ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp'}
                </h4>
                <p className="text-[11px] text-emerald-100 font-mono">+{settings.whatsappNumber}</p>
              </div>
            </button>

            <a
              href={`tel:${settings.phone}`}
              className="p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center gap-3 shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">
                  {language === 'ur' ? 'ہیلپ لائن کال کریں' : 'Call Store Helpline'}
                </h4>
                <p className="text-[11px] text-slate-300 font-mono">{settings.phone}</p>
              </div>
            </a>
          </div>

          {/* Interactive Chat Assistant */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ur' ? 'سمارٹ ہیلپ اسسٹنٹ' : 'Instant AI Help Assistant'}</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  language === 'ur'
                    ? 'کوئی بھی سوال پوچھیں...'
                    : 'Ask about orders, delivery, returns...'
                }
                className="flex-1 text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ur' ? 'اکثر پوچھے جانے والے سوالات' : 'Frequently Asked Questions'}</span>
            </h3>

            <div className="space-y-2">
              {initialFaqs.map((faq, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                  <h4 className="font-bold text-slate-900">
                    {language === 'ur' ? faq.qUr : faq.qEn}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {language === 'ur' ? faq.aUr : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
