
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AlertCircle, User } from '../../components/common/Icons';
import { Customer } from '../../types';
import SocialLoginModal from '../../components/public/SocialLoginModal';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, customers, setCustomers } = useStore();

  const [socialModal, setSocialModal] = useState<{ isOpen: boolean; platform: 'Google' | 'Facebook' }>({
    isOpen: false,
    platform: 'Google'
  });

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (customers.some(c => c.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      /* Fix: Added missing 'coins' property to satisfy the Customer interface */
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        name,
        email,
        phone: '', 
        password,
        ordersCount: 0,
        dateJoined: new Date().toISOString().split('T')[0],
        avatar: `https://picsum.photos/seed/${email}/100/100`,
        status: 'active',
        coins: 0
      };

      setCustomers(prev => [...prev, newCustomer]);
      setIsLoggedIn(true);
      localStorage.setItem('current_user', JSON.stringify({ name, email }));
      navigate(redirectPath);
    }, 1500);
  };

  const handleSocialTrigger = (platform: 'Google' | 'Facebook') => {
    setSocialModal({ isOpen: true, platform });
  };

  const handleSocialSuccess = (account: any) => {
    setIsLoading(true);
    setSocialModal({ ...socialModal, isOpen: false });
    setTimeout(() => {
      setIsLoggedIn(true);
      localStorage.setItem('current_user', JSON.stringify({ name: account.name, email: account.email }));
      navigate(redirectPath);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <SocialLoginModal 
        isOpen={socialModal.isOpen} 
        onClose={() => setSocialModal({ ...socialModal, isOpen: false })} 
        platform={socialModal.platform}
        onSelect={handleSocialSuccess}
      />

      <div className="max-w-[440px] w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 sm:p-12 border border-gray-50 flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[#f85606] shadow-inner">
            <User size={32} strokeWidth={1.5} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase italic">Create Account</h1>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Start your shopping journey</p>
          </div>

          {error && (
            <div className="w-full mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest animate-in shake duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="w-full space-y-4">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">Full Name</label>
              <input type="text" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-xs font-bold" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">Email</label>
              <input type="email" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-xs font-bold" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">Password</label>
              <input type="password" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-xs font-bold" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">Confirm</label>
              <input type="password" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-xs font-bold" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            
            <button
              disabled={isLoading}
              className={`w-full py-4 mt-4 bg-[#f85606] text-white font-black rounded-2xl shadow-xl shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.3em] text-[10px] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d04a05]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  CREATING...
                </>
              ) : 'REGISTER'}
            </button>
          </form>

          <div className="relative w-full my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-5 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Or use social</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button onClick={() => handleSocialTrigger('Google')} className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm font-black text-[9px] uppercase tracking-widest text-gray-600 active:scale-95">
              <svg className="w-4 h-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              Google
            </button>
            <button onClick={() => handleSocialTrigger('Facebook')} className="flex items-center justify-center gap-3 px-4 py-3 bg-[#1877f2] text-white rounded-2xl hover:bg-[#166fe5] transition-all shadow-lg font-black text-[9px] uppercase tracking-widest active:scale-95">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-50 w-full text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Already have an account?</p>
            <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-[#f85606] font-black text-[10px] mt-2.5 hover:underline inline-block uppercase tracking-[0.3em]">Login Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
