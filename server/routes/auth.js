import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { randomUUID, toPublicUser } from '../db.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, phone, password, referCode } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'নাম, ফোন নম্বর ও পাসওয়ার্ড আবশ্যক।' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    return res.status(409).json({ error: 'এই ফোন নম্বরে অ্যাকাউন্ট আগে থেকেই আছে।' });
  }

  const id = `u-${randomUUID()}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  const myReferCode = phone.slice(-6) + Math.floor(Math.random() * 100);

  db.prepare(`
    INSERT INTO users (id, name, phone, password_hash, joined_at, refer_code, referred_by, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'user')
  `).run(id, name, phone, passwordHash, new Date().toISOString(), myReferCode, referCode || null);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: toPublicUser(user) });
});

router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'ফোন নম্বর অথবা পাসওয়ার্ড ভুল।' });
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'এই অ্যাকাউন্ট সাময়িকভাবে বন্ধ আছে।' });
  }
  const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: toPublicUser(user) });
});

export default router;