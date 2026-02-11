
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { User, Smartphone, Tv, Laptop, Shirt, Home as HomeIcon, Baby, Car, Watch } from '../../components/common/Icons';

const MobileCategories: React.FC = () => {
  const { categories } = useStore();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  const activeCatObj = categories.find(c => c.id === activeCategory);

  // Mock icons for the sidebar since standard icons vary
  const sideIcons: Record<string, any> = {
    'Groceries': HomeIcon,
    'Electronics': Smartphone,
    'Fashion': Shirt,
    'Home & Living': Tv,
    'Health & Beauty': User,
    'Automotive': Car,
    'Toys & Kids': Baby,
    'Sports & Outdoors': Watch,
  };

  return (
    <div className="lg:hidden flex h-[calc(100vh-170px)] bg-[#f4f4f7] overflow-hidden -mx-4">
      {/* Sidebar */}
      <div className="w-24 flex-shrink-0 bg-white border-r overflow-y-auto custom-scrollbar">
        <div className="flex flex-col">
          {categories.map((cat) => {
            const IconComp = sideIcons[cat.name] || Smartphone;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center py-6 px-1 transition-all ${
                  isActive 
                  ? 'bg-[#f4f4f7] text-[#f85606] relative after:content-[""] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-[#f85606]' 
                  : 'text-gray-500'
                }`}
              >
                <div className={`${isActive ? 'scale-110' : ''} transition-transform mb-1`}>
                  <IconComp size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-bold text-center leading-tight transition-colors ${isActive ? 'text-[#f85606]' : 'text-gray-400'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategory Content Area */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-white">
        <div className="mb-6">
          <div className="h-24 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100 mb-6 overflow-hidden relative">
            {/* Fixed: use thumbnail instead of image to match Category interface */}
            <img src={activeCatObj?.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="banner" />
            <h3 className="relative z-10 font-black text-[#f85606] uppercase tracking-widest text-xs italic">{activeCatObj?.name} Mall</h3>
          </div>

          <div className="grid grid-cols-3 gap-y-8 gap-x-2">
            {activeCatObj?.subcategories?.map((sub, idx) => (
              <Link 
                key={idx} 
                to={`/category/${activeCatObj.slug}?sub=${encodeURIComponent(sub)}`}
                className="flex flex-col items-center group active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-2 overflow-hidden shadow-sm">
                   <img 
                    src={`https://picsum.photos/seed/${sub}/150/150`} 
                    alt={sub} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2">
                  {sub}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCategories;
