import Lenis from 'lenis';

/**
 * Initialize Lenis for smooth scrolling
 * Replaces native smooth scroll behavior
 */
export function initSmoothScroll() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return; // Use native scroll
  }

  const lenis = new Lenis({
    lerp: 0.1, // Smoothness (lower = smoother)
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Handle anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: -80, // Offset for fixed nav
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });

  return lenis;
}


/**
 * Parallax scroll effect for background elements
 */
export function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Check if mobile
  const isMobile = window.innerWidth < 768;
  if (isMobile) return;

  function updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const speed = parseFloat(htmlElement.dataset.parallax || '0.5');

      // Calculate parallax offset based on scroll position
      const yPos = -(scrolled * speed);

      htmlElement.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  // Initial call
  updateParallaxElements();

  // Throttle scroll events with RAF
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallaxElements();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Re-initialize on window resize
  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const isMobileNow = window.innerWidth < 768;
      if (!isMobileNow) {
        updateParallaxElements();
      }
    }, 250);
  });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Enhanced Magnetic "Gravity" Engine (2D)
 * Elements follow cursor with interpolated "tugging" logic
 */
export function initMagneticElements() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const magneticElements = document.querySelectorAll('.magnetic');
  const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

  magneticElements.forEach((element) => {
    const el = element as HTMLElement;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId: number | null = null;

    const animate = () => {
      current.x = lerp(current.x, target.x, 0.1);
      current.y = lerp(current.y, target.y, 0.1);

      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      if (Math.abs(current.x - target.x) < 0.01 && Math.abs(current.y - target.y) < 0.01) {
        el.style.transform = target.x === 0 ? 'translate3d(0,0,0)' : el.style.transform;
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Gravity strength (0.35 = 35% of cursor distance)
      target.x = (e.clientX - centerX) * 0.35;
      target.y = (e.clientY - centerY) * 0.35;

      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    });

    el.addEventListener('mouseleave', () => {
      target.x = 0;
      target.y = 0;
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    });
  });
}