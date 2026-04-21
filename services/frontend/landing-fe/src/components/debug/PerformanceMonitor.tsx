import { usePerformance } from '@/contexts/PerformanceContext';
import { m, AnimatePresence } from 'framer-motion';

export default function PerformanceMonitor() {
  const { fps, tier } = usePerformance();

  const getStatusColor = () => {
    if (tier === 'ULTRA') return '#10b981'; // Emerald
    if (tier === 'BALANCED') return '#f59e0b'; // Amber
    if (tier === 'PERFORMANCE') return '#f43f5e'; // Rose
    return '#9f1239'; // Crimson for LOW
  };

  return (
    <div 
      className="fixed bottom-6 left-6 z-[999] pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="flex flex-col items-start gap-1">
        <div className="bg-[#05060f]/80 backdrop-blur-xl border border-[#4d7fff]/30 rounded-full px-4 py-1.5 flex items-center justify-center gap-3 min-w-[100px] shadow-[0_0_15px_rgba(77,127,255,0.1)] transition-colors duration-300 hover:border-[#4d7fff]/50 hover:shadow-[0_0_20px_rgba(77,127,255,0.2)]">
          <div 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ 
              backgroundColor: getStatusColor(), 
              boxShadow: `0 0 8px ${getStatusColor()}` 
            }} 
          />
          <span className="font-mono text-xs tracking-widest text-[#4d7fff] uppercase font-bold">
            {fps} FPS
          </span>
        </div>
        
        <AnimatePresence>
          {tier !== 'ULTRA' && (
            <m.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="px-2"
            >
              <span className="font-mono text-[9px] tracking-tight text-white/20 uppercase">
                {tier} MODE
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}