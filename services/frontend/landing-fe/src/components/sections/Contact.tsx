import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import ParallaxLayer from '../effects/ParallaxLayer';
import './Contact.css';

// --- Variants ---

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
  }
};

// --- Components ---

function CornerBrackets() {
  return (
    <>
      <div className="bracket bracket-tl" />
      <div className="bracket bracket-tr" />
      <div className="bracket bracket-bl" />
      <div className="bracket bracket-br" />
    </>
  );
}

interface SingularityButtonProps {
  state: 'idle' | 'submitting' | 'success';
}

function SingularityButton({ state }: SingularityButtonProps) {
  return (
    <div className="singularity-btn-container">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="idle"
            type="submit"
            className="btn-primary magnetic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        )}

        {state === 'submitting' && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'var(--color-ieee-primary)',
              boxShadow: '0 0 30px var(--color-ieee-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{
                width: 24,
                height: 24,
                border: '3px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Component ---

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormState('success');
    setTimeout(() => {
      setFormState('idle');
      formRef.current?.reset();
    }, 6000);
  };

  return (
    <section className="section section-padding section-bg-surface" id="contact" aria-labelledby="contact-heading">
      {/* Structural Grid Background */}
      <div className="contact-interface-grid" />
      
      <ParallaxLayer speed={0.2} zIndex={-1}>
        <div className="contact-bg-glow" />
      </ParallaxLayer>

      <div className="section-container">
        <motion.div 
          className="section-header"
          variants={slideUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="section-overline">Contact Us</span>
          <h2 id="contact-heading" className="section-heading">
            Get in
            <span className="section-heading-accent"> Touch</span>
          </h2>
          <p className="section-description">
            Whether you're a student looking to join, a company interested in partnership,
            or just curious about our work, we're ready to connect.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Left Column: Contact Channels */}
          <motion.div 
            className="contact-channels"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { label: 'Email Us', value: 'ieeeritb@gmail.com', href: 'mailto:ieeeritb@gmail.com', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6' },
              { label: 'Visit HQ', value: 'RIT Campus, Bangalore', href: 'https://goo.gl/maps/RITBangalore', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7 a3 3 0 1 0 0 6 a3 3 0 1 0 0 -6' },
              { label: 'Community', value: '500+ Active Members', href: null, icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7 a4 4 0 1 0 0 8 a4 4 0 1 0 0 -8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' }
            ].map((item, i) => {
              const Tag = item.href ? 'a' : 'div';
              return (
                <Tag 
                  key={i} 
                  href={item.href as any} 
                  target={item.href ? "_blank" : undefined}
                  rel={item.href ? "noopener noreferrer" : undefined}
                  className="channel-card glass-panel"
                  onMouseMove={handleMouseMove}
                >
                  <div className="accent-strip" />
                  <CornerBrackets />
                  <div className="channel-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div className="channel-info">
                    <span className="channel-label">{item.label}</span>
                    <span className="channel-value">{item.value}</span>
                  </div>
                </Tag>
              );
            })}
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            className="contact-form-container glass-panel"
            variants={slideInRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            onMouseMove={handleMouseMove}
          >
            <CornerBrackets />
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div 
                  key="success"
                  className="transmission-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="success-icon-container"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { type: "spring", stiffness: 200, damping: 10 } }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <h3 className="success-title">Message Sent</h3>
                  <p className="success-desc">
                    Thank you for reaching out. Our team has received your message and will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  ref={formRef}
                  key="form"
                  className="contact-form" 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <div className="input-wrapper">
                      <input type="text" id="name" className="form-input" placeholder="Enter your name" required />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="input-wrapper">
                      <input type="email" id="email" className="form-input" placeholder="name@example.com" required />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <div className="input-wrapper">
                      <textarea id="message" className="form-textarea" placeholder="How can we help you?" required />
                    </div>
                  </div>
                  
                  <SingularityButton state={formState} />
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}