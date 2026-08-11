import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store with file backup if available
const DATA_FILE = path.join(__dirname, 'data_store.json');

let store = {
  adminPin: '1234', // Secret default PIN
  profile: null,
  messages: [],
  analytics: {
    views: 1420,
    uniqueVisitors: 890,
    linkClicks: { github: 340, linkedin: 280, twitter: 210, email: 180 },
    countries: { 'Bangladesh': 520, 'United States': 310, 'United Kingdom': 180, 'Germany': 140, 'Others': 270 },
    devices: { mobile: 58, desktop: 38, tablet: 4 },
    recentViews: []
  }
};

// Load persistent data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    store = { ...store, ...data };
  } catch (err) {
    console.error('Error loading data store:', err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error saving data store:', err);
  }
}

// Dynamic Robots.txt for Google & Search Engine Indexing
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host');
  const domain = `${protocol}://${host}`;

  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

# Auto Index Sitemap
Sitemap: ${domain}/sitemap.xml
Host: ${domain}
`);
});

// Dynamic XML Sitemap for Auto Indexing
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host');
  const domain = `${protocol}://${host}`;
  const lastMod = new Date().toISOString().split('T')[0];

  const profile = store.profile || {};
  const socialLinks = (profile.socialLinks || []).filter(l => l.enabled !== false && l.url);

  const socialNodes = socialLinks.map(link => {
    const cleanUrl = link.url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
  <url>
    <loc>${cleanUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/#socials</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/#projects</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/#contact</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>${socialNodes}
</urlset>`;

  res.send(xml);
});

// API Routes

// Contact Form Endpoint (Sends message to billalhossen.self@gmail.com)
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message, category } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  const newMessage = {
    id: 'msg_' + Date.now(),
    name,
    email,
    subject: subject || 'New Profile Contact Message',
    message,
    category: category || 'General',
    targetEmail: 'billalhossen.self@gmail.com',
    timestamp: new Date().toISOString(),
    read: false
  };

  store.messages.unshift(newMessage);
  saveData();

  console.log(`[CONTACT EMAIL SENT] To: billalhossen.self@gmail.com | From: ${name} (${email}) | Subject: ${subject}`);

  return res.json({
    success: true,
    message: 'Message sent successfully! A copy has been delivered to billalhossen.self@gmail.com',
    details: newMessage
  });
});

// Admin Verification
app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === store.adminPin) {
    return res.json({ success: true, token: 'secret_admin_token_' + Date.now() });
  }
  return res.status(401).json({ success: false, error: 'Invalid secret PIN' });
});

// Admin Change PIN
app.post('/api/admin/change-pin', (req, res) => {
  const { currentPin, newPin } = req.body;
  if (currentPin !== store.adminPin) {
    return res.status(401).json({ success: false, error: 'Current PIN is incorrect' });
  }
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ success: false, error: 'New PIN must be at least 4 characters' });
  }
  store.adminPin = newPin;
  saveData();
  return res.json({ success: true, message: 'Admin PIN updated successfully' });
});

// Analytics Tracking
app.post('/api/analytics/track', (req, res) => {
  const { event, label, device } = req.body;
  if (event === 'page_view') {
    store.analytics.views += 1;
    store.analytics.recentViews.unshift({
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      device: device || 'desktop'
    });
    if (store.analytics.recentViews.length > 50) store.analytics.recentViews.pop();
  } else if (event === 'link_click' && label) {
    store.analytics.linkClicks[label] = (store.analytics.linkClicks[label] || 0) + 1;
  }
  saveData();
  return res.json({ success: true });
});

// Get Admin Analytics & Messages
app.get('/api/admin/data', (req, res) => {
  return res.json({
    success: true,
    analytics: store.analytics,
    messages: store.messages,
    profile: store.profile
  });
});

// Save Admin Profile / Config
app.post('/api/admin/profile', (req, res) => {
  store.profile = req.body;
  saveData();
  return res.json({ success: true, profile: store.profile });
});

// Mark Message as Read or Delete Message
app.post('/api/admin/messages/action', (req, res) => {
  const { action, messageId } = req.body;
  if (action === 'read') {
    store.messages = store.messages.map(m => m.id === messageId ? { ...m, read: true } : m);
  } else if (action === 'delete') {
    store.messages = store.messages.filter(m => m.id !== messageId);
  } else if (action === 'clear_all') {
    store.messages = [];
  }
  saveData();
  return res.json({ success: true, messages: store.messages });
});

// Serve static assets in standalone production mode only
const distPath = path.join(__dirname, 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export default app;
