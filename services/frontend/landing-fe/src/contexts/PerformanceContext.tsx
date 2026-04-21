import { createContext, useContext, type ReactNode } from 'react';
import { usePerformanceMonitor, type PerformanceTier } from '../hooks/usePerformanceMonitor';

interface PerformanceContextState {
  tier: PerformanceTier;
  fps: number;
}

const PerformanceContext = createContext<PerformanceContextState | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { tier, fps } = usePerformanceMonitor(true);

  return (
    <PerformanceContext.Provider value={{ tier, fps }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}
