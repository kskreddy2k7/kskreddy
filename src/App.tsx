import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { destroyScrollEngine, initScrollEngine } from './lib/scrollEngine';

import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import InteractiveBackground from './components/InteractiveBackground';
import DeveloperControlCenter from './components/DeveloperControlCenter';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isNexusOpen, setIsNexusOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = initScrollEngine();

    return () => {
      lenisRef.current = null;
      destroyScrollEngine();
      ScrollTrigger.killAll();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      return;
    }

    if (isNexusOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isNexusOpen]);

  // SECRET TRIGGER: SHIFT + K (guarded against input elements)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if (isInput) return;
      if (e.shiftKey && e.key.toUpperCase() === 'K') {
        e.preventDefault();
        setIsNexusOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-[#08060A] min-h-screen text-[#F5F5F5] selection:bg-[#C084FC]/30 selection:text-[#F5F5F5]">
      <CustomCursor />
      <InteractiveBackground />
      <Navigation />

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      <DeveloperControlCenter
        isOpen={isNexusOpen}
        onClose={() => setIsNexusOpen(false)}
      />
    </div>
  );
}
