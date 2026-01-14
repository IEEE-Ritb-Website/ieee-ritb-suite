import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useMotion } from '../hooks/useMotion';
import GlitchText from '../components/effects/GlitchText';
import type { LayoutContext } from '../layouts/MainLayout';
import './NotFound.css';

/**
 * NotFound Page (404)
 * 
 * Displays a cyber/glitch aesthetic 404 page.
 * Uses existing GlitchText effect for the error code.
 */
export default function NotFound() {
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { orchestrate } = useMotion();

    const containerVariants = orchestrate({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    });

    const itemVariants = orchestrate({
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    });

    return (
        <>
            <Helmet>
                <title>404 - Page Not Found | IEEE RITB</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <motion.div
                className="not-found"
                variants={containerVariants}
                initial="hidden"
                animate={warpComplete ? "visible" : "hidden"}
            >
                <div className="not-found-content">
                    <motion.div className="error-code" variants={itemVariants}>
                        <GlitchText text="404" style="hero" />
                    </motion.div>

                    <motion.h1 className="not-found-title" variants={itemVariants}>
                        Signal Lost
                    </motion.h1>

                    <motion.p className="not-found-description" variants={itemVariants}>
                        The coordinates you're searching for don't exist in our system.
                        The page may have been moved, deleted, or never existed.
                    </motion.p>

                    <motion.div className="not-found-terminal" variants={itemVariants}>
                        <div className="terminal-header">
                            <span className="terminal-dot" />
                            <span className="terminal-dot" />
                            <span className="terminal-dot" />
                            <span className="terminal-title">system_error.log</span>
                        </div>
                        <div className="terminal-body">
                            <code>
                                <span className="terminal-prompt">$</span> locate requested_page<br />
                                <span className="terminal-error">ERROR:</span> Page not found in /universe<br />
                                <span className="terminal-prompt">$</span> suggest --alternatives<br />
                                <span className="terminal-success">→</span> Try navigating to homepage<br />
                                <span className="terminal-success">→</span> Check the URL for typos<br />
                                <span className="terminal-success">→</span> Use navigation menu
                            </code>
                        </div>
                    </motion.div>

                    <motion.div className="not-found-actions" variants={itemVariants}>
                        <Link to="/" className="btn-primary em-field">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            <span>Return Home</span>
                        </Link>
                        <Link to="/#contact" className="btn-secondary">
                            Report Issue
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
