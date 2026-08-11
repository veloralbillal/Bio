import React, { useState } from 'react';
import { 
  CheckCircle2, MapPin, Briefcase, 
  Copy, Check, Share2, Sparkles, ShieldCheck, Heart, ExternalLink, QrCode, Search, Coins
} from 'lucide-react';

export default function ProfileHero({ profile, onOpenQR, onContactClick, onOpenCrypto }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleUrl = profile.googleUrl || 'https://google.com';

  return (
    <div className="relative mb-8">
      {/* Cover Backdrop Banner */}
      <div className={`h-44 sm:h-56 md:h-64 w-full rounded-3xl overflow-hidden relative shadow-lg ${!profile.coverUrl ? `bg-gradient-to-r ${profile.coverGradient || 'from-[#d9a58b] via-[#e5b7a0] to-[#c69279]'}` : ''}`}>
        {profile.coverUrl && (
          <img 
            src={profile.coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
        
        {/* Status Chip overlay on cover */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border border-slate-700/60 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{profile.statusText || 'Active Online'}</span>
        </div>
      </div>

      {/* Main Profile Card Container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20">
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Avatar with Ring Glow, QR Overlay Badge & Verified Icon */}
            <div className="relative group shrink-0">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />

                {/* Small QR Badge on Profile Image */}
                <button
                  onClick={onOpenQR}
                  className="absolute top-2 right-2 bg-slate-900/85 hover:bg-indigo-600 text-white p-2 rounded-xl shadow-lg border border-white/30 backdrop-blur-md transition-all duration-200 group-hover:scale-110 active:scale-95 flex items-center justify-center"
                  title="Click to view QR Code"
                >
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300 group-hover:text-white" />
                </button>
              </div>

              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-2 border-white dark:border-slate-900 flex items-center justify-center" title="Gravatar Verified Owner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center md:text-left">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {profile.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400" title="Verified Gravatar Identity">
                      <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white dark:text-slate-900" />
                    </span>
                  </div>
                  
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    @{profile.username} • <span className="text-slate-500 dark:text-slate-400 font-normal">{profile.gravatarRating}</span>
                  </p>
                </div>
              </div>

              {/* Title & Company */}
              <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 mt-2">
                {profile.title}
              </p>

              {/* Location & Company Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {profile.company && (
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    {profile.company}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {profile.pronouns ? `${profile.pronouns} · ` : ''}{profile.location}
                  </span>
                )}
              </div>

              {/* Bio Paragraph */}
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                
                {/* Crypto Pay / Support Button */}
                <button
                  onClick={onOpenCrypto}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm border border-amber-400/50 shadow-lg shadow-amber-500/20 transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                  title="Crypto Pay & Support (BTC, LTC, ETH, USDT, SOL)"
                >
                  <Coins className="w-4 h-4" />
                  <span>Crypto Pay</span>
                </button>

                {/* Google Link Button (Replaced Send Message) */}
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-600 shadow-md transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95 group"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>

                {/* Copy Profile Link */}
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Copy Profile Link"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy Link</span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
