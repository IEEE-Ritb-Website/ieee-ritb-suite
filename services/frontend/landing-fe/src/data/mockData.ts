/**
 * Mock Data for Events
 * 
 * Extended event data with full details for the detail pages.
 * In production, this would come from an API.
 */

export interface IEventDetails {
    id: string;
    title: string;
    date: string;
    time?: string;
    description: string;
    longDescription?: string;
    image: string;
    category: string;
    venue?: string;
    speakers?: Array<{
        name: string;
        title: string;
        image?: string;
    }>;
    schedule?: Array<{
        time: string;
        activity: string;
    }>;
    registrationLink?: string;
    tags?: string[];
}

export const EVENTS: IEventDetails[] = [
    {
        id: 'e1',
        title: 'Event X',
        date: '2026-04-20',
        time: 'TBA',
        description: 'Details for Event X coming soon. Stay tuned for updates.',
        longDescription: 'Event X is an upcoming flagship event from IEEE RIT-B. This event will bring together students, industry experts, and innovators to explore cutting-edge technologies. More details will be announced soon, including speakers, workshops, and registration information.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
        category: 'Category A',
        venue: 'RIT Bangalore Campus',
        speakers: [
            { name: 'Speaker TBA', title: 'Industry Expert' }
        ],
        schedule: [
            { time: 'TBA', activity: 'Opening Ceremony' },
            { time: 'TBA', activity: 'Keynote Session' },
            { time: 'TBA', activity: 'Workshops' },
            { time: 'TBA', activity: 'Closing Ceremony' }
        ],
        registrationLink: '#',
        tags: ['Technology', 'Innovation', 'Networking']
    },
    {
        id: 'e2',
        title: 'Event Y',
        date: '2026-06-30',
        time: 'TBA',
        description: 'Details for Event Y coming soon. Stay tuned for updates.',
        longDescription: 'Event Y promises to be an exciting gathering focused on emerging technologies and student innovation. This collaborative event will feature hands-on sessions and networking opportunities. Stay tuned for the complete agenda and registration details.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
        category: 'Category B',
        venue: 'RIT Bangalore Campus',
        speakers: [
            { name: 'Speaker TBA', title: 'Tech Lead' }
        ],
        schedule: [
            { time: 'TBA', activity: 'Registration & Welcome' },
            { time: 'TBA', activity: 'Technical Sessions' },
            { time: 'TBA', activity: 'Panel Discussion' }
        ],
        registrationLink: '#',
        tags: ['AI', 'Machine Learning', 'Workshop']
    },
    {
        id: 'e3',
        title: 'Event Z',
        date: '2026-11-01',
        time: 'TBA',
        description: 'Details for Event Z coming soon. Stay tuned for updates.',
        longDescription: 'Event Z will showcase the latest advancements in technology and provide a platform for students to present their projects. This event is designed to inspire the next generation of engineers and technologists. Full details coming soon.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        category: 'Category C',
        venue: 'RIT Bangalore Campus',
        speakers: [
            { name: 'Speaker TBA', title: 'Research Scientist' }
        ],
        schedule: [
            { time: 'TBA', activity: 'Project Showcase' },
            { time: 'TBA', activity: 'Expert Sessions' },
            { time: 'TBA', activity: 'Awards & Recognition' }
        ],
        registrationLink: '#',
        tags: ['Projects', 'Research', 'Showcase']
    }
];

/**
 * Get event by ID
 */
export function getEventById(id: string): IEventDetails | undefined {
    return EVENTS.find(event => event.id === id);
}

/**
 * Get all events
 */
export function getAllEvents(): IEventDetails[] {
    return EVENTS;
}
