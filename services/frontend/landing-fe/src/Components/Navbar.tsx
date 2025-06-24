// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import './Navbar.css'; 

// const navItems = [
//   { name: "Home", href: "#home" },
//   { name: "Chapters", href: "#chapters" },
//   { name: "Faculty", href: "#faculty" },
//   { name: "Gallery", href: "#gallery" },
//   { name: "Contact", href: "#contact" },
// ];

// const Navbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
//   }, [isMenuOpen]);

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-container">
//           <div className="navbar-logo">
//             <span>IEEE </span>
//             <span>RIT-B</span>
//           </div>

//           {/* desktop nav */}
//           <div className="navbar-nav">
//             {navItems.map(({ name, href }) => (
//               <a
//                 key={name}
//                 href={href}
//                 className="navbar-nav-item"
//               >
//                 {name}
//               </a>
//             ))}
//           </div>

//           {/* menu icon */}
//           <button
//             aria-label="Toggle menu"
//             className="menu-button"
//             onClick={() => setIsMenuOpen((prev) => !prev)}
//           >
//             <div className={`menu-icon ${isMenuOpen ? "menu-open" : ""}`}>
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           </button>
//         </div>
//       </nav>

//       <AnimatePresence>
//         {isMenuOpen && (
//           <>
//             <motion.div
//               className={`backdrop ${isMenuOpen ? "open" : ""}`}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsMenuOpen(false)}
//             />

//             <motion.div
//               className={`side-menu ${isMenuOpen ? "open" : ""}`}
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "tween", duration: 0.3 }}
//             >
//               {navItems.map(({ name, href }) => (
//                 <a
//                   key={name}
//                   href={href}
//                   className="side-menu-item"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {name}
//                 </a>
//               ))}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Chapters", path: "/chapters" },
  { name: "Faculty", path: "/faculty" },       // You can create this route later
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },       // You can create this route later
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span>IEEE </span>
            <span>RIT-B</span>
          </div>

          {/* Desktop Nav */}
          <div className="navbar-nav">
            {navItems.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className="navbar-nav-item"
              >
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
