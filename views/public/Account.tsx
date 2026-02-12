import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  MoreVertical, 
  Box, 
  Heart, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  Headphones,
  RotateCcw,
  XCircle,
  Ticket,
  Star,
  MapPin,
  CreditCard,
  User,
  Settings
} from '../../components/common/Icons';
import { useStore } from '../../context/StoreContext';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useStore();
  const [receiveEmail, setReceiveEmail] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserName(parsed.name || parsed.email.split('@')[0]);
    }
  }, []);

  const loggedInItems = [
    { label: 'Message', icon: MessageSquare, path: '/messages' },
    { label: 'My Orders', icon: Box, path: '/orders' },
    { label: 'My Returns', icon: RotateCcw, path: '/returns' },
    { label: 'My Cancellations', icon: XCircle, path: '/cancellations' },
    { label: 'My Wishlist & Followed Stores', icon: Heart, path: '/wishlist' },
    { label: 'Vouchers', icon: Ticket, path: '/vouchers' },
    { label: 'My Reviews', icon: Star, path: '/reviews' },
    { label: 'Address Book', icon: MapPin, path: '/address' },
    { label: 'My Payment Options', icon: CreditCard, path: '/payments' },
    { label: 'Account Information', icon: User, path: '/info' },
  ];

  const supportItems = [
    { label: 'Setting', icon: Settings, path: '/settings' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Feedback', icon: MessageSquare, path: '/feedback' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
    { label: 'Chat with us', icon: Headphones, path: '/chat' },
  ];

  const loggedOutMenuItems = [
    { label: 'My Orders', icon: Box, path: '/orders' },
    { label: 'My Wishlist & Followed Stores', icon: Heart, path: '/wishlist' },
  ];

  const loggedOutSupportItems = [
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Feedback', icon: MessageSquare, path: '/feedback' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
    { label: 'Chat with us', icon: Headphones, path: '/chat' },
  ];

  return (
    <div className="lg:hidden min-h-screen bg-[#f4f4f7] pb-20">
      {/* Header - Now sitting within padded container, looks modern and floating */}
      <div className="bg-[#f85606] text-white px-4 py-5 flex items-center justify-between shadow-lg rounded-2xl mt-4 mb-6 sticky top-4 z-50 transition-all">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-bold uppercase italic tracking-tighter">My Account</h1>
        </div>
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {!isLoggedIn ? (
        <>
          {/* Logged Out View */}
          <div className="bg-white px-5 py-6 mb-4 flex items-center justify-between rounded-2xl shadow-sm border border-gray-100">
            <div>
              <p className="text-sm font-black text-gray-800 uppercase tracking-tighter italic">Hello, Guest!</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Welcome to SuperStore</p>
            </div>
            <Link 
              to="/login"
              className="bg-[#f85606] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.1em] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
            >
              LOGIN
            </Link>
          </div>

          <div className="bg-white mb-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loggedOutMenuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-5 py-5 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className="text-[#f85606]" strokeWidth={2} />
                  <span className="text-[11px] text-gray-700 font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loggedOutSupportItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-5 py-5 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className="text-gray-400" strokeWidth={2} />
                  <span className="text-[11px] text-gray-700 font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Logged In View */}
          <div className="bg-white px-5 py-6 mb-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#f85606] font-black shadow-inner border border-orange-100">
               {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black text-gray-800 uppercase tracking-tighter italic">Hello, {userName}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> PRO MEMBER
              </p>
            </div>
          </div>

          <div className="bg-white mb-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loggedInItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className="text-[#f85606]" strokeWidth={2} />
                  <span className="text-[11px] text-gray-700 font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="bg-white mb-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {supportItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className="text-gray-400" strokeWidth={2} />
                  <span className="text-[11px] text-gray-700 font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Email Promotion Toggle */}
          <div className="bg-white px-5 py-6 mb-10 flex items-center justify-between rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-relaxed max-w-[70%]">
              Receive exclusive offers and secret promotions via email
            </p>
            <button 
              onClick={() => setReceiveEmail(!receiveEmail)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                receiveEmail ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  receiveEmail ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </>
      )}
      
      {/* Bottom Padding for BottomNav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Account;