import React, { useState } from 'react';
import { Gem, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Package } from '../types';

export const PackagesSection: React.FC = () => {
  const { packages, subscribePackage } = useApp();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  const handleSubscribe = (pkg: Package) => {
    setSelectedPkg(pkg);
  };

  const confirmSubscription = () => {
    if (selectedPkg) {
      subscribePackage(selectedPkg.id);
      setSelectedPkg(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center">
            <Gem className="w-6 h-6 text-blue-600 mr-2" />
            আয়ের প্রিমিয়াম প্যাকেজসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            আপনার পছন্দের প্ল্যান সিলেক্ট করে আজই দৈনিক আয় ও বোনাস নিশ্চিত করুন
          </p>
        </div>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              pkg.popular 
                ? 'bg-gradient-to-b from-blue-50/80 to-white border-blue-400 shadow-md relative ring-2 ring-blue-500/20' 
                : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {pkg.badge || 'জনপ্রিয় প্ল্যান'}
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{pkg.name}</span>
                {pkg.badge && !pkg.popular && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-number">
                  ৳ {pkg.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ প্যাকেজ ফি</span>
              </div>

              {pkg.description && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pkg.description}
                </p>
              )}

              {/* Package Specs List */}
              <div className="space-y-2.5 text-xs text-slate-700 border-t border-b border-slate-100 py-3.5 my-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                    দৈনিক নির্দিষ্ট আয়:
                  </span>
                  <strong className="text-emerald-700 font-bold font-number text-sm">
                    ৳ {pkg.dailyEarning.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center">
                    <Check className="w-3.5 h-3.5 text-cyan-500 mr-1.5" />
                    প্যাকেজের মেয়াদ:
                  </span>
                  <strong className="text-slate-800 font-bold font-number">
                    {pkg.validityDays} দিন
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center">
                    <Check className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                    বোনাস রিওয়ার্ড পয়েন্ট:
                  </span>
                  <strong className="text-amber-700 font-bold font-number">
                    {pkg.bonusPoints.toLocaleString('en-IN')} পয়েন্ট
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center">
                    <Check className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                    সম্ভাব্য মোট প্রফিট:
                  </span>
                  <strong className="text-blue-700 font-extrabold font-number">
                    ৳ {(pkg.dailyEarning * pkg.validityDays).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSubscribe(pkg)}
              className={`w-full py-3 mt-2 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 ${
                pkg.popular
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>প্যাকেজ এক্টিভ করুন</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                প্যাকেজ অ্যাক্টিভেশন নিশ্চিতকরণ
              </h3>
              <p className="text-xs text-slate-500">
                আপনি কি <strong className="text-blue-600 font-bold">{selectedPkg.name}</strong> প্যাকেজটি নিশ্চিতভাবে এক্টিভ করতে চান?
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 text-xs space-y-2 border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500">প্যাকেজ মূল্য:</span>
                <span className="font-bold text-slate-900 font-number">৳ {selectedPkg.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">দৈনিক আয়:</span>
                <span className="font-bold text-emerald-600 font-number">৳ {selectedPkg.dailyEarning}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মেয়াদ:</span>
                <span className="font-bold text-slate-700 font-number">{selectedPkg.validityDays} দিন</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setSelectedPkg(null)}
                className="py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition"
              >
                বাতিল
              </button>
              <button
                onClick={confirmSubscription}
                className="py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 font-bold text-xs text-white hover:brightness-105 shadow-sm transition"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
