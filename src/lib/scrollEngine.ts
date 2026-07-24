import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let resizeHandler: (() => void) | null = null;
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

function detachScrollEngineListeners() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
    resizeTimeout = null;
  }
}

export function initScrollEngine(): Lenis {
  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
  });

  lenisInstance = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.defaults({
    markers: false,
  });

  resizeHandler = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  };

  window.addEventListener('resize', resizeHandler);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return lenis;
}

export function destroyScrollEngine() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  detachScrollEngineListeners();
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTarget(target: string | Element, offset = 0) {
  const lenis = lenisInstance;

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate: false,
    });
    return true;
  }

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  return true;
}

export function refreshScrollEngine() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
