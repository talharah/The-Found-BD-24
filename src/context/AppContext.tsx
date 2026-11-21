import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, getToken } from '../api';
import {
  User,
  Package,
  Task,
  DepositRequest,
  WithdrawRequest,
  AdminPaymentNumbers,
  PlatformSettings,
  UserPackage,
  PaymentMethod,
  MainTabType
} from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  deposits: DepositRequest[];
  withdrawals: WithdrawRequest[];
  packages: Package[];
  tasks: Task[];
  userPackages: UserPackage[];
  completedTasks: { taskId: string; completedAt: string }[];
  adminPaymentNumbers: AdminPaymentNumbers;
  settings: PlatformSettings;
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // User Actions
  login: (phone: string, pass: string) => Promise<{ success: boolean; isAdmin: boolean; message: string }>;
  register: (name: string, phone: string, pass: string, referCode?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  submitDeposit: (amount: number, method: PaymentMethod, senderNumber: string, trxId: string) => Promise<boolean>;
  submitWithdraw: (amount: number, method: PaymentMethod, accountNumber: string) => Promise<boolean>;
  subscribePackage: (packageId: string) => Promise<boolean>;
  completeTask: (taskId: string) => Promise<boolean>;
  claimDailyPackageEarning: (userPackageId: string) => Promise<boolean>;

  // Admin Controls
  updateUserBalance: (userId: string, amount: number, actionType: 'add' | 'deduct' | 'set', note?: string) => Promise<boolean>;
  toggleUserStatus: (userId: string) => Promise<void>;
  approveDeposit: (depositId: string) => Promise<boolean>;
  rejectDeposit: (depositId: string, reason?: string) => Promise<boolean>;
  completeWithdraw: (withdrawId: string, reference?: string) => Promise<boolean>;
  rejectWithdraw: (withdrawId: string, reason?: string) => Promise<boolean>;
  savePaymentNumbers: (numbers: AdminPaymentNumbers) => Promise<void>;
  savePackage: (pkg: Package) => Promise<void>;
  deletePackage: (pkgId: string) => Promise<void>;
  saveTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateSettings: (newSettings: PlatformSettings) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: PlatformSettings = {
  minDeposit: 200,
  minWithdraw: 300,
  withdrawFeePercent: 0,
  referralBonusPercent: 10,
  dailyLoginBonus: 5,
  welcomeBonus: 15,
  siteNotice: '',
  supportTelegram: '',
  supportWhatsapp: '',
  officialEmail: ''
};

const DEFAULT_PAYMENT_NUMBERS: AdminPaymentNumbers = {
  bKash: '', Nagad: '', Rocket: '',
  bKashType: '', NagadType: '', RocketType: '',
  depositNotice: '', withdrawNotice: ''
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [completedTasks, setCompletedTasks] = useState<{ taskId: string; completedAt: string }[]>([]);
  const [adminPaymentNumbers, setAdminPaymentNumbers] = useState<AdminPaymentNumbers>(DEFAULT_PAYMENT_NUMBERS);
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);

  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // --- Data loading from the backend ---
  // Packages, tasks and platform settings/payment numbers are public (no login needed).
  const refreshPublicData = async () => {
    try {
      const [pkgs, tsks, settingsResp] = await Promise.all([
        api.getPackages(),
        api.getTasks(),
        api.getSettings(),
      ]);
      setPackages(pkgs);
      setTasks(tsks);
      if (settingsResp.settings) setSettings(settingsResp.settings);
      if (settingsResp.paymentNumbers) setAdminPaymentNumbers(settingsResp.paymentNumbers);
    } catch (err) {
      console.error('Failed to load public data:', err);
    }
  };

  // Everything tied to who is logged in: admin sees every user/deposit/withdrawal,
  // a regular user sees only their own records.
  const refreshUserData = async (user: User | null) => {
    if (!user) {
      setUsers([]);
      setDeposits([]);
      setWithdrawals([]);
      setUserPackages([]);
      setCompletedTasks([]);
      return;
    }
    try {
      if (user.role === 'admin') {
        const [allUsers, allDeps, allWds] = await Promise.all([
          api.getUsers(),
          api.allDeposits(),
          api.allWithdrawals(),
        ]);
        setUsers(allUsers);
        setDeposits(allDeps);
        setWithdrawals(allWds);
        setUserPackages([]);
        setCompletedTasks([]);
      } else {
        const [myDeps, myWds, myPkgs, myCompletedTasks] = await Promise.all([
          api.myDeposits(),
          api.myWithdrawals(),
          api.myPackages(),
          api.myCompletedTasks(),
        ]);
        setUsers([user]);
        setDeposits(myDeps);
        setWithdrawals(myWds);
        setUserPackages(myPkgs);
        setCompletedTasks(myCompletedTasks);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  // Pull the current user's fresh balance/stats from the server (never trust
  // a locally-computed balance).
  const refreshMe = async (): Promise<User | null> => {
    try {
      const fresh = await api.me();
      setCurrentUser(fresh);
      return fresh;
    } catch {
      return null;
    }
  };

  // On first load: fetch public data, and if a token is already stored, restore the session.
  useEffect(() => {
    (async () => {
      await refreshPublicData();
      const token = getToken();
      if (token) {
        const fresh = await refreshMe();
        if (fresh) {
          await refreshUserData(fresh);
        } else {
          setToken(null);
        }
      }
    })();
  }, []);

  // --- Authentication Handlers ---
  const login = async (phone: string, pass: string) => {
    try {
      const { token, user } = await api.login(phone.trim(), pass.trim());
      setToken(token);
      setCurrentUser(user);
      await refreshUserData(user);
      if (user.role === 'admin') {
        setIsAuthModalOpen(false);
        setIsAdminModalOpen(true);
        showToast('অ্যাডমিন সফলভাবে লগইন হয়েছেন!', 'success');
        return { success: true, isAdmin: true, message: 'অ্যাডমিন লগইন সফল!' };
      }
      setActiveTab('profile');
      setIsAuthModalOpen(false);
      showToast(`স্বাগতম, ${user.name}!`, 'success');
      return { success: true, isAdmin: false, message: 'লগইন সফল!' };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, isAdmin: false, message: err.message };
    }
  };

  const register = async (name: string, phone: string, pass: string, referCode?: string) => {
    try {
      await api.register(name.trim(), phone.trim(), pass.trim(), referCode?.trim());
      setAuthModalMode('login');
      showToast(`রেজিস্ট্রেশন সফল হয়েছে! এখন আপনার মোবাইল নম্বর (${phone.trim()}) ও পাসওয়ার্ড দিয়ে লগইন করে অ্যাকাউন্টে প্রবেশ করুন।`, 'success');
      return { success: true, message: 'রেজিস্ট্রেশন সফল! এখন লগইন করুন।' };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setUsers([]);
    setDeposits([]);
    setWithdrawals([]);
    setUserPackages([]);
    setCompletedTasks([]);
    setIsAdminModalOpen(false);
    setActiveTab('home');
    showToast('আপনার অ্যাকাউন্ট থেকে লগআউট করা হয়েছে।', 'info');
  };

  // --- User Operations ---
  const submitDeposit = async (amount: number, method: PaymentMethod, senderNumber: string, trxId: string): Promise<boolean> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('ডিপোজিট করতে আগে লগইন করুন।', 'error');
      return false;
    }
    if (amount < settings.minDeposit) {
      showToast(`সর্বনিম্ন ডিপোজিট পরিমাণ ৳${settings.minDeposit} টাকা।`, 'error');
      return false;
    }
    const cleanTrx = trxId.trim().toUpperCase();
    if (!cleanTrx) {
      showToast('সঠিক ট্রানজেকশন আইডি (TrxID) লিখুন।', 'error');
      return false;
    }

    try {
      await api.submitDeposit(method, senderNumber.trim() || currentUser.phone, amount, cleanTrx);
      setIsDepositModalOpen(false);
      showToast(`৳${amount} টাকার ডিপোজিট রিকোয়েস্ট জমা হয়েছে! অ্যাডমিন যাচাই করে ব্যালেন্স যোগ করবেন।`, 'success');
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const submitWithdraw = async (amount: number, method: PaymentMethod, accountNumber: string): Promise<boolean> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('উইথড্র করতে আগে লগইন করুন।', 'error');
      return false;
    }
    if (currentUser.status === 'suspended') {
      showToast('আপনার অ্যাকাউন্ট স্থগিত থাকায় উইথড্র সম্ভব নয়।', 'error');
      return false;
    }
    if (amount < settings.minWithdraw) {
      showToast(`সর্বনিম্ন উইথড্র পরিমাণ ৳${settings.minWithdraw} টাকা।`, 'error');
      return false;
    }
    if (amount > currentUser.balance) {
      showToast(`আপনার বর্তমান ব্যালেন্স ৳${currentUser.balance.toFixed(2)}, যা উইথড্র পরিমাণের চেয়ে কম!`, 'error');
      return false;
    }

    try {
      await api.submitWithdraw(method, accountNumber.trim(), amount);
      setIsWithdrawModalOpen(false);
      showToast(`৳${amount} টাকার উইথড্র রিকোয়েস্ট সফলভাবে জমা হয়েছে। দ্রুত পেমেন্ট সম্পন্ন হবে।`, 'success');
      await refreshMe();
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const subscribePackage = async (packageId: string): Promise<boolean> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('প্যাকেজ এক্টিভ করতে আগে লগইন করুন।', 'info');
      return false;
    }
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return false;

    if (currentUser.balance < pkg.price) {
      showToast(`আপনার ব্যালেন্স অপর্যাপ্ত! ${pkg.name} এক্টিভ করতে ৳${pkg.price} টাকা প্রয়োজন। অনুগ্রহ করে ডিপোজিট করুন।`, 'error');
      setIsDepositModalOpen(true);
      return false;
    }

    try {
      await api.buyPackage(packageId);
      showToast(`অভিনন্দন! আপনি সফলভাবে ${pkg.name} এক্টিভ করেছেন। দৈনিক আয়: ৳${pkg.dailyEarning}!`, 'success');
      await refreshMe();
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const completeTask = async (taskId: string): Promise<boolean> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('টাস্ক সম্পন্ন করতে আগে লগইন করুন।', 'info');
      return false;
    }
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    try {
      await api.completeTask(taskId);
      showToast(`অভিনন্দন! "${task.title}" সম্পন্ন করে আপনার ব্যালেন্সে ৳${task.reward} যোগ হয়েছে!`, 'success');
      await refreshMe();
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const claimDailyPackageEarning = async (userPackageId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const upkg = userPackages.find(up => up.id === userPackageId);
    if (!upkg || upkg.claimedToday) return false;

    try {
      const res = await api.claimPackage(userPackageId);
      showToast(`আজকের দৈনিক প্রফিট ৳${res.amount ?? upkg.dailyEarning} আপনার ব্যালেন্সে যোগ হয়েছে!`, 'success');
      await refreshMe();
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // --- Admin Controls ---
  const updateUserBalance = async (userId: string, amount: number, actionType: 'add' | 'deduct' | 'set', note?: string): Promise<boolean> => {
    try {
      const res = await api.adjustBalance(userId, amount, actionType, note);
      showToast(res.message, 'success');
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const toggleUserStatus = async (userId: string): Promise<void> => {
    try {
      const res = await api.toggleUserStatus(userId);
      showToast(res.message, 'info');
      await refreshUserData(currentUser);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const approveDeposit = async (depositId: string): Promise<boolean> => {
    try {
      await api.approveDeposit(depositId);
      showToast('ডিপোজিট সফলভাবে অনুমোদিত হয়েছে এবং ইউজারের ব্যালেন্সে যোগ হয়েছে!', 'success');
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const rejectDeposit = async (depositId: string, reason: string = 'ভুল ট্রানজেকশন আইডি অথবা পেমেন্ট পাওয়া যায়নি'): Promise<boolean> => {
    try {
      await api.rejectDeposit(depositId, reason);
      showToast(`ডিপোজিট বাতিল করা হয়েছে। কারণ: ${reason}`, 'info');
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const completeWithdraw = async (withdrawId: string, reference: string = 'BK-' + Date.now().toString().slice(-6)): Promise<boolean> => {
    try {
      await api.completeWithdraw(withdrawId, reference);
      showToast(`উইথড্র সফলভাবে সম্পন্ন হয়েছে! রেফারেন্স: ${reference}`, 'success');
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const rejectWithdraw = async (withdrawId: string, reason: string = 'ভুল অ্যাকাউন্ট নম্বর অথবা নিয়মনীতি লঙ্ঘন'): Promise<boolean> => {
    try {
      await api.rejectWithdraw(withdrawId, reason);
      showToast('উইথড্র বাতিল করা হয়েছে এবং ব্যালেন্স ইউজারকে ফেরত দেওয়া হয়েছে।', 'info');
      await refreshUserData(currentUser);
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const savePaymentNumbers = async (numbers: AdminPaymentNumbers): Promise<void> => {
    try {
      await api.updatePaymentNumbers(numbers);
      setAdminPaymentNumbers(numbers);
      showToast('অ্যাডমিন পেমেন্ট নম্বরসমূহ সফলভাবে আপডেট করা হয়েছে!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const savePackage = async (pkg: Package): Promise<void> => {
    try {
      await api.savePackage(pkg);
      showToast(`প্যাকেজ "${pkg.name}" সফলভাবে সেভ করা হয়েছে!`, 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deletePackage = async (pkgId: string): Promise<void> => {
    try {
      await api.deletePackage(pkgId);
      showToast('প্যাকেজটি সফলভাবে ডিলিট করা হয়েছে।', 'info');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const saveTask = async (task: Task): Promise<void> => {
    try {
      await api.saveTask(task);
      showToast(`টাস্ক "${task.title}" সফলভাবে সেভ করা হয়েছে!`, 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      await api.deleteTask(taskId);
      showToast('টাস্কটি ডিলিট করা হয়েছে।', 'info');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const updateSettings = async (newSettings: PlatformSettings): Promise<void> => {
    try {
      await api.updateSettings(newSettings);
      setSettings(newSettings);
      showToast('প্ল্যাটফর্ম সেটিংস সফলভাবে আপডেট করা হয়েছে!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        deposits,
        withdrawals,
        packages,
        tasks,
        userPackages,
        completedTasks,
        adminPaymentNumbers,
        settings,
        activeTab,
        setActiveTab,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        toast,
        showToast,
        login,
        register,
        logout,
        submitDeposit,
        submitWithdraw,
        subscribePackage,
        completeTask,
        claimDailyPackageEarning,
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
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
