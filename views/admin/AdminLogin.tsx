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

    // Simulate API call
    setTimeout(() => {
      if (email === adminProfile.email && password === 'admin123') {
        // If 2FA is enabled, verify the code
        if (adminProfile.twoFactorEnabled && adminProfile.twoFactorSecret) {
          try {
            const totp = new OTPAuth.TOTP({
              secret: adminProfile.twoFactorSecret,
              digits: 6,
              period: 30
            });
            const delta = totp.validate({ token: authCode, window: 1 });
            
            if (delta === null) {
              setError('Invalid authentication code. Please check your authenticator app.');
              setIsLoading(false);
              return;
            }
          } catch (err) {
            setError('Error validating code.');
            setIsLoading(false);
            return;
          }
        }

        localStorage.setItem('admin_session', 'active');
        setAdmin(true);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Hint: admin@superstore.com / admin123');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1e1e2d] flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#f85606] rounded-xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl shadow-lg shadow-orange-500/20">S</div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
            <p className="text-gray-500 mt-2">Please enter your credentials to login.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 text-sm animate-in shake duration-300">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition-all"
                placeholder="admin@superstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* New TOTP Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Authentication Code</label>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition-all tracking-[0.5em] text-center font-bold"
                placeholder="000000"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                required={adminProfile.twoFactorEnabled}
              />
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Enter the 6-digit code from your authenticator app if 2FA is enabled.</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded text-[#f85606] focus:ring-[#f85606]" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700">Remember Me</span>
              </label>
              <button type="button" className="text-sm text-[#f85606] font-semibold hover:underline">Forgot Password?</button>
            </div>
            <button
              disabled={isLoading}
              className={`w-full py-4 bg-[#f85606] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d04a05]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : 'SIGN IN'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 mt-8 text-sm">
          &copy; 2023 SuperStore Admin. Powered by Dataflow.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;