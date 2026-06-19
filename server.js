'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');

const app          = express();
const PORT         = process.env.PORT || 3004;
const DATA_DIR     = path.join(__dirname, 'data');
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json');

// ── Security headers ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '));
  next();
});

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2kb' }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    if (/\.(svg|png|jpg|ico|woff2?|ttf|otf)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// ── Simple in-memory rate limiter (5 req/min per IP) ─────────────────────────
const rateMap = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateMap) {
    if (now - v.t > 60_000) rateMap.delete(k);
  }
}, 60_000);

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.t > 60_000) {
    rateMap.set(ip, { t: now, n: 1 });
    return false;
  }
  if (entry.n >= 5) return true;
  entry.n++;
  return false;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readWaitlist() {
  ensureDataDir();
  try { return JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf8')); }
  catch { return []; }
}

function writeWaitlist(data) {
  ensureDataDir();
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));
}

function getIp(req) {
  return ((req.headers['x-forwarded-for'] || '') + ',' + req.socket.remoteAddress)
    .split(',')[0].trim();
}

function hashIp(ip) {
  return crypto.createHash('sha256')
    .update(ip + new Date().toISOString().slice(0, 10))
    .digest('hex')
    .slice(0, 12);
}

// ── POST /api/waitlist ────────────────────────────────────────────────────────
app.post('/api/waitlist', (req, res) => {
  const ip = getIp(req);

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }

  const { email, website } = req.body ?? {};

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const normalizedEmail   = email.trim().toLowerCase();
  const normalizedWebsite = typeof website === 'string' ? website.trim().toLowerCase() : '';

  const waitlist = readWaitlist();

  if (waitlist.some(e => e.email === normalizedEmail)) {
    return res.json({ status: 'already_registered', message: "You're already on the list!" });
  }

  waitlist.push({
    email:     normalizedEmail,
    website:   normalizedWebsite || null,
    joinedAt:  new Date().toISOString(),
    ipHash:    hashIp(ip),
  });

  try {
    writeWaitlist(waitlist);
  } catch (err) {
    console.error('Failed to write waitlist:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  console.log(`[waitlist] +1 → ${normalizedEmail} (total: ${waitlist.length})`);

  res.json({ status: 'success', message: "You're on the list.", position: waitlist.length });
});

// ── Legal pages ───────────────────────────────────────────────────────────────
app.get('/privacy', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'privacy.html')));
app.get('/terms',   (_req, res) => res.sendFile(path.join(__dirname, 'public', 'terms.html')));

// ── Fallback → SPA ────────────────────────────────────────────────────────────
app.use((_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Lumastat → http://localhost:${PORT}`));
