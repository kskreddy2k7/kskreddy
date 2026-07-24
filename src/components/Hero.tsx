import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { profile } from '../data';
import { scrollToTarget } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logoTextRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    const tl = gsap.timeline({ delay: 0.1 });

    // Background video fade in
    if (videoRef.current) {
      tl.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 0.9, duration: 1.4, ease: 'power2.out' },
        0
      );
    }

    // Nav header drop
    const navEl = document.querySelector('header');
    if (navEl) {
      tl.fromTo(navEl,
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        0.8
      );
    }

    // Badge slides up
    if (badgeRef.current) {
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        1.6
      );
    }

    // Title word reveal
    if (heroTitleRef.current) {
      const split = new SplitType(heroTitleRef.current, { types: 'words' });
      if (split.words) {
        tl.fromTo(split.words,
          { opacity: 0, y: 32, rotateX: 40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.0, stagger: 0.045, ease: 'power4.out' },
          2.0
        );
      }
    }

    // Button appear
    if (buttonRef.current) {
      tl.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
        2.8
      );
    }

    // KSK Reddy wordmark
    if (logoTextRef.current) {
      tl.fromTo(logoTextRef.current,
        { opacity: 0, filter: 'blur(12px)' },
        { opacity: 0.92, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' },
        3.2
      );
    }
  }, { scope: sectionRef });

  // Scroll parallax — only translate3d + opacity, no blur/filter
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

    if (videoRef.current) {
      tl.to(videoRef.current, { yPercent: 20, scale: 1.12, ease: 'none' }, 0);
    }
    if (overlayRef.current) {
      tl.to(overlayRef.current, { opacity: 0.75, ease: 'none' }, 0);
    }
    if (contentRef.current) {
      tl.to(contentRef.current, { yPercent: -25, opacity: 0, ease: 'none' }, 0);
    }
    if (logoTextRef.current) {
      tl.to(logoTextRef.current, { yPercent: 35, opacity: 0.1, ease: 'none' }, 0);
    }
  }, { scope: sectionRef });

  // Mouse parallax on wordmark
  useEffect(() => {
    const section = sectionRef.current;
    const logo = logoTextRef.current;
    if (!section || !logo) return;

    let rafId: number;
    let targetX = 0, targetY = 0;
    let currX = 0, currY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 20;
      targetY = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 20;
    };

    const lerp = () => {
      currX += (targetX - currX) * 0.06;
      currY += (targetY - currY) * 0.06;
      gsap.set(logo, { x: currX, y: currY });
      rafId = requestAnimationFrame(lerp);
    };

    rafId = requestAnimationFrame(lerp);
    section.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      section.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const scrollTo = (id: string) => {
    scrollToTarget(id);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full bg-[#08060A] overflow-hidden flex flex-col justify-between pt-[clamp(5rem,14vh,8rem)] pb-6"
    >
      {/* Flower Video Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-0 will-change-transform"
        >
          <source
            src="https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf/flower.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[#08060A] via-[#08060A]/70 to-transparent" />
      </div>

      {/* Dark overlay (animated on scroll) */}
      <div ref={overlayRef} className="absolute inset-0 bg-[#08060A] opacity-0 pointer-events-none z-[1]" />

      {/* Gradient SVG */}
      <img
        src="https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf/black_gradient.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-[-25vh] left-0 w-full h-auto z-[2] pointer-events-none opacity-75"
      />

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-[10] flex flex-col items-center text-center w-[95%] max-w-[1100px] mx-auto will-change-transform"
      >
        {/* Bio Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 mb-6 border border-white/10 px-4 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-md opacity-0"
        >
          <span className="w-2 h-2 rounded-full bg-[#FDBA74] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C084FC] font-medium font-outfit">
            AI & MACHINE LEARNING • FRONTEND ENGINEER
          </span>
        </div>

        {/* Title */}
        <h1
          ref={heroTitleRef}
          className="font-playfair text-[2.5rem] sm:text-[3.4rem] md:text-[4rem] font-normal text-[#F5F5F5] leading-[1.15] mb-9 tracking-[-0.015em] perspective-1000"
        >
          AI Engineer & Creative Technologist
        </h1>

        {/* CTA Button */}
        <button
          ref={buttonRef}
          onClick={() => scrollTo('#about')}
          className="hero-btn font-outfit text-[1rem] font-medium tracking-[0.02em] text-[#F5F5F5] bg-[#08060A]/80 border border-[#C084FC]/30 px-10 py-4 rounded-full inline-flex items-center gap-3 cursor-pointer transition-all duration-500 shadow-[0_4px_25px_rgba(88,28,135,0.35)] hover:bg-[#F5F5F5] hover:text-[#08060A] hover:border-[#F5F5F5] hover:-translate-y-0.5 opacity-0 outline-none select-none"
        >
          <span>Explore Work</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" />
        </button>
      </div>

      {/* KSK Reddy Wordmark */}
      <div className="relative z-[10] w-full px-5 flex justify-center items-center mt-auto pb-2 pointer-events-none select-none">
        <h2
          ref={logoTextRef}
          className="font-general text-[clamp(4rem,15vw,11rem)] sm:text-[clamp(5rem,16vw,12rem)] font-normal text-[#F5F5F5] tracking-[-0.03em] leading-[0.82] text-center w-full whitespace-nowrap opacity-0 will-change-transform"
        >
          {profile.fullName}
        </h2>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/15 z-[10]" />
    </section>
  );
}
