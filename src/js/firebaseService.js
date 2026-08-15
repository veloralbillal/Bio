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
 * Save Bio Profile to Firebase Cloud Firestore & RTDB
 */
export async function saveProfileToCloud(profileData) {
  try {
    const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
    await setDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Also mirror to Realtime Database for high-speed sync
    try {
      const rtdbRef = ref(rtdb, 'profile');
      await set(rtdbRef, {
        ...profileData,
        updatedAt: Date.now()
      });
    } catch (e) {
      // RTDB optional sync
    }

    return { success: true };
  } catch (error) {
    console.warn('Firebase Cloud save failed (will keep local copy):', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen to real-time Profile updates from Cloud
 */
export function subscribeToCloudProfile(onUpdate) {
  try {
    const profileRef = doc(db, 'profiles', PROFILE_DOC_ID);
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        onUpdate(cloudData);
      }
    }, (error) => {
      console.warn('Firestore profile subscription fallback:', error.message);
    });
    return unsubscribe;
  } catch (error) {
    console.warn('Firebase subscription error:', error);
    return () => {};
  }
}

/**
 * Save new Contact Message directly to Firebase Cloud
 */
export async function saveContactMessageToCloud(messageData) {
  try {
    const messagesCollection = collection(db, 'messages');
    const docRef = await addDoc(messagesCollection, {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false
    });

    // Also push to Realtime Database
    try {
      const rtdbMessages = ref(rtdb, 'messages');
      await push(rtdbMessages, {
        ...messageData,
        firebaseId: docRef.id,
        createdAt: Date.now(),
        read: false
      });
    } catch (e) {
      // RTDB optional
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn('Firebase message save failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen to real-time Contact Messages from Cloud
 */
export function subscribeToCloudMessages(onMessagesUpdate) {
  try {
    const messagesCollection = collection(db, 'messages');
    const q = query(messagesCollection, orderBy('createdAt', 'desc'), limit(100));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    }, (error) => {
      console.warn('Firestore messages subscription error:', error.message);
    });

    return unsubscribe;
  } catch (error) {
    console.warn('Firebase messages subscription error:', error);
    return () => {};
  }
}

/**
 * Delete a message from Firebase Cloud
 */
export async function deleteCloudMessage(messageId) {
  try {
    const messageDoc = doc(db, 'messages', messageId);
    await deleteDoc(messageDoc);
    return { success: true };
  } catch (error) {
    console.warn('Cloud message delete failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark a message as read in Firebase Cloud
 */
export async function markCloudMessageRead(messageId) {
  try {
    const messageDoc = doc(db, 'messages', messageId);
    await updateDoc(messageDoc, { read: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
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
    const statsDocRef = doc(db, 'analytics', 'global_stats');
    if (event === 'page_view') {
      await setDoc(statsDocRef, {
        totalViews: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } else if (event === 'link_click' && label) {
      const sanitizedKey = label.replace(/[^a-zA-Z0-9_]/g, '_');
      await setDoc(statsDocRef, {
        [`clicks_${sanitizedKey}`]: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    // Analytics silent fail
  }
}
