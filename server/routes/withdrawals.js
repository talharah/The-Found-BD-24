import { Router } from 'express';
import db, { randomUUID } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const WITHDRAW_FEE_PERCENT = 5; // keep in sync with platform settings if you add a settings table

router.post('/', requireAuth, (req, res) => {
  const { method, accountNumber, amount } = req.body;
  if (!method || !accountNumber || !amount) {
    return res.status(400).json({ error: 'সব তথ্য পূরণ করুন।' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (user.balance < amount) {
    return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই।' });
  }

  const charge = Number((amount * WITHDRAW_FEE_PERCENT) / 100);
  const finalAmount = amount - charge;
  const id = `wd-${randomUUID()}`;

  const tx = db.transaction(() => {
    // Hold the funds immediately so the user can't withdraw the same balance twice.
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, user.id);
    db.prepare(`
      INSERT INTO withdrawals (id, user_id, user_name, user_phone, method, account_number, amount, charge, final_amount, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.id, user.name, user.phone, method, accountNumber, amount, charge, finalAmount, new Date().toISOString());
  });
  tx();

  res.status(201).json({ message: 'উত্তোলনের আবেদন পাঠানো হয়েছে।' });
});

router.get('/mine', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows);
});

router.get('/', requireAuth, requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM withdrawals ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/:id/complete', requireAuth, requireAdmin, (req, res) => {
  const { reference } = req.body;
  const wd = db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(req.params.id);
  if (!wd || wd.status !== 'pending') {
    return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
  }
  const tx = db.transaction(() => {
    db.prepare('UPDATE withdrawals SET status = ?, admin_reference = ?, processed_at = ? WHERE id = ?')
      .run('completed', reference || ('BK-' + Date.now().toString().slice(-6)), new Date().toISOString(), wd.id);
    db.prepare('UPDATE users SET total_withdrawn = total_withdrawn + ? WHERE id = ?').run(wd.final_amount, wd.user_id);
  });
  tx();
  res.json({ message: 'উত্তোলন সম্পন্ন হয়েছে।' });
});

router.post('/:id/reject', requireAuth, requireAdmin, (req, res) => {
  const { reason } = req.body;
  const wd = db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(req.params.id);
  if (!wd || wd.status !== 'pending') {
    return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
  }
  const tx = db.transaction(() => {
    // Refund the held balance back to the user since the withdrawal was rejected.
    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(wd.amount, wd.user_id);
    db.prepare('UPDATE withdrawals SET status = ?, rejection_reason = ?, processed_at = ? WHERE id = ?')
      .run('rejected', reason || 'ভুল অ্যাকাউন্ট নম্বর অথবা নিয়মনীতি লঙ্ঘন', new Date().toISOString(), wd.id);
  });
  tx();
  res.json({ message: 'উত্তোলন বাতিল করা হয়েছে এবং ব্যালেন্স ফেরত দেওয়া হয়েছে।' });
});

export default router;
