import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Real Tech Ecosystem (curated from pinned repos + confirmed skills) ───
const TECH_CLUSTERS = [
  {
    id: 'languages',
    label: 'Languages',
    accent: '#C084FC',
    glow: 'rgba(192,132,252,0.15)',
    techs: [
      { name: 'TypeScript', icon: 'TS', color: '#3178C6', repos: ['ai-resume-screening-system', 'i2flow', 'Builderestate', 'nizams-royal-restaurant', 'EvoDoc-Flow'], repoCount: 5 },
      { name: 'JavaScript', icon: 'JS', color: '#F7DF1E', repos: ['-Sri-Sai-Traders-website'], repoCount: 1 },
      { name: 'Python',     icon: 'PY', color: '#3776AB', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'HTML5',      icon: 'HT', color: '#E34F26', repos: ['-Sri-Sai-Traders-website'], repoCount: 1 },
      { name: 'CSS3',       icon: 'CS', color: '#1572B6', repos: ['-Sri-Sai-Traders-website'], repoCount: 1 },
      { name: 'SQL',        icon: 'SQ', color: '#C084FC', repos: ['ai-resume-screening-system'], repoCount: 1 },
    ]
  },
  {
    id: 'frontend',
    label: 'Frontend',
    accent: '#FDBA74',
    glow: 'rgba(253,186,116,0.12)',
    techs: [
      { name: 'React',      icon: 'RE', color: '#61DAFB', repos: ['i2flow', 'Builderestate', 'nizams-royal-restaurant', 'EvoDoc-Flow'], repoCount: 4 },
      { name: 'Next.js',    icon: 'NX', color: '#FFFFFF', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'Tailwind',   icon: 'TW', color: '#06B6D4', repos: ['i2flow', 'Builderestate', 'nizams-royal-restaurant', 'EvoDoc-Flow'], repoCount: 4 },
      { name: 'Vite',       icon: 'VI', color: '#646CFF', repos: ['i2flow', 'nizams-royal-restaurant'], repoCount: 2 },
      { name: 'GSAP',       icon: 'GS', color: '#88CE02', repos: ['nizams-royal-restaurant', 'creative-portfolio'], repoCount: 2 },
    ]
  },
  {
    id: 'ai_ml',
    label: 'AI & Machine Learning',
    accent: '#F472B6',
    glow: 'rgba(244,114,182,0.12)',
    techs: [
      { name: 'Machine Learning', icon: 'ML', color: '#FDBA74', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'NLP',              icon: 'NL', color: '#C084FC', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'Scikit-learn',     icon: 'SK', color: '#F7931E', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'Pandas',           icon: 'PA', color: '#150458', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'NumPy',            icon: 'NP', color: '#4DABCF', repos: ['ai-resume-screening-system'], repoCount: 1 },
    ]
  },
  {
    id: 'backend_db',
    label: 'Backend & Data',
    accent: '#34D399',
    glow: 'rgba(52,211,153,0.12)',
    techs: [
      { name: 'Node.js',   icon: 'NO', color: '#339933', repos: ['EvoDoc-Flow', 'ai-resume-screening-system'], repoCount: 2 },
      { name: 'Firebase',  icon: 'FB', color: '#FFCA28', repos: ['EvoDoc-Flow'], repoCount: 1 },
      { name: 'Supabase',  icon: 'SB', color: '#3ECF8E', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'MySQL',     icon: 'MY', color: '#4479A1', repos: ['ai-resume-screening-system'], repoCount: 1 },
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Deployment',
    accent: '#A78BFA',
    glow: 'rgba(167,139,250,0.12)',
    techs: [
      { name: 'Git',           icon: 'GI', color: '#F05032', repos: ['all 6 repos'], repoCount: 6 },
      { name: 'GitHub',        icon: 'GH', color: '#E6EDF3', repos: ['all 6 repos'], repoCount: 6 },
      { name: 'GitHub Pages',  icon: 'GP', color: '#C084FC', repos: ['-Sri-Sai-Traders-website', 'i2flow', 'nizams-royal-restaurant'], repoCount: 3 },
      { name: 'Vercel',        icon: 'VE', color: '#E6EDF3', repos: ['EvoDoc-Flow'], repoCount: 1 },
      { name: 'Netlify',       icon: 'NE', color: '#00C7B7', repos: ['ai-resume-screening-system'], repoCount: 1 },
      { name: 'Figma',         icon: 'FG', color: '#F24E1E', repos: ['Builderestate', 'nizams-royal-restaurant'], repoCount: 2 },
    ]
  }
];

type Tech = { name: string; icon: string; color: string; repos: string[]; repoCount: number };

function TechPill({ tech, accent, delay }: { tech: Tech; accent: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pillRef}
      className="tech-pill group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl cursor-default select-none transition-all duration-300"
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)`
          : `rgba(255,255,255,0.03)`,
        border: `1px solid ${hovered ? accent + '50' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? `0 0 20px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo Badge */}
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-black leading-none shrink-0 transition-all duration-300"
        style={{
          background: `${tech.color}22`,
          color: tech.color,
          border: `1px solid ${tech.color}40`,
          boxShadow: hovered ? `0 0 8px ${tech.color}55` : 'none',
        }}
      >
        {tech.icon}
      </div>

      {/* Name */}
      <span className="font-outfit text-[12px] font-medium text-white/80 whitespace-nowrap">{tech.name}</span>

      {/* Repo count badge */}
      <span
        className="ml-auto text-[9px] font-outfit font-semibold px-1.5 py-0.5 rounded-full shrink-0 transition-all duration-300"
        style={{
          background: hovered ? `${accent}22` : 'rgba(255,255,255,0.05)',
          color: hovered ? accent : 'rgba(255,255,255,0.4)',
          border: `1px solid ${hovered ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        {tech.repoCount} repo{tech.repoCount !== 1 ? 's' : ''}
      </span>

      {/* Hover: tooltip with repo names */}
      {hovered && tech.repos.length > 0 && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none"
          style={{ minWidth: '160px' }}
        >
          <div
            className="rounded-xl px-3 py-2.5 text-[10px] font-outfit text-white/70 leading-relaxed backdrop-blur-xl"
            style={{
              background: 'rgba(18,11,24,0.95)',
              border: `1px solid ${accent}30`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 16px ${accent}15`,
            }}
          >
            <div className="font-semibold text-white/90 mb-1.5 text-[9px] uppercase tracking-widest" style={{ color: accent }}>Used in</div>
            {tech.repos.slice(0, 3).map(r => (
              <div key={r} className="flex items-center gap-1.5 py-0.5">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: accent }} />
                <span className="truncate">{r}</span>
              </div>
            ))}
          </div>
          <div className="w-2.5 h-2.5 rotate-45 mx-3" style={{ background: `rgba(18,11,24,0.95)`, border: `1px solid ${accent}30`, borderTop: 'none', borderLeft: 'none', marginTop: '-5px' }} />
        </div>
      )}
    </div>
  );
}

function ClusterPanel({ cluster, index }: { cluster: typeof TECH_CLUSTERS[0]; index: number }) {
  return (
    <div
      className="cluster-panel relative rounded-2xl p-6 md:p-8 overflow-hidden"
      style={{
        background: 'rgba(18,11,24,0.6)',
        border: `1px solid ${cluster.accent}20`,
        backdropFilter: 'blur(24px)',
        boxShadow: `0 0 40px ${cluster.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Cluster ambient glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${cluster.glow} 0%, transparent 70%)` }}
      />

      {/* Category header */}
      <div className="relative flex items-center gap-3 mb-6">
        <div className="h-[1px] w-4 shrink-0" style={{ background: `linear-gradient(to right, ${cluster.accent}, transparent)` }} />
        <span
          className="font-outfit text-[10px] uppercase tracking-[0.28em] font-bold"
          style={{ color: cluster.accent }}
        >
          {cluster.label}
        </span>
        <div className="h-[1px] flex-1" style={{ background: `linear-gradient(to right, ${cluster.accent}40, transparent)` }} />
        <span
          className="font-outfit text-[9px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${cluster.accent}15`, color: cluster.accent, border: `1px solid ${cluster.accent}30` }}
        >
          {cluster.techs.length}
        </span>
      </div>

      {/* Tech pills grid */}
      <div className="relative flex flex-wrap gap-2">
        {cluster.techs.map((tech, i) => (
          <TechPill key={tech.name} tech={tech} accent={cluster.accent} delay={index * 80 + i * 40} />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const totalTechs = TECH_CLUSTERS.reduce((s, c) => s + c.techs.length, 0);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Section heading SplitText reveal
    if (headingRef.current) {
      const el = headingRef.current.querySelector('h2');
      if (el) {
        const split = new SplitType(el, { types: 'chars' });
        if (split.chars) {
          gsap.fromTo(split.chars,
            { opacity: 0, y: 35, filter: 'blur(8px)', rotateX: -60 },
            {
              opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0,
              duration: 1.0, stagger: 0.025, ease: 'back.out(1.4)',
              scrollTrigger: { trigger: headingRef.current, start: 'top 85%', invalidateOnRefresh: true }
            }
          );
        }
      }

      // Badge fade
      const badge = headingRef.current.querySelector('.section-badge');
      if (badge) {
        gsap.fromTo(badge,
          { opacity: 0, y: 16, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 88%' } }
        );
      }

      const sub = headingRef.current.querySelector('.section-sub');
      if (sub) {
        gsap.fromTo(sub,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
        );
      }
    }

    // Cluster panels stagger in
    const panels = gsap.utils.toArray<HTMLElement>('.cluster-panel');
    panels.forEach((panel, i) => {
      gsap.fromTo(panel,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, delay: i * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 88%', invalidateOnRefresh: true }
        }
      );
    });

    // Tech pills stagger in per panel
    const pills = gsap.utils.toArray<HTMLElement>('.tech-pill');
    pills.forEach((pill, i) => {
      gsap.fromTo(pill,
        { opacity: 0, y: 16, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, delay: i * 0.025, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: pill, start: 'top 92%', invalidateOnRefresh: true }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 bg-[#050307] text-[#F5F5F5] overflow-hidden">

      {/* Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C084FC, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #FDBA74, transparent 70%)' }} />
        {/* Pollen particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20"
            style={{
              background: i % 2 === 0 ? '#C084FC' : '#FDBA74',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Heading */}
        <div ref={headingRef} className="mb-20 text-center flex flex-col items-center gap-5">
          <div className="section-badge opacity-0 inline-flex items-center gap-2.5 border border-[#C084FC]/20 px-4 py-1.5 rounded-full bg-[#2D122D]/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C084FC] font-outfit font-medium">Technology Ecosystem</span>
          </div>

          <h2 className="font-playfair text-[clamp(36px,5vw,72px)] font-normal tracking-tight leading-none">
            TECHNICAL <span className="font-serif italic text-[#C084FC]">EXPERTISE</span>
          </h2>

          <p className="section-sub opacity-0 text-[#A7A7A7] font-outfit text-sm max-w-lg text-center leading-relaxed">
            {totalTechs} technologies detected across {TECH_CLUSTERS.length} domains — sourced directly from my pinned GitHub repositories.
          </p>
        </div>

        {/* Tech Cluster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {TECH_CLUSTERS.map((cluster, i) => (
            <ClusterPanel key={cluster.id} cluster={cluster} index={i} />
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="mt-20 flex justify-center">
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#C084FC]/30 to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-14px) rotate(15deg); }
        }
      `}</style>
    </section>
  );
}
