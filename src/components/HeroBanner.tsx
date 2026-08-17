import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const banners = [
  {
    id: 1,
    titleEn: 'Next-Gen Audio & Premium Gadgets',
    titleUr: 'پریمیم الیکٹرانکس اور گیجٹس پر خصوصی رعایت',
    subtitleEn: 'Get up to 30% discount on original Sony headphones, Apple watches, and top electronics with official warranty.',
    subtitleUr: 'اصلی سونی ہیڈ فونز، سمارٹ واچز اور بہترین الیکٹرانکس اب خصوصی رعایت اور وارنٹی کے ساتھ دستیاب۔',
    badgeEn: '⚡ Super Deals • Up to 30% OFF',
    badgeUr: '⚡ زبردست رعایت • 30 فیصد تک چھوٹ',
    coupon: 'WELCOME10',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    ctaCategory: 'electronics',
    gradient: 'from-slate-900/90 via-slate-900/70 to-transparent',
  },
  {
    id: 2,
    titleEn: 'Pure Cotton Eastern & Festive Collection',
    titleUr: 'خالص کاٹن اور فینسی کڑھائی دار ملبوسات',
    subtitleEn: 'Hand-stitched luxury cotton kurtas, unstitched fabrics, and traditional footwear crafted for modern elegance.',
    subtitleUr: 'اعلیٰ کوالٹی کے سوتی کرتے اور دیدہ زیب روایتی ڈیزائنز مناسب قیمت پر پاکستان بھر میں دستیاب۔',
    badgeEn: '🌟 New Festive Season Collection',
    badgeUr: '🌟 نیا سیزن کلیکشن • شاندار معیار',
    coupon: 'AZADI25',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80',
    ctaCategory: 'fashion',
    gradient: 'from-emerald-950/90 via-emerald-950/70 to-transparent',
  },
  {
    id: 3,
    titleEn: 'Performance Footwear & Athletic Sneakers',
    titleUr: 'پروفیشنل ایتھلیٹک رننگ شوز اور سنیکرز',
    subtitleEn: 'Engineered for comfort, endurance and style. Dual-cushion sole technology with all-weather durability.',
    subtitleUr: 'ورزش، دوڑ اور روزمرہ استعمال کے لیے آرام دہ اور پائیدار جوتے۔',
    badgeEn: '🔥 Top Trending • Best Sellers',
    badgeUr: '🔥 سب سے زیادہ پسندیدہ • لمیٹڈ سٹاک',
    coupon: 'SUPER50',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
    ctaCategory: 'footwear',
    gradient: 'from-amber-950/90 via-amber-950/70 to-transparent',
  },
];

export const HeroBanner: React.FC = () => {
  const { language, t, setSelectedCategory, setIsSupportOpen } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = banners[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      {/* Banner Carousel Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 min-h-[360px] sm:min-h-[440px] flex items-center">
        
        {/* Background Slide Image with Transitions */}
        <div className="absolute inset-0">
          {banners.map((b, idx) => (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={b.image}
                alt={b.titleEn}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient}`}></div>
            </div>
          ))}
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-2xl p-6 sm:p-12 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
            <span>{language === 'ur' ? slide.badgeUr : slide.badgeEn}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4 drop-shadow-md">
            {language === 'ur' ? slide.titleUr : slide.titleEn}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm">
            {language === 'ur' ? slide.subtitleUr : slide.subtitleEn}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                setSelectedCategory(slide.ctaCategory);
                const el = document.getElementById('products-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:gap-3 transition-all cursor-pointer text-sm sm:text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t('shopNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSupportOpen(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-5 py-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>{language === 'ur' ? 'واٹس ایپ آرڈر' : 'WhatsApp Order'}</span>
            </button>
          </div>

          {/* Coupon Code Pill */}
          <div className="mt-6 inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ur' ? 'کوپن کوڈ استعمال کریں:' : 'Use Promo Code:'}</span>
            <code className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded">
              {slide.coupon}
            </code>
          </div>
        </div>

        {/* Slide Indicators & Navigation Arrows */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors hidden sm:flex cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors hidden sm:flex cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Feature Guarantee Badges Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              {language === 'ur' ? 'فری ہوم ڈلیوری' : 'Free Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'ur' ? '4000 روپے سے زائد پر' : 'On orders over ₨ 4,000'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              {language === 'ur' ? '100% اصلی سامان' : '100% Genuine'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'ur' ? 'وارنٹی کے ساتھ' : 'Direct from brand stores'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              {language === 'ur' ? 'کیش آن ڈلیوری' : 'Cash on Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'ur' ? 'پارسل وصولی پر رقم دیں' : 'Pay at your doorstep'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              {language === 'ur' ? '7 دن میں واپسی' : '7 Days Return'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'ur' ? 'آسان ریپلیسمنٹ پالیسی' : 'No hassle refund policy'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
