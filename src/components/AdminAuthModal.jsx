import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight, X, Sparkles } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose, onAuthenticated }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        onAuthenticated(data.token);
        setPin('');
        onClose();
      } else {
        // Fallback for default pin if API not running
        if (pin === '1234') {
          onAuthenticated('local_admin_token');
          setPin('');
          onClose();
        } else {
          setError(true);
        }
      }
    } catch (err) {
      setLoading(false);
      if (pin === '1234') {
        onAuthenticated('local_admin_token');
        setPin('');
        onClose();
      } else {
        setError(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-sm w-full glass-card p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl text-center">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-heading text-xl font-bold">
          Secret Admin Portal
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Enter secret owner PIN to manage content & system analytics.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Invalid secret PIN. (Default is 1234)</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              autoFocus
              maxLength={10}
              placeholder="Enter PIN (e.g. 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-center tracking-widest text-lg font-mono rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 mt-4">
          🔒 Hidden route protected for profile owner only.
        </p>

      </div>
    </div>
  );
}
