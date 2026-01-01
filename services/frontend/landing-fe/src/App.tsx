import { useEffect, useState, lazy, Suspense } from 'react';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import MagneticCursor from './components/effects/MagneticCursor';
import BackToTop from './components/ui/BackToTop';
import { ToastProvider } from './contexts/ToastContext';
import { initSmoothScroll, initParallax, initMagneticElements } from './utils/smoothScroll';
import EnhancedLoader from './components/common/loading';
import SEO from './components/common/SEO';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import PerformanceMonitor from './components/debug/PerformanceMonitor';

// Lazy load sections
const About = lazy(() => import('./components/sections/About'));
const Features = lazy(() => import('./components/sections/Features'));
const Chapters = lazy(() => import('./components/sections/Chapters'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Branded loading fallback for sections
const SectionLoader = () => (
  <div className="w-full h-[400px] flex items-center justify-center opacity-30">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [warpComplete, setWarpComplete] = useState(false);
  const { tier } = usePerformanceMonitor();

  // 🚀 Scroll Reset Logic: Land on Hero every refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

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

      <main id="main-content" role="main" data-perf-tier={tier}>
        <Hero
          isLoading={isLoading}
          onWarpComplete={() => {
            setShowNavigation(true);
            setWarpComplete(true);
          }}
        />
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Chapters />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
      <PerformanceMonitor />
    </ToastProvider>
  );
}

export default App;