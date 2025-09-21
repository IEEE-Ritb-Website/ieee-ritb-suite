import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/component/luxe/ui/badge";
import "./Navbar.css";

const navItems = [
  { name: "Home", path: "/" },
  // { name: "Chapters", path: "/chapters" },
  { name: "Faculty", path: "/faculty" }, 
  // { name: "Gallery", path: "/gallery" },
  // { name: "Contact", path: "/contact" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar ">
        <div className="navbar-container">
          <Badge variant="shine">
            <div className="navbar-logo">
              <span>IEEE </span>
              <span>RIT-B</span>
            </div>
          </Badge>

          {/* Desktop Nav */}
          <div className="navbar-nav">
            {navItems.map(({ name, path }) => (
              <Link key={name} to={path} className="navbar-nav-item">
                {name}
              </Link>
            ))}
          </div>

          {/* Menu Icon */}
          <button
            aria-label="Toggle menu"
            className="menu-button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <div className={`menu-icon ${isMenuOpen ? "menu-open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className={`backdrop ${isMenuOpen ? "open" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              className={`side-menu ${isMenuOpen ? "open" : ""}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {navItems.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className="side-menu-item"
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
