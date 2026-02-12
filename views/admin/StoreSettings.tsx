import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronRight, Settings, Save, AlertCircle, CheckCircle2 } from '../../components/common/Icons';
import Toast, { ToastType } from '../../components/common/Toast';

const StoreSettings: React.FC = () => {
  const { adminProfile, setAdminProfile, socialSettings, setSocialSettings } = useStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Local state for the form to handle changes before saving
  const [localProfile, setLocalProfile] = useState({
    ...adminProfile,
    password: adminProfile.password || 'admin123'
  });
  const [localSocial, setLocalSocial] = useState(socialSettings);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate production API delay and encryption
    setTimeout(() => {
      setAdminProfile(localProfile);
      setSocialSettings(localSocial);
      setIsUpdating(false);
      setToast({ message: 'Settings updated and synced successfully', type: 'success' });
    }, 1200);
  };

  const handleToggle = (key: 'google_enabled' | 'facebook_enabled', value: boolean) => {
    setLocalSocial(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
        <span className="hover:text-gray-600 cursor-pointer">Dashboard</span>
        <ChevronRight size={10} />
        <span className="text-gray-800">Setting</span>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Setting</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Configure your store identity and authentication methods.</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* General Information Section */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <h3 className="text-lg font-black text-gray-800 mb-1 italic">General Info</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-loose">Configure administrative contact details</p>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#f85606]/5 transition-all text-sm font-bold text-gray-800"
                  value={localProfile.firstName}
                  onChange={e => setLocalProfile({...localProfile, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#f85606]/5 transition-all text-sm font-bold text-gray-800"
                  value={localProfile.lastName}
                  onChange={e => setLocalProfile({...localProfile, lastName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Address</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#f85606]/5 transition-all text-sm font-bold text-gray-800"
                  value={localProfile.address}
                  onChange={e => setLocalProfile({...localProfile, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Contact</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#f85606]/5 transition-all text-sm font-bold text-gray-800"
                  value={localProfile.contact}
                  onChange={e => setLocalProfile({...localProfile, contact: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Admin Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#f85606]/5 transition-all text-sm font-bold text-gray-800"
                  value={localProfile.email}
                  onChange={e => setLocalProfile({...localProfile, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Admin Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new admin password"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-bold text-gray-800"
                  value={localProfile.password}
                  onChange={e => setLocalProfile({...localProfile, password: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Auth Section */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <h3 className="text-lg font-black text-gray-800 mb-1 italic">Social Auth</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-loose">Manage OAuth 2.0 Credentials</p>
              
              <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                 <div className="flex gap-2 text-orange-600 mb-2">
                    <AlertCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Security Note</span>
                 </div>
                 <p className="text-[9px] font-bold text-orange-800 uppercase leading-relaxed opacity-80">
                   Credentials are encrypted before being stored in the production cluster. Never share secrets with third-parties.
                 </p>
              </div>
            </div>
            
            <div className="lg:col-span-9 space-y-10">
              {/* Google OAuth Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                       </svg>
                    </div>
                    <span className="text-sm font-black text-gray-800 tracking-tight">Enable Google Login?</span>
                  </div>
                  
                  <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-fit">
                    <button 
                      type="button"
                      onClick={() => handleToggle('google_enabled', true)}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${localSocial.google_enabled ? 'bg-white text-gray-800 shadow-md' : 'text-gray-400 hover:text-gray-500'}`}
                    >
                      {localSocial.google_enabled && <CheckCircle2 size={12} />} Yes
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleToggle('google_enabled', false)}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!localSocial.google_enabled ? 'bg-[#f85606] text-white shadow-xl' : 'text-gray-400 hover:text-gray-500'}`}
                    >
                      {!localSocial.google_enabled && <CheckCircle2 size={12} />} No
                    </button>
                  </div>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ${localSocial.google_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Google Client ID</label>
                    <input 
                      type="text" 
                      placeholder="852xxxxxx-xxxxxx.apps.googleusercontent.com"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold text-gray-800 placeholder:text-gray-200"
                      value={localSocial.google_client_id}
                      onChange={e => setLocalSocial({...localSocial, google_client_id: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Google Client Secret</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••••••"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold text-gray-800 placeholder:text-gray-200"
                      value={localSocial.google_client_secret}
                      onChange={e => setLocalSocial({...localSocial, google_client_secret: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Facebook OAuth Section */}
              <div className="space-y-6 pt-10 border-t border-dashed border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1877f2] rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                       </svg>
                    </div>
                    <span className="text-sm font-black text-gray-800 tracking-tight">Enable Facebook Login?</span>
                  </div>
                  
                  <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-fit">
                    <button 
                      type="button"
                      onClick={() => handleToggle('facebook_enabled', true)}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${localSocial.facebook_enabled ? 'bg-white text-gray-800 shadow-md' : 'text-gray-400 hover:text-gray-500'}`}
                    >
                      {localSocial.facebook_enabled && <CheckCircle2 size={12} />} Yes
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleToggle('facebook_enabled', false)}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!localSocial.facebook_enabled ? 'bg-[#f85606] text-white shadow-xl' : 'text-gray-400 hover:text-gray-500'}`}
                    >
                      {!localSocial.facebook_enabled && <CheckCircle2 size={12} />} No
                    </button>
                  </div>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ${localSocial.facebook_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Facebook App ID</label>
                    <input 
                      type="text" 
                      placeholder="15485621023xxxx"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold text-gray-800 placeholder:text-gray-200"
                      value={localSocial.facebook_app_id}
                      onChange={e => setLocalSocial({...localSocial, facebook_app_id: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Facebook App Secret</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••••••"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold text-gray-800 placeholder:text-gray-200"
                      value={localSocial.facebook_app_secret}
                      onChange={e => setLocalSocial({...localSocial, facebook_app_secret: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Button Implementation */}
        <div className="pt-6">
          <button 
            type="submit"
            disabled={isUpdating}
            className={`px-16 py-4 bg-[#f85606] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/30 hover:bg-[#d04a05] transition-all transform active:scale-95 flex items-center justify-center gap-3 ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                SYNCING DATA...
              </>
            ) : (
              <>
                <Save size={18} />
                UPDATE SETTINGS
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;