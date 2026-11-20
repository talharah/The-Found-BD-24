import { Router } from 'express';
import { pool, randomUUID, withTransaction } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function toPublicPackage(p) {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    dailyEarning: Number(p.daily_earning),
    validityDays: p.validity_days,
    bonusPoints: Number(p.bonus_points),
    popular: !!p.popular,
    badge: p.badge || undefined,
    description: p.description || undefined,
  };
}

function toPublicUserPackage(up) {
  const today = new Date().toISOString().slice(0, 10);
  const daysRemaining = Math.max(0, Math.ceil((new Date(up.expires_at) - new Date()) / 86400000));
  return {
    id: up.id,
    userId: up.user_id,
    packageId: up.package_id,
    packageName: up.package_name,
    dailyEarning: Number(up.daily_earning),
    startedAt: up.started_at,
    expiresAt: up.expires_at,
    daysRemaining,
    claimedToday: up.last_claim_date === today,
  };
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM packages');
  res.json(rows.map(toPublicPackage));
});

// Admin: create or update a package
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { id, name, price, dailyEarning, validityDays, bonusPoints, popular, badge, description } = req.body;
  const pkgId = id || `pkg-${randomUUID()}`;
  const { rows: existingRows } = await pool.query('SELECT id FROM packages WHERE id = $1', [pkgId]);

  if (existingRows.length > 0) {
    await pool.query(
      `UPDATE packages SET name=$1, price=$2, daily_earning=$3, validity_days=$4, bonus_points=$5, popular=$6, badge=$7, description=$8
       WHERE id=$9`,
      [name, price, dailyEarning, validityDays, bonusPoints || 0, !!popular, badge || null, description || null, pkgId]
    );
  } else {
    await pool.query(
      `INSERT INTO packages (id, name, price, daily_earning, validity_days, bonus_points, popular, badge, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [pkgId, name, price, dailyEarning, validityDays, bonusPoints || 0, !!popular, badge || null, description || null]
    );
  }

  const { rows } = await pool.query('SELECT * FROM packages WHERE id = $1', [pkgId]);
  res.status(201).json(toPublicPackage(rows[0]));
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM packages WHERE id = $1', [req.params.id]);
  res.json({ message: 'প্যাকেজ ডিলিট করা হয়েছে।' });
});

// Buy a package: balance check and deduction happen here on the server,
// never trusting a balance value sent from the client.
router.post('/:id/buy', requireAuth, async (req, res) => {
  try {
    const { rows: pkgRows } = await pool.query('SELECT * FROM packages WHERE id = $1', [req.params.id]);
    const pkg = pkgRows[0];
    if (!pkg) return res.status(404).json({ error: 'প্যাকেজ পাওয়া যায়নি।' });

    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userRows[0];
    if (Number(user.balance) < Number(pkg.price)) {
      return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই।' });
    }

    const id = `up-${randomUUID()}`;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + pkg.validity_days * 24 * 60 * 60 * 1000);

    await withTransaction(async (client) => {
      await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [pkg.price, user.id]);
      await client.query(
        `INSERT INTO user_packages (id, user_id, package_id, package_name, daily_earning, started_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, user.id, pkg.id, pkg.name, pkg.daily_earning, startedAt.toISOString(), expiresAt.toISOString()]
      );
    });

    res.status(201).json({ message: 'প্যাকেজ ক্রয় সফল হয়েছে।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM user_packages WHERE user_id = $1', [req.user.id]);
  res.json(rows.map(toPublicUserPackage));
});

// Claim today's earning for one active package — only once per day, checked on the server.
router.post('/mine/:id/claim', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_packages WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    const up = rows[0];
    if (!up) return res.status(404).json({ error: 'প্যাকেজ পাওয়া যায়নি।' });

    const today = new Date().toISOString().slice(0, 10);
    if (up.last_claim_date === today) {
      return res.status(400).json({ error: 'আজকের আয় আগেই সংগ্রহ করা হয়েছে।' });
    }
    if (new Date(up.expires_at) < new Date()) {
      return res.status(400).json({ error: 'এই প্যাকেজের মেয়াদ শেষ হয়ে গেছে।' });
    }

    await withTransaction(async (client) => {
      await client.query(
        'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
        [up.daily_earning, req.user.id]
      );
      await client.query('UPDATE user_packages SET last_claim_date = $1 WHERE id = $2', [today, up.id]);
    });

    res.json({ message: 'আজকের আয় যোগ হয়েছে।', amount: Number(up.daily_earning) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

export default router;
