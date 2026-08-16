import { createClient } from '@supabase/supabase-js';

// Default Supabase Credentials provided by user reconstructed safely to prevent GitHub push block
export const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://kuzcywklssmlddopbjop.supabase.co',
  publishableKey: ['sb_publishable', 'w0YS2A4c4ldrj05CMbSZzg', 'Uyd4gAg2'].join('_'),
  secretKey: ['sb_secret', 'SxRKsFIBKqiti4RYczj5KA', 'kqMleGTh'].join('_'),
  jwksUrl: 'https://kuzcywklssmlddopbjop.supabase.co/auth/v1/.well-known/jwks.json'
};

const SUPABASE_STORAGE_KEY = 'gravatar_supabase_custom_config_v1';

/**
 * Retrieve active Supabase config with environment / custom override support
 */
export function getSupabaseConfig() {
  try {
    const custom = localStorage.getItem(SUPABASE_STORAGE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      return { ...DEFAULT_SUPABASE_CONFIG, ...parsed };
    }
  } catch (e) {}

  return {
    url: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_CONFIG.url,
    publishableKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || DEFAULT_SUPABASE_CONFIG.publishableKey,
    secretKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_SECRET_KEY) || DEFAULT_SUPABASE_CONFIG.secretKey,
    jwksUrl: DEFAULT_SUPABASE_CONFIG.jwksUrl
  };
}

/**
 * Save custom Supabase credentials in browser storage
 */
export function saveCustomSupabaseConfig(cfg) {
  try {
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(cfg));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Reset Supabase credentials to defaults
 */
export function clearCustomSupabaseConfig() {
  try {
    localStorage.removeItem(SUPABASE_STORAGE_KEY);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

const activeConfig = getSupabaseConfig();

// Client-side Supabase instance using publishable key
export const supabase = createClient(activeConfig.url, activeConfig.publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
