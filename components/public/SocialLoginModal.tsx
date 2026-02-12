import React, { useState, useEffect } from 'react';
import { X, User, ChevronRight, AlertCircle, CheckCircle2 } from '../common/Icons';
import { useStore } from '../../context/StoreContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';

interface Account {
  name: string;
  email: string;
  avatar: string;
}

interface SocialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  platform: 'Google' | 'Facebook';
}

const SocialLoginModal: React.FC<SocialLoginModalProps> = ({ isOpen, onClose, onSelect, platform }) => {
  const { socialSettings } = useStore();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      // Decode JWT payload locally (Standard browser approach)
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const user = JSON.parse(jsonPayload);
      onSelect({
        name: user.name,
        email: user.email,
        avatar: user.picture
      });
    } catch (err) {
      setError('Failed to process Google account data.');
    }
  };

  const handleFacebookCallback = (response: any) => {
    if (response.status !== 'unknown' && response.accessToken) {
      onSelect({
        name: response.name,
        email: response.email || `${response.id}@facebook.user`,
        avatar: response.picture?.data?.url || `https://graph.facebook.com/${response.id}/picture?type=large`
      });
    } else {
      setError('Facebook login was cancelled or failed.');
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  // Validation: Ensure Admin has configured the keys
  const configMissing = platform === 'Google' ? !socialSettings.google_client_id : !socialSettings.facebook_app_id;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={handleClose}></div>
      
      <div className="relative bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-700 p-10">
        <button onClick={handleClose} className="absolute top-8 right-8 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-10">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 mb-5 p-3 bg-orange-50 rounded-2xl flex items-center justify-center font-black text-[#f85606] text-2xl shadow-inner border border-orange-100">
            S
          </div>
          <h2 className="text-xl font-black text-gray-800 text-center leading-tight uppercase italic tracking-tight">Connect with {platform}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">SECURE SINGLE SIGN-ON</p>
        </div>

        {configMissing ? (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col items-center text-center">
             <AlertCircle size={32} className="text-red-400 mb-3" />
             <p className="text-xs font-bold text-red-700 uppercase tracking-tight leading-relaxed">
               {platform} login is currently disabled by the administrator. 
               Please contact support or configure your {platform === 'Google' ? 'Client ID' : 'App ID'} in settings.
             </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-6">
            {error && (
              <div className="w-full p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 animate-in shake duration-300">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="w-full flex justify-center">
              {platform === 'Google' && socialSettings.google_client_id && (
                <GoogleOAuthProvider clientId={socialSettings.google_client_id}>
                  <div className="transform scale-125 origin-center">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={() => setError('Google Authentication Failed')}
                      useOneTap
                      shape="pill"
                    />
                  </div>
                </GoogleOAuthProvider>
              )}

              {platform === 'Facebook' && socialSettings.facebook_app_id && (
                <FacebookLogin
                  appId={socialSettings.facebook_app_id}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookCallback}
                  render={(renderProps: any) => (
                    <button 
                      onClick={renderProps.onClick}
                      className="w-full py-4 bg-[#1877f2] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all transform active:scale-95"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Login with Facebook
                    </button>
                  )}
                />
              )}
            </div>

            <div className="mt-4 p-4 bg-orange-50 rounded-2xl flex gap-3 border border-orange-100">
              <CheckCircle2 size={20} className="text-[#f85606] shrink-0" />
              <p className="text-[10px] text-orange-800 font-bold leading-relaxed uppercase tracking-wider">
                This app will only receive your public profile and email. We never post to your timeline or share your data.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t pt-8">
          <span className="hover:text-blue-600 cursor-pointer">Help</span>
          <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
          <span className="hover:text-blue-600 cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginModal;