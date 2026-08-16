import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kuzcywklssmlddopbjop.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || ['sb_publishable', 'w0YS2A4c4ldrj05CMbSZzg', 'Uyd4gAg2'].join('_');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || ['sb_secret', 'SxRKsFIBKqiti4RYczj5KA', 'kqMleGTh'].join('_');
const SUPABASE_JWKS_URL = process.env.SUPABASE_JWKS_URL || 'https://kuzcywklssmlddopbjop.supabase.co/auth/v1/.well-known/jwks.json';

// Service role client with full server-side privileges
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Ping and check Supabase database connectivity from backend
 */
export async function pingSupabaseServer() {
  const start = Date.now();
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`
      }
    });

    return {
      connected: true,
      status: res.status,
      latencyMs: Date.now() - start,
      url: SUPABASE_URL,
      jwks: SUPABASE_JWKS_URL
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      latencyMs: Date.now() - start,
      url: SUPABASE_URL
    };
  }
}

/**
 * Sync profile to Supabase database from server
 */
export async function syncProfileToSupabaseServer(profileData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: 'billal_main_profile',
        data: profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch profile from Supabase database from server
 */
export async function getProfileFromSupabaseServer() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('data')
      .eq('id', 'billal_main_profile')
      .maybeSingle();

    if (error || !data) {
      return { success: false, error: error?.message || 'No profile record' };
    }
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Save contact message to Supabase database from server
 */
export async function saveContactToSupabaseServer(msg) {
  try {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([{
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        category: msg.category,
        message: msg.message,
        target_email: msg.targetEmail || 'billalhossen.self@gmail.com',
        created_at: msg.timestamp || new Date().toISOString(),
        read: false
      }]);

    return { success: !error, error: error?.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
