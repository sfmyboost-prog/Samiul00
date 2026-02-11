
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ChevronRight, Plus } from '../common/Icons';
import { Link } from 'react-router-dom';

const FlashSale: React.FC = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, formatPrice, cart } = useStore();
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 43, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="mt-8 md:mt-14 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <h2 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tight italic">Flash Sale</h2>
          <div className="flex items-center gap-2">
            <span className="bg-[#f85606] text-white w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black shadow-md border border-white/20">{format(timeLeft.h)}</span>
            <span className="text-[#f85606] font-black text-lg">:</span>
            <span className="bg-[#f85606] text-white w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black shadow-md border border-white/20">{format(timeLeft.m)}</span>
            <span className="text-[#f85606] font-black text-lg">:</span>
            <span className="bg-[#f85606] text-white w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black shadow-md border border-white/20">{format(timeLeft.s)}</span>
          </div>
        </div>
        <Link to="/products" className="text-[#f85606] text-[10px] font-black uppercase flex items-center gap-1 hover:underline tracking-widest whitespace-nowrap">
          Shop More <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 pb-6 custom-scrollbar snap-x">
        {products.filter(p => p.discount && p.status === 'active').slice(0, 12).map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          const countInCart = cartItem?.quantity || 0;

          return (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-[140px] md:w-auto flex flex-col bg-white rounded-2xl hover:shadow-xl transition-all group border border-transparent hover:border-gray-100 snap-start relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </Link>
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-[#f85606] text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-md border border-white/20">
                    -{product.discount}%
                  </span>
                )}
                
                {countInCart > 0 && (
                  <div className="absolute top-2 right-12 bg-green-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    {countInCart}
                  </div>
                )}

                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-sm transition-all ${
                    isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'
                  } hover:scale-110`}
                >
                  <Heart size={14} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 min-h-[32px] mb-2 group-hover:text-[#f85606] transition-colors leading-tight">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex flex-col mb-4">
                  <span className="text-sm md:text-lg font-black text-[#f85606] tracking-tighter leading-none">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-[9px] text-gray-400 line-through font-bold mt-1 opacity-60">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className={`w-full py-2.5 text-[9px] font-black rounded-xl border transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2 ${
                    countInCart > 0 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'bg-gray-50 text-[#f85606] border-gray-100 hover:bg-[#f85606] hover:text-white'
                  }`}
                >
                  {countInCart > 0 ? (
                    <>Added <Plus size={10} /></>
                  ) : (
                    'Add To Cart'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FlashSale;
