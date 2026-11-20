import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, randomUUID, toPublicUser } from '../db.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, referCode } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'নাম, ফোন নম্বর ও পাসওয়ার্ড আবশ্যক।' });
    }
    const { rows: existingRows } = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'এই ফোন নম্বরে অ্যাকাউন্ট আগে থেকেই আছে।' });
    }

    const id = `u-${randomUUID()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const myReferCode = phone.slice(-6) + Math.floor(Math.random() * 100);

    await pool.query(
      `INSERT INTO users (id, name, phone, password_hash, joined_at, refer_code, referred_by, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'user')`,
      [id, name, phone, passwordHash, new Date().toISOString(), myReferCode, referCode || null]
    );

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'ফোন নম্বর অথবা পাসওয়ার্ড ভুল।' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'এই অ্যাকাউন্ট সাময়িকভাবে বন্ধ আছে।' });
    }
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

export default router;
