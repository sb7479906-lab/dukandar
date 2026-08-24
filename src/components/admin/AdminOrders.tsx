import React, { useState } from 'react';
import {
  Search,
  Eye,
  Printer,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../utils/formatters';

const statusOptions: Array<{ value: OrderStatus; labelEn: string; labelUr: string; color: string }> = [
  { value: 'pending', labelEn: 'Pending', labelUr: 'زیر التواء', color: 'bg-amber-100 text-amber-800' },
  { value: 'processing', labelEn: 'Processing', labelUr: 'پیکنگ جاری', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', labelEn: 'Shipped', labelUr: 'کورئیر روانہ', color: 'bg-blue-100 text-blue-800' },
  { value: 'out_for_delivery', labelEn: 'Out for Delivery', labelUr: 'ڈلیوری کیلئے تیار', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', labelEn: 'Delivered', labelUr: 'پہنچ گیا', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'cancelled', labelEn: 'Cancelled', labelUr: 'منسوخ شدہ', color: 'bg-rose-100 text-rose-800' },
];

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, currency, language, t, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const customerName = o.customerName || o.customer?.name || '';
    const customerPhone = o.customerPhone || o.customer?.phone || '';
    const orderNum = o.orderNumber || o.id || '';

    const matchesSearch =
      orderNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('adminOrders')} ({orders.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur' ? 'آرڈرز کی تفتیش، سٹیٹس کی تبدیلی اور ترسیل کا کنٹرول' : 'Review orders, manage fulfillment statuses, and courier dispatch logs'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchOrder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {language === 'ur' ? 'تمام' : 'All'} ({orders.length})
          </button>
          {statusOptions.map((st) => {
            const count = orders.filter((o) => o.status === st.value).length;
            return (
              <button
                key={st.value}
                onClick={() => setFilterStatus(st.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filterStatus === st.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {language === 'ur' ? st.labelUr : st.labelEn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">{t('customer')}</th>
                <th className="p-3.5">{t('date')}</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">{t('amount')}</th>
                <th className="p-3.5">{t('status')} (Live Update)</th>
                <th className="p-3.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 font-bold">
                    {language === 'ur' ? 'کوئی آرڈر نہیں ملا' : 'No matching orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const custName = order.customerName || order.customer?.name || 'Guest';
                  const custPhone = order.customerPhone || order.customer?.phone || 'N/A';
                  const custCity = order.customerCity || order.customer?.city || 'Pakistan';
                  const totalAmt = order.totalAmount || order.total || 0;
                  const totalItemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {order.orderNumber || `#${order.id.substring(0, 8)}`}
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{custName}</div>
                        <div className="text-[10px] text-slate-400">
                          {custPhone} • {custCity}
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-500">{formatDate(order.createdAt || Date.now())}</td>

                      <td className="p-3.5 font-semibold text-slate-700">
                        {totalItemsCount} items
                      </td>

                      <td className="p-3.5 font-black text-slate-900">
                        {formatPrice(totalAmt, currency, settings?.usdRate)}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                        >
                          {statusOptions.map((st) => (
                            <option key={st.value} value={st.value}>
                              {language === 'ur' ? st.labelUr : st.labelEn}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Order {selectedOrder.orderNumber || `#${selectedOrder.id.substring(0, 8)}`}
                  </h3>
                  <p className="text-xs text-slate-400">Placed on {formatDate(selectedOrder.createdAt || Date.now())}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  title="Print Invoice"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Customer Information
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p className="font-bold text-slate-900">{selectedOrder.customerName || selectedOrder.customer?.name || 'Guest'}</p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedOrder.customerPhone || selectedOrder.customer?.phone || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedOrder.customerEmail || selectedOrder.customer?.email || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Shipping & Payment
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress || selectedOrder.customer?.address || 'Standard Delivery'}, {selectedOrder.customerCity || selectedOrder.customer?.city || 'Pakistan'}
                    </span>
                  </p>
                  <p className="pt-1">
                    <span className="font-bold text-slate-800">Method: </span>
                    <span className="uppercase font-semibold">{selectedOrder.paymentMethod || 'COD'}</span> (
                    {selectedOrder.paymentStatus || 'Pending'})
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Purchased Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-3 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                          #
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{item.product?.title || 'Product'}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-black text-slate-900">
                      {formatPrice((item.product?.price || 0) * item.quantity, currency, settings?.usdRate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedOrder.subtotal || selectedOrder.totalAmount || selectedOrder.total || 0, currency, settings?.usdRate)}</span>
              </div>
              {(selectedOrder.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatPrice(selectedOrder.discount || 0, currency, settings?.usdRate)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span>{formatPrice(selectedOrder.deliveryCharges || 0, currency, settings?.usdRate)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700">
                  {formatPrice(selectedOrder.totalAmount || selectedOrder.total || 0, currency, settings?.usdRate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
