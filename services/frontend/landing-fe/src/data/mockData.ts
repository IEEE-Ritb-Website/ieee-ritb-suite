/**
 * Mock Data for Events
 * 
 * Extended event data with full details for the detail pages.
 * In production, this would come from an API.
 */

export interface IScheduleEvent {
    name: string;
    time: string;
    track?: string;
}

export interface IScheduleDay {
    day: string;
    label: string;
    totalEvents: number;
    events: IScheduleEvent[];
}

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
    schedule?: IScheduleDay[];
    registrationLink?: string;
    tags?: string[];
}

export const EVENTS: IEventDetails[] = [
    {
        id: 'e1',
        title: 'RIT Techfest',
        date: '2025-03-28',
        time: '28th – 29th March 2025',
        description: 'The flagship technical event by IEEE chapters celebrating innovation, collaboration, and creativity among students, educators, and professionals.',
        longDescription: 'RIT Techfest is the flagship technical event hosted by the IEEE chapters to encourage and celebrate technical innovation, collaboration, and creativity among students, educators, and professionals. This event serves as a platform for participants to showcase their technical expertise, delve into emerging technologies, and gain invaluable insights.\n\nSpanning two days, RIT Techfest is a celebration of technological advancement, featuring a variety of engaging activities, including innovative competitions, insightful seminars, and hands-on workshops. These activities are designed to provide attendees with practical exposure, industry-relevant knowledge, and opportunities to expand their professional network.',
        image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1770888778/techfest_eomnmb.png',
        category: 'Flagship Event',
        venue: 'RIT Campus',
        schedule: [
            {
                day: '28 March',
                label: 'Day 1',
                totalEvents: 8,
                events: [
                    { name: 'Inauguration', time: '9:00 a.m. – 10:00 a.m.' },
                    { name: 'Technovision', time: '10:00 a.m. – 4:30 p.m.' },
                    { name: 'Network Quiz', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'Platform 2.0', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'Sensor Bot', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'Squid Game (Xtreme)', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'ISpy', time: '2:00 p.m. – 6:00 p.m.' },
                    { name: 'Tech Escape Room', time: '10:00 a.m. – 1:30 p.m.' }
                ]
            },
            {
                day: '29 March',
                label: 'Day 2',
                totalEvents: 11,
                events: [
                    { name: 'Tech Relay', time: '9:00 a.m. – 6:00 p.m.' },
                    { name: 'Murder Mystery', time: '9:00 a.m. – 3:00 p.m.' },
                    { name: 'CivilScope', time: '2:00 p.m. – 5:00 p.m.' },
                    { name: 'Codepoly', time: '9:00 a.m. – 3:00 p.m.' },
                    { name: 'Antenna Align', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'Aerovision', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'Website Reconst', time: '2:00 p.m. – 5:00 p.m.' },
                    { name: 'Tech Conundrum', time: '2:00 p.m. – 5:00 p.m.' },
                    { name: 'MathMatrix', time: '2:00 p.m. – 5:00 p.m.' },
                    { name: 'ChemQuest', time: '10:00 a.m. – 1:30 p.m.' },
                    { name: 'IntelliLibrary', time: '10:00 a.m. – 1:30 p.m.' }
                ]
            }
        ],
        tags: ['Technology', 'Innovation', 'Competitions', 'Workshops']
    },
    {
        id: 'e2',
        title: 'CIS Industry Conclave',
        date: '2025-12-05',
        time: '5th – 6th December 2025',
        description: 'A two-day initiative bridging the gap between academia and industry through talks, workshops, and mentoring across Software, Hardware, and General tracks.',
        longDescription: 'In today\'s tech ecosystem, a significant gap persists between academic theory and the practical demands of the industry. The IEEE CIS Industry Conclave is a forward-thinking two-day initiative designed to bridge this divide, creating a dynamic platform for students, faculty, and industry leaders to connect and collaborate.\n\nTo cater to a wide range of interests, the conclave is structured across three core tracks: Software Track, Hardware Track, and General Track.\n\nAcross these tracks, participants engage in a vibrant mix of technical talks, hands-on workshops, panel discussions, and one-on-one mentoring. Sessions cover future-focused themes such as Generative AI, Responsible AI, Automation, and AI for Social Good, while also emphasizing career readiness, leadership, and technical storytelling. Each day culminates in a flagship event, inspiring students across Bangalore to push the boundaries of their capabilities and prepare for their future careers.',
        image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1770888778/industry_conclave_lzozpd.png',
        category: 'Conclave',
        venue: 'RIT Campus',
        schedule: [
            {
                day: '5 December',
                label: 'Day 1',
                totalEvents: 9,
                events: [
                    { name: 'Inauguration', time: '9:00 – 9:30 a.m.' },
                    { name: 'Keynote Address', time: '9:30 – 11:00 a.m.' },
                    { name: 'AI Debate', time: '11:00 a.m. – 1:00 p.m.', track: 'Software' },
                    { name: 'Digital Twin Talk and Workshop', time: '11:00 a.m. – 1:00 p.m.', track: 'Hardware' },
                    { name: 'Alumni Project Expo', time: '2:00 – 6:00 p.m.', track: 'General' },
                    { name: 'N8N Workshop', time: '2:00 – 5:00 p.m.', track: 'Software' },
                    { name: 'Expert Talk on AI in EV', time: '2:00 – 3:00 p.m.', track: 'Hardware' },
                    { name: 'Workshop on AI-Powered Drones', time: '3:00 – 6:00 p.m.', track: 'Hardware' },
                    { name: 'AI Infrastructure', time: '5:00 – 6:00 p.m.', track: 'Software' }
                ]
            },
            {
                day: '6 December',
                label: 'Day 2',
                totalEvents: 7,
                events: [
                    { name: 'The AI Revolution', time: '10:00 a.m. – 1:00 p.m.', track: 'Software' },
                    { name: 'ROS2 Workshop', time: '10:00 a.m. – 1:00 p.m.', track: 'Hardware' },
                    { name: 'Seniors Interaction Session', time: '2:00 – 6:00 p.m.', track: 'General' },
                    { name: 'Tech Detective', time: '2:00 – 5:00 p.m.', track: 'Software' },
                    { name: 'Expert Talk on VLSI and EV', time: '2:00 – 3:00 p.m.', track: 'Hardware' },
                    { name: 'Tech-Integrated Storytellings', time: '3:00 – 6:00 p.m.', track: 'Hardware' }
                ]
            }
        ],
        tags: ['AI', 'Industry', 'Mentoring', 'Workshops', 'Networking']
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
