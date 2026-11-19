import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = new Database('topmoney24.db');
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance REAL DEFAULT 0,
  total_earned REAL DEFAULT 0,
  total_deposited REAL DEFAULT 0,
  total_withdrawn REAL DEFAULT 0,
  joined_at TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  refer_code TEXT UNIQUE,
  referred_by TEXT,
  role TEXT DEFAULT 'user',
  welcome_bonus_claimed INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  daily_earning REAL NOT NULL,
  validity_days INTEGER NOT NULL,
  bonus_points REAL DEFAULT 0,
  popular INTEGER DEFAULT 0,
  badge TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_packages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  daily_earning REAL NOT NULL,
  started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  claimed_today INTEGER DEFAULT 0,
  last_claim_date TEXT
);

CREATE TABLE IF NOT EXISTS deposits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  method TEXT NOT NULL,
  sender_number TEXT NOT NULL,
  amount REAL NOT NULL,
  trx_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  processed_at TEXT
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  method TEXT NOT NULL,
  account_number TEXT NOT NULL,
  amount REAL NOT NULL,
  charge REAL NOT NULL,
  final_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  processed_at TEXT,
  admin_reference TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  reward REAL NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  instructions TEXT,
  duration_seconds INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS completed_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  reward REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

// Seed an admin account and some packages the first time the server runs.
const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
if (userCount === 0) {
  const adminId = 'u-admin-01';
  const passwordHash = bcrypt.hashSync('Sagor100%', 10);
  db.prepare(`
    INSERT INTO users (id, name, phone, password_hash, balance, joined_at, refer_code, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'admin')
  `).run(adminId, 'সাগর আহমেদ (সুপার অ্যাডমিন)', '01825937544', passwordHash, 0, new Date().toISOString(), 'ADMIN7544');

  const packages = [
    ['pkg-1', 'Basic Plan', 200, 20, 30, 200, 0, 'স্টার্টার'],
    ['pkg-2', 'Standard Plan', 500, 50, 30, 600, 1, 'সর্বাধিক জনপ্রিয়'],
    ['pkg-3', 'Premium Plan', 1000, 120, 30, 0, 0, null],
  ];
  const insertPkg = db.prepare(`
    INSERT INTO packages (id, name, price, daily_earning, validity_days, bonus_points, popular, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of packages) insertPkg.run(...p);

  const tasks = [
    ['task-1', 'ইউটিউব স্পন্সর ভিডিও ওয়াচ (২ মিনিট)', 15, 'youtube', 'https://youtube.com', 'ভিডিওটি সম্পূর্ণ ২ মিনিট দেখুন এবং চ্যানেলে লাইক ও সাবস্ক্রাইব করুন।', 120],
    ['task-2', 'অফিশিয়াল টেলিগ্রাম গ্রুপ ও চ্যানেলে যুক্ত হোন', 10, 'telegram', 'https://telegram.org', 'গ্রুপে জয়েন করে অ্যাক্টিভ থাকুন এবং নতুন আপডেট সংগ্রহ করুন।', 30],
    ['task-3', 'ফেসবুক অফিশিয়াল পেজ ফলো ও পোস্ট শেয়ার', 12, 'facebook', 'https://facebook.com', 'ফেসবুক পেজ লাইক দিয়ে পিন পোস্টটি আপনার টাইমলাইনে পাবলিক শেয়ার করুন।', 45],
    ['task-4', 'স্পন্সর ওয়েবসাইট নিউজ আর্টিকেল ভিজিট (১ মিনিট)', 18, 'website', 'https://google.com', 'ওয়েবসাইট ভিজিট করে ১ মিনিট ব্রাউজ করুন এবং স্ক্রল করুন।', 60],
    ['task-5', 'প্ল্যাটফর্ম রিভিউ ও ৫-স্টার রেটিং প্রদান', 25, 'review', 'https://topmoney24.com', 'আপনার ভালো অভিজ্ঞতা জানিয়ে সুন্দর একটি রিভিউ পোস্ট করুন।', 60],
  ];
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, reward, type, link, instructions, duration_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const t of tasks) insertTask.run(...t);

  const defaultSettings = {
    minDeposit: 200,
    minWithdraw: 300,
    withdrawFeePercent: 0,
    referralBonusPercent: 10,
    dailyLoginBonus: 5,
    siteNotice: 'অফিশিয়াল ঘোষণা: টপ মানি ২৪ এ আপনাকে স্বাগতম! সহজ টাস্কে আয় করুন এবং ইনস্ট্যান্ট পেমেন্ট গ্রহণ করুন।',
    supportTelegram: 'https://t.me/TopMoney24Support',
    supportWhatsapp: '+8801825937544',
    officialEmail: 'support@topmoney24.com',
  };
  const defaultPaymentNumbers = {
    bKash: '01825935740',
    Nagad: '01825935740',
    Rocket: '01825935740',
    bKashType: 'পার্সোনাল (Send Money)',
    NagadType: 'পার্সোনাল (Send Money)',
    RocketType: 'পার্সোনাল (Send Money)',
    depositNotice: 'টাকা পাঠানোর পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) দিয়ে সাবমিট করুন। ৫-১৫ মিনিটের মধ্যে আপনার ব্যালেন্স যুক্ত হবে।',
    withdrawNotice: 'উইথড্র রিকোয়েস্ট পাঠানোর ৩০ মিনিট থেকে ২ ঘণ্টার মধ্যে পেমেন্ট সম্পন্ন করা হয়। সর্বনিম্ন উইথড্র ৳৩০০ টাকা।',
  };
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('platform_settings', JSON.stringify(defaultSettings));
  insertSetting.run('payment_numbers', JSON.stringify(defaultPaymentNumbers));

  console.log('Seeded database with admin account, starter packages, tasks and settings.');
}

export default db;
export { randomUUID };
