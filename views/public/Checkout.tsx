
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { CreditCard, Truck, CheckCircle2, ChevronDown, ShieldCheck, AlertCircle } from '../../components/common/Icons';

// Comprehensive Global Country Configuration
const COUNTRY_CONFIG: Record<string, { code: string; length: number; placeholder: string }> = {
  'Bangladesh': { code: '+880', length: 10, placeholder: '1XXXXXXXXX' },
  'United States': { code: '+1', length: 10, placeholder: 'XXXXXXXXXX' },
  'United Kingdom': { code: '+44', length: 10, placeholder: 'XXXXXXXXXX' },
};

const COUNTRIES = Object.keys(COUNTRY_CONFIG).sort();

const Checkout: React.FC = () => {
  const { cart, placeOrder, formatPrice, userCoins } = useStore();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [useCoins, setUseCoins] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: 'Bangladesh',
    phone: '',
    fullAddress: '',
    payment: 'cod'
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 60;
  
  // Coin calculation: find max coins applicable based on products in cart
  const maxApplicableCoins = cart.reduce((sum, item) => sum + (item.maxCoinDeduction || 0) * item.quantity, 0);
  const coinsToActuallyUse = Math.min(userCoins, maxApplicableCoins);
  const coinDiscount = useCoins ? (coinsToActuallyUse / 100) : 0;
  
  const total = Math.max(0, subtotal + shipping - coinDiscount);

  const isNameValid = useMemo(() => {
    const name = formData.fullName.trim();
    if (!name) return false;
    if (/\d/.test(name)) return false;
    const firstChar = name.charAt(0);
    return firstChar === firstChar.toUpperCase() && /[A-Z]/.test(firstChar);
  }, [formData.fullName]);

  const currentCountryConfig = COUNTRY_CONFIG[formData.country] || { code: '', length: 10, placeholder: '' };
  const isPhoneValid = formData.phone.length === currentCountryConfig.length;

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  }, [formData.email]);

  const handleCountryChange = (country: string) => {
    setFormData({
      ...formData,
      country,
      phone: '' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid || !isPhoneValid || !isEmailValid) return;
    placeOrder(formData.fullName, formData.email, formData.phone, `${formData.fullAddress}, ${formData.country}`, useCoins ? coinsToActuallyUse : 0);
    setIsOrdered(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (cart.length === 0 && !isOrdered) {
    navigate('/cart');
    return null;
  }

  if (isOrdered) {
    return (
      <div className="py-24 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 text-center">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 text-green-500 shadow-inner">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight uppercase">Order Placed!</h2>
        <p className="text-gray-500 mb-4 max-w-xs mx-auto">Check your Gmail for order details. We've sent a confirmation to <span className="font-bold text-[#f85606]">{formData.email}</span>.</p>
        {useCoins && (
          <p className="text-orange-600 font-bold mb-4 uppercase tracking-widest text-[10px]">
            {coinsToActuallyUse} coins deducted from balance (Total Discount: {formatPrice(coinDiscount)})
          </p>
        )}
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Thank you for shopping at SuperStore!</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">Redirecting to home...</p>
      </div>
    );
  }

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && formData.country && formData.fullAddress;

  return (
    <div className="py-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-gray-800 mb-10 tracking-tight uppercase">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <div className="flex items-center gap-3 mb-10 border-b pb-6">
                <div className="p-2 bg-orange-50 rounded-lg">
                   <Truck className="text-[#f85606]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Shipping Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/10 transition-all pr-12 ${formData.fullName && !isNameValid ? 'border-red-300 bg-red-50' : 'border-gray-100'} ${isNameValid ? 'border-green-300 bg-green-50/20' : ''}`}
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                    {formData.fullName && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isNameValid ? (
                          <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in" />
                        ) : (
                          <AlertCircle size={20} className="text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/10 transition-all pr-12 ${formData.email && !isEmailValid ? 'border-red-300 bg-red-50' : 'border-gray-100'} ${formData.email && isEmailValid ? 'border-green-300 bg-green-50/20' : ''}`}
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    {formData.email && isEmailValid && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                         <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Phone Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-gray-400 font-black text-sm border-r border-gray-200 pr-3 pointer-events-none">
                      {currentCountryConfig.code}
                    </div>
                    <input
                      type="tel"
                      required
                      className={`w-full pl-20 pr-5 py-3.5 bg-gray-50 border rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/10 transition-all font-bold tracking-widest ${formData.phone && !isPhoneValid ? 'border-red-300' : 'border-gray-100'} ${isPhoneValid ? 'border-green-300 bg-green-50/20' : ''}`}
                      placeholder={currentCountryConfig.placeholder}
                      value={formData.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= currentCountryConfig.length) {
                          setFormData({...formData, phone: val});
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Country</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/10 appearance-none transition-all cursor-pointer font-bold text-gray-800"
                      value={formData.country}
                      onChange={e => handleCountryChange(e.target.value)}
                    >
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Full Address</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#f85606]/10 transition-all resize-none font-medium"
                    placeholder="e.g. House 24, Road 12, Area Name..."
                    value={formData.fullAddress}
                    onChange={e => setFormData({...formData, fullAddress: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <CreditCard className="text-[#f85606]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
              </div>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.payment === 'cod' ? 'border-[#f85606] bg-orange-50/50 shadow-inner' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.payment === 'cod' ? 'border-[#f85606] bg-[#f85606]' : 'border-gray-300'}`}>
                       {formData.payment === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <input type="radio" name="payment" className="hidden" checked={formData.payment === 'cod'} onChange={() => setFormData({...formData, payment: 'cod'})} />
                    <span className="font-bold text-gray-800 tracking-tight text-sm uppercase tracking-wider">Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-xl border p-8 sticky top-32">
            <h3 className="text-xl font-black text-gray-800 mb-6 border-b pb-5 uppercase tracking-tighter">Order Summary</h3>
            
            <div className="mb-6 bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className="text-lg">💰</span>
                     <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Use {coinsToActuallyUse} Coins</span>
                  </div>
                  <button 
                     onClick={() => setUseCoins(!useCoins)}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useCoins ? 'bg-orange-500' : 'bg-gray-300'}`}
                  >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useCoins ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
               </div>
               {useCoins && (
                 <p className="text-[10px] font-black text-orange-600 uppercase mt-2">
                   -{coinsToActuallyUse} coins will be deducted from balance
                 </p>
               )}
               <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Value: {formatPrice(coinsToActuallyUse / 100)} (100 coins = 1 Taka)</p>
            </div>

            <div className="max-h-60 overflow-y-auto mb-8 custom-scrollbar pr-3">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 mb-5 last:mb-0">
                  <div className="relative">
                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#f85606] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <p className="text-[11px] font-black text-gray-800 line-clamp-1 leading-tight mb-1">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{formatPrice(item.price)} / UNIT</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-black text-gray-800 tracking-tight">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 mb-10 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="text-gray-800 font-black">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span className="uppercase tracking-widest text-[10px]">Shipping Fee</span>
                <span className="text-gray-800 font-black">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {useCoins && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span className="uppercase tracking-widest text-[10px]">Coin Discount</span>
                  <span className="font-black">-{formatPrice(coinDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-6 border-t-2 border-dashed border-gray-100">
                <span className="font-black text-gray-800 uppercase tracking-[0.2em] text-[10px]">Total Amount</span>
                <span className="text-2xl font-black text-[#f85606] tracking-tighter">{formatPrice(total)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`group block w-full py-5 text-white text-center font-black rounded-xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-[11px] overflow-hidden relative ${
                !isFormValid 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none' 
                : 'bg-[#f85606] hover:bg-[#d04a05] shadow-orange-500/30'
              }`}
            >
              <span className="relative z-10">PLACE ORDER</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
