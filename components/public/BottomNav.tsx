
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, User, List } from '../common/Icons';
import { useStore } from '../../context/StoreContext';

const BottomNav: React.FC = () => {
  const { pathname } = useLocation();
  const { cart } = useStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Categories', path: '/categories', icon: List },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: true },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-3 px-2 z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {navItems.map((item, i) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={i} 
            to={item.path} 
            className={`flex flex-col items-center relative group ${isActive ? 'text-[#f85606]' : 'text-gray-400'}`}
          >
            <div className={`p-1 rounded-xl transition-all relative ${isActive ? 'bg-orange-50' : 'group-hover:bg-gray-50'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Dynamic Cart Badge (Red Square style from screenshot) */}
              {item.badge && totalItems > 0 && (
                <div className="absolute -top-1 -left-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-sm shadow-sm animate-in zoom-in duration-300">
                  {totalItems}
                </div>
              )}
            </div>
            <span className={`text-[9px] mt-1 font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
