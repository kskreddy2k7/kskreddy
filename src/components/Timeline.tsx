import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Real Developer Journey Milestones ───────────────────────────────────────
const MILESTONES = [
  {
    id: 'M01',
    year: '2025',
    title: 'The Beginning',
    subtitle: 'Discovering Programming',
    description:
      'After completing Intermediate in June 2025, I became interested in software development and started learning Python. That curiosity marked the very beginning of my journey into programming.',
    tags: ['Python', 'Programming Fundamentals', 'Problem Solving'],
    accent: '#C084FC',
  },
  {
    id: 'M02',
    year: '2025',
    title: 'Learning Python',
    subtitle: 'Building a Strong Foundation',
    description:
      'I completed a comprehensive Python course to strengthen my programming fundamentals — understanding how software is actually built through practical exercises, projects, and real problem-solving.',
    tags: ['Python', 'Functions', 'OOP', 'Logic Building'],
    accent: '#FDBA74',
  },
  {
    id: 'M03',
    year: '2025',
    title: 'B.Tech AI & Machine Learning',
    subtitle: 'SRM Institute of Science and Technology',
    description:
      'I joined SRM University to pursue a B.Tech in Artificial Intelligence and Machine Learning — diving deep into software engineering, AI architectures, and real-world development practices.',
    tags: ['Python', 'AI', 'Machine Learning', 'University'],
    accent: '#F472B6',
  },
  {
    id: 'M04',
    year: '2025',
    title: 'My First Real Project',
    subtitle: 'AI Resume Screening System',
    description:
      'Built my first production-grade AI project — an intelligent Resume Screening System using Python, ML and NLP that can parse, rank and analyse resumes automatically. Deployed publicly on GitHub Pages.',
    tags: ['Python', 'Machine Learning', 'NLP', 'TypeScript', 'GitHub Pages'],
    accent: '#34D399',
  },
  {
    id: 'M05',
    year: '2026',
    title: 'Going Full-Stack',
    subtitle: 'React · TypeScript · Tailwind',
    description:
      'Expanded into full-stack development — mastering React, TypeScript and Tailwind CSS to build premium, production-ready interfaces. Shipped multiple live products including a healthcare platform and real estate app.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    accent: '#60A5FA',
  },
  {
    id: 'M06',
    year: '2026',
    title: 'Creative & Cinematic Engineering',
    subtitle: 'GSAP · Lenis · Premium UI',
    description:
      'Discovered the intersection of engineering and design — building cinematic web experiences using GSAP, Lenis smooth scroll, SplitType animations, and luxury glass-morphism aesthetics. This portfolio is the result.',
    tags: ['GSAP', 'Lenis', 'Three.js', 'SplitType', 'Creative Coding'],
    accent: '#C084FC',
  },
  {
    id: 'M07',
    year: '2026',
    title: 'Founded i²Flow',
    subtitle: 'Founder & Builder · AI · Design · Engineering',
    description:
      'I founded i²Flow — my own AI brand and platform focused on building intelligent, generative, and cinematic digital experiences. As founder, I am growing i²Flow from the ground up: defining the vision, building the product, crafting the brand identity, and shipping real work that sits at the intersection of AI, automation, and premium design.',
    tags: ['Founder', 'i²Flow', 'Generative AI', 'Brand Building', 'TypeScript'],
    accent: '#E8A94D',
    logo: '/i2flow-logo.jpg',
    links: [
      { label: 'i²Flow Website', url: 'https://kskreddy2k7.github.io/i2flow/', icon: 'web' },
      { label: 'Instagram', url: 'https://www.instagram.com/i2flow.ai/', icon: 'instagram' },
    ],
  },
];

// ─── Floating Pollen Particle ─────────────────────────────────────────────────
function PollenParticles() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.children;
    Array.from(els).forEach((el, i) => {
      gsap.to(el, {
        y: `${-20 - Math.random() * 30}`,
        x: `${(Math.random() - 0.5) * 20}`,
        rotation: Math.random() * 180,
        opacity: 0,
        duration: 2.5 + Math.random() * 2,
        repeat: -1,
        delay: i * 0.3,
        ease: 'power1.inOut',
        yoyo: true,
      });
    });
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 3 === 0 ? '#C084FC' : i % 3 === 1 ? '#FDBA74' : '#F472B6',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            opacity: 0.25 + Math.random() * 0.25,
          }}
        />
      ))}
    </div>
  );
}

