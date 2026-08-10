import React, { useState } from 'react';
import { 
  ShieldCheck, Award, Wallet, Copy, Check, QrCode, 
  ExternalLink, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function VerifiedBadges({ verifiedCredentials, cryptoWallets }) {
  const [copiedWallet, setCopiedWallet] = useState(null);

  const handleCopyWallet = (address, symbol) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(symbol);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Verified Domain & Badges Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Verified Badges & DNS Proofs
            </h3>
          </div>

          <div className="space-y-3">
            {verifiedCredentials.map((cred) => (
              <div 
                key={cred.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {cred.title}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cred.identifier} • {cred.issuer}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                  {cred.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Web3 Crypto Wallets Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Verified Crypto Wallets
            </h3>
          </div>

          <div className="space-y-3">
            {cryptoWallets.map((wallet) => (
              <div 
                key={wallet.symbol}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-indigo-600 text-white">
                      {wallet.symbol}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {wallet.name}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-1">
                    {wallet.address}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyWallet(wallet.address, wallet.symbol)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0"
                  title="Copy Wallet Address"
                >
                  {copiedWallet === wallet.symbol ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
