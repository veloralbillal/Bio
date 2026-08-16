import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, set, push, onValue, get } from 'firebase/database';
import { logEvent } from 'firebase/analytics';
import { db, rtdb, analytics } from './firebase.js';
import { optimizeImage } from './imageOptimizer.js';

const PROFILE_DOC_ID = 'billal_main_profile';

/**
 * Sanitize & Compress oversized images in profileData payload before cloud sync
 */
async function prepareProfilePayload(data) {
  if (!data || typeof data !== 'object') return {};
  const payload = { ...data };

  // 1. Optimize Avatar if it is a large base64 string
  if (typeof payload.avatarUrl === 'string' && payload.avatarUrl.startsWith('data:image') && payload.avatarUrl.length > 200000) {
    try {
      payload.avatarUrl = await optimizeImage(payload.avatarUrl, { maxWidth: 400, maxHeight: 400, quality: 0.82 });
    } catch (e) {}
  }

  // 2. Optimize Cover if it is a large base64 string
  if (typeof payload.coverUrl === 'string' && payload.coverUrl.startsWith('data:image') && payload.coverUrl.length > 300000) {
    try {
      payload.coverUrl = await optimizeImage(payload.coverUrl, { maxWidth: 1200, maxHeight: 600, quality: 0.80 });
    } catch (e) {}
  }

  // 3. Optimize Project Images
  if (Array.isArray(payload.projects)) {
    payload.projects = await Promise.all(payload.projects.map(async (proj) => {
      if (proj && typeof proj.image === 'string' && proj.image.startsWith('data:image') && proj.image.length > 200000) {
        try {
          const opt = await optimizeImage(proj.image, { maxWidth: 800, maxHeight: 600, quality: 0.80 });
          return { ...proj, image: opt };
        } catch (e) {
          return proj;
        }
      }
      return proj;
    }));
  }

  return payload;
}

/**
 * Save Bio Profile to Firebase Cloud Firestore & RTDB with fallback
 */
