import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import ParallaxLayer from '../effects/ParallaxLayer';
import { useMotion } from '@/hooks/useMotion';
import { useIntent } from '@/hooks/useIntent';
import './Contact.css';

// --- Types ---

interface ChannelItem {
  label: string;
  value: string;
  href: string | null;
  icon: React.ReactNode;
}

// --- Logic Components ---

function ChannelCard({ item, safeItemVariants }: { item: ChannelItem, safeItemVariants: Variants }) {
  const { shouldReduceMotion } = useMotion();
  const { isMovingToward } = useIntent();
  const cardRef = useRef<HTMLElement>(null);
  const [isIntentHover, setIsIntentHover] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const checkIntent = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setIsIntentHover(isMovingToward(rect, 0.4));
      }
    };
    const interval = setInterval(checkIntent, 100);
    return () => clearInterval(interval);
  }, [isMovingToward, shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  const MotionTag = item.href ? motion.a : motion.div;

  return (
    <MotionTag 
      ref={cardRef as React.Ref<HTMLAnchorElement & HTMLDivElement>}
      href={item.href || undefined} 
      target={item.href ? "_blank" : undefined}
      rel={item.href ? "noopener noreferrer" : undefined}
      className={`channel-card glass-panel ${isIntentHover ? 'intent-active' : ''}`}
      onMouseMove={handleMouseMove}
      variants={safeItemVariants}
      whileHover={shouldReduceMotion ? {} : { x: 6 }}
    >
      <div className="accent-strip" />
      <div className="bracket bracket-tl" />
      <div className="bracket bracket-tr" />
      <div className="bracket bracket-bl" />
      <div className="bracket bracket-br" />
      <div className="channel-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {item.icon}
        </svg>
      </div>
      <div className="channel-info">
        <span className="channel-label">{item.label}</span>
        <span className="channel-value">{item.value}</span>
      </div>
    </MotionTag>
  );
}

const TERMINAL_LOGS = [
  { prefix: '[ OK ]', msg: 'INITIALIZING UPLINK PROTOCOL...' },
  { prefix: '[ OK ]', msg: 'ENCRYPTING PACKETS [AES-256]' },
  { prefix: '[WAIT]', msg: 'ESTABLISHING QUANTUM LINK...' },
  { prefix: '[ OK ]', msg: 'LINK SECURED. SIGNATURE VERIFIED.' },
  { prefix: '[ OK ]', msg: 'BUFFERING DATA STREAM...' },
  { prefix: '[SYNC]', msg: 'ROUTING VIA IEEE-RITB-CORE...' },
  { prefix: '[ OK ]', msg: 'TRANSMISSION COMMENCING...' }
];

