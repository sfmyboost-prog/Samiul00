
import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  CreditCard,
  ChevronRight,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronDown
} from '../../components/common/Icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  ComposedChart,
  Line
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

const Dashboard: React.FC = () => {
  const { orders, customers, products, formatPrice } = useStore();

  // Live Data Calculations
  const totalEarnings = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const myBalance = totalEarnings * 0.85; // Simulated balance logic

  // Mock data for trends/history (since we don't have historical DB yet)
  const revenueData = [
    { name: 'Jan', revenue: 4000, order: 2400 },
    { name: 'Feb', revenue: 3000, order: 1398 },
    { name: 'Mar', revenue: 6000, order: 4800 },
    { name: 'Apr', revenue: 5500, order: 3908 },
    { name: 'May', revenue: 3500, order: 2800 },
    { name: 'Jun', revenue: 11000, order: 6800 },
    { name: 'Jul', revenue: 9500, order: 4800 },
    { name: 'Aug', revenue: 4500, order: 3000 },
    { name: 'Sep', revenue: 8500, order: 4200 },
    { name: 'Oct', revenue: 9000, order: 3800 },
    { name: 'Nov', revenue: 6000, order: 5500 },
    { name: 'Dec', revenue: 12000, order: 4500 },
  ];

  const promotionalData = [
    { name: 'Social Media', value: 3432 },
    { name: 'Website', value: 1200 },
    { name: 'Store', value: 800 },
  ];
  const PROM_COLORS = ['#fb923c', '#3b82f6', '#a855f7'];

  const miniChartData = [
    { value: 40 }, { value: 30 }, { value: 65 }, { value: 45 }, { value: 90 }, { value: 70 }, { value: 85 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-purple-50 text-purple-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      case 'Processing': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Earnings', value: formatPrice(totalEarnings), trend: '1.56%', color: '#22c55e', bg: 'bg-green-500', time: 'Weekly' },
          { label: 'Total Orders', value: totalOrdersCount.toLocaleString(), trend: '1.56%', color: '#f97316', bg: 'bg-orange-500', time: 'Monthly' },
          { label: 'Customers', value: totalCustomersCount.toLocaleString(), trend: '1.56%', color: '#a855f7', bg: 'bg-purple-500', time: 'Yearly' },
          { label: 'My Balance', value: formatPrice(myBalance), trend: '1.56%', color: '#3b82f6', bg: 'bg-blue-500', time: 'Yearly' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {i === 0 && <TrendingUp size={20} />}
                  {i === 1 && <ShoppingCart size={20} />}
                  {i === 2 && <Users size={20} />}
                  {i === 3 && <CreditCard size={20} />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-500">{stat.trend}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 cursor-pointer">
                {stat.time} <ChevronDown size={10} />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">{stat.value}</h3>
            
            <div className="h-16 w-full mt-4 -mx-5 -mb-5 opacity-60 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={stat.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={stat.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={stat.color} strokeWidth={2} fill={`url(#grad-${i})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Revenue & Promotional & Top Sale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Analysis */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-gray-800">Revenue</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 cursor-pointer border border-gray-100">
              Yearly <ChevronDown size={12} />
            </div>
          </div>

          <div className="flex gap-10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-800 tracking-tight">$37,802</span>
                <div className="flex items-center gap-0.5 text-green-500">
                  <TrendingUp size={10} />
                  <span className="text-[10px] font-bold">0.56%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-800 tracking-tight">$28,305</span>
                <div className="flex items-center gap-0.5 text-green-500">
                  <TrendingUp size={10} />
                  <span className="text-[10px] font-bold">0.56%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 600}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="order" stroke="#818cf8" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Promotional Sales */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-gray-800">Promotional Sales</h3>
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 cursor-pointer border border-gray-100">
              Weekly <ChevronDown size={10} />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visitors</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-800 tracking-tight">7,802</span>
              <div className="flex items-center gap-0.5 text-green-500">
                <TrendingUp size={10} />
                <span className="text-[10px] font-bold">0.56%</span>
              </div>
            </div>
          </div>

          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={promotionalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {promotionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PROM_COLORS[index % PROM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mb-1"></div>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-tighter">Social Media</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-gray-800">3,432</span>
                <div className="flex items-center text-orange-500">
                  <TrendingUp size={8} />
                  <span className="text-[8px] font-bold">5.6%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {promotionalData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: PROM_COLORS[i] }}></div>
                <span className="text-[10px] font-bold text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sale List */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-800">Top sale</h3>
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 cursor-pointer">
              Weekly <ChevronDown size={10} />
            </div>
          </div>

          <div className="space-y-5">
            {products.slice(0, 6).map((product, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img src={product.image} className="w-10 h-10 rounded-lg object-cover border" />
                  <div>
                    <p className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#f85606] transition-colors">{product.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold">${product.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-800">{Math.floor(Math.random() * 900 + 100)} Sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & User Location */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-black text-gray-800 mb-6">Recent orders</h3>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={order.items[0]?.image || `https://picsum.photos/seed/${idx}/50/50`} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs font-bold text-gray-800 line-clamp-1">{order.items[0]?.name || "Product Name"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{order.customerName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-400">{order.id.split('-')[1] || "1452"}</td>
                    <td className="px-6 py-4 text-xs font-black text-gray-400">X1</td>
                    <td className="px-6 py-4 text-xs font-black text-gray-800">${order.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing 1-5 of {orders.length}</p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100"><ChevronLeft size={14} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold bg-gray-50 text-gray-500">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold bg-orange-500 text-white shadow-lg shadow-orange-500/20">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold bg-gray-50 text-gray-500">3</button>
              <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* User Location */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-6">User Location</h3>
          
          <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 relative aspect-[4/3] flex items-center justify-center">
            {/* US Map Placeholder Illustration via SVG */}
            <svg viewBox="0 0 1000 600" className="w-full h-full opacity-80" fill="#d1d5db">
              <path d="M100 100 L900 100 L900 500 L100 500 Z" fill="transparent" />
              {/* Highlighted states mockup */}
              <circle cx="200" cy="300" r="100" fill="#fb923c" opacity="0.8" />
              <circle cx="400" cy="450" r="80" fill="#fb923c" opacity="0.8" />
              <circle cx="800" cy="200" r="120" fill="#fb923c" opacity="0.8" />
              <text x="50%" y="50%" textAnchor="middle" className="text-[100px] font-black" fill="#9ca3af" opacity="0.1">USA MAP</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-y-4">
            {[
              { name: 'California', val: '40%' },
              { name: 'Arizona', val: '15%' },
              { name: 'Texas', val: '10%' },
              { name: 'Georgia', val: '3.5%' },
              { name: 'North Carolina', val: '2%' },
              { name: 'Florida', val: '1.5%' },
            ].map((loc, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <p className="text-[11px] font-bold text-gray-500">{loc.name} <span className="font-black text-gray-800 ml-1">{loc.val}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
