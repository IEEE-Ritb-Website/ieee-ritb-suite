import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/component/luxe/ui/badge";
import { X } from "lucide-react";
import { CONFIG } from "@/configs/config";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(77,77,77,0)] backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to={"/"}>
            <Badge variant="shine">
              <div className="text-xl font-bold cursor-pointer">
                <span className="text-[#00a3ff]">IEEE </span>
                <span className="text-white">RIT-B</span>
              </div>
            </Badge>
          </Link>

          {/* Desktop Nav - Show on larger screens */}
          <div className="hidden lg:flex items-center gap-8">
            {CONFIG.navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className="text-white font-medium whitespace-nowrap transition-colors duration-300 ease-in-out hover:text-[#00a3ff]"
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Hamburger Menu Button - Show on smaller screens */}
          <button
            aria-label="Toggle menu"
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer z-[60] p-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <div className="relative w-5 h-[18px] flex flex-col justify-between">
              <span
                className={`block h-[3px] w-full mb-0.5 bg-[#00a3ff] rounded-sm transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45 translate-x-[5px] translate-y-[5px]" : ""
                  }`}
              ></span>
              <span
                className={`block h-[3px] w-full mb-0.5 bg-[#00a3ff] rounded-sm transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : ""
                  }`}
              ></span>
              <span
                className={`block h-[3px] w-full mb-0.5 bg-[#00a3ff] rounded-sm transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45 translate-x-[5px] -translate-y-[5px]" : ""
                  }`}
              ></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 h-screen w-64 bg-[rgba(10,25,41,0.95)] backdrop-blur-md pt-20 px-6 flex flex-col gap-6 z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 text-white hover:text-[#00a3ff] transition-colors duration-300"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>

              {/* Menu Items */}
              {CONFIG.navLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className="text-white font-medium transition-colors duration-300 ease-in-out hover:text-[#00a3ff]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {name}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;