import './CTA.css';
import { motion, type Variants } from 'framer-motion';

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function CTA() {
  return (
    <section className="section section-padding section-bg-gradient" id="join" aria-labelledby="cta-heading">
      <div className="section-container">
        <motion.div 
          className="cta-content"
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 id="cta-heading" className="cta-heading">
            Ready to Shape the Future?
          </h2>
          <p className="cta-description">
            Join IEEE RITB today and become part of a global community of innovators
            advancing technology for humanity.
          </p>
          <div className="cta-buttons">
            <a
              href="#membership"
              className="btn-cta em-field"
              aria-label="Apply for IEEE RIT-B membership"
            >
              Become a Member
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#contact"
              className="btn-cta-secondary"
              aria-label="Get in touch with IEEE RIT-B"
            >
              <span>Contact Us</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
