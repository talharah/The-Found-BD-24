import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import packageRoutes from './routes/packages.js';
import depositRoutes from './routes/deposits.js';
import withdrawalRoutes from './routes/withdrawals.js';
import taskRoutes from './routes/tasks.js';
import { requireAuth } from './middleware/auth.js';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/tasks', taskRoutes);

// Returns the logged-in user's own current data (fresh from the database, not the client).
app.get('/api/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });
  const { password_hash, ...publicUser } = user;
  res.json(publicUser);
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});