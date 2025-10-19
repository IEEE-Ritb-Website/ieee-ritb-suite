import { useEffect } from 'react';
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

function App() {
  useEffect(() => {
    // Initialize smooth scroll behavior
    initSmoothScroll();

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
    };
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const elementsToAnimate = document.querySelectorAll(
      '.animate-fadeIn, .animate-slideUp, .animate-slideInRight, .animate-scaleIn, .stagger-children'
    );

    elementsToAnimate.forEach((el) => observer.observe(el));

    // Cleanup
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Device performance detection for low-end devices
    const isLowEndDevice = () => {
      // deviceMemory is a non-standard property from Device Memory API
      const deviceMemory = 'deviceMemory' in navigator ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory : undefined;
      const hardwareConcurrency = navigator.hardwareConcurrency;

      return (
        (deviceMemory !== undefined && deviceMemory < 4) ||
        (hardwareConcurrency !== undefined && hardwareConcurrency < 4)
      );
    };

    if (isLowEndDevice()) {
      document.body.classList.add('low-performance-mode');
    }

    // Frame rate monitoring
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const measurePerformance = () => {
      const now = performance.now();
      frameCount++;

      if (now >= lastFrameTime + 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
        frameCount = 0;
        lastFrameTime = now;

        // Automatically degrade if fps drops below 30
        if (fps < 30 && !document.body.classList.contains('low-performance-mode')) {
          console.warn('Low FPS detected, enabling performance mode');
          document.body.classList.add('low-performance-mode');
        }
      }

      requestAnimationFrame(measurePerformance);
    };

    // Start monitoring after page load
    const timer = setTimeout(() => {
      requestAnimationFrame(measurePerformance);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Magnetic Cursor Effect */}
      <MagneticCursor />

      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <a href="#nav" className="skip-nav">
        Skip to navigation
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" role="main">
        <Hero />
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
