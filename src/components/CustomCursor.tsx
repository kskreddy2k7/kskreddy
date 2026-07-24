import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
};

export default function CustomCursor() {
  // SINGLE UNIFIED CURSOR CONTAINER REF
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  
  // Inner Sub-Element Refs for Morphing
  const outerRingsRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);
  const centerDotRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverLabel, setHoverLabel] = useState('EXPLORE');
  const isActiveRef = useRef(false);
  const isHoveringRef = useRef(false);

  // Mode: 'default' | 'minimal' | 'button-hover'
  const modeRef = useRef<'default' | 'minimal' | 'button-hover'>('default');
  const buttonRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    // Mode Change Listener
    const handleSetCursorMode = (e: CustomEvent) => {
      const newMode = e.detail?.mode || 'default';
      modeRef.current = newMode;
      buttonRectRef.current = e.detail?.targetRect || null;

      if (newMode === 'minimal' || newMode === 'button-hover') {
        // Morph into State 2: Soft Lavender Dot
        if (outerRingsRef.current) {
          gsap.to(outerRingsRef.current, { opacity: 0, scale: 0.2, duration: 0.35, ease: 'power3.out' });
        }
        if (textLabelRef.current) {
          gsap.to(textLabelRef.current, { opacity: 0, duration: 0.2, ease: 'power3.out' });
        }
        if (centerDotRef.current) {
          const dotSize = newMode === 'button-hover' ? 5 : 8;
          gsap.to(centerDotRef.current, { 
            scale: 1, 
            opacity: 1, 
            width: dotSize, 
            height: dotSize, 
            duration: 0.35, 
            ease: 'power3.out' 
          });
        }
        if (cursorContainerRef.current) {
          gsap.to(cursorContainerRef.current, { scale: 0.18, duration: 0.35, ease: 'power3.out' });
        }
      } else {
        // Morph back into State 1: Large Cinematic Cursor
        if (outerRingsRef.current) {
          gsap.to(outerRingsRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
        }
        if (textLabelRef.current) {
          gsap.to(textLabelRef.current, { opacity: 1, duration: 0.35, ease: 'power3.out' });
        }
        if (centerDotRef.current) {
          gsap.to(centerDotRef.current, { scale: 0, opacity: 0, duration: 0.35, ease: 'power3.out' });
        }
        if (cursorContainerRef.current) {
          gsap.to(cursorContainerRef.current, { scale: 1, duration: 0.35, ease: 'power3.out' });
        }
      }
    };

    window.addEventListener('set-cursor-mode' as any, handleSetCursorMode);
    return () => window.removeEventListener('set-cursor-mode' as any, handleSetCursorMode);
  }, []);

  useEffect(() => {
    // Start off-screen so the cursor isn't visible until mouse moves
    let mouseX = -200;
    let mouseY = -200;
    let currX = mouseX;
    let currY = mouseY;
    let prevX = mouseX;
    let prevY = mouseY;

    let rotX = 0;
    let rotY = 0;
    let animFrameId: number;

    const particles: Particle[] = [];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isActiveRef.current) setIsActive(true);

      if (modeRef.current === 'default') {
        const target = e.target as HTMLElement;
        const isProjectCard = !!target.closest('.project-card') || !!target.closest('[data-cursor="view"]');
        const isButton = !!target.closest('button') || !!target.closest('a') || !!target.closest('.hero-btn');
        const isInteractive = isButton || isProjectCard || !!target.closest('.info-pill') || !!target.closest('.stat-card');

        setIsHovering(prev => (prev === isInteractive ? prev : isInteractive));

        if (isButton) {
          setHoverLabel(prev => (prev === 'OPEN' ? prev : 'OPEN'));
        } else if (isProjectCard) {
          setHoverLabel(prev => (prev === 'VIEW' ? prev : 'VIEW'));
        } else {
          setHoverLabel(prev => (prev === 'EXPLORE' ? prev : 'EXPLORE'));
        }
      }
    };

    const onMouseLeave = () => setIsActive(false);
    const onMouseEnter = () => setIsActive(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Periodic Pulse Ring (Soft Lavender/Peach Glow)
    const pulseInterval = setInterval(() => {
      if (modeRef.current === 'default' && pulseRingRef.current) {
        gsap.fromTo(pulseRingRef.current,
          { scale: 0.8, opacity: 0.6, borderColor: 'rgba(192,132,252,0.6)' },
          { scale: 2.2, opacity: 0, duration: 1.4, ease: 'power2.out' }
        );
      }
    }, 3500);

    const smoothing = 0.15;

    const updatePhysics = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (modeRef.current === 'button-hover' && buttonRectRef.current) {
        const btnCenterX = buttonRectRef.current.left + buttonRectRef.current.width / 2;
        const btnCenterY = buttonRectRef.current.top + buttonRectRef.current.height / 2;
        const offsetX = Math.max(-4, Math.min(4, (btnCenterX - mouseX) * 0.25));
        const offsetY = Math.max(-4, Math.min(4, (btnCenterY - mouseY) * 0.25));
        targetX = mouseX + offsetX;
        targetY = mouseY + offsetY;
      }

      currX += (targetX - currX) * smoothing;
      currY += (targetY - currY) * smoothing;

      const dx = currX - prevX;
      const dy = currY - prevY;
      const speed = Math.hypot(dx, dy);

      const targetRotX = Math.max(-18, Math.min(18, -dy * 0.4));
      const targetRotY = Math.max(-18, Math.min(18, dx * 0.4));
      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;

      // Spawn Trailing Flower Sparkles (Soft Lavender / Warm Peach)
      if (modeRef.current === 'default' && speed > 1.2 && currX > 10 && currY > 10) {
        const count = speed > 6 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: currX + (Math.random() - 0.5) * 14,
            y: currY + (Math.random() - 0.5) * 14,
            vx: -dx * 0.12 + (Math.random() - 0.5) * 1.5,
            vy: -dy * 0.12 - Math.random() * 1.2,
            radius: Math.random() * 3.5 + 1.8,
            alpha: 0.8,
            color: Math.random() > 0.4 ? '#C084FC' : '#FDBA74',
          });
        }
      }

      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (modeRef.current === 'default') {
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.028;

            if (p.alpha <= 0) {
              particles.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.1, p.radius * p.alpha), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      prevX = currX;
      prevY = currY;

      if (cursorContainerRef.current) {
        const hoverScale = (modeRef.current === 'default' && isHoveringRef.current) ? 1.35 : 1;
        cursorContainerRef.current.style.transform = `translate3d(${currX}px, ${currY}px, 0) translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${hoverScale})`;
      }

      animFrameId = requestAnimationFrame(updatePhysics);
    };

    animFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      clearInterval(pulseInterval);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999998]"
      />

      <div
        ref={pulseRingRef}
        className="fixed top-0 left-0 w-[74px] h-[74px] rounded-full border border-[#C084FC]/60 pointer-events-none z-[999997] opacity-0 -translate-x-1/2 -translate-y-1/2"
      />

      <div
        ref={cursorContainerRef}
        className={`fixed top-0 left-0 w-[74px] h-[74px] pointer-events-none z-[999999] transition-opacity duration-300 ease-out perspective-1000 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div ref={outerRingsRef} className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 rounded-full border border-[#C084FC]/40 transition-all duration-700 ${
            isHovering ? 'animate-[spin_2.5s_linear_infinite] border-[#C084FC]/80 shadow-[0_0_15px_rgba(192,132,252,0.4)]' : 'animate-[spin_9s_linear_infinite]'
          }`}>
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FDBA74] shadow-[0_0_10px_#FDBA74]" />
          </div>

          <div className={`absolute inset-[6px] rounded-full border border-dashed border-white/20 transition-all duration-700 ${
            isHovering ? 'animate-[spin_3s_linear_infinite_reverse] border-[#FDBA74]/60' : 'animate-[spin_12s_linear_infinite_reverse]'
          }`}>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </div>

          <div className={`absolute inset-[11px] rounded-full bg-[#08060A]/85 backdrop-blur-2xl border transition-all duration-500 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.95),_inset_0_0_22px_rgba(192,132,252,0.3)] ${
            isHovering ? 'border-[#C084FC]/60 shadow-[0_12px_45px_rgba(192,132,252,0.3)]' : 'border-white/20'
          }`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_32%,_rgba(255,255,255,0.35)_0%,_transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C084FC_1px,_transparent_1px)] [background-size:6px_6px] pointer-events-none" />
          </div>
        </div>

        <div ref={textLabelRef} className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className={`font-general text-[8.5px] font-bold tracking-[0.22em] uppercase transition-all duration-300 block ${
            isHovering ? 'text-[#FDBA74] scale-110 drop-shadow-[0_0_8px_rgba(253,186,116,0.7)]' : 'text-[#F5F5F5] opacity-90'
          }`}>
            {hoverLabel}
          </span>
        </div>

        <div 
          ref={centerDotRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C084FC] shadow-[0_0_15px_#C084FC,_0_0_25px_rgba(192,132,252,0.8)] pointer-events-none opacity-0 scale-0 z-20"
          style={{ width: '8px', height: '8px' }}
        />
      </div>
    </>
  );
}
