import React from 'react';
import { motion } from 'framer-motion';

const SlidingHr: React.FC = () => {
  return (
    <div className="overflow-hidden w-full max-w-7xl mx-auto mb-1">
      <motion.hr
        className="h-1 rounded-lg bg-blue-400 border border-white/20 backdrop-blur-md"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  );
};

export default SlidingHr;
