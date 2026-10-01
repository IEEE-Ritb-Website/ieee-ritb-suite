export const CONFIGS = {
    main_website: "https://ieee.ritb.in",
    api_url: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    email: "ieeeritb@gmail.com",
    nav_links: [
        { name: "Showcase", href: "/showcase" },
        { name: "Tools", href: "/#tools" },
    ]
}