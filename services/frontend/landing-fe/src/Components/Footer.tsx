// import React from "react";
// import { useFooterGlow } from "./useFooterGlow";

// const Footer: React.FC = () => {
//   const footerRef = useFooterGlow();

//   return (
//     <footer
//       ref={footerRef}
//       id="footer"
//       className="glass footer-hover-effect footer-sliding-gradient relative py-16 px-4 sm:px-8 md:px-12 overflow-hidden bg-gray-900 text-white mt-16"
//     >
//       {/* Glow Layer */}
//       <div
//         id="glow"
//         className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-20"
//       ></div>

//       {/* Main Grid Content */}
//       <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-16 lg:px-24">
//   {/* Responsive layout: stack on small screens, side-by-side on larger */}
//   <div className="flex flex-col md:flex-row justify-between gap-12 mb-16 text-center md:text-left">
    
//     {/* Logo + Quote */}
//     <div className="flex-1">
//       <h1 className="text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
//         IEEE RIT-B
//       </h1>
//       <p className="text-gray-400 mt-3 italic">“a cool deep quote”</p>
//     </div>

//     {/* Navigation */}
//     <div className="flex-1">
//       <h2 className="text-lg font-bold mb-4">Explore</h2>
//       <ul className="space-y-2 text-gray-400">
//         {["Home", "About", "Projects", "Contact"].map((item) => (
//           <li key={item}>
//             <a href="#" className="block p-2 rounded-md glow-hover hover:text-white">
//               {item}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>

//     {/* Socials */}
//     <div className="flex-1">
//       <h2 className="text-lg font-bold mb-4">Connect</h2>
//       <ul className="flex justify-center md:justify-start space-x-4 text-xl text-gray-400">
//         <li><a href="https://www.instagram.com/ieeeritb/" className="icon-hover"><i className="fab fa-instagram"></i></a></li>
//         <li><a href="" className="icon-hover"><i className="fab fa-facebook-f"></i></a></li>
//         <li><a href="https://www.linkedin.com/company/ieee-rit/" className="icon-hover"><i className="fab fa-linkedin-in"></i></a></li>
//         <li><a href="" className="icon-hover"><i className="fab fa-x-twitter"></i></a></li>
//       </ul>
//     </div>
//   </div>

//   {/* Newsletter Section */}
//   <div className="newsletter-bottom bg-gray-800 rounded-2xl px-6 py-8 text-center">
//     <h3 className="text-xl font-semibold mb-2">Stay updated!!</h3>
//     <p className="text-gray-400 text-sm mb-4">Get updates about our latest activities.</p>
//     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
//       <input
//         type="email"
//         placeholder="your@email.com"
//         className="flex-1 w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//       />
//       <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all">
//         Subscribe
//       </button>
//     </div>
//   </div>

//   {/* Footer Bottom */}
//   <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
//     &copy; 2025 IEEE RIT-B. All rights reserved.
//   </div>
// </div>

//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import { useFooterGlow } from "./useFooterGlow";

const Footer: React.FC = () => {
  const footerRef = useFooterGlow();

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative py-16 px-4 sm:px-8 lg:px-16 bg-gray-900 text-white overflow-hidden"
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
          <h1 className="text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
            IEEE RIT-B
          </h1>
          <p className="text-gray-400 mt-3 italic">“a cool deep quote”</p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-lg font-bold mb-4">Explore</h2>
          <ul className="space-y-2 text-gray-400">
            {["Home", "About", "Projects", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block p-2 rounded-md hover:bg-gray-800 hover:text-white transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-lg font-bold mb-4">Connect</h2>
          <ul className="flex space-x-4 text-xl text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition" aria-label="Twitter">
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
            className="flex-1 w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-blue-700 hover:to-cyan-700 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; 2025 IEEE RIT-B. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
