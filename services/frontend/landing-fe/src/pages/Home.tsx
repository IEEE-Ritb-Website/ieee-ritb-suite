import { lazy, Suspense } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import { useMotion } from '../hooks/useMotion';
import type { LayoutContext } from '../layouts/MainLayout';

// Lazy load sections
const About = lazy(() => import('../components/sections/About'));
const Features = lazy(() => import('../components/sections/Features'));
const Events = lazy(() => import('../components/sections/Events'));
const Chapters = lazy(() => import('../components/sections/Chapters'));
const Contact = lazy(() => import('../components/sections/Contact'));

// Branded loading fallback for sections
const SectionLoader = () => (
    <div className="w-full h-[400px] flex items-center justify-center opacity-30">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    </div>
);

/**
 * Home Page
 * 
 * The landing page content, previously in App.tsx.
 * Renders all the main sections: Hero, About, Features, Events, Chapters, Contact.
 */
export default function Home() {
    const { warpComplete, isLoading } = useOutletContext<LayoutContext>();
    const { orchestrate } = useMotion();

    // Stagger container for section reveals
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const safeContainerVariants = orchestrate(containerVariants);

    return (
        <motion.div
            variants={safeContainerVariants}
            initial={warpComplete ? "visible" : "hidden"}
            animate={warpComplete ? "visible" : "hidden"}
        >
            <Hero isLoading={isLoading} />
            <Suspense fallback={<SectionLoader />}>
                <About />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <Features />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <Events />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <Chapters />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <Contact />
            </Suspense>
        </motion.div>
    );
}
