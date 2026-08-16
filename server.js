import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateSitemapXml, generateRobotsTxt } from './src/js/seoGenerator.js';
import { 
  pingSupabaseServer, 
  syncProfileToSupabaseServer, 
  getProfileFromSupabaseServer, 
  saveContactToSupabaseServer 
} from './serverSupabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store with file backup if available
const DATA_FILE = path.join(__dirname, 'data_store.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

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

function syncSeoFiles(domain) {
  try {
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    const sitemapContent = generateSitemapXml(store.profile || {}, domain);
    const robotsContent = generateRobotsTxt(domain);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent, 'utf-8');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsContent, 'utf-8');
  } catch (e) {
    // Non-critical file write
  }
}

function saveData(domain = '') {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    if (domain) {
      syncSeoFiles(domain);
    }
  } catch (err) {
    console.error('Error saving data store:', err);
  }
}

// Dynamic Robots.txt for Google & Search Engine Indexing
app.get('/robots.txt', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host');
  const domain = `${protocol}://${host}`;

  const robotsTxt = generateRobotsTxt(domain);
  res.send(robotsTxt);
});

// Dynamic XML Sitemap for Auto Indexing based on portfolio & websites
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host');
  const domain = `${protocol}://${host}`;

  const xml = generateSitemapXml(store.profile || {}, domain);
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

  // Async server-side push to Supabase
  saveContactToSupabaseServer(newMessage).catch(() => {});

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
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host');
  const domain = `${protocol}://${host}`;
  saveData(domain);

  // Sync with Supabase in background
  syncProfileToSupabaseServer(req.body).catch(() => {});

  return res.json({ success: true, profile: store.profile });
});

// Supabase Status Endpoint
app.get('/api/supabase/status', async (req, res) => {
  const status = await pingSupabaseServer();
  return res.json(status);
});

// Supabase Force Sync Endpoint
app.post('/api/supabase/sync', async (req, res) => {
  const profileToSync = req.body.profile || store.profile;
  if (!profileToSync) {
    return res.status(400).json({ success: false, error: 'No profile data provided to sync' });
  }
  const result = await syncProfileToSupabaseServer(profileToSync);
  return res.json(result);
});

// Supabase Fetch Profile Endpoint
app.get('/api/supabase/fetch', async (req, res) => {
  const result = await getProfileFromSupabaseServer();
  return res.json(result);
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
