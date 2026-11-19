import React, { useState } from 'react';
import { X, Copy, Check, Wallet, ArrowDownLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

export const DepositModal: React.FC = () => {
  const { 
    isDepositModalOpen, 
    setIsDepositModalOpen, 
    adminPaymentNumbers, 
    submitDeposit,
    settings,
    currentUser,
    showToast
  } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [amount, setAmount] = useState<string>('500');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);

  if (!isDepositModalOpen) return null;

  const quickAmounts = [200, 500, 1000, 1500, 2000, 5000];

  const handleCopy = (number: string, meth: string) => {
    navigator.clipboard.writeText(number);
    setCopiedMethod(meth);
    showToast(`${meth} নম্বর কপি হয়েছে: ${number}`, 'success');
    setTimeout(() => setCopiedMethod(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < settings.minDeposit) {
      showToast(`সর্বনিম্ন ডিপোজিট ৳${settings.minDeposit} টাকা হতে হবে।`, 'error');
      return;
    }

    if (!trxId.trim()) {
      showToast('অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।', 'error');
      return;
    }

    const success = await submitDeposit(numAmount, method, senderNumber || currentUser?.phone || '', trxId);
    if (success) {
      setTrxId('');
      setSenderNumber('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDepositModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">ডিপোজিট ফর্ম (টাকা জমা)</h3>
            <p className="text-xs text-slate-500">নিচের নম্বরে টাকা পাঠিয়ে ট্রানজেকশন আইডি দিয়ে সাবমিট করুন</p>
          </div>
        </div>

        {/* 3D Payment Numbers Box */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>সেন্ড মানি করার অফিশিয়াল নম্বরসমূহ:</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> ১০০% সুরক্ষিত
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            
            {/* bKash */}
            <div 
              onClick={() => {
                setMethod('bKash');
                handleCopy(adminPaymentNumbers.bKash, 'bKash');
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all card-3d ${
                method === 'bKash' 
                  ? 'border-pink-400 bg-pink-50/70 ring-2 ring-pink-500/20' 
                  : 'border-slate-200 bg-slate-50 hover:bg-pink-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-pink-700">bKash (বিকাশ)</span>
                {copiedMethod === 'bKash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="text-xs font-black font-mono text-slate-900 mt-1">
                {adminPaymentNumbers.bKash}
              </div>
              <div className="text-[9px] text-pink-600 font-semibold mt-0.5">
                {adminPaymentNumbers.bKashType}
              </div>
            </div>

            {/* Nagad */}
            <div 
              onClick={() => {
                setMethod('Nagad');
                handleCopy(adminPaymentNumbers.Nagad, 'Nagad');
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all card-3d ${
                method === 'Nagad' 
                  ? 'border-orange-400 bg-orange-50/70 ring-2 ring-orange-500/20' 
                  : 'border-slate-200 bg-slate-50 hover:bg-orange-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-700">Nagad (নগদ)</span>
                {copiedMethod === 'Nagad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="text-xs font-black font-mono text-slate-900 mt-1">
                {adminPaymentNumbers.Nagad}
              </div>
              <div className="text-[9px] text-orange-600 font-semibold mt-0.5">
                {adminPaymentNumbers.NagadType}
              </div>
            </div>

            {/* Rocket */}
            <div 
              onClick={() => {
                setMethod('Rocket');
                handleCopy(adminPaymentNumbers.Rocket, 'Rocket');
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all card-3d ${
                method === 'Rocket' 
                  ? 'border-purple-400 bg-purple-50/70 ring-2 ring-purple-500/20' 
                  : 'border-slate-200 bg-slate-50 hover:bg-purple-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700">Rocket (রকেট)</span>
                {copiedMethod === 'Rocket' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <div className="text-xs font-black font-mono text-slate-900 mt-1">
                {adminPaymentNumbers.Rocket}
              </div>
              <div className="text-[9px] text-purple-600 font-semibold mt-0.5">
                {adminPaymentNumbers.RocketType}
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-500 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 flex items-start">
            <AlertCircle className="w-4 h-4 text-blue-600 mr-1.5 shrink-0 mt-0.5" />
            <span>{adminPaymentNumbers.depositNotice}</span>
          </p>
        </div>

        {/* Deposit Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">নির্বাচিত পেমেন্ট মেথড</label>
            <div className="grid grid-cols-3 gap-2">
              {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    method === m 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
              <span>টাকার পরিমাণ (৳)</span>
              <span className="text-[10px] text-slate-400">সর্বনিম্ন ৳{settings.minDeposit}</span>
            </label>
            <input
              type="number"
              min={settings.minDeposit}
              step="50"
              required
              placeholder="যেমন: ৫০০"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-bold font-number focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(String(val))}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                >
                  ৳{val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              যে নম্বর থেকে টাকা পাঠিয়েছেন (সেন্ডার নম্বর)
            </label>
            <input
              type="tel"
              required
              placeholder="01xxxxxxxxx"
              value={senderNumber}
              onChange={e => setSenderNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-number focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ট্রানজেকশন আইডি (TrxID)
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: 9J7X8K2L বা TrxID লিখুন"
              value={trxId}
              onChange={e => setTrxId(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono uppercase font-bold focus:bg-white focus:border-blue-500 focus:outline-hidden transition tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl btn-3d-emerald text-white font-black text-sm transition mt-3 flex items-center justify-center space-x-1.5"
          >
            <Wallet className="w-4 h-4" />
            <span>ডিপোজিট রিকোয়েস্ট পাঠান</span>
          </button>
        </form>

      </div>
    </div>
  );
};
