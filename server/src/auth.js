import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { readDb, writeDb } from './db.js';

const SECRET = process.env.JWT_SECRET || 'megaprep-secret';

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, name: user.name, email: user.email }, SECRET, {
    expiresIn: '12h'
  });
}

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

export function loginHandler(req, res) {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  db.sessions.push({
    id: randomUUID(),
    userId: user.id,
    device: req.headers['user-agent'] || 'Unknown',
    createdAt: new Date().toISOString()
  });
  writeDb(db);
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
