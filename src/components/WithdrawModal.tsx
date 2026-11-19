import React, { useState } from 'react';
import { X, ArrowUpRight, Wallet, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

export const WithdrawModal: React.FC = () => {
  const { 
    isWithdrawModalOpen, 
    setIsWithdrawModalOpen, 
    currentUser, 
    submitWithdraw, 
    settings,
    adminPaymentNumbers,
    showToast
  } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [accountNumber, setAccountNumber] = useState<string>(currentUser?.phone || '');
  const [amount, setAmount] = useState<string>('300');

  if (!isWithdrawModalOpen || !currentUser) return null;

  const numAmount = parseFloat(amount) || 0;
  const fee = (numAmount * settings.withdrawFeePercent) / 100;
  const finalPayable = Math.max(0, numAmount - fee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < settings.minWithdraw) {
      showToast(`সর্বনিম্ন উইথড্রয়াল পরিমাণ ৳${settings.minWithdraw} টাকা।`, 'error');
      return;
    }

    if (numAmount > currentUser.balance) {
      showToast(`আপনার বর্তমান ব্যালেন্স ৳${currentUser.balance.toFixed(2)}, যা উত্তোলনের চেয়ে কম!`, 'error');
      return;
    }

    if (!accountNumber.trim()) {
      showToast('অনুগ্রহ করে সঠিক মোবাইল অ্যাকাউন্ট নম্বর প্রদান করুন।', 'error');
      return;
    }

    submitWithdraw(numAmount, method, accountNumber);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsWithdrawModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">টাকা তুলুন (উইথড্রয়াল)</h3>
            <p className="text-xs text-slate-500">আপনার মোবাইল ওয়ালেটে সরাসরি টাকা ক্যাশআউট নিন</p>
          </div>
        </div>

        {/* Current Balance Pill */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-cyan-300" />
            <span className="text-xs font-semibold text-blue-100">উত্তোলনযোগ্য ব্যালেন্স:</span>
          </div>
          <span className="text-lg font-black text-emerald-300 font-number">
            ৳ {currentUser.balance.toFixed(2)}
          </span>
        </div>

        {/* Withdraw Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পেমেন্ট মেথড নির্বাচন করুন</label>
            <div className="grid grid-cols-3 gap-2">
              {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    method === m 
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {method} মোবাইল অ্যাকাউন্ট নম্বর
            </label>
            <input
              type="tel"
              required
              placeholder="01xxxxxxxxx"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-number focus:bg-white focus:border-amber-500 focus:outline-hidden transition font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
              <span>উইথড্র পরিমাণ (৳)</span>
              <span className="text-[10px] text-slate-400">সর্বনিম্ন ৳{settings.minWithdraw}</span>
            </label>
            <input
              type="number"
              min={settings.minWithdraw}
              max={currentUser.balance}
              step="50"
              required
              placeholder="৩০০"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-bold font-number focus:bg-white focus:border-amber-500 focus:outline-hidden transition"
            />
          </div>

          {/* Breakdown summary */}
          <div className="bg-slate-50 rounded-2xl p-3.5 text-xs space-y-1.5 border border-slate-200">
            <div className="flex justify-between text-slate-500">
              <span>সার্ভিস চার্জ ({settings.withdrawFeePercent}%):</span>
              <span className="font-number">৳ {fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
              <span>আপনি পাবেন:</span>
              <span className="text-emerald-700 font-number text-sm">৳ {finalPayable.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-1.5 shrink-0 mt-0.5" />
            <span>{adminPaymentNumbers.withdrawNotice}</span>
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl btn-3d-amber text-slate-950 font-black text-sm transition flex items-center justify-center space-x-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>উইথড্র রিকোয়েস্ট সাবমিট করুন</span>
          </button>
        </form>

      </div>
    </div>
  );
};
