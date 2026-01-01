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

## 🚀 Architectural UX Orchestration

| Feature | System Name | UX Heuristic | Description |
| :--- | :--- | :--- | :--- |
| **Performance** | **Adaptive Engine (1B)** | **Efficiency** | Real-time FPS monitoring that scales graphics to maintain 60FPS. |
| **Motion Control** | [A11y Engine (2C)](#-accessibility-commitment) | **Inclusion** | OS-level reduced motion detection with automatic animation flattening. |
| **Scroll Feedback** | **Scroll Horizon (1B)** | **System Status** | Integrated glowing progress bar in the sticky navigation link. |
| **Entrance Flow** | **Staggered Orchestration (1A)** | **Cognitive Load** | Unified rhythmic reveal of sections to guide user focus. |
| **Form Logic** | **Reactive Ignition (1C)** | **User Control** | Kinetic button feedback that "ignites" only when inputs are valid. |

---

## 🛠 Tech Stack & Engineering

### **Core Frameworks**
- **React 19:** Utilizing the latest concurrent rendering features for ultra-stable performance.
- **Three.js & R3F:** Driving the starfield and particle systems with hardware-accelerated WebGL.
- **Framer Motion:** Powering the synchronized layout animations and section staggers.

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

## ♿ Accessibility Commitment
We believe premium design must be inclusive. Our **Accessibility Engine** ensures that 100% of users can browse comfortably:

- **Automatic Sanitization:** Our `useMotion` hook detects `prefers-reduced-motion` and strips away high-frequency translations (x, y, scale) in real-time.
- **Theatrical Bypass:** The 1.5s Hyperspace Warp and theatrical loaders are automatically skipped for users with vestibular sensitivities.
- **High-Contrast Readiness:** All glass panels maintain WCAG 2.1 AA contrast ratios for legibility.

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
```

---

## 🗺 Monorepo Context
This application is a specialized service within the **IEEE RIT-B Suite**. It consumes shared logic and data from:
- `@astranova/catalogues`: For dynamic IEEE Chapter registry data.
- `astralogger`: For high-fidelity telemetry and logging.

---

<div align="center">
  <p>Built with 💙 by the <b>IEEE RIT-B Technical Team</b></p>
  <p><i>Shaping the future of technology, one pixel at a time.</i></p>
</div>