import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";

export const CONFIG = {
    navLinks: [
        { name: "Home", path: "/" },
        { name: "Faculty", path: "/faculty" },
    ],
    footerLinks: [
        { name: "Home", path: "/" },
        { name: "Faculty", path: "/faculty" },
    ],
    socialLinks: [
        {
            icon: InstagramIcon,
            link: "https://instagram.com/yourprofile",
            name: "Instagram",
        },
        {
            icon: FacebookIcon,
            link: "https://facebook.com/yourprofile",
            name: "Facebook",
        },
        {
            icon: LinkedinIcon,
            link: "https://linkedin.com/in/yourprofile",
            name: "LinkedIn",
        },
    ],
}