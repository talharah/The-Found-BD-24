import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import packageRoutes from './routes/packages.js';
import depositRoutes from './routes/deposits.js';
import withdrawalRoutes from './routes/withdrawals.js';
import taskRoutes from './routes/tasks.js';
import teamRoutes from './routes/team.js';
import userRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';
import { requireAuth } from './middleware/auth.js';
import { pool, toPublicUser, initDb } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Returns the logged-in user's own current data (fresh from the database, not the client).
app.get('/api/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });
  res.json(toPublicUser(user));
});

// Serve the built React app (created by `npm run build`, output into /dist)
// so this single service can host both the API and the website together.
// This only matters in production — in local dev, Vite's own server (npm run dev) serves the app.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Any route that isn't /api/... should return the React app, so client-side
// routing/refreshing works instead of showing "Cannot GET /something".
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 4001;

// Make sure the database tables (and seed data) exist before accepting any requests.
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
