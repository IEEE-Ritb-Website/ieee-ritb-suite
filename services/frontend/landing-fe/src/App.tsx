import { useEffect, useState } from 'react';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Features from './components/sections/Features';
import Chapters from './components/sections/Chapters';
import Contact from './components/sections/Contact';
import MagneticCursor from './components/effects/MagneticCursor';
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [warpComplete]);

  useEffect(() => {
    const lenis = initSmoothScroll();
    const parallaxCleanup = setTimeout(() => {
      initParallax();
    }, 100);
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
      <EnhancedLoader
        isLoading={isLoading}
        onLoaded={() => {
          setIsLoading(false);
        }}
      />

      <MagneticCursor visible={warpComplete} />

      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <a href="#nav" className="skip-nav">Skip to navigation</a>

      <Navigation showNavigation={showNavigation} />

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
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </ToastProvider>
  );
}

export default App;