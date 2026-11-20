import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

async function getValue(key) {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return rows[0] ? JSON.parse(rows[0].value) : null;
}

async function setValue(key, value) {
  const { rows } = await pool.query('SELECT key FROM settings WHERE key = $1', [key]);
  if (rows.length > 0) {
    await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [JSON.stringify(value), key]);
  } else {
    await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, JSON.stringify(value)]);
  }
}

router.get('/', async (req, res) => {
  res.json({
    settings: await getValue('platform_settings'),
    paymentNumbers: await getValue('payment_numbers'),
  });
});

router.put('/settings', requireAuth, requireAdmin, async (req, res) => {
  await setValue('platform_settings', req.body);
  res.json({ message: 'প্ল্যাটফর্ম সেটিংস আপডেট হয়েছে।' });
});

router.put('/payment-numbers', requireAuth, requireAdmin, async (req, res) => {
  await setValue('payment_numbers', req.body);
  res.json({ message: 'পেমেন্ট নম্বর আপডেট হয়েছে।' });
});

export default router;
