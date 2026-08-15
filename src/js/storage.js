import { initialProfileData } from './initialData.js';
import {
  saveProfileToCloud,
  subscribeToCloudProfile,
  saveContactMessageToCloud,
  subscribeToCloudMessages,
  deleteCloudMessage,
  markCloudMessageRead,
  trackCloudAnalytics
} from './firebaseService.js';

const STORAGE_KEY = 'gravatar_hub_profile_v2';
const MESSAGES_KEY = 'gravatar_hub_messages_v1';
const ANALYTICS_KEY = 'gravatar_hub_analytics_v1';

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
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(initialMessages));
  } catch (e) {}
  return initialMessages;
}

// Save a new message to localStorage and dispatch update event
export function saveStoredMessage(newMessage) {
  try {
    const messages = getStoredMessages();
    const exists = messages.some(m => m.id === newMessage.id);
    const updated = exists 
      ? messages.map(m => m.id === newMessage.id ? { ...m, ...newMessage } : m)
      : [newMessage, ...messages];
      
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gravatar_messages_updated', { detail: updated }));
    return newMessage;
  } catch (err) {
    console.error('Error saving message to localStorage:', err);
    return newMessage;
  }
}

// Delete a message by ID from localStorage and Firebase Cloud
export function deleteStoredMessage(messageId) {
  try {
    const messages = getStoredMessages();
    const updated = messages.filter(m => m.id !== messageId);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gravatar_messages_updated', { detail: updated }));
    
    // Also delete from Firebase Cloud
    deleteCloudMessage(messageId);
    return updated;
  } catch (err) {
    console.error('Error deleting message:', err);
    return [];
  }
}

// Mark message as read
export function markMessageAsRead(messageId) {
  try {
    const messages = getStoredMessages();
    const updated = messages.map(m => m.id === messageId ? { ...m, read: true } : m);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gravatar_messages_updated', { detail: updated }));
    
    // Also update in Firebase Cloud
    markCloudMessageRead(messageId);
    return updated;
  } catch (err) {
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

// Save profile data to localStorage, Firebase Cloud, and API
export function saveProfileData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('gravatar_profile_updated', { detail: data }));
    
    // 1. Sync directly to Firebase Firestore & RTDB Cloud
    saveProfileToCloud(data);

    // 2. Post to server if Express API is available
    fetch('/api/admin/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
  } catch (err) {
    console.error('Error saving profile data:', err);
  }
}

// Initialize Realtime Cloud synchronization listeners
export function initCloudSync(onProfileUpdate, onMessagesUpdate) {
  // Listen for Cloud Profile changes
  const unsubProfile = subscribeToCloudProfile((cloudProfile) => {
    if (cloudProfile) {
      const merged = { ...loadProfileData(), ...cloudProfile };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('gravatar_profile_updated', { detail: merged }));
      if (onProfileUpdate) onProfileUpdate(merged);
    }
  });

  // Listen for Cloud Messages changes
  const unsubMessages = subscribeToCloudMessages((cloudMessages) => {
    if (cloudMessages && cloudMessages.length > 0) {
      const local = getStoredMessages();
      // Merge unique messages
      const map = new Map();
      [...cloudMessages, ...local].forEach(m => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
      const merged = Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('gravatar_messages_updated', { detail: merged }));
      if (onMessagesUpdate) onMessagesUpdate(merged);
    }
  });

  return () => {
    unsubProfile?.();
    unsubMessages?.();
  };
}

// Send Contact Message (Saves locally, pushes to Firebase Cloud, and API)
export async function sendContactMessage(formData) {
  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: formData.name,
    email: formData.email,
    subject: formData.subject || 'New Direct Contact Message',
    category: formData.category || 'General Inquiry',
    message: formData.message,
    targetEmail: 'billalhossen.self@gmail.com',
    timestamp: new Date().toISOString(),
    read: false
  };

  // 1. Store locally for immediate responsiveness
  saveStoredMessage(newMessage);

  // 2. Save directly to Firebase Firestore & RTDB Cloud
  const cloudRes = await saveContactMessageToCloud(newMessage);
  if (cloudRes.success && cloudRes.id) {
    newMessage.firebaseId = cloudRes.id;
  }

  // 3. Also post to backend server if online
  try {
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch(() => {});
  } catch (err) {}

  return {
    success: true,
    message: 'Message delivered to Cloud & saved for billalhossen.self@gmail.com!',
    details: newMessage
  };
}

// Track page views and link clicks locally and in Firebase Analytics
export function trackEvent(event, label) {
  try {
    const isMobile = window.innerWidth < 768;
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

    // Firebase Cloud Analytics & Firestore tracking
    trackCloudAnalytics(event, label, isMobile ? 'mobile' : 'desktop');

    // Async server tracking
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        label,
        device: isMobile ? 'mobile' : 'desktop'
      })
    }).catch(() => {});
  } catch (err) {}
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
