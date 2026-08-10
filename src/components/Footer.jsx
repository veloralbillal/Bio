import React from 'react';
import { ShieldCheck, Heart, Sparkles, Lock, Globe } from 'lucide-react';

export default function Footer({ profile, onOpenAdminAuth }) {
  const brandName = profile?.footerBrandName || profile?.headerBrandName || "Gravatar Profile Hub";

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-6 bg-slate-100/50 dark:bg-slate-950/50 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
            G
          </div>
          <span className="font-heading font-bold text-slate-800 dark:text-slate-200">
            {brandName}
          </span>
          <span>© {new Date().getFullYear()} • {profile?.name || 'Billal Hossen'}</span>
        </div>

        {/* System Status & Hidden Lock Trigger */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified Online
          </span>

          {/* Secret Owner Admin Trigger (Double click or tap lock) */}
          <button
            onClick={onOpenAdminAuth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Owner Portal (Ctrl + Shift + A)"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
