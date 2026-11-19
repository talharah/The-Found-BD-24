import React, { useState } from 'react';
import { X, LogIn, UserPlus, Phone, Lock, User as UserIcon, Gift, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register 
  } = useApp();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referCode, setReferCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalMode === 'login') {
      const res = await login(phone, password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } else {
      const res = await register(name, phone, password, referCode);
      if (res.success) {
        setPassword('');
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
            {authModalMode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {authModalMode === 'login' ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </h3>
          <p className="text-xs text-slate-500">
            {authModalMode === 'login' 
              ? 'আপনার রেজিস্টার্ড মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন'
              : 'Top Money 24 এ যোগ দিয়ে আয় শুরু করুন'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition ${
              authModalMode === 'login' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition ${
              authModalMode === 'register' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            রেজিস্ট্রেশন
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ আরিফুল ইসলাম"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="018xxxxxxxx"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-number focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="গোপন পাসওয়ার্ড লিখুন"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>রেফারেল কোড (ঐচ্ছিক)</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                  <Gift className="w-3 h-3 mr-0.5" /> +৳৫০ বোনাস
                </span>
              </label>
              <input
                type="text"
                placeholder="যেমন: ARIF24"
                value={referCode}
                onChange={e => setReferCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono uppercase focus:bg-white focus:border-blue-500 focus:outline-hidden transition"
              />
            </div>
          )}

          {authModalMode === 'register' && (
            <p className="text-[11px] text-blue-700 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/80 leading-relaxed text-center">
              📌 রেজিস্ট্রেশনের সময় ব্যালেন্স <strong>৳০.০০</strong> থাকবে। রেজিস্ট্রেশন শেষে অ্যাকাউন্টে প্রথমবার লগইন করলেই ওয়েলকাম বোনাসের টাকা অ্যাকাউন্টে যুক্ত হবে।
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 transition pt-3"
          >
            {authModalMode === 'login' ? 'লগইন করুন' : 'রেজিস্ট্রেশন সম্পন্ন করুন'}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-3 text-center">
          <p className="text-[11px] text-slate-500">
            {authModalMode === 'login' ? (
              <>
                অ্যাকাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  নতুন অ্যাকাউন্ট খুলুন
                </button>
              </>
            ) : (
              <>
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  লগইন করুন
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};
