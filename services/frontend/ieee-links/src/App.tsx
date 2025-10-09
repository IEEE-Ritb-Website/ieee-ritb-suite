import { Instagram, ExternalLink } from "lucide-react";

function App() {
  const SocialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/ieeeritb",
      icon: Instagram,
      label: "@ieeeritb",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ieee-ritb/",
      icon: Instagram,
      label: "in/ieee-ritb",
    },
    {
      name: "Website",
      url: "https://ieee.ritb.in",
      icon: Instagram,
      label: "ieee.ritb.in",
    },
  ];

  // Generate random stars
  const stars = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div className="min-h-screen w-full relative bg-black flex items-center justify-center overflow-hidden">
      {/* Starry Night Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep space gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)",
          }}
        />

        {/* Animated stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: Math.random() * 0.5 + 0.5,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Nebula glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(59, 130, 246, 0.1), transparent 50%), radial-gradient(ellipse 50% 50% at 70% 60%, rgba(147, 197, 253, 0.08), transparent 50%)",
          }}
        />
      </div>
      {/* Azure Depths */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 100%, transparent 40%, #010133 100%)",
        }}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitFast {
          from { transform: rotate(0deg) translate(var(--radius, 60px)) translateX(-50%); }
          to { transform: rotate(360deg) translate(var(--radius, 60px)) translateX(-50%); }
        }
      `}</style>

      <div className="flex items-center flex-col justify-center max-w-2xl w-full z-10 px-6 py-12">
        <div className="relative group mb-8 w-48 h-48 flex items-center justify-center">
          {/* Black hole - pure black center */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at center, #000000 0%, #000000 20%, transparent 21%)",
          }} />

          {/* Photon sphere - bright white/blue ring */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at center, transparent 19%, rgba(255, 255, 255, 0.95) 20%, rgba(147, 197, 253, 0.9) 20.5%, rgba(59, 130, 246, 0.8) 21%, transparent 23%)",
            boxShadow: "0 0 25px rgba(147, 197, 253, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.4)",
          }} />

          {/* Accretion disk glow - blue gradient */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at center, transparent 21%, rgba(147, 197, 253, 0.4) 25%, rgba(59, 130, 246, 0.3) 35%, rgba(30, 64, 175, 0.2) 45%, transparent 55%)",
            filter: "blur(3px)",
          }} />

          {/* Rotating accretion disk - blue/white */}
          <div className="absolute inset-0" style={{
            animation: "rotate 25s linear infinite",
          }}>
            <div className="absolute inset-0 rounded-full" style={{
              background: "conic-gradient(from 0deg, transparent 0%, rgba(147, 197, 253, 0.6) 8%, transparent 15%, transparent 30%, rgba(59, 130, 246, 0.5) 38%, transparent 45%, transparent 60%, rgba(30, 64, 175, 0.4) 68%, transparent 75%, transparent 85%, rgba(191, 219, 254, 0.5) 93%, transparent 100%)",
              filter: "blur(4px)",
            }} />
          </div>

          {/* Counter-rotating disk layer - white/light blue */}
          <div className="absolute inset-0" style={{
            animation: "rotate 18s linear infinite reverse",
          }}>
            <div className="absolute inset-0 rounded-full" style={{
              background: "conic-gradient(from 90deg, transparent 0%, rgba(255, 255, 255, 0.4) 10%, transparent 20%, transparent 50%, rgba(147, 197, 253, 0.4) 60%, transparent 70%)",
              filter: "blur(5px)",
            }} />
          </div>

          {/* Fast orbiting particles - white/blue */}
          {Array.from({ length: 25 }, (_, i) => {
            const angle = (i / 25) * 360;
            const radius = 38 + (i % 4) * 6;
            const speed = 5 - (i % 4) * 0.8;
            const isWhite = radius < 45;
            return (
              <div
                key={`orbit-${i}`}
                className="absolute rounded-full"
                style={{
                  width: i % 3 === 0 ? "2px" : "1.5px",
                  height: i % 3 === 0 ? "2px" : "1.5px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0 0",
                  transform: `rotate(${angle}deg) translate(${radius}px) translateX(-50%)`,
                  animation: `orbitFast ${speed}s linear infinite`,
                  animationDelay: `${-i * 0.08}s`,
                  background: isWhite ? "rgba(255, 255, 255, 0.9)" : "rgba(147, 197, 253, 0.7)",
                  boxShadow: isWhite ? "0 0 4px rgba(255, 255, 255, 0.8)" : "0 0 3px rgba(147, 197, 253, 0.6)",
                  opacity: 0.8,
                }}
              />
            );
          })}

          {/* Gravitational lensing effect - blue tint */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at center, transparent 18%, rgba(147, 197, 253, 0.15) 19%, transparent 20%, transparent 55%, rgba(191, 219, 254, 0.08) 60%, transparent 70%)",
          }} />

          {/* Accretion disk particles - blue/white */}
          <div className="absolute inset-0" style={{
            animation: "rotate 10s linear infinite",
          }}>
            {Array.from({ length: 20 }, (_, i) => {
              const angle = (i / 20) * 360;
              const isWhite = i % 3 === 0;
              return (
                <div
                  key={`particle-${i}`}
                  className="absolute w-0.5 h-0.5 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    background: isWhite ? "rgba(255, 255, 255, 0.8)" : "rgba(147, 197, 253, 0.8)",
                    transform: `rotate(${angle}deg) translate(${55 + Math.random() * 20}px)`,
                    boxShadow: `0 0 3px ${isWhite ? "rgba(255, 255, 255, 0.8)" : "rgba(147, 197, 253, 0.8)"}`,
                  }}
                />
              );
            })}
          </div>

          {/* Logo in center */}
          <img
            src="https://res.cloudinary.com/ddrv7lqrg/image/upload/v1760040051/ieee-logo-square_lzpsoz.jpg"
            alt="IEEE Logo"
            className="w-46 h-46 rounded-full relative z-10"
            style={{
              border: "2px solid rgba(147, 197, 253, 0.4)",
              boxShadow: "0 0 30px rgba(147, 197, 253, 0.5), 0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)",
            }}
          />
        </div>

        {SocialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full"
          >
            <button
              className="relative w-full text-white font-medium py-4 px-6 rounded-xl flex items-center justify-between overflow-hidden group"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)";
              }}
            >
              {/* Subtle cursor glare */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.08), transparent 40%)",
                  transition: "opacity 0.3s ease",
                }}
              />

              {/* Left side: Icon and text */}
              <div className="flex items-center space-x-3 relative z-10">
                <social.icon className="w-5 h-5" />
                <span>{social.label}</span>
              </div>

              {/* Right side: External link icon */}
              <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity relative z-10" />
            </button>
          </a>
        ))}

        {/* Made with love footer */}
        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm font-light">
            Made with <span className="text-red-400 text-lg animate-pulse">♥</span> by IEEE RITB
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
