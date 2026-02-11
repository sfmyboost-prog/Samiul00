
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const CategoryGrid: React.FC = () => {
  const { categories } = useStore();
  
  // Logic: Only active categories
  const activeCategories = categories.filter(c => c.status === 'active');
  
  // Distinguished sections
  const popularCategories = activeCategories.filter(c => c.is_popular);

  return (
    <div className="space-y-10 mt-8">
      {/* Popular Categories Highlight Section - Matching screenshot style */}
      {popularCategories.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center">
            <div className="w-1 h-5 bg-[#f85606] rounded-full mr-3"></div>
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider italic">Popular Categories</h2>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-8 overflow-x-auto pb-2 custom-scrollbar">
              {popularCategories.map((category) => (
                <Link 
                  to={`/category/${category.slug}`}
                  key={category.id} 
                  className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm border-2 border-white bg-[#f8f8f8] group-hover:shadow-md transition-all group-hover:scale-105 duration-300 relative">
                    {category.thumbnail ? (
                      <img
                        src={category.thumbnail}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {category.icon}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-[10px] font-black text-gray-500 group-hover:text-[#f85606] transition-colors uppercase tracking-widest text-center leading-tight max-w-[80px]">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore All Categories Section - Matching screenshot grid */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest italic">Explore All Categories</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {activeCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className="bg-white p-5 rounded-xl border border-gray-100 hover:border-orange-500/20 hover:shadow-lg transition-all group flex flex-col items-center justify-center text-center"
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">
                 {category.thumbnail ? (
                   <img src={category.thumbnail} className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100" />
                 ) : category.icon}
              </div>
              <span className="text-[9px] font-black text-gray-400 group-hover:text-gray-800 uppercase tracking-widest transition-colors">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryGrid;
