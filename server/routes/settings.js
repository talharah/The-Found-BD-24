import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function getValue(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? JSON.parse(row.value) : null;
}

function setValue(key, value) {
  const existing = db.prepare('SELECT key FROM settings WHERE key = ?').get(key);
  if (existing) {
    db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(JSON.stringify(value), key);
  } else {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
  }
}

router.get('/', (req, res) => {
  res.json({
    settings: getValue('platform_settings'),
    paymentNumbers: getValue('payment_numbers'),
  });
});

router.put('/settings', requireAuth, requireAdmin, (req, res) => {
  setValue('platform_settings', req.body);
  res.json({ message: 'প্ল্যাটফর্ম সেটিংস আপডেট হয়েছে।' });
});

router.put('/payment-numbers', requireAuth, requireAdmin, (req, res) => {
  setValue('payment_numbers', req.body);
  res.json({ message: 'পেমেন্ট নম্বর আপডেট হয়েছে।' });
});

export default router;
