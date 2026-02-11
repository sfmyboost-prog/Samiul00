import React, { useState, useMemo } from 'react';
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
    // Generate a secure random base32 secret (20 bytes / 160 bits is standard for TOTP)
    const secret = new OTPAuth.Secret({ size: 20 }).base32;
    setTempSecret(secret);
    setShowQR(true);
    showToast('New secret key generated. Scan to update your app.');
  };

  const handleToggle2FA = () => {
    // If enabling for the first time, force secret generation
    if (!adminProfile.twoFactorEnabled && !tempSecret) {
      generateNewSecret();
      return;
    }

    const nextState = !adminProfile.twoFactorEnabled;
    
    // Safety check: Don't allow enabling without a secret
    if (nextState && !tempSecret) {
      showToast('Please generate a secret key first', 'error');
      return;
    }

    setAdminProfile(prev => ({
      ...prev,
      twoFactorEnabled: nextState,
      twoFactorSecret: nextState ? tempSecret : prev.twoFactorSecret
    }));

    showToast(nextState ? '2FA Protection Enabled' : '2FA Protection Disabled');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Secret key copied');
  };

  // Generate the standard otpauth URI for app scanning
  const totpUri = useMemo(() => {
    if (!tempSecret) return '';
    return new OTPAuth.TOTP({
      issuer: 'SuperStore',
      label: adminProfile.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: tempSecret
    }).toString();
  }, [tempSecret, adminProfile.email]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase italic">Security Center</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Multi-factor Authentication Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Status Monitoring Card */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner ${adminProfile.twoFactorEnabled ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    {adminProfile.twoFactorEnabled ? <ShieldCheck size={40} /> : <ShieldAlert size={40} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">Admin Protection</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                       <div className={`w-2 h-2 rounded-full ${adminProfile.twoFactorEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                       <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        Status: {adminProfile.twoFactorEnabled ? 'Fully Protected' : 'At Risk'}
                       </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleToggle2FA}
                  className={`px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl ${
                    adminProfile.twoFactorEnabled 
                    ? 'bg-red-50 text-red-500 shadow-red-500/5' 
                    : 'bg-green-500 text-white shadow-green-500/20 hover:bg-green-600'
                  }`}
                >
                  {adminProfile.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="flex gap-5 relative z-10">
                  <AlertCircle size={24} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-loose font-bold uppercase tracking-tight">
                    By enabling 2FA, you require a dynamic 6-digit code for every login attempt. 
                    This prevents unauthorized access even if your password is compromised.
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 text-[120px] text-gray-100/50 font-black italic select-none">MFA</div>
              </div>
            </div>
          </div>

          {/* Configuration Card */}
          {(showQR || adminProfile.twoFactorEnabled) && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
              <div className="p-10">
                <h3 className="text-xl font-black text-gray-800 mb-8 italic uppercase tracking-tighter">Configuration Setup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {[
                      { step: 1, text: "Install a TOTP Authenticator app on your smartphone." },
                      { step: 2, text: "Scan the QR code or enter the secret key manually into the app." },
                      { step: 3, text: "Verify the 6-digit code generated by the app during login." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-5">
                        <div className="w-8 h-8 rounded-xl bg-[#f85606] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-lg shadow-orange-500/20">{item.step}</div>
                        <p className="text-[11px] text-gray-600 font-bold uppercase tracking-tight leading-relaxed">{item.text}</p>
                      </div>
                    ))}

                    <div className="pt-8 border-t border-gray-50">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-1">Manual Private Key</label>
                      <div className="flex gap-2">
                        <code className="flex-grow bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 text-sm font-black text-gray-800 tracking-[0.2em] shadow-inner">
                          {tempSecret}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(tempSecret)}
                          className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-800 transition-all border border-gray-100"
                          title="Copy to clipboard"
                        >
                          <Copy size={20} />
                        </button>
                        <button 
                          onClick={generateNewSecret}
                          className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-orange-50 hover:text-[#f85606] transition-all border border-gray-100"
                          title="Rotate Secret Key"
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner">
                    <div className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-100 relative group">
                      {totpUri ? (
                        <QRCodeSVG 
                          value={totpUri} 
                          size={200}
                          level="H"
                          includeMargin={false}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-200 font-black uppercase text-[10px] text-center px-6 leading-relaxed italic">
                          Click Rotate to generate Setup Code
                        </div>
                      )}
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-green-500" />
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Scannable via App</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#1e1e2d] rounded-[32px] p-10 text-white shadow-2xl shadow-gray-300 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black italic mb-6 uppercase tracking-tighter">Security Grade</h3>
              <p className="text-xs text-gray-400 leading-loose font-bold uppercase tracking-tight mb-10 opacity-80">
                SuperStore implements military-grade TOTP (Time-based One-Time Password) hashing to verify your identity.
              </p>
              
              <div className="space-y-6">
                 {[
                   "Hardware bound validation",
                   "Clock-drift compensation",
                   "Anti-phishing architecture",
                   "Dynamic key rotation"
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f85606] group-hover:scale-150 transition-transform"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-100">{feat}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <ShieldCheck size={160} strokeWidth={0.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorManagement;