import { useState } from 'react';
import ParallaxLayer from '../effects/ParallaxLayer';
import ChapterIcon from '../ui/ChapterIcon';
import './Chapters.css';
import { Chapters as IEEEChapters, ChapterType, type IChapterAcronyms } from "@astranova/catalogues";
import { motion, type Variants } from 'framer-motion';
import { useMotion } from '@/hooks/useMotion';

const chapterColors: Record<IChapterAcronyms, string> = {
  CS: '#4d7fff', RAS: '#D22B2B', CIS: '#FFEA00', SC: '#ADF802', WIE: '#d946ef',
  MTTS: '#f97316', PES: '#10b981', SPS: '#8b5cf6', ComSoc: '#f59e0b', APS: '#ef4444',
  EMBS: '#6366f1', IX: '#0FFF50', Web: '#D22B2B', CRTY: '#FFEA00', COVR: '#ADF802',
  DIGI: '#d946ef', Doc: '#f97316', PRSP: '#6366f1',
};

type TabType = 'all' | ChapterType.TECH | ChapterType.NON_TECH;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Chapters() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { orchestrate, shouldReduceMotion } = useMotion();

  const safeHeaderVariants = orchestrate(headerVariants);
  const safeContainerVariants = orchestrate(containerVariants);
  const safeItemVariants = orchestrate(itemVariants);

  const chapters = IEEEChapters.map((ch) => ({
    ...ch,
    color: chapterColors[ch.acronym],
  }));

  const filteredChapters = chapters.filter(ch => activeTab === 'all' || ch.type === activeTab);
  const techCount = chapters.filter(ch => ch.type === ChapterType.TECH).length;
  const nonTechCount = chapters.filter(ch => ch.type === ChapterType.NON_TECH).length;

  const handleChapterKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveChapter(index);
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent, tab: TabType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(tab);
      setActiveChapter(null);
    }
  };

  return (
    <section className="section section-padding section-bg-surface" id="chapters" aria-labelledby="chapters-heading">
      <ParallaxLayer speed={0.35} zIndex={-2}>
        <div className="chapters-bg-shape chapters-bg-shape-1" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.45} zIndex={-1}>
        <div className="chapters-bg-shape chapters-bg-shape-2" />
      </ParallaxLayer>

      <div className="section-container">
        <motion.div 
          className="section-header"
          variants={safeHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="section-overline">Our Ecosystem</span>
          <h2 id="chapters-heading" className="section-heading">
            Explore Our
            <span className="section-heading-accent"> Technical Chapters</span>
          </h2>
          <p className="section-description">
            Join any of our {chapters.length} diverse technical societies and special interest groups.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="chapters-tabs" role="tablist">
          {[
            { id: 'all', label: 'All Chapters', count: chapters.length },
            { id: ChapterType.TECH, label: 'Technical', count: techCount },
            { id: ChapterType.NON_TECH, label: 'Non-Technical', count: nonTechCount }
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id as TabType); setActiveChapter(null); }}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id as TabType)}
            >
              <span className="tab-text">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <motion.div
          className="grid-chapters"
          variants={safeContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          key={activeTab}
        >
          {filteredChapters.map((chapter, index) => (
            <motion.div key={`${chapter.acronym}-${index}`} variants={safeItemVariants}>
              <article
                className={`chapter-card ${activeChapter === index ? 'active' : ''}`}
                onMouseEnter={() => !shouldReduceMotion && setActiveChapter(index)}
                onMouseLeave={() => setActiveChapter(null)}
                onFocus={() => setActiveChapter(index)}
                onBlur={() => setActiveChapter(null)}
                onKeyDown={(e) => handleChapterKeyDown(e, index)}
                tabIndex={0}
                role="button"
              >
                <div className="chapter-glow" style={{ background: `radial-gradient(circle at center, ${chapter.color}40, transparent)` }} />
                <div className="chapter-icon" style={{ color: chapter.color }}>
                  <ChapterIcon acronym={chapter.acronym} size={40} />
                </div>
                <div className="chapter-header">
                  <h3 className="chapter-name">{chapter.name}</h3>
                  <span className="chapter-acronym" style={{ color: chapter.color }}>{chapter.acronym}</span>
                </div>
                <p className="chapter-description">{chapter.shortDescription.slice(0, 48) + '...'}</p>
                <div className="chapter-footer">
                  <button className="chapter-link magnetic" aria-label={`Learn more about ${chapter.name}`}>
                    <span>Learn More</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
                <div className="chapter-border" style={{ borderColor: chapter.color }} />
              </article>
            </motion.div>
          ))}
        </motion.div>

        <div className="chapters-cta">
          <p className="cta-text">Interested in starting a new chapter or want to learn more?</p>
          <a href="#contact" className="btn-outline magnetic">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}