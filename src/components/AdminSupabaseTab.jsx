import React, { useState, useEffect } from 'react';
import { 
  Database, Server, RefreshCw, CheckCircle2, AlertTriangle, 
  ExternalLink, Copy, Check, Save, RotateCcw, ShieldCheck, 
  Cloud, Terminal, Code2
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveCustomSupabaseConfig, 
  clearCustomSupabaseConfig 
} from '../js/supabaseConfig';
import { 
  testSupabaseConnection, 
  saveProfileToSupabase, 
  fetchProfileFromSupabase 
} from '../js/supabaseService';
import DbSwapButton from './DbSwapButton';

export default function AdminSupabaseTab({ profile, onUpdateProfile }) {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states
  const [urlInput, setUrlInput] = useState(config.url);
  const [pubKeyInput, setPubKeyInput] = useState(config.publishableKey);
  const [secretKeyInput, setSecretKeyInput] = useState(config.secretKey);

  useEffect(() => {
    handleTestPing();
  }, []);

  const handleTestPing = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      setStatusResult(res);
    } catch (e) {
      setStatusResult({ success: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handlePushToSupabase = async () => {
    setSyncing(true);
    try {
      const res = await saveProfileToSupabase(profile);
      if (res.success) {
        setNotification({ type: 'success', text: `Profile successfully synced to Supabase Postgres (${res.via || 'Cloud'})!` });
      } else {
        setNotification({ type: 'error', text: `Supabase sync error: ${res.error}` });
      }
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setSyncing(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handlePullFromSupabase = async () => {
    setSyncing(true);
    try {
      const res = await fetchProfileFromSupabase();
      if (res.success && res.data) {
        onUpdateProfile(res.data);
        setNotification({ type: 'success', text: `Loaded profile from ${res.source}!` });
      } else {
        setNotification({ type: 'error', text: res.error || 'No Supabase record found' });
      }
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setSyncing(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const newCfg = {
      url: urlInput.trim(),
      publishableKey: pubKeyInput.trim(),
      secretKey: secretKeyInput.trim(),
      jwksUrl: `${urlInput.trim()}/auth/v1/.well-known/jwks.json`
    };
    saveCustomSupabaseConfig(newCfg);
    setConfig(newCfg);
    setNotification({ type: 'success', text: 'Supabase configuration saved! Reloading...' });
    setTimeout(() => window.location.reload(), 1000);
  };

  const sqlSchemaCode = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  category TEXT,
  message TEXT,
  target_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS analytics_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT,
  label TEXT,
  device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-12">
      
      {/* HEADER HERO */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Supabase Cloud Database & Server Center</h2>
          </div>
          <p className="text-xs text-slate-400">
            PostgreSQL relational database sync, auto failover, and server-side secret authentication.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <DbSwapButton />

          <button
            onClick={handleTestPing}
            disabled={testing}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Ping'}</span>
          </button>

          <button
            onClick={handlePullFromSupabase}
            disabled={syncing}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-all disabled:opacity-50"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{syncing ? 'Loading...' : 'Pull from Supabase'}</span>
          </button>

          <button
            onClick={handlePushToSupabase}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <Server className="w-3.5 h-3.5" />
            <span>{syncing ? 'Syncing...' : 'Push to Supabase'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* DIAGNOSTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Database Status</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              statusResult?.success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {statusResult?.success ? '● Active / Connected' : 'Checking / Standby'}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-200 truncate">{config.url}</p>
          <p className="text-[10px] text-slate-500 mt-1">Direct REST & PostgreSQL API endpoints</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Response Latency</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              {statusResult?.latencyMs ? `${statusResult.latencyMs}ms` : 'Ready'}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200">Supabase Edge Network</p>
          <p className="text-[10px] text-slate-500 mt-1">High-speed global cloud server connection</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Auth & JWKS Endpoint</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Active
            </span>
          </div>
          <p className="text-xs font-mono text-slate-200 truncate">{config.jwksUrl}</p>
          <p className="text-[10px] text-slate-500 mt-1">Secure token verification endpoint</p>
        </div>
      </div>

      {/* SQL SCHEMA CODE SNIPPET */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Optional: Supabase SQL Tables Schema</h3>
          </div>
          <button
            onClick={copySql}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          If you are initializing a fresh Supabase project, you can run this script once in your <strong>Supabase Dashboard &gt; SQL Editor</strong> to create the tables.
        </p>
        <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
          {sqlSchemaCode}
        </pre>
      </div>

      {/* CREDENTIALS FORM */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Supabase Server Credentials</h3>
            <p className="text-[11px] text-slate-400">Configured with your Supabase Project & Server API Keys</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCustomSupabaseConfig();
              window.location.reload();
            }}
            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">SUPABASE_URL</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">SUPABASE_PUBLISHABLE_KEY</label>
            <input
              type="text"
              value={pubKeyInput}
              onChange={(e) => setPubKeyInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">SUPABASE_SECRET_KEY (Service Role / Server)</label>
            <input
              type="password"
              value={secretKeyInput}
              onChange={(e) => setSecretKeyInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://supabase.com/dashboard/project/kuzcywklssmlddopbjop"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Supabase Config</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
