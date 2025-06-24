import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    title: 'Tech Talk 2025',
    description: 'An inspiring session with industry experts on AI and ML.',
    date: 'May 10, 2025',
  },
  {
    title: 'Code Fiesta',
    description: 'A 24-hour hackathon for student developers.',
    date: 'June 2, 2025',
  },
  {
    title: 'IoT Expo',
    description: 'Showcase of innovative IoT projects by students.',
    date: 'July 12, 2025',
  },
  {
    title: 'Cybersecurity Seminar',
    description: 'Awareness and hands-on demo on secure coding.',
    date: 'August 5, 2025',
  },
    {
    title: 'Tech Talk 2025',
    description: 'An inspiring session with industry experts on AI and ML.',
    date: 'May 10, 2025',
  },
  {
    title: 'Code Fiesta',
    description: 'A 24-hour hackathon for student developers.',
    date: 'June 2, 2025',
  },
  {
    title: 'IoT Expo',
    description: 'Showcase of innovative IoT projects by students.',
    date: 'July 12, 2025',
  },
  {
    title: 'Cybersecurity Seminar',
    description: 'Awareness and hands-on demo on secure coding.',
    date: 'August 5, 2025',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      type: 'spring',
    },
  }),
};

const Events: React.FC = () => {
  return (
    <section id="events" className="min-h-screen py-16 px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Events</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-4 shadow-lg text-white hover:scale-[1.02] transition-transform duration-300"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-white/80 mb-4">{event.description}</p>
              <span className="text-xs font-medium text-[#00A3FF]">{event.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
