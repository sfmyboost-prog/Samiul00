
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronRight } from '../common/Icons';
import { Category } from '../../types';
import { Link } from 'react-router-dom';

const MegaMenu: React.FC = () => {
  const { categories } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const activeCategories = categories.filter(c => c.status === 'active');

  return (
    <div 
      className="relative h-full bg-white border border-r-0 rounded-l-lg shadow-sm z-30 flex flex-col"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="py-2 overflow-y-auto custom-scrollbar flex-grow">
        {activeCategories.map((cat) => (
          <Link
            to={`/category/${cat.slug}`}
            key={cat.id}
            onMouseEnter={() => setActiveCategory(cat)}
            className={`flex items-center justify-between px-5 py-2.5 cursor-pointer transition-colors group ${
              activeCategory?.id === cat.id ? 'bg-orange-50 text-[#f85606]' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-lg leading-none grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
              <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#f85606] transition-colors uppercase tracking-tight">{cat.name}</span>
            </div>
            <ChevronRight size={14} className={activeCategory?.id === cat.id ? 'text-[#f85606]' : 'text-gray-300'} />
          </Link>
        ))}
      </div>

      {/* Fly-out Panel */}
      {activeCategory && activeCategory.subcategories && (
        <div 
          className="absolute top-0 left-full h-full w-[700px] bg-white border shadow-2xl rounded-r-lg p-10 z-40 animate-in fade-in slide-in-from-left-2 duration-200 overflow-y-auto custom-scrollbar"
          onMouseEnter={() => setActiveCategory(activeCategory)}
        >
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-extrabold text-gray-800 mb-8 pb-3 border-b flex items-center gap-4">
              <span className="text-3xl">{activeCategory.icon}</span>
              {activeCategory.name}
            </h3>
            
            <div className="grid grid-cols-3 gap-y-6 gap-x-12">
              {activeCategory.subcategories.map((sub, idx) => (
                <Link 
                  key={idx} 
                  to={`/category/${activeCategory.slug}?sub=${encodeURIComponent(sub)}`}
                  className="text-sm font-semibold text-gray-500 hover:text-[#f85606] transition-colors block"
                >
                  {sub}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <div className="w-full h-36 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100 relative overflow-hidden group">
                <div className="relative z-10 text-center">
                  <p className="text-[#f85606] font-extrabold text-lg italic">UP TO 50% OFF</p>
                  <p className="text-gray-600 text-[11px] uppercase font-bold tracking-widest mt-2">Special deals in {activeCategory.name}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-full bg-orange-100/50 -skew-x-12 translate-x-16 group-hover:translate-x-4 transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
