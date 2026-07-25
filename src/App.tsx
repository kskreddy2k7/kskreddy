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
gsap.registerPlugin(ScrollTrigger);

export default function App() {
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

    </div>
  );
}
