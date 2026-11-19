import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Gem,
  PlusCircle,
  Calendar,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserDashboardTab: React.FC = () => {
  const { 
    currentUser, 
    deposits, 
    withdrawals, 
    userPackages,
    setIsDepositModalOpen, 
    setIsWithdrawModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    claimDailyPackageEarning
  } = useApp();

  const [activeHistoryTab, setActiveHistoryTab] = useState<'deposits' | 'withdrawals'>('deposits');

  if (!currentUser) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Wallet className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">আপনার অ্যাকাউন্টে লগইন করুন</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          ব্যালেন্স চেক, ডিপোজিট, উইথড্রয়াল এবং ট্রানজেকশন হিস্ট্রি দেখতে লগইন অথবা নতুন রেজিস্ট্রেশন করুন।
        </p>
        <div className="flex justify-center space-x-3 pt-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
          >
            লগইন করুন
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700"
          >
            রেজিস্ট্রেশন করুন
          </button>
        </div>
      </div>
    );
  }

  // Filter user's personal deposits and withdrawals
  const userDeposits = deposits.filter(d => d.userId === currentUser.id || d.userPhone === currentUser.phone);
  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id || w.userPhone === currentUser.phone);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> সফল
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 mr-1" /> বাতিল
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 mr-1" /> অপেক্ষমান
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Balance Cards */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
              {currentUser.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h2>
              <div className="text-xs text-blue-200 flex items-center space-x-2">
                <span>{currentUser.phone}</span>
                <span>•</span>
                <span>রেফারেল কোড: <strong className="text-cyan-300 font-mono">{currentUser.referCode}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2.5">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 font-black text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ডিপোজিট করুন</span>
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 border border-white/30 text-white font-bold text-xs transition flex items-center space-x-1.5"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-300" />
              <span>উইথড্র করুন</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs space-y-1">
            <div className="text-[11px] text-blue-200 font-semibold flex items-center">
              <Wallet className="w-3.5 h-3.5 mr-1 text-cyan-300" /> বর্তমান ব্যালেন্স
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-number">
              ৳ {currentUser.balance.toFixed(2)}
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs space-y-1">
            <div className="text-[11px] text-blue-200 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> মোট অর্জিত আয়
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-number">
              ৳ {currentUser.totalEarned.toFixed(2)}
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs space-y-1">
            <div className="text-[11px] text-blue-200 font-semibold flex items-center">
              <ArrowDownLeft className="w-3.5 h-3.5 mr-1 text-blue-300" /> মোট ডিপোজিট
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-number">
              ৳ {currentUser.totalDeposited.toFixed(2)}
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs space-y-1">
            <div className="text-[11px] text-blue-200 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-amber-400" /> মোট উইথড্রয়াল
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-number">
              ৳ {currentUser.totalWithdrawn.toFixed(2)}
            </div>
          </div>

        </div>
      </div>

      {/* Active Packages Section */}
      {userPackages.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center">
            <Gem className="w-5 h-5 text-blue-600 mr-2" />
            আপনার অ্যাক্টিভ প্ল্যানসমূহ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userPackages.map(upkg => (
              <div 
                key={upkg.id}
                className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{upkg.packageName}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      অ্যাক্টিভ
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-2 space-y-1">
                    <div className="flex justify-between"><span>দৈনিক ইনকাম:</span> <strong className="text-emerald-700">৳ {upkg.dailyEarning}</strong></div>
                    <div className="flex justify-between"><span>মেয়াদ বাকি:</span> <strong>{upkg.daysRemaining} দিন</strong></div>
                  </div>
                </div>

                <button
                  disabled={upkg.claimedToday}
                  onClick={() => claimDailyPackageEarning(upkg.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    upkg.claimedToday
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {upkg.claimedToday ? 'আজকের প্রফিট গ্রহণ করা হয়েছে ✓' : 'আজকের প্রফিট সংগ্রহ করুন (৳' + upkg.dailyEarning + ')'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              আপনার ব্যক্তিগত লেনদেন হিস্ট্রি
            </h3>
            <p className="text-xs text-slate-500">সকল ডিপোজিট ও উইথড্রয়াল আবেদনের রিয়েলটাইম স্ট্যাটাস</p>
          </div>

          {/* Tab Selector */}
          <div className="flex space-x-1.5 p-1 rounded-xl bg-slate-100 self-start sm:self-center">
            <button
              onClick={() => setActiveHistoryTab('deposits')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeHistoryTab === 'deposits' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ডিপোজিট ({userDeposits.length})
            </button>
            <button
              onClick={() => setActiveHistoryTab('withdrawals')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeHistoryTab === 'withdrawals' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              উইথড্রয়াল ({userWithdrawals.length})
            </button>
          </div>
        </div>

        {/* Deposits Table */}
        {activeHistoryTab === 'deposits' && (
          <div className="overflow-x-auto">
            {userDeposits.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                কোনো ডিপোজিট রেকর্ড পাওয়া যায়নি।
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3">তারিখ/সময়</th>
                    <th className="py-2.5 px-3">পেমেন্ট মেথড</th>
                    <th className="py-2.5 px-3">পরিমাণ (৳)</th>
                    <th className="py-2.5 px-3">TrxID</th>
                    <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userDeposits.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 text-slate-600">{d.createdAt}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">{d.method}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 font-number">৳ {d.amount}</td>
                      <td className="py-3 px-3 font-mono text-blue-600 font-bold">{d.trxId}</td>
                      <td className="py-3 px-3">
                        {getStatusBadge(d.status)}
                        {d.rejectionReason && (
                          <div className="text-[10px] text-rose-600 mt-0.5">{d.rejectionReason}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Withdrawals Table */}
        {activeHistoryTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            {userWithdrawals.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                কোনো উইথড্রয়াল রেকর্ড পাওয়া যায়নি।
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3">তারিখ/সময়</th>
                    <th className="py-2.5 px-3">মেথড ও নম্বর</th>
                    <th className="py-2.5 px-3">পরিমাণ (৳)</th>
                    <th className="py-2.5 px-3">রেফারেন্স</th>
                    <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userWithdrawals.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 text-slate-600">{w.createdAt}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{w.method}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{w.accountNumber}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 font-number">৳ {w.amount}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{w.adminReference || 'প্রসেসিং'}</td>
                      <td className="py-3 px-3">
                        {getStatusBadge(w.status)}
                        {w.rejectionReason && (
                          <div className="text-[10px] text-rose-600 mt-0.5">{w.rejectionReason}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
