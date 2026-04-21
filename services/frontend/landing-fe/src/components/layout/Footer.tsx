/**
 * Purpose: Site-wide footer with branding, navigation links, and social icons.
 * Exports: default Footer (React component)
 * Side effects: None
 */
import { LinkedInIcon, InstagramIcon, GitHubIcon } from '../ui/icons';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <img
                src="/ieee_transparent_logo.png"
                alt=""
                className="footer-logo-img"
              />
              <div className="footer-brand-text">
                <span className="footer-logo-text">IEEE </span>
                <span className="footer-logo-accent">RIT-B</span>
              </div>
            </div>
            <p className="footer-tagline">
              Advancing Technology for Humanity
            </p>
            <div className="footer-social">
              <a
                href="https://linkedin.com/company/ieee-rit"
                aria-label="Connect with us on LinkedIn"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://instagram.com/ieeeritb"
                aria-label="Follow us on Instagram"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://github.com/ieeeritb"
                aria-label="View our projects on GitHub"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#chapters">Chapters</a></li>
            </ul>
          </div>


          {/* Contact */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-links">
              <li>
                <a href="mailto:ieeeritb@gmail.com">
                  ieeeritb@gmail.com
                </a>
              </li>
              <li>MSRIT Post, M S R Nagar, Mathikere, Bengaluru, Karnataka 560054</li>

            </ul>
          </div>
        </div>


        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} IEEE RIT-B Student Branch. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="https://drive.google.com/file/d/11rujlXhkrZ_KhNRvwpMudVXXGLEXJiW8/" target="_blank" rel="noopener noreferrer">Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
