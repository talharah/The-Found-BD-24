import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const COMMISSION_PERCENT = 10; // % of each team member's total deposit counted as "team income"

function toPublicMember(u) {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    joinedAt: u.joined_at,
    totalDeposited: Number(u.total_deposited),
    status: u.status,
    isActive: Number(u.total_deposited) > 0,
  };
}

async function directReferralsOf(referCode) {
  if (!referCode) return [];
  const { rows } = await pool.query('SELECT * FROM users WHERE referred_by = $1', [referCode]);
  return rows;
}

function summarize(members) {
  const totalInvite = members.length;
  const validInvite = members.filter(m => Number(m.total_deposited) > 0).length;
  const totalInvestment = members.reduce((sum, m) => sum + Number(m.total_deposited), 0);
  const totalIncome = Number((totalInvestment * COMMISSION_PERCENT) / 100);
  return {
    members: members.map(toPublicMember),
    totalInvite,
    validInvite,
    totalInvestment,
    totalIncome,
  };
}

router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const me = rows[0];
  if (!me) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি।' });

  const teamA = await directReferralsOf(me.refer_code);
  const teamBLists = await Promise.all(teamA.map(m => directReferralsOf(m.refer_code)));
  const teamB = teamBLists.flat();
  const teamCLists = await Promise.all(teamB.map(m => directReferralsOf(m.refer_code)));
  const teamC = teamCLists.flat();

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
