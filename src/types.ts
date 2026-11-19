export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  balance: number;
  totalEarned: number;
  totalDeposited: number;
  totalWithdrawn: number;
  joinedAt: string;
  status: 'active' | 'suspended';
  referCode: string;
  referredBy?: string;
  role: UserRole;
  welcomeBonusClaimed?: boolean;
}

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket';

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: PaymentMethod;
  senderNumber: string;
  amount: number;
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: PaymentMethod;
  accountNumber: string;
  amount: number;
  charge: number;
  finalAmount: number;
  status: 'pending' | 'completed' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
  adminReference?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  dailyEarning: number;
  validityDays: number;
  bonusPoints: number;
  popular?: boolean;
  badge?: string;
  description?: string;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  dailyEarning: number;
  startedAt: string;
  expiresAt: string;
  daysRemaining: number;
  claimedToday: boolean;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  type: 'youtube' | 'facebook' | 'telegram' | 'website' | 'review';
  link: string;
  instructions: string;
  durationSeconds: number;
}

export interface CompletedTask {
  id: string;
  userId: string;
  taskId: string;
  completedAt: string;
  reward: number;
}

export interface AdminPaymentNumbers {
  bKash: string;
  Nagad: string;
  Rocket: string;
  bKashType: string;
  NagadType: string;
  RocketType: string;
  depositNotice: string;
  withdrawNotice: string;
}

export interface PlatformSettings {
  minDeposit: number;
  minWithdraw: number;
  withdrawFeePercent: number;
  referralBonusPercent: number;
  dailyLoginBonus: number;
  siteNotice: string;
  supportTelegram: string;
  supportWhatsapp: string;
  officialEmail: string;
}

export type MainTabType = 'home' | 'tasks' | 'packages' | 'transactions' | 'referral' | 'profile' | 'about';
