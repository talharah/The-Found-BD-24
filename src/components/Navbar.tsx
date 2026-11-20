import React, { useState } from 'react';
import { 
  Wallet, 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  LogOut, 
  ListCheck, 
  Gem, 
  Share2, 
  Clock, 
  Home, 
  Info,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
  PlusCircle,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MainTabType } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    setIsAuthModalOpen, 
    setAuthModalMode,
    setIsAdminModalOpen,
    logout 
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const navItems: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'হোম', icon: <Home className="w-4 h-4" /> },
    { id: 'tasks', label: 'ডেইলি টাস্ক', icon: <ListCheck className="w-4 h-4" /> },
    { id: 'packages', label: 'প্যাকেজ প্ল্যান', icon: <Gem className="w-4 h-4" /> },
    { id: 'transactions', label: 'লেনদেন হিস্ট্রি', icon: <Clock className="w-4 h-4" /> },
    { id: 'referral', label: 'রেফারেল', icon: <Share2 className="w-4 h-4" /> },
    { id: 'about', label: 'আমাদের পরিচিতি', icon: <Info className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-cyan-400 font-black text-base italic tracking-tighter">TF</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none flex items-center">
              Top Money <span className="text-blue-600 ml-1">24</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Earn • Task • Withdraw
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/70'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {currentUser ? (
            <>
              {/* Live Balance Badge with Quick Deposit Action */}
              <div className="bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-800 font-semibold leading-none">ব্যালেন্স</div>
                  <div className="text-xs sm:text-sm font-black text-emerald-700 font-number">
                    ৳ {currentUser.balance.toFixed(2)}
                  </div>
                </div>
                <div className="flex space-x-1 ml-1 border-l border-emerald-200 pl-1.5">
                  <button 
                    onClick={() => setIsDepositModalOpen(true)}
                    title="ডিপোজিট করুন"
                    className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    title="উইথড্র করুন"
                    className="p-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.slice(0, 1)}
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 font-number">{currentUser.phone}</p>
                      {currentUser.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          সুপার অ্যাডমিন মোড
                        </span>
                      )}
                    </div>

                    {/* Admin Direct Option (Only visible when logged in as admin) */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsAdminModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                        <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveTab('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>আমার প্রোফাইল</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveTab('transactions');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>লেনদেন হিস্ট্রি</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged Out View - Just Login and Registration (NO ADMIN BUTTON) */
            <div className="flex items-center space-x-2">
              <button
                onClick={handleOpenLogin}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>

              <button
                onClick={handleOpenRegister}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 shadow-sm shadow-blue-500/20 transition flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>রেজিস্ট্রেশন</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
