import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, set, push, onValue } from 'firebase/database';
import { logEvent } from 'firebase/analytics';
import { db, rtdb, analytics } from './firebase.js';

const PROFILE_DOC_ID = 'billal_main_profile';

/**
 * Save Bio Profile to Firebase Cloud Firestore & RTDB with fallback
 */
export async function saveProfileToCloud(profileData) {
  try {
    if (db) {
      const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
      await setDoc(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }

    // Also mirror to Realtime Database for high-speed sync
    if (rtdb) {
      try {
        const rtdbRef = ref(rtdb, 'profile');
        await set(rtdbRef, {
          ...profileData,
          updatedAt: Date.now()
        }).catch(() => {});
      } catch (e) {
        // RTDB optional sync
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error?.message || 'Cloud sync unavailable' };
  }
}

/**
 * Listen to real-time Profile updates from Cloud (Firestore & RTDB fallback)
 */
export function subscribeToCloudProfile(onUpdate) {
  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  try {
    if (db) {
      const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
      unsubFirestore = onSnapshot(profileRef, (docSnap) => {
        if (docSnap && docSnap.exists()) {
          const cloudData = docSnap.data();
          onUpdate(cloudData);
        }
      }, () => {
        // Silently handle Firestore backend unavailable, switch to RTDB
      });
    }

    // Realtime Database listener as fast sync
    if (rtdb) {
      try {
        const rtdbRef = ref(rtdb, 'profile');
        unsubRtdb = onValue(rtdbRef, (snapshot) => {
          const val = snapshot.val();
          if (val) {
            onUpdate(val);
          }
        }, () => {});
      } catch (e) {}
    }
  } catch (error) {
    // Silent recovery
  }

  return () => {
    try { unsubFirestore?.(); } catch (e) {}
    try { unsubRtdb?.(); } catch (e) {}
  };
}

/**
 * Save new Contact Message directly to Firebase Cloud
 */
export async function saveContactMessageToCloud(messageData) {
  let docId = 'msg_' + Date.now();
  try {
    if (db) {
      const messagesCollection = collection(db, 'messages');
      const docRef = await addDoc(messagesCollection, {
        ...messageData,
        createdAt: serverTimestamp(),
        read: false
      }).catch(() => null);

      if (docRef?.id) {
        docId = docRef.id;
      }
    }

    // Also push to Realtime Database
    if (rtdb) {
      try {
        const rtdbMessages = ref(rtdb, 'messages');
        await push(rtdbMessages, {
          ...messageData,
          firebaseId: docId,
          createdAt: Date.now(),
          read: false
        }).catch(() => {});
      } catch (e) {
        // RTDB optional
      }
    }

    return { success: true, id: docId };
  } catch (error) {
    return { success: true, id: docId };
  }
}

/**
 * Listen to real-time Contact Messages from Cloud
 */
export function subscribeToCloudMessages(onMessagesUpdate) {
  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  try {
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
      }, () => {
        // Firestore unavailable silent fallback
      });
    }

    // RTDB fallback listener
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
  } catch (error) {
    // Ignore error
  }

  return () => {
    try { unsubFirestore?.(); } catch (e) {}
    try { unsubRtdb?.(); } catch (e) {}
  };
}

/**
 * Delete a message from Firebase Cloud
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
 * Mark a message as read in Firebase Cloud
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
 * Track events to Firebase Analytics and Firestore Analytics Collection
 */
export async function trackCloudAnalytics(event, label, device) {
  try {
    // 1. Google Analytics 4 event
    if (analytics) {
      logEvent(analytics, event, {
        item_name: label,
        device_type: device
      });
    }

    // 2. Aggregate count in Firestore
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
  } catch (error) {
    // Analytics silent fail
  }
}

