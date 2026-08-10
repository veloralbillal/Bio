import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProfileHero from './components/ProfileHero';
import SocialSection from './components/SocialSection';
import PortfolioSection from './components/PortfolioSection';
import ContactSection from './components/ContactSection';
import QRCodeModal from './components/QRCodeModal';
import SEOHead from './components/SEOHead';
import AdminAuthModal from './components/AdminAuthModal';
import AdminPanel from './components/AdminPanel';
import MenuModal from './components/MenuModal';
import Footer from './components/Footer';
import CryptoPaymentPage from './components/CryptoPaymentPage';
import { loadProfileData, saveProfileData, trackEvent } from './js/storage';

export default function App() {
  const [profile, setProfile] = useState(() => loadProfileData());
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#crypto' || window.location.hash === '#crypto-pay')) {
      return 'crypto';
    }
    return 'home';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme_mode');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isQROpen, setIsQROpen] = useState(false);
  const [isSEOOpen, setIsSEOOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Sync dark mode class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [darkMode]);

  // Track page view event on initial mount
  useEffect(() => {
    trackEvent('page_view', 'home');

    // Secret keyboard shortcut to trigger Admin Panel: Ctrl + Shift + A or Alt + A
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsAdminAuthOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // URL hash trigger e.g. #admin
    if (window.location.hash === '#admin' || window.location.hash === '#admin-secret') {
      setIsAdminAuthOpen(true);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to hash change e.g. #crypto-pay
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#crypto' || hash === '#crypto-pay') {
        setCurrentView('crypto');
      } else if (hash === '#admin' || hash === '#admin-secret') {
        setIsAdminAuthOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenCryptoPage = () => {
    setCurrentView('crypto');
    window.location.hash = '#crypto-pay';
  };

  const handleBackToProfile = () => {
    setCurrentView('home');
    if (window.location.hash === '#crypto' || window.location.hash === '#crypto-pay') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handleContactScroll = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const elem = document.getElementById('contact-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById('contact-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    saveProfileData(newProfile);
  };

  // If viewing standalone full-screen Crypto Payment page
  if (currentView === 'crypto') {
    return (
      <CryptoPaymentPage
        profile={profile}
        onBack={handleBackToProfile}
      />
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Navbar */}
      <Navbar
        profile={profile}
        onOpenSEO={() => setIsSEOOpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Body */}
      <main className="pt-4 pb-12">
        
        {/* Profile Hero Header */}
        <ProfileHero
          profile={profile}
          onOpenQR={() => setIsQROpen(true)}
          onContactClick={handleContactScroll}
          onOpenCrypto={handleOpenCryptoPage}
        />

        {/* Social Accounts Showcase */}
        <SocialSection
          socialLinks={profile.socialLinks || []}
          searchQuery={searchQuery}
        />

        {/* Projects & Media Gallery */}
        <PortfolioSection
          projects={profile.projects || []}
          galleryPhotos={profile.galleryPhotos || []}
        />

        {/* Direct Contact Form */}
        <ContactSection
          profileEmail={profile.email}
        />

      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      {/* QR Code & Digital Card Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        profile={profile}
      />

      {/* SEO & Meta Inspector Modal */}
      <SEOHead
        isOpen={isSEOOpen}
        onClose={() => setIsSEOOpen(false)}
        seoData={profile.seo}
        profile={profile}
      />

      {/* Menu / Our Websites Navigation Drawer */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        websites={profile.websites || []}
        profile={profile}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      {/* Secret Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAuthenticated={() => {
          setIsAdminAuthOpen(false);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Hidden Admin Management Dashboard */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        profile={profile}
        onSaveProfile={handleUpdateProfile}
      />

    </div>
  );
}
