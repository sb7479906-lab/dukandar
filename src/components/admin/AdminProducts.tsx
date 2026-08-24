import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

const sampleImages = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Running Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cotton Kurta', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Beauty Serum', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80' },
  { label: 'Leather Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80' },
];

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    currency,
    language,
    t,
    settings,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // In-line editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Add Product Form state
  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionUrdu, setDescriptionUrdu] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState<number>(5000);
  const [originalPrice, setOriginalPrice] = useState<number>(6500);
  const [stock, setStock] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState(sampleImages[0].url);
  const [tags, setTags] = useState('New, Trendy, Premium');

  const filteredProducts = products.filter((p) => {
    const titleEn = p.title || '';
    const titleUr = p.titleUrdu || '';
    const matchesSearch =
      titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      titleUr.includes(searchQuery);
    const matchesCat = filterCat === 'all' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (prod: Product) => {
    setEditingId(prod.id);
    setEditPrice(prod.price);
    setEditStock(prod.stock);
  };

  const handleSaveEdit = async (prodId: string) => {
    await updateProduct(prodId, {
      price: Number(editPrice),
      stock: Number(editStock),
    });
    setEditingId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const catObj = categories.find((c) => c.id === category);

    await addProduct({
      title: title.trim(),
      titleUrdu: titleUrdu.trim() || title.trim(),
      description: description.trim() || title.trim(),
      descriptionUrdu: descriptionUrdu.trim() || description.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discountPercent: discount,
      category,
      categoryUrdu: catObj ? catObj.nameUrdu : category,
      stock: Number(stock),
      images: [imageUrl],
      featured: true,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
    // Reset Form
    setTitle('');
    setTitleUrdu('');
    setDescription('');
    setDescriptionUrdu('');
    setPrice(5000);
    setOriginalPrice(6500);
    setStock(20);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminProducts')} ({products.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'مصنوعات کی قیمتیں، سٹاک اور نئے آئٹمز شامل کریں' : 'Manage pricing, warehouse inventory counts, and product catalog'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewProduct')}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="all">{t('allCategories')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {language === 'ur' ? c.nameUrdu : c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">{t('categoryField')}</th>
                <th className="p-3.5">{t('price')}</th>
                <th className="p-3.5">{t('stockField')}</th>
                <th className="p-3.5">Discount</th>
                <th className="p-3.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-bold">
                    {language === 'ur' ? 'کوئی پروڈکٹ نہیں ملی' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isEditing = editingId === prod.id;
                  const isLow = prod.stock > 0 && prod.stock <= 5;
                  const isOut = prod.stock <= 0;
                  const prodImg = prod.images?.[0] || sampleImages[0].url;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 flex items-center gap-3 min-w-[200px]">
                        <img
                          src={prodImg}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {language === 'ur' ? (prod.titleUrdu || prod.title) : prod.title}
                          </div>
                          <div className="text-[10px] text-slate-400">ID: {prod.id.substring(0, 8)}</div>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600 font-medium capitalize">
                        {language === 'ur' ? (prod.categoryUrdu || prod.category) : prod.category}
                      </td>

                      {/* Price with In-place Edit */}
                      <td className="p-3.5">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">₨</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-24 p-1 text-xs font-bold border border-emerald-500 rounded bg-emerald-50"
                            />
                          </div>
                        ) : (
                          <div className="font-extrabold text-slate-900">
                            {formatPrice(prod.price, currency, settings?.usdRate)}
                          </div>
                        )}
                      </td>

                      {/* Stock with In-place Edit */}
                      <td className="p-3.5">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-16 p-1 text-xs font-bold border border-emerald-500 rounded bg-emerald-50"
                          />
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              isOut
                                ? 'bg-rose-100 text-rose-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {(prod.discountPercent || 0) > 0 ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                            -{prod.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(prod.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(prod)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title={t('editProduct')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title={t('deleteProduct')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {t('addNewProduct')}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('productTitle')} (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Wireless Gaming Mouse"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('productTitle')} (اردو میں نام)
                  </label>
                  <input
                    type="text"
                    value={titleUrdu}
                    onChange={(e) => setTitleUrdu(e.target.value)}
                    placeholder="مثلاً وائرلیس گیمنگ ماؤس"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('categoryField')} *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('stockField')} (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('price')} (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('originalPriceField')} (PKR)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('imagesField')} (Image URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-2"
                  />

                  {/* Preset quick image buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold">Quick Presets:</span>
                    {sampleImages.map((s, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(s.url)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg text-slate-700 cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  {t('addNewProduct')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
