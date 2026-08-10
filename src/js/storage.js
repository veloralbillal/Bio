import { initialProfileData } from './initialData.js';

const STORAGE_KEY = 'gravatar_hub_profile_v2';
const MESSAGES_KEY = 'gravatar_hub_messages_v1';
const ANALYTICS_KEY = 'gravatar_hub_analytics_v1';
const ADMIN_TOKEN_KEY = 'gravatar_admin_token';

// Default initial sample messages
const initialMessages = [
  {
    id: 'msg_init_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techlead.io',
    subject: 'Senior Full Stack Consulting Inquiry',
    category: 'Project Hiring / Consulting',
    message: 'Hello Billal! We reviewed your Gravatar profile and portfolio. We would love to collaborate on a high-scale React & Express web application for our team.',
    targetEmail: 'billalhossen.self@gmail.com',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: false
  },
  {
    id: 'msg_init_2',
    name: 'Alex Rivera',
    email: 'alex@opensource.org',
    subject: 'Open Source Security Collaboration',
    category: 'Open Source Collaboration',
    message: 'Hey Billal, great work on SylhetScribe.xyz! Are you interested in co-authoring a guide on ethical security for developers?',
    targetEmail: 'billalhossen.self@gmail.com',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: true
  }
];

// Load stored messages from localStorage
export function getStoredMessages() {
  try {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading messages from localStorage:', err);
  }
  // Initialize with initial messages if empty
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(initialMessages));
  } catch (e) {}
  return initialMessages;
}

// Save a new message to localStorage and dispatch update event
export function saveStoredMessage(newMessage) {
  try {
    const messages = getStoredMessages();
    // Add to top of array
    const updated = [newMessage, ...messages];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    // Dispatch global custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent('gravatar_messages_updated', { detail: updated }));
    return newMessage;
  } catch (err) {
    console.error('Error saving message to localStorage:', err);
    return newMessage;
  }
}

// Delete a message by ID from localStorage
export function deleteStoredMessage(messageId) {
  try {
    const messages = getStoredMessages();
    const updated = messages.filter(m => m.id !== messageId);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gravatar_messages_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error deleting message:', err);
    return [];
  }
}

// Load profile data from localStorage or fallback to initialProfileData
export function loadProfileData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialProfileData, ...parsed };
    }
  } catch (err) {
    console.error('Error reading localStorage:', err);
  }
  return initialProfileData;
}

// Save profile data to localStorage and optionally sync to backend API
export function saveProfileData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('gravatar_profile_updated', { detail: data }));
    // Post to server if API is available
    fetch('/api/admin/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.log('API sync skipped:', err));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// Send Contact Message (Saves locally AND sends to API)
export async function sendContactMessage(formData) {
  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: formData.name,
    email: formData.email,
    subject: formData.subject || 'New Direct Contact Message',
    category: formData.category || 'General Inquiry',
    message: formData.message,
    targetEmail: 'billalhossen.self@gmail.com',
    timestamp: new Date().toISOString(),
    read: false
  };

  // 1. ALWAYS store locally first so messages are never lost in client or offline
  saveStoredMessage(newMessage);

  // 2. Also try API endpoint sync to backend server
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      const resData = await response.json();
      if (resData.success) {
        return resData;
      }
    }
  } catch (err) {
    console.warn('Backend API offline, saved message in local state:', err);
  }

  return {
    success: true,
    message: 'Message delivered directly and saved for billalhossen.self@gmail.com!',
    details: newMessage
  };
}

// Track page views and link clicks locally and via API
export function trackEvent(event, label) {
  try {
    const isMobile = window.innerWidth < 768;
    // Local analytics tracker
    const raw = localStorage.getItem(ANALYTICS_KEY);
    let stats = raw ? JSON.parse(raw) : { views: 240, clicks: {}, recentLogs: [] };
    
    if (event === 'page_view') {
      stats.views = (stats.views || 0) + 1;
      stats.recentLogs = [
        { id: 'log_' + Date.now(), text: `Page view on ${label || 'home'} (${isMobile ? 'Mobile' : 'Desktop'})`, time: new Date().toLocaleTimeString() },
        ...(stats.recentLogs || []).slice(0, 19)
      ];
    } else if (event === 'link_click' && label) {
      stats.clicks = stats.clicks || {};
      stats.clicks[label] = (stats.clicks[label] || 0) + 1;
      stats.recentLogs = [
        { id: 'log_' + Date.now(), text: `Clicked link: ${label}`, time: new Date().toLocaleTimeString() },
        ...(stats.recentLogs || []).slice(0, 19)
      ];
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent('gravatar_analytics_updated', { detail: stats }));

    // Async server track
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        label,
        device: isMobile ? 'mobile' : 'desktop'
      })
    }).catch(() => {});
  } catch (err) {
    // Ignore analytics tracking errors
  }
}

// Generate vCard string for contact download
export function generateVCard(profile) {
  return `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
N:${profile.name.split(' ').slice(-1)[0]};${profile.name.split(' ')[0]};;;
TITLE:${profile.title}
ORG:${profile.company}
EMAIL;TYPE=INTERNET,PREF:${profile.email}
URL:${profile.socialLinks?.find(l => l.id === 'website')?.url || 'https://billalhossen.com'}
NOTE:${profile.bio.replace(/\n/g, ' ')}
END:VCARD`;
}

// Download vCard file helper
export function downloadVCardFile(profile) {
  const vcardData = generateVCard(profile);
  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${profile.username}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
