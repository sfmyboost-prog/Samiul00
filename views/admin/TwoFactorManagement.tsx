import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, ShieldAlert, RotateCcw, Copy, CheckCircle2, AlertCircle } from '../../components/common/Icons';
import * as OTPAuth from 'otpauth';
import { QRCodeSVG } from 'qrcode.react';
import Toast, { ToastType } from '../../components/common/Toast';

const TwoFactorManagement: React.FC = () => {
  const { adminProfile, setAdminProfile } = useStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [tempSecret, setTempSecret] = useState(adminProfile.twoFactorSecret || '');

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const generateNewSecret = () => {
    // Generate a random base32 secret
    const secret = new OTPAuth.Secret({ size: 20 }).base32;
    setTempSecret(secret);
    setShowQR(true);
    showToast('New secret key generated. Please scan the QR code.');
  };

  const handleToggle2FA = () => {
    if (!adminProfile.twoFactorEnabled && !tempSecret) {
      generateNewSecret();
      return;
    }

    const nextState = !adminProfile.twoFactorEnabled;
    setAdminProfile(prev => ({
      ...prev,
      twoFactorEnabled: nextState,
      twoFactorSecret: nextState ? tempSecret : prev.twoFactorSecret
    }));

    showToast(nextState ? '2FA Protection Enabled' : '2FA Protection Disabled');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Secret key copied to clipboard');
  };

  const totpUri = tempSecret ? new OTPAuth.TOTP({
    issuer: 'SuperStore',
    label: adminProfile.email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: tempSecret
  }).toString() : '';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Two-Factor Authentication</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Enhance your account security with standard TOTP protection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Status Card */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${adminProfile.twoFactorEnabled ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    {adminProfile.twoFactorEnabled ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-800">Account Protection</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                      Status: {adminProfile.twoFactorEnabled ? 'Active' : 'Disabled'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleToggle2FA}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95 shadow-lg ${
                    adminProfile.twoFactorEnabled 
                    ? 'bg-red-50 text-red-500 shadow-red-500/10' 
                    : 'bg-green-500 text-white shadow-green-500/20'
                  }`}
                >
                  {adminProfile.twoFactorEnabled ? 'Disable Protection' : 'Enable 2FA'}
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Two-factor authentication adds an extra layer of security to your account. 
                    In addition to your password, you'll need to enter a 6-digit code from 
                    apps like Google Authenticator or Authy to log in.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Card */}
          {(showQR || adminProfile.twoFactorEnabled) && (
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8">
                <h3 className="text-lg font-black text-gray-800 mb-6 italic">Setup Instructions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">1</div>
                      <p className="text-xs text-gray-600 font-medium">Download a TOTP authenticator app like Google Authenticator or Microsoft Authenticator.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">2</div>
                      <p className="text-xs text-gray-600 font-medium">Scan the QR code on the right with your app or enter the manual secret key.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">3</div>
                      <p className="text-xs text-gray-600 font-medium">Once scanned, your app will generate a 6-digit code that changes every 30 seconds.</p>
                    </div>

                    <div className="pt-6">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Manual Secret Key</label>
                      <div className="flex gap-2">
                        <code className="flex-grow bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-800 tracking-wider">
                          {tempSecret}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(tempSecret)}
                          className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <Copy size={18} />
                        </button>
                        <button 
                          onClick={generateNewSecret}
                          className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                          title="Generate New Key"
                        >
                          <RotateCcw size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                      {totpUri ? (
                        <QRCodeSVG 
                          value={totpUri} 
                          size={180}
                          level="H"
                          includeMargin={true}
                        />
                      ) : (
                        <div className="w-[180px] h-[180px] flex items-center justify-center text-gray-300 font-bold uppercase text-[10px] text-center px-4">
                          Generate secret to view QR Code
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-6 text-center">Scan with Google Authenticator</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#1e1e2d] rounded-[24px] p-8 text-white shadow-xl shadow-gray-200/50">
            <h3 className="text-lg font-black italic mb-4">Why use 2FA?</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Passwords can be stolen, guessed, or bypassed. Two-factor authentication 
              ensures that even if someone has your password, they cannot access your 
              admin panel without the physical device generating your unique tokens.
            </p>
            
            <div className="mt-8 space-y-4">
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Brute Force Protection</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Phishing Mitigation</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Identity Assurance</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorManagement;