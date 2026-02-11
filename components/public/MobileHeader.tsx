
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

  // Real-time suggestions from the first letter
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

  // Handle click outside to close suggestions
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
    // User can then click the Search button to confirm
  };

  // Account page has its own custom orange header, so we hide the global one
  if (isAccountPage) return null;

  return (
    <div className="lg:hidden bg-white relative">
      {/* App Banner */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f85606] rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-sm border border-orange-600/20">
            S
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-800 leading-tight italic uppercase tracking-tighter">SuperStore App</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Save more on App</p>
          </div>
        </div>
        <button className="bg-[#f85606] text-white px-6 py-1.5 rounded-full text-xs font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-transform uppercase tracking-wider">
          Open
        </button>
      </div>

      {/* Navigation Header */}
      {isCategoriesPage ? (
        <div className="px-4 py-3 flex items-center justify-between bg-white border-b">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-800">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tighter">Categories</h2>
          </div>
          <button className="text-gray-800" onClick={() => navigate('/')}>
            <Search size={22} />
          </button>
        </div>
      ) : (
        /* Home Search Bar */
        <div className="px-4 py-3 sticky top-0 z-50 bg-white" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-full border border-orange-500 overflow-hidden shadow-sm">
            <div className="pl-4 text-gray-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search in SuperStore..." 
              className="flex-grow bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            <button 
              type="submit"
              className="bg-[#f85606] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider active:bg-[#d04a05]"
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
                    className="w-full py-3 text-center text-xs font-black text-[#f85606] uppercase tracking-widest bg-orange-50/50"
                  >
                    See all results
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 text-xs italic">
                  No products found for "{searchTerm}"
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
