
import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, Plus, ChevronRight, Filter } from '../../components/common/Icons';

const SearchResults: React.FC = () => {
  const { products, formatPrice, toggleWishlist, isInWishlist, addToCart } = useStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase().trim();
    return products.filter(p => 
      p.status === 'active' && (
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.subcategory?.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      )
    );
  }, [products, query]);

  return (
    <div className="py-8 animate-in fade-in duration-500">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#f85606]">Home</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">Search Results</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase italic">
          Results for "{query}"
        </h1>
        <p className="text-sm text-gray-400 mt-2 font-bold tracking-widest uppercase">
          {filteredProducts.length} PRODUCTS FOUND
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden flex flex-col h-full relative">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                </Link>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-lg transition-all transform hover:scale-110 ${
                    isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-[#f85606] text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-md border border-white/20">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <div className="p-3 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 min-h-[32px] mb-2 hover:text-[#f85606] transition-colors leading-tight">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={8} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-[8px] text-gray-400 font-black tracking-tighter">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-[#f85606] tracking-tighter leading-none">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[9px] text-gray-400 line-through font-bold mt-1 opacity-70">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)} 
                    className="w-8 h-8 flex items-center justify-center rounded-xl transition-all transform active:scale-90 shadow-md bg-[#f85606] text-white"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Filter size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">No products found</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-xs font-medium">We couldn't find anything matching "{query}". Try checking your spelling or using different keywords.</p>
          <Link to="/" className="mt-10 px-10 py-3 bg-[#f85606] text-white text-xs font-black rounded uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-[#d04a05] transition-all transform hover:scale-105 active:scale-95">Go to Homepage</Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
