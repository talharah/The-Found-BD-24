import { Router } from 'express';
import db, { randomUUID } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, (req, res) => {
  const { method, senderNumber, amount, trxId } = req.body;
  if (!method || !senderNumber || !amount || !trxId) {
    return res.status(400).json({ error: 'সব তথ্য পূরণ করুন।' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const id = `dep-${randomUUID()}`;

  db.prepare(`
    INSERT INTO deposits (id, user_id, user_name, user_phone, method, sender_number, amount, trx_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, user.id, user.name, user.phone, method, senderNumber, amount, trxId, new Date().toISOString());

  res.status(201).json({ message: 'জমার আবেদন পাঠানো হয়েছে, অ্যাডমিন অনুমোদনের অপেক্ষায়।' });
});

router.get('/mine', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM deposits WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows);
});

// Admin-only: list, approve, reject
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM deposits ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/:id/approve', requireAuth, requireAdmin, (req, res) => {
  const dep = db.prepare('SELECT * FROM deposits WHERE id = ?').get(req.params.id);
  if (!dep || dep.status !== 'pending') {
    return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
  }
  const tx = db.transaction(() => {
    db.prepare('UPDATE deposits SET status = ?, processed_at = ? WHERE id = ?')
      .run('approved', new Date().toISOString(), dep.id);
    db.prepare('UPDATE users SET balance = balance + ?, total_deposited = total_deposited + ? WHERE id = ?')
      .run(dep.amount, dep.amount, dep.user_id);
  });
  tx();
  res.json({ message: 'জমা অনুমোদিত হয়েছে।' });
});

router.post('/:id/reject', requireAuth, requireAdmin, (req, res) => {
  const { reason } = req.body;
  const dep = db.prepare('SELECT * FROM deposits WHERE id = ?').get(req.params.id);
  if (!dep || dep.status !== 'pending') {
    return res.status(400).json({ error: 'এই আবেদনটি প্রক্রিয়া করা যাচ্ছে না।' });
  }
  db.prepare('UPDATE deposits SET status = ?, rejection_reason = ?, processed_at = ? WHERE id = ?')
    .run('rejected', reason || 'ভুল ট্রানজেকশন আইডি অথবা পেমেন্ট পাওয়া যায়নি', new Date().toISOString(), dep.id);
  res.json({ message: 'জমা বাতিল করা হয়েছে।' });
});

export default router;
