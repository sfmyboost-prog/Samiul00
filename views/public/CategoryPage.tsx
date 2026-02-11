
import React, { useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, Plus, ChevronRight, Filter, List, Package } from '../../components/common/Icons';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { categories, products, addToCart, toggleWishlist, isInWishlist, formatPrice } = useStore();

  const searchParams = new URLSearchParams(location.search);
  const selectedSub = searchParams.get('sub');

  const category = useMemo(() => categories.find(c => c.slug === slug), [categories, slug]);
  const activeCategories = useMemo(() => categories.filter(c => c.status === 'active'), [categories]);
  
  const activeProducts = useMemo(() => {
    return products.filter(p => {
      // Logic: Matches category by name or ID (fallback for mock data)
      const isCorrectCategory = p.category === category?.name || p.category_id === category?.id;
      const isCorrectSub = selectedSub ? p.subcategory === selectedSub : true;
      return p.status === 'active' && isCorrectCategory && isCorrectSub;
    });
  }, [products, category, selectedSub]);

  if (!category || category.status === 'inactive') {
    return (
      <div className="py-32 text-center animate-in fade-in duration-700 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
           <Package size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight italic">Category Unavailable</h2>
        <p className="text-gray-400 mt-2 font-medium tracking-widest text-xs">THE REQUESTED CATEGORY IS CURRENTLY HIDDEN OR DOES NOT EXIST.</p>
        <Link to="/" className="mt-10 px-12 py-4 bg-[#f85606] text-white font-black rounded-xl shadow-xl shadow-orange-500/20 hover:bg-[#d04a05] transition-all transform active:scale-95 uppercase tracking-[0.2em] text-[10px]">Back to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 py-8">
      {/* Category Banner / Header */}
      <div className="mb-10 relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group">
         {category.thumbnail ? (
           <img src={category.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-2000" alt={category.name} />
         ) : (
           <div className="w-full h-full bg-gradient-to-br from-[#f85606] to-[#ffccf9] flex items-center justify-center opacity-80" />
         )}
         <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="text-5xl md:text-7xl mb-4 animate-bounce">{category.icon}</div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic drop-shadow-lg">{category.name}</h1>
            <p className="mt-4 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-80">Discover premium items in {category.name} section</p>
         </div>
      </div>

      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 ml-2">
        <Link to="/" className="hover:text-[#f85606] transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link to={`/category/${category.slug}`} className={`${!selectedSub ? 'text-gray-800' : 'hover:text-[#f85606] transition-colors'}`}>
          {category.name}
        </Link>
        {selectedSub && (
          <>
            <ChevronRight size={10} />
            <span className="text-gray-800">{selectedSub}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
                <List size={20} className="text-[#f85606]" />
                <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest">Browse Categories</h3>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {activeCategories.map(cat => (
                  <Link 
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`flex items-center justify-between text-[11px] px-4 py-3 rounded-xl transition-all font-black uppercase tracking-wider ${
                      category.id === cat.id ? 'bg-orange-50 text-[#f85606] shadow-sm border border-orange-100' : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg grayscale group-hover:grayscale-0">{cat.icon}</span>
                      {cat.name}
                    </span>
                    {category.id === cat.id && <ChevronRight size={14} />}
                  </Link>
                ))}
              </div>
            </div>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
                  <Filter size={20} className="text-[#f85606]" />
                  <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest">Refine Search</h3>
                </div>

                <div className="space-y-2">
                  <Link 
                    to={`/category/${category.slug}`}
                    className={`block text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all border ${
                      !selectedSub ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'text-gray-500 hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    View All Items
                  </Link>
                  {category.subcategories.map((sub, idx) => (
                    <Link 
                      key={idx}
                      to={`/category/${category.slug}?sub=${encodeURIComponent(sub)}`}
                      className={`block text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all border ${
                        selectedSub === sub ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'text-gray-500 hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-8 bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100 shadow-inner relative overflow-hidden group">
               <div className="relative z-10">
                  <p className="text-[10px] text-[#f85606] font-black uppercase tracking-[0.2em] mb-3">SUPER DEAL</p>
                  <p className="text-sm font-black text-gray-800 leading-relaxed uppercase tracking-tight italic">Save <span className="text-[#f85606] text-xl">25%</span> Extra on your first order this month!</p>
                  <div className="mt-6 flex gap-2">
                     <div className="px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-[10px] font-black text-[#f85606] tracking-widest">SAVE25</div>
                  </div>
               </div>
               <div className="absolute -bottom-6 -right-6 text-9xl opacity-5 grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110">{category.icon}</div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 px-2">
            <div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">
                {selectedSub ? `${selectedSub} Showcase` : `${category.name} Collection`}
              </h2>
              <p className="text-[10px] text-gray-400 mt-1 font-black tracking-[0.2em] uppercase">{activeProducts.length} PREMIUM ITEMS FOUND</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Filter By:</span>
              <select className="bg-white border border-gray-100 rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-500/5 transition-all cursor-pointer shadow-sm">
                <option>Newest Arrivals</option>
                <option>Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-50 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                    </Link>
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-all transform hover:scale-110 ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    {product.discount && (
                      <span className="absolute top-4 left-4 bg-[#f85606] text-white text-[9px] font-black px-3 py-1 rounded-lg shadow-xl uppercase tracking-widest border border-white/20">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[36px] mb-3 group-hover:text-[#f85606] transition-colors leading-tight uppercase tracking-tight">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-black">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-[#f85606] tracking-tighter leading-none">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-300 line-through font-bold mt-1">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)} 
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-[#f85606] text-gray-400 hover:text-white rounded-2xl transition-all transform hover:rotate-12 active:scale-90 border border-gray-100 hover:border-transparent shadow-sm"
                      >
                        <Plus size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-50 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
                <Filter size={48} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight italic">No Treasures Found</h3>
              <p className="text-gray-400 text-xs mt-3 max-w-xs font-bold uppercase tracking-widest leading-loose">We currently have no active items matching these criteria in {category.name}.</p>
              <Link to="/" className="mt-12 px-12 py-4 bg-gray-800 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all transform hover:scale-105 active:scale-95">Browse Trending</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
