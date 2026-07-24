import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { fetchLiveProjects, MergedProject } from '../lib/github';
import { refreshScrollEngine } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [projects, setProjects] = useState<MergedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedProject, setSelectedProject] = useState<MergedProject | null>(null);
  const [windowState, setWindowState] = useState<'normal' | 'minimized' | 'fullscreen'>('normal');
  const [iframeError, setIframeError] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Fetch live projects
  useEffect(() => {
    setIsLoading(true);
    fetchLiveProjects().then(data => {
      setProjects(data);
      setIsLoading(false);
    });
  }, []);

  // Build the pinned horizontal scroll ONLY when projects are loaded
  useGSAP(() => {
    if (isLoading || projects.length === 0 || !trackRef.current || !sectionRef.current || !pinWrapRef.current) return;

    // Kill any previous instance
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    // Wait one frame for DOM to settle
    const rafId = requestAnimationFrame(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.proj-card');
      if (cards.length === 0) return;

      const CARD_W = cards[0].offsetWidth + 32; // width + gap
      const totalScroll = CARD_W * (cards.length - 1) + 120;

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: pinWrapRef.current,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const x = -self.progress * totalScroll;
          gsap.set(trackRef.current, { x, force3D: true });

          // Determine active card
          const viewCenter = window.innerWidth / 2;
          let closest = 0;
          let minDist = Infinity;
          cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const dist = Math.abs(rect.left + rect.width / 2 - viewCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          setActiveIndex(closest);
        }
      });

      scrollTriggerRef.current = st;
      refreshScrollEngine();
    });

    return () => {
      cancelAnimationFrame(rafId);
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };

  }, { scope: sectionRef, dependencies: [projects, isLoading] });

  // Heading reveal — runs ONCE after mount, guarded by a ref flag
  useGSAP(() => {
    if (!headingRef.current) return;
    const h2 = headingRef.current.querySelector('h2');
    if (!h2) return;
    // Guard: only split if not already split
    if (h2.querySelector('.word')) return;
    const split = new SplitType(h2, { types: 'words' });
    if (split.words) {
      gsap.fromTo(split.words,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.0, stagger: 0.04, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', invalidateOnRefresh: true }
        }
      );
    }
  }, { scope: sectionRef, dependencies: [] });

  // Modal management
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject && windowState !== 'minimized') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject, windowState]);

  const openModal = useCallback((project: MergedProject) => {
    setSelectedProject(project);
    setWindowState('normal');
    setIframeError(false);
    setIsIframeLoading(true);
  }, []);

  const closeModal = useCallback(() => {
    if (modalContentRef.current) {
      gsap.to(modalContentRef.current, {
        scale: 0.88, opacity: 0, y: 30, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          setSelectedProject(null);
          setWindowState('normal');
        }
      });
    } else {
      setSelectedProject(null);
    }
  }, []);

  const rotations = [-2.2, 2, -1.8, 2.2, -2, 1.8, -1.5, 2.5];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative text-[#F5F5F5] z-[10]"
      style={{ background: '#08060A' }}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[#08060A] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.10)_0%,_transparent_65%)] pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(#C084FC_1px,_transparent_1px)] [background-size:40px_40px] opacity-[0.07] pointer-events-none z-[1]" />

      {/* Pin Wrapper — solid bg so sections below don't bleed through during GSAP pin */}
      <div ref={pinWrapRef} className="h-screen w-full overflow-hidden flex flex-col justify-between pt-16 pb-6 relative z-[2]" style={{ background: '#08060A' }}>

        {/* Section Header */}
        <div ref={headingRef} className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-3 relative z-[10]">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#C084FC]/20 px-3.5 py-1 rounded-full bg-[#2D122D]/40 mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#C084FC] font-outfit font-medium">GITHUB LIVE SYNC</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.1] text-[#F5F5F5]">
              FEATURED <span className="font-serif italic text-[#FDBA74]">REPOSITORIES</span>
            </h2>
          </div>
          <div className="text-[10px] font-mono text-[#C084FC] uppercase tracking-widest hidden md:block">
            {activeIndex + 1} / {projects.length} • Drag or scroll →
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="relative w-full overflow-visible my-auto py-4 z-[10]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[55vh] gap-3 text-xs font-outfit text-[#A7A7A7] uppercase tracking-widest">
              <div className="w-5 h-5 border-2 border-[#C084FC] border-t-transparent rounded-full animate-spin" />
              Fetching Repositories...
            </div>
          ) : (
            <div
              ref={trackRef}
              className="flex items-center gap-8 px-16 w-max will-change-transform"
              style={{ transform: 'translateX(0px)' }}
            >
              {projects.map((project, idx) => {
                const isActive = idx === activeIndex;
                const rot = isActive ? 0 : rotations[idx % rotations.length];
                return (
                  <div
                    key={project.id}
                    onClick={() => openModal(project)}
                    className={`proj-card relative group w-[340px] md:w-[400px] h-[55vh] max-h-[460px] rounded-2xl border p-5 flex flex-col justify-between cursor-pointer bg-[#120B18]/70 backdrop-blur-xl will-change-transform transition-all duration-400 ease-out`}
                    style={{
                      transform: `rotateZ(${rot}deg) scale(${isActive ? 1.04 : 0.94})`,
                      opacity: isActive ? 1 : 0.5,
                      borderColor: isActive ? 'rgba(192,132,252,0.6)' : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive ? '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(192,132,252,0.12)' : '0 8px 30px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Top metadata */}
                    <div className="flex justify-between items-center z-[10]">
                      {project.category && (
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FDBA74] animate-pulse' : 'bg-white/30'}`} />
                          <span className={`text-[10px] font-outfit uppercase tracking-[0.18em] ${isActive ? 'text-[#FDBA74]' : 'text-[#A7A7A7]'}`}>
                            {project.category}
                          </span>
                        </div>
                      )}
                      {project.updated_date_formatted && (
                        <span className="text-[9px] font-outfit uppercase tracking-[0.15em] text-[#A7A7A7] border border-white/10 px-2 py-0.5 rounded-full">
                          {project.updated_date_formatted}
                        </span>
                      )}
                    </div>

                    {/* Cover image */}
                    <div className="relative w-full h-[52%] rounded-xl overflow-hidden border border-white/10 bg-black/40 z-[10]">
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08060A] via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 rounded-full bg-[#C084FC] text-[#08060A] font-outfit text-xs font-bold uppercase tracking-wider">
                          Launch ↗
                        </span>
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col z-[10]">
                      <h3 className={`font-general text-lg font-bold mb-1 truncate transition-colors ${isActive ? 'text-[#F5F5F5]' : 'text-[#A7A7A7]'}`}>
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="font-outfit text-xs text-[#A7A7A7] line-clamp-2 leading-relaxed mb-3">
                          {project.description}
                        </p>
                      )}
                      {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech_stack.slice(0, 4).map(tech => (
                            <span key={tech} className="px-2 py-0.5 border border-[#C084FC]/20 rounded-full text-[8.5px] font-outfit uppercase tracking-wider text-[#A7A7A7] bg-[#2D122D]/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom instruction */}
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center text-[10px] font-outfit text-[#A7A7A7] uppercase tracking-[0.2em] relative z-[10]">
          <span>SCROLL TO EXPLORE</span>
          <span>CLICK CARD TO PREVIEW ↗</span>
        </div>
      </div>

      {/* Project Window Modal */}
      {selectedProject && windowState !== 'minimized' && (
        <div ref={modalRef} className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
          <div
            ref={modalContentRef}
            className={`relative flex flex-col bg-[#0D0B10]/95 border border-[#C084FC]/20 rounded-[20px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)] transition-all duration-400 ${
              windowState === 'fullscreen' ? 'w-full h-full rounded-none border-none' : 'w-[88vw] h-[88vh] max-w-[1400px]'
            }`}
          >
            {/* Title Bar */}
            <div className="h-12 bg-[#16101D]/90 border-b border-white/10 px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={closeModal} className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] group cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">✕</span>
                </button>
                <button
                  onClick={() => setWindowState('minimized')}
                  className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] group cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">−</span>
                </button>
                <button
                  onClick={() => setWindowState(prev => prev === 'fullscreen' ? 'normal' : 'fullscreen')}
                  className="w-3.5 h-3.5 rounded-full bg-[#F472B6] border border-[#C084FC] group cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[7px] text-black font-bold">⤢</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#08060A]/80 border border-white/10 rounded-lg px-4 py-1 max-w-[400px] w-full mx-4 text-xs font-mono text-[#A7A7A7] truncate">
                <span className="text-[#C084FC]">🔒</span>
                <span className="truncate">{selectedProject.demo_url}</span>
              </div>

              <div className="flex items-center gap-2">
                <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C084FC] text-[#08060A] font-outfit text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors">
                  Live ↗
                </a>
                <a href={selectedProject.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-outfit text-xs hover:bg-white/20 transition-colors">
                  GitHub ↗
                </a>
              </div>
            </div>

            {/* iFrame Content */}
            <div className="relative flex-1 w-full bg-[#08060A] overflow-hidden">
              {isIframeLoading && !iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0B10] gap-3 z-[10]">
                  <div className="w-8 h-8 border-2 border-[#C084FC] border-t-transparent rounded-full animate-spin" />
                  <span className="font-outfit text-xs text-[#A7A7A7] tracking-widest uppercase">Loading Preview...</span>
                </div>
              )}
              {iframeError ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-2xl mb-4">🌐</div>
                  <h3 className="text-lg font-bold text-white mb-2">Preview Restricted</h3>
                  <p className="text-sm text-[#A7A7A7] max-w-md mb-6">This site blocks iframe embedding. Open directly in a new tab.</p>
                  <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-full bg-[#C084FC] text-black font-bold text-xs uppercase tracking-wider">
                    Open Live Demo ↗
                  </a>
                </div>
              ) : (
                <iframe
                  src={selectedProject.demo_url}
                  title={selectedProject.title}
                  onLoad={() => setIsIframeLoading(false)}
                  onError={() => { setIsIframeLoading(false); setIframeError(true); }}
                  className="w-full h-full border-none"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Minimized Dock */}
      {selectedProject && windowState === 'minimized' && (
        <div onClick={() => setWindowState('normal')} className="fixed bottom-6 right-6 z-[300] bg-[#120B18]/90 border border-[#C084FC]/30 p-3 rounded-2xl backdrop-blur-2xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform shadow-2xl">
          <img src={selectedProject.cover_image} alt={selectedProject.title} className="w-8 h-8 rounded-lg object-cover border border-white/20" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">{selectedProject.title}</span>
            <span className="text-[9px] text-[#FDBA74]">Click to restore</span>
          </div>
        </div>
      )}
    </section>
  );
}
