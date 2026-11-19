import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LiveTicker } from './components/LiveTicker';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroCarousel } from './components/HeroCarousel';
import { CashbackOffers } from './components/CashbackOffers';
import { PackagesSection } from './components/PackagesSection';
import { TasksSection } from './components/TasksSection';
import { ReferralSection } from './components/ReferralSection';
import { MyTeamSection } from './components/MyTeamSection';
import { CertificatesSection } from './components/CertificatesSection';
import { UserDashboardTab } from './components/UserDashboardTab';
import { AboutSection } from './components/AboutSection';
import { UserAuthModal } from './components/UserAuthModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AdminPanel } from './components/AdminPanel';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  Send, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setIsAdminModalOpen, 
    toast 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 max-w-sm">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start space-x-3 text-xs font-bold ${
            toast.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : toast.type === 'info'
              ? 'bg-slate-900/95 text-cyan-300 border-cyan-700'
              : 'bg-emerald-900/95 text-emerald-100 border-emerald-600'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Announcements Live Ticker */}
      <LiveTicker />

      {/* Main Navbar */}
      <Navbar />

      {/* Floating Admin Trigger Bar (ONLY visible if logged-in user is admin) */}
      {currentUser?.role === 'admin' && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600/60 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>সুপার অ্যাডমিন সক্রিয়: সাগর আহমেদ (01825937544)</span>
            </div>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3.5 py-1 rounded-xl bg-slate-950 text-amber-400 font-black hover:bg-slate-900 transition flex items-center space-x-1"
            >
              <span>অ্যাডমিন কন্ট্রোল প্যানেল ওপেন করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Body App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <HeroCarousel />
            <CashbackOffers />
            <PackagesSection />
            <CertificatesSection />
          </div>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === 'tasks' && (
          <div className="animate-in fade-in duration-200">
            <TasksSection />
          </div>
        )}

        {/* TAB 3: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="animate-in fade-in duration-200">
            <PackagesSection />
          </div>
        )}

        {/* TAB 4: TRANSACTIONS / USER DASHBOARD */}
        {activeTab === 'transactions' && (
          <div className="animate-in fade-in duration-200">
            <UserDashboardTab />
          </div>
        )}

        {/* TAB 5: REFERRAL */}
        {activeTab === 'referral' && (
          <div className="animate-in fade-in duration-200 space-y-8">
            <ReferralSection />
            <MyTeamSection />
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-200">
            <UserDashboardTab />
          </div>
        )}

        {/* TAB 7: ABOUT */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in duration-200">
            <AboutSection />
          </div>
        )}

      </main>

      {/* Official Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black italic">
                  TF
                </div>
                <span className="text-lg font-black text-white">Top Money 24</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Top Money 24 বাংলাদেশের অন্যতম নির্ভরযোগ্য এবং দ্রুততম অনলাইন আর্নিং ও মাইক্রো-টাস্ক প্ল্যাটফর্ম।
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>নিরাপদ ও এনক্রিপ্টেড পেমেন্ট নেটওয়ার্ক</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">দ্রুত লিংক</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition">হোম পেজ</button></li>
                <li><button onClick={() => setActiveTab('tasks')} className="hover:text-cyan-400 transition">দৈনিক টাস্ক</button></li>
                <li><button onClick={() => setActiveTab('packages')} className="hover:text-cyan-400 transition">আয়ের প্যাকেজসমূহ</button></li>
                <li><button onClick={() => setActiveTab('referral')} className="hover:text-cyan-400 transition">১০% রেফারেল প্রোগ্রাম</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">লেনদেন মেথড</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>bKash (বিকাশ সেন্ড মানি)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Nagad (নগদ সেন্ড মানি)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Rocket (রকেট সেন্ড মানি)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">হেল্প ও সাপোর্ট</h4>
              <p className="text-slate-400 text-xs">
                যেকোনো প্রয়োজনে আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে যুক্ত থাকুন।
              </p>
              <div className="pt-1 flex flex-col space-y-2">
                <a
                  href="https://t.me/TopMoney24Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>টেলিগ্রাম সাপোর্ট গ্রুপ</span>
                </a>
                <a
                  href="https://wa.me/8801825937544"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপ হেল্পলাইন</span>
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              © 2026 Top Money 24. সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex space-x-4 text-[11px]">
              <button onClick={() => setActiveTab('about')} className="hover:text-slate-300">শর্তাবলি</button>
              <button onClick={() => setActiveTab('about')} className="hover:text-slate-300">গোপনীয়তা নীতি</button>
              <button onClick={() => setActiveTab('about')} className="hover:text-slate-300">নিরাপত্তা</button>
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Modals */}
      <UserAuthModal />
      <DepositModal />
      <WithdrawModal />
      <AdminPanel />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
