import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Database, Cloud, Zap, Check } from 'lucide-react';
import { getActiveDbProvider, setActiveDbProvider, DB_PROVIDERS } from '../js/dbSwitcher';

export default function DbSwapButton({ className = '', onProviderSwitched }) {
  const [currentProvider, setCurrentProvider] = useState(getActiveDbProvider());
  const [isSwapping, setIsSwapping] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleDbChange = (e) => {
      if (e.detail?.provider) {
        setCurrentProvider(e.detail.provider);
      }
    };
    window.addEventListener('gravatar_db_provider_changed', handleDbChange);
    return () => window.removeEventListener('gravatar_db_provider_changed', handleDbChange);
  }, []);

  const handleSwap = () => {
    setIsSwapping(true);
    let next = DB_PROVIDERS.FIREBASE;
    if (currentProvider === DB_PROVIDERS.FIREBASE) {
      next = DB_PROVIDERS.SUPABASE;
    } else if (currentProvider === DB_PROVIDERS.SUPABASE) {
      next = DB_PROVIDERS.DUAL_SYNC;
    } else {
      next = DB_PROVIDERS.FIREBASE;
    }

    setActiveDbProvider(next);
    setCurrentProvider(next);
    setShowToast(true);

    if (onProviderSwitched) {
      onProviderSwitched(next);
    }

    setTimeout(() => {
      setIsSwapping(false);
    }, 400);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getProviderBadge = () => {
    if (currentProvider === DB_PROVIDERS.FIREBASE) {
      return {
        label: 'Firebase RTDB/Firestore',
        shortLabel: 'Firebase',
        icon: Cloud,
        color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400',
        dotColor: 'bg-amber-400'
      };
    }
    if (currentProvider === DB_PROVIDERS.SUPABASE) {
      return {
        label: 'Supabase PostgreSQL',
        shortLabel: 'Supabase',
        icon: Database,
        color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-400',
        dotColor: 'bg-emerald-400'
      };
    }
    return {
      label: 'Dual Sync (Firebase + Supabase)',
      shortLabel: 'Dual Sync',
      icon: Zap,
      color: 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/40 hover:border-indigo-400',
      dotColor: 'bg-indigo-400'
    };
  };

  const badge = getProviderBadge();
  const Icon = badge.icon;

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleSwap}
        type="button"
        title="Click to Swap Database Provider (Firebase ⇄ Supabase ⇄ Dual Sync)"
        className={`px-2.5 sm:px-3 py-1.5 rounded-xl border bg-gradient-to-r ${badge.color} text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm group ${className}`}
      >
        <span className={`w-2 h-2 rounded-full ${badge.dotColor} animate-pulse shrink-0`} />
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline font-mono tracking-tight">{badge.label}</span>
        <span className="sm:hidden font-mono">{badge.shortLabel}</span>
        <div className="p-0.5 rounded bg-slate-950/40 text-slate-300 group-hover:text-white border border-white/10 ml-0.5">
          <ArrowLeftRight className={`w-3 h-3 transition-transform ${isSwapping ? 'rotate-180 scale-110' : ''}`} />
        </div>
      </button>

      {/* Mini notification popup */}
      {showToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-semibold text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap z-50 animate-fade-in">
          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Swapped Active DB to: <strong>{badge.shortLabel}</strong></span>
        </div>
      )}
    </div>
  );
}
