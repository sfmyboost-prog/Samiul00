import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AlertCircle } from '../../components/common/Icons';
import * as OTPAuth from 'otpauth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAdmin, adminProfile } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Default password fallback if not set in profile
    const validPassword = adminProfile.password || 'admin123';

    setTimeout(() => {
      if (email === adminProfile.email && password === validPassword) {
        // If 2FA is enabled, perform TOTP verification
        if (adminProfile.twoFactorEnabled && adminProfile.twoFactorSecret) {
          if (!authCode || authCode.length !== 6) {
            setError('Please enter your 6-digit authentication code.');
            setIsLoading(false);
            return;
          }

          try {
            const totp = new OTPAuth.TOTP({
              issuer: 'SuperStore',
              label: adminProfile.email,
              algorithm: 'SHA1',
              digits: 6,
              period: 30,
              secret: adminProfile.twoFactorSecret
            });

            const delta = totp.validate({ token: authCode, window: 1 });
            
            if (delta === null) {
              setError('Invalid authentication code. Please check your app.');
              setIsLoading(false);
              return;
            }
          } catch (err) {
            console.error("2FA Validation error:", err);
            setError('Internal security verification error.');
            setIsLoading(false);
            return;
          }
        }

        // Authentication Successful
        localStorage.setItem('admin_session', 'active');
        setAdmin(true);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please verify your admin email and password.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#1e1e2d] flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#f85606] rounded-xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl shadow-lg shadow-orange-500/20">S</div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-widest">Sign in to manage your store</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider animate-in shake duration-300 border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-800"
                placeholder="admin@superstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* TOTP Input Field */}
            {adminProfile.twoFactorEnabled && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Authentication Code</label>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 transition-all tracking-[0.6em] text-center font-black text-lg"
                  placeholder="000000"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest text-center">Enter the 6-digit code from your authenticator app</p>
              </div>
            )}

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded text-[#f85606] focus:ring-[#f85606] border-gray-300" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 uppercase tracking-widest">Remember Me</span>
              </label>
              <button type="button" className="text-[10px] text-[#f85606] font-black uppercase tracking-widest hover:underline">Forgot Password?</button>
            </div>

            <button
              disabled={isLoading}
              className={`w-full py-4 bg-[#f85606] text-white font-black rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[11px] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d04a05]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : 'SIGN IN'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 mt-10 text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
          &copy; 2023 SuperStore Admin Engine. Secure Access.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;