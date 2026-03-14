const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getDB } = require('../db/database');
const fetch = require('node-fetch');

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

// ─── Nền tảng 1: AccessTrade Vietnam ───────────────────────────────────────
// Đăng ký tại accesstrade.vn → Tài khoản → API Key
// Set trong .env: AFFILIATE_PLATFORM=accesstrade, ACCESSTRADE_API_TOKEN=your_token
async function generateViaAccessTrade(originalUrl) {
  const token = process.env.ACCESSTRADE_API_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch('https://api.accesstrade.vn/v1/shortenLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ url: originalUrl }),
      timeout: 8000
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[AccessTrade] Error:', res.status, err);
      return null;
    }

    const data = await res.json();
    // AccessTrade trả về: { data: { url_redirect: "https://accesstrade.vn/go/..." } }
    return data?.data?.url_redirect || data?.url_redirect || null;
  } catch (err) {
    console.error('[AccessTrade] Request failed:', err.message);
    return null;
  }
}

// ─── Nền tảng 2: Shopee Affiliate trực tiếp (affiliate.shopee.vn) ──────────
// Đăng ký tại affiliate.shopee.vn → Dashboard → lấy Affiliate ID (af_id)
// Set trong .env: AFFILIATE_PLATFORM=shopee, SHOPEE_AFFILIATE_ID=your_af_id
// Không cần API key — link được tạo bằng cách gắn af_id vào URL gốc
function generateViaShopeeManual(originalUrl) {
  const affiliateId = process.env.SHOPEE_AFFILIATE_ID;
  if (!affiliateId) return null;

  try {
    const u = new URL(originalUrl);
    ['smtt', 'af_id', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(p =>
      u.searchParams.delete(p)
    );
    u.searchParams.set('smtt', process.env.SHOPEE_SMTT || '0.0.9');
    u.searchParams.set('af_id', affiliateId);
    return u.toString();
  } catch {
    return null;
  }
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────
async function generateAffiliateLink(originalUrl) {
  const platform = (process.env.AFFILIATE_PLATFORM || '').toLowerCase();

  if (platform === 'accesstrade') {
    const link = await generateViaAccessTrade(originalUrl);
    if (link) return link;
    console.warn('[Affiliate] AccessTrade failed, falling back to manual');
  }

  if (platform === 'shopee' || process.env.SHOPEE_AFFILIATE_ID) {
    const link = generateViaShopeeManual(originalUrl);
    if (link) return link;
  }

  // Không có cấu hình → trả về URL gốc (demo mode)
  console.warn('[Affiliate] No platform configured — returning original URL');
  return originalUrl;
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

    const affiliateUrl = await generateAffiliateLink(trimmedUrl);

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
