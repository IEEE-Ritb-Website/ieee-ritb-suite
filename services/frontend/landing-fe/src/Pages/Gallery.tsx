import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import "./Gallery.css";
import bckimg from "../assets/bckimg.jpg";

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  category: string;
}

const images: GalleryImage[] = [
  {
    src: bckimg,
    title: "IEEE Workshop 2024",
    description: "Annual technical workshop on emerging technologies",
    category: "Events",
  },
  {
    src: bckimg,
    title: "Student Project Showcase",
    description: "Outstanding projects by IEEE student members",
    category: "Projects",
  },
  {
    src: bckimg,
    title: "Hackathon Winners",
    description: "IEEE student branch hackathon championship",
    category: "Events",
  },
  {
    src: bckimg,
    title: "Robotics Competition",
    description: "Inter-college robotics competition hosted by IEEE",
    category: "Competitions",
  },
  {
    src: bckimg,
    title: "Circuit Design Project",
    description: "Advanced circuit design by final year students",
    category: "Projects",
  },
  {
    src: bckimg,
    title: "IEEE Executive Meeting",
    description: "Monthly executive committee meeting",
    category: "Meetings",
  },
];

const categories = ["All", "Events", "Projects", "Competitions", "Meetings"];

// Enhanced Gallery Card Component
// Enhanced Gallery Card Component with Conic Sparkle Effect
const AnimatedCard: React.FC<{
  img: GalleryImage;
  index: number;
  onView: () => void;
  onShare: () => void;
}> = ({ img, index, onView }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useMotionTemplate`
    radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 80%)
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="luxe-card-container group"
      onMouseMove={handleMouseMove}
    >
      {/* Radial Glow Layer */}
      <motion.div
        style={{ background }}
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
      />

      {/* Conic Sparkle Mask */}
      <span className="sparkle-container">
        <span className="sparkle-mask" />
      </span>

      {/* Frosted Glass Background */}
      <span className="frosted-background" />

      {/* Content */}
      <div className="luxe-card-content">
        {/* Image Section */}
        <div className="luxe-image-wrapper">
          <motion.div
            whileHover={{ scale: 1.15 }} // Zooms in image on hover
            style={{ display: "inline-block" }}
          >
            <motion.img
              src={img.src}
              alt={img.title}
              className="luxe-card-image"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
            />
          </motion.div>
          {/* Hover Overlay */}
          <div className="luxe-card-overlay">
            <div className="luxe-card-actions">
              <button className="luxe-action-btn" onClick={onView}>
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          className="luxe-card-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
        >
          <div className="luxe-card-category">{img.category}</div>
          <h3 className="luxe-card-title">{img.title}</h3>
          <p className="luxe-card-description">{img.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredImages, setFilteredImages] = useState(images);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(
        images.filter((img) => img.category === selectedCategory),
      );
    }
  }, [selectedCategory]);

  const openLightbox = (image: GalleryImage) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const handleShare = (image: GalleryImage) => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${image.title}: ${window.location.href}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="gallery-section">
      {/* Page Title */}
      <motion.div
        className="gallery-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="gallery-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          IEEE Gallery
        </motion.h1>
        <motion.p
          className="gallery-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Showcasing Technical Excellence & Innovation
        </motion.p>
      </motion.div>

      {/* Filter Options */}
      <motion.div
        className="gallery-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.8 + index * 0.1,
              ease: "backOut",
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        className="gallery-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {filteredImages.map((img, index) => (
          <AnimatedCard
            key={`${img.title}-${index}`}
            img={img}
            index={index}
            onView={() => openLightbox(img)}
            onShare={() => handleShare(img)}
          />
        ))}
      </motion.div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>

            <div className="lightbox-image-container">
              <img src={lightboxImage.src} alt={lightboxImage.title} />
            </div>

            <div className="lightbox-info">
              <div className="lightbox-category">{lightboxImage.category}</div>
              <h3 className="lightbox-title">{lightboxImage.title}</h3>
              <p className="lightbox-description">
                {lightboxImage.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
