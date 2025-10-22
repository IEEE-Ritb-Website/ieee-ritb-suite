/**
 * Smooth scroll utility with custom easing
 * Foundation-compliant implementation
 */

export function initSmoothScroll() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return; // Use native smooth scroll or instant scroll
  }

  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();

      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      smoothScrollTo(targetElement);
    });
  });
}

function smoothScrollTo(target: HTMLElement, duration: number = 1000) {
  const start = window.pageYOffset;
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const distance = targetPosition - start - 80; // 80px offset for fixed nav
  const startTime = performance.now();

  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  function animation(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutCubic(progress);

    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      // Focus target for accessibility
      target.focus({ preventScroll: true });
    }
  }

  requestAnimationFrame(animation);
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
 * Magnetic element effect - elements follow cursor
 */
export function initMagneticElements() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Only on desktop
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach((element) => {
    const el = element as HTMLElement;

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.3;
      const moveY = y * 0.3;

      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}
