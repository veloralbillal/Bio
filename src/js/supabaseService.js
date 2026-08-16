import { supabase, getSupabaseConfig } from './supabaseConfig.js';
import { optimizeImage } from './imageOptimizer.js';

const PROFILE_RECORD_ID = 'billal_main_profile';

/**
 * Sanitize and prepare profile payload for Supabase database insertion
 */
async function prepareSupabaseProfile(data) {
  if (!data || typeof data !== 'object') return {};
  const payload = { ...data };

  // Compress avatar if large base64
  if (typeof payload.avatarUrl === 'string' && payload.avatarUrl.startsWith('data:image') && payload.avatarUrl.length > 200000) {
    try {
      payload.avatarUrl = await optimizeImage(payload.avatarUrl, { maxWidth: 400, maxHeight: 400, quality: 0.82 });
    } catch (e) {}
  }

  // Compress cover if large base64
  if (typeof payload.coverUrl === 'string' && payload.coverUrl.startsWith('data:image') && payload.coverUrl.length > 300000) {
    try {
      payload.coverUrl = await optimizeImage(payload.coverUrl, { maxWidth: 1200, maxHeight: 600, quality: 0.80 });
    } catch (e) {}
  }

  return payload;
}

/**
 * Test Supabase Database & Auth API Connection
 */
export async function testSupabaseConnection() {
  const startTime = Date.now();
  const config = getSupabaseConfig();

  try {
    // 1. Test Auth / JWKS or REST health endpoint
    const response = await fetch(`${config.url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': config.publishableKey,
        'Authorization': `Bearer ${config.publishableKey}`
      }
    });

    const latencyMs = Date.now() - startTime;

    if (response.ok || response.status === 200 || response.status === 404) {
      return {
        success: true,
        latencyMs,
        url: config.url,
        status: 'Connected',
        error: null
      };
    } else {
      return {
        success: true, // Server reachable
        latencyMs,
        url: config.url,
        status: `HTTP ${response.status}`,
        error: null
      };
    }
  } catch (err) {
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      url: config.url,
      status: 'Disconnected',
      error: err.message
    };
  }
}

/**
 * Save / Upsert Profile in Supabase (profiles table or app_data table)
 */
export async function saveProfileToSupabase(profileData) {
  try {
    const preparedData = await prepareSupabaseProfile(profileData);
    
    // Try upserting to 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: PROFILE_RECORD_ID,
        data: preparedData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();

    if (error) {
      // If 'profiles' table doesn't exist, try generic 'app_data' or fallback to server endpoint
      const serverRes = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: preparedData })
      }).then(r => r.json()).catch(() => null);

      if (serverRes?.success) {
        return { success: true, via: 'Server Proxy', data: preparedData };
      }

      console.warn('Supabase direct table write notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, via: 'Direct Supabase Table', data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch Profile from Supabase
 */
export async function fetchProfileFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('data, updated_at')
      .eq('id', PROFILE_RECORD_ID)
      .maybeSingle();

    if (error) {
      // Fallback to server sync endpoint
      const serverRes = await fetch('/api/supabase/fetch').then(r => r.json()).catch(() => null);
      if (serverRes?.success && serverRes?.data) {
        return { success: true, data: serverRes.data, source: 'Supabase (via Server)' };
      }
      return { success: false, error: error.message };
    }

    if (data?.data) {
      return { success: true, data: data.data, source: 'Supabase Postgres' };
    }

    return { success: false, error: 'No profile record in Supabase' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Save Contact Message into Supabase
 */
export async function saveMessageToSupabase(messageData) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        id: messageData.id,
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        category: messageData.category,
        message: messageData.message,
        target_email: messageData.targetEmail || 'billalhossen.self@gmail.com',
        created_at: messageData.timestamp || new Date().toISOString(),
        read: false
      }])
      .select();

    if (error) {
      console.warn('Supabase message insert notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch Contact Messages from Supabase
 */
export async function fetchMessagesFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return { success: false, error: error.message };
    }

    const formatted = (data || []).map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      category: m.category,
      message: m.message,
      targetEmail: m.target_email,
      timestamp: m.created_at,
      read: m.read
    }));

    return { success: true, data: formatted };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Track Analytics Event to Supabase
 */
export async function trackSupabaseAnalytics(event, label, device) {
  try {
    await supabase.from('analytics_logs').insert([{
      event_type: event,
      label: label || '',
      device: device || 'desktop',
      created_at: new Date().toISOString()
    }]);
  } catch (e) {}
}
