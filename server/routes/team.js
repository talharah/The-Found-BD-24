import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const COMMISSION_PERCENT = 10; // % of each team member's total deposit counted as "team income"

function toPublicMember(u) {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    joinedAt: u.joined_at,
    totalDeposited: u.total_deposited,
    status: u.status,
    isActive: u.total_deposited > 0,
  };
}

function directReferralsOf(referCode) {
  return db.prepare('SELECT * FROM users WHERE referred_by = ?').all(referCode);
}

function summarize(members) {
  const totalInvite = members.length;
  const validInvite = members.filter(m => m.total_deposited > 0).length;
  const totalInvestment = members.reduce((sum, m) => sum + m.total_deposited, 0);
  const totalIncome = Number((totalInvestment * COMMISSION_PERCENT) / 100);
  return {
    members: members.map(toPublicMember),
    totalInvite,
    validInvite,
    totalInvestment,
    totalIncome,
  };
}

router.get('/', requireAuth, (req, res) => {
  const me = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!me) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });

  const teamA = directReferralsOf(me.refer_code);
  const teamB = teamA.flatMap(m => directReferralsOf(m.refer_code));
  const teamC = teamB.flatMap(m => directReferralsOf(m.refer_code));

  const a = summarize(teamA);
  const b = summarize(teamB);
  const c = summarize(teamC);

  res.json({
    totalIncome: Number((a.totalIncome + b.totalIncome + c.totalIncome).toFixed(2)),
    totalInvitation: a.totalInvite + b.totalInvite + c.totalInvite,
    teamInvestment: Number((a.totalInvestment + b.totalInvestment + c.totalInvestment).toFixed(2)),
    teamProfitPercent: COMMISSION_PERCENT,
    teams: { A: a, B: b, C: c },
  });
});

export default router;
