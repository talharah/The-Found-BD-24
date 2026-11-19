import { Router } from 'express';
import db, { toPublicUser } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM users ORDER BY joined_at DESC').all();
  res.json(rows.map(toPublicUser));
});

router.patch('/:id/balance', requireAuth, requireAdmin, (req, res) => {
  const { amount, actionType, note } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });

  let newBalance = user.balance;
  if (actionType === 'add') newBalance = user.balance + amount;
  else if (actionType === 'deduct') newBalance = Math.max(0, user.balance - amount);
  else if (actionType === 'set') newBalance = Math.max(0, amount);

  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, user.id);
  res.json({ message: `ইউজার "${user.name}" এর ব্যালেন্স আপডেট হয়েছে। বর্তমান ব্যালেন্স: ৳${newBalance.toFixed(2)}${note ? ` (${note})` : ''}`, balance: newBalance });
});

router.patch('/:id/status', requireAuth, requireAdmin, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });

  const newStatus = user.status === 'active' ? 'suspended' : 'active';
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(newStatus, user.id);
  res.json({ message: `ইউজার "${user.name}" এর স্ট্যাটাস এখন "${newStatus === 'active' ? 'সক্রিয়' : 'স্থগিত'}"।`, status: newStatus });
});

export default router;