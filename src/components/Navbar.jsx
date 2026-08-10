import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Shield, Search, 
  Sparkles, Lock, Eye, Globe, UserCheck, ChevronRight, ExternalLink, Briefcase, Mail, MoreVertical, Activity
} from 'lucide-react';

export default function Navbar({ 
  profile,
  onOpenSEO, 
  onOpenAdminAuth,
  onOpenMenu,
  searchQuery,
  setSearchQuery 
}) {
  const brandName = profile?.headerBrandName || "GravatarHub";
  const websites = profile?.websites || [];
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              G
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
          <div className="hidden min-[360px]:block">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-slate-900 dark:text-white tracking-tight text-sm sm:text-lg">
                {brandName}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-2.5 h-2.5" /> Verified Profile
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 min-w-[110px] max-w-xs sm:max-w-md mx-1 sm:mx-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Submenu Dropdown */}
        <div className="relative flex items-center gap-1.5 sm:gap-2 shrink-0" ref={dropdownRef}>
          
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
            title="Our Websites & Links Menu"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden min-[400px]:inline">Menu</span>
          </button>

          {/* 3-Dot Options Button */}
          <button
            onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
            title="3-Dot Options & Navigation Menu"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Dropdown Submenu */}
          {isMenuDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Header / Main Websites Action */}
              <div className="pb-2 space-y-1">
                <button
                  onClick={() => {
                    setIsMenuDropdownOpen(false);
                    onOpenMenu();
                  }}
                  className="w-full p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-between font-bold text-xs shadow-md shadow-indigo-500/20"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>View All Our Websites</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Individual Websites Submenu List */}
              <div className="py-2 space-y-1 max-h-52 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Connected Websites</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{websites.length}</span>
                </div>

                {websites.length === 0 ? (
                  <p className="px-2.5 py-2 text-xs text-slate-400 italic">No websites listed yet.</p>
                ) : (
                  websites.map((site) => (
                    <a
                      key={site.id}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuDropdownOpen(false)}
                      className="group p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-2 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {site.name}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                    </a>
                  ))
                )}
              </div>

              {/* Quick Navigation Footer */}
              <div className="pt-2 space-y-0.5">
                <button
                  onClick={() => {
                    setIsMenuDropdownOpen(false);
                    onOpenAdminAuth();
                  }}
                  className="w-full p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Homepage Analysis Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuDropdownOpen(false);
                    document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Projects & Portfolio</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuDropdownOpen(false);
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  <span>Send Message</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuDropdownOpen(false);
                    onOpenAdminAuth();
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Owner Admin Access</span>
                </button>
              </div>

            </div>
          )}

          {/* SEO Preview Modal Trigger */}
          <button
            onClick={onOpenSEO}
            title="SEO & Share Meta Preview"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </div>

      </div>
    </header>
  );
}
