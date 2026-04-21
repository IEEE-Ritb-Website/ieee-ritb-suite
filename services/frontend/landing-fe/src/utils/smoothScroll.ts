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

  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
    if (!anchor) return;
    
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault();
      lenis.scrollTo(targetElement, {
        offset: -80, // Offset for fixed nav
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  document.addEventListener('click', handleAnchorClick);

  const originalDestroy = lenis.destroy.bind(lenis);
  lenis.destroy = () => {
    document.removeEventListener('click', handleAnchorClick);
    originalDestroy();
  };

  return lenis;
}


/**
 * Parallax scroll effect for background elements
 */
export function initParallax(lenis?: any) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  // Check if mobile
  const isMobile = window.innerWidth < 768;
  if (isMobile) return () => {};

  let parallaxElements = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => {
    const htmlElement = el as HTMLElement;
    return {
      element: htmlElement,
      speed: parseFloat(htmlElement.dataset.parallax || '0.5')
    };
  });

  function updateParallaxElements(scrolled: number) {
    parallaxElements.forEach(({ element, speed }) => {
      const yPos = -(scrolled * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  // Initial call
  updateParallaxElements(window.scrollY);

  let cleanupScroll: () => void;

  if (lenis) {
    const onLenisScroll = (e: any) => updateParallaxElements(e.animatedScroll || e.scroll);
    lenis.on('scroll', onLenisScroll);
    cleanupScroll = () => lenis.off('scroll', onLenisScroll);
  } else {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallaxElements(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    cleanupScroll = () => window.removeEventListener('scroll', handleScroll);
  }

  // Re-initialize on window resize to pick up new elements
  let resizeTimer: number;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const isMobileNow = window.innerWidth < 768;
      if (!isMobileNow) {
        parallaxElements = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => {
          const htmlElement = el as HTMLElement;
          return {
            element: htmlElement,
            speed: parseFloat(htmlElement.dataset.parallax || '0.5')
          };
        });
        updateParallaxElements(window.scrollY);
      }
    }, 250);
  };
  window.addEventListener('resize', onResize);

  return () => {
    cleanupScroll();
    window.removeEventListener('resize', onResize);
  };
}

/**
 * Enhanced Magnetic "Gravity" Engine (2D)
 * Elements follow cursor with interpolated "tugging" logic
 */
export function initMagneticElements() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  if (document.body.getAttribute('data-perf-tier') === 'low') return;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const magneticElements = document.querySelectorAll('.magnetic:not([data-magnetic-init])');
  const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

  magneticElements.forEach((element) => {
    const el = element as HTMLElement;
    el.setAttribute('data-magnetic-init', 'true');
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