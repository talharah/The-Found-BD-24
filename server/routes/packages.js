import { Router } from 'express';
import db, { randomUUID } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function toPublicPackage(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    dailyEarning: p.daily_earning,
    validityDays: p.validity_days,
    bonusPoints: p.bonus_points,
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
    dailyEarning: up.daily_earning,
    startedAt: up.started_at,
    expiresAt: up.expires_at,
    daysRemaining,
    claimedToday: up.last_claim_date === today,
  };
}

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM packages').all().map(toPublicPackage));
});

// Admin: create or update a package
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { id, name, price, dailyEarning, validityDays, bonusPoints, popular, badge, description } = req.body;
  const pkgId = id || `pkg-${randomUUID()}`;
  const existing = db.prepare('SELECT id FROM packages WHERE id = ?').get(pkgId);

  if (existing) {
    db.prepare(`
      UPDATE packages SET name=?, price=?, daily_earning=?, validity_days=?, bonus_points=?, popular=?, badge=?, description=?
      WHERE id=?
    `).run(name, price, dailyEarning, validityDays, bonusPoints || 0, popular ? 1 : 0, badge || null, description || null, pkgId);
  } else {
    db.prepare(`
      INSERT INTO packages (id, name, price, daily_earning, validity_days, bonus_points, popular, badge, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(pkgId, name, price, dailyEarning, validityDays, bonusPoints || 0, popular ? 1 : 0, badge || null, description || null);
  }

  const saved = db.prepare('SELECT * FROM packages WHERE id = ?').get(pkgId);
  res.status(201).json(toPublicPackage(saved));
});

router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
  res.json({ message: 'প্যাকেজ ডিলিট করা হয়েছে।' });
});

// Buy a package: balance check and deduction happen here on the server,
// never trusting a balance value sent from the client.
router.post('/:id/buy', requireAuth, (req, res) => {
  const pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
  if (!pkg) return res.status(404).json({ error: 'প্যাকেজ পাওয়া যায়নি।' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (user.balance < pkg.price) {
    return res.status(400).json({ error: 'পর্যাপ্ত ব্যালেন্স নেই।' });
  }

  const id = `up-${randomUUID()}`;
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + pkg.validity_days * 24 * 60 * 60 * 1000);

  const tx = db.transaction(() => {
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(pkg.price, user.id);
    db.prepare(`
      INSERT INTO user_packages (id, user_id, package_id, package_name, daily_earning, started_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.id, pkg.id, pkg.name, pkg.daily_earning, startedAt.toISOString(), expiresAt.toISOString());
  });
  tx();

  res.status(201).json({ message: 'প্যাকেজ ক্রয় সফল হয়েছে।' });
});

router.get('/mine', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM user_packages WHERE user_id = ?').all(req.user.id);
  res.json(rows.map(toPublicUserPackage));
});

// Claim today's earning for one active package — only once per day, checked on the server.
router.post('/mine/:id/claim', requireAuth, (req, res) => {
  const up = db.prepare('SELECT * FROM user_packages WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!up) return res.status(404).json({ error: 'প্যাকেজ পাওয়া যায়নি।' });

  const today = new Date().toISOString().slice(0, 10);
  if (up.last_claim_date === today) {
    return res.status(400).json({ error: 'আজকের আয় আগেই সংগ্রহ করা হয়েছে।' });
  }
  if (new Date(up.expires_at) < new Date()) {
    return res.status(400).json({ error: 'এই প্যাকেজের মেয়াদ শেষ হয়ে গেছে।' });
  }

  const tx = db.transaction(() => {
    db.prepare('UPDATE users SET balance = balance + ?, total_earned = total_earned + ? WHERE id = ?')
      .run(up.daily_earning, up.daily_earning, req.user.id);
    db.prepare('UPDATE user_packages SET last_claim_date = ? WHERE id = ?').run(today, up.id);
  });
  tx();

  res.json({ message: 'আজকের আয় যোগ হয়েছে।', amount: up.daily_earning });
});

export default router;
