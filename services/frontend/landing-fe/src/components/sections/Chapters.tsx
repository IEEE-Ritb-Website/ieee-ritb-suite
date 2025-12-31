import { useState } from 'react';
import ParallaxLayer from '../effects/ParallaxLayer';
import ChapterIcon from '../ui/ChapterIcon';
import './Chapters.css';
import { Chapters as IEEEChapters, ChapterType, type IChapterAcronyms } from "@astranova/catalogues";
import { motion, type Variants } from 'framer-motion';

const chapterColors: Record<IChapterAcronyms, string> = {
  CS: '#4d7fff',
  RAS: '#D22B2B',
  CIS: '#FFEA00',
  SC: '#ADF802',
  WIE: '#d946ef',
  MTTS: '#f97316',
  PES: '#10b981',
  SPS: '#8b5cf6',
  ComSoc: '#f59e0b',
  APS: '#ef4444',
  EMBS: '#6366f1',
  IX: '#0FFF50',
  Web: '#D22B2B',
  CRTY: '#FFEA00',
  COVR: '#ADF802',
  DIGI: '#d946ef',
  Doc: '#f97316',
  PRSP: '#6366f1',
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
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
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

  const chapters = IEEEChapters.map((ch) => ({
    ...ch,
    color: chapterColors[ch.acronym],
  }));

  const filteredChapters = chapters.filter(ch => {
    if (activeTab === 'all') return true;
    return ch.type === activeTab;
  });

  const techCount = chapters.filter(ch => ch.type === ChapterType.TECH).length;
  const nonTechCount = chapters.filter(ch => ch.type === ChapterType.NON_TECH).length;

  const handleChapterKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveChapter(index);
      console.log(`Chapter ${index} activated via keyboard`);
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
      {/* Parallax Background Elements */}
      <ParallaxLayer speed={0.35} zIndex={-2}>
        <div className="chapters-bg-shape chapters-bg-shape-1" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.45} zIndex={-1}>
        <div className="chapters-bg-shape chapters-bg-shape-2" />
      </ParallaxLayer>

      <div className="section-container">
        <motion.div 
          className="section-header"
          variants={headerVariants}
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
            Each chapter organizes workshops, projects, and events tailored to specific domains.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="chapters-tabs" role="tablist" aria-label="Chapter categories">
          <button
            role="tab"
            aria-selected={activeTab === 'all'}
            aria-controls="chapters-panel"
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setActiveChapter(null);
            }}
            onKeyDown={(e) => handleTabKeyDown(e, 'all')}
          >
            <span className="tab-text">All Chapters</span>
            <span className="tab-count">{chapters.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === ChapterType.TECH}
            aria-controls="chapters-panel"
            className={`tab-button ${activeTab === ChapterType.TECH ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(ChapterType.TECH);
              setActiveChapter(null);
            }}
            onKeyDown={(e) => handleTabKeyDown(e, ChapterType.TECH)}
          >
            <span className="tab-text">Technical</span>
            <span className="tab-count">{techCount}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === ChapterType.NON_TECH}
            aria-controls="chapters-panel"
            className={`tab-button ${activeTab === ChapterType.NON_TECH ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(ChapterType.NON_TECH);
              setActiveChapter(null);
            }}
            onKeyDown={(e) => handleTabKeyDown(e, ChapterType.NON_TECH)}
          >
            <span className="tab-text">Non-Technical</span>
            <span className="tab-count">{nonTechCount}</span>
          </button>
        </div>

        <motion.div
          className="grid-chapters"
          id="chapters-panel"
          role="tabpanel"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          key={activeTab} // Re-animate on tab change
        >
          {filteredChapters.map((chapter, index) => (
            <motion.div key={`${chapter.acronym}-${index}`} variants={itemVariants}>
              <article
                className={`chapter-card ${activeChapter === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveChapter(index)}
                onMouseLeave={() => setActiveChapter(null)}
                onFocus={() => setActiveChapter(index)}
                onBlur={() => setActiveChapter(null)}
                onKeyDown={(e) => handleChapterKeyDown(e, index)}
                tabIndex={0}
                role="button"
                aria-label={`${chapter.name} chapter`}
                aria-describedby={`chapter-desc-${index}`}
              >
                <div className="chapter-glow" style={{ background: `radial-gradient(circle at center, ${chapter.color}40, transparent)` }} />

                <div className="chapter-icon" aria-hidden="true" style={{ color: chapter.color }}>
                  <ChapterIcon acronym={chapter.acronym} size={40} />
                </div>

                <div className="chapter-header">
                  <h3 className="chapter-name">{chapter.name}</h3>
                  <span className="chapter-acronym" style={{ color: chapter.color }}>
                    {chapter.acronym}
                  </span>
                </div>

                <p className="chapter-description" id={`chapter-desc-${index}`}>
                  {chapter.shortDescription.slice(0, 48) + '...'}
                </p>

                <div className="chapter-footer">
                  <button className="chapter-link magnetic" aria-label={`Learn more about ${chapter.name}`}>
                    <span>Learn More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                  </button>
                </div>

                <div className="chapter-border" style={{ borderColor: chapter.color }} />
              </article>
            </motion.div>
          ))}
        </motion.div>

        <div className="chapters-cta">
          <p className="cta-text">
            Interested in starting a new chapter or want to learn more?
          </p>
          <a href="#contact" className="btn-outline magnetic">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
