import { 
  User, 
  Package, 
  Task, 
  DepositRequest, 
  WithdrawRequest, 
  AdminPaymentNumbers, 
  PlatformSettings,
  UserPackage
} from '../types';

export const INITIAL_ADMIN_CREDENTIALS = {
  phone: '01825937544',
  password: 'Sagor100%',
  name: 'সাগর আহমেদ (সুপার অ্যাডমিন)'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-01',
    name: 'সাগর আহমেদ (অ্যাডমিন)',
    phone: '01825937544',
    password: 'Sagor100%',
    balance: 50000.00,
    totalEarned: 125000.00,
    totalDeposited: 50000.00,
    totalWithdrawn: 10000.00,
    joinedAt: '2026-01-10',
    status: 'active',
    referCode: 'ADMIN7544',
    role: 'admin'
  }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'Basic Plan',
    price: 200,
    dailyEarning: 20,
    validityDays: 30,
    bonusPoints: 200,
    popular: false,
    badge: 'স্টার্টার',
    description: 'দৈনিক নিয়মিত কাজ ও আয় শুরু করার উপযুক্ত স্টার্টার প্ল্যান।'
  },
  {
    id: 'pkg-2',
    name: 'Standard Plan',
    price: 500,
    dailyEarning: 50,
    validityDays: 30,
    bonusPoints: 600,
    popular: true,
    badge: 'সর্বাধিক জনপ্রিয়',
    description: 'সর্বাধিক পছন্দের প্যাকেজ। দৈনিক আকর্ষণীয় আয় ও দ্বিগুণ বোনাস পয়েন্ট।'
  },
  {
    id: 'pkg-3',
    name: 'Premium Plan',
    price: 1000,
    dailyEarning: 120,
    validityDays: 30,
    bonusPoints: 1300,
    popular: false,
    badge: 'প্রো প্ল্যান',
    description: 'উচ্চ আয়ের ডিজিটাল প্যাকেজ। দ্রুত পে-আউট ও বোনাস নিশ্চিত।'
  },
  {
    id: 'pkg-4',
    name: 'VIP Gold',
    price: 2500,
    dailyEarning: 320,
    validityDays: 30,
    bonusPoints: 3500,
    popular: false,
    badge: 'ভিআইপি গোল্ড',
    description: 'ভিআইপি গ্রাহকদের জন্য উচ্চতম সুবিধা ও দৈনিক ফাস্ট ট্রানজেকশন।'
  },
  {
    id: 'pkg-5',
    name: 'VIP Diamond',
    price: 5000,
    dailyEarning: 650,
    validityDays: 45,
    bonusPoints: 7500,
    popular: false,
    badge: 'ডায়মন্ড ভিআইপি',
    description: 'দীর্ঘমেয়াদী সর্বোচ্চ প্রফিট ও এক্সক্লুসিভ প্রায়োরিটি উইথড্রয়াল।'
  },
  {
    id: 'pkg-6',
    name: 'Master Investor',
    price: 10000,
    dailyEarning: 1400,
    validityDays: 60,
    bonusPoints: 16000,
    popular: false,
    badge: 'মাস্টার প্ল্যান',
    description: 'বড় ইনভেস্টমেন্ট ও এক্সক্লুসিভ কমিশন সিস্টেমের প্রিমিয়াম প্ল্যান।'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'ইউটিউব স্পন্সর ভিডিও ওয়াচ (২ মিনিট)',
    reward: 15,
    type: 'youtube',
    link: 'https://youtube.com',
    instructions: 'ভিডিওটি সম্পূর্ণ ২ মিনিট দেখুন এবং চ্যানেলে লাইক ও সাবস্ক্রাইব করুন।',
    durationSeconds: 120
  },
  {
    id: 'task-2',
    title: 'অফিশিয়াল টেলিগ্রাম গ্রুপ ও চ্যানেলে যুক্ত হোন',
    reward: 10,
    type: 'telegram',
    link: 'https://telegram.org',
    instructions: 'গ্রুপে জয়েন করে অ্যাক্টিভ থাকুন এবং নতুন আপডেট সংগ্রহ করুন।',
    durationSeconds: 30
  },
  {
    id: 'task-3',
    title: 'ফেসবুক অফিশিয়াল পেজ ফলো ও পোস্ট শেয়ার',
    reward: 12,
    type: 'facebook',
    link: 'https://facebook.com',
    instructions: 'ফেসবুক পেজ লাইক দিয়ে পিন পোস্টটি আপনার টাইমলাইনে পাবলিক শেয়ার করুন।',
    durationSeconds: 45
  },
  {
    id: 'task-4',
    title: 'স্পন্সর ওয়েবসাইট নিউজ আর্টিকেল ভিজিট (১ মিনিট)',
    reward: 18,
    type: 'website',
    link: 'https://google.com',
    instructions: 'ওয়েবসাইট ভিজিট করে ১ মিনিট ব্রাউজ করুন এবং স্ক্রল করুন।',
    durationSeconds: 60
  },
  {
    id: 'task-5',
    title: 'প্ল্যাটফর্ম রিভিউ ও ৫-স্টার রেটিং প্রদান',
    reward: 25,
    type: 'review',
    link: 'https://topmoney24.com',
    instructions: 'আপনার ভালো অভিজ্ঞতা জানিয়ে সুন্দর একটি রিভিউ পোস্ট করুন।',
    durationSeconds: 60
  }
];

export const INITIAL_DEPOSITS: DepositRequest[] = [];

export const INITIAL_WITHDRAWALS: WithdrawRequest[] = [];

export const INITIAL_ADMIN_PAYMENT_NUMBERS: AdminPaymentNumbers = {
  bKash: '01825935740',
  Nagad: '01825935740',
  Rocket: '01825935740',
  bKashType: 'পার্সোনাল (Send Money)',
  NagadType: 'পার্সোনাল (Send Money)',
  RocketType: 'পার্সোনাল (Send Money)',
  depositNotice: 'টাকা পাঠানোর পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) দিয়ে সাবমিট করুন। ৫-১৫ মিনিটের মধ্যে আপনার ব্যালেন্স যুক্ত হবে।',
  withdrawNotice: 'উইথড্র রিকোয়েস্ট পাঠানোর ৩০ মিনিট থেকে ২ ঘণ্টার মধ্যে পেমেন্ট সম্পন্ন করা হয়। সর্বনিম্ন উইথড্র ৳৩০০ টাকা।'
};

export const INITIAL_SETTINGS: PlatformSettings = {
  minDeposit: 200,
  minWithdraw: 300,
  withdrawFeePercent: 0,
  referralBonusPercent: 10,
  dailyLoginBonus: 5,
  siteNotice: 'অফিশিয়াল ঘোষণা: টপ মানি ২৪ এ আপনাকে স্বাগতম! সহজ টাস্কে আয় করুন এবং ইনস্ট্যান্ট পেমেন্ট গ্রহণ করুন।',
  supportTelegram: 'https://t.me/TopMoney24Support',
  supportWhatsapp: '+8801825937544',
  officialEmail: 'support@topmoney24.com'
};

export const INITIAL_USER_PACKAGES: UserPackage[] = [];
