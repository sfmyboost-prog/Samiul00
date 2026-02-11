
import React, { useState } from 'react';
import { X, Eye, EyeOff } from '../common/Icons';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import SocialLoginModal from './SocialLoginModal';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen, setIsLoggedIn, customers, setCustomers, socialSettings } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmSignupPassword, setConfirmSignupPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialModal, setSocialModal] = useState<{ isOpen: boolean; platform: 'Google' | 'Facebook' }>({
    isOpen: false,
    platform: 'Google'
  });

  const navigate = useNavigate();

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setLoginModalOpen(false);
    setError('');
    // Reset to login mode on close
    setTimeout(() => setMode('login'), 300);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = customers.find(c => (c.email === identifier || c.phone === identifier));
      
      if (!user) {
        setError('No account found. Please sign up first.');
        setIsLoading(false);
      } else if (user.password !== password) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
      } else {
        setIsLoggedIn(true);
        localStorage.setItem('current_user', JSON.stringify({ name: user.name, email: user.email }));
        setIsLoading(false);
        setLoginModalOpen(false);
        navigate('/');
      }
    }, 800);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signupPassword !== confirmSignupPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const exists = customers.some(c => c.email === signupEmail);
      if (exists) {
        setError('Account already exists with this email.');
        setIsLoading(false);
        return;
      }

      const newCustomer = {
        id: `c${Date.now()}`,
        name: fullName,
        email: signupEmail,
        phone: '',
        password: signupPassword,
        ordersCount: 0,
        dateJoined: new Date().toISOString().split('T')[0],
        avatar: `https://picsum.photos/seed/${signupEmail}/100/100`,
        status: 'active' as const,
        coins: 0
      };

      setCustomers(prev => [...prev, newCustomer]);
      setIsLoggedIn(true);
      localStorage.setItem('current_user', JSON.stringify({ name: fullName, email: signupEmail }));
      setIsLoading(false);
      setLoginModalOpen(false);
      navigate('/');
    }, 800);
  };

  const handleSocialSelect = (account: any) => {
    setSocialModal({ ...socialModal, isOpen: false });
    setIsLoggedIn(true);
    localStorage.setItem('current_user', JSON.stringify({ name: account.name, email: account.email }));
    setLoginModalOpen(false);
    navigate('/');
  };

  const showSocialArea = socialSettings.google_enabled || socialSettings.facebook_enabled;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={handleClose}
      ></div>

      <SocialLoginModal 
        isOpen={socialModal.isOpen}
        onClose={() => setSocialModal({ ...socialModal, isOpen: false })}
        platform={socialModal.platform}
        onSelect={handleSocialSelect}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[480px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-400">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header Tab */}
        <div className="flex border-b">
          <div className="flex-1 py-5 text-sm font-bold text-gray-800 relative text-center uppercase tracking-wider">
            {mode === 'login' ? 'PASSWORD' : 'CREATE ACCOUNT'}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f85606] mx-auto w-1/4" />
          </div>
        </div>

        <div className="p-10 pt-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded text-xs font-bold text-center border border-red-100 animate-in shake duration-300">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder="Please enter your Phone or Email"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded text-sm focus:border-[#f85606] outline-none transition-all placeholder:text-gray-300"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Please enter your password"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded text-sm focus:border-[#f85606] outline-none transition-all placeholder:text-gray-300 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="text-right">
                <button type="button" className="text-xs text-gray-400 hover:text-[#f85606] transition-colors font-medium">
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 bg-[#f85606] text-white font-bold rounded shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d04a05]'
                }`}
              >
                {isLoading ? 'PLEASE WAIT...' : 'LOGIN'}
              </button>

              <p className="text-center text-xs text-gray-500">
                Don't have an account? <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="text-blue-500 font-bold hover:underline">Sign up</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded text-sm focus:border-[#f85606] outline-none transition-all placeholder:text-gray-300"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="relative">
                <input 
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded text-sm focus:border-[#f85606] outline-none transition-all placeholder:text-gray-300"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded text-sm focus:border-[#f85606] outline-none transition-all placeholder:text-gray-300 pr-12"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded text-sm focus:border-[#f85606] outline-none transition-all placeholder:text-gray-300 pr-12"
                  value={confirmSignupPassword}
                  onChange={(e) => setConfirmSignupPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 bg-[#2563eb] text-white font-bold rounded shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'CREATING...' : 'SIGN UP'}
              </button>

              <p className="text-center text-xs text-gray-500">
                Already have an account? <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-[#f85606] font-bold hover:underline">Login Now</button>
              </p>
            </form>
          )}

          {/* Social Area - Strictly conditional based on admin settings */}
          {showSocialArea && (
            <>
              {/* Social Divider */}
              <div className="relative flex justify-center py-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <span className="relative bg-white px-4 text-[10px] text-gray-400 uppercase font-medium">Or, login with</span>
              </div>

              {/* Social Buttons */}
              <div className="flex items-center justify-center gap-8">
                {socialSettings.google_enabled && (
                  <button 
                    onClick={() => setSocialModal({ isOpen: true, platform: 'Google' })}
                    type="button" 
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
                  >
                    <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span className="text-xs font-medium uppercase tracking-widest">Google</span>
                  </button>
                )}
                
                {socialSettings.facebook_enabled && (
                  <button 
                    onClick={() => setSocialModal({ isOpen: true, platform: 'Facebook' })}
                    type="button" 
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
                  >
                    <svg className="w-5 h-5 fill-gray-400 group-hover:fill-[#1877f2] transition-all" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-xs font-medium uppercase tracking-widest">Facebook</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
