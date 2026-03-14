const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getDB } = require('../db/database');

function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.' }
});

function isValidShopeeUrl(url) {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'shopee.vn' ||
      u.hostname === 'shope.ee' ||
      u.hostname === 's.shopee.vn' ||
      u.hostname.endsWith('.shopee.vn')
    );
  } catch {
    return false;
  }
}

// ─── Lấy affiliate ID: ưu tiên DB settings, fallback env ───────────────────
function getAffiliateId() {
  try {
    const db = getDB();
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('shopee_affiliate_id');
    if (row && row.value) return row.value;
  } catch {}
  return process.env.SHOPEE_AFFILIATE_ID || '';
}

function getSmtt() {
  try {
    const db = getDB();
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('shopee_smtt');
    if (row && row.value) return row.value;
  } catch {}
  return process.env.SHOPEE_SMTT || '0.0.9';
}

// ─── Shopee Affiliate: gắn af_id vào URL gốc ────────────────────────────────
function generateAffiliateLink(originalUrl) {
  const affiliateId = getAffiliateId();

  if (!affiliateId) {
    console.warn('[Affiliate] Chưa cấu hình Shopee Affiliate ID — trả về URL gốc');
    return originalUrl;
  }

  try {
    const u = new URL(originalUrl);
    ['smtt', 'af_id', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(p =>
      u.searchParams.delete(p)
    );
    u.searchParams.set('smtt', getSmtt());
    u.searchParams.set('af_id', affiliateId);
    return u.toString();
  } catch {
    return originalUrl;
  }
}

// POST /api/links/convert
router.post('/convert', limiter, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL không được để trống.' });
    }

    const trimmedUrl = url.trim();

    if (!isValidShopeeUrl(trimmedUrl)) {
      return res.status(400).json({ error: 'Chỉ chấp nhận link từ shopee.vn.' });
    }

    const db = getDB();

    // Check cache
    const existing = db.prepare(
      'SELECT * FROM links WHERE original_url = ? ORDER BY created_at DESC LIMIT 1'
    ).get(trimmedUrl);

    if (existing) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
      return res.json({
        id: existing.id,
        originalUrl: existing.original_url,
        affiliateUrl: existing.affiliate_url,
        shortCode: existing.short_code,
        shortLink: `${baseUrl}/r/${existing.short_code}`,
        clicks: existing.clicks,
        createdAt: existing.created_at,
        cached: true
      });
    }

    const affiliateUrl = generateAffiliateLink(trimmedUrl);

    // Generate unique short code
    let shortCode;
    let attempts = 0;
    do {
      shortCode = generateCode(6);
      const exists = db.prepare('SELECT id FROM links WHERE short_code = ?').get(shortCode);
      if (!exists) break;
    } while (++attempts < 10);

    const result = db.prepare(
      'INSERT INTO links (original_url, affiliate_url, short_code) VALUES (?, ?, ?)'
    ).run(trimmedUrl, affiliateUrl, shortCode);

    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';

    res.json({
      id: result.lastInsertRowid,
      originalUrl: trimmedUrl,
      affiliateUrl,
      shortCode,
      shortLink: `${baseUrl}/r/${shortCode}`,
      clicks: 0,
      cached: false
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server. Vui lòng thử lại.' });
  }
});

// GET /api/links/:shortCode
router.get('/:shortCode', (req, res) => {
  const db = getDB();
  const link = db.prepare('SELECT * FROM links WHERE short_code = ?').get(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'Không tìm thấy link.' });
  res.json(link);
});

module.exports = router;