export async function saveProfileToCloud(profileData) {
  let firestoreOk = false;
  let rtdbOk = false;
  let lastErr = null;

  // Prepare & optimize payload (compress large base64 banner/avatar)
  const preparedData = await prepareProfilePayload(profileData);

  // 1. Sync to Firestore
  if (db) {
    try {
      const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
      await setDoc(profileRef, {
        ...preparedData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      firestoreOk = true;
    } catch (err) {
      console.warn('Firestore sync warning:', err?.message);
      lastErr = err;
    }
  }

  // 2. Sync to Realtime Database
  if (rtdb) {
    try {
      const rtdbRef = ref(rtdb, 'profile');
      await set(rtdbRef, {
        ...preparedData,
        updatedAt: Date.now()
      });
      rtdbOk = true;
    } catch (err) {
      console.warn('RTDB sync warning:', err?.message);
      if (!lastErr) lastErr = err;
    }
  }

  if (firestoreOk || rtdbOk) {
    return { success: true, firestore: firestoreOk, rtdb: rtdbOk, optimizedData: preparedData };
  }

  return { success: false, error: lastErr?.message || 'Cloud sync unavailable' };
}

/**
 * Fetch Profile directly from Cloud
 */
export async function fetchProfileFromCloud() {
  try {
    if (rtdb) {
      try {
        const rtdbRef = ref(rtdb, 'profile');
        const snapshot = await get(rtdbRef);
        if (snapshot.exists() && snapshot.val()) {
          return { success: true, data: snapshot.val(), source: 'Realtime Database' };
        }
      } catch (e) {}
    }

    if (db) {
      try {
        const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
        const docSnap = await getDoc(profileRef);
        if (docSnap.exists()) {
          return { success: true, data: docSnap.data(), source: 'Firestore' };
        }
      } catch (e) {}
    }

    return { success: false, error: 'No profile found in cloud' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Test Firebase Cloud Connection & Latency
 */
export async function testCloudConnection() {
  const startTime = Date.now();
  let firestoreOk = false;
  let rtdbOk = false;
  let errorMessage = '';

  // 1. Test RTDB Ping
  if (rtdb) {
    try {
      const pingRef = ref(rtdb, '_ping');
      await set(pingRef, { timestamp: Date.now() });
      rtdbOk = true;
    } catch (e) {
      errorMessage = e.message;
    }
  }

  // 2. Test Firestore Ping
  if (db) {
    try {
      const pingDoc = doc(db, '_health', 'status');
      await setDoc(pingDoc, { timestamp: serverTimestamp() }, { merge: true });
      firestoreOk = true;
    } catch (e) {
      if (!errorMessage) errorMessage = e.message;
    }
  }

  const latencyMs = Date.now() - startTime;
  const isConnected = firestoreOk || rtdbOk;

  return {
    success: isConnected,
    firestore: firestoreOk,
    rtdb: rtdbOk,
    latencyMs,
    error: isConnected ? null : (errorMessage || 'Connection failed')
  };
}

/**
 * Listen to real-time Profile updates from Cloud (Firestore & RTDB)
 */
export function subscribeToCloudProfile(onUpdate) {
  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  try {
    if (rtdb) {
      try {
        const rtdbRef = ref(rtdb, 'profile');
        unsubRtdb = onValue(rtdbRef, (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            onUpdate(val);
          }
        }, () => {});
      } catch (e) {}
    }

    if (db) {
      const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
      unsubFirestore = onSnapshot(profileRef, (docSnap) => {
        if (docSnap && docSnap.exists()) {
          const cloudData = docSnap.data();
          onUpdate(cloudData);
        }
      }, () => {});
    }
  } catch (error) {}

  return () => {
    try { unsubFirestore?.(); } catch (e) {}
    try { unsubRtdb?.(); } catch (e) {}
  };
}

/**
 * Save Contact Message to Cloud
 */
export async function saveContactMessageToCloud(messageData) {
  let docId = 'msg_' + Date.now();
  let saved = false;

  if (rtdb) {
    try {
      const rtdbMessages = ref(rtdb, 'messages');
      await push(rtdbMessages, {
        ...messageData,
        firebaseId: docId,
        createdAt: Date.now(),
        read: false
      });
      saved = true;
    } catch (e) {}
  }

  if (db) {
    try {
      const messagesCollection = collection(db, 'messages');
      const docRef = await addDoc(messagesCollection, {
        ...messageData,
        createdAt: serverTimestamp(),
        read: false
      });
      if (docRef?.id) docId = docRef.id;
      saved = true;
    } catch (e) {}
  }

  return { success: saved, id: docId };
}

/**
 * Listen to real-time Contact Messages from Cloud
 */
export function subscribeToCloudMessages(onMessagesUpdate) {
  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  try {
    if (rtdb) {
      try {
        const rtdbMessages = ref(rtdb, 'messages');
        unsubRtdb = onValue(rtdbMessages, (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list = Object.keys(val).map(k => ({
              id: val[k].firebaseId || k,
              ...val[k],
              timestamp: val[k].createdAt ? new Date(val[k].createdAt).toISOString() : new Date().toISOString()
            })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            if (list.length > 0) {
              onMessagesUpdate(list);
            }
          }
        }, () => {});
      } catch (e) {}
    }

    if (db) {
      const messagesCollection = collection(db, 'messages');
      const q = query(messagesCollection, orderBy('createdAt', 'desc'), limit(100));
      
      unsubFirestore = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot) return;
        const messages = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          messages.push({
            id: docSnap.id,
            ...data,
            timestamp: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.timestamp || new Date().toISOString()
          });
        });
        if (messages.length > 0) {
          onMessagesUpdate(messages);
        }
      }, () => {});
    }
  } catch (error) {}

  return () => {
    try { unsubFirestore?.(); } catch (e) {}
    try { unsubRtdb?.(); } catch (e) {}
  };
}

/**
 * Delete message from Cloud
 */
export async function deleteCloudMessage(messageId) {
  try {
    if (db) {
      const messageDoc = doc(db, 'messages', messageId);
      await deleteDoc(messageDoc).catch(() => {});
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error?.message };
  }
}

/**
 * Mark message as read in Cloud
 */
export async function markCloudMessageRead(messageId) {
  try {
    if (db) {
      const messageDoc = doc(db, 'messages', messageId);
      await updateDoc(messageDoc, { read: true }).catch(() => {});
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error?.message };
  }
}

/**
 * Track analytics to Firebase
 */
export async function trackCloudAnalytics(event, label, device) {
  try {
    if (analytics) {
      logEvent(analytics, event, {
        item_name: label,
        device_type: device
      });
    }

    if (db) {
      const statsDocRef = doc(db, 'analytics', 'global_stats');
      if (event === 'page_view') {
        await setDoc(statsDocRef, {
          totalViews: increment(1),
          lastUpdated: serverTimestamp()
        }, { merge: true }).catch(() => {});
      } else if (event === 'link_click' && label) {
        const sanitizedKey = label.replace(/[^a-zA-Z0-9_]/g, '_');
        await setDoc(statsDocRef, {
          [`clicks_${sanitizedKey}`]: increment(1),
          lastUpdated: serverTimestamp()
        }, { merge: true }).catch(() => {});
      }
    }
  } catch (error) {}
}
