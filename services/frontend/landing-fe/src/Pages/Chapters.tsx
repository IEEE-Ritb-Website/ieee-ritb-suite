import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Particles from "../Components/Particles";

import type { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export interface ChapterData {
  _id: string;
  chapterName: string;
  chapterChair: string;
  relatedPositions: string[];
  execoms: {
    _id: string;
    name: string;
    year: number;
    branch: string;
    usn: string;
    chapters: string[];
    position: string;
  }[]; // populated execoms
  overview: string;
  activities: string[];
  focusAreas: string[];
  founded: string;
  website: string;
  color: string;
  acronym: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// const cardVariants = {
//   hidden: { opacity: 0, y: 50, scale: 0.9 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { type: "spring", stiffness: 100, damping: 12 },
//   },
//   hover: {
//     y: -8,
//     scale: 1.02,
//     transition: { type: "spring", stiffness: 300, damping: 20 },
//   },
// };

const Chapters: React.FC = () => {
  const [chaptersData, setChaptersData] = useState<ChapterData[]>([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch("http://localhost:5000/ieee-ritb/chapters");
        const data = await res.json();
        setChaptersData(data);
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
      }
    };

    fetchChapters();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <Navbar />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-white rounded-full shadow-lg mb-6"></div> */}
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-4">
                IEEE Society Chapters
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Explore IEEE society chapters advancing technology and
                innovation across diverse engineering and computing disciplines.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {chaptersData.map((chapter) => (
                <motion.div
                  key={chapter._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                >
                  <Link to={`/chapters/${chapter._id}`}>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-6 text-white h-64 sm:h-56 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold mb-3 group-hover:scale-105 transition-transform duration-300">
                            IEEE {chapter.chapterName}
                          </h3>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed">
                          Chair: {chapter.chapterChair}
                        </p>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        initial={false}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <Particles
          className="absolute inset-0 -z-10"
          quantity={200}
          ease={100}
          color="#ffffff"
          size={0.05}
          refresh
        />
      </div>
      <Footer />
    </>
  );
};

export default Chapters;
