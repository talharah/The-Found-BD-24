import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CashbackOffers: React.FC = () => {
  const { currentUser, setIsDepositModalOpen, setIsAuthModalOpen, setAuthModalMode } = useApp();

  const offers = [
    {
      id: 1,
      badge: 'ইনস্ট্যান্ট বোনাস',
      badgeColor: 'bg-amber-400 text-slate-950',
      title: 'স্টার্টার অফার',
      depositAmount: 1500,
      bonusAmount: 300,
      gradient: 'from-amber-500/10 via-amber-500/5 to-slate-900 border-amber-500/30 text-amber-400',
      buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950'
    },
    {
      id: 2,
      badge: 'জনপ্রিয় অফার',
      badgeColor: 'bg-cyan-400 text-slate-950',
      title: 'স্মার্ট অফার',
      depositAmount: 2000,
      bonusAmount: 500,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-slate-900 border-cyan-500/30 text-cyan-400',
      buttonBg: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
    },
    {
      id: 3,
      badge: 'মেগা অফার',
      badgeColor: 'bg-purple-400 text-white',
      title: 'প্রো অফার',
      depositAmount: 5000,
      bonusAmount: 1200,
      gradient: 'from-purple-500/10 via-purple-500/5 to-slate-900 border-purple-500/30 text-purple-400',
      buttonBg: 'bg-purple-500 hover:bg-purple-400 text-white'
    },
    {
      id: 4,
      badge: 'ভিআইপি স্পেশাল',
      badgeColor: 'bg-emerald-400 text-slate-950',
      title: 'কিং অফার',
      depositAmount: 20000,
      bonusAmount: 5000,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-slate-900 border-emerald-500/30 text-emerald-400',
      buttonBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
    }
  ];

  const handleClaim = (amount: number) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsDepositModalOpen(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center">
          <Flame className="w-5 h-5 text-amber-500 mr-2 animate-bounce" />
          সীমিত সময়ের স্পেশাল ক্যাশব্যাক অফার!
        </h2>
        <span className="text-xs text-blue-600 font-bold hidden sm:inline-flex items-center">
          স্লাইড করে দেখুন <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </span>
      </div>

      {/* Horizontal Scrollable Offers */}
      <div className="flex space-x-4 overflow-x-auto pb-3 pt-1 hide-scrollbar">
        {offers.map(offer => (
          <div
            key={offer.id}
            className={`shrink-0 w-72 sm:w-80 rounded-2xl bg-gradient-to-br ${offer.gradient} p-4 border relative space-y-2.5 shadow-sm hover:shadow-md transition`}
          >
            <span className={`absolute top-3.5 right-3.5 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${offer.badgeColor}`}>
              {offer.badge}
            </span>

            <div className="text-xs font-bold uppercase tracking-wider">{offer.title}</div>
            
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-number">
              ৳ {offer.depositAmount.toLocaleString('en-IN')} জমা
            </div>
            
            <div className="text-emerald-700 text-xs sm:text-sm font-extrabold flex items-center">
              + ৳ {offer.bonusAmount.toLocaleString('en-IN')} ইনস্ট্যান্ট ক্যাশব্যাক বোনাস!
            </div>

            <button
              onClick={() => handleClaim(offer.depositAmount)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1 ${offer.buttonBg}`}
            >
              <span>অফারটি গ্রহণ করুন</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
