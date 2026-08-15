import React, { useState } from 'react';
import { 
  X, Globe, ExternalLink, Sparkles, Building, ArrowUpRight, 
  Share2, FolderGit2, Mail, Shield, Search, ChevronRight, Heart
} from 'lucide-react';

export default function MenuModal({ isOpen, onClose, websites = [], profile = {}, onOpenAdminAuth, onOpenDonate }) {
  const [activeTab, setActiveTab] = useState('websites');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const socialLinks = profile?.socialLinks || [];
  const projects = profile?.projects || [];

  const filteredWebsites = websites.filter(site => 
    site.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    site.url?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    site.category?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredSocials = socialLinks.filter(s =>
    s.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.handle?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-end animate-fade-in">
      
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Sidebar Navigation Drawer */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 animate-slide-left overflow-hidden">
        
        {/* Drawer Header with Profile Summary & 3-Dot Menu */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            <img 
              src={profile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt={profile?.name || "Profile"}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {profile?.headerBrandName || "GravatarHub"}
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {profile?.name || "Billal Hossen"} • Navigation Sidebar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Quick Search inside Sidebar Navigation */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search websites, socials, projects..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Navigation Sidebar Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('websites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'websites'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Websites ({websites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'socials'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Socials ({socialLinks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>
        </div>

        {/* Sidebar Nav Content View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* TAB 1: Network Websites (Clicking opens in separate page/tab) */}
          {activeTab === 'websites' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">Connected Network Websites</span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-mono">
                  Opens in New Tab
                </span>
              </div>

              {filteredWebsites.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Globe className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">No websites found.</p>
                </div>
              ) : (
                filteredWebsites.map((site) => (
                  <a
                    key={site.id}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="group p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 flex items-center justify-between gap-3 shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {site.name}
                          </h4>
                          {site.category && (
                            <span className="px-2 py-0.2 text-[9px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                              {site.category}
                            </span>
                          )}
                        </div>
                        {site.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {site.description}
                          </p>
                        )}
                        <span className="block text-[10px] font-mono text-indigo-500 dark:text-indigo-400 mt-1 truncate">
                          {site.url}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </a>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Social Media Accounts */}
          {activeTab === 'socials' && (
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Official Social Profiles
              </div>
              {filteredSocials.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {link.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">{link.handle}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                </a>
              ))}
            </div>
          )}

          {/* TAB 3: Featured Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Portfolio Projects & Apps
              </div>
              {filteredProjects.map((proj) => (
                <a
                  key={proj.id}
                  href={proj.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-slate-500">{proj.category}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </a>
              ))}
            </div>
          )}

        </div>

        {/* Sidebar Footer with Quick Links & Owner Access */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 space-y-2 shrink-0">
          {profile?.donationConfig?.enabled !== false && (
            <button
              onClick={() => {
                onClose();
                onOpenDonate?.();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 transition-all"
            >
              <Heart className="w-4 h-4 fill-white animate-pulse" />
              <span>Support & Donate Page</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Send Direct Message</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAdminAuth?.();
            }}
            className="w-full p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Shield className="w-4 h-4" />
            <span>Owner Admin Portal</span>
          </button>
        </div>

      </div>
    </div>
  );
}
