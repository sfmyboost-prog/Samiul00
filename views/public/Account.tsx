
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
      // If name is too long or contains spaces, we might just show a snippet or the raw name
      // Screenshot shows "md4518199", which looks like a username
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
    <div className="lg:hidden min-h-screen bg-[#f4f4f7] -mx-4 pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#f85606] text-white px-4 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-medium">My Account</h1>
        </div>
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {!isLoggedIn ? (
        <>
          {/* Logged Out View */}
          <div className="bg-white px-4 py-5 mb-3 flex items-center justify-between">
            <p className="text-sm text-gray-700">Hello, Welcome to Daraz!</p>
            <Link 
              to="/login"
              className="bg-[#f85606] text-white px-5 py-2 rounded-md text-sm font-bold uppercase tracking-tight shadow-md active:scale-95 transition-transform"
            >
              LOGIN / SIGNUP
            </Link>
          </div>

          <div className="bg-white mb-3">
            {loggedOutMenuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-4 py-5 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={22} className="text-gray-400" />
                  <span className="text-base text-gray-800 font-normal">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="bg-white">
            {loggedOutSupportItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-4 py-5 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={22} className="text-gray-400" />
                  <span className="text-base text-gray-800 font-normal">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Logged In View */}
          <div className="bg-white px-4 py-5 mb-3">
            <p className="text-sm text-gray-700">Hello, {userName}</p>
          </div>

          <div className="bg-white mb-3 shadow-sm">
            {loggedInItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-4 py-4 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={22} className="text-gray-400" strokeWidth={1.5} />
                  <span className="text-base text-gray-800 font-normal">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="bg-white mb-3 shadow-sm">
            {supportItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center gap-4 px-4 py-4 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Icon size={22} className="text-gray-400" strokeWidth={1.5} />
                  <span className="text-base text-gray-800 font-normal">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Email Promotion Toggle */}
          <div className="bg-white px-4 py-6 mb-10 flex items-center justify-between shadow-sm">
            <p className="text-sm text-gray-600 font-medium">I'd like to receive exclusive offers and promotions via email</p>
            <button 
              onClick={() => setReceiveEmail(!receiveEmail)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                receiveEmail ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
