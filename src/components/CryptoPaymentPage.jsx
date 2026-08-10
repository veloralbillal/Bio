import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Copy, Check, QrCode, Coins, ShieldCheck, 
  ExternalLink, Sparkles, CheckCircle2, RefreshCw, AlertCircle, UserCheck
} from 'lucide-react';

export default function CryptoPaymentPage({ profile, onBack }) {
  const wallets = profile?.cryptoWallets || [];
  const activeWallets = wallets.filter(w => w.enabled !== false);

  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Set default active selected wallet
  const activeSelected = activeWallets.find(w => w.id === selectedWalletId) || activeWallets[0] || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (address, id) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans animate-fade-in">
      
      {/* Standalone Page Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-slate-700 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Profile</span>
        </button>

        {/* Profile Avatar & Name in Top Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={profile?.avatarUrl} 
              alt={profile?.name} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-amber-500 shadow-md"
            />
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 absolute -bottom-0.5 -right-0.5 bg-slate-950 rounded-full" />
          </div>
          <div className="hidden sm:block text-left">
            <h2 className="text-xs font-black text-white">{profile?.name || 'Billal Hossen'}</h2>
            <p className="text-[10px] text-amber-400 font-mono font-bold">Verified Crypto Portal</p>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8 my-4">
        
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Direct Peer-to-Peer Wallet Network</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading leading-tight">
              Crypto Payment & Tip Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Send direct cryptocurrency payments, tips, or project support to <strong className="text-white">{profile?.name}</strong> across multiple mainnet networks including Bitcoin (BTC), Litecoin (LTC), Ethereum (ETH), Tether (USDT), and Solana (SOL).
            </p>
          </div>
        </div>

        {/* Crypto Wallets Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Wallet Selector Column */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
              <span>Select Payment Currency ({activeWallets.length})</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">Instant Peer-to-Peer</span>
            </h3>

            <div className="space-y-2.5">
              {activeWallets.map((w) => {
                const isSelected = activeSelected && activeSelected.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWalletId(w.id)}
                    className={`w-full p-4 rounded-2xl text-left flex items-center justify-between transition-all duration-200 border ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30 scale-[1.01]'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${w.iconColor || 'from-amber-500 to-orange-600'} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lg shadow-slate-950`}>
                        {w.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{w.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 text-[10px] font-mono font-bold">
                            {w.symbol}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[180px] sm:max-w-[220px]">
                          {w.network}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold block ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isSelected ? 'Active' : 'Select'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Address & QR Code Details Column */}
          <div className="lg:col-span-7">
            {activeSelected ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
                
                {/* Selected Wallet Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeSelected.iconColor || 'from-amber-500 to-orange-600'} text-white font-black text-base flex items-center justify-center shrink-0 shadow-lg`}>
                      {activeSelected.symbol}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{activeSelected.name} Deposit Wallet</h3>
                      <p className="text-xs text-slate-400 font-mono">Network: <span className="text-amber-400 font-bold">{activeSelected.network}</span></p>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Address</span>
                  </span>
                </div>

                {/* Deposit Address Box + Copy Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <label className="uppercase tracking-wider">
                      {activeSelected.name} ({activeSelected.symbol}) Address
                    </label>
                    <span className="text-slate-500 font-mono text-[11px]">Click to copy address</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <input 
                      type="text" 
                      readOnly 
                      value={activeSelected.address} 
                      className="w-full bg-transparent text-xs sm:text-sm font-mono text-amber-300 outline-none select-all px-2 py-1"
                    />
                    <button
                      onClick={() => handleCopy(activeSelected.address, activeSelected.id)}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                      {copiedId === activeSelected.id ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code & Instruction Block */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* QR Image Box */}
                  <div className="p-3 bg-white rounded-2xl shrink-0 shadow-xl border border-slate-200">
                    <img 
                      src={activeSelected.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeSelected.address)}`} 
                      alt={`${activeSelected.name} QR`} 
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  {/* Instructions */}
                  <div className="space-y-3 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan QR with Mobile Wallet</span>
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeSelected.note || `Send only ${activeSelected.symbol} on ${activeSelected.network} to this address. Transactions settle directly into ${profile?.name}'s non-custodial wallet.`}
                    </p>

                    <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-[11px] text-amber-400/90 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>Verify network ({activeSelected.network}) before sending.</span>
                    </div>
                  </div>

                </div>

                {/* Non-custodial Security Card */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <p>
                    Direct wallet integration — transactions are decentralized, non-custodial, and processed directly on the blockchain with zero intermediary fees.
                  </p>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-3xl border border-slate-800">
                <Coins className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                <p className="text-sm font-semibold">No active crypto wallets selected.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Standalone Page Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 px-4 bg-slate-900 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-3">
          <button onClick={onBack} className="text-amber-400 hover:underline font-bold">
            ← Return to Profile
          </button>
          <span>•</span>
          <span className="text-slate-300">{profile?.name || 'Billal Hossen'} Official Hub</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Verified Gravatar Digital Identity & Crypto Payment Gateway
        </p>
      </footer>

    </div>
  );
}