// ─── Single Milestone Card ────────────────────────────────────────────────────
function MilestoneCard({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  const isLeft = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !nodeRef.current) return;

    // Card slide in
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: isLeft ? -60 : 60, y: 30, filter: 'blur(6px)' },
      {
        opacity: 1, x: 0, y: 0, filter: 'blur(0px)',
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 82%',
          invalidateOnRefresh: true,
        },
      }
    );

    // Node pulse on enter
    gsap.fromTo(
      nodeRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 75%',
          onEnter: () => {
            if (glowRef.current) {
              gsap.to(glowRef.current, {
                opacity: 1, scale: 1.4, duration: 0.4, ease: 'power2.out',
                onComplete: () => {
                  gsap.to(glowRef.current, { opacity: 0.3, scale: 1, duration: 0.6 });
                },
              });
            }
          },
        },
      }
    );

    // Tech tags stagger
    const tags = cardRef.current.querySelectorAll('.milestone-tag');
    gsap.fromTo(
      tags,
      { opacity: 0, y: 10, scale: 0.85 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.4, stagger: 0.06, ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 78%',
        },
      }
    );
  }, [isLeft]);

  return (
    <div className="relative flex w-full items-center" style={{ minHeight: '1px' }}>
      {/* Left spacer (desktop) */}
      <div className={`hidden md:flex w-[46%] ${isLeft ? 'justify-end pr-10' : ''}`}>
        {isLeft && (
          <div ref={cardRef} className="w-full max-w-md">
            <CardInner milestone={milestone} />
          </div>
        )}
      </div>

      {/* Central Node */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-20 flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          ref={glowRef}
          className="absolute w-8 h-8 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${milestone.accent}80, transparent)` }}
        />
        {/* Node dot */}
        <div
          ref={nodeRef}
          className="w-5 h-5 rounded-full border-2 border-[#120B18] flex items-center justify-center shadow-lg z-10"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${milestone.accent}, ${milestone.accent}80)`,
            boxShadow: `0 0 12px ${milestone.accent}80, 0 0 24px ${milestone.accent}30`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Right side (desktop) / main card (mobile) */}
      <div
        className={`hidden md:flex w-[46%] ${!isLeft ? 'justify-start pl-10' : ''}`}
      >
        {!isLeft && (
          <div ref={cardRef} className="w-full max-w-md">
            <CardInner milestone={milestone} />
          </div>
        )}
      </div>

      {/* Mobile-only card */}
      <div ref={cardRef} className="md:hidden w-[calc(100%-3.5rem)] ml-14">
        <CardInner milestone={milestone} />
      </div>
    </div>
  );
}

type Milestone = {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accent: string;
  logo?: string;
  links?: { label: string; url: string; icon: string }[];
};

function LinkIcon({ icon }: { icon: string }) {
  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function CardInner({ milestone }: { milestone: Milestone }) {
  return (
    <div
      className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{
        background: 'rgba(18,11,24,0.75)',
        backdropFilter: 'blur(24px)',
        border: `1px solid rgba(255,255,255,0.07)`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Hover accent glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${milestone.accent}12, transparent 65%)` }}
      />
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${milestone.accent}80, transparent)` }}
      />

      {/* Year + ID */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-outfit text-[10px] uppercase tracking-[0.28em] font-bold"
          style={{ color: milestone.accent }}
        >
          {milestone.id} · {milestone.year}
        </span>
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: milestone.accent, boxShadow: `0 0 6px ${milestone.accent}` }}
        />
      </div>

      {/* Title row — with optional logo */}
      <div className="flex items-center gap-3 mb-1">
        {milestone.logo && (
          <div
            className="w-10 h-10 rounded-xl shrink-0 overflow-hidden relative"
            style={{
              border: `1.5px solid rgba(232,169,77,0.4)`,
              boxShadow: `0 0 14px rgba(232,169,77,0.25), 0 0 30px rgba(232,169,77,0.1)`,
              background: '#0a0707',
            }}
          >
            <img
              src={milestone.logo.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${milestone.logo}` : milestone.logo}
              alt="i2Flow logo"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.55)' }} />
          </div>
        )}
        <h3 className="font-playfair text-xl font-normal text-white leading-tight">
          {milestone.title}
        </h3>
      </div>
      {/* Subtitle */}
      <p className="font-outfit text-[12px] text-white/50 mb-4 leading-relaxed">
        {milestone.subtitle}
      </p>

      {/* Description */}
      <p className="font-outfit text-[13px] text-[#B0B0B0] leading-[1.75] mb-5">
        {milestone.description}
      </p>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {milestone.tags.map(tag => (
          <span
            key={tag}
            className="milestone-tag px-2.5 py-1 rounded-full text-[10px] font-outfit font-medium tracking-wide transition-all duration-300"
            style={{
              background: `${milestone.accent}12`,
              border: `1px solid ${milestone.accent}30`,
              color: milestone.accent,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Optional CTA Links */}
      {milestone.links && milestone.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {milestone.links.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-outfit text-[11px] font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: `${milestone.accent}10`,
                border: `1px solid ${milestone.accent}35`,
                color: milestone.accent,
                boxShadow: `0 0 0 0 ${milestone.accent}00`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = `${milestone.accent}22`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${milestone.accent}30`;
                (e.currentTarget as HTMLElement).style.borderColor = `${milestone.accent}70`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = `${milestone.accent}10`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${milestone.accent}00`;
                (e.currentTarget as HTMLElement).style.borderColor = `${milestone.accent}35`;
              }}
            >
              <LinkIcon icon={link.icon} />
              {link.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 opacity-60 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Heading: SplitText char reveal
    if (headingRef.current) {
      const badge = headingRef.current.querySelector('.evo-badge');
      const h2 = headingRef.current.querySelector('h2');
      const sub = headingRef.current.querySelector('.evo-sub');

      if (badge) {
        gsap.fromTo(badge,
          { opacity: 0, y: 16, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 88%' } }
        );
      }

      if (h2) {
        const split = new SplitType(h2, { types: 'chars' });
        if (split.chars) {
          gsap.fromTo(split.chars,
            { opacity: 0, y: 40, rotateX: -70, filter: 'blur(8px)' },
            {
              opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
              duration: 1.0, stagger: 0.028, ease: 'back.out(1.5)',
              scrollTrigger: { trigger: headingRef.current, start: 'top 85%', invalidateOnRefresh: true },
            }
          );
        }
      }

      if (sub) {
        gsap.fromTo(sub,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
        );
      }
    }

    // Animated vertical progress line
    if (lineFillRef.current && lineTrackRef.current) {
      gsap.fromTo(lineFillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: lineTrackRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-32 bg-[#050307] text-[#F5F5F5] overflow-hidden"
    >
      <PollenParticles />

      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(192,132,252,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(253,186,116,0.06) 0%, transparent 65%)' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Heading */}
        <div ref={headingRef} className="mb-24 text-center flex flex-col items-center gap-5">
          <div className="evo-badge opacity-0 inline-flex items-center gap-2.5 border border-[#C084FC]/20 px-4 py-1.5 rounded-full bg-[#120B18]/60 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" style={{ boxShadow: '0 0 6px #FDBA74' }} />
            <span className="text-[10px] uppercase tracking-[0.26em] text-[#C084FC] font-outfit font-medium">My Journey</span>
          </div>

          <h2 className="font-playfair text-[clamp(36px,5vw,72px)] font-normal tracking-tight leading-none perspective-[800px]">
            Developer <span className="italic text-[#FDBA74]">Evolution</span>
          </h2>

          <p className="evo-sub opacity-0 font-outfit text-sm text-[#A7A7A7] max-w-lg text-center leading-relaxed">
            A timeline of curiosity, learning and building real-world projects.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical glowing line */}
          <div
            ref={lineTrackRef}
            className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px]"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div
              ref={lineFillRef}
              className="absolute top-0 left-0 w-full origin-top"
              style={{
                height: '100%',
                background: 'linear-gradient(to bottom, #C084FC, #FDBA74, #F472B6, #34D399, #60A5FA, #C084FC)',
                boxShadow: '0 0 12px rgba(192,132,252,0.6)',
                transform: 'scaleY(0)',
              }}
            />
          </div>

          {/* Milestone cards */}
          <div className="flex flex-col gap-16 md:gap-24">
            {MILESTONES.map((milestone, i) => (
              <MilestoneCard key={milestone.id} milestone={milestone} index={i} />
            ))}
          </div>

          {/* End of timeline */}
          <div className="relative flex justify-center mt-16 md:mt-24">
            <div
              className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl"
              style={{
                background: 'rgba(18,11,24,0.8)',
                border: '1px solid rgba(192,132,252,0.2)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 40px rgba(192,132,252,0.1)',
              }}
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-[#120B18] animate-pulse"
                style={{ background: '#C084FC', boxShadow: '0 0 16px #C084FC80' }}
              />
              <span className="font-outfit text-[10px] uppercase tracking-[0.28em] text-[#C084FC]">
                Story continues…
              </span>
              <span className="font-outfit text-[11px] text-white/40 text-center max-w-[180px]">
                Currently building the next chapter
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
