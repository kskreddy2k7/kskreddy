import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { fetchLiveProjects, MergedProject } from '../lib/github';

gsap.registerPlugin(ScrollTrigger);

export type TechItem = {
  name: string;
  category: string;
  rating: number;
  iconSvg: string;
  brandColor: string;
  relatedTech: string[];
};

const ARSENAL_TECHS: TechItem[] = [
  { name: 'React', category: 'Frontend Engineering', rating: 5, brandColor: '#61DAFB', relatedTech: ['TypeScript', 'Next.js', 'GSAP'], iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></svg>` },
  { name: 'TypeScript', category: 'Frontend Engineering', rating: 5, brandColor: '#3178C6', relatedTech: ['React', 'Node.js'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm10.7 13.8c.4.6.9 1.1 1.7 1.1.8 0 1.2-.4 1.2-.9 0-.6-.5-.9-1.5-1.3l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.8 0-1.4 1.2-2.5 3-2.5 1.3 0 2.2.5 2.8 1.5l-1.3.9c-.3-.5-.7-.8-1.4-.8-.7 0-1.1.3-1.1.8 0 .5.4.8 1.3 1.1l.5.2c1.7.7 2.6 1.4 2.6 2.9 0 1.7-1.3 2.7-3.4 2.7-1.7 0-2.8-.7-3.5-1.9l1.4-.8zm-4.3-.2v-7.2h-2.3V8.2h6.3v1.4h-2.3v7.2H9.4z"/></svg>` },
  { name: 'Tailwind CSS', category: 'Frontend Engineering', rating: 5, brandColor: '#06B6D4', relatedTech: ['React', 'CSS'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>` },
  { name: 'GSAP', category: 'Frontend Engineering', rating: 5, brandColor: '#C084FC', relatedTech: ['React', 'JavaScript'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
  { name: 'Node.js', category: 'Backend & Cloud', rating: 5, brandColor: '#339933', relatedTech: ['Express', 'MongoDB'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.31l7.66 4.21v8.42L12 21.15l-7.66-4.21V8.52L12 4.31z"/></svg>` },
  { name: 'Express', category: 'Backend & Cloud', rating: 4, brandColor: '#FFFFFF', relatedTech: ['Node.js', 'MongoDB'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>` },
  { name: 'MongoDB', category: 'Backend & Cloud', rating: 4, brandColor: '#47A248', relatedTech: ['Node.js'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s-7 7.05-7 12a7 7 0 0 0 14 0c0-4.95-7-12-7-12zm0 17a5 5 0 0 1-5-5c0-2.8 3.5-7.3 5-9.1 1.5 1.8 5 6.3 5 9.1a5 5 0 0 1-5 5z"/></svg>` },
  { name: 'Netlify', category: 'Backend & Cloud', rating: 5, brandColor: '#00C7B7', relatedTech: ['React'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.2 3.6L12 1.3l5.8 2.3L22 7.7v8.6l-4.2 4.1L12 22.7l-5.8-2.3L2 16.3V7.7l4.2-4.1z"/></svg>` },
  { name: 'Python', category: 'AI & Machine Learning', rating: 5, brandColor: '#3776AB', relatedTech: ['Scikit-Learn', 'NLP'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.9 2c-5.3 0-4.9 2.3-4.9 2.3v2.4h5v.7H5s-3 0-3 4.3 2.6 4.2 2.6 4.2h1.6v-2.3c0-2.6 2.3-2.5 2.3-2.5h5s2.2 0 2.2-2.3V4.3S16.2 2 11.9 2zm-2.4 1.5a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm2.6 18.5c5.3 0 4.9-2.3 4.9-2.3v-2.4h-5v-.7h7s3 0 3-4.3-2.6-4.2-2.6-4.2h-1.6v2.3c0 2.6-2.3 2.5-2.3 2.5h-5s-2.2 0-2.2 2.3v4.4s-.5 2.4 3.8 2.4zm2.4-1.5a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"/></svg>` },
  { name: 'Scikit-Learn', category: 'AI & Machine Learning', rating: 4, brandColor: '#F7931E', relatedTech: ['Python', 'NLP'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8z"/></svg>` },
  { name: 'Streamlit', category: 'AI & Machine Learning', rating: 5, brandColor: '#FF4B4B', relatedTech: ['Python'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 4.2l7.8 13.3H4.2L12 6.2z"/></svg>` },
  { name: 'NLP', category: 'AI & Machine Learning', rating: 5, brandColor: '#FDBA74', relatedTech: ['Python', 'Scikit-Learn'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>` },
  { name: 'JavaScript', category: 'Programming Languages', rating: 5, brandColor: '#F7DF1E', relatedTech: ['React', 'TypeScript'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm11.5 12.7c.6.9 1.5 1.5 2.7 1.5 1.2 0 1.9-.5 1.9-1.3 0-.9-.7-1.2-2.1-1.7l-.7-.3c-2-.8-3.3-1.8-3.3-4.1 0-2.3 1.8-4 4.5-4 2.1 0 3.5.7 4.4 2.3l-1.9 1.2c-.6-1-1.3-1.4-2.5-1.4-1.2 0-1.8.6-1.8 1.3 0 .8.6 1.1 1.9 1.6l.7.3c2.3.9 3.6 1.9 3.6 4.3 0 2.7-2.1 4.2-5.1 4.2-2.7 0-4.3-1.2-5.2-2.8l1.9-1.1zM6.6 17.5l2-1.2c.5.8 1 1.4 2 1.4 1 0 1.6-.4 1.6-1.6v-7.8h2.6v8c0 2.6-1.5 3.9-4 3.9-2.3 0-3.6-1.1-4.2-2.7z"/></svg>` },
  { name: 'HTML', category: 'Programming Languages', rating: 5, brandColor: '#E34F26', relatedTech: ['CSS', 'JavaScript'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm15.7 6.4H7.2l.3 3.4h9.4l-.8 9.3-4.1 1.1-4.1-1.1-.3-3.4H11l.1 1.7 1-.3 1-.3.2-2.3H4.4L3.6 3h14.1l-.5 3.4z"/></svg>` },
  { name: 'CSS', category: 'Programming Languages', rating: 5, brandColor: '#1572B6', relatedTech: ['HTML', 'Tailwind CSS'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm15.7 6.4H7.2l.3 3.4h9.4l-.8 9.3-4.1 1.1-4.1-1.1-.3-3.4H11l.1 1.7 1-.3 1-.3.2-2.3H4.4L3.6 3h14.1l-.5 3.4z"/></svg>` },
  { name: 'Git', category: 'Programming Languages', rating: 5, brandColor: '#F05032', relatedTech: ['GitHub'], iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 10.9L13.1 2.4c-.8-.8-2.1-.8-2.9 0L8.7 3.9l3.7 3.7c.6-.2 1.3-.1 1.8.4.5.5.6 1.3.3 1.9l3.5 3.5c.6-.3 1.4-.2 1.9.3.7.7.7 1.8 0 2.5s-1.8.7-2.5 0c-.5-.5-.6-1.3-.3-1.9l-3.3-3.3v4.4c.2.1.4.3.5.5.7.7.7 1.8 0 2.5s-1.8.7-2.5 0c-.7-.7-.7-1.8 0-2.5.3-.3.8-.5 1.3-.5V10c-.5 0-1-.2-1.3-.5L6.6 6 2.4 10.2c-.8.8-.8 2.1 0 2.9l8.5 8.5c.8.8 2.1.8 2.9 0l7.8-7.8c.8-.8.8-2.1 0-2.9z"/></svg>` },
];

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<MergedProject[]>([]);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchLiveProjects().then(data => setProjects(data));
  }, []);

  const getTechUsageCount = (techName: string): number => {
    if (projects.length === 0) return 1;
    const lower = techName.toLowerCase();
    return projects.filter(p =>
      p.tech_stack.some(t => t.toLowerCase().includes(lower)) ||
      p.category.toLowerCase().includes(lower) ||
      p.language?.toLowerCase().includes(lower)
    ).length;
  };

  const getMatchingProjects = (techName: string): MergedProject[] => {
    const lower = techName.toLowerCase();
    return projects.filter(p =>
      p.tech_stack.some(t => t.toLowerCase().includes(lower)) ||
      p.category.toLowerCase().includes(lower) ||
      p.language?.toLowerCase().includes(lower)
    ).slice(0, 2);
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    // Heading reveal
    if (headingRef.current) {
      const el = headingRef.current.querySelector('h2');
      if (el) {
        const split = new SplitType(el, { types: 'words' });
        if (split.words) {
          gsap.fromTo(split.words,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 1.0, stagger: 0.04, ease: 'power4.out',
              scrollTrigger: { trigger: headingRef.current, start: 'top bottom', once: true, invalidateOnRefresh: true }
            }
          );
        }
      }
    }

    // Category cards stagger
    const cats = gsap.utils.toArray<HTMLElement>('.arsenal-category');
    cats.forEach((cat) => {
      gsap.fromTo(cat,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: cat, start: 'top bottom', once: true, invalidateOnRefresh: true }
        }
      );
    });
  }, { scope: containerRef });

  const categoryNames = Array.from(new Set(ARSENAL_TECHS.map(t => t.category)));

  return (
    <section
      id="skills"
      ref={containerRef}
      className="py-20 md:py-24 relative bg-[#08060A] text-[#F5F5F5] overflow-hidden z-[10]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(88,28,135,0.10)_0%,_transparent_65%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#C084FC_1px,_transparent_1px)] [background-size:40px_40px] opacity-[0.07] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-[10]">

        {/* Header */}
        <div ref={headingRef} className="mb-12 md:mb-14 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 border border-[#C084FC]/20 px-3.5 py-1 rounded-full bg-[#2D122D]/40 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#C084FC] font-outfit font-medium">CAPABILITIES & ARSENAL</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-general font-bold tracking-tight uppercase leading-[0.95] mb-5 text-[#F5F5F5]">
            DEVELOPER <span className="text-[#FDBA74] font-serif italic font-normal lowercase">Arsenal</span>
          </h2>
          <p className="text-[#A7A7A7] text-sm md:text-base font-outfit font-light max-w-2xl leading-relaxed">
            Real-time GitHub analytics driving an interactive technology ecosystem built for production scale.
          </p>
        </div>

        {/* Category Cluster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {categoryNames.map((catName, idx) => {
            const catTechs = ARSENAL_TECHS.filter(t => t.category === catName);
            const totalRepos = catTechs.reduce((acc, t) => acc + getTechUsageCount(t.name), 0);
            const mostUsed = [...catTechs].sort((a, b) => getTechUsageCount(b.name) - getTechUsageCount(a.name))[0];

            return (
              <div
                key={catName}
                className="arsenal-category p-6 md:p-8 rounded-3xl bg-[#120B18]/60 border border-white/10 hover:border-[#C084FC]/30 backdrop-blur-xl transition-all duration-400 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-outfit text-[#FDBA74] font-semibold tracking-widest uppercase block mb-1">
                      0{idx + 1} • CATEGORY
                    </span>
                    <h3 className="text-xl md:text-2xl font-general font-bold text-[#F5F5F5] uppercase">
                      {catName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-outfit text-[#A7A7A7] block">{catTechs.length} Techs • {totalRepos} Repos</span>
                    {mostUsed && <span className="text-[10px] text-[#C084FC] font-mono">Top: {mostUsed.name}</span>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {catTechs.map(tech => {
                    const repoCount = getTechUsageCount(tech.name);
                    const isHovered = hoveredTech?.name === tech.name;
                    const isRelated = hoveredTech?.relatedTech.includes(tech.name);

                    return (
                      <div
                        key={tech.name}
                        onMouseEnter={(e) => {
                          setHoveredTech(tech);
                          setMousePos({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHoveredTech(null)}
                        className={`relative px-4 py-2.5 rounded-full border transition-all duration-250 flex items-center gap-2.5 cursor-pointer select-none ${
                          isHovered
                            ? 'bg-[#2D122D] border-[#C084FC] scale-105 z-[30]'
                            : isRelated
                            ? 'bg-[#2D122D]/50 border-[#FDBA74]/60 z-[20]'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 z-[10]'
                        }`}
                      >
                        <div
                          className="w-4 h-4 flex items-center justify-center shrink-0 transition-colors"
                          style={{ color: isHovered ? tech.brandColor : '#A7A7A7' }}
                          dangerouslySetInnerHTML={{ __html: tech.iconSvg }}
                        />
                        <span className={`text-xs font-outfit font-medium transition-colors ${isHovered ? 'text-white font-bold' : isRelated ? 'text-[#FDBA74]' : 'text-[#F5F5F5]'}`}>
                          {tech.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 rounded-full transition-colors ${isHovered ? 'bg-[#C084FC] text-black font-bold' : 'bg-white/10 text-[#A7A7A7]'}`}>
                          {repoCount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Tech Tooltip */}
      {hoveredTech && (
        <div
          className="fixed z-[500] pointer-events-none bg-[#160E1E]/95 border border-[#C084FC]/40 p-4 rounded-2xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-xs w-72"
          style={{
            left: `${Math.min(window.innerWidth - 300, mousePos.x + 16)}px`,
            top: `${Math.min(window.innerHeight - 210, mousePos.y + 16)}px`,
          }}
        >
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ color: hoveredTech.brandColor }} dangerouslySetInnerHTML={{ __html: hoveredTech.iconSvg }} />
              <span className="text-sm font-bold text-white">{hoveredTech.name}</span>
            </div>
            <span className="text-[#FDBA74] text-xs">{'★'.repeat(hoveredTech.rating)}</span>
          </div>
          <p className="text-[11px] font-outfit text-[#A7A7A7] mb-3">
            Used in <span className="text-[#C084FC] font-bold">{getTechUsageCount(hoveredTech.name)} repositories</span>
          </p>
          {getMatchingProjects(hoveredTech.name).length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-[#A7A7A7] font-mono">Sample Projects:</span>
              {getMatchingProjects(hoveredTech.name).map(p => (
                <div key={p.id} className="flex justify-between text-[10px] text-white">
                  <span className="truncate font-medium">{p.title}</span>
                  <span className="text-[#FDBA74] ml-2">↗</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
