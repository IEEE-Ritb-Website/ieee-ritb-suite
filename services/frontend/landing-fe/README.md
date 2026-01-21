# 🌌 IEEE RIT-B | The Digital Universe
**A High-Performance "System Interface" for the Next Generation of Engineers.**

[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Motion](https://img.shields.io/badge/Framer_Motion-12.0-ff69b4?style=flat-square&logo=framer)](https://www.framer.com/motion/)

---

## 🧭 The Vision
The **IEEE RIT-B Landing Page** is more than a website; it is an immersive, atmospheric dashboard designed to bridge the gap between technical complexity and iconic minimalism. This interface utilizes high-end physics, custom shaders, and meticulous UX orchestration to provide a premium experience for the IEEE Ramaiah Institute of Technology community.

### 🎨 Design Philosophy: *Iconic Minimalism*
- **Tactile Reality:** Utilizing digital "grit" and geometric structures to make the web feel physical.
- **Micro-Interactions:** Every scroll and hover rewards the user with kinetic feedback.
- **Quantum Glass:** A signature material language combining blur, saturation, and subtle technical grids.

---

## 📱 Pages & Routing

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Main landing page with hero, chapters, events, and contact sections |
| `/chapters/:chapterId` | **Chapter Details** | Dynamic chapter pages with data orbs, about section, and contact info |
| `/events/:eventId` | **Event Details** | Event showcase with timeline, registration, and detailed info |
| `*` | **404 Not Found** | Cyber-glitch aesthetic error page with terminal UI |

### 🔀 Smart Navigation System
- **Context-Aware Links:** Navigation items dynamically adjust based on current route
- **Smooth Anchors:** Internal page sections use hash-based anchors with smooth scrolling
- **Back Links:** Detail pages include prominent "Back to Home" navigation

---

## ✨ Special Effects & Components

### 🌟 GlitchText
Matrix-style text scrambling effect with progressive character lock-in.
- Character cycling with `GLITCH_CHARS` set
- Lock-in animation with pulse effect
- Two styles: `loading` (small) and `hero` (massive)
- Used on 404 page for dramatic "404" display

### 💫 GlowText  
Proximity-based glow effect that reacts to mouse movement.
- Tracks cursor position relative to text words
- Applies chapter-colored glow based on distance
- Smooth transitions with throttled updates

### 🎯 MagneticCursor
Custom cursor with magnetic hover effects.
- Lerp-smoothed movement for fluid tracking
- Auto-detects hoverable elements (links, buttons, `.magnetic` class)
- Scales and adapts on interactive element hover

### ⭐ HeroStarfield
WebGL-powered infinite starfield with warp animation.
- Adaptive particle counts based on performance tier
- Shooting stars with randomized trajectories
- Warp/hyperspace entrance animation
- Phase-based animation states (`warp`, `slowing`, `idle`)

### 🎭 TerminalText
Typewriter-style text reveal for terminal aesthetics.
- Character-by-character reveal
- Blinking cursor effect
- Configurable speed and delays

---

## 🚀 Architectural UX Orchestration

| Feature | System Name | UX Heuristic | Description |
| :--- | :--- | :--- | :--- |
| **Performance** | **Adaptive Engine** | **Efficiency** | Real-time FPS monitoring that scales graphics to maintain 60FPS |
| **Motion Control** | **A11y Engine** | **Inclusion** | OS-level reduced motion detection with automatic animation flattening |
| **Scroll Feedback** | **Scroll Horizon** | **System Status** | Integrated glowing progress bar in the sticky navigation |
| **Entrance Flow** | **Staggered Orchestration** | **Cognitive Load** | Unified rhythmic reveal of sections to guide user focus |
| **Form Logic** | **Reactive Ignition** | **User Control** | Kinetic button feedback that "ignites" only when inputs are valid |
| **Navigation** | **Smart Session** | **Instant Loading** | Animation state tracking for instant page transitions |

---

## ⚡ Smart Loading System

The landing page features an intelligent loading orchestration:

### First Visit Experience
1. **EnhancedLoader** - Multi-stage loading sequence with progress indicators
2. **Hyperspace Warp** - Dramatic starfield acceleration animation
3. **Content Reveal** - Staggered section fade-in

### Internal Navigation (After First Visit)
- **Instant Loading:** Uses `sessionStorage` to track animation state
- **Zero Delay:** Pages appear immediately when navigating via links
- **Reload Detection:** Performance API detects page refresh to replay animation

```
First Visit     → Full loader + warp animation
Page Refresh    → Full loader + warp animation  
Internal Links  → Instant content (no animation)
```

---

## 🛠 Tech Stack & Engineering

### **Core Frameworks**
- **React 19:** Utilizing the latest concurrent rendering features for ultra-stable performance.
- **React Router 7:** Client-side routing with persistent layouts and animated transitions.
- **Three.js & R3F:** Driving the starfield and particle systems with hardware-accelerated WebGL.
- **Framer Motion:** Powering the synchronized layout animations and section staggers.
- **Lenis:** Silky smooth scrolling with velocity-based parallax.

### **⚡ Adaptive Performance Orchestration**
To ensure a smooth experience across all hardware, the system includes a real-time **Performance Monitor** (`usePerformanceMonitor`):
- **Dynamic Tiering:** Automatically switches between `ULTRA`, `BALANCED`, and `PERFORMANCE` modes based on real-time FPS.
- **Graphic Scaling:** Dynamically adjusts WebGL particle counts, shooting star frequency, and CSS blur intensity.
- **Diagnostic Telemetry:** A subtle FPS counter in the bottom-left provides live system health data.

### **The "Living" Background**
The background environment isn't static. It features:
- **Infinite Starfield:** Adaptive particle counts that scale based on device hardware and current FPS tier.
- **Shooting Stars:** Randomized atmospheric events, throttled or disabled in performance-critical states.
- **Parallax Layers:** Multi-depth background shapes that react to scroll velocity.

---

## 🎨 Page Features

### Chapter Detail Pages
- **Hero Section:** Chapter icon with orbital ring animation
- **Data Orbs:** Constellation-connected stat displays (Est. year, Members, Status)
- **GlowText:** Mouse-reactive glowing description text
- **Contact Section:** Team member cards with role badges
- **Back Navigation:** Prominent "Back to Home" link

### Event Detail Pages
- **Hero Banner:** Event branding with date/location chips
- **Timeline:** Visual progression of event phases
- **Registration:** Embedded form or external link CTA
- **Organizer Cards:** Contact information for event team

### 404 Page
- **GlitchText Effect:** Matrix-style scrambling "404"
- **Terminal UI:** Fake error log with styled prompts
- **Glass Design:** Premium backdrop blur aesthetics
- **Responsive:** Stacked buttons on mobile

---

## ♿ Accessibility Commitment
We believe premium design must be inclusive. Our **Accessibility Engine** ensures that 100% of users can browse comfortably:

- **Automatic Sanitization:** Our `useMotion` hook detects `prefers-reduced-motion` and strips away high-frequency translations (x, y, scale) in real-time.
- **Theatrical Bypass:** The 1.5s Hyperspace Warp and theatrical loaders are automatically skipped for users with vestibular sensitivities.
- **High-Contrast Readiness:** All glass panels maintain WCAG 2.1 AA contrast ratios for legibility.
- **Skip Links:** Hidden skip navigation links for keyboard users.

---

## 🏗 Setup & Development

### **Prerequisites**
- [pnpm](https://pnpm.io/) (v10+)
- [Node.js](https://nodejs.org/) (v20+)

### **Local Ignition**
```bash
# Install dependencies (root level)
pnpm install

# Navigate to service
cd services/frontend/landing-fe

# Start Development Server
pnpm dev

# Production Build
pnpm build

# Preview Production Build
pnpm preview
```

---

## 📁 Project Structure

```
public/
├── robots.txt                       # SEO crawl instructions
├── sitemap.xml                      # Site structure for indexers
│
src/
├── main.tsx                         # React entry point
├── router.tsx                       # Router configuration & data loaders
├── index.css                        # Global styles & CSS variables
│
├── components/
│   ├── common/
│   │   ├── EnhancedLoader.tsx       # Multi-stage loading sequence
│   │   ├── ErrorBoundary.tsx        # React error boundary
│   │   ├── loading.tsx              # Loader exports
│   │   └── SEO.tsx                  # Meta tags & Open Graph
│   │
│   ├── debug/
│   │   └── PerformanceMonitor.tsx   # FPS counter & tier display
│   │
│   ├── effects/
│   │   ├── GlitchText.tsx           # Matrix-style text scramble
│   │   ├── GlitchText.css
│   │   ├── GlowText.tsx             # Mouse-proximity glow effect
│   │   ├── GlowText.css
│   │   ├── GradientOrb.css          # Animated orb styles
│   │   ├── HeroStarfield.tsx        # WebGL starfield with warp
│   │   ├── HeroStarfield.css
│   │   ├── MagneticCursor.tsx       # Custom cursor with hover effects
│   │   ├── MagneticCursor.css
│   │   ├── ParallaxLayer.tsx        # Scroll-reactive parallax
│   │   ├── ParallaxLayer.css
│   │   ├── QuantumParticles.css     # Particle system styles
│   │   ├── ShootingStars.tsx        # Randomized shooting stars
│   │   └── TerminalText.tsx         # Typewriter text reveal
│   │
│   ├── layout/
│   │   ├── Footer.tsx               # Site footer with links
│   │   ├── Footer.css
│   │   ├── Navigation.tsx           # Context-aware navbar
│   │   └── Navigation.css
│   │
│   ├── sections/
│   │   ├── About.tsx                # About IEEE section
│   │   ├── About.css
│   │   ├── Chapters.tsx             # Chapter cards grid
│   │   ├── Chapters.css
│   │   ├── Contact.tsx              # Contact terminal & form with EmailJS
│   │   ├── Contact.css
│   │   ├── Events.tsx               # Upcoming events showcase
│   │   ├── Events.css
│   │   ├── Features.tsx             # Feature highlights
│   │   ├── Features.css
│   │   ├── Hero.tsx                 # Main hero section
│   │   └── Hero.css
│   │
│   └── ui/
│       ├── BackToTop.tsx            # Scroll-to-top button
│       ├── BackToTop.css
│       ├── ChapterIcon.tsx          # SVG icons for chapters
│       ├── Toast.tsx                # Notification toasts
│       └── Toast.css
│
├── contexts/
│   └── ToastContext.tsx             # Toast notification provider
│
├── data/
│   └── mockData.ts                  # Static chapter/event data
│
├── hooks/
│   ├── useEntityData.ts             # Chapter/event data fetching
│   ├── useMotion.ts                 # Reduced motion detection
│   ├── usePerformanceMonitor.ts     # FPS tracking & tiering
│   ├── useToast.ts                  # Toast hook
│   └── useToastContext.ts           # Toast context consumer
│
├── layouts/
│   └── MainLayout.tsx               # Persistent shell with transitions
│
├── pages/
│   ├── Home.tsx                     # Main landing page
│   ├── ChapterDetails.tsx           # Dynamic chapter pages
│   ├── ChapterDetails.css
│   ├── EventDetails.tsx             # Dynamic event pages
│   ├── EventDetails.css
│   ├── NotFound.tsx                 # 404 error page
│   └── NotFound.css
│
├── styles/
│   ├── buttons.css                  # Button variants
│   ├── fonts.css                    # Font-face declarations
│   ├── sections.css                 # Section layout utilities
│   └── utilities.css                # Helper classes
│
└── utils/
    ├── deviceDetection.ts           # Mobile/device detection
    ├── smoothScroll.ts              # Lenis scroll initialization
    ├── throttle.ts                  # Throttle utility
    └── webglSupport.ts              # WebGL capability check
```

---

## 🗺 Monorepo Context
This application is a specialized service within the **IEEE RIT-B Suite**. It consumes shared logic and data from:
- `@astranova/catalogues`: For dynamic IEEE Chapter and Event registry data.
- `astralogger`: For high-fidelity telemetry and logging.

---

<div align="center">
  <p>Built with 💙 by the <b>IEEE RIT-B Technical Team</b></p>
  <p><i>Shaping the future of technology, one pixel at a time.</i></p>
</div>