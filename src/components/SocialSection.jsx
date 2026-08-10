import React, { useState } from 'react';
import { 
  Github, Linkedin, Twitter, Youtube, Instagram, Facebook, 
  Send, PhoneCall, Music, Code, BookOpen, Dribbble, Globe, 
  MessageSquare, ExternalLink, ShieldCheck, Check, Copy, 
  Grid, List, Sparkles, Filter
} from 'lucide-react';
import { trackEvent } from '../js/storage';

const ICON_MAP = {
  Github: Github,
  Linkedin: Linkedin,
  Twitter: Twitter,
  Youtube: Youtube,
  Instagram: Instagram,
  Facebook: Facebook,
  Send: Send,
  PhoneCall: PhoneCall,
  Music: Music,
  Code: Code,
  BookOpen: BookOpen,
  Dribbble: Dribbble,
  Globe: Globe,
  MessageSquare: MessageSquare
};

export default function SocialSection({ socialLinks, searchQuery }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Professional', 'Code', 'Freelance', 'Design', 'Social', 'Media', 'Gaming', 'Contact', 'Crypto'];

  const filteredLinks = socialLinks.filter(link => {
    const isEnabled = link.enabled !== false;
    const matchesCategory = activeCategory === 'All' || link.category === activeCategory;
    const matchesSearch = !searchQuery || 
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.handle && link.handle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return isEnabled && matchesCategory && matchesSearch;
  });

  const handleLinkClick = (link) => {
    trackEvent('link_click', link.id);
  };

  const handleCopyLink = (e, link) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      
      {/* Section Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Connected Social Accounts
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified identity handles across developer platforms & social networks.
          </p>
        </div>

        {/* Grid vs List View Toggle */}
        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto border border-slate-300/60 dark:border-slate-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Compact List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Links Grid / List Layout */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-3xl p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No social accounts found matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4" 
            : "flex flex-col gap-3"
        }>
          {filteredLinks.map((link) => {
            const IconComponent = ICON_MAP[link.icon] || Globe;
            
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className="group relative glass-card p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Icon Badge */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${link.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Handle & Title */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {link.name}
                      </span>
                      {link.verified && (
                        <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" title="Verified Account" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {link.handle}
                    </p>
                    {viewMode === 'grid' && link.description && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Copy Link Button */}
                  <button
                    onClick={(e) => handleCopyLink(e, link)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy Link URL"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Launch Arrow */}
                  <div className="p-2 rounded-xl text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

              </a>
            );
          })}
        </div>
      )}

    </section>
  );
}
