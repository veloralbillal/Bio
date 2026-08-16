import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getFirebaseConfig } from './firebaseConfigManager.js';

export const firebaseConfig = getFirebaseConfig();

// Suppress excessive Firestore backend connection warnings
try {
  setLogLevel('silent');
} catch (e) {
  // Ignore
}

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with auto-detect long polling and robust offline fallback
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true
});

// Initialize Realtime Database
export const rtdb = getDatabase(app);

// Initialize Analytics if supported in browser environment
export let analytics = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics fallback
  });
}
