import { Router } from 'express';
import { pool, randomUUID, withTransaction } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function toPublicDeposit(d) {
  return {
    id: d.id,
    userId: d.user_id,
    userName: d.user_name,
    userPhone: d.user_phone,
    method: d.method,
    senderNumber: d.sender_number,
    amount: Number(d.amount),
    trxId: d.trx_id,
    status: d.status,
    rejectionReason: d.rejection_reason || undefined,
    createdAt: d.created_at,
    processedAt: d.processed_at || undefined,
  };
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { method, senderNumber, amount, trxId } = req.body;
    if (!method || !senderNumber || !amount || !trxId) {
      return res.status(400).json({ error: 'সব তথ্য পূরণ করুন।' });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    const id = `dep-${randomUUID()}`;

    await pool.query(
      `INSERT INTO deposits (id, user_id, user_name, user_phone, method, sender_number, amount, trx_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, user.id, user.name, user.phone, method, senderNumber, amount, trxId, new Date().toISOString()]
    );

    res.status(201).json({ message: 'জমার আবেদন পাঠানো হয়েছে, অ্যাডমিন অনুমোদনের অপেক্ষায়।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows.map(toPublicDeposit));
});

// Admin-only: list, approve, reject
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM deposits ORDER BY created_at DESC');
  res.json(rows.map(toPublicDeposit));
});

router.post('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM deposits WHERE id = $1', [req.params.id]);
    const dep = rows[0];
    if (!dep || dep.status !== 'pending') {
      return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
    }
    await withTransaction(async (client) => {
      await client.query('UPDATE deposits SET status = $1, processed_at = $2 WHERE id = $3', ['approved', new Date().toISOString(), dep.id]);
      await client.query(
        'UPDATE users SET balance = balance + $1, total_deposited = total_deposited + $1 WHERE id = $2',
        [dep.amount, dep.user_id]
      );
    });
    res.json({ message: 'জমা অনুমোদিত হয়েছে।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

router.post('/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  const { reason } = req.body;
  const { rows } = await pool.query('SELECT * FROM deposits WHERE id = $1', [req.params.id]);
  const dep = rows[0];
  if (!dep || dep.status !== 'pending') {
    return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
  }
  await pool.query(
    'UPDATE deposits SET status = $1, rejection_reason = $2, processed_at = $3 WHERE id = $4',
    ['rejected', reason || 'ভুল ট্রানজেকশন আইডি অথবা পেমেন্ট পাওয়া যায়নি', new Date().toISOString(), dep.id]
  );
  res.json({ message: 'জমা বাতিল করা হয়েছে।' });
});

export default router;
