/**
 * Recruitment Configuration
 * 
 * Centralized source of truth for recruitment windows and form links.
 * Update these dates each semester to automatically toggle recruitment UI across the site.
 */

export const RECRUITMENT_CONFIG = {
    /** The Google Form URL for recruitment applications */
    formUrl: 'https://forms.gle/hdCWxxYuH5TEaLAv6',
    
    /** 
     * Active recruitment windows. 
     * UI elements like the Announcement Banner and "Apply Now" buttons 
     * will only appear during these periods.
     */
    windows: [
        { 
            name: 'Phase 1',
            start: '2026-02-16T00:00:00+05:30', 
            end: '2026-02-21T23:59:59+05:30' 
        },
        { 
            name: 'Phase 2',
            start: '2026-03-09T00:00:00+05:30', 
            end: '2026-03-13T23:59:59+05:30' 
        },
    ],

    /** Banner specific messaging */
    banner: {
        message: '🚀 Recruitments are now open! Join IEEE RITB and be part of something extraordinary.',
        ctaText: 'Apply Now →',
    }
};

/**
 * Helper to check if recruitment is currently active based on defined windows
 */
export function isRecruitmentOpen(): boolean {
    const now = new Date();
    return RECRUITMENT_CONFIG.windows.some(window => {
        const start = new Date(window.start);
        const end = new Date(window.end);
        return now >= start && now <= end;
    });
}
