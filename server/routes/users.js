import { Router } from 'express';
import { pool, toPublicUser } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY joined_at DESC');
  res.json(rows.map(toPublicUser));
});

router.patch('/:id/balance', requireAuth, requireAdmin, async (req, res) => {
  const { amount, actionType, note } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });

  let newBalance = Number(user.balance);
  if (actionType === 'add') newBalance = Number(user.balance) + amount;
  else if (actionType === 'deduct') newBalance = Math.max(0, Number(user.balance) - amount);
  else if (actionType === 'set') newBalance = Math.max(0, amount);

  await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, user.id]);
  res.json({
    message: `ইউজার "${user.name}" এর ব্যালেন্স আপডেট হয়েছে। বর্তমান ব্যালেন্স: ৳${newBalance.toFixed(2)}${note ? ` (${note})` : ''}`,
    balance: newBalance,
  });
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });

  const newStatus = user.status === 'active' ? 'suspended' : 'active';
  await pool.query('UPDATE users SET status = $1 WHERE id = $2', [newStatus, user.id]);
  res.json({ message: `ইউজার "${user.name}" এর স্ট্যাটাস এখন "${newStatus === 'active' ? 'সক্রিয়' : 'স্থগিত'}"।`, status: newStatus });
});

export default router;
