const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDB();
  const session = db.prepare('SELECT * FROM admin_sessions WHERE token = ?').get(token);
  if (!session) return res.status(401).json({ error: 'Token không hợp lệ.' });

  next();
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Mật khẩu không đúng.' });
  }

  const token = generateToken();
  const db = getDB();
  db.prepare('INSERT INTO admin_sessions (token) VALUES (?)').run(token);

  res.json({ token });
});

// GET /api/admin/stats
router.get('/stats', authMiddleware, (req, res) => {
  const db = getDB();

  const totalLinks = db.prepare('SELECT COUNT(*) as count FROM links').get().count;
  const totalClicks = db.prepare('SELECT COALESCE(SUM(clicks), 0) as total FROM links').get().total;
  const todayClicks = db.prepare(
    "SELECT COALESCE(SUM(clicks), 0) as total FROM links WHERE DATE(created_at) = DATE('now', 'localtime')"
  ).get().total;
  const todayLinks = db.prepare(
    "SELECT COUNT(*) as count FROM links WHERE DATE(created_at) = DATE('now', 'localtime')"
  ).get().count;

  res.json({ totalLinks, totalClicks, todayClicks, todayLinks });
});

// GET /api/admin/links
router.get('/links', authMiddleware, (req, res) => {
  const db = getDB();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const links = db.prepare(
    'SELECT * FROM links ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(limit, offset);

  const total = db.prepare('SELECT COUNT(*) as count FROM links').get().count;

  res.json({ links, total, page, limit });
});

// DELETE /api/admin/links/:id
router.delete('/links/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const result = db.prepare('DELETE FROM links WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Không tìm thấy.' });
  res.json({ success: true });
});

// POST /api/admin/logout
router.post('/logout', authMiddleware, (req, res) => {
  const token = req.headers['x-admin-token'];
  const db = getDB();
  db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  res.json({ success: true });
});

module.exports = router;
