import { useEffect, useRef, useCallback } from 'react';

/**
 * useScrollReveal — attaches IntersectionObserver to a container ref
 * and adds `.visible` to any child with a `.reveal*` class when it enters the viewport.
 *
 * @param {object} options  IntersectionObserver options
 * @returns {React.RefObject}
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Respect stagger delay set via data-delay attribute
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, Number(delay));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options }
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return ref;
}

/**
 * useAnimatedCounter — animates a number from 0 to `target` over `duration` ms.
 * Returns the current animated display value.
 *
 * @param {number|string} target  Final value (numbers animate; strings are returned immediately)
 * @param {number}        duration Animation duration in ms
 * @param {boolean}       trigger  Start animation only when true
 */
export function useAnimatedCounter(target, duration = 900, trigger = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    const suffix        = String(target).replace(/[0-9.]/g, '');

    if (isNaN(numericTarget)) {
      if (ref.current) ref.current.textContent = target;
      return;
    }

    const start     = performance.now();
    const isFloat   = String(target).includes('.');
    const decimals  = isFloat ? (String(numericTarget).split('.')[1] || '').length : 0;

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = numericTarget * eased;

      if (ref.current) {
        ref.current.textContent = current.toFixed(decimals) + suffix;
      }

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration, trigger]);

  return ref;
}
