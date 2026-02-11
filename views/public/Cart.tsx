
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Trash2, ShoppingCart, Minus, Plus } from '../../components/common/Icons';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, isLoggedIn, formatPrice } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingCart size={64} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Items added to your cart will appear here.</p>
        <Link to="/" className="px-10 py-3 bg-[#f85606] text-white font-bold rounded shadow-lg hover:bg-[#d04a05] transition-all transform hover:scale-105 active:scale-95">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">Shopping Cart ({cart.length} items)</h2>
          </div>
          <div className="divide-y">
            {cart.map(item => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                <div className="w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`} className="font-bold text-gray-800 hover:text-[#f85606] transition-colors line-clamp-2 mb-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-500 mb-4">{item.category}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 border-r"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 border-l"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Trash2 size={14} /> REMOVE
                    </button>
                  </div>
                </div>
                <div className="text-right sm:w-24">
                  <p className="text-lg font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-32">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-[#f85606]">{formatPrice(total)}</span>
            </div>
          </div>
          <button 
            onClick={handleCheckout}
            className="block w-full py-4 bg-[#f85606] text-white text-center font-bold rounded shadow-lg hover:bg-[#d04a05] transition-all active:scale-95"
          >
            PROCEED TO CHECKOUT
          </button>
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Safe & Secure Payments
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              100% Quality Assurance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
