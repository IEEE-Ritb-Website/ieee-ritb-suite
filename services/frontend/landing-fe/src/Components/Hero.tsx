import React, { useState, useEffect, useRef } from "react";
import { Text } from "@/component/luxe/ui/text";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < 150; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 20 + 10,
      });
    }
    setStars(starArray);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMousePos({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[800px] overflow-hidden flex items-center justify-center bg-[#0a0a0f]"
    >
      {/* Stars */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s linear infinite`,
              transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            }}
          />
        ))}
      </div>

      {/* Background effects (spheres, noise, grid) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
            animation: 'float1 20s ease-in-out infinite',
          }}
        />

        <div
          className="absolute -bottom-[15%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
            transform: `translate(${-mousePos.x * 25}px, ${-mousePos.y * 25}px)`,
            animation: 'float2 25s ease-in-out infinite',
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
            transform: `translate(calc(-50% + ${mousePos.x * 35}px), calc(-50% + ${-mousePos.y * 35}px))`,
            animation: 'float3 30s ease-in-out infinite',
          }}
        />

        <div
          className="absolute -inset-[50%] bg-[length:100px_100px]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            animation: 'gridRotate 60s linear infinite',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(120,119,198,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,119,198,0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 50px 50px',
            animation: 'noiseMove 30s linear infinite',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-16">
        <div
          className={`relative rounded-[24px] p-[5rem] md:p-[4rem] sm:p-[3rem] bg-gradient-to-br from-white/5 to-white/2 border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden transform-style-preserve-3d transition-all duration-700 ease-[cubic-bezier(.23,1,.32,1)] ${
            isHovered ? 'hovered' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            perspective: '1000px',
            transform: `rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)`,
            boxShadow:
              '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1), 0 0 80px rgba(59,130,246,0.2)',
          }}
        >
          {/* Gradient border (absolute) */}
          <div
            className="absolute -inset-[2px] rounded-[25px] opacity-0 z-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
              backgroundSize: '400% 400%',
            }}
          />

          {/* reflection */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '-50%',
              left: '-25%',
              width: '150%',
              height: '150%',
              transform: 'rotate(45deg)',
              background:
                'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
            }}
          />

          {/* inner glow */}
          <div
            className={`absolute top-1/2 left-1/2 w-full h-full rounded-[24px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-600 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
            }}
          />

          <div className="relative text-center">
            <Text variant="generate-effect" className="text-[6rem] font-black tracking-[0.05em] mb-6 leading-[1]" style={{ textShadow: '0 0 12px rgba(255,255,255,0.08)' }}>
              IEEE-RITB
            </Text>

            <div className="flex items-center gap-4 justify-center text-white/80 text-sm">
              <span>Institute of Electrical and Electronics Engineers</span>
              <span className="text-[#3b82f6]/60">•</span>
              <span>RIT Bangalore Chapter</span>
            </div>
          </div>

          {/* particles */}
          <div className="absolute top-[20%] left-[10%] w-[4px] h-[4px] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-white animate-particle1" />
          <div className="absolute top-[80%] right-[10%] w-[4px] h-[4px] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-white animate-particle2" />
          <div className="absolute bottom-[20%] left-[15%] w-[4px] h-[4px] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-white animate-particle3" />
          <div className="absolute top-[15%] right-[20%] w-[4px] h-[4px] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-white animate-particle4" />
        </div>

        {/* meta */}
        <div className="absolute bottom-[-80px] flex gap-12 opacity-60 md:relative md:bottom-0 md:mt-6">
          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-widest text-white/60">Innovate</span>
            <div className="w-10 h-[1px] bg-gradient-to-r from-[#3b82f6]/50 to-transparent" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-widest text-white/60">Connect</span>
            <div className="w-10 h-[1px] bg-gradient-to-r from-[#3b82f6]/50 to-transparent" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-widest text-white/60">Inspire</span>
            <div className="w-10 h-[1px] bg-gradient-to-r from-[#3b82f6]/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 animate-scrollBounce">
        <div className="w-6 h-9 rounded-[12px] border-2 border-white/30 relative">
          <div className="w-1 h-2 rounded-sm bg-white/50 absolute top-2 left-1/2 -translate-x-1/2 animate-scrollWheel" />
        </div>
        <span className="text-xs text-white/40 uppercase tracking-wider">Explore</span>
      </div>

      {/* small custom CSS for animations not available as utility classes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes noiseMove {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-20px, -20px); }
        }
        @keyframes gridRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.1); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px, 40px) scale(0.9); }
        }
        @keyframes float3 {
          0%,100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-48%, -52%) scale(1.05); }
        }
        @keyframes gridRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes particleFloat1 { 0%,100%{ transform: translate(0,0)} 50%{ transform: translate(30px,-40px)} }
        @keyframes particleFloat2 { 0%,100%{ transform: translate(0,0)} 50%{ transform: translate(-40px,-30px)} }
        @keyframes particleFloat3 { 0%,100%{ transform: translate(0,0)} 50%{ transform: translate(50px,20px)} }
        @keyframes particleFloat4 { 0%,100%{ transform: translate(0,0)} 50%{ transform: translate(-30px,40px)} }
        .animate-particle1 { animation: particleFloat1 8s ease-in-out infinite; }
        .animate-particle2 { animation: particleFloat2 10s ease-in-out infinite; }
        .animate-particle3 { animation: particleFloat3 12s ease-in-out infinite; }
        .animate-particle4 { animation: particleFloat4 9s ease-in-out infinite; }
        .animate-scrollBounce { animation: scrollBounce 2s ease-in-out infinite; }
        @keyframes scrollBounce { 0%,100%{ transform: translateX(-50%) translateY(0)} 50%{ transform: translateX(-50%) translateY(10px)} }
        .animate-scrollWheel { animation: scrollWheel 2s ease-in-out infinite; }
        @keyframes scrollWheel { 0%,100%{ opacity:1; transform: translateX(-50%) translateY(0)} 50%{ opacity:0.3; transform: translateX(-50%) translateY(8px)} }
         100%{ text-shadow: 0 0 60px rgba(59,130,246,0.7), 0 0 120px rgba(59,130,246,0.4)} }
      `}</style>
    </section>
  );
};

export default HeroSection;
