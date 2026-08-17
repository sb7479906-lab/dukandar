import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Send,
  User,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, generateWhatsAppProductInquiryUrl } from '../utils/formatters';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    language,
    currency,
    t,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addProductReview,
    setIsCartOpen,
    setIsCheckoutOpen,
    settings,
  } = useStore();

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isFavorite = isInWishlist(product.id);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setActiveProductModal(null);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setActiveProductModal(null);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppProductInquiryUrl(settings.whatsappNumber, product);
    window.open(url, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    addProductReview(product.id, {
      author: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
    });

    setReviewSubmitted(true);
    setReviewerName('');
    setReviewerComment('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              {/* Main Image */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80 mb-4 relative shadow-inner">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />

                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                    -{product.discountPercent}% {t('off')}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guarantees Box */}
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ur' ? 'ملک گیر ڈلیوری' : 'Fast Delivery'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{language === 'ur' ? '100% اصلی وارنٹی' : 'Original Warranty'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>{language === 'ur' ? 'آسان واپسی' : 'Easy Returns'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {language === 'ur' ? product.categoryUrdu : product.category}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                    <span className="text-xs text-slate-400">({product.reviewCount})</span>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-slate-200 text-slate-500 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {language === 'ur' ? product.titleUrdu : product.title}
              </h2>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatPrice(product.price, currency, settings.usdRate)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPrice, currency, settings.usdRate)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {t('save')}{' '}
                    {formatPrice(product.originalPrice - product.price, currency, settings.usdRate)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'ur' ? product.descriptionUrdu : product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-2 block">
                    {t('selectColor')}: <span className="text-slate-500 font-normal">{selectedColor?.name}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                          selectedColor?.name === c.name
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-2 block">
                    {t('selectSize')}
                  </label>
                  <div className="flex items-center gap-2">
                    {product.sizes.map((sz, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[44px] py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Stock Info */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800">{t('quantity')}:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 font-bold text-sm text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold text-emerald-600">
                  {product.stock > 0 ? (
                    <span>
                      {t('inStock')} ({product.stock} {language === 'ur' ? 'دستیاب' : 'units'})
                    </span>
                  ) : (
                    <span className="text-rose-600">{t('outOfStock')}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('quickAdd')}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('buyNow')}</span>
                  </button>
                </div>

                {/* Direct WhatsApp Instant Buy Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t('orderViaWhatsApp')}</span>
                </button>
              </div>

              {/* Specifications Table */}
              {product.specs && product.specs.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {t('productSpecs')}
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-200/80 text-xs">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="py-1.5 flex justify-between">
                        <span className="text-slate-500 font-medium">
                          {language === 'ur' ? spec.labelUrdu : spec.label}
                        </span>
                        <span className="text-slate-900 font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  {t('customerReviews')} ({product.reviews?.length || 0})
                </h4>

                {/* Reviews List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{rev.author}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded">
                                {language === 'ur' ? 'تصدیق شدہ خریدار' : 'Verified Buyer'}
                              </span>
                            )}
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-amber-400' : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600">{rev.comment}</p>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-2">
                      {language === 'ur' ? 'ابھی تک کوئی تبصرہ نہیں۔ آپ پہلے خریدار بنیں!' : 'No reviews yet. Be the first to leave a review!'}
                    </p>
                  )}
                </div>

                {/* Submit New Review Form */}
                <form onSubmit={handleSubmitReview} className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800">{t('writeReview')}</h5>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{t('yourRating')}:</span>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewerRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= reviewerRating ? 'fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder={t('yourName')}
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                  />

                  <textarea
                    required
                    rows={2}
                    placeholder={t('yourReview')}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                  />

                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>{t('submitReview')}</span>
                  </button>

                  {reviewSubmitted && (
                    <p className="text-xs font-bold text-emerald-600">{t('thankReview')}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
