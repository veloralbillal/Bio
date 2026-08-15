import React, { useState } from 'react';
import { 
  Heart, DollarSign, Coffee, Target, Sparkles, Check, 
  ExternalLink, Plus, Trash2, Eye, HelpCircle, ShieldCheck
} from 'lucide-react';

export default function AdminDonationTab({ profile, onUpdateProfile, onSave }) {
  const donation = profile?.donationConfig || {
    enabled: true,
    title: "Support & Sponsor My Work",
    subtitle: "Help keep open-source education, tech tutorials, and developer tools accessible to everyone worldwide.",
    message: "Thank you for considering supporting my work!",
    goal: {
      enabled: true,
      title: "Monthly Community Education & Hosting Goal",
      currentAmount: 185,
      targetAmount: 500,
      currency: "$"
    },
    platforms: {},
    localPayment: {},
    presetTiers: []
  };

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Helper to update donation sub-field
  const updateDonation = (updater) => {
    const nextDonation = typeof updater === 'function' ? updater(donation) : { ...donation, ...updater };
    const nextProfile = {
      ...profile,
      donationConfig: nextDonation
    };
    onUpdateProfile(nextProfile);
  };

  // Helper to update specific platform
  const updatePlatform = (key, field, value) => {
    updateDonation((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [key]: {
          ...(prev.platforms?.[key] || {}),
          [field]: value
        }
      }
    }));
  };

  // Helper to update local mobile payment
  const updateLocal = (key, field, value) => {
    updateDonation((prev) => ({
      ...prev,
      localPayment: {
        ...prev.localPayment,
        [key]: {
          ...(prev.localPayment?.[key] || {}),
          [field]: value
        }
      }
    }));
  };

  // Preset Tiers helper
  const updateTier = (index, field, value) => {
    updateDonation((prev) => {
      const tiers = [...(prev.presetTiers || [])];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...prev, presetTiers: tiers };
    });
  };

  const addTier = () => {
    updateDonation((prev) => ({
      ...prev,
      presetTiers: [
        ...(prev.presetTiers || []),
        {
          id: 'tier_' + Date.now(),
          amount: 15,
          currency: '$',
          label: 'Special Sponsor 🌟',
          desc: 'Special contribution toward community tools.'
        }
      ]
    }));
  };

  const removeTier = (index) => {
    updateDonation((prev) => {
      const tiers = (prev.presetTiers || []).filter((_, i) => i !== index);
      return { ...prev, presetTiers: tiers };
    });
  };

  const handleQuickSave = () => {
    onSave?.();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* Top Banner & Quick Save */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <h2 className="text-lg font-black text-white">Donation & Support Portal Manager</h2>
          </div>
          <p className="text-xs text-slate-400">
            Control global payment links, Buy Me a Coffee, PayPal, bKash / Nagad, and fundraising goals.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleQuickSave}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved & Cloud Synced!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save Donation Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Enable / Header Settings */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white">General Page Info</h3>
            <p className="text-xs text-slate-400">Title, subtitle, and supporter thank you message</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={donation.enabled !== false} 
              onChange={(e) => updateDonation({ enabled: e.target.checked })}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            <span className="ml-2 text-xs font-bold text-slate-300">
              {donation.enabled !== false ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Page Headline</label>
            <input 
              type="text" 
              value={donation.title || ''} 
              onChange={(e) => updateDonation({ title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-rose-500 outline-none"
              placeholder="Support & Sponsor My Work"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Subtitle / Tagline</label>
            <input 
              type="text" 
              value={donation.subtitle || ''} 
              onChange={(e) => updateDonation({ subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-rose-500 outline-none"
              placeholder="Help keep open-source education and tools free"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Supporter Message Note</label>
          <textarea 
            rows={2}
            value={donation.message || ''} 
            onChange={(e) => updateDonation({ message: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-rose-500 outline-none"
            placeholder="Thank you for considering supporting my work..."
          />
        </div>
      </div>

      {/* Monthly Fundraising Goal Control */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Fundraising Target Goal</h3>
              <p className="text-xs text-slate-400">Live progress bar for community-funded server or tools</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={donation.goal?.enabled !== false} 
              onChange={(e) => updateDonation((prev) => ({
                ...prev,
                goal: { ...(prev.goal || {}), enabled: e.target.checked }
              }))}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-300">Goal Title</label>
            <input 
              type="text" 
              value={donation.goal?.title || ''} 
              onChange={(e) => updateDonation((prev) => ({
                ...prev,
                goal: { ...(prev.goal || {}), title: e.target.value }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-rose-500 outline-none"
              placeholder="Monthly Server & Education Fund"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Current Raised</label>
            <input 
              type="number" 
              value={donation.goal?.currentAmount || 0} 
              onChange={(e) => updateDonation((prev) => ({
                ...prev,
                goal: { ...(prev.goal || {}), currentAmount: Number(e.target.value) }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold focus:border-rose-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Target Goal ($)</label>
            <input 
              type="number" 
              value={donation.goal?.targetAmount || 500} 
              onChange={(e) => updateDonation((prev) => ({
                ...prev,
                goal: { ...(prev.goal || {}), targetAmount: Number(e.target.value) }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold focus:border-rose-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Global Platforms (Buy Me A Coffee, PayPal, Ko-fi, GitHub Sponsors, Patreon) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-white">Global Donation Portals</h3>
          <p className="text-xs text-slate-400">Configure your direct donation handles and custom URLs</p>
        </div>

        <div className="space-y-4">
          {/* Buy Me A Coffee */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFDD00] text-slate-950 font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Buy Me a Coffee</h4>
                <p className="text-[11px] text-slate-400 font-mono">buymeacoffee.com/your-username</p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <input 
                type="text" 
                value={donation.platforms?.buymeacoffee?.url || ''} 
                onChange={(e) => updatePlatform('buymeacoffee', 'url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-rose-500 outline-none"
                placeholder="https://buymeacoffee.com/username"
              />
              <input 
                type="checkbox"
                checked={donation.platforms?.buymeacoffee?.enabled !== false}
                onChange={(e) => updatePlatform('buymeacoffee', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded accent-rose-600 shrink-0"
              />
            </div>
          </div>

          {/* PayPal */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0070BA] text-white font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">PayPal.me Link</h4>
                <p className="text-[11px] text-slate-400 font-mono">paypal.me/your-username</p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <input 
                type="text" 
                value={donation.platforms?.paypal?.url || ''} 
                onChange={(e) => updatePlatform('paypal', 'url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-rose-500 outline-none"
                placeholder="https://paypal.me/username"
              />
              <input 
                type="checkbox"
                checked={donation.platforms?.paypal?.enabled !== false}
                onChange={(e) => updatePlatform('paypal', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded accent-rose-600 shrink-0"
              />
            </div>
          </div>

          {/* Ko-fi */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#13C3FF] text-slate-950 font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ko-fi Link</h4>
                <p className="text-[11px] text-slate-400 font-mono">ko-fi.com/your-username</p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <input 
                type="text" 
                value={donation.platforms?.kofi?.url || ''} 
                onChange={(e) => updatePlatform('kofi', 'url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-rose-500 outline-none"
                placeholder="https://ko-fi.com/username"
              />
              <input 
                type="checkbox"
                checked={donation.platforms?.kofi?.enabled !== false}
                onChange={(e) => updatePlatform('kofi', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded accent-rose-600 shrink-0"
              />
            </div>
          </div>

          {/* GitHub Sponsors */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#EA4AAA] text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">GitHub Sponsors</h4>
                <p className="text-[11px] text-slate-400 font-mono">github.com/sponsors/username</p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <input 
                type="text" 
                value={donation.platforms?.githubSponsors?.url || ''} 
                onChange={(e) => updatePlatform('githubSponsors', 'url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-rose-500 outline-none"
                placeholder="https://github.com/sponsors/username"
              />
              <input 
                type="checkbox"
                checked={donation.platforms?.githubSponsors?.enabled !== false}
                onChange={(e) => updatePlatform('githubSponsors', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded accent-rose-600 shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Local Mobile Payments (bKash, Nagad, Rocket) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Local Mobile Banking (Bangladesh)</h3>
            <p className="text-xs text-slate-400">bKash, Nagad, and Rocket numbers for direct mobile support</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={donation.localPayment?.enabled !== false} 
              onChange={(e) => updateDonation((prev) => ({
                ...prev,
                localPayment: { ...(prev.localPayment || {}), enabled: e.target.checked }
              }))}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* bKash */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#E2136E] text-white text-xs font-black">
                bKash Number
              </span>
              <input 
                type="checkbox" 
                checked={donation.localPayment?.bkash?.enabled !== false} 
                onChange={(e) => updateLocal('bkash', 'enabled', e.target.checked)}
                className="w-4 h-4 rounded accent-rose-600"
              />
            </div>
            <input 
              type="text" 
              value={donation.localPayment?.bkash?.number || ''} 
              onChange={(e) => updateLocal('bkash', 'number', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-rose-500 outline-none"
              placeholder="01700-000000"
            />
          </div>

          {/* Nagad */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#F7941D] text-slate-950 text-xs font-black">
                Nagad Number
              </span>
              <input 
                type="checkbox" 
                checked={donation.localPayment?.nagad?.enabled !== false} 
                onChange={(e) => updateLocal('nagad', 'enabled', e.target.checked)}
                className="w-4 h-4 rounded accent-rose-600"
              />
            </div>
            <input 
              type="text" 
              value={donation.localPayment?.nagad?.number || ''} 
              onChange={(e) => updateLocal('nagad', 'number', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-rose-500 outline-none"
              placeholder="01700-000000"
            />
          </div>
        </div>
      </div>

      {/* Contribution Tiers Manager */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Preset Contribution Tiers</h3>
            <p className="text-xs text-slate-400">Cards shown on the donate page for quick amounts</p>
          </div>

          <button
            onClick={addTier}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Add Tier</span>
          </button>
        </div>

        <div className="space-y-3">
          {(donation.presetTiers || []).map((tier, index) => (
            <div key={tier.id || index} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 w-28 shrink-0">
                <span className="text-xs font-bold text-slate-400">$</span>
                <input 
                  type="number"
                  value={tier.amount}
                  onChange={(e) => updateTier(index, 'amount', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold outline-none"
                />
              </div>

              <input 
                type="text"
                value={tier.label}
                onChange={(e) => updateTier(index, 'label', e.target.value)}
                placeholder="Tier Label"
                className="w-full sm:w-48 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
              />

              <input 
                type="text"
                value={tier.desc}
                onChange={(e) => updateTier(index, 'desc', e.target.value)}
                placeholder="Tier Description"
                className="w-full flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs outline-none"
              />

              <button
                onClick={() => removeTier(index)}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 shrink-0"
                title="Remove Tier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
