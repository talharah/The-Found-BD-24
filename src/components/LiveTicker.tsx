import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveTicker: React.FC = () => {
  const { settings } = useApp();

  const liveUpdates = [
    '০১৭***৩৮: ৳১,৫০০ ক্যাশআউট সফল (বিকাশ)',
    '০১৮***৯০: ৳২,০০০ ডিপোজিট অনুমোদিত (নগদ)',
    '০১৯***১২: ৳৫,০০০ ভিআইপি প্ল্যান এক্টিভ করেছেন',
    '০১৫***৬৪: ৳৮০০ ক্যাশআউট সফল (রকেট)',
    '০১৬***৭৭: ৳১,০০০ ডিপোজিট অনুমোদিত (বিকাশ)',
    '০১৭***৫৫: ৳১,২০০ ক্যাশআউট সফল (নগদ)',
    '০১৮***৪৩: ৳১০,০০০ মাস্টার প্ল্যান এক্টিভ করেছেন'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % liveUpdates.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveUpdates.length]);

  return (
    <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 py-2 px-3 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        
        {/* Left: Security and verified badge */}
        <div className="flex items-center space-x-2 text-cyan-400">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> ভেরিফাইড প্ল্যাটফর্ম
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline-flex items-center text-slate-300 text-[11px]">
            <Users className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            মোট অ্যাক্টিভ সদস্য: <strong className="text-white ml-1 font-number">১,২৮,৭৪০ জন</strong>
          </span>
        </div>

        {/* Center/Right: Live dynamic transactions feed */}
        <div className="flex items-center space-x-2 text-[11px] truncate">
          <span className="text-amber-400 font-bold flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1 animate-pulse text-amber-400" />
            লাইভ লেনদেন:
          </span>
          <span className="text-cyan-300 font-medium transition-all duration-300">
            {liveUpdates[currentIndex]}
          </span>
        </div>

      </div>
    </div>
  );
};
