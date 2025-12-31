import { useEffect, useState } from 'react';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Features from './components/sections/Features';
import Chapters from './components/sections/Chapters';
import CTA from './components/sections/CTA';
import MagneticCursor from './components/effects/MagneticCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import BackToTop from './components/ui/BackToTop';
import { ToastProvider } from './contexts/ToastContext';
import { initSmoothScroll, initParallax, initMagneticElements } from './utils/smoothScroll';
import EnhancedLoader from './components/common/loading';
import SEO from './components/common/SEO';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [warpComplete, setWarpComplete] = useState(false);

  // Lock scroll during loader and warp animation
  useEffect(() => {
    if (!warpComplete) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Allow scrolling
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [warpComplete]);

  useEffect(() => {
    // Initialize smooth scroll behavior (Lenis)
    const lenis = initSmoothScroll();

    // Initialize parallax effects (with slight delay to ensure DOM is ready)
    const parallaxCleanup = setTimeout(() => {
      initParallax();
    }, 100);

    // Initialize magnetic elements
    const magneticCleanup = setTimeout(() => {
      initMagneticElements();
    }, 500);

    return () => {
      clearTimeout(parallaxCleanup);
      clearTimeout(magneticCleanup);
      lenis?.destroy();
    };
  }, []);

  return (
    <ToastProvider>
      <SEO />
      {/* Enhanced Loader */}
      <EnhancedLoader
        isLoading={isLoading}
        onLoaded={() => {
          setIsLoading(false);
          // Navigation will be shown after warp completes, not here
        }}
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Magnetic Cursor Effect */}
      <MagneticCursor visible={warpComplete} />

      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <a href="#nav" className="skip-nav">
        Skip to navigation
      </a>

      {/* Navigation */}
      <Navigation showNavigation={showNavigation} />

      {/* Main Content */}
      <main id="main-content" role="main">
        <Hero
          isLoading={isLoading}
          onWarpComplete={() => {
            setShowNavigation(true);
            setWarpComplete(true);
          }}
        />
        <About />
        <Features />
        <Chapters />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </ToastProvider>
  );
}

export default App;
