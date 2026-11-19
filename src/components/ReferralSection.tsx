import React, { useState } from 'react';
import { Share2, Copy, Check, Users, Gift, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReferralSection: React.FC = () => {
  const { currentUser, showToast, setIsAuthModalOpen, setAuthModalMode } = useApp();
  const [copied, setCopied] = useState(false);

  const userReferCode = currentUser?.referCode || 'TM24REG';
  const referLink = `https://topmoney24.com/ref?user=${userReferCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referLink);
    setCopied(true);
    showToast('রেফারেল লিংক কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 text-center space-y-5 shadow-xs">
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
          <Share2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            বন্ধুদের ইনভাইট করে আজীবন আয় করুন!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            আপনার রেফারেল লিংক শেয়ার করুন। আপনার বন্ধু যুক্ত হয়ে যেকোনো প্যাকেজ অ্যাক্টিভ করলে আপনি পাবেন সরাসরি <strong className="text-blue-600 font-bold">১০% ইনস্ট্যান্ট ক্যাশ কমিশন</strong>!
          </p>
        </div>

        {/* Link Display Box */}
        {currentUser ? (
          <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-mono text-blue-700 truncate font-semibold w-full sm:w-auto text-left">
              {referLink}
            </span>
            <button
              onClick={copyToClipboard}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shrink-0 transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 max-w-md mx-auto text-center space-y-2">
            <p className="text-xs text-amber-800 font-semibold">
              আপনার ব্যক্তিগত রেফারেল লিংক পেতে অনুগ্রহ করে অ্যাকাউন্টে লগইন করুন।
            </p>
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              লগইন করুন
            </button>
          </div>
        )}

        {/* How it works 3-step grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">১</div>
            <h4 className="text-sm font-bold text-slate-800">লিংক শেয়ার করুন</h4>
            <p className="text-xs text-slate-500">ফেসবুক, হোয়াটসঅ্যাপ বা মেসেঞ্জারে বন্ধুদের কাছে আপনার রেফারেল লিংক পাঠান।</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-sm">২</div>
            <h4 className="text-sm font-bold text-slate-800">বন্ধু অ্যাকাউন্ট খুলবে</h4>
            <p className="text-xs text-slate-500">আপনার লিংকে ক্লিক করে অ্যাকাউন্ট তৈরি করবে এবং ৳৫০ ওয়েলকাম বোনাস পাবে।</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">৩</div>
            <h4 className="text-sm font-bold text-slate-800">১০% বোনাস পান</h4>
            <p className="text-xs text-slate-500">বন্ধু প্যাকেজ এক্টিভ করলেই তৎক্ষণাৎ ১০% কমিশন আপনার মেইন ব্যালেন্সে জমা হবে।</p>
          </div>
        </div>

      </div>
    </div>
  );
};
