import { Link } from "lucide-react";

export const APPS_CONFIG = {
    name: "ritb-apps",
    apps: [
        {
            name: "URL Shortener",
            description: "Shorten long URLs easily and share them with a simple link starting with ritb.in",
            icon: <Link />,
            href: "/shortener",
            actionText: "Shorten Url",
        }
    ],
}
