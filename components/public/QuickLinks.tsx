
import React from 'react';
import { useNavigate } from 'react-router-dom';

const links = [
  { name: 'Earn Coins', icon: '💰', bg: 'bg-yellow-50', path: '/coins' },
  { name: 'Free Delivery', icon: '🚚', bg: 'bg-green-50' },
  { name: 'Freebie', icon: '🎁', bg: 'bg-orange-50' },
  { name: 'Mall', icon: '🏢', bg: 'bg-blue-50' },
  { name: 'Fashion', icon: '👗', bg: 'bg-pink-50' },
  { name: 'Sale', icon: '🔥', bg: 'bg-red-50' },
  { name: 'Save More', icon: '💵', bg: 'bg-emerald-50' },
  { name: 'Beauty', icon: '💄', bg: 'bg-purple-50' },
  { name: 'Low Price', icon: '🏷️', bg: 'bg-sky-50' },
  { name: 'New Arrivals', icon: '🆕', bg: 'bg-indigo-50' },
];

const QuickLinks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden grid grid-cols-5 gap-y-8 gap-x-2 py-8 px-2 bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
      {links.map((link, i) => (
        <div 
          key={i} 
          onClick={() => link.path && navigate(link.path)}
          className="flex flex-col items-center group cursor-pointer active:scale-90 transition-transform"
        >
          <div className={`w-14 h-14 rounded-2xl ${link.bg} flex items-center justify-center text-3xl shadow-sm border border-white mb-2 overflow-hidden`}>
            {link.icon}
          </div>
          <span className="text-[9px] font-black text-gray-500 text-center leading-tight uppercase tracking-tight">
            {link.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default QuickLinks;
