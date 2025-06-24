import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, BookOpen, Calendar, Globe } from "lucide-react";
import Particles from "../Components/Particles";

interface ChapterData {
  _id: string;
  chapterName: string;
  chapterChair: string;
  relatedPositions: string[];
  execoms: any[];
  founded?: string;
  website?: string;
  overview?: string;
  activities?: string[];
  focusAreas?: string[];
  color?: string;
  acronym?: string;
}

const Chapter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/ieee-ritb/chapters/${id}`,
        );
        const data = await res.json();
        console.log(data);
        setChapter(data);
      } catch (error) {
        console.error("Failed to fetch chapter:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchChapter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chapter Not Found</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
            Return to Chapters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapters
            </Link>

            <div
              className={`bg-gradient-to-br ${chapter.color || "from-gray-700 to-gray-900"} rounded-2xl p-8 mb-8 text-white`}
            >
              <div className="flex items-center mb-4">
                <div>
                  <div className="text-sm opacity-75 bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
                    {chapter.acronym || "CH"}
                  </div>
                  <h1 className="text-4xl font-bold">{chapter.chapterName}</h1>
                </div>
              </div>
              <p className="text-xl opacity-90 leading-relaxed">
                Chair: {chapter.chapterChair}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-semibold text-white">
                    Overview
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {chapter.overview || "No overview provided for this chapter."}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-sm text-gray-400">Founded</span>
                    </div>
                    <span className="text-white font-semibold">
                      {chapter.founded || "N/A"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Globe className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-sm text-gray-400">Website</span>
                    </div>
                    <a
                      href={`https://${chapter.website || "#"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      {chapter.website || "Not available"}
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-green-400 mr-3" />
                  <h2 className="text-2xl font-semibold text-white">
                    Activities
                  </h2>
                </div>
                <ul className="space-y-3">
                  {chapter.activities && chapter.activities.length > 0 ? (
                    chapter.activities.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-3 mt-1">•</span>
                        <span className="text-gray-300">{activity}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No activities listed.</li>
                  )}
                </ul>
              </motion.div>
            </div>

            <motion.div
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              whileHover={{ y: -5 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Focus Areas
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {chapter.focusAreas && chapter.focusAreas.length > 0 ? (
                  chapter.focusAreas.map((area, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-r ${chapter.color || "from-sky-600 to-blue-800"} rounded-lg p-4 text-center`}
                    >
                      <span className="text-white font-semibold">{area}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">No focus areas listed.</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Particles
        className="absolute inset-0 -z-10"
        quantity={200}
        ease={100}
        color="#ffffff"
        size={0.05}
        refresh
      />
    </>
  );
};

export default Chapter;
