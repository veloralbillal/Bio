import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Sparkles } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, profile }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative max-w-sm w-full glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
          Digital Business Card
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Scan to open {profile.name}'s verified Gravatar profile on mobile.
        </p>

        {/* QR Image Box */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner w-56 h-56 mx-auto flex items-center justify-center mb-4">
          <img src={qrApiUrl} alt="QR Code" className="w-full h-full object-contain" />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Profile Link'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
