import { motion, type Variants } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useMotion } from '../hooks/useMotion';
import type { LayoutContext } from '../layouts/MainLayout';

// Sections
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Features from '../components/sections/Features';
import Events from '../components/sections/Events';
import Chapters from '../components/sections/Chapters';
import Contact from '../components/sections/Contact';

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
        <motion.div
            variants={safeContainerVariants}
            initial={warpComplete ? "visible" : "hidden"}
            animate={warpComplete ? "visible" : "hidden"}
        >
            <Hero />
            <About />
            <Features />
            <Events />
            <Chapters />
            <Contact />
        </motion.div>
    );
}
