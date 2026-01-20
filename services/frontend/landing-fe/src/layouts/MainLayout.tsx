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

// Session storage key for tracking animation state
const ANIMATION_SEEN_KEY = 'ieee-ritb-animation-seen';

/**
 * Check if this is a fresh page load (needs animation) or internal navigation (skip animation)
 * Uses sessionStorage so animation only plays once per browser session
 */
function hasSeenAnimation(): boolean {
    try {
        return sessionStorage.getItem(ANIMATION_SEEN_KEY) === 'true';
    } catch {
        return false; // If sessionStorage is unavailable, show animation
    }
}

function markAnimationSeen(): void {
    try {
        sessionStorage.setItem(ANIMATION_SEEN_KEY, 'true');
    } catch {
        // Silently fail if sessionStorage is unavailable
    }
}

// Detect if this is a page reload/refresh
function isPageReload(): boolean {
    try {
        // Use Performance Navigation API to detect reload
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
            return navEntries[0].type === 'reload';
        }
        // Fallback for older browsers
        return performance.navigation?.type === 1;
    } catch {
        return false;
    }
}

// Clear animation flag if page was reloaded so animation plays again
function clearAnimationOnReload(): void {
    if (isPageReload()) {
        try {
            sessionStorage.removeItem(ANIMATION_SEEN_KEY);
        } catch {
            // Silently fail
        }
    }
}

// Run on module load to handle reload before React hydrates
clearAnimationOnReload();

/**
 * MainLayout - Persistent Shell
 * 
 * This layout component wraps all routes and ensures:
 * 1. The WebGL starfield background persists across navigation
 * 2. Navigation and Footer remain mounted
 * 3. Page transitions are animated via AnimatePresence
 * 4. Loader/warp animation plays on initial load and page refresh
 * 5. Internal navigation (clicking links) skips the animation for instant loading
 */
export default function MainLayout() {
    // Check if animation was already shown this session
    const animationAlreadySeen = hasSeenAnimation();

    // If animation was seen, skip loading states
    const [isLoading, setIsLoading] = useState(!animationAlreadySeen);
    const [showNavigation, setShowNavigation] = useState(animationAlreadySeen);
    const [warpComplete, setWarpComplete] = useState(animationAlreadySeen);

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
        // Mark that user has seen the animation for this session
        markAnimationSeen();
    };

    // Page transition variants - instant if animation already seen
    const pageVariants = animationAlreadySeen ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0, transition: { duration: 0 } },
        exit: { opacity: 1, y: 0, transition: { duration: 0 } }
    } : {
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
            {/* Only show loader if animation hasn't been seen yet */}
            {!animationAlreadySeen && (
                <EnhancedLoader
                    isLoading={isLoading}
                    onLoaded={() => setIsLoading(false)}
                />
            )}

            {/* Persistent WebGL Background */}
            <div className="fixed inset-0 z-[-1]" aria-hidden="true">
                <ErrorBoundary fallback={<HeroFallback />}>
                    <HeroStarfield
                        isLoading={isLoading}
                        initialPhase={animationAlreadySeen ? 'stopped' : 'warp'}
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

