import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import MagneticCursor from '../components/effects/MagneticCursor';
import BackToTop from '../components/ui/BackToTop';
import EnhancedLoader from '../components/common/loading';
import SEO from '../components/common/SEO';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import PerformanceMonitor from '../components/debug/PerformanceMonitor';
import { ToastProvider } from '../contexts/ToastContext';
import { initSmoothScroll, initParallax, initMagneticElements } from '../utils/smoothScroll';
import HeroStarfield, { HeroFallback } from '../components/effects/HeroStarfield';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import type { AnimationPhase } from '../components/effects/HeroStarfield';

/**
 * MainLayout - Persistent Shell
 * 
 * This layout component wraps all routes and ensures:
 * 1. The WebGL starfield background persists across navigation
 * 2. Navigation and Footer remain mounted
 * 3. Page transitions are animated via AnimatePresence
 */
export default function MainLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [showNavigation, setShowNavigation] = useState(false);
    const [warpComplete, setWarpComplete] = useState(false);
    const { tier } = usePerformanceMonitor(false);
    const location = useLocation();

    // Scroll to top on route change
    useLayoutEffect(() => {
        // Reset scroll position for both native and Lenis smooth scroll
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Also reset any wrapper that Lenis might be using
        const wrapper = document.querySelector('[data-lenis-wrapper]') as HTMLElement;
        if (wrapper) wrapper.scrollTop = 0;
    }, [location.pathname]);

    // Scroll Reset Logic: Land on Hero every refresh
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

    // Initialize smooth scroll and effects
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

    const handleWarpComplete = () => {
        setShowNavigation(true);
        setWarpComplete(true);
    };

    // Page transition variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const }
        }
    };

    return (
        <ToastProvider>
            <SEO />
            <EnhancedLoader
                isLoading={isLoading}
                onLoaded={() => setIsLoading(false)}
            />

            {/* Persistent WebGL Background */}
            <div className="fixed inset-0 z-[-1]" aria-hidden="true">
                <ErrorBoundary fallback={<HeroFallback />}>
                    <HeroStarfield
                        isLoading={isLoading}
                        onPhaseChange={(phase: AnimationPhase) => {
                            if (phase === 'slowing') {
                                setTimeout(handleWarpComplete, 300);
                            }
                        }}
                    />
                </ErrorBoundary>
            </div>

            <MagneticCursor visible={warpComplete} />

            <a href="#main-content" className="skip-nav">Skip to main content</a>
            <a href="#nav" className="skip-nav">Skip to navigation</a>

            <Navigation showNavigation={showNavigation} />

            <main id="main-content" role="main" data-perf-tier={tier}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Outlet context={{ warpComplete, isLoading }} />
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
            <BackToTop />
            <PerformanceMonitor />
        </ToastProvider>
    );
}

// Export context type for pages to use
export interface LayoutContext {
    warpComplete: boolean;
    isLoading: boolean;
}
