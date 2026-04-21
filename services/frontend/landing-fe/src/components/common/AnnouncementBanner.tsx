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
import { m, AnimatePresence } from 'framer-motion';
import { RECRUITMENT_CONFIG, isRecruitmentOpen } from '@/data/recruitment';
import './AnnouncementBanner.css';

const DISMISS_KEY = 'ieee-ritb-banner-dismissed';

function isDismissed(): boolean {
    try {
        return sessionStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
        return false;
    }
}

interface AnnouncementBannerProps {
    show?: boolean;
}

export default function AnnouncementBanner({ show = true }: AnnouncementBannerProps) {
    const [dismissed, setDismissed] = useState(isDismissed);
    const isActive = show && isRecruitmentOpen() && !dismissed;


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
                <m.div
                    className="announcement-banner"
                    role="alert"
                    initial={{ y: '0%', opacity: 0 }}
                    animate={{ y: '100%', opacity: 1 }}
                    exit={{ y: '0%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="announcement-banner-inner">
                        <p className="announcement-banner-text">
                            {RECRUITMENT_CONFIG.banner.message}
                            <a
                                href={RECRUITMENT_CONFIG.formUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="announcement-banner-cta"
                            >
                                {RECRUITMENT_CONFIG.banner.ctaText}
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
                </m.div>
            )}
        </AnimatePresence>
    );
}
