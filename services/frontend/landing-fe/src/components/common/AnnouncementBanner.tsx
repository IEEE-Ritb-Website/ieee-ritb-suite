/**
 * AnnouncementBanner - Time-based dismissible alert strip
 *
 * Shows a gradient banner with a recruitment/announcement message.
 * Visibility is controlled by start/end dates. Dismissal is persisted
 * via sessionStorage so it stays hidden for the current session.
 *
 * To configure: update the BANNER_CONFIG object below.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnnouncementBanner.css';

// ============================================================
// BANNER CONFIGURATION — Update these values as needed
// ============================================================
const BANNER_CONFIG = {
    /** Banner text displayed to users */
    message: '🚀 Recruitments are now open! Join IEEE RITB and be part of something extraordinary.',

    /** CTA button text */
    ctaText: 'Apply Now →',

    /** Google Form URL for the CTA */
    ctaUrl: 'https://forms.gle/semhFBRSfw8h4hYR7',

    /** Banner becomes visible on this date (inclusive) — ISO format */
    startDate: '2026-02-16T00:00:00+05:30',

    /** Banner hides after this date — ISO format */
    endDate: '2026-02-21T23:59:59+05:30',
};
// ============================================================

const DISMISS_KEY = 'ieee-ritb-banner-dismissed';

function isDismissed(): boolean {
    try {
        return sessionStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
        return false;
    }
}

function isWithinSchedule(): boolean {
    const now = new Date();
    const start = new Date(BANNER_CONFIG.startDate);
    const end = new Date(BANNER_CONFIG.endDate);
    return now >= start && now <= end;
}

interface AnnouncementBannerProps {
    show?: boolean;
}

export default function AnnouncementBanner({ show = true }: AnnouncementBannerProps) {
    const [dismissed, setDismissed] = useState(isDismissed);
    const isActive = show && isWithinSchedule() && !dismissed;


    const handleDismiss = () => {
        setDismissed(true);
        try {
            sessionStorage.setItem(DISMISS_KEY, 'true');
        } catch {
            // Silently fail
        }
    };

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="announcement-banner"
                    role="alert"
                    initial={{ y: '0%', opacity: 0 }}
                    animate={{ y: '100%', opacity: 1 }}
                    exit={{ y: '0%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="announcement-banner-inner">
                        <p className="announcement-banner-text">
                            {BANNER_CONFIG.message}
                            <a
                                href={BANNER_CONFIG.ctaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="announcement-banner-cta"
                            >
                                {BANNER_CONFIG.ctaText}
                            </a>
                        </p>

                        <button
                            className="announcement-banner-close"
                            onClick={handleDismiss}
                            aria-label="Dismiss announcement"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
