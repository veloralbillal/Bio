import React, { useState, useEffect } from 'react';
import { 
  Cloud, CloudCheck, CloudOff, RefreshCw, Key, ShieldCheck, 
  AlertTriangle, CheckCircle2, Server, Database, Globe, 
  ExternalLink, Copy, Check, Save, RotateCcw, Info,
  Image as ImageIcon, Sparkles
} from 'lucide-react';
import { 
  getFirebaseConfig, 
  saveCustomFirebaseConfig, 
  clearCustomFirebaseConfig, 
  hasCustomFirebaseConfig 
} from '../js/firebaseConfigManager';
import { testCloudConnection, saveProfileToCloud, fetchProfileFromCloud } from '../js/firebaseService';
import DbSwapButton from './DbSwapButton';

export default function AdminCloudTab({ profile, onUpdateProfile }) {
  const [currentConfig, setCurrentConfig] = useState(getFirebaseConfig());
  const [hasCustom, setHasCustom] = useState(hasCustomFirebaseConfig());
  
  // Connection testing state
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  // Custom config form
  const [jsonInput, setJsonInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState(currentConfig.apiKey || '');
  const [projectIdInput, setProjectIdInput] = useState(currentConfig.projectId || '');
  const [databaseUrlInput, setDatabaseUrlInput] = useState(currentConfig.databaseURL || '');
  const [saveMessage, setSaveMessage] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    handleRunTest();
  }, []);

  const handleRunTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testCloudConnection();
      setTestResult(res);
    } catch (e) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const res = await saveProfileToCloud(profile);
      if (res.success) {
        setSaveMessage({ type: 'success', text: 'Profile successfully pushed & synced to Firebase Cloud!' });
      } else {
        setSaveMessage({ type: 'error', text: `Sync failed: ${res.error}` });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message });
    } finally {
      setSyncing(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleFetchCloud = async () => {
    setSyncing(true);
    try {
      const res = await fetchProfileFromCloud();
      if (res.success && res.data) {
        onUpdateProfile(res.data);
        setSaveMessage({ type: 'success', text: `Loaded latest profile from Cloud (${res.source})!` });
      } else {
        setSaveMessage({ type: 'error', text: res.error || 'No remote profile found' });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message });
    } finally {
      setSyncing(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleSaveCustomKeys = (e) => {
    e.preventDefault();
    let newCfg = { ...currentConfig };

    if (jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput.trim());
        newCfg = { ...newCfg, ...parsed };
      } catch (err) {
        setSaveMessage({ type: 'error', text: 'Invalid JSON format. Please check syntax.' });
        return;
      }
    } else {
      newCfg.apiKey = apiKeyInput.trim();
      newCfg.projectId = projectIdInput.trim();
      newCfg.authDomain = `${projectIdInput.trim()}.firebaseapp.com`;
      newCfg.databaseURL = databaseUrlInput.trim() || `https://${projectIdInput.trim()}-default-rtdb.firebaseio.com`;
    }

    const saved = saveCustomFirebaseConfig(newCfg);
    if (saved.success) {
      setCurrentConfig(newCfg);
      setHasCustom(true);
      setSaveMessage({ type: 'success', text: 'Custom Firebase credentials saved in browser storage! Reloading connection...' });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      setSaveMessage({ type: 'error', text: 'Failed to save configuration.' });
    }
  };

  const handleResetDefault = () => {
    clearCustomFirebaseConfig();
    setHasCustom(false);
    setSaveMessage({ type: 'success', text: 'Reset to default configuration. Reloading...' });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-12">
      
      {/* HEADER HERO */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Cloud className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Firebase Cloud Sync & Secrets Center</h2>
          </div>
          <p className="text-xs text-slate-400">
            Realtime database sync, Firestore integration, API key management, and GitHub security compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <DbSwapButton />

          <button
            onClick={handleRunTest}
            disabled={testing}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Ping'}</span>
          </button>

          <button
            onClick={handleFetchCloud}
            disabled={syncing}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold flex items-center gap-1.5 border border-indigo-500/30 transition-all disabled:opacity-50"
            title="Download the latest profile stored in Firebase Cloud into this browser"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{syncing ? 'Loading...' : 'Pull from Cloud'}</span>
          </button>

          <button
            onClick={handleForceSync}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            title="Upload this browser's profile and images to Firebase Cloud"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{syncing ? 'Syncing...' : 'Push to Cloud'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
          saveMessage.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* STATUS & DIAGNOSTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Realtime DB Status */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Realtime Database</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              testResult?.rtdb ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {testResult?.rtdb ? '● Active' : 'Standby / Fallback'}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 truncate">{currentConfig.projectId || 'veloralbillal'}</p>
          <p className="text-[10px] text-slate-500 mt-1">High-speed instant websocket profile & message mirror</p>
        </div>

        {/* Firestore Status */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cloud Firestore</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              testResult?.firestore ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {testResult?.firestore ? '● Active' : 'Auto Offline Cache'}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 truncate">Doc ID: billal_main_profile</p>
          <p className="text-[10px] text-slate-500 mt-1">Structured document storage & analytics collections</p>
        </div>

        {/* Latency & Mode */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Connection Health</span>
            <span className="text-[11px] font-mono text-indigo-400 font-bold">
              {testResult?.latencyMs ? `${testResult.latencyMs}ms` : 'Ready'}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {testResult?.success ? 'Cloud Synchronized' : 'Hybrid Local & Cloud Mode'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Changes are always saved locally and pushed when online</p>
        </div>
      </div>

      {/* IMAGE BANNER & AVATAR SYNC STATUS CARD */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Visual Assets & Banner Cloud Sync Status</h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Auto-Compressed for Firestore
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Cover Banner status */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            {profile?.coverUrl ? (
              <img src={profile.coverUrl} alt="Banner" className="w-16 h-10 rounded-lg object-cover border border-slate-800 shrink-0" />
            ) : (
              <div className="w-16 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 border border-slate-800 shrink-0">
                Gradient
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Cover Banner</p>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{profile?.coverUrl ? 'Image Ready & Syncable' : 'Gradient Fallback Active'}</span>
              </p>
            </div>
          </div>

          {/* Avatar status */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-indigo-500 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                BH
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Profile Avatar</p>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Optimized for Cloud (≤50KB)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GITHUB SECRET DETECTION EXPLANATION & GUIDELINES */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-200">GitHub Secrets Scanning Security Notice</h4>
            <p className="text-slate-400 leading-relaxed">
              GitHub-এর স্বয়ংক্রিয় সিক্রেট স্ক্যানার কোডে সরাসরি <code className="text-amber-300 font-mono">AIzaSy...</code> ফরম্যাটের কি দেখলে অ্যালার্ট ইমেইল পাঠায়। আমরা কোডবেস থেকে হার্ডকোডেড প্লেইনটেক্সট কি সরিয়ে নিয়েছি যাতে গিটহাবে কোনো ওয়ার্নিং না আসে।
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://console.firebase.google.com/project/veloralbillal/settings/general"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                <span>Open Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM FIREBASE API CONFIGURATION FORM */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Update / Rotate Firebase Credentials</h3>
            <p className="text-[11px] text-slate-400">
              Paste your Firebase web config JSON or API Key directly here. Stored safely in your browser.
            </p>
          </div>
          {hasCustom && (
            <button
              onClick={handleResetDefault}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Default</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCustomKeys} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Firebase API Key</label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Firebase Project ID</label>
              <input
                type="text"
                value={projectIdInput}
                onChange={(e) => setProjectIdInput(e.target.value)}
                placeholder="veloralbillal"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Realtime Database URL (Optional)</label>
            <input
              type="text"
              value={databaseUrlInput}
              onChange={(e) => setDatabaseUrlInput(e.target.value)}
              placeholder="https://veloralbillal-default-rtdb.firebaseio.com"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Or Paste Full Firebase Config JSON</label>
            <textarea
              rows={3}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "apiKey": "...", "authDomain": "...", "projectId": "..." }'
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleFetchCloud}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>Fetch & Overwrite from Cloud</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
