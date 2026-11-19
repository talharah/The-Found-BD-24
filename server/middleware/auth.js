import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'লগইন প্রয়োজন।' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, phone, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'সেশন মেয়াদোত্তীর্ণ, আবার লগইন করুন।' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'অ্যাডমিন অনুমতি প্রয়োজন।' });
  }
  next();
}

export { JWT_SECRET };
