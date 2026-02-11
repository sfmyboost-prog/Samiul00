
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, CheckCircle2, X, Clock, Search } from '../../components/common/Icons';
import Toast, { ToastType } from '../../components/common/Toast';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: string;
  icon: string;
  isCompleted: boolean;
}

const CoinsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userCoins, addCoins, products, isLoggedIn, setLoginModalOpen, formatPrice } = useStore();
  
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  
  // 24h Cooldown Logic
  const [lastClaimTimestamp, setLastClaimTimestamp] = useState<number | null>(() => {
    const saved = localStorage.getItem('last_coin_claim_time');
    return saved ? parseInt(saved) : null;
  });
  
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isClaimReady, setIsClaimReady] = useState(true);

  // Mission State
  const [missions, setMissions] = useState<Mission[]>([
    { id: '1', title: 'Browse Coins Channel for 10s', description: 'Explore to find 40% off items and earn 100 coins.', reward: 100, progress: '0/10', icon: '💰', isCompleted: false },
    { id: '2', title: 'Share, Invite & Win Free Prizes', description: 'Play for 10 seconds & earn 200 Coins', reward: 200, progress: '0/1', icon: '🎁', isCompleted: false },
    { id: '3', title: 'As Low As Tk.70', description: 'Browse for 10 seconds and earn 50 Coins', reward: 50, progress: '0/1', icon: '🏷️', isCompleted: false },
    { id: '4', title: 'Turn On Notifications!', description: 'Earn 100 Coins', reward: 100, progress: '0/1', icon: '🔔', isCompleted: false },
  ]);

  useEffect(() => {
    const updateTimer = () => {
      if (!lastClaimTimestamp) {
        setIsClaimReady(true);
        return;
      }

      const now = Date.now();
      const nextAvailable = lastClaimTimestamp + (24 * 60 * 60 * 1000); 
      const diff = nextAvailable - now;

      if (diff <= 0) {
        setIsClaimReady(true);
        setTimeLeft('');
      } else {
        setIsClaimReady(false);
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [lastClaimTimestamp]);

  const handleCheckIn = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    
    if (!isClaimReady) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      const now = Date.now();
      addCoins(200);
      setLastClaimTimestamp(now);
      localStorage.setItem('last_coin_claim_time', now.toString());
      setToast({ message: '200 coins added to your bag!', type: 'success' });
      
      setTimeout(() => {
        setIsAnimating(false);
        setIsMissionsModalOpen(true);
      }, 1800);
    }, 100);
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.isCompleted) {
        addCoins(m.reward);
        setToast({ message: `${m.reward} coins earned!`, type: 'success' });
        return { ...m, isCompleted: true, progress: m.id === '1' ? '10/10' : '1/1' };
      }
      return m;
    }));
  };

  const handleProductCollect = (reward: number) => {
    addCoins(reward);
    setToast({ message: `${reward} coins collected!`, type: 'success' });
  };

  const streak = [
    { day: '13 Feb', amount: 320 },
    { day: '14 Feb', amount: 320 },
    { day: '15 Feb', amount: 330 },
  ];

  const coinDeals = products.filter(p => p.status === 'active').slice(0, 10);

  return (
    <div className="lg:hidden min-h-screen bg-[#fff9db] -mx-4 pb-32 overflow-x-hidden animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Jackpot Animation */}
      {isAnimating && (
        <div className="fixed inset-0 pointer-events-none z-[200]">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center border-2 border-yellow-600 shadow-2xl animate-coin-fly"
              style={{
                background: 'radial-gradient(circle, #fbbf24 0%, #d97706 100%)',
                left: '40vw',
                top: '40vh',
                animationDelay: `${i * 0.05}s`
              }}
            >
              <span className="text-[12px] font-black text-white">$</span>
            </div>
          ))}
        </div>
      )}

      {/* Header - Matching Screenshot 1 */}
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-800">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center font-black text-[#f85606] text-xs">S</div>
          <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight italic">Streak</h1>
        </div>
        <div className="bg-orange-50 px-3 py-1 rounded-full flex items-center gap-2 border border-orange-200">
           <span className="text-xs font-black text-[#f85606]">{userCoins.toLocaleString()}</span>
           <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[7px] font-black text-white shadow-sm border border-yellow-600">$</div>
        </div>
      </div>

      {/* Inline Search - Matching Screenshot 1 */}
      <div className="px-4 py-3 bg-white border-b mb-4">
        <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden px-4">
           <Search size={18} className="text-gray-400" />
           <input 
            type="text" 
            placeholder="Search in SuperStore..." 
            className="flex-grow bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-gray-400 font-medium"
           />
        </div>
      </div>

      <div className="px-4">
        <p className="text-[11px] font-black text-gray-800 mb-6 uppercase tracking-tighter">
          {!isClaimReady ? 'COME BACK TOMORROW AND WIN 300 COINS' : 'DAILY CHECK-IN: GET 200 COINS TODAY'}
        </p>

        {/* Streak Cards - Refined Visuals */}
        <div className="flex gap-2.5 overflow-x-auto pb-6 no-scrollbar">
          {/* Today Card - With Checkmark Logic */}
          <div className="flex-shrink-0 w-[110px] bg-white rounded-2xl p-4 flex flex-col items-center justify-center h-32 shadow-sm relative overflow-hidden">
             <span className="text-[9px] font-bold text-gray-400 absolute top-3">Today</span>
             <div className="relative mt-2">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-b-4 border-yellow-800/20 relative">
                   <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-lg">$</span>
                   </div>
                </div>
                {!isClaimReady && (
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in">
                      <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                   </div>
                )}
             </div>
             <div className="mt-3 bg-orange-500 text-white px-5 py-0.5 rounded-full text-[10px] font-black uppercase">200</div>
          </div>

          {/* Tomorrow Card */}
          <div className={`flex-shrink-0 w-[110px] bg-white rounded-2xl p-4 flex flex-col items-center justify-center h-32 shadow-sm relative overflow-hidden ${!isClaimReady ? 'border-2 border-orange-500' : ''}`}>
             <span className="text-[9px] font-bold text-gray-400 absolute top-3">Collect Tomorrow</span>
             <div className="relative mt-2 flex -space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-b-2 border-gray-400/20 z-0">
                  <span className="text-gray-400 font-black text-xs">$</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-full flex items-center justify-center shadow-md border-b-2 border-yellow-700/20 z-10">
                   <span className="text-white font-black text-xs">$</span>
                </div>
             </div>
             <div className="mt-3 bg-[#1e1e2d] text-white px-5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                <span>🔒</span> 300
             </div>
          </div>

          {/* Future Cards */}
          {streak.map((s, i) => (
            <div key={i} className="flex-shrink-0 w-[100px] bg-white/40 rounded-2xl p-4 flex flex-col items-center justify-center h-32 border border-white/50 grayscale opacity-60">
               <span className="text-[8px] font-bold text-gray-400 absolute top-3">{s.day}</span>
               <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shadow-inner border-b-2 border-gray-400/20">
                  <span className="text-gray-400 font-black text-sm">$</span>
               </div>
               <div className="mt-3 flex items-center gap-1 bg-gray-500/80 text-white px-4 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
                  <span>🔒</span> {s.amount}
               </div>
            </div>
          ))}
        </div>

        {/* Action Button Section */}
        <div className="mt-4 flex flex-col items-center">
          <button 
            onClick={isClaimReady ? handleCheckIn : () => setIsMissionsModalOpen(true)}
            className={`w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-lg border-2 ${
              isClaimReady 
              ? 'bg-gradient-to-r from-[#ff0080] to-[#f85606] text-white border-transparent' 
              : 'bg-white border-pink-500 text-pink-500 shadow-pink-500/10'
            }`}
          >
            {isClaimReady ? 'Check-in' : 'Earn More'}
          </button>
          
          {!isClaimReady && (
            <p className="text-center text-[9px] font-bold text-pink-400 mt-2.5 uppercase tracking-widest">
               NEXT CLAIM IN: {timeLeft}
            </p>
          )}
        </div>
      </div>

      {/* Banner */}
      <div className="mx-4 mt-10 h-44 rounded-[2rem] bg-gradient-to-r from-[#004d40] to-[#00695c] relative overflow-hidden flex items-center justify-center shadow-2xl">
         <div className="absolute inset-0 opacity-10 flex justify-between px-10 items-center pointer-events-none">
            <span className="text-9xl">🏮</span>
            <span className="text-9xl">🏮</span>
         </div>
         <div className="relative z-10 text-center text-white px-6">
            <h2 className="text-4xl font-black italic leading-tight tracking-tighter uppercase">UP TO 40% OFF</h2>
            <h3 className="text-xl font-black text-yellow-400 tracking-widest mt-1 uppercase">WITH COINS</h3>
            <button className="mt-5 bg-yellow-400 text-black px-10 py-2 rounded-full text-[9px] font-black uppercase shadow-xl hover:scale-105 transition-transform">Explore Now</button>
         </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 px-4 flex items-center gap-10 border-b border-gray-200/50 mb-8 overflow-x-auto no-scrollbar">
         <div className="pb-4 border-b-4 border-black font-black text-sm uppercase italic whitespace-nowrap">Deals with Coins</div>
         <div className="pb-4 text-gray-400 font-bold text-sm uppercase flex items-center gap-2 whitespace-nowrap">
            <Clock size={16} /> Viewed
         </div>
         <div className="pb-4 text-gray-400 font-bold text-sm uppercase whitespace-nowrap">Hot Selling</div>
      </div>

      {/* Product Grid Area - With Collect Reward Feature (Matching Screenshot 2) */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {coinDeals.map(product => {
           const coinDiscountVal = userCoins / 100;
           const finalPrice = Math.max(0, product.price - coinDiscountVal);
           return (
              <div key={product.id} className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl transition-all group animate-in slide-in-from-bottom-2 duration-500">
                 <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Link to={`/product/${product.id}`}>
                       <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                    </Link>
                    
                    {/* Collect Reward Overlay - Matching Screenshot 2 */}
                    <div className="absolute bottom-2 right-2 flex flex-col items-center animate-in zoom-in">
                       <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-2 border-white shadow-xl flex flex-col items-center justify-center">
                          <span className="text-[14px] leading-none mb-0.5">💰</span>
                          <span className="text-[8px] font-black text-orange-700">+100</span>
                       </div>
                       <button 
                        onClick={() => handleProductCollect(100)}
                        className="mt-1 bg-[#ff0080] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase shadow-lg shadow-pink-500/20 active:scale-90 transition-transform"
                       >
                         Collect
                       </button>
                    </div>

                    <div className="absolute top-3 left-3 bg-[#ff0080] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Today's deal</div>
                 </div>
                 
                 <div className="p-4 flex-grow flex flex-col">
                    <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight mb-3 uppercase tracking-tight">{product.name}</h4>
                    <div className="flex items-center gap-1.5 text-yellow-400 mb-4">
                       <span className="text-[12px]">★</span>
                       <span className="text-[10px] text-gray-400 font-bold">4.5(999+)</span>
                    </div>
                    <div className="mt-auto">
                       <span className="text-base font-black text-[#f85606] tracking-tighter">৳{finalPrice.toLocaleString()}</span>
                       <div className="flex items-center gap-1 mt-1.5 opacity-80">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">With Coins</span>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center text-[7px] text-white font-black">$</div>
                       </div>
                       <div className="mt-4 bg-yellow-50 px-3 py-1.5 rounded-xl flex items-center justify-between border border-yellow-100/50">
                          <span className="text-[9px] font-black text-yellow-700 uppercase tracking-widest">Saved 1% OFF</span>
                       </div>
                    </div>
                 </div>
              </div>
           );
        })}
      </div>

      {/* Mission Modal */}
      {isMissionsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMissionsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-500 border border-gray-100">
            <div className="relative pt-10 pb-6 flex flex-col items-center">
               <button onClick={() => setIsMissionsModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-600 transition-colors">
                  <X size={24} />
               </button>
               <div className="flex items-center justify-center -space-x-3 mb-4 scale-125">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg border border-yellow-500">💰</div>
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl border-2 border-white z-10 font-black text-white text-xl shadow-yellow-500/20">S</div>
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg border border-yellow-500">💰</div>
               </div>
               <div className="bg-[#fff3c7] px-10 py-2.5 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-black text-[#8d5d04] uppercase tracking-tighter italic">Today's mission</h3>
               </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-10">
              {missions.map((m) => (
                <div key={m.id} className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-gray-50">
                    {m.icon}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-[11px] font-black text-gray-800 leading-tight mb-1 uppercase tracking-tight">{m.title}</h4>
                    <p className="text-[9px] text-gray-400 font-bold leading-tight mb-3 uppercase tracking-tighter">{m.description}</p>
                    
                    <div className="flex items-center gap-3">
                       <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                          <div 
                            className={`h-full transition-all duration-1000 ${m.isCompleted ? 'bg-green-500 w-full' : 'bg-orange-500 w-[10%]'}`}
                          />
                       </div>
                       <span className="text-[10px] font-black text-gray-300 uppercase italic">{m.progress}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                       <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm">$</div>
                       <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{m.reward} Coins</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => completeMission(m.id)}
                      disabled={m.isCompleted}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all transform active:scale-90 ${
                        m.isCompleted 
                        ? 'bg-gray-100 text-gray-400 shadow-none' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      }`}
                    >
                      {m.isCompleted ? 'Done' : 'Go'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes coin-fly {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(calc(30vw), calc(-45vh)) scale(0.1); opacity: 0; }
        }
        .animate-coin-fly {
          animation: coin-fly 1.5s cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CoinsPage;
