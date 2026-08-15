import React, { useState } from 'react';
import { 
  FileCode, Sparkles, Globe, Share2, Twitter, Image as ImageIcon, 
  Search, ShieldAlert, Check, CheckCircle2, RefreshCw, Eye, ExternalLink
} from 'lucide-react';
import { applyDynamicMetadata } from '../js/metadataManager';

export default function AdminMetadataTab({ profile, onUpdateProfile, onSave }) {
  const currentSeo = profile?.seo || {};
  const [formData, setFormData] = useState({
    title: currentSeo.title || `${profile?.name || 'Billal Hossen'} | Gravatar Profile & Social Hub`,
    description: currentSeo.description || profile?.bio || '',
    keywords: currentSeo.keywords || 'Billal Hossen, Gravatar, Web Developer, Portfolio, Social Hub',
    ogImage: currentSeo.ogImage || profile?.avatarUrl || '',
    author: currentSeo.author || profile?.name || 'Billal Hossen',
    twitterCard: currentSeo.twitterCard || 'summary_large_image',
    twitterHandle: currentSeo.twitterHandle || profile?.username || '@billal_self',
    robots: currentSeo.robots || 'index, follow, max-image-preview:large',
    canonicalUrl: currentSeo.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activePreview, setActivePreview] = useState('google'); // 'google', 'facebook', 'twitter'

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    const updatedProfile = {
      ...profile,
      seo: {
        ...profile.seo,
        ...updated
      }
    };
    onUpdateProfile(updatedProfile);
    applyDynamicMetadata(updatedProfile);
  };

  const handleApplyDefaults = () => {
    const defaults = {
      title: `${profile?.name || 'Billal Hossen'} | Gravatar Digital Identity & Portfolio`,
      description: profile?.bio || `Official Gravatar digital business card, verified social accounts, portfolio showcase, and direct contact portal for ${profile?.name || 'Billal Hossen'}.`,
      keywords: `${profile?.name || 'Billal Hossen'}, Gravatar, Developer Portfolio, Ethical Hacker, Social Links, Digital Card`,
      ogImage: profile?.avatarUrl || '',
      author: profile?.name || 'Billal Hossen',
      twitterCard: 'summary_large_image',
      twitterHandle: profile?.username ? `@${profile.username}` : '@billal_self',
      robots: 'index, follow, max-image-preview:large',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin : ''
    };
    setFormData(defaults);
    const updatedProfile = {
      ...profile,
      seo: defaults
    };
    onUpdateProfile(updatedProfile);
    applyDynamicMetadata(updatedProfile);
  };

  const handleSaveMetadata = () => {
    const updatedProfile = {
      ...profile,
      seo: {
        ...profile.seo,
        ...formData
      }
    };
    applyDynamicMetadata(updatedProfile);
    onSave?.(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const titleLength = formData.title.length;
  const descLength = formData.description.length;

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <span>Dynamic Metadata & Social OpenGraph Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize search engine titles, OpenGraph previews for Facebook/LinkedIn, and Twitter Card tags.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleApplyDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            title="Auto-fill with profile attributes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto Fill</span>
          </button>

          <button
            onClick={handleSaveMetadata}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Metadata Applied!' : 'Save & Apply Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs & Live Social Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Site Title */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Primary Document Title (&lt;title&gt;)</span>
              </label>
              <span className={`text-[10px] font-mono ${titleLength > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {titleLength}/60 chars recommended
              </span>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Billal Hossen | Gravatar Digital Identity & Portfolio"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          {/* Meta Description */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>Search Snippet Description</span>
              </label>
              <span className={`text-[10px] font-mono ${descLength > 160 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {descLength}/160 chars recommended
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description shown in search results and social cards..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Keywords & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Target Search Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                placeholder="developer, react, ethical hacking..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Author Name</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Billal Hossen"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Social OpenGraph Image URL */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Social OpenGraph Image URL (1200x630 px)</span>
            </label>
            <input
              type="url"
              value={formData.ogImage}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              placeholder="https://.../og-banner.jpg"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          {/* Twitter / X Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>Twitter Creator Handle</span>
              </label>
              <input
                type="text"
                value={formData.twitterHandle}
                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                placeholder="@billal_self"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Twitter Card Type</label>
              <select
                value={formData.twitterCard}
                onChange={(e) => handleChange('twitterCard', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="summary_large_image">summary_large_image (Big Banner)</option>
                <option value="summary">summary (Square Thumbnail)</option>
              </select>
            </div>
          </div>

          {/* Robots & Canonical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Robots Crawler Directive</label>
              <select
                value={formData.robots}
                onChange={(e) => handleChange('robots', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-mono"
              >
                <option value="index, follow, max-image-preview:large">index, follow, max-image-preview:large</option>
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Canonical URL</label>
              <input
                type="text"
                value={formData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://gravatar-hub.app"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Live Social Sharing Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Share Card Previews</span>
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActivePreview('google')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    activePreview === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setActivePreview('facebook')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    activePreview === 'facebook' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Social / FB
                </button>
                <button
                  onClick={() => setActivePreview('twitter')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    activePreview === 'twitter' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Twitter / X
                </button>
              </div>
            </div>

            {/* Google SERP Preview */}
            {activePreview === 'google' && (
              <div className="p-4 rounded-xl bg-white text-slate-800 space-y-1 shadow-inner font-sans">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate">
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold">G</span>
                  <span>{formData.canonicalUrl || 'https://gravatar-hub.app'}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                  {formData.title}
                </h4>
                <p className="text-xs text-[#4d5156] line-clamp-3 leading-relaxed">
                  {formData.description || 'No description set for search results.'}
                </p>
              </div>
            )}

            {/* Facebook / OpenGraph Card Preview */}
            {activePreview === 'facebook' && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
                {formData.ogImage ? (
                  <div className="w-full h-36 bg-slate-900 overflow-hidden relative">
                    <img 
                      src={formData.ogImage} 
                      alt="OG Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    No image configured
                  </div>
                )}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide font-mono block">
                    {formData.canonicalUrl ? new URL(formData.canonicalUrl).hostname : 'gravatar-hub.app'}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{formData.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{formData.description}</p>
                </div>
              </div>
            )}

            {/* Twitter / X Card Preview */}
            {activePreview === 'twitter' && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
                {formData.ogImage ? (
                  <div className="w-full h-36 bg-slate-900 overflow-hidden">
                    <img 
                      src={formData.ogImage} 
                      alt="Twitter Card" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-20 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    No banner set
                  </div>
                )}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {formData.canonicalUrl ? new URL(formData.canonicalUrl).hostname : 'gravatar-hub.app'}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{formData.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{formData.description}</p>
                  <span className="text-[10px] text-sky-400 font-mono block pt-1">
                    Card by {formData.twitterHandle}
                  </span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">✨ Auto-Injected Tags</span>
              <p>Meta tags are dynamically applied to the DOM in real-time and served to web crawlers upon HTML rendering.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
