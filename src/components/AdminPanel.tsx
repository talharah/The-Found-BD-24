import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Phone, 
  Gem, 
  ListCheck, 
  Settings, 
  Check, 
  Copy, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Search, 
  Sliders, 
  RefreshCw,
  AlertTriangle,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Package, 
  Task, 
  PaymentMethod, 
  AdminPaymentNumbers, 
  PlatformSettings 
} from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    users, 
    deposits, 
    withdrawals, 
    packages, 
    tasks, 
    adminPaymentNumbers, 
    settings,
    updateUserBalance,
    toggleUserStatus,
    approveDeposit,
    rejectDeposit,
    completeWithdraw,
    rejectWithdraw,
    savePaymentNumbers,
    savePackage,
    deletePackage,
    saveTask,
    deleteTask,
    updateSettings,
    showToast
  } = useApp();

  type AdminTab = 'overview' | 'users' | 'deposits' | 'withdrawals' | 'numbers' | 'packages' | 'tasks' | 'settings';
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');

  // Search state for users
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // User Balance Control Modal State
  const [balanceModalUser, setBalanceModalUser] = useState<User | null>(null);
  const [balanceActionType, setBalanceActionType] = useState<'add' | 'deduct' | 'set'>('add');
  const [balanceAmount, setBalanceAmount] = useState<string>('500');
  const [balanceNote, setBalanceNote] = useState<string>('অ্যাডমিন অ্যাডজাস্টমেন্ট');

  // Filter tabs for deposits & withdrawals
  const [depositFilter, setDepositFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [withdrawFilter, setWithdrawFilter] = useState<'pending' | 'completed' | 'rejected'>('pending');

  // Payment Numbers Edit Form State
  const [editNumbers, setEditNumbers] = useState<AdminPaymentNumbers>(adminPaymentNumbers);

  // Settings Edit State
  const [editSettings, setEditSettings] = useState<PlatformSettings>(settings);

  // Package Edit Modal State
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [pkgForm, setPkgForm] = useState<Partial<Package>>({
    name: '',
    price: 500,
    dailyEarning: 50,
    validityDays: 30,
    bonusPoints: 600,
    popular: false,
    badge: ''
  });

  // Task Edit Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    reward: 15,
    type: 'youtube',
    link: 'https://youtube.com',
    instructions: '',
    durationSeconds: 60
  });

  if (!isAdminModalOpen) return null;

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
    u.phone.includes(userSearchQuery)
  );

  const filteredDeposits = deposits.filter(d => d.status === depositFilter);
  const filteredWithdrawals = withdrawals.filter(w => w.status === withdrawFilter);

  // Financial KPI calculations
  const totalUsersCount = users.length;
  const totalApprovedDeposits = deposits
    .filter(d => d.status === 'approved')
    .reduce((acc, d) => acc + d.amount, 0);
  const totalPendingDeposits = deposits
    .filter(d => d.status === 'pending')
    .reduce((acc, d) => acc + d.amount, 0);
  const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;

  const totalCompletedWithdrawals = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((acc, w) => acc + w.amount, 0);
  const totalPendingWithdrawals = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((acc, w) => acc + w.amount, 0);
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;

  // Balance Control Submit Handler
  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalUser) return;
    const num = parseFloat(balanceAmount);
    if (isNaN(num) || num < 0) {
      showToast('সঠিক টাকার পরিমাণ দিন।', 'error');
      return;
    }

    updateUserBalance(balanceModalUser.id, num, balanceActionType, balanceNote);
    setBalanceModalUser(null);
  };

  // Package Save Handler
  const handlePackageSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgForm.name || !pkgForm.price || !pkgForm.dailyEarning) {
      showToast('প্যাকেজের তথ্য সঠিকভাবে পূরণ করুন।', 'error');
      return;
    }

    const pkg: Package = {
      id: editingPackage?.id || 'pkg-' + Date.now(),
      name: pkgForm.name,
      price: Number(pkgForm.price),
      dailyEarning: Number(pkgForm.dailyEarning),
      validityDays: Number(pkgForm.validityDays) || 30,
      bonusPoints: Number(pkgForm.bonusPoints) || 0,
      popular: Boolean(pkgForm.popular),
      badge: pkgForm.badge || undefined,
      description: pkgForm.description || undefined
    };

    savePackage(pkg);
    setPackageModalOpen(false);
    setEditingPackage(null);
  };

  // Task Save Handler
  const handleTaskSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.reward) {
      showToast('টাস্কের তথ্য পূরণ করুন।', 'error');
      return;
    }

    const task: Task = {
      id: editingTask?.id || 'task-' + Date.now(),
      title: taskForm.title,
      reward: Number(taskForm.reward),
      type: taskForm.type || 'youtube',
      link: taskForm.link || '#',
      instructions: taskForm.instructions || '',
      durationSeconds: Number(taskForm.durationSeconds) || 60
    };

    saveTask(task);
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  সুপার অ্যাডমিন কন্ট্রোল প্যানেল
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[10px] font-bold">
                  লাইভ সিস্টেম
                </span>
              </div>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                অ্যাডমিন: সাগর আহমেদ (01825937544)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center space-x-1 overflow-x-auto hide-scrollbar">
          
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              activeAdminTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              activeAdminTab === 'users'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ইউজার ও ব্যালেন্স কন্ট্রোল ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('deposits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 relative ${
              activeAdminTab === 'deposits'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>ডিপোজিট রিকোয়েস্ট</span>
            {pendingDepositsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                {pendingDepositsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('withdrawals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 relative ${
              activeAdminTab === 'withdrawals'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>উইথড্র রিকোয়েস্ট</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('numbers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              activeAdminTab === 'numbers'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>পেমেন্ট নম্বর</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('packages')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              activeAdminTab === 'packages'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            <span>প্যাকেজ প্ল্যান ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('tasks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              activeAdminTab === 'tasks'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ListCheck className="w-3.5 h-3.5" />
            <span>টাস্ক ম্যানেজমেন্ট ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              activeAdminTab === 'settings'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>সাইট সেটিংস</span>
          </button>

        </div>

        {/* Content Body Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-200">
          
          {/* TAB 1: OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Alert for Pending Actions */}
              {(pendingDepositsCount > 0 || pendingWithdrawalsCount > 0) && (
                <div className="rounded-2xl bg-amber-500/15 border border-amber-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-300">
                  <div className="flex items-center space-x-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold">
                      {pendingDepositsCount} টি ডিপোজিট এবং {pendingWithdrawalsCount} টি উইথড্র রিকোয়েস্ট আপনার অনুমোদনের অপেক্ষায় আছে!
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {pendingDepositsCount > 0 && (
                      <button
                        onClick={() => setActiveAdminTab('deposits')}
                        className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs"
                      >
                        ডিপোজিট দেখুন
                      </button>
                    )}
                    {pendingWithdrawalsCount > 0 && (
                      <button
                        onClick={() => setActiveAdminTab('withdrawals')}
                        className="px-3 py-1 rounded-xl bg-white text-slate-950 font-black text-xs"
                      >
                        উইথড্র দেখুন
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 6 3D KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="rounded-2xl card-3d-dark p-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>মোট নিবন্ধিত ইউজার</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-number">
                    {totalUsersCount} জন
                  </div>
                  <div className="text-[10px] text-cyan-300">অ্যাক্টিভ ও ভেরিফাইড মেম্বার</div>
                </div>

                <div className="rounded-2xl card-3d-dark p-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>অনুমোদিত মোট ডিপোজিট</span>
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-number">
                    ৳ {totalApprovedDeposits.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-300">সরাসরি মেইন ব্যালেন্সে জমা</div>
                </div>

                <div className="rounded-2xl card-3d-dark p-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>অপেক্ষমান ডিপোজিট</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-number">
                    ৳ {totalPendingDeposits.toLocaleString('en-IN')} ({pendingDepositsCount})
                  </div>
                  <div className="text-[10px] text-amber-300">যাচাই ও অনুমোদন প্রয়োজন</div>
                </div>

                <div className="rounded-2xl card-3d-dark p-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>মোট পরিশোধিত উইথড্র</span>
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-cyan-300 font-number">
                    ৳ {totalCompletedWithdrawals.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-blue-200">সফলভাবে ক্যাশআউট সম্পন্ন</div>
                </div>

                <div className="rounded-2xl card-3d-dark p-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>অপেক্ষমান উইথড্র</span>
                    <Clock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400 font-number">
                    ৳ {totalPendingWithdrawals.toLocaleString('en-IN')} ({pendingWithdrawalsCount})
                  </div>
                  <div className="text-[10px] text-rose-300">দ্রুত পে-আউট পাঠানো আবশ্যক</div>
                </div>

                <div className="rounded-2xl card-3d-dark p-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>অ্যাক্টিভ প্যাকেজ সংখ্যা</span>
                    <Gem className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-purple-300 font-number">
                    {packages.length} টি প্ল্যান
                  </div>
                  <div className="text-[10px] text-purple-200">ইউজারদের আয়ের সুযোগ</div>
                </div>

              </div>

              {/* Quick Actions Shortcuts */}
              <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  অ্যাডমিন কুইক অ্যাকশন শর্টকাট
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => setActiveAdminTab('users')}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition"
                  >
                    <div className="text-amber-400 font-bold text-xs">ইউজার ব্যালেন্স কন্ট্রোল</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">টাকা যোগ বা কর্তন করুন</div>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('deposits')}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition"
                  >
                    <div className="text-emerald-400 font-bold text-xs">ডিপোজিট অনুমোদন</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">TrxID যাচাই করে এক্টিভ</div>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('numbers')}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition"
                  >
                    <div className="text-cyan-400 font-bold text-xs">পেমেন্ট নম্বর পরিবর্তন</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">বিকাশ/নগদ/রকেট নাম্বার</div>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPackage(null);
                      setPkgForm({ name: '', price: 500, dailyEarning: 50, validityDays: 30, bonusPoints: 600, popular: false, badge: '' });
                      setPackageModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition"
                  >
                    <div className="text-purple-400 font-bold text-xs">+ নতুন প্যাকেজ তৈরি</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">নতুন আর্নিং প্ল্যান যোগ</div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: USERS & BALANCE CONTROL */}
          {activeAdminTab === 'users' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="নাম অথবা মোবাইল নম্বর দিয়ে ইউজার খুঁজুন..."
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  মোট ইউজার: <strong className="text-white">{filteredUsers.length} জন</strong>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                      <th className="py-3 px-3">ইউজার পরিচিতি</th>
                      <th className="py-3 px-3">বর্তমান ব্যালেন্স</th>
                      <th className="py-3 px-3">মোট ডিপোজিট</th>
                      <th className="py-3 px-3">মোট উইথড্র</th>
                      <th className="py-3 px-3">রেজিস্ট্রেশন</th>
                      <th className="py-3 px-3">স্ট্যাটাস</th>
                      <th className="py-3 px-3 text-right">ব্যালেন্স ও অ্যাকাউন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{u.name}</span>
                            {u.role === 'admin' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                                অ্যাডমিন
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="text-sm font-black text-emerald-400 font-number">
                            ৳ {u.balance.toFixed(2)}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-cyan-300 font-number">
                          ৳ {u.totalDeposited.toFixed(2)}
                        </td>

                        <td className="py-3 px-3 text-amber-300 font-number">
                          ৳ {u.totalWithdrawn.toFixed(2)}
                        </td>

                        <td className="py-3 px-3 text-slate-400">{u.joinedAt}</td>

                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {u.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                          {/* Balance Control Trigger */}
                          <button
                            onClick={() => {
                              setBalanceModalUser(u);
                              setBalanceAmount('500');
                              setBalanceActionType('add');
                              setBalanceNote('অ্যাডমিন অ্যাডজাস্টমেন্ট');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-xs"
                          >
                            ব্যালেন্স কন্ট্রোল
                          </button>

                          {u.role !== 'admin' && (
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                u.status === 'active'
                                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white'
                                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950'
                              }`}
                            >
                              {u.status === 'active' ? 'ব্লক' : 'আনব্লক'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: DEPOSITS MANAGEMENT */}
          {activeAdminTab === 'deposits' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDepositFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      depositFilter === 'pending'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>অপেক্ষমান ({deposits.filter(d => d.status === 'pending').length})</span>
                  </button>

                  <button
                    onClick={() => setDepositFilter('approved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      depositFilter === 'approved'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    অনুমোদিত ({deposits.filter(d => d.status === 'approved').length})
                  </button>

                  <button
                    onClick={() => setDepositFilter('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      depositFilter === 'rejected'
                        ? 'bg-rose-500 text-white font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    বাতিলকৃত ({deposits.filter(d => d.status === 'rejected').length})
                  </button>
                </div>
              </div>

              {/* Deposits Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                {filteredDeposits.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    কোনো {depositFilter === 'pending' ? 'অপেক্ষমান' : depositFilter === 'approved' ? 'অনুমোদিত' : 'বাতিলকৃত'} ডিপোজিট রেকর্ড নেই।
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        <th className="py-3 px-3">ইউজার ও সেন্ডার</th>
                        <th className="py-3 px-3">মেথড</th>
                        <th className="py-3 px-3">পরিমাণ (৳)</th>
                        <th className="py-3 px-3">TrxID</th>
                        <th className="py-3 px-3">সময়</th>
                        <th className="py-3 px-3">স্ট্যাটাস</th>
                        {depositFilter === 'pending' && <th className="py-3 px-3 text-right">অ্যাকশন</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredDeposits.map(d => (
                        <tr key={d.id} className="hover:bg-slate-900/40">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{d.userName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">সেন্ডার: {d.senderNumber}</div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              d.method === 'bKash' ? 'bg-pink-500/20 text-pink-400' :
                              d.method === 'Nagad' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {d.method}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-extrabold text-white text-sm font-number">
                            ৳ {d.amount}
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-1.5 font-mono text-cyan-400 font-bold text-xs">
                              <span>{d.trxId}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(d.trxId);
                                  showToast('TrxID কপি হয়েছে!', 'info');
                                }}
                                className="text-slate-500 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-400">{d.createdAt}</td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              d.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              d.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {d.status === 'approved' ? 'অনুমোদিত' : d.status === 'rejected' ? 'বাতিল' : 'অপেক্ষমান'}
                            </span>
                            {d.rejectionReason && (
                              <div className="text-[9px] text-rose-400 mt-0.5">{d.rejectionReason}</div>
                            )}
                          </td>

                          {depositFilter === 'pending' && (
                            <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => approveDeposit(d.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-xs"
                              >
                                অনুমোদন দিন
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('বাতিলের কারণ লিখুন (ঐচ্ছিক):', 'ভুল ট্রানজেকশন আইডি');
                                  if (reason !== null) {
                                    rejectDeposit(d.id, reason);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs transition"
                              >
                                বাতিল
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: WITHDRAWALS MANAGEMENT */}
          {activeAdminTab === 'withdrawals' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setWithdrawFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      withdrawFilter === 'pending'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>অপেক্ষমান ({withdrawals.filter(w => w.status === 'pending').length})</span>
                  </button>

                  <button
                    onClick={() => setWithdrawFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      withdrawFilter === 'completed'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    সম্পন্ন ({withdrawals.filter(w => w.status === 'completed').length})
                  </button>

                  <button
                    onClick={() => setWithdrawFilter('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      withdrawFilter === 'rejected'
                        ? 'bg-rose-500 text-white font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    বাতিল ({withdrawals.filter(w => w.status === 'rejected').length})
                  </button>
                </div>
              </div>

              {/* Withdrawals Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                {filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    কোনো {withdrawFilter === 'pending' ? 'অপেক্ষমান' : withdrawFilter === 'completed' ? 'সম্পন্ন' : 'বাতিলকৃত'} উইথড্রয়াল রেকর্ড নেই।
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        <th className="py-3 px-3">ইউজার ও অ্যাকাউন্ট</th>
                        <th className="py-3 px-3">মেথড</th>
                        <th className="py-3 px-3">পরিমাণ (৳)</th>
                        <th className="py-3 px-3">সময়</th>
                        <th className="py-3 px-3">রেফারেন্স / নোট</th>
                        <th className="py-3 px-3">স্ট্যাটাস</th>
                        {withdrawFilter === 'pending' && <th className="py-3 px-3 text-right">অ্যাকশন</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredWithdrawals.map(w => (
                        <tr key={w.id} className="hover:bg-slate-900/40">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{w.userName}</div>
                            <div className="flex items-center space-x-1.5 text-[11px] text-amber-400 font-mono font-bold">
                              <span>নম্বর: {w.accountNumber}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(w.accountNumber);
                                  showToast('অ্যাকাউন্ট নম্বর কপি হয়েছে!', 'info');
                                }}
                                className="text-slate-500 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              w.method === 'bKash' ? 'bg-pink-500/20 text-pink-400' :
                              w.method === 'Nagad' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {w.method}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-extrabold text-white text-sm font-number">
                            ৳ {w.amount}
                          </td>

                          <td className="py-3 px-3 text-slate-400">{w.createdAt}</td>

                          <td className="py-3 px-3 font-mono text-slate-400">
                            {w.adminReference || w.rejectionReason || 'প্রসেসিং'}
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              w.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {w.status === 'completed' ? 'সম্পন্ন' : w.status === 'rejected' ? 'বাতিল' : 'অপেক্ষমান'}
                            </span>
                          </td>

                          {withdrawFilter === 'pending' && (
                            <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  const ref = prompt('পেমেন্ট ট্রানজেকশন রেফারেন্স লিখুন:', 'REF-' + Date.now().toString().slice(-6));
                                  if (ref) {
                                    completeWithdraw(w.id, ref);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-xs"
                              >
                                পে-আউট সম্পন্ন
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('বাতিলের কারণ লিখুন (ব্যালেন্স রিফান্ড হবে):', 'ভুল অ্যাকাউন্ট নম্বর');
                                  if (reason !== null) {
                                    rejectWithdraw(w.id, reason);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs transition"
                              >
                                বাতিল ও রিফান্ড
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: PAYMENT NUMBERS MANAGEMENT */}
          {activeAdminTab === 'numbers' && (
            <div className="max-w-2xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> পেমেন্ট নম্বর ও নির্দেশিকা আপডেট
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  এখানে নম্বর পরিবর্তন করলে ব্যবহারকারীদের ডিপোজিট ফর্মে সরাসরি লাইভ আপডেট হবে।
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* bKash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-pink-400 font-bold mb-1">বিকাশ (bKash) নম্বর</label>
                    <input
                      type="text"
                      value={editNumbers.bKash}
                      onChange={e => setEditNumbers({ ...editNumbers, bKash: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">অ্যাকাউন্ট টাইপ</label>
                    <input
                      type="text"
                      value={editNumbers.bKashType}
                      onChange={e => setEditNumbers({ ...editNumbers, bKashType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Nagad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-orange-400 font-bold mb-1">নগদ (Nagad) নম্বর</label>
                    <input
                      type="text"
                      value={editNumbers.Nagad}
                      onChange={e => setEditNumbers({ ...editNumbers, Nagad: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">অ্যাকাউন্ট টাইপ</label>
                    <input
                      type="text"
                      value={editNumbers.NagadType}
                      onChange={e => setEditNumbers({ ...editNumbers, NagadType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Rocket */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-purple-400 font-bold mb-1">রকেট (Rocket) নম্বর</label>
                    <input
                      type="text"
                      value={editNumbers.Rocket}
                      onChange={e => setEditNumbers({ ...editNumbers, Rocket: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">অ্যাকাউন্ট টাইপ</label>
                    <input
                      type="text"
                      value={editNumbers.RocketType}
                      onChange={e => setEditNumbers({ ...editNumbers, RocketType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Notice text */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">ডিপোজিট নির্দেশিকা টেক্সট</label>
                  <textarea
                    rows={2}
                    value={editNumbers.depositNotice}
                    onChange={e => setEditNumbers({ ...editNumbers, depositNotice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <button
                  onClick={() => savePaymentNumbers(editNumbers)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
                >
                  পেমেন্ট নম্বর সেভ করুন
                </button>
              </div>

            </div>
          )}

          {/* TAB 6: PACKAGES MANAGEMENT */}
          {activeAdminTab === 'packages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center">
                    <Gem className="w-4 h-4 mr-2" /> প্যাকেজ প্ল্যান ম্যানেজমেন্ট
                  </h3>
                  <p className="text-xs text-slate-400">দাম, দৈনিক আয়, মেয়াদ ও বোনাস পরিবর্তন করুন</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPackage(null);
                    setPkgForm({ name: '', price: 500, dailyEarning: 50, validityDays: 30, bonusPoints: 600, popular: false, badge: '' });
                    setPackageModalOpen(true);
                  }}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্যাকেজ যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map(pkg => (
                  <div key={pkg.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">{pkg.name}</span>
                      {pkg.popular && (
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded">
                          জনপ্রিয়
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-black text-emerald-400 font-number">
                      ৳ {pkg.price}
                    </div>
                    <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800 pt-2">
                      <div className="flex justify-between"><span>দৈনিক আয়:</span> <strong className="text-white">৳ {pkg.dailyEarning}</strong></div>
                      <div className="flex justify-between"><span>মেয়াদ:</span> <strong className="text-white">{pkg.validityDays} দিন</strong></div>
                      <div className="flex justify-between"><span>পয়েন্ট:</span> <strong className="text-amber-400">{pkg.bonusPoints}</strong></div>
                    </div>
                    <div className="flex space-x-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setEditingPackage(pkg);
                          setPkgForm(pkg);
                          setPackageModalOpen(true);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 flex items-center justify-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> <span>এডিট</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${pkg.name}" প্যাকেজটি ডিলিট করতে চান?`)) {
                            deletePackage(pkg.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TASKS MANAGEMENT */}
          {activeAdminTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
                    <ListCheck className="w-4 h-4 mr-2" /> ডেইলি টাস্ক কন্ট্রোল
                  </h3>
                  <p className="text-xs text-slate-400">টাস্ক টাইটেল, রিওয়ার্ড ও লিংক যোগ বা এডিট করুন</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setTaskForm({ title: '', reward: 15, type: 'youtube', link: 'https://youtube.com', instructions: '', durationSeconds: 60 });
                    setTaskModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন টাস্ক যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{t.title}</div>
                      <div className="text-slate-400 mt-0.5">{t.instructions}</div>
                      <div className="text-[11px] text-emerald-400 font-bold mt-1">
                        রিওয়ার্ড: +৳ {t.reward} | সময়: {t.durationSeconds} সেকেন্ড | মেথড: {t.type}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTask(t);
                          setTaskForm(t);
                          setTaskModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold"
                      >
                        এডিট
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`টাস্কটি মুছে ফেলতে চান?`)) {
                            deleteTask(t.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold"
                      >
                        ডিলিট
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeAdminTab === 'settings' && (
            <div className="max-w-2xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
                <Settings className="w-4 h-4 mr-2" /> গ্লোবাল প্ল্যাটফর্ম সেটিংস
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">সর্বনিম্ন ডিপোজিট (৳)</label>
                  <input
                    type="number"
                    value={editSettings.minDeposit}
                    onChange={e => setEditSettings({ ...editSettings, minDeposit: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-number font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">সর্বনিম্ন উইথড্রয়াল (৳)</label>
                  <input
                    type="number"
                    value={editSettings.minWithdraw}
                    onChange={e => setEditSettings({ ...editSettings, minWithdraw: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-number font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">উইথড্রয়াল চার্জ / ফি (%)</label>
                  <input
                    type="number"
                    value={editSettings.withdrawFeePercent}
                    onChange={e => setEditSettings({ ...editSettings, withdrawFeePercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-number font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">রেফারেল কমিশন (%)</label>
                  <input
                    type="number"
                    value={editSettings.referralBonusPercent}
                    onChange={e => setEditSettings({ ...editSettings, referralBonusPercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-number font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">স্বাগতম বোনাস (৳) — ওয়েলকাম পপআপে দেখাবে</label>
                  <input
                    type="number"
                    value={editSettings.welcomeBonus}
                    onChange={e => setEditSettings({ ...editSettings, welcomeBonus: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-number font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">টপ নোটিশ টেক্সট</label>
                <textarea
                  rows={2}
                  value={editSettings.siteNotice}
                  onChange={e => setEditSettings({ ...editSettings, siteNotice: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">টেলিগ্রাম সাপোর্ট লিংক</label>
                  <input
                    type="text"
                    value={editSettings.supportTelegram}
                    onChange={e => setEditSettings({ ...editSettings, supportTelegram: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">হোয়াটসঅ্যাপ সাপোর্ট নম্বর</label>
                  <input
                    type="text"
                    value={editSettings.supportWhatsapp}
                    onChange={e => setEditSettings({ ...editSettings, supportWhatsapp: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => updateSettings(editSettings)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          )}

        </div>

      </div>

      {/* USER BALANCE CONTROL MODAL */}
      {balanceModalUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-black text-white text-sm">ইউজার ব্যালেন্স কন্ট্রোল</h4>
                <p className="text-[11px] text-amber-400 font-bold">{balanceModalUser.name} ({balanceModalUser.phone})</p>
              </div>
              <button onClick={() => setBalanceModalUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">বর্তমান ব্যালেন্স:</span>
              <span className="text-base font-black text-emerald-400 font-number">৳ {balanceModalUser.balance.toFixed(2)}</span>
            </div>

            <form onSubmit={handleBalanceSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">অ্যাকশন টাইপ নির্বাচন করুন</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBalanceActionType('add')}
                    className={`py-1.5 rounded-lg font-bold text-[11px] border ${
                      balanceActionType === 'add'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    + যোগ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceActionType('deduct')}
                    className={`py-1.5 rounded-lg font-bold text-[11px] border ${
                      balanceActionType === 'deduct'
                        ? 'bg-rose-500 text-white border-rose-500 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    - কেটে নিন
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceActionType('set')}
                    className={`py-1.5 rounded-lg font-bold text-[11px] border ${
                      balanceActionType === 'set'
                        ? 'bg-blue-500 text-white border-blue-500 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    = সেট করুন
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  step="10"
                  required
                  value={balanceAmount}
                  onChange={e => setBalanceAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-number text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">নোট / কারণ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={balanceNote}
                  onChange={e => setBalanceNote(e.target.value)}
                  placeholder="যেমন: বিশেষ বোনাস প্রদান"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBalanceModalUser(null)}
                  className="py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  ব্যালেন্স আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PACKAGE ADD / EDIT MODAL */}
      {packageModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">
                {editingPackage ? 'প্যাকেজ এডিট করুন' : 'নতুন প্যাকেজ যোগ করুন'}
              </h4>
              <button onClick={() => setPackageModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePackageSave} className="space-y-2.5">
              <div>
                <label className="block text-slate-400 mb-0.5">প্যাকেজের নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Starter VIP"
                  value={pkgForm.name || ''}
                  onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-0.5">মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={pkgForm.price || ''}
                    onChange={e => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-number"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">দৈনিক আয় (৳)</label>
                  <input
                    type="number"
                    required
                    value={pkgForm.dailyEarning || ''}
                    onChange={e => setPkgForm({ ...pkgForm, dailyEarning: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-0.5">মেয়াদ (দিন)</label>
                  <input
                    type="number"
                    required
                    value={pkgForm.validityDays || ''}
                    onChange={e => setPkgForm({ ...pkgForm, validityDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-number"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">বোনাস পয়েন্ট</label>
                  <input
                    type="number"
                    value={pkgForm.bonusPoints || ''}
                    onChange={e => setPkgForm({ ...pkgForm, bonusPoints: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-0.5">ব্যাজ ট্যাগ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: জনপ্রিয় প্ল্যান"
                  value={pkgForm.badge || ''}
                  onChange={e => setPkgForm({ ...pkgForm, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pkgPop"
                  checked={pkgForm.popular || false}
                  onChange={e => setPkgForm({ ...pkgForm, popular: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="pkgPop" className="text-slate-300">জনপ্রিয় প্ল্যান হিসেবে হাইলাইট করুন</label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPackageModalOpen(false)}
                  className="py-2 rounded-xl border border-slate-700 text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black"
                >
                  প্যাকেজ সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK ADD / EDIT MODAL */}
      {taskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">
                {editingTask ? 'টাস্ক এডিট করুন' : 'নতুন টাস্ক যোগ করুন'}
              </h4>
              <button onClick={() => setTaskModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTaskSave} className="space-y-2.5">
              <div>
                <label className="block text-slate-400 mb-0.5">টাস্কের শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ইউটিউব ভিডিও ওয়াচ (২ মিনিট)"
                  value={taskForm.title || ''}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-0.5">রিওয়ার্ড (৳)</label>
                  <input
                    type="number"
                    required
                    value={taskForm.reward || ''}
                    onChange={e => setTaskForm({ ...taskForm, reward: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-number"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">সময় (সেকেন্ড)</label>
                  <input
                    type="number"
                    required
                    value={taskForm.durationSeconds || ''}
                    onChange={e => setTaskForm({ ...taskForm, durationSeconds: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-0.5">টাস্কের ধরন</label>
                <select
                  value={taskForm.type || 'youtube'}
                  onChange={e => setTaskForm({ ...taskForm, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value="youtube">YouTube Video</option>
                  <option value="facebook">Facebook Like/Share</option>
                  <option value="telegram">Telegram Channel</option>
                  <option value="website">Website Article View</option>
                  <option value="review">App Rating & Review</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-0.5">টার্গেট লিংক (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={taskForm.link || ''}
                  onChange={e => setTaskForm({ ...taskForm, link: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-0.5">নির্দেশনা টেক্সট</label>
                <textarea
                  rows={2}
                  value={taskForm.instructions || ''}
                  onChange={e => setTaskForm({ ...taskForm, instructions: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="py-2 rounded-xl border border-slate-700 text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black"
                >
                  টাস্ক সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
