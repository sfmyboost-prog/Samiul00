
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { Heart, Star, Plus, Trash2, ChevronRight } from '../../components/common/Icons';

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, formatPrice } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <Heart size={64} className="text-gray-200" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight italic">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-10 font-bold uppercase tracking-widest text-xs">Items you favorite will appear here!</p>
        <Link to="/" className="px-12 py-4 bg-[#f85606] text-white font-black rounded-xl shadow-xl shadow-orange-500/20 hover:bg-[#d04a05] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-[10px]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 animate-in fade-in duration-500 px-4 md:px-0">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 ml-2">
        <Link to="/" className="hover:text-[#f85606] transition-colors">Home</Link>
        <ChevronRight size={10} />
        <span className="text-gray-800">My Wishlist</span>
      </nav>

      <div className="mb-12 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#f85606] rounded-full"></div>
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase italic leading-none">My Wishlist</h1>
          <p className="text-[10px] text-gray-400 mt-1.5 font-black tracking-[0.2em] uppercase">
            {wishlist.length} PREMIUM ITEMS SAVED
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {wishlist.map(product => (
          <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-50 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden flex flex-col h-full relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              </Link>
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-all transform hover:scale-110 text-red-500"
              >
                <Heart size={18} fill="currentColor" />
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
              
              <div className="mt-auto space-y-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#f85606] tracking-tighter leading-none">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-gray-300 line-through font-bold mt-1">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => addToCart(product)} 
                    className="flex items-center justify-center gap-2 py-3 bg-[#f85606] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-[#d04a05] transition-all active:scale-95"
                  >
                    <Plus size={16} /> Add to Cart
                  </button>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-widest"
                  >
                    <Trash2 size={12} /> Remove from List
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
