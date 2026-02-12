import React, { useState } from 'react';
import HeroSlider from '../../components/public/HeroSlider';
import FlashSale from '../../components/public/FlashSale';
import CategoryGrid from '../../components/public/CategoryGrid';
import QuickLinks from '../../components/public/QuickLinks';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, Plus } from '../../components/common/Icons';
import { Link, useNavigate } from 'react-router-dom';
import Toast, { ToastType } from '../../components/common/Toast';
import VideoPlayer from '../../components/common/VideoPlayer';

const Home: React.FC = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, formatPrice, cart, siteMedia } = useStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const navigate = useNavigate();

  const activeProducts = products.filter(p => p.status === 'active');

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setToast({ message: `Added ${product.name} to cart!`, type: 'success' });
  };

  const { promoBanner } = siteMedia;

  return (
    <div className="animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero Slider (Large Banner) */}
      <div className="mt-4 lg:mt-8 w-full h-[200px] md:h-[350px] lg:h-[480px] overflow-hidden shadow-xl rounded-2xl">
        <HeroSlider />
      </div>

      <div className="w-full">
        {/* Mobile Only Quick Grid */}
        <QuickLinks />

        {/* Promotional Banner */}
        <div 
          className="mt-8 relative h-40 md:h-64 group cursor-pointer active:scale-[0.995] transition-all overflow-hidden select-none shadow-2xl rounded-2xl"
          onClick={() => promoBanner.link && navigate(promoBanner.link)}
        >
          <div className="w-full h-full relative bg-gray-900 overflow-hidden">
            
            {/* Main Media Layer - Uploaded from Admin */}
            {promoBanner.url ? (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {promoBanner.type === 'image' ? (
                  <img src={promoBanner.url} className="w-full h-full object-cover" alt="promo" draggable={false} />
                ) : (
                  <VideoPlayer url={promoBanner.url} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              </div>
            ) : (
               <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600" />
            )}

            {/* Text Content Area with Rising Animation */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-16 duration-700">
                {promoBanner.title || "PROMOTIONAL TITLE"}
              </h2>
              <p className="text-[10px] md:text-sm text-white/90 font-black uppercase tracking-[0.3em] mt-3 md:mt-4 drop-shadow animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
                {promoBanner.subtitle || "CLICK HERE TO EXPLORE & SAVE BIG"}
              </p>
              
              <div className="mt-6 md:mt-8 bg-white text-gray-900 px-10 md:px-16 py-2.5 md:py-3.5 rounded-sm font-black text-[10px] md:text-xs uppercase tracking-[0.2em] group-hover:bg-[#f85606] group-hover:text-white transition-all transform hover:scale-105 shadow-2xl active:scale-95 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                Click Here
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories Grid */}
        <CategoryGrid />

        <FlashSale />

        <section className="mt-16 pb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-[#f85606] rounded-full"></div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight uppercase italic">Just For You</h2>
          </div>
          
          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
              {activeProducts.map(product => {
                const cartItem = cart.find(item => item.id === product.id);
                const countInCart = cartItem?.quantity || 0;

                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden flex flex-col h-full relative"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Link to={`/product/${product.id}`}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                      </Link>
                      
                      {countInCart > 0 && (
                        <div className="absolute top-2 right-12 bg-green-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in">
                          {countInCart}
                        </div>
                      )}

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
                          onClick={() => handleAddToCart(product)} 
                          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all transform active:scale-90 shadow-md bg-[#f85606] text-white"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No items found.</p>
            </div>
          )}
          <div className="mt-16 text-center">
            <button className="px-12 py-4 border-2 border-[#f85606] text-[#f85606] font-black rounded-xl hover:bg-[#f85606] hover:text-white transition-all transform hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-[10px] shadow-sm">
              Load More Deals
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;