
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Trash2, List, ChevronRight, LogOut, ChevronDown } from '../common/Icons';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

const Header: React.FC = () => {
  const { cart, wishlist, removeFromCart, isLoggedIn, setIsLoggedIn, currency, setCurrency, formatPrice, products, setLoginModalOpen } = useStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Real-time suggestions (starts from the 1st character)
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = products.filter(product => 
        product.status === 'active' &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 10); // Show up to 10 suggestions
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

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const trendingSearches = ['Rice', 'Oil', 'Smartphone', 'Panjabi'];

  return (
    <div className="bg-white">
      {/* Top Bar - Full Width Background */}
      <div className="bg-[#f85606] text-white py-1.5 px-4 text-[10px] md:text-xs font-bold uppercase tracking-wider">
        <div className="w-full px-4 md:px-6 flex justify-between items-center">
          <div className="flex gap-6 items-center">
             <span>FREE DELIVERY ON ORDERS ABOVE {formatPrice(1000)}!</span>
             <div className="h-3 w-[1px] bg-white/30 hidden md:block"></div>
             <div className="relative group cursor-pointer flex items-center gap-1">
                <span>Currency: {currency}</span>
                <ChevronDown size={10} />
                <div className="absolute top-full left-0 mt-1 bg-white text-gray-800 shadow-xl rounded py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 min-w-[80px]">
                   <button onClick={() => setCurrency('BDT')} className={`w-full text-left px-3 py-1 hover:bg-gray-100 text-[10px] ${currency === 'BDT' ? 'text-[#f85606] font-black' : ''}`}>BDT (৳)</button>
                   <button onClick={() => setCurrency('USD')} className={`w-full text-left px-3 py-1 hover:bg-gray-100 text-[10px] ${currency === 'USD' ? 'text-[#f85606] font-black' : ''}`}>USD ($)</button>
                </div>
             </div>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:underline">Admin Login</Link>
            <span className="cursor-pointer hover:underline hidden sm:block">Customer Care</span>
            <span className="cursor-pointer hover:underline hidden sm:block">Track My Order</span>
          </div>
        </div>
      </div>
      
      {/* Main Header Inner */}
      <div className="w-full px-4 md:px-10 py-5 flex items-center justify-between gap-4 md:gap-12">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#f85606] tracking-tight">SuperStore</h1>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              className="w-full px-5 py-2.5 bg-[#eff0f5] rounded-l outline-none focus:bg-white focus:ring-1 focus:ring-[#f85606] transition-all border border-transparent text-sm placeholder:text-gray-400"
              placeholder="Search for essentials, brands and more"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            <button 
              type="submit"
              className="bg-[#f85606] text-white px-5 py-2.5 rounded-r hover:bg-[#d04a05] transition-colors flex items-center justify-center"
            >
              <Search size={22} />
            </button>
          </form>

          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-md border border-t-0 mt-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {searchTerm.trim() === '' ? (
                <div className="p-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trending Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchTerm(term);
                          setIsSearchFocused(false);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : suggestedProducts.length > 0 ? (
                <div className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <h3 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Matching Products</h3>
                  {suggestedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors group"
                      onClick={() => handleSuggestionClick(product.name)}
                    >
                      <div className="w-10 h-10 rounded border overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-medium text-gray-800 group-hover:text-[#f85606] transition-colors line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">
                          in {product.category}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-[#f85606]">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-xs text-gray-500 italic">No products found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6 md:gap-8">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="flex flex-col items-center group relative cursor-pointer"
            >
              <LogOut size={22} className="text-gray-600 group-hover:text-[#f85606] transition-colors" />
              <span className="text-[10px] mt-1 text-gray-500 font-bold uppercase tracking-tight">Logout</span>
            </button>
          ) : (
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="flex flex-col items-center group relative"
            >
              <User size={22} className="text-gray-600 group-hover:text-[#f85606] transition-colors" />
              <span className="text-[10px] mt-1 text-gray-500 font-bold uppercase tracking-tight">Login</span>
            </button>
          )}
          
          <Link to="/wishlist" className="flex flex-col items-center group relative">
            <Heart size={22} className="text-gray-600 group-hover:text-[#f85606] transition-colors" />
            <span className="text-[10px] mt-1 text-gray-500 font-bold uppercase tracking-tight">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 right-0 bg-[#f85606] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                {wishlist.length}
              </span>
            )}
          </Link>

          <div className="relative group">
            <Link to="/cart" className="flex flex-col items-center">
              <div className="relative">
                <ShoppingCart size={22} className="text-gray-600 group-hover:text-[#f85606] transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#f85606] text-white text-[9px] px-1 h-4 rounded-full flex items-center justify-center min-w-[16px] font-bold animate-in zoom-in">
                    {cart.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 text-gray-500 font-bold uppercase tracking-tight">Cart</span>
            </Link>

            <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-2xl rounded-lg border invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 text-sm">My Cart ({cart.length})</h3>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs italic">
                    Your cart is empty
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="p-4 flex gap-3 border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border" />
                      <div className="flex-grow">
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromCart(item.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-b-lg border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-medium text-gray-600">Total:</span>
                    <span className="text-base font-bold text-[#f85606]">{formatPrice(cartTotal)}</span>
                  </div>
                  <Link 
                    to="/cart"
                    className="block w-full py-2 text-center bg-[#f85606] text-white rounded font-semibold hover:bg-[#d04a05] transition-all transform active:scale-[0.98] shadow-sm text-sm"
                  >
                    View and Check Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Nav Bar */}
      <div className="bg-white border-t border-b">
        <div className="w-full px-4 md:px-10 flex items-center justify-between py-2 text-[11px] font-bold text-gray-700 uppercase tracking-tight">
           <div className="flex items-center gap-10">
              <Link to="/" className="hover:text-[#f85606] transition-colors">Home</Link>
              <Link to="/flash-sale" className="hover:text-[#f85606] transition-colors">Flash Sale</Link>
              <Link to="/top-sellers" className="hover:text-[#f85606] transition-colors">Top Sellers</Link>
              <Link to="/brands" className="hover:text-[#f85606] transition-colors">Brands</Link>
           </div>
           <div className="flex items-center gap-8">
              <span className="hover:text-[#f85606] cursor-pointer">Become a Seller</span>
              <span className="hover:text-[#f85606] cursor-pointer">Help & Support</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
