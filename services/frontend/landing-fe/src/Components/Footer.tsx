import React from "react";
import { useFooterGlow } from "./useFooterGlow";
import { Text } from "@/component/luxe/ui/text";
import { Button } from "@/component/luxe/ui/button";

const Footer: React.FC = () => {
  const footerRef = useFooterGlow();

  return (
    <>
      <hr className="h-px w-full bg-white/20" />
      <footer
        ref={footerRef}
        id="footer"
        className="relative py-16 px-4 sm:px-8 lg:px-16 bg-transparent text-white overflow-hidden z-0"
      >
        {/* Glow background */}
        <div
          id="glow"
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-20"
        />

        {/* Main Content Grid */}
        <div className="relative z-10 max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Logo + Quote */}
          <div>
            {/* <h1 className="text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
            IEEE RIT-B
          </h1> */}
            <div className="navbar-logo">
              <span className="text-3xl">IEEE </span>
              <span className="text-3xl">RIT-B</span>
            </div>
            <p className="text-gray-400 mt-3 italic">
              “advancing technology for the benefit of humanity”
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-lg font-bold mb-4">Explore</h2>
            <ul className="space-y-2 text-gray-400">
              {["Home", "Chapters", "Faculty", "Gallery", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Text variant="hover-decoration">
                      <a href="/">{item}</a>
                    </Text>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h2 className="text-lg font-bold mb-4">Connect</h2>
            <ul className="flex space-x-4 text-xl text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="Twitter"
                >
                  <i className="fab fa-x-twitter"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="relative z-10 max-w-4xl mx-auto mt-10 bg-gray-800 rounded-2xl p-6 sm:p-10 text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-2">Stay updated!!</h3>
          <p className="text-gray-400 text-sm mb-4">
            Get updates about our latest activities.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-50"
            />
            {/* <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-blue-700 hover:to-cyan-700 transition">
            Subscribe
          </button> */}
          </div>
          <Button variant="animated-border" className="mt-4 bg-black ">
            Connect
          </Button>
        </div>

        {/* Footer Bottom */}
        <div className="relative z-10 border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; 2025 IEEE RIT-B. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
