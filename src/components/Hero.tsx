import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { profile } from '../data';
import { scrollToTarget } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const Particles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const particles = containerRef.current.children;
    
    gsap.set(particles, {
      x: () => Math.random() * window.innerWidth,
      y: () => Math.random() * window.innerHeight,
      opacity: () => 0.15 + Math.random() * 0.45,
      scale: () => 0.2 + Math.random() * 0.8
    });

    Array.from(particles).forEach((p) => {
      gsap.to(p, {
        y: `-=${100 + Math.random() * 200}`,
        x: `+=${-50 + Math.random() * 100}`,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * -5
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[5] overflow-hidden mix-blend-screen">
      {Array.from({ length: 35 }).map((_, i) => (
        <div 
          key={i} 
          className={`absolute w-1.5 h-1.5 rounded-full blur-[1px] ${i % 3 === 0 ? 'bg-[#FDBA74]' : 'bg-[#C084FC]'}`} 
        />
      ))}
    </div>
  );
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logoTextRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const lightingRef = useRef<HTMLDivElement>(null);

  // Video autoplay + hold on final bloom frame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    const handleEnded = () => video.pause();
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  // Cinematic entrance timeline (runs once on mount)
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    if (lightingRef.current) {
      tl.fromTo(lightingRef.current, { opacity: 0 }, { opacity: 0.85, duration: 2, ease: 'power2.inOut' }, 0);
    }

    if (videoRef.current) {
      tl.fromTo(videoRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 0.98, scale: 1, duration: 1.8, ease: 'power2.out' },
        0
      );
    }

    const navEl = document.querySelector('header');
    if (navEl) {
      tl.fromTo(navEl,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        0.5
      );
    }

    if (badgeRef.current) {
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
        1.2
      );
    }

    if (heroTitleRef.current) {
      const split = new SplitType(heroTitleRef.current, { types: 'chars' });
      if (split.chars) {
        tl.fromTo(split.chars,
          { opacity: 0, y: 50, rotateX: -90, filter: 'blur(10px)' },
          { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.02, ease: 'back.out(1.4)' },
          1.5
        );
      }
    }

    if (heroSubtitleRef.current) {
      const split = new SplitType(heroSubtitleRef.current, { types: 'words' });
      if (split.words) {
        tl.fromTo(split.words,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: 'power2.out' },
          2.0
        );
      }
    }

    if (buttonRef.current) {
      tl.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)' },
        2.5
      );
    }

    if (logoTextRef.current) {
      tl.fromTo(logoTextRef.current,
        { opacity: 0, filter: 'blur(20px)', scale: 1.1 },
        { opacity: 0.65, filter: 'blur(0px)', scale: 1, duration: 1.5, ease: 'power3.out' },
        2.8
      );
    }

    if (scrollIndicatorRef.current) {
      tl.fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        3.5
      );
    }
  }, { scope: sectionRef });

  // Scroll parallax
  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });

    if (videoRef.current) tl.to(videoRef.current, { yPercent: 15, scale: 1.1, filter: 'blur(5px)', ease: 'none' }, 0);
    if (overlayRef.current) tl.to(overlayRef.current, { opacity: 0.85, ease: 'none' }, 0);
    if (contentRef.current) tl.to(contentRef.current, { yPercent: -30, opacity: 0, filter: 'blur(10px)', ease: 'none' }, 0);
    if (logoTextRef.current) tl.to(logoTextRef.current, { yPercent: 40, opacity: 0, ease: 'none' }, 0);
    if (scrollIndicatorRef.current) tl.to(scrollIndicatorRef.current, { opacity: 0, ease: 'none' }, 0);
  }, { scope: sectionRef });

  // Advanced Mouse parallax depth effect (subtle 6-10px drift)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = [
      { el: logoTextRef.current, force: 0.035 },
      { el: contentRef.current, force: 0.018 },
      { el: videoRef.current, force: -0.025 }
    ];

    let rafId: number;
    let targetX = 0, targetY = 0;
    let currX = 0, currY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 35;
      targetY = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 35;
    };

    const lerp = () => {
      currX += (targetX - currX) * 0.08;
      currY += (targetY - currY) * 0.08;
      
      elements.forEach(({ el, force }) => {
        if (el) {
          gsap.set(el, { x: currX * force * 10, y: currY * force * 10 });
        }
      });
      
      rafId = requestAnimationFrame(lerp);
    };

    rafId = requestAnimationFrame(lerp);
    section.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      section.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full bg-[#08060A] overflow-hidden flex flex-col justify-between pt-[clamp(2.5rem,4vh,3.5rem)] pb-6 perspective-1000"
    >
      {/* Volumetric Lighting: Soft Lavender Bloom + Warm Peach Edge Light */}
      <div 
        ref={lightingRef} 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(192,132,252,0.28)_0%,_transparent_60%),_radial-gradient(circle_at_65%_35%,_rgba(253,186,116,0.2)_0%,_transparent_50%)] pointer-events-none z-[1]" 
      />
      <Particles />

      {/* Flower Video Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-0 will-change-transform contrast-[1.08] brightness-[1.05]"
        >
          <source
            src="https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf/flower.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft gradient masks to keep focal flower area ~40-50% clearer */}
        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-[#08060A] via-[#08060A]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#08060A] via-[#08060A]/30 to-transparent" />
      </div>

      <div ref={overlayRef} className="absolute inset-0 bg-[#08060A] opacity-0 pointer-events-none z-[1]" />

      <img
        src="https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf/black_gradient.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-[-25vh] left-0 w-full h-auto z-[2] pointer-events-none opacity-25"
      />

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-[10] flex flex-col items-center text-center w-[95%] max-w-[950px] mx-auto will-change-transform"
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 mb-[30px] border border-[#C084FC]/20 px-5 py-2 rounded-full bg-[#120B18]/50 backdrop-blur-xl opacity-0 shadow-[0_0_20px_rgba(192,132,252,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#FDBA74] animate-pulse shadow-[0_0_8px_#FDBA74]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C084FC] font-bold font-outfit">
            AI & MACHINE LEARNING • FRONTEND ENGINEER
          </span>
        </div>

        {/* Hero Title - Noticeably reduced font size to clamp(46px, 5vw, 82px) */}
        <h1
          ref={heroTitleRef}
          className="font-playfair text-[clamp(46px,5vw,82px)] font-normal text-[#F5F5F5] leading-[0.98] mb-[30px] tracking-[-0.03em]"
        >
          Crafting Intelligence,<br />
          <span className="italic text-[#FDBA74]">Building Beauty</span>
        </h1>
        
        {/* Subtitle - max width 680px */}
        <p ref={heroSubtitleRef} className="text-[#A7A7A7] font-outfit text-sm sm:text-base max-w-[680px] mx-auto mb-[40px] leading-relaxed">
          AI Engineer & Creative Technologist
        </p>

        {/* CTA Button */}
        <button
          ref={buttonRef}
          onClick={() => scrollToTarget('#projects')}
          className="hero-btn group relative font-outfit text-sm font-bold tracking-[0.1em] text-[#0A070E] bg-[#C084FC] px-10 py-4 rounded-full inline-flex items-center gap-3 cursor-pointer transition-all duration-500 shadow-[0_0_30px_rgba(192,132,252,0.4)] hover:bg-white hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] opacity-0 outline-none select-none uppercase mb-[60px]"
        >
          <span>Explore Work</span>
          <span className="text-[#0A070E] group-hover:translate-x-1 transition-transform">↗</span>
        </button>
      </div>

      {/* Background i²Flow Branding */}
      <div className="relative z-[10] w-full px-5 flex justify-center items-center mt-auto pb-4 pointer-events-none select-none">
        <div
          ref={logoTextRef}
          className="flex items-center justify-center gap-4 md:gap-6 opacity-0 will-change-transform"
        >
          {/* i²Flow Logo */}
          <div
            className="w-[clamp(3rem,7vw,6.5rem)] h-[clamp(3rem,7vw,6.5rem)] rounded-[22%] shrink-0 overflow-hidden relative"
            style={{
              border: '2px solid rgba(232,169,77,0.35)',
              boxShadow: '0 0 30px rgba(232,169,77,0.2), 0 0 80px rgba(232,169,77,0.08)',
              background: '#0a0707',
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/i2flow-logo.jpg`}
              alt="i2Flow"
              className="w-full h-full object-cover"
              draggable={false}
              style={{ filter: 'brightness(1.05) contrast(1.05)' }}
            />
            {/* inner vignette */}
            <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }} />
          </div>

          {/* i²Flow Wordmark */}
          <h2
            className="font-playfair font-normal leading-[0.88] tracking-[-0.03em] text-center"
            style={{
              fontSize: 'clamp(3rem,9vw,7.5rem)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(232,169,77,0.90) 40%, rgba(205,133,63,0.85) 60%, rgba(255,255,255,0.70) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 24px rgba(232,169,77,0.5)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
            }}
          >
            i²Flow
          </h2>
        </div>
      </div>
      
      {/* Scroll Indicator removed */}

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-[10]" />
    </section>
  );
}
