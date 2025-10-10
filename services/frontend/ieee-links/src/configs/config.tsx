import { Github, Linkedin, Instagram, Link, Facebook } from "lucide-react";

export const appConfig = {
    profile: {
        name: 'IEEE RIT-B',
        image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1760040051/ieee-logo-square_lzpsoz.jpg',
        email: 'ieeeritb@gmail.com',
        location: 'Bengaluru, India',
        sentences: [
            'Global Community',
            'Engineering',
            'Research',
        ],
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
                name: "Website",
                url: "https://ieee.ritb.in",
                icon: Link,
                label: "ieee.ritb.in",
            },
            {
                name: 'Github',
                icon: Github,
                url: 'https://github.com/ieee-ritb',
                label: 'ieee-ritb'
            },
        ]
    },
}