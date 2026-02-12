import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronLeft } from '../common/Icons';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { products, formatPrice } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const isCategoriesPage = pathname === '/categories';
  const isAccountPage = pathname === '/account';

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = products.filter(product => 
        product.status === 'active' &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 8);
      setSuggestedProducts(filtered);
    } else {
      setSuggestedProducts([]);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    setIsSearchFocused(false);
  };

  if (isAccountPage) return null;

  return (
    <div className="lg:hidden bg-white relative">
      {/* App Banner - Matching standard app margins */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f85606] rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-sm border border-orange-600/20">
            S
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-800 leading-tight italic uppercase tracking-tighter">SuperStore App</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Save more on App</p>
          </div>
        </div>
        <button className="bg-[#f85606] text-white px-6 py-2 rounded-full text-[10px] font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-transform uppercase tracking-wider">
          Open
        </button>
      </div>

      {/* Navigation Header */}
      {isCategoriesPage ? (
        <div className="px-4 py-4 flex items-center justify-between bg-white border-b">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-800">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tighter italic">Categories</h2>
          </div>
          <button className="text-gray-800" onClick={() => navigate('/')}>
            <Search size={22} />
          </button>
        </div>
      ) : (
        /* Home Search Bar */
        <div className="px-4 py-4 sticky top-0 z-50 bg-white" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all focus-within:ring-4 focus-within:ring-orange-500/5 focus-within:bg-white">
            <div className="pl-4 text-gray-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search in SuperStore..." 
              className="flex-grow bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            <button 
              type="submit"
              className="bg-[#f85606] text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest active:bg-[#d04a05]"
            >
              Search
            </button>
          </form>

          {/* Real-time Suggestions Dropdown */}
          {isSearchFocused && searchTerm.trim() !== '' && (
            <div className="absolute top-full left-4 right-4 bg-white shadow-2xl rounded-b-2xl border border-gray-100 z-[100] mt-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {suggestedProducts.length > 0 ? (
                <div className="py-2 max-h-[60vh] overflow-y-auto">
                  {suggestedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b last:border-0 border-gray-50"
                      onClick={() => handleSuggestionClick(product.name)}
                    >
                      <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover border" />
                      <div className="flex-grow">
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-[9px] text-gray-400 uppercase font-black">{product.category}</p>
                      </div>
                      <span className="text-xs font-black text-[#f85606]">{formatPrice(product.price)}</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleSearchSubmit()}
                    className="w-full py-4 text-center text-[10px] font-black text-[#f85606] uppercase tracking-widest bg-orange-50/50"
                  >
                    See all results
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic opacity-60">
                  No products matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileHeader;