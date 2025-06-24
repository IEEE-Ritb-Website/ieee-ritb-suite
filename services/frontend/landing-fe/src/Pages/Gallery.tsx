import React from "react";
import Particles from "../Components/Particles";
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: "/gallery/img1.jpg", alt: "Event 1" },
  { id: 2, src: "/gallery/img2.jpg", alt: "Event 2" },
  { id: 3, src: "/gallery/img3.jpg", alt: "Event 3" },
  { id: 4, src: "/gallery/img4.jpg", alt: "Event 4" },
  { id: 5, src: "/gallery/img5.jpg", alt: "Event 5" },
  { id: 6, src: "/gallery/img6.jpg", alt: "Event 6" },
];

const Gallery: React.FC = () => {
  return (
    <>
        <div className="min-h-screen bg-[#05060f] text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {galleryImages.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-lg shadow-lg group">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="p-2 text-center text-sm text-gray-400">{image.alt}</div>
          </div>
        ))}
      </div>
    </div>
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" /> */}
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={100}
        color="#ffffff"
        size={0.05}
        refresh
      />
    
    </>

    
  );
};

export default Gallery;
