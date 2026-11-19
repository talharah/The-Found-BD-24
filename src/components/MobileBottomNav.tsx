import React from 'react';
import { Home, ListCheck, Gem, Clock, User as UserIcon, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MainTabType } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, setIsAuthModalOpen, setAuthModalMode } = useApp();

  const handleAccountClick = () => {
    if (currentUser) {
      setActiveTab('profile');
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-1.5 px-2 z-40 shadow-lg">
      <div className="grid grid-cols-5 text-center">
        
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 ${
            activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">হোম</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center py-1 ${
            activeTab === 'tasks' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ListCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">টাস্ক</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`flex flex-col items-center py-1 ${
            activeTab === 'packages' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Gem className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">প্যাকেজ</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center py-1 ${
            activeTab === 'transactions' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">লেনদেন</span>
        </button>

        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center py-1 ${
            activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          {currentUser ? <UserIcon className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          <span className="text-[10px] mt-0.5">{currentUser ? 'প্রোফাইল' : 'লগইন'}</span>
        </button>

      </div>
    </div>
  );
};
