import React, { useState, useEffect } from "react";
import "./NewsSection.css";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
}

const NewsSection: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [_mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Next-Generation Biometric Security Systems",
      excerpt:
        "Advanced fingerprint and facial recognition technologies are setting new standards for enterprise security protocols.",
      date: "May 20, 2025",
      category: "Security",
      readTime: "5 min",
      author: "Sarah Chen",
    },
    {
      id: 2,
      title: "Machine Learning in Identity Verification",
      excerpt:
        "AI algorithms now detect sophisticated fraud attempts with unprecedented accuracy rates exceeding 99.8%.",
      date: "May 18, 2025",
      category: "AI",
      readTime: "3 min",
      author: "Marcus Rodriguez",
    },
    {
      id: 3,
      title: "Zero-Trust Architecture Implementation",
      excerpt:
        "Companies are adopting comprehensive zero-trust models to secure distributed workforces and cloud infrastructure.",
      date: "May 15, 2025",
      category: "Enterprise",
      readTime: "4 min",
      author: "Emily Watson",
    },
    {
      id: 4,
      title: "Quantum-Resistant Cryptography Standards",
      excerpt:
        "New encryption methods prepare organizations for the quantum computing era while maintaining current security levels.",
      date: "May 12, 2025",
      category: "Cryptography",
      readTime: "6 min",
      author: "Dr. Alan Kim",
    },
    {
      id: 5,
      title: "Mobile Authentication Revolution",
      excerpt:
        "Seamless multi-factor authentication on mobile devices enhances security without compromising user experience.",
      date: "May 10, 2025",
      category: "Mobile",
      readTime: "7 min",
      author: "Jessica Park",
    },
    {
      id: 6,
      title: "Regulatory Compliance in 2025",
      excerpt:
        "Updated global privacy regulations require new approaches to user data protection and authentication systems.",
      date: "May 8, 2025",
      category: "Compliance",
      readTime: "4 min",
      author: "Michael Torres",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      Security: "#1a1a2e",
      AI: "#16213e",
      Enterprise: "#0d1b2a",
      Cryptography: "#1b263b",
      Mobile: "#2d3748",
      Compliance: "#1a202c",
    };
    return colors[category as keyof typeof colors] || "#1a1a2e";
  };

  return (
    <section className="news-section ">
      <div className="news-container">
        <div className="section-header">
          <div className="header-content">
            <span className="section-label">Latest Updates</span>
            <h2 className="section-title">News & Insights</h2>
            <p className="section-description">
              Stay informed with cutting-edge developments in authentication and
              security technology
            </p>
          </div>
          <div className="header-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
          </div>
        </div>

        <div className="news-grid">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              className={`news-card ${hoveredItem === item.id ? "is-hovered" : ""}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={
                {
                  "--animation-delay": `${index * 0.15}s`,
                  "--category-bg": getCategoryColor(item.category),
                } as React.CSSProperties
              }
            >
              <div className="card-background"></div>
              <div className="card-border-effect"></div>

              <div className="card-header">
                <div className="category-info">
                  <span className="category-tag">{item.category}</span>
                  <div className="meta-data">
                    <span className="date">{item.date}</span>
                    <span className="separator">•</span>
                    <span className="read-time">{item.readTime}</span>
                  </div>
                </div>
                <div className="author-info">
                  <span className="author">{item.author}</span>
                </div>
              </div>

              <div className="card-body">
                <h3 className="article-title">{item.title}</h3>
                <p className="article-excerpt">{item.excerpt}</p>
              </div>

              <div className="card-footer">
                <button className="read-more">
                  <span className="btn-text">Continue Reading</span>
                  <div className="btn-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="hover-gradient"></div>
              <div className="card-reflection"></div>
            </article>
          ))}
        </div>
      </div>

      <div className="background-elements">
        <div className="noise-texture"></div>
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="geometric-pattern"></div>
      </div>
    </section>
  );
};

export default NewsSection;
