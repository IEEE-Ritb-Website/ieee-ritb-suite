import { m, type Variants } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useMotion } from '../hooks/useMotion';
import type { LayoutContext } from '../layouts/MainLayout';
import { lazy, Suspense, useRef } from 'react';
import type { ReactNode } from 'react';
import { useInView } from 'framer-motion';

// Sections
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Features from '../components/sections/Features';

const Events = lazy(() => import('../components/sections/Events'));
const Chapters = lazy(() => import('../components/sections/Chapters'));
const Contact = lazy(() => import('../components/sections/Contact'));

function LazySection({ children, height }: { children: ReactNode, height: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "600px 0px" });
    return (
        <div ref={ref} style={{ minHeight: height }}>
            {isInView && <Suspense fallback={null}>{children}</Suspense>}
        </div>
    );
}

/**
 * Home Page
 * 
 * The landing page content.
 * Renders all the main sections: Hero, About, Features, Events, Chapters, Contact.
 * Sections are bundled directly for smoother scrolling experience.
 */
export default function Home() {
    const { warpComplete } = useOutletContext<LayoutContext>();
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
        <m.div
            variants={safeContainerVariants}
            initial={warpComplete ? "visible" : "hidden"}
            animate={warpComplete ? "visible" : "hidden"}
        >
            <Hero />
            <About />
            <Features />
            <LazySection height="800px"><Events /></LazySection>
            <LazySection height="800px"><Chapters /></LazySection>
            <LazySection height="600px"><Contact /></LazySection>
        </m.div>
    );
}
