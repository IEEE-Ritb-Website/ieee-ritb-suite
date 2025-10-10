import { appConfig } from "@/configs/config";
import { ExternalLink } from "lucide-react";

export const SocialLinks = () => {
    return (
        <>
            {appConfig.profile.socials.map((social) => (
                <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full block relative text-white font-medium py-4 px-6 rounded-xl overflow-hidden group cursor-pointer"
                    style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)";
                    }}
                >
                    {/* Subtle cursor glare */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                        style={{
                            background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.08), transparent 40%)",
                            transition: "opacity 0.3s ease",
                        }}
                    />

                    {/* Content container */}
                    <div className="flex items-center justify-between relative z-10">
                        {/* Left side: Icon and text */}
                        <div className="flex items-center space-x-3">
                            <social.icon className="w-5 h-5" />
                            <span>{social.label}</span>
                        </div>

                        <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                </a>
            ))}
        </>
    );
};