function TerminalConsole() {
  const [visibleLogs, setVisibleLogs] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLogs(prev => {
        if (prev >= TERMINAL_LOGS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-console">
      <div className="terminal-header">
        <span>System Terminal v2.0</span>
        <span>Uplink: Active</span>
      </div>
      <div className="terminal-logs">
        {TERMINAL_LOGS.slice(0, visibleLogs).map((log, i) => (
          <div key={i} className="log-line">
            <span className="log-prefix">{log.prefix}</span>
            <span className="log-msg">{log.msg}</span>
          </div>
        ))}
        {visibleLogs < TERMINAL_LOGS.length && <span className="log-cursor" />}
      </div>
    </div>
  );
}

function TerminalSeal() {
  return (
    <motion.div 
      className="terminal-seal"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div 
        className="seal-inner"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </motion.div>
      <div className="seal-text" style={{ top: -20 }}>Secure</div>
      <div className="seal-text" style={{ bottom: -20 }}>Verified</div>
    </motion.div>
  );
}

// --- UI Components ---

interface SingularityButtonProps {
  state: 'idle' | 'submitting' | 'success';
  isValid: boolean;
}

function SingularityButton({ state, isValid }: SingularityButtonProps) {
  const { shouldReduceMotion } = useMotion();
  
  return (
    <div className="singularity-btn-container">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="idle"
            type="submit"
            className={`btn-primary magnetic ${isValid ? 'ignited' : 'dormant'}`}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: isValid ? '0 0 25px var(--color-accent-glow)' : '0 0 0px transparent'
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={isValid && !shouldReduceMotion ? { scale: 1.05 } : {}}
            whileTap={isValid && !shouldReduceMotion ? { scale: 0.95 } : {}}
          >
            <span className="btn-text">Send Message</span>
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
              style={{ marginLeft: 8 }}
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Animation Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// --- Main Section ---

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { orchestrate, shouldReduceMotion } = useMotion();
  const { isMovingToward } = useIntent();
  const [isIntentHover, setIsIntentHover] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const checkIntent = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsIntentHover(isMovingToward(rect, 0.4));
      }
    };
    const interval = setInterval(checkIntent, 100);
    return () => clearInterval(interval);
  }, [isMovingToward, shouldReduceMotion]);

  const safeContainerVariants = orchestrate(containerVariants);
  const safeItemVariants = orchestrate(itemVariants);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  const checkValidity = () => {
    if (formRef.current) {
      setIsFormValid(formRef.current.checkValidity());
    }
  };

  useEffect(() => {
    checkValidity();
  }, [formState]);

  const resetForm = () => {
    setFormState('idle');
    setTimeout(() => {
      if (formRef.current) formRef.current.reset();
      setIsFormValid(false);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setFormState('submitting');
    // Mimic technical processing time
    await new Promise(resolve => setTimeout(resolve, 2800));
    setFormState('success');
  };

  return (
    <section className="section section-padding section-bg-surface" id="contact" aria-labelledby="contact-heading">
      <div className="contact-interface-grid" />
      
      <ParallaxLayer speed={0.2} zIndex={-1}>
        <div className="contact-bg-glow" />
      </ParallaxLayer>

      <div className="section-container">
        <motion.div 
          className="section-header"
          variants={safeContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.span className="section-overline" variants={safeItemVariants}>Contact Us</motion.span>
          <motion.h2 id="contact-heading" className="section-heading" variants={safeItemVariants}>
            Get in
            <span className="section-heading-accent"> Touch</span>
          </motion.h2>
          <motion.p className="section-description" variants={safeItemVariants}>
            Whether you're a student looking to join, a company interested in partnership,
            or just curious about our work, we're ready to connect.
          </motion.p>
        </motion.div>

        <motion.div 
          className="contact-grid"
          variants={safeContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Contact Channels */}
          <motion.div className="contact-channels" variants={safeContainerVariants}>
            {[
              { 
                label: 'Email Us', 
                value: 'ieeeritb@gmail.com', 
                href: 'mailto:ieeeritb@gmail.com', 
                icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6" /> 
              },
              { 
                label: 'LinkedIn', 
                value: 'IEEE RIT-B', 
                href: 'https://linkedin.com/company/ieee-rit', 
                icon: <>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </>
              },
              { 
                label: 'Visit HQ', 
                value: 'RIT Campus, Bangalore', 
                href: 'https://maps.app.goo.gl/pBmSqVvwk5fZBmbz6', 
                icon: <>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </>
              },
              { 
                label: 'Instagram', 
                value: '@ieeeritb', 
                href: 'https://instagram.com/ieeeritb', 
                icon: <>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </>
              }
            ].map((item, i) => (
              <ChannelCard key={i} item={item} safeItemVariants={safeItemVariants} />
            ))}
          </motion.div>

          {/* Contact Form Terminal */}
          <motion.div variants={safeItemVariants} className="w-full">
            <motion.div 
              ref={containerRef}
              className={`contact-form-container glass-panel ${isIntentHover ? 'intent-active' : ''}`}
              onMouseMove={handleMouseMove}
              layout
            >
              <div className="bracket bracket-tl" />
              <div className="bracket bracket-tr" />
              <div className="bracket bracket-bl" />
              <div className="bracket bracket-br" />
              
              <AnimatePresence mode="wait">
                {formState === 'idle' && (
                  <motion.form 
                    ref={formRef}
                    key="form-idle"
                    className="contact-form" 
                    onSubmit={handleSubmit}
                    onChange={checkValidity}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <div className="input-wrapper">
                        <input type="text" id="name" className="form-input" placeholder="Enter your name" required autoComplete="name" />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <div className="input-wrapper">
                        <input type="email" id="email" className="form-input" placeholder="name@example.com" required autoComplete="email" />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="form-label">Message</label>
                      <div className="input-wrapper">
                        <textarea id="message" className="form-textarea" placeholder="How can we help you?" required />
                      </div>
                    </div>
                    
                    <SingularityButton state={formState} isValid={isFormValid} />
                  </motion.form>
                )}

                {formState === 'submitting' && (
                  <motion.div
                    key="form-submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TerminalConsole />
                  </motion.div>
                )}

                {formState === 'success' && (
                  <motion.div 
                    key="form-success"
                    className="transmission-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TerminalSeal />
                    <h3 className="success-title">Transmission Logged</h3>
                    <p className="success-desc">
                      Your data has been successfully routed to the IEEE RITB core server. A response will be dispatched shortly.
                    </p>
                    <motion.button 
                      className="terminal-return"
                      onClick={resetForm}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      RETURN TO TERMINAL
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}