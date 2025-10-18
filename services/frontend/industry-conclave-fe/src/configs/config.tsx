import { Github, Linkedin, Instagram, Link, Facebook, Globe, BookOpen, Users, Code2 } from "lucide-react";

export const CONFIG = {
    name: 'Industry Conclave',
    shortDescription: 'Gain Industry Insights and Network with Professionals at Industry Conclave 2025',
    eventDetails: {
        dates: "21-22 November 2025",
        location: 'MSRIT, Bengaluru',
        coordinators: [
            {
                name: 'Priyanshu Bhojwani',
                phone: '+91 00000 00000',
            },
            {
                name: 'Navya Ullas Rai',
                phone: '+91 00000 00000',
            },
        ]
    },
    logo: "",   // TODO: to be set
    profile: {
        image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1760040051/ieee-logo-square_lzpsoz.jpg',
        email: 'ieeeritb@gmail.com',
        socials: [
            {
                name: "Instagram",
                url: "https://www.instagram.com/ieeeritb",
                icon: Instagram,
                label: "@ieeeritb",
            },
            {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/ieee-ritb/",
                icon: Linkedin,
                label: "ieee-ritb",
            },
            {
                name: "Facebook",
                url: "https://www.facebook.com/ieeeritb",
                icon: Facebook,
                label: "ieeeritb",
            },
            {
                name: 'Github',
                icon: Github,
                url: 'https://github.com/ieee-ritb',
                label: 'ieee-ritb'
            },
            {
                name: "Website",
                url: "https://ieee.ritb.in",
                icon: Link,
                label: "ieee.ritb.in",
            },
        ]
    },
    sponsors: [
        { name: "TechCorp", tier: "Platinum" },
        { name: "InnovateLabs", tier: "Gold" },
        { name: "DevHub", tier: "Gold" },
        { name: "CloudSync", tier: "Silver" },
        { name: "OpenStack", tier: "Silver" },
        { name: "CodeFlow", tier: "Silver" },
    ],
    agenda: [
        {
            title: "FOSS Product Showcase",
            description: "Discover innovative open-source projects",
        },
        {
            title: "Issues & Trends in FOSS",
            description: "Deep dive into current challenges and opportunities",
        },
        {
            title: "Sustaining FOSS",
            description: "Building sustainable open-source projects",
        },
        {
            title: "FOSS & Public Policy",
            description: "Open source in government and policy",
        },
        {
            title: "FOSS for NGOs",
            description: "Technology solutions for non-profits",
        },
        {
            title: "FOSS in Academia",
            description: "Open source in education and research",
        },
    ],
    features: [
        {
            icon: Code2,
            title: "Open Source",
            description: "Celebrate the power of free and open source software",
        },
        {
            icon: Users,
            title: "Community",
            description: "Connect with developers and enthusiasts across India",
        },
        {
            icon: BookOpen,
            title: "Learning",
            description: "Workshops, talks, and panel discussions from experts",
        },
        {
            icon: Globe,
            title: "Collaboration",
            description: "Build connections and foster innovation together",
        },
    ],
    faqs: [
        {
            question: "When and where is Industry Conclave 2025?",
            answer:
                "Industry Conclave 2025 will be held on September 20-21, 2025 at Nimhans Convention Centre in Bangalore. We also offer online attendance options.",
        },
        {
            question: "How do I register for the conference?",
            answer:
                'You can register through our website by clicking the "Register Now" button. Early bird tickets are available at a discounted rate until June 7th.',
        },
        {
            question: "What is included in the ticket?",
            answer:
                "Your ticket includes access to all sessions, workshops, meals, and networking events. Virtual attendees get access to live streams and recorded sessions.",
        },
        {
            question: "Can I submit a talk or workshop proposal?",
            answer:
                "Yes! We accept talk and workshop proposals until June 7th. Visit our speaker portal to submit your proposal.",
        },
        {
            question: "Is there accommodation available?",
            answer:
                "We have partnered with local hotels to offer special rates for attendees. Details will be shared with registered participants.",
        },
        {
            question: "What is your refund policy?",
            answer:
                "Refunds are available until August 31st. After that date, tickets are non-refundable but can be transferred to another person.",
        },
    ],
    timeline: {
        day1: [
            {
                time: "09:00 AM",
                title: "Registration & Breakfast",
                description: "Welcome to Industry Conclave 2025",
            },
            {
                time: "10:00 AM",
                title: "Opening Keynote",
                description: "Keynote address by industry leaders",
            },
            {
                time: "11:30 AM",
                title: "Parallel Tracks Begin",
                description: "Choose from multiple technical sessions",
            },
            {
                time: "01:00 PM",
                title: "Lunch Break",
                description: "Network with fellow developers",
            },
            {
                time: "02:00 PM",
                title: "Workshops & Sessions",
                description: "Deep dive into FOSS technologies",
            },
            {
                time: "06:00 PM",
                title: "Networking Dinner",
                description: "Connect with the community",
            },
        ],
        day2: [
            {
                time: "09:00 AM",
                title: "Day 2 Registration",
                description: "Welcome back to Industry Conclave",
            },
            {
                time: "10:00 AM",
                title: "Advanced Workshops",
                description: "Deep technical sessions and hands-on labs",
            },
            {
                time: "12:30 PM",
                title: "Lightning Talks",
                description: "Quick insights from community members",
            },
            {
                time: "01:30 PM",
                title: "Lunch Break",
                description: "Casual networking and discussions",
            },
            {
                time: "03:00 PM",
                title: "Panel Discussions",
                description: "Industry experts discuss open source trends",
            },
            {
                time: "05:00 PM",
                title: "Closing Ceremony",
                description: "Wrap up and announcements",
            },
        ],
    },
}