import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { profile } from '../data';
import profilePic from '../assets/profile.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const projectsStatRef = useRef<HTMLSpanElement>(null);
  const cgpaStatRef = useRef<HTMLSpanElement>(null);

  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });

  const pillsData = [
    'AI & ML Student', 'Java Developer', 'Full Stack Engineer',
    'Machine Learning', 'Creative Technologist', 'Problem Solver'
  ];

  useGSAP(() => {
    if (!containerRef.current) return;

    const COMMON = { ease: 'power3.out' };

    // Section entrance
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.8, ...COMMON,
        scrollTrigger: { trigger: containerRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
      }
    );

    // Profile card slides in from left
    if (leftCardRef.current) {
      gsap.fromTo(leftCardRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 1.2, ...COMMON,
          scrollTrigger: { trigger: leftCardRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
        }
      );
      // Gentle breathing float
      gsap.to(leftCardRef.current, {
        y: -8, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5
      });
    }

    // Headline reveal
    if (headlineRef.current) {
      const split = new SplitType(headlineRef.current, { types: 'words' });
      if (split.words) {
        gsap.fromTo(split.words,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.0, stagger: 0.04, ...COMMON,
            scrollTrigger: { trigger: headlineRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
          }
        );
      }
    }

    // Paragraph
    if (paraRef.current) {
      gsap.fromTo(paraRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 1.0, ...COMMON,
          scrollTrigger: { trigger: paraRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
        }
      );
    }

    // Pills stagger
    const pills = pillsRef.current?.querySelectorAll('.info-pill');
    if (pills) {
      gsap.fromTo(pills,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, stagger: 0.07, duration: 0.8, ...COMMON,
          scrollTrigger: { trigger: pillsRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
        }
      );
    }

    // Stat cards stagger
    const statCards = statsRef.current?.querySelectorAll('.stat-card');
    if (statCards) {
      gsap.fromTo(statCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.09, duration: 0.9, ...COMMON,
          scrollTrigger: { trigger: statsRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
        }
      );
    }

    // Count-up animations
    const projectsCounter = { val: 0 };
    gsap.to(projectsCounter, {
      val: 7, duration: 2.2, ease: 'power4.out',
      scrollTrigger: { trigger: statsRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true },
      onUpdate: () => {
        if (projectsStatRef.current) projectsStatRef.current.innerText = `${Math.floor(projectsCounter.val)}+`;
      }
    });

    const cgpaCounter = { val: 0 };
    gsap.to(cgpaCounter, {
      val: 8.17, duration: 2.5, ease: 'power4.out',
      scrollTrigger: { trigger: statsRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true },
      onUpdate: () => {
        if (cgpaStatRef.current) cgpaStatRef.current.innerText = cgpaCounter.val.toFixed(2);
      }
    });

    // Quote
    if (quoteRef.current) {
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1.0, ...COMMON,
          scrollTrigger: { trigger: quoteRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
        }
      );
    }
  }, { scope: containerRef });

  // Card shine effect on mouse move
  useEffect(() => {
    const card = leftCardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      setShinePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    card.addEventListener('mousemove', onMove);
    return () => card.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-36 md:py-48 bg-[#08060A] text-[#F5F5F5] relative overflow-hidden z-[10] select-none"
    >
      {/* Flower ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,_rgba(192,132,252,0.07)_0%,_transparent_65%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-[10]">

        {/* LEFT: Portrait card */}
        <div ref={leftCardRef} className="lg:col-span-5 group">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl relative bg-[#120B18]/60 border border-white/10 group-hover:border-[#C084FC]/40 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all duration-700">
            {/* Shine layer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[20]"
              style={{ background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(192,132,252,0.12) 0%, transparent 55%)` }}
            />
            <img
              src={profilePic}
              alt={profile.fullName}
              className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08060A]/95 via-[#08060A]/40 to-transparent z-[10]" />
            <div className="absolute bottom-8 left-8 right-8 z-[30]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74] animate-pulse shadow-[0_0_8px_rgba(253,186,116,0.8)]" />
                <span className="text-2xl font-playfair font-normal group-hover:text-[#FDBA74] transition-colors duration-500">{profile.fullName}</span>
              </div>
              <div className="text-[#C084FC] text-[11px] font-outfit uppercase tracking-[0.2em]">
                SRM Institute of Science and Technology • B.Tech AI & ML
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="lg:col-span-7 flex flex-col gap-9">

          {/* Label */}
          <div className="inline-flex items-center gap-2.5 border border-[#C084FC]/20 px-4 py-1.5 rounded-full bg-[#2D122D]/40 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FDBA74] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C084FC] font-outfit font-medium">ABOUT</span>
          </div>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] text-[#F5F5F5]"
          >
            Building Intelligence. <br />
            Designing <span className="font-serif italic text-[#FDBA74]">Experiences.</span>
          </h2>

          {/* Paragraph */}
          <p ref={paraRef} className="text-base md:text-lg text-[#A7A7A7] font-outfit font-light leading-relaxed max-w-2xl" style={{ opacity: 0 }}>
            I'm an AI & Machine Learning student passionate about building intelligent software, immersive web experiences, and products that solve real problems.
          </p>

          {/* Pills */}
          <div ref={pillsRef} className="flex flex-wrap gap-2.5">
            {pillsData.map(pill => (
              <div
                key={pill}
                className="info-pill px-4 py-2 border border-[#C084FC]/20 hover:border-[#FDBA74]/50 rounded-full bg-[#2D122D]/30 hover:bg-[#2D122D]/60 text-[#F5F5F5] hover:text-[#FDBA74] transition-all duration-300 backdrop-blur-md flex items-center gap-2 group/pill opacity-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] opacity-60 group-hover/pill:opacity-100 transition-opacity" />
                <span className="text-xs font-outfit font-medium tracking-wide">{pill}</span>
              </div>
            ))}
          </div>

          {/* Stat cards */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { ref: projectsStatRef, value: '0+', label: 'Projects' },
              { ref: cgpaStatRef, value: '0.00', label: 'Current CGPA' },
              { ref: null, value: 'Java', label: 'Core Language' },
              { ref: null, value: '∞', label: 'Learning' },
            ].map(({ ref, value, label }, i) => (
              <div key={i} className="stat-card p-5 rounded-2xl bg-[#120B18]/60 border border-white/10 hover:border-[#C084FC]/40 transition-all duration-400 backdrop-blur-md flex flex-col justify-between group/stat opacity-0">
                <div className="text-3xl font-general font-bold text-[#F5F5F5] group-hover/stat:text-[#FDBA74] transition-colors mb-1.5">
                  {ref ? <span ref={ref}>{value}</span> : value}
                </div>
                <div className="text-[10px] font-outfit uppercase tracking-[0.18em] text-[#A7A7A7]">{label}</div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div ref={quoteRef} className="pt-2 border-t border-white/10 opacity-0">
            <p className="font-playfair italic text-base md:text-lg text-[#F5F5F5] leading-relaxed">
              "I build projects to learn, not just to complete."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
