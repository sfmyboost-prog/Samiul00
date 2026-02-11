
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Search, MoreVertical, ChevronRight, Eye, X, MapPin, User, Mail, Phone, Calendar } from '../../components/common/Icons';
import { Order } from '../../types';
import Toast, { ToastType } from '../../components/common/Toast';

const OrdersManagement: React.FC = () => {
  const { orders, setOrders, formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Paid'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setToast({ message: `Order ${orderId} updated to ${status}`, type: 'success' });
  };

  const getStatusStyle = (status: Order['status']) => {
    switch(status) {
      case 'Delivered':
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase italic">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Total {orders.length} orders in system.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50/30 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, Customer, Email or Phone..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/10 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="w-full md:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-sm font-bold uppercase tracking-tight cursor-pointer focus:ring-4 focus:ring-[#f85606]/10"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px] border-b">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer Info</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 font-black text-[#f85606] tracking-tight">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-gray-800">{order.customerName}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.customerEmail}</span>
                      <span className="text-[10px] text-[#f85606] font-black">{order.customerPhone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-800">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase border transition-all cursor-pointer focus:ring-4 focus:ring-black/5 ${getStatusStyle(order.status)}`}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-[#f85606] hover:text-white rounded-xl transition-all text-gray-400 shadow-sm border border-transparent active:scale-95"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f85606] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                   <ShoppingCart size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">Order {selectedOrder.id}</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Details and customer data</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white text-gray-400 hover:text-red-500 rounded-full transition-all border border-transparent hover:border-red-100">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Customer Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User size={16} className="text-[#f85606]" />
                      <span className="font-bold text-gray-800">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-[#f85606]" />
                      <span className="font-medium text-gray-600">{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-[#f85606]" />
                      <span className="font-black text-gray-800 tracking-widest">{selectedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50/30 p-6 rounded-3xl space-y-4 border border-orange-100">
                  <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4">Order Status</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                       <Calendar size={16} className="text-[#f85606]" />
                       <span className="text-sm font-bold text-gray-800">{selectedOrder.date}</span>
                    </div>
                    <div className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(selectedOrder.status)}`}>
                       {selectedOrder.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Shipping Address</h3>
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl text-[#f85606] shadow-sm border border-gray-100 h-fit">
                    <MapPin size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed uppercase tracking-tight italic">
                    {selectedOrder.address || "No address provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Items</h3>
                <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Item</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={item.image} className="w-10 h-10 rounded-lg object-cover border" />
                                <span className="font-bold text-gray-800 line-clamp-1">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-black">{item.quantity}</td>
                            <td className="px-6 py-4 text-right font-bold">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">No item data available for this mock order.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-gray-50/50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL AMOUNT PAID</p>
                <p className="text-3xl font-black text-[#f85606] tracking-tighter italic">{formatPrice(selectedOrder.total)}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-10 py-4 bg-gray-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
