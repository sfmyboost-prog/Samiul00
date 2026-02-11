
import React from 'react';
import Header from '../components/public/Header';
import MobileHeader from '../components/public/MobileHeader';
import BottomNav from '../components/public/BottomNav';
import LoginModal from '../components/public/LoginModal';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f7]">
      <LoginModal />
      
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white sticky top-0 z-50">
        <div className="max-w-[1580px] mx-auto">
          <Header />
        </div>
      </div>
      
      {/* Mobile Header */}
      <MobileHeader />

      <main className="flex-grow w-full max-w-[1580px] mx-auto pb-32">
        {children}
      </main>

      <BottomNav />

      {/* Footer (Hidden on mobile for app-like feel) */}
      <footer className="hidden lg:block bg-white border-t py-12">
        <div className="max-w-[1580px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-tighter">Customer Care</h3>
            <ul className="space-y-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li className="hover:text-[#f85606] cursor-pointer">Help Center</li>
              <li className="hover:text-[#f85606] cursor-pointer">How to Buy</li>
              <li className="hover:text-[#f85606] cursor-pointer">Returns & Refunds</li>
              <li className="hover:text-[#f85606] cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-tighter">SuperStore</h3>
            <ul className="space-y-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li className="hover:text-[#f85606] cursor-pointer">About Us</li>
              <li className="hover:text-[#f85606] cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-[#f85606] cursor-pointer">Privacy Policy</li>
              <li className="hover:text-[#f85606] cursor-pointer">Careers</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-tighter">Payment Methods</h3>
            <div className="flex gap-4 flex-wrap grayscale opacity-50">
              <div className="w-12 h-8 bg-gray-100 rounded border"></div>
              <div className="w-12 h-8 bg-gray-100 rounded border"></div>
              <div className="w-12 h-8 bg-gray-100 rounded border"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-tighter">Follow Us</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border flex items-center justify-center text-[#f85606] font-black hover:bg-[#f85606] hover:text-white transition-all cursor-pointer">F</div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 border flex items-center justify-center text-[#f85606] font-black hover:bg-[#f85606] hover:text-white transition-all cursor-pointer">T</div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 border flex items-center justify-center text-[#f85606] font-black hover:bg-[#f85606] hover:text-white transition-all cursor-pointer">I</div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1580px] mx-auto px-4 mt-12 pt-8 border-t text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          © 2023 SuperStore Online. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
