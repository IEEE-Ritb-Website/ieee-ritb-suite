import React from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "@/configs/config";

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="relative py-10 px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="relative group overflow-hidden backdrop-blur-md rounded-3xl p-8 sm:p-12 mb-8 transition-all duration-300">
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `
          radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
          radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
          radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
          radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
          transparent
        `,
            }}
          />
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(125% 125% at 50% 10%, transparent 40%, #0d1a36 100%)",
            }}
          />
          {/* Glow Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00a3ff]/10 via-transparent to-[#00a3ff]/5 blur-xl"></div>
          </div>

          {/* Content Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Logo + Quote */}
            <div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#00a3ff]">IEEE </span>
                <span className="text-3xl font-bold text-white">RIT-B</span>
              </div>
              <p className="text-gray-400 italic leading-relaxed">
                Made with love by our awesome team.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h2 className="text-lg font-bold mb-4 text-white">Explore</h2>
              <ul className="space-y-3">
                {CONFIG.footerLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-[#00a3ff] transition-colors duration-300 inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact/Info Section */}
            <div>
              <h2 className="text-lg font-bold mb-4 text-white">Connect</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Join us in our journey to innovate and inspire through technology and collaboration.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Outside the rounded container */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
          {/* Copyright */}
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            &copy; 2025 IEEE RIT-B. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="order-1 sm:order-2">
            <ul className="flex space-x-6 text-xl">
              {CONFIG.socialLinks.map((social) => (
                <li>
                  <a
                    href={social.link}
                    className="text-gray-400 hover:text-[#00a3ff] transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;