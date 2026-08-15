import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ProfileHero from './components/ProfileHero';
import SocialSection from './components/SocialSection';
import PortfolioSection from './components/PortfolioSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import { loadProfileData, saveProfileData, trackEvent, initCloudSync } from './js/storage';
import { applyDynamicMetadata } from './js/metadataManager';
import { pageTransition } from './js/motionVariants';

// Code-splitting via React.lazy for Admin and secondary heavy views/modals
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AdminAuthModal = lazy(() => import('./components/AdminAuthModal'));
const CryptoPaymentPage = lazy(() => import('./components/CryptoPaymentPage'));
const DonatePage = lazy(() => import('./components/DonatePage'));
const QRCodeModal = lazy(() => import('./components/QRCodeModal'));
const SEOHead = lazy(() => import('./components/SEOHead'));
const MenuModal = lazy(() => import('./components/MenuModal'));

export default function App() {
  const [profile, setProfile] = useState(() => loadProfileData());

  // Apply real-time metadata & OpenGraph tags on document head
  useEffect(() => {
    applyDynamicMetadata(profile);
  }, [profile]);

  // Initialize Firebase Cloud sync on app launch
  useEffect(() => {
    const unsub = initCloudSync((updatedProfile) => {
      setProfile(updatedProfile);
    });
    return () => unsub?.();
  }, []);
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#crypto' || window.location.hash === '#crypto-pay') return 'crypto';
      if (window.location.hash === '#donate' || window.location.hash === '#support') return 'donate';
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

  // Listen to hash change e.g. #crypto-pay or #donate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#crypto' || hash === '#crypto-pay') {
        setCurrentView('crypto');
      } else if (hash === '#donate' || hash === '#support') {
        setCurrentView('donate');
      } else if (hash === '#admin' || hash === '#admin-secret') {
        setIsAdminAuthOpen(true);
      } else if (!hash || hash === '#' || hash === '#home') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenCryptoPage = () => {
    setCurrentView('crypto');
    window.location.hash = '#crypto-pay';
  };

  const handleOpenDonatePage = () => {
    setCurrentView('donate');
    window.location.hash = '#donate';
  };

  const handleBackToProfile = () => {
    setCurrentView('home');
    if (
      window.location.hash === '#crypto' || 
      window.location.hash === '#crypto-pay' ||
      window.location.hash === '#donate' ||
      window.location.hash === '#support'
    ) {
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

  // If viewing standalone full-screen Donate page
  if (currentView === 'donate') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="donate-page"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-full"
        >
          <Suspense fallback={<LoadingFallback message="Loading support portal..." />}>
            <DonatePage
              profile={profile}
              onBack={handleBackToProfile}
              onOpenCrypto={handleOpenCryptoPage}
            />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  }

  // If viewing standalone full-screen Crypto Payment page
  if (currentView === 'crypto') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="crypto-page"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-full"
        >
          <Suspense fallback={<LoadingFallback message="Loading crypto payment portal..." />}>
            <CryptoPaymentPage
              profile={profile}
              onBack={handleBackToProfile}
            />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="home-profile-view"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans"
      >
        
        {/* Navbar */}
        <Navbar
          profile={profile}
          onOpenSEO={() => setIsSEOOpen(true)}
          onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenDonate={handleOpenDonatePage}
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
            onOpenDonate={handleOpenDonatePage}
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
          onOpenDonate={handleOpenDonatePage}
        />

        {/* QR Code & Digital Card Modal (Lazy Loaded on Demand) */}
        {isQROpen && (
          <Suspense fallback={<LoadingFallback message="Loading QR code..." />}>
            <QRCodeModal
              isOpen={isQROpen}
              onClose={() => setIsQROpen(false)}
              profile={profile}
            />
          </Suspense>
        )}

        {/* SEO & Meta Inspector Modal (Lazy Loaded on Demand) */}
        {isSEOOpen && (
          <Suspense fallback={<LoadingFallback message="Loading SEO inspector..." />}>
            <SEOHead
              isOpen={isSEOOpen}
              onClose={() => setIsSEOOpen(false)}
              seoData={profile.seo}
              profile={profile}
            />
          </Suspense>
        )}

        {/* Menu / Our Websites Navigation Drawer (Lazy Loaded on Demand) */}
        {isMenuOpen && (
          <Suspense fallback={<LoadingFallback message="Loading network websites..." />}>
            <MenuModal
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              websites={profile.websites || []}
              profile={profile}
              onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
              onOpenDonate={handleOpenDonatePage}
            />
          </Suspense>
        )}

        {/* Secret Admin Authentication Modal (Lazy Loaded on Demand) */}
        {isAdminAuthOpen && (
          <Suspense fallback={<LoadingFallback message="Loading security prompt..." />}>
            <AdminAuthModal
              isOpen={isAdminAuthOpen}
              onClose={() => setIsAdminAuthOpen(false)}
              onAuthenticated={() => {
                setIsAdminAuthOpen(false);
                setIsAdminPanelOpen(true);
              }}
            />
          </Suspense>
        )}

        {/* Hidden Admin Management Dashboard (Lazy Loaded - Separated from Main Bundle) */}
        {isAdminPanelOpen && (
          <Suspense fallback={<LoadingFallback message="Loading Admin Management Dashboard..." />}>
            <AdminPanel
              isOpen={isAdminPanelOpen}
              onClose={() => setIsAdminPanelOpen(false)}
              profile={profile}
              onSaveProfile={handleUpdateProfile}
            />
          </Suspense>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
