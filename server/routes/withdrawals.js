import { Router } from 'express';
import { pool, randomUUID, withTransaction } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const WITHDRAW_FEE_PERCENT = 5; // keep in sync with platform settings if you add a settings table

function toPublicWithdrawal(w) {
  return {
    id: w.id,
    userId: w.user_id,
    userName: w.user_name,
    userPhone: w.user_phone,
    method: w.method,
    accountNumber: w.account_number,
    amount: Number(w.amount),
    charge: Number(w.charge),
    finalAmount: Number(w.final_amount),
    status: w.status,
    rejectionReason: w.rejection_reason || undefined,
    createdAt: w.created_at,
    processedAt: w.processed_at || undefined,
    adminReference: w.admin_reference || undefined,
  };
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { method, accountNumber, amount } = req.body;
    if (!method || !accountNumber || !amount) {
      return res.status(400).json({ error: 'সব তথ্য পূরণ করুন।' });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (Number(user.balance) < amount) {
      return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই।' });
    }

    const charge = Number((amount * WITHDRAW_FEE_PERCENT) / 100);
    const finalAmount = amount - charge;
    const id = `wd-${randomUUID()}`;

    await withTransaction(async (client) => {
      // Hold the funds immediately so the user can't withdraw the same balance twice.
      await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, user.id]);
      await client.query(
        `INSERT INTO withdrawals (id, user_id, user_name, user_phone, method, account_number, amount, charge, final_amount, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id, user.id, user.name, user.phone, method, accountNumber, amount, charge, finalAmount, new Date().toISOString()]
      );
    });

    res.status(201).json({ message: 'উত্তোলনের আবেদন পাঠানো হয়েছে।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows.map(toPublicWithdrawal));
});

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM withdrawals ORDER BY created_at DESC');
  res.json(rows.map(toPublicWithdrawal));
});

router.post('/:id/complete', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { reference } = req.body;
    const { rows } = await pool.query('SELECT * FROM withdrawals WHERE id = $1', [req.params.id]);
    const wd = rows[0];
    if (!wd || wd.status !== 'pending') {
      return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
    }
    const ref = reference || ('BK-' + Date.now().toString().slice(-6));
    await withTransaction(async (client) => {
      await client.query(
        'UPDATE withdrawals SET status = $1, admin_reference = $2, processed_at = $3 WHERE id = $4',
        ['completed', ref, new Date().toISOString(), wd.id]
      );
      await client.query('UPDATE users SET total_withdrawn = total_withdrawn + $1 WHERE id = $2', [wd.final_amount, wd.user_id]);
    });
    res.json({ message: 'উত্তোলন সম্পন্ন হয়েছে।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

router.post('/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const { rows } = await pool.query('SELECT * FROM withdrawals WHERE id = $1', [req.params.id]);
    const wd = rows[0];
    if (!wd || wd.status !== 'pending') {
      return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
    }
    await withTransaction(async (client) => {
      // Refund the held balance back to the user since the withdrawal was rejected.
      await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [wd.amount, wd.user_id]);
      await client.query(
        'UPDATE withdrawals SET status = $1, rejection_reason = $2, processed_at = $3 WHERE id = $4',
        ['rejected', reason || 'ভুল অ্যাকাউন্ট নম্বর অথবা নিয়মনীতি লঙ্ঘন', new Date().toISOString(), wd.id]
      );
    });
    res.json({ message: 'উত্তোলন বাতিল করা হয়েছে এবং ব্যালেন্স ফেরত দেওয়া হয়েছে।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

export default router;
