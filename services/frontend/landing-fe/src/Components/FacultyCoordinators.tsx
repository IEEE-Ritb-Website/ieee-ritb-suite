import React, { useCallback, useMemo, memo, useState } from 'react';
import './FacultyCoordinators.css';

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'email';
  url: string;
}

export interface Coordinator {
  id: number;
  name: string;
  designation: string;
  initials: string;
  image?: string;
  expertise?: string[];
  email?: string;
  department?: string;
  bio?: string;
  socialLinks?: SocialLink[];
}

const SocialIcon: React.FC<{ platform: SocialLink['platform'] }> = ({ platform }) => {
  const iconProps: React.SVGProps<SVGSVGElement> = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };

  switch (platform) {
    case 'linkedin':
      return (
        <svg {...iconProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'github':
      return (
        <svg {...iconProps}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case 'twitter':
      return (
        <svg {...iconProps}>
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      );
    case 'email':
    default:
      return (
        <svg {...iconProps}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </svg>
      );
  }
};

const CoordinatorCard = memo((props: {
  coordinator: Coordinator;
  index: number;
  isHovered: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onImageError: () => void;
  onImageLoad: () => void;
  hasImageError: boolean;
}) => {
  const { coordinator, index, isHovered, onMouseMove, onMouseEnter, onMouseLeave, onImageError, onImageLoad, hasImageError } = props;
  const hasImage = !!coordinator.image && !hasImageError;
  const cssVarStyle = { ['--index' as unknown as string]: index.toString() } as React.CSSProperties;

  return (
    <article
      className={`coordinator-card ${isHovered ? 'hovered' : ''}`}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={cssVarStyle}
      role="article"
      aria-label={`${coordinator.name} — ${coordinator.designation}`}
      tabIndex={0}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-number">{String(index + 1).padStart(2, '0')}</div>

          <div className="image-wrap">
            {hasImage ? (
              <img
                src={coordinator.image}
                alt={`${coordinator.name} portrait`}
                className="portrait"
                loading="lazy"
                onError={onImageError}
                onLoad={onImageLoad}
              />
            ) : (
              <div className="portrait-fallback">
                <span className="portrait-initials">{coordinator.initials}</span>
              </div>
            )}
          </div>

          <div className="card-body">
            <h3 className="coordinator-name">{coordinator.name}</h3>
            <p className="coordinator-role">{coordinator.designation}</p>
            {coordinator.department && <p className="coordinator-department">{coordinator.department}</p>}
            {coordinator.expertise && coordinator.expertise.length > 0 && (
              <div className="expertise-tags">
                {coordinator.expertise.slice(0, 3).map((s, i) => <span key={i} className="expertise-tag">{s}</span>)}
              </div>
            )}
          </div>

          <div className="card-bottom">
            <div className="glow" />
            {coordinator.socialLinks && coordinator.socialLinks.length > 0 ? (
              <div className="social-links">
                {coordinator.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${coordinator.name} ${link.platform}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="social-icon"><SocialIcon platform={link.platform} /></div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="social-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>

          <div className="hover-indicator" />
          <div className="card-shine" />
        </div>
      </div>
    </article>
  );
});
CoordinatorCard.displayName = 'CoordinatorCard';

const FacultyCoordinators: React.FC<{ data?: Coordinator[] }> = ({ data }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [erroredImages, setErroredImages] = useState<Set<number>>(new Set());
  const [filter, _setFilter] = useState<string>('all');

  // fallback sample data if no data prop passed
  const sample = useMemo<Coordinator[]>(() => ([
    {
      id: 1, name: 'Akshay Kumar', designation: 'Founder & CEO', initials: 'AK',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
      department: 'Leadership', expertise: ['Strategy', 'Vision', 'Innovation'], email: 'akshay@company.com',
      bio: 'Visionary leader...', socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/in/akshay' }, { platform: 'github', url: 'https://github.com/akshay' }]
    },
    {
      id: 2, name: 'Tanishq Sharma', designation: 'Lead Developer', initials: 'TS',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop',
      department: 'Engineering', expertise: ['React', 'Node.js', 'Cloud'], email: 'tanishq@company.com',
      bio: 'Full-stack developer...', socialLinks: [{ platform: 'github', url: 'https://github.com/tanishq' }, { platform: 'twitter', url: 'https://twitter.com/tanishq' }]
    }
    // ... (short sample; component will accept real data)
  ]), []);

  const coordinators = data && data.length ? data : sample;

  // const departments = useMemo(() => {
  //   const deps = new Set(coordinators.map(c => c.department).filter(Boolean) as string[]);
  //   return ['all', ...Array.from(deps)];
  // }, [coordinators]);

  const filtered = useMemo(() => (filter === 'all' ? coordinators : coordinators.filter(c => c.department === filter)), [coordinators, filter]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    (e.currentTarget as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
    (e.currentTarget as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const handleImageError = useCallback((id: number) => {
    setErroredImages(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleImageLoad = useCallback((id: number) => {
    setErroredImages(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <section className="faculty-section" aria-label="Faculty coordinators">
      <div className="animated-bg" aria-hidden>
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="grid-pattern" />
      </div>

      <div className="container">
        <header className="section-header">
          <div className="header-line" />
          <div className="section-label">TEAM</div>
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">Talented individuals who make innovation possible</p>

          <div className="filter-tabs" role="tablist" aria-label="Filter by department">
            {/* {departments.map((d) => (
              <button
                key={d}
                className="filter-tab"
                onClick={() => setFilter(d)}
                aria-pressed={filter === d}
              >
                {d === 'all' ? 'All' : d}
              </button>
            ))} */}
          </div>
        </header>

        <div className="coordinators-grid cards-layout" role="list">
          {filtered.map((c, i) => (
            <CoordinatorCard
              key={c.id}
              coordinator={c}
              index={i}
              isHovered={hoveredCard === c.id}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredCard(c.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onImageError={() => handleImageError(c.id)}
              onImageLoad={() => handleImageLoad(c.id)}
              hasImageError={erroredImages.has(c.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultyCoordinators;
