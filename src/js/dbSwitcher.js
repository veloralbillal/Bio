/**
 * Database Provider Switcher & State Manager
 * Allows dynamic swapping between Firebase Firestore/RTDB and Supabase Postgres
 */

const ACTIVE_DB_STORAGE_KEY = 'gravatar_active_db_provider_v1';

export const DB_PROVIDERS = {
  FIREBASE: 'firebase',
  SUPABASE: 'supabase',
  DUAL_SYNC: 'dual' // Default: writes to both, reads from primary
};

/**
 * Get current active database provider
 */
export function getActiveDbProvider() {
  try {
    const saved = localStorage.getItem(ACTIVE_DB_STORAGE_KEY);
    if (saved && Object.values(DB_PROVIDERS).includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return DB_PROVIDERS.FIREBASE;
}

/**
 * Set active database provider and dispatch global event
 */
export function setActiveDbProvider(provider) {
  try {
    localStorage.setItem(ACTIVE_DB_STORAGE_KEY, provider);
    window.dispatchEvent(new CustomEvent('gravatar_db_provider_changed', { detail: { provider } }));
    return { success: true, provider };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Toggle/swap between Firebase and Supabase
 */
export function swapDatabaseProvider() {
  const current = getActiveDbProvider();
  let next = DB_PROVIDERS.FIREBASE;
  if (current === DB_PROVIDERS.FIREBASE) {
    next = DB_PROVIDERS.SUPABASE;
  } else if (current === DB_PROVIDERS.SUPABASE) {
    next = DB_PROVIDERS.DUAL_SYNC;
  } else {
    next = DB_PROVIDERS.FIREBASE;
  }
  setActiveDbProvider(next);
  return next;
}
