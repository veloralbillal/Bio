import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { 
  initializeFirestore,
  setLogLevel
} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyD6X4-KjTb521bDzZjQFd-jbphNil7XAjo",
  authDomain: "veloralbillal.firebaseapp.com",
  databaseURL: "https://veloralbillal-default-rtdb.firebaseio.com",
  projectId: "veloralbillal",
  storageBucket: "veloralbillal.firebasestorage.app",
  messagingSenderId: "657968912821",
  appId: "1:657968912821:web:83d69a4ffb20536dcb61fc",
  measurementId: "G-XFDC6ZJC8B"
};

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

