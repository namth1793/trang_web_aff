require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db/database');
const linksRouter = require('./routes/links');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// FRONTEND_URL có thể là nhiều domain cách nhau bằng dấu phẩy
// VD: https://shopee-aff.vercel.app,http://localhost:3000
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());

// Initialize DB
initDB();

// Routes
app.use('/api/links', linksRouter);
app.use('/api/admin', adminRouter);

// Redirect short link
app.get('/r/:code', async (req, res) => {
  const { code } = req.params;
  const db = require('./db/database').getDB();
  const link = db.prepare('SELECT * FROM links WHERE short_code = ?').get(code);
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }
  db.prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?').run(link.id);
  res.redirect(302, link.affiliate_url);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
