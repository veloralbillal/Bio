import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Heart, Coffee, DollarSign, Sparkles, Check, 
  Copy, ExternalLink, ShieldCheck, QrCode, Coins, Target, 
  Send, CheckCircle2, ChevronRight, Gift, Flame
} from 'lucide-react';
import { trackEvent } from '../js/storage';

export default function DonatePage({ profile, onBack, onOpenCrypto }) {
  const donation = profile?.donationConfig || {};
  const goal = donation?.goal || {};
  const platforms = donation?.platforms || {};
  const localPayment = donation?.localPayment || {};
  const presetTiers = donation?.presetTiers || [];
  const cryptoWallets = (profile?.cryptoWallets || []).filter(w => w.enabled !== false);

  const [selectedTier, setSelectedTier] = useState(presetTiers[0]?.amount || 3);
  const [customAmount, setCustomAmount] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoWallets[0] || null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', 'donate_page');
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentGoalPercent = goal?.targetAmount 
    ? Math.min(Math.round(((goal.currentAmount || 0) / goal.targetAmount) * 100), 100)
    : 0;

  // Active platform links
  const activePlatforms = [
    {
      id: 'buymeacoffee',
      name: 'Buy Me a Coffee',
      url: platforms.buymeacoffee?.url || `https://buymeacoffee.com/${profile?.username}`,
      enabled: platforms.buymeacoffee?.enabled !== false,
      icon: Coffee,
      color: 'bg-[#FFDD00] text-slate-950 hover:bg-[#ffe333]',
      badge: 'Popular',
      note: platforms.buymeacoffee?.note || 'Support with a $3 coffee or custom tip'
    },
    {
      id: 'paypal',
      name: 'PayPal.me',
      url: platforms.paypal?.url || `https://paypal.me/${profile?.username}`,
      enabled: platforms.paypal?.enabled !== false,
      icon: DollarSign,
      color: 'bg-[#0070BA] text-white hover:bg-[#005ea6]',
      badge: 'Direct',
      note: platforms.paypal?.note || 'Instant global cards or balance transfer'
    },
    {
      id: 'kofi',
      name: 'Ko-fi',
      url: platforms.kofi?.url || `https://ko-fi.com/${profile?.username}`,
      enabled: platforms.kofi?.enabled !== false,
      icon: Heart,
      color: 'bg-[#13C3FF] text-slate-950 hover:bg-[#00b2f0]',
      badge: '0% Fees',
      note: platforms.kofi?.note || 'Zero fee donations & creator support'
    },
    {
      id: 'githubSponsors',
      name: 'GitHub Sponsors',
      url: platforms.githubSponsors?.url || `https://github.com/sponsors/${profile?.username}`,
      enabled: platforms.githubSponsors?.enabled !== false,
      icon: Heart,
      color: 'bg-[#EA4AAA] text-white hover:bg-[#d93899]',
      badge: 'Open Source',
      note: platforms.githubSponsors?.note || 'Sponsor code repositories and development'
    },
    {
      id: 'patreon',
      name: 'Patreon',
      url: platforms.patreon?.url || '',
      enabled: platforms.patreon?.enabled === true,
      icon: Sparkles,
      color: 'bg-[#FF424D] text-white hover:bg-[#e0343f]',
      badge: 'Monthly',
      note: platforms.patreon?.note || 'Join monthly supporter membership'
    },
    {
      id: 'customLink',
      name: platforms.customLink?.label || 'Custom Portal',
      url: platforms.customLink?.url || '',
      enabled: platforms.customLink?.enabled === true && !!platforms.customLink?.url,
      icon: ExternalLink,
      color: 'bg-emerald-600 text-white hover:bg-emerald-500',
      badge: 'Direct',
      note: platforms.customLink?.note || 'Direct payment gateway'
    }
  ].filter(p => p.enabled && p.url);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans animate-fade-in">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-slate-700 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" />
          <span>Back to Profile</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={profile?.avatarUrl} 
              alt={profile?.name} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-rose-500 shadow-md"
            />
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 absolute -bottom-0.5 -right-0.5 bg-slate-950 rounded-full" />
          </div>
          <div className="hidden sm:block text-left">
            <h2 className="text-xs font-black text-white">{profile?.name || 'Billal Hossen'}</h2>
            <p className="text-[10px] text-rose-400 font-mono font-bold">Verified Support Gateway</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8 my-4">
        
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border border-rose-500/30 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
              <span>Creator Support & Community Sponsor</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading leading-tight">
              {donation?.title || 'Support & Sponsor My Work'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {donation?.subtitle || 'Help keep open-source tech guides, web templates, and educational resources accessible to developers worldwide.'}
            </p>
          </div>
        </div>

        {/* Fundraising Goal Bar (If Enabled) */}
        {goal?.enabled && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{goal?.title || 'Community Support Goal'}</h3>
                  <p className="text-xs text-slate-400">Monthly goal for server hosting & learning resources</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-lg font-black text-white">
                  {goal?.currency || '$'}{goal?.currentAmount || 0}
                </span>
                <span className="text-xs text-slate-400 font-mono"> / {goal?.currency || '$'}{goal?.targetAmount || 500}</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                  {currentGoalPercent}% funded
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-full transition-all duration-1000 shadow-md"
                style={{ width: `${currentGoalPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Preset Contribution Tiers */}
        {presetTiers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
              <span>Choose Contribution Tier</span>
              <span className="text-[10px] text-rose-400 font-mono font-bold">Direct Appreciation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {presetTiers.map((tier) => {
                const isSelected = selectedTier === tier.amount;
                return (
                  <div
                    key={tier.id || tier.amount}
                    onClick={() => {
                      setSelectedTier(tier.amount);
                      setCustomAmount('');
                    }}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/30 scale-[1.02]'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-white">
                          {tier.currency || '$'}{tier.amount}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isSelected ? 'Selected' : 'Tier'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-rose-300">{tier.label}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Instant Support</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Global Support Gateways */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Primary Global Support Portals</span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">1-Click Checkout</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('link_click', `donate_${platform.id}`)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${platform.color} shadow-md flex items-center justify-center font-bold`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-white text-base group-hover:text-rose-400 transition-colors">
                          {platform.name}
                        </h4>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                        {platform.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {platform.note}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Proceed via {platform.name}</span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Local Mobile Banking (bKash / Nagad) */}
        {localPayment?.enabled && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>{localPayment.title || 'Mobile Banking (Bangladesh)'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Direct Send Money
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{localPayment.note || 'Send money with your name as reference'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* bKash Box */}
              {localPayment.bkash?.enabled !== false && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-pink-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-[#E2136E] text-white text-xs font-black shadow-md">
                      bKash
                    </span>
                    <span className="text-[11px] text-pink-400 font-mono font-bold">
                      {localPayment.bkash?.type || 'Personal'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-mono">Account Number</p>
                    <p className="text-base font-black text-white font-mono">{localPayment.bkash?.number || '01700-000000'}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(localPayment.bkash?.number || '01700-000000', 'bkash')}
                    className="w-full py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-pink-500/40 transition-all active:scale-95"
                  >
                    {copiedId === 'bkash' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-pink-400" />
                        <span>Copied bKash Number!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy bKash Number</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Nagad Box */}
              {localPayment.nagad?.enabled !== false && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-orange-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F7941D] text-slate-950 text-xs font-black shadow-md">
                      Nagad
                    </span>
                    <span className="text-[11px] text-orange-400 font-mono font-bold">
                      {localPayment.nagad?.type || 'Personal'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-mono">Account Number</p>
                    <p className="text-base font-black text-white font-mono">{localPayment.nagad?.number || '01700-000000'}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(localPayment.nagad?.number || '01700-000000', 'nagad')}
                    className="w-full py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-orange-500/40 transition-all active:scale-95"
                  >
                    {copiedId === 'nagad' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-orange-400" />
                        <span>Copied Nagad Number!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Nagad Number</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Rocket Box */}
              {localPayment.rocket?.enabled && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-[#8C3494] text-white text-xs font-black shadow-md">
                      Rocket
                    </span>
                    <span className="text-[11px] text-purple-400 font-mono font-bold">
                      {localPayment.rocket?.type || 'Personal'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-mono">Account Number</p>
                    <p className="text-base font-black text-white font-mono">{localPayment.rocket?.number || '01700-000000-0'}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(localPayment.rocket?.number || '01700-000000-0', 'rocket')}
                    className="w-full py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-500/40 transition-all active:scale-95"
                  >
                    {copiedId === 'rocket' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span>Copied Rocket Number!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Rocket Number</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Crypto Quick Tip Gateway Preview */}
        {cryptoWallets.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Cryptocurrency Direct Donations</h3>
                  <p className="text-xs text-slate-400">Zero fee direct decentralized blockchain transfers</p>
                </div>
              </div>

              <button
                onClick={onOpenCrypto}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>Open Full Crypto Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Crypto Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cryptoWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  onClick={() => setSelectedCrypto(wallet)}
                  className={`p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                    selectedCrypto?.id === wallet.id
                      ? 'bg-slate-950 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-mono font-black text-amber-400 text-sm block">{wallet.symbol}</span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">{wallet.name}</span>
                </div>
              ))}
            </div>

            {/* Selected Quick Crypto Details */}
            {selectedCrypto && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left truncate max-w-full">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {selectedCrypto.name} ({selectedCrypto.symbol}) • {selectedCrypto.network}
                  </span>
                  <p className="text-xs font-mono text-slate-300 truncate select-all">{selectedCrypto.address}</p>
                </div>

                <button
                  onClick={() => handleCopy(selectedCrypto.address, `crypto_${selectedCrypto.id}`)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 border border-slate-700 active:scale-95 transition-all"
                >
                  {copiedId === `crypto_${selectedCrypto.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Address!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Note */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 text-center space-y-3 max-w-3xl mx-auto">
          <Heart className="w-8 h-8 text-rose-500 mx-auto fill-rose-500" />
          <h4 className="font-bold text-white text-sm">Thank You for Your Generosity & Support!</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {donation?.message || 'Your support helps cover server hosting costs, domain renewals, educational tutorial production, and open-source software maintenance.'}
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 px-4 bg-slate-900 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-3">
          <button onClick={onBack} className="text-rose-400 hover:underline font-bold">
            ← Return to Profile
          </button>
          <span>•</span>
          <span className="text-slate-300">{profile?.name || 'Billal Hossen'} Official Hub</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Verified Gravatar Digital Identity & Supporter Gateway
        </p>
      </footer>

    </div>
  );
}
