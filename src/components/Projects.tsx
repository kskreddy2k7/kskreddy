import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Project } from '../types';
import MacOSModal from './MacOSModal';
import SplitType from 'split-type';
import { projects } from '../data';

gsap.registerPlugin(ScrollTrigger);

const CoverImage = ({ repo, language }: { repo: string, language: string }) => {
  const [extIndex, setExtIndex] = useState(0);
  const extensions = ['webp', 'png', 'jpg', 'jpeg'];
  const [failed, setFailed] = useState(false);

  if (failed) {
    const initials = repo.substring(0, 2).toUpperCase();
    const color = language === 'TypeScript' ? '#3178C6' : language === 'JavaScript' ? '#F7DF1E' : language === 'Python' ? '#3776AB' : '#C084FC';
    
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}15, #050307)` }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")', backgroundSize: '100px 100px' }} />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <span className="relative z-10 font-playfair italic text-6xl text-white/40 tracking-widest">{initials}</span>
      </div>
    );
  }

  return (
    <img 
      src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/projects/${repo}/cover.${extensions[extIndex]}`}
      alt={repo}
      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]"
      onError={() => {
        if (extIndex < extensions.length - 1) {
          setExtIndex(prev => prev + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  
  // Modal State
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [windowState, setWindowState] = useState<'closed' | 'open' | 'minimized' | 'fullscreen'>('closed');
  const [activeView, setActiveView] = useState<'demo' | 'source'>('demo');
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const openModal = (project: Project, view: 'demo' | 'source', e: React.MouseEvent) => {
    const card = (e.currentTarget as HTMLElement).closest('.project-card-wrapper');
    const rect = card ? card.getBoundingClientRect() : (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOriginRect(rect);
    setActiveProject(project);
    setActiveView(view);
    setWindowState('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setWindowState('closed');
    setTimeout(() => {
      setActiveProject(null);
      setOriginRect(null);
      document.body.style.overflow = 'auto';
    }, 500);
  };

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current || !pinWrapperRef.current) return;

    // Heading Reveal
    const h2 = headingRef.current?.querySelector('h2');
    if (h2) {
      const split = new SplitType(h2, { types: 'chars' });
      gsap.fromTo(split.chars, 
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, stagger: 0.03, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      
      const subtitle = headingRef.current?.querySelector('.subtitle-block');
      if (subtitle) {
        gsap.fromTo(subtitle,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 1.2, delay: 0.6, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
        );
      }
    }

    if (headingRef.current) {
      const h2 = headingRef.current.querySelector('h2');
      if (h2 && !h2.querySelector('.word')) {
        const split = new SplitType(h2, { types: 'words,chars' });
        if (split.chars) {
          gsap.fromTo(split.chars,
            { opacity: 0, y: 50, rotateX: -90 },
            {
              opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.02, ease: 'power4.out',
              scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
            }
          );
        }
      }
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const cards = gsap.utils.toArray<HTMLElement>('.project-card-wrapper');
    if (cards.length === 0) return;

    const getTotalScroll = () => {
      if (!trackRef.current || cards.length === 0) return 0;
      const cardWidth = cards[0].offsetWidth;
      const trackStyle = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(trackStyle.gap) || 0;
      return (cards.length - 1) * (cardWidth + gap);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: pinWrapperRef.current,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getTotalScroll() * 1.6}`, // Cinematic pacing
        invalidateOnRefresh: true,
      }
    });

    tl.to(trackRef.current, {
      x: () => -getTotalScroll(),
      ease: 'none',
      onUpdate: function() {
        const screenCenter = window.innerWidth / 2;
        
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - screenCenter);
          
          let scale, y, opacity, blur;
          if (dist < 400) {
            // Active (0) to Neighbor (400)
            const progress = 1 - (dist / 400); // 1 = Active, 0 = Neighbor
            scale = 0.92 + (0.10 * progress);
            y = 25 - (37 * progress); // 25 -> -12
            opacity = 0.75 + (0.25 * progress);
            blur = 2 - (2 * progress); // 2 -> 0
          } else {
            // Neighbor (400) to Far (800+)
            const progress = Math.max(0, 1 - ((dist - 400) / 400)); // 1 = Neighbor, 0 = Far
            scale = 0.85 + (0.07 * progress);
            y = 60 - (35 * progress); // 60 -> 25
            opacity = 0.40 + (0.35 * progress);
            blur = 6 - (4 * progress); // 6 -> 2
          }

          const z = -120 + (120 * (dist < 400 ? (1 - dist/400) : 0));
          const brightness = dist < 400 ? 1 + (0.08 * (1 - dist/400)) : 1; 

          // RotateY (true Cover Flow)
          const delta = cardCenter - screenCenter;
          const sign = delta > 0 ? -1 : 1;
          const rotNorm = Math.min(1, Math.abs(delta) / 600);
          const rotationY = sign * rotNorm * 25; // max 25deg rotation
          
          gsap.set(card, {
            scale,
            y,
            z,
            rotationY,
            transformPerspective: 1200,
            opacity,
            filter: `blur(${blur}px) brightness(${brightness})`
          });

          // Cinematic Ambient Glow (Steady, no flashing)
          const glowContainer = card.querySelector('.active-glow-container');
          if (glowContainer) {
             const glowOpacity = dist < 300 ? Math.pow(1 - dist/300, 2) : 0;
             gsap.set(glowContainer, { opacity: glowOpacity });
          }

          // Active Highlights (Border / Dot)
          const activeBorder = card.querySelector('.active-border');
          const activeDot = card.querySelector('.active-dot');
          const glowIntensity = Math.pow(Math.max(0, 1 - dist/300), 3);
          if (activeBorder) gsap.set(activeBorder, { opacity: glowIntensity });
          if (activeDot) gsap.set(activeDot, { opacity: glowIntensity });

          // Spotlight Glow matching active card
          const glow = card.querySelector('.active-glow');
          if (glow) {
            const normalized = 1 - (dist / 800);
            const easeNorm = Math.max(0, (normalized - 0.7) * 3.33); 
            gsap.set(glow, { opacity: easeNorm });
          }
        });
      }
    });

    return () => {
      tl.kill();
    };
  }, { scope: sectionRef });

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const inner = card.querySelector('.card-inner');
    if (!inner) return;

    const moveHandler = (ev: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ev.clientX - rect.left - rect.width / 2;
      const y = ev.clientY - rect.top - rect.height / 2;
      
      gsap.to(inner, {
        rotationY: (x / rect.width) * 12,
        rotationX: -(y / rect.height) * 12,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.6
      });
      
      const reflection = card.querySelector('.glass-reflection');
      if (reflection) {
        gsap.to(reflection, {
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: 0.8,
          ease: 'power2.out',
          duration: 0.6
        });
      }
    };
    
    card.addEventListener('mousemove', moveHandler);
    card.addEventListener('mouseleave', () => {
      card.removeEventListener('mousemove', moveHandler);
      gsap.to(inner, { rotationY: 0, rotationX: 0, ease: 'power3.out', duration: 1.2 });
      
      const reflection = card.querySelector('.glass-reflection');
      if (reflection) {
        gsap.to(reflection, { x: 0, y: 0, opacity: 0, ease: 'power3.out', duration: 1.2 });
      }
    }, { once: true });
    
    window.dispatchEvent(new CustomEvent('set-cursor-mode', { detail: { mode: 'explore' } }));
  };

  const handleCardMouseLeave = () => {
    window.dispatchEvent(new CustomEvent('set-cursor-mode', { detail: { mode: 'default' } }));
  };



  return (
    <section id="projects" ref={sectionRef} className="relative bg-[#08060A] min-h-[200vh] text-[#F5F5F5] overflow-hidden pb-48 selection:bg-[#C084FC]/30">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(192,132,252,0.02)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.95\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")', backgroundSize: '100px 100px' }} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-[#C084FC] opacity-[0.03] blur-sm animate-float-slow"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * -10}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>
      
      <div ref={pinWrapperRef} className="h-[100svh] w-full relative flex flex-col justify-center perspective-[1200px] overflow-hidden py-[4svh]">
        
        <div ref={headingRef} className="shrink-0 flex flex-col items-center text-center px-[clamp(40px,6vw,100px)] max-w-[1600px] w-full mx-auto relative">
          <div className="absolute top-2 right-[clamp(40px,6vw,100px)] items-center gap-2 text-[#A7A7A7] text-[10px] uppercase tracking-widest font-outfit hidden md:flex opacity-60">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg>
             <span>Scroll to explore</span>
          </div>
          
          <h2 className="font-playfair font-normal tracking-tight flex flex-row items-center gap-3 md:gap-4 leading-[0.85] perspective-[1000px]">
            <span className="text-[clamp(48px,7vw,96px)]">SELECTED</span>
            <span className="text-[clamp(48px,7vw,96px)] italic text-[#C084FC]">WORKS</span>
          </h2>
          
          <div className="subtitle-block flex items-center justify-center mt-6 px-4">
            <p className="text-[13px] md:text-[15px] font-outfit text-[#A7A7A7] font-light max-w-2xl text-center leading-relaxed">
              Dynamically generated from {projects.length} unique digital experiences discovered across my pinned repositories.
            </p>
          </div>
        </div>

        <div className="h-[clamp(40px,6vh,80px)] shrink-0" />

        <div className="relative w-full h-[clamp(450px,65svh,760px)] shrink-0">
          <div 
            ref={trackRef} 
            className="absolute left-0 flex h-full items-center will-change-transform"
            style={{ 
              gap: 'clamp(24px, 4vw, 56px)',
              paddingLeft: 'calc(50vw - clamp(140px, 20vw, 230px))', 
              paddingRight: 'calc(50vw - clamp(140px, 20vw, 230px))'
            }}
          >
            {projects.map((project, i) => (
              <div 
                key={project.id} 
                className="project-card-wrapper shrink-0 relative cursor-none group will-change-transform"
                style={{ width: 'clamp(320px, 45svh, 520px)', height: 'clamp(450px, 65svh, 760px)', opacity: 0.6, transform: 'scale(0.90)' }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="active-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[140%] pointer-events-none mix-blend-screen opacity-0 transition-opacity duration-1000">
                   <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(192,132,252,0.12)_0%,_transparent_65%)] animate-breathe" />
                </div>
                
                <div className="w-full h-full animate-float-card group-hover:-translate-y-[6px] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" style={{ animationDelay: `${i * -1.5}s` }}>
                  
                  {/* Steady Background Glow */}
                  <div className="absolute inset-[-40px] pointer-events-none opacity-0 active-glow-container -z-10" style={{ transform: 'translateZ(-10px)' }}>
                     <div className="absolute inset-[-80px] bg-[#C084FC] opacity-[0.25] blur-[120px] rounded-full" />
                     <div className="absolute inset-[0px] bg-[#C084FC] opacity-[0.15] blur-[60px] rounded-full" />
                  </div>

                  <div className="card-inner relative w-full h-full rounded-[28px] overflow-hidden bg-[#0A070E] border border-white/[0.08] hover:border-t-white/30 hover:border-l-white/20 transition-all duration-700 flex flex-col group/glass z-10">
                     {/* Clean, intense neon border glow pushing OUTWARD only */}
                     <div className="active-border absolute inset-0 rounded-[28px] pointer-events-none opacity-0 z-20" style={{ boxShadow: '0 0 100px rgba(192, 132, 252, 0.8), 0 0 40px rgba(192, 132, 252, 0.6), 0 0 0 2px rgba(192, 132, 252, 1)' }} />
                     <div className="active-dot absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-[#C084FC] shadow-[0_0_12px_#C084FC] opacity-0 transition-opacity duration-300 z-30" />

                    <div className="w-full aspect-[16/10] relative overflow-hidden shrink-0 group-hover/glass:brightness-110 transition-all duration-700">
                      {/* Subtler gradient, only blending the very bottom edge */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A070E] via-[#0A070E]/5 to-transparent z-10" />
                      {/* Cinematic Vignette */}
                      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
                      {/* Reduced noise to stop washing out the image */}
                      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }} />
                      
                      <div className="w-full h-full scale-[1.02]">
                         <CoverImage repo={project.title} language={project.language || 'TypeScript'} />
                      </div>
                      
                      <div className="glass-reflection absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-0 pointer-events-none transition-opacity duration-700 z-20" />
                    </div>
                    
                    <div className="p-[clamp(16px,2vh,32px)] flex flex-col flex-1 relative bg-[#0A070E] z-10">
                      <div className="flex gap-2 mb-4 flex-wrap relative z-10">
                        {project.technologies?.slice(0, 3).map(t => (
                          <span key={t} className="text-[7.5px] md:text-[8.5px] font-outfit font-medium uppercase tracking-[0.15em] text-[#A7A7A7] border border-white/5 bg-white/[0.02] px-3.5 py-1.5 rounded-full backdrop-blur-md">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-[clamp(18px,2.5vh,28px)] font-playfair text-[#F5F5F5] mb-2 tracking-tight leading-tight line-clamp-2 relative z-10 font-normal">
                        -{project.title.replace(/\s+/g, '-')}
                      </h3>
                      <p className="text-[clamp(11px,1.5vh,13px)] font-outfit text-[#A7A7A7] line-clamp-3 leading-relaxed mb-4 font-light relative z-10">
                        {project.overview}
                      </p>
                      
                      <div className="mt-auto flex gap-4 w-full relative z-[9999] pt-2 pb-2">
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal(project, 'demo', e); }}
                          className="flex-1 h-[48px] bg-gradient-to-r from-[#C084FC] to-[#9333EA] text-white font-outfit text-[11px] font-bold tracking-[0.15em] uppercase rounded-full flex items-center justify-center gap-2.5 transition-all duration-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(192,132,252,0.4)] hover:shadow-[0_0_30px_rgba(192,132,252,0.7)] group relative overflow-hidden pointer-events-auto cursor-pointer"
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 w-[50%] -translate-x-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shine_1s_ease-in-out_forwards] skew-x-[-20deg]" />
                          <span className="relative z-10">View Live Demo</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal(project, 'source', e); }}
                          className="flex-1 h-[48px] bg-[#0A070E]/80 backdrop-blur-md text-[#C084FC] font-outfit text-[11px] font-bold tracking-[0.15em] uppercase rounded-full flex items-center justify-center gap-2.5 transition-all duration-500 border border-[#C084FC]/30 hover:border-[#C084FC] hover:bg-[#C084FC]/10 hover:scale-[1.02] group relative overflow-hidden pointer-events-auto cursor-pointer"
                        >
                          {/* Subtle inner glow on hover */}
                          <div className="absolute inset-0 bg-[#C084FC] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 group-hover:scale-110 transition-transform duration-300"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          <span className="relative z-10">Source Code</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      


      {/* Floating Dock for Minimized Window */}
      {windowState === 'minimized' && activeProject && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-end justify-center animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
            <button 
              onClick={() => setWindowState('open')}
              className="w-16 h-16 rounded-xl overflow-hidden relative group transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95 shadow-lg border border-white/10 bg-[#0A070E]"
            >
              <div className="absolute inset-0 bg-[#C084FC]/20 group-hover:bg-[#C084FC]/40 transition-colors z-10" />
              <img src={`/projects/${activeProject.title}/cover.webp`} alt="App Icon" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <div className="absolute inset-x-0 bottom-1 flex justify-center z-20">
                <div className="w-1 h-1 bg-white/80 rounded-full shadow-[0_0_4px_white]" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* MacOS Window Component */}
      {activeProject && (
        <MacOSModal 
          project={activeProject}
          activeView={activeView}
          windowState={windowState}
          setWindowState={setWindowState}
          originRect={originRect}
          onClose={closeModal}
        />
      )}

      {/* Global styles for animations & scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-breathe {
          animation: breathe 5s ease-in-out infinite;
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-card {
          animation: float-card 7s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}} />
    </section>
  );
}
