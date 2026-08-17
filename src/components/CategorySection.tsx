import React from 'react';
import {
  Smartphone,
  Shirt,
  Footprints,
  Home,
  Sparkles,
  Watch,
  Layers,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Footprints: <Footprints className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Watch: <Watch className="w-5 h-5" />,
};

export const CategorySection: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, language, t, products } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('categories')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'اپنی من پسند کیٹیگری منتخب کریں' : 'Browse items by departmental collections'}
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
          >
            {language === 'ur' ? 'تمام کیٹیگریز دکھائیں' : 'Show All Categories'}
          </button>
        )}
      </div>

      {/* Categories Horizontal Carousel / Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
        {/* 'All' Category Card */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-700'
            }`}
          >
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold truncate max-w-[85px]">
            {t('allCategories')}
          </span>
          <span
            className={`text-[10px] mt-0.5 ${
              selectedCategory === 'all' ? 'text-emerald-100' : 'text-slate-400'
            }`}
          >
            {products.length} {t('items')}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                }`}
              >
                {iconMap[cat.icon] || <Layers className="w-5 h-5" />}
              </div>
              <span className="text-xs font-bold truncate max-w-[85px]">
                {language === 'ur' ? cat.nameUrdu : cat.name}
              </span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isSelected ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {count} {t('items')}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
