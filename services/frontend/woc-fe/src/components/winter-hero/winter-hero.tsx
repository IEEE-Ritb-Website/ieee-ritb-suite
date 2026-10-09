"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  opacity: number;
  twinkleSpeed: number;
};

const STATS = [
  { value: "08", label: "Weeks of coding" },
  { value: "04", label: "Program phases" },
  { value: "08", label: "Project tracks" },
];

function SnowflakeMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M16 3v26" />
        <path d="M4.7 9.5l22.6 13" />
        <path d="M27.3 9.5L4.7 22.5" />
        <path d="M16 3l-3.2 3.4M16 3l3.2 3.4" />
        <path d="M16 29l-3.2-3.4M16 29l3.2-3.4" />
        <path d="M4.7 9.5l4.4.6M4.7 9.5l1.3 4.3" />
        <path d="M27.3 22.5l-4.4-.6M27.3 22.5l-1.3-4.3" />
        <path d="M27.3 9.5l-4.4.6M27.3 9.5l-1.3 4.3" />
        <path d="M4.7 22.5l4.4-.6M4.7 22.5l1.3-4.3" />
      </g>
      <circle cx="16" cy="16" r="2.6" fill="currentColor" />
    </svg>
  );
}

/**
 * RIT Winter of Code hero — full-screen falling snow behind the
 * glowing "Winter of Code" headline. Self-contained: no other
 * frontend files are required to render it.
 */
export function WinterHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = (): Flake[] => {
      const count = Math.min(130, Math.floor((width * height) / 14000));
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 2.4,
        speed: 0.25 + Math.random() * 0.9,
        drift: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.35 + Math.random() * 0.55,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
      }));
    };

    let flakes: Flake[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = seed();
    };

    const draw = (tick: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const flake of flakes) {
        const twinkle =
          0.65 + 0.35 * Math.sin(tick * flake.twinkleSpeed + flake.phase);
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 232, 255, ${(flake.opacity * twinkle).toFixed(3)})`;
        ctx.shadowColor = "rgba(143, 203, 255, 0.8)";
        ctx.shadowBlur = flake.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const step = (tick: number) => {
      for (const flake of flakes) {
        flake.y += flake.speed;
        flake.phase += 0.008;
        flake.x += Math.sin(flake.phase) * flake.drift * 0.4;
        if (flake.y > height + 6) {
          flake.y = -6;
          flake.x = Math.random() * width;
        }
        if (flake.x > width + 6) flake.x = -6;
        if (flake.x < -6) flake.x = width + 6;
      }
      draw(tick);
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Falling snow */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30"
      />

      {/* Aurora wash */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_50%_-8%,rgba(46,127,217,0.32),transparent_65%)]" />
        <div className="absolute inset-0 animate-aurora bg-[radial-gradient(760px_420px_at_18%_12%,rgba(90,169,245,0.2),transparent_60%),radial-gradient(680px_400px_at_84%_20%,rgba(153,138,255,0.12),transparent_60%)]" />
        {/* Moon */}
        <div className="absolute right-[10%] top-24 hidden h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff,#c9dcf5_60%,#8fa9c9_100%)] opacity-90 shadow-[0_0_60px_20px_rgba(143,203,255,0.25)] sm:block" />
        <div className="absolute right-[10%] top-24 hidden h-28 w-28 animate-twinkle rounded-full bg-glacier-200/20 blur-2xl sm:block" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-10 pt-24 text-center sm:px-8">
        <p
          className="inline-flex animate-rise items-center gap-3 self-center rounded-full border border-white/12 bg-white/5 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.32em] text-glacier-200 backdrop-blur"
          style={{ animationDelay: "80ms" }}
        >
          <SnowflakeMark className="h-4 w-4 animate-twinkle" />
          IEEE RIT Bangalore presents
        </p>

        <h1
          className="mx-auto mt-8 max-w-4xl animate-rise font-display text-6xl font-semibold leading-[0.95] tracking-tight sm:text-8xl"
          style={{ animationDelay: "220ms" }}
        >
          <span className="text-frost text-ice-glow">Winter</span>
          <br />
          <span className="font-light italic text-silver-200">of Code</span>
        </h1>

        <p
          className="mx-auto mt-7 max-w-2xl animate-rise text-base leading-8 text-silver-300 sm:text-lg"
          style={{ animationDelay: "360ms" }}
        >
          RIT&apos;s flagship winter open-source program. Eight weeks, real
          problem statements from real organisations, dedicated mentors — and
          a showcase worthy of the season.
        </p>

        <div
          className="mt-10 flex animate-rise flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "500ms" }}
        >
          <a
            href="/projects"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-glacier-300 to-glacier-500 px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-night-950 shadow-[0_8px_40px_-6px_rgba(90,169,245,0.7)] transition-all hover:shadow-[0_8px_54px_-4px_rgba(90,169,245,0.9)] sm:w-auto"
          >
            Explore projects
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="/organizations"
            className="inline-flex w-full items-center justify-center rounded-full border border-silver-400/40 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-silver-100 transition-all hover:border-glacier-300 hover:text-white sm:w-auto"
          >
            Become a mentor
          </a>
        </div>

        <dl
          className="mx-auto mt-14 grid w-full max-w-2xl animate-rise grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur"
          style={{ animationDelay: "640ms" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="px-2 py-5">
              <dt className="order-2 mt-1 block font-mono text-[10px] uppercase tracking-[0.24em] text-silver-400">
                {stat.label}
              </dt>
              <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Mountain ridgeline */}
      <div aria-hidden="true" className="relative z-10 -mb-px mt-auto">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="block h-[110px] w-full sm:h-[150px]">
          <path
            d="M0 150V96l120-44 90 30 150-68 110 52 130-40 120 44 140-58 130 46 150-34 120 40 170-38V150H0z"
            fill="#0a1428"
          />
          <path
            d="M270 82l-24-8 24-60 30 52-16 4 16 12h-30zM860 74l-22-8 22-52 28 46-15 4 15 10h-28zM1190 64l-20-7 20-47 25 42-13 3 13 9h-25z"
            fill="#d6deea"
            opacity="0.9"
          />
          <path
            d="M0 150V120l180-34 160 26 200-40 180 30 200-34 190 28 180-22 150 22v54H0z"
            fill="#060d1a"
          />
        </svg>
      </div>
    </section>
  );
}
