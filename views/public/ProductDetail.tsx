
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, ShoppingCart, Truck, CreditCard, ChevronRight } from '../../components/common/Icons';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist, isLoggedIn, formatPrice } = useStore();
  const product = products.find(p => p.id === id);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!product || product.status === 'inactive') return <div className="py-20 text-center">Product not found</div>;

  const handleBuyNow = () => {
    addToCart(product, qty);
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}`);
    }
  };

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#f85606]">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#f85606]">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 rounded-xl shadow-sm border">
        {/* Images */}
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border">
            <img src={product.images[selectedImg] || product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4">
            {(product.images || []).map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                  selectedImg === i ? 'border-[#f85606]' : 'border-transparent'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-7 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
              ))}
              <span className="ml-2 text-sm text-gray-600 font-medium">{product.rating} / 5</span>
            </div>
            <span className="h-4 w-[1px] bg-gray-300"></span>
            <span className="text-sm text-blue-500 font-medium">{product.reviews} Reviews</span>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#f85606]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-xs font-bold text-red-500">-{product.discount}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-500 w-24">Quantity</span>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-100 border-r"
                >-</button>
                <span className="px-6 py-2 font-medium">{qty}</span>
                <button 
                  onClick={() => setQty(q => q + 1)}
                  className="px-4 py-2 hover:bg-gray-100 border-l"
                >+</button>
              </div>
              <span className="text-xs text-gray-400">Only {product.stock} items left</span>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                className="flex-grow py-4 bg-[#26abd4] text-white font-bold rounded shadow-lg hover:bg-[#1a8bad] transition-all active:scale-95"
                onClick={handleBuyNow}
              >
                BUY NOW
              </button>
              <button 
                className="flex-grow py-4 bg-[#f85606] text-white font-bold rounded shadow-lg hover:bg-[#d04a05] transition-all active:scale-95 flex items-center justify-center gap-2"
                onClick={() => addToCart(product, qty)}
              >
                <ShoppingCart size={20} />
                ADD TO CART
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded border-2 transition-all ${
                  isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200'
                }`}
              >
                <Heart size={24} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Free Delivery</h4>
                <p className="text-xs text-gray-500 mt-1">Free shipping for all orders over {formatPrice(500)}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Secure Payment</h4>
                <p className="text-xs text-gray-500 mt-1">100% secure payment methods supported</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <div className="flex gap-12 border-b mb-8">
          <button className="pb-4 border-b-2 border-[#f85606] font-bold text-[#f85606]">Description</button>
          <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors">Specifications</button>
          <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors">Reviews ({product.reviews})</button>
        </div>
        <div className="text-gray-600 leading-relaxed max-w-4xl">
          <p className="mb-4">{product.description}</p>
          <p>This premium product has been designed with the user in mind. Built from high-quality materials, it ensures longevity and peak performance under various conditions. Whether you're using it for work or leisure, its versatile features adapt to your specific needs seamlessly.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
