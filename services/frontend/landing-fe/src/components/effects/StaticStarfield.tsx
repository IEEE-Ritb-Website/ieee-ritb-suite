

/**
 * Static starfield fallback component
 * Used when prefers-reduced-motion is enabled or WebGL is unsupported
 * Provides a beautiful static alternative without animations
 */

export default function StaticStarfield() {


  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      {/* Static nebula glares - no animation */}
      <div
        className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/3 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Static CSS stars - lightweight, no JavaScript */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
      </div>

      {/* Text overlay - immediately visible */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white tracking-wider opacity-100"
          style={{
            textShadow:
              '0 0 12px rgba(255, 255, 255, 0.8), 0 0 40px rgba(147, 197, 253, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 900,
          }}
        >
          IEEE RIT-B
        </h1>
      </div>

      <style>{`
        .stars-layer-1,
        .stars-layer-2,
        .stars-layer-3 {
          position: absolute;
          width: 100%;
          height: 100%;
          background-repeat: repeat;
        }

        .stars-layer-1 {
          background-image: radial-gradient(
            1px 1px at 20px 30px,
            white,
            transparent
          ),
          radial-gradient(1px 1px at 60px 70px, white, transparent),
          radial-gradient(1px 1px at 120px 140px, white, transparent),
          radial-gradient(1px 1px at 180px 60px, white, transparent),
          radial-gradient(1px 1px at 240px 120px, white, transparent),
          radial-gradient(1px 1px at 300px 80px, white, transparent);
          background-size: 320px 180px;
          opacity: 0.7;
        }

        .stars-layer-2 {
          background-image: radial-gradient(
            1.5px 1.5px at 80px 100px,
            rgba(200, 220, 255, 0.8),
            transparent
          ),
          radial-gradient(
            1.5px 1.5px at 140px 40px,
            rgba(200, 220, 255, 0.8),
            transparent
          ),
          radial-gradient(
            1.5px 1.5px at 200px 160px,
            rgba(200, 220, 255, 0.8),
            transparent
          ),
          radial-gradient(
            1.5px 1.5px at 260px 90px,
            rgba(200, 220, 255, 0.8),
            transparent
          );
          background-size: 320px 180px;
          opacity: 0.5;
        }

        .stars-layer-3 {
          background-image: radial-gradient(
            2px 2px at 40px 50px,
            rgba(147, 197, 253, 0.9),
            transparent
          ),
          radial-gradient(
            2px 2px at 100px 150px,
            rgba(147, 197, 253, 0.9),
            transparent
          ),
          radial-gradient(
            2px 2px at 160px 20px,
            rgba(147, 197, 253, 0.9),
            transparent
          ),
          radial-gradient(
            2px 2px at 220px 130px,
            rgba(147, 197, 253, 0.9),
            transparent
          ),
          radial-gradient(
            2px 2px at 280px 70px,
            rgba(147, 197, 253, 0.9),
            transparent
          );
          background-size: 320px 180px;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
