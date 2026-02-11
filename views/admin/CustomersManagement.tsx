
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Search, Trash2, ShieldAlert, ShieldCheck } from '../../components/common/Icons';
import Toast, { ToastType } from '../../components/common/Toast';

const CustomersManagement: React.FC = () => {
  const { customers, setCustomers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'active' ? 'blocked' : 'active';
        setToast({ message: `Customer ${c.name} is now ${newStatus}`, type: 'success' });
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This cannot be undone.')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      setToast({ message: 'Customer deleted', type: 'success' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Customers Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage registered users.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#f85606]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b">
              <tr>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Orders</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Joined</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatar} className="w-10 h-10 rounded-full border" />
                      <span className="font-bold text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-800 font-medium">{customer.email}</p>
                    <p className="text-xs text-gray-500">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">{customer.ordersCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{customer.dateJoined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => toggleStatus(customer.id)}
                        className={`p-2 rounded transition-colors ${customer.status === 'active' ? 'hover:bg-orange-50 text-orange-600' : 'hover:bg-green-50 text-green-600'}`}
                        title={customer.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        {customer.status === 'active' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersManagement;
