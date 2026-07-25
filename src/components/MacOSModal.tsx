import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Project } from '../types';

interface MacOSModalProps {
  project: Project;
  activeView: 'demo' | 'source';
  windowState: 'open' | 'minimized' | 'fullscreen' | 'closed';
  setWindowState: (state: 'open' | 'minimized' | 'fullscreen' | 'closed') => void;
  originRect: DOMRect | null;
  onClose: () => void;
}

export default function MacOSModal({ project, activeView, windowState, setWindowState, originRect, onClose }: MacOSModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'source'>(activeView);
  
  // Custom cursor management
  useEffect(() => {
    if (windowState === 'open' || windowState === 'fullscreen') {
      window.dispatchEvent(new CustomEvent('set-cursor-mode', { detail: { mode: 'precision' } }));
    } else {
      window.dispatchEvent(new CustomEvent('set-cursor-mode', { detail: { mode: 'default' } }));
    }
    return () => {
      window.dispatchEvent(new CustomEvent('set-cursor-mode', { detail: { mode: 'default' } }));
    };
  }, [windowState]);

  const isInitialOpen = useRef(true);

  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    gsap.killTweensOf([modalRef.current, overlayRef.current, contentRef.current]);

    if (windowState === 'open') {
      if (isInitialOpen.current && originRect) {
        // Initial setup from card position
        gsap.set(modalRef.current, {
          x: originRect.left - (window.innerWidth / 2) + (originRect.width / 2),
          y: originRect.top - (window.innerHeight / 2) + (originRect.height / 2),
          scaleX: originRect.width / Math.min(window.innerWidth * 0.9, 1200),
          scaleY: originRect.height / Math.min(window.innerHeight * 0.9, 800),
          opacity: 0,
          borderRadius: 28,
        });
        isInitialOpen.current = false;
      }

      gsap.to(modalRef.current, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        borderRadius: 20,
        width: '100%',
        maxWidth: '1152px', // 6xl
        height: '90vh',
        duration: 0.8,
        ease: 'power4.inOut'
      });

      gsap.to(overlayRef.current, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
      gsap.to(contentRef.current, { opacity: 1, duration: 0.5, delay: 0.1 });
    }
    
    if (windowState === 'fullscreen') {
      gsap.to(modalRef.current, {
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        borderRadius: 0,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.inOut'
      });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.6 });
    }

    if (windowState === 'minimized') {
      // Animate to bottom center dock
      gsap.to(modalRef.current, {
        scaleX: 0,
        scaleY: 0,
        y: window.innerHeight / 2,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut'
      });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.6 });
    }

    // Don't use ctx.revert() so we can smoothly transition between states, 
    // but DO kill tweens on unmount to prevent memory leaks
    return () => {
      gsap.killTweensOf([modalRef.current, overlayRef.current, contentRef.current]);
    };
  }, [windowState, originRect]);

  const handleClose = () => {
    if (!modalRef.current || !originRect) return onClose();
    
    // Animate back to card
    gsap.to(modalRef.current, {
      x: originRect.left - (window.innerWidth / 2) + (originRect.width / 2),
      y: originRect.top - (window.innerHeight / 2) + (originRect.height / 2),
      scaleX: originRect.width / Math.min(window.innerWidth * 0.9, 1200),
      scaleY: originRect.height / Math.min(window.innerHeight * 0.9, 800),
      opacity: 0,
      duration: 0.7,
      ease: 'power4.inOut',
      onComplete: onClose
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.6 });
    gsap.to(contentRef.current, { opacity: 0, duration: 0.3 });
  };

  if (windowState === 'closed') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Background Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-[#050307]/80 backdrop-blur-[16px] pointer-events-auto opacity-0"
        onClick={handleClose}
      />
      
      {/* macOS Window */}
      <div 
        ref={modalRef}
        className="relative bg-[#120B18]/95 backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col transform-gpu pointer-events-auto opacity-0"
      >
        
        {/* macOS Title Bar */}
        <div className="h-12 bg-[#2c2c2e]/40 border-b border-white/5 flex items-center px-4 shrink-0 justify-between select-none">
          <div className="flex gap-2 w-20 group/lights">
            {/* Close */}
            <button onClick={handleClose} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center transition-all active:scale-95 active:brightness-90">
              <span className="opacity-0 group-hover/lights:opacity-100 text-[#4D0000] text-[7px] leading-none mb-[1px]">✕</span>
            </button>
            {/* Minimize */}
            <button onClick={() => setWindowState('minimized')} className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center transition-all active:scale-95 active:brightness-90">
              <span className="opacity-0 group-hover/lights:opacity-100 text-[#995700] text-[7px] leading-none mb-[2px] font-bold">-</span>
            </button>
            {/* Fullscreen */}
            <button onClick={() => setWindowState(windowState === 'fullscreen' ? 'open' : 'fullscreen')} className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center transition-all active:scale-95 active:brightness-90">
              <svg className="opacity-0 group-hover/lights:opacity-100 text-[#006500] w-2 h-2" viewBox="0 0 15 15" fill="none"><path d="M5 4.5H3V6.5M3 4.5V2.5H5M10 4.5H12V6.5M12 4.5V2.5H10M5 10.5H3V8.5M3 10.5V12.5H5M10 10.5H12V8.5M12 10.5V12.5H10" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
          </div>
          
          <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-1 text-[10px] font-outfit uppercase tracking-widest rounded-md transition-all ${activeTab === 'demo' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
            >
              Browser
            </button>
            <button 
              onClick={() => setActiveTab('source')}
              className={`px-4 py-1 text-[10px] font-outfit uppercase tracking-widest rounded-md transition-all ${activeTab === 'source' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
            >
              GitHub
            </button>
          </div>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 w-full h-full bg-[#1c1c1e] flex flex-col relative opacity-0">
          
          {/* Safari Browser Toolbar */}
          <div className="h-14 bg-[#2c2c2e] flex items-center px-4 gap-4 border-b border-black/40 shrink-0">
            <div className="flex gap-4 text-white/50">
              <button className="hover:text-white transition-all active:scale-90 active:opacity-75">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="hover:text-white transition-all active:scale-90 active:opacity-75 opacity-50 cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button className="hover:text-white transition-all active:scale-90 active:opacity-75 ml-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
            
            <div className="flex-1 bg-black/30 rounded-lg h-8 flex items-center justify-center px-4 border border-white/5 mx-2 relative shadow-inner">
              <span className="text-white/60 text-[12px] font-outfit tracking-wide truncate flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                {activeTab === 'demo' && project.liveUrl ? project.liveUrl.replace('https://', '') : `github.com/kskreddy2k7/${project.title}`}
              </span>
              {/* Fake Loading Bar */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 rounded-bl-lg w-0 animate-[load_2s_ease-out_forwards]" />
            </div>
            
            <div className="flex gap-4 text-white/50">
              <button className="hover:text-white transition-all active:scale-90 active:opacity-75">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
              </button>
              <button className="hover:text-white transition-all active:scale-90 active:opacity-75">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
              </button>
            </div>
          </div>

          {/* Browser Viewport */}
          <div className="flex-1 w-full bg-white relative overflow-hidden">
            {activeTab === 'demo' ? (
              project.liveUrl ? (
                <>
                  <iframe src={project.liveUrl} className="w-full h-full border-0" title={project.title} />
                  {/* Security Fallback Message (renders behind iframe, visible if iframe crashes/blocks) */}
                  <div className="absolute inset-0 bg-[#0A070E] flex flex-col items-center justify-center -z-10 pointer-events-none p-8 text-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1" className="mb-6 opacity-80"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="15" y1="9" y2="15"/><line x1="15" x2="9" y1="9" y2="15"/></svg>
                    <h2 className="text-2xl font-playfair text-white mb-3">Preview Blocked</h2>
                    <p className="text-white/50 font-outfit text-sm mb-8 max-w-md">This website cannot be embedded for security reasons (X-Frame-Options). Please open the live demo directly.</p>
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#C084FC] text-black font-outfit text-[11px] font-bold tracking-[0.15em] uppercase rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(192,132,252,0.3)] pointer-events-auto">
                      Open Live Demo ↗
                    </a>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-[#0A070E] flex flex-col items-center justify-center">
                  <p className="text-white/40 font-outfit tracking-widest uppercase text-xs">No Live Demo Available</p>
                </div>
              )
            ) : (
              /* GitHub Fallback UI */
              <div className="w-full h-full bg-[#0D1117] text-[#C9D1D9] overflow-y-auto font-sans p-8 md:p-12">
                <div className="max-w-4xl mx-auto flex flex-col gap-8">
                  {/* Repo Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#30363D] pb-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-[#21262D] rounded-full flex items-center justify-center border border-[#30363D]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#8B949E]"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold text-[#58A6FF]">kskreddy2k7 / {project.title}</h1>
                        <span className="text-[#8B949E] text-sm px-2 py-0.5 border border-[#30363D] rounded-full inline-block mt-2">Public</span>
                      </div>
                    </div>
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border border-[#363B42] px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2">
                      Open Repository <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    </a>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Main README Area */}
                    <div className="flex-1 border border-[#30363D] rounded-lg bg-[#0D1117] overflow-hidden">
                      <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-3 flex items-center gap-2 text-sm font-semibold">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        README.md
                      </div>
                      <div className="p-8 prose prose-invert max-w-none prose-headings:border-b prose-headings:border-[#30363D] prose-headings:pb-2 prose-a:text-[#58A6FF] prose-code:bg-[#161B22] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                        <h1>{project.title}</h1>
                        <p>{project.overview}</p>
                        {project.readmeSummary && (
                          <>
                            <h2>Overview</h2>
                            <p className="whitespace-pre-wrap">{project.readmeSummary}</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="w-full md:w-72 flex flex-col gap-6">
                      <div className="border-b border-[#30363D] pb-6">
                        <h3 className="font-semibold mb-4 text-[15px]">About</h3>
                        <p className="text-[#8B949E] text-sm mb-4">{project.overview}</p>
                        
                        <div className="flex flex-col gap-3 text-sm text-[#8B949E]">
                          <div className="flex items-center gap-2 hover:text-[#58A6FF] cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span className="font-semibold text-[#C9D1D9]">{project.stars || 0}</span> stars
                          </div>
                          <div className="flex items-center gap-2 hover:text-[#58A6FF] cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                            <span className="font-semibold text-[#C9D1D9]">{project.forks || 0}</span> forks
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-[#30363D] pb-6">
                        <h3 className="font-semibold mb-4 text-[15px]">Languages</h3>
                        <div className="flex flex-col gap-2 text-sm text-[#8B949E]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${project.language === 'TypeScript' ? 'bg-[#3178C6]' : project.language === 'JavaScript' ? 'bg-[#F7DF1E]' : project.language === 'Python' ? 'bg-[#3572A5]' : 'bg-[#C084FC]'}`} />
                              <span className="text-[#C9D1D9] font-medium">{project.language || 'Mixed'}</span>
                            </div>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes load {
          0% { width: 0%; opacity: 1; }
          70% { width: 80%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
