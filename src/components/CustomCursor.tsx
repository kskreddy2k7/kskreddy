import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type CursorMode = 'default' | 'text' | 'button' | 'explore' | 'precision' | 'input' | 'link';

const FLOWER_COLORS = ['#C084FC', '#FDBA74', '#7C3AED', '#F5F5F5'];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;

  constructor(x: number, y: number) {
    this.x = x + (Math.random() - 0.5) * 15;
    this.y = y + (Math.random() - 0.5) * 15;
    this.color = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
    this.size = Math.random() * 3.5 + 1.5; // Larger petal bubbles
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -Math.random() * 1.2 - 0.3; // float up faster
    this.maxLife = Math.random() * 80 + 40;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = (this.life / this.maxLife) * 0.8; // Brighter bubbles
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<CursorMode>('default');
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    if (isTouch) return;

    const handleSetMode = (e: CustomEvent) => setMode(e.detail?.mode || 'default');
    window.addEventListener('set-cursor-mode' as any, handleSetMode);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mode === 'precision' || mode === 'explore') return;

      if (target.closest('input, textarea')) {
        setMode('input');
      } else if (target.closest('button, [role="button"]')) {
        setMode('button');
      } else if (target.closest('a')) {
        setMode('link');
      } else if (target.closest('p, h1, h2, h3, h4, h5, h6, span')) {
        setMode('text');
      } else {
        setMode('default');
      }
    };
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('set-cursor-mode' as any, handleSetMode);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mode, isTouch]);

  // Main Render Loop
  useEffect(() => {
    if (isTouch) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currX = targetX;
    let currY = targetY;
    let isVisible = false;

    let particles: Particle[] = [];
    let trail: {x: number, y: number}[] = [];
    
    // Base dimensions for transforms
    // The bg orb is 100x100 natively. We scale it to target sizes.
    // 18px -> scale 0.18

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        gsap.to(container, { opacity: 1, duration: 0.3 });
        isVisible = true;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', () => gsap.to(container, { opacity: 0, duration: 0.3 }));
    document.addEventListener('mouseenter', () => gsap.to(container, { opacity: 1, duration: 0.3 }));

    const lerpLoop = () => {
      const dx = targetX - currX;
      const dy = targetY - currY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Buttery smooth lerp
      currX += dx * 0.15;
      currY += dy * 0.15;
      
      // Velocity stretch (max 8%)
      const angle = Math.atan2(dy, dx);
      const stretch = Math.min(dist * 0.001, 0.08);
      
      gsap.set(container, { 
        x: currX, 
        y: currY,
        xPercent: -50,
        yPercent: -50,
        rotation: angle * (180 / Math.PI),
      });

      // Apply stretch on the core itself, separate from GSAP state scaling
      if (coreRef.current) {
        gsap.set(coreRef.current, {
          scaleX: 1 + stretch,
          scaleY: 1 - stretch * 0.5
        });
      }

      // --- CANVAS RENDERING ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trail (4-6 frames, soft fade)
      if (mode !== 'precision' && mode !== 'input' && dist > 2) {
        trail.push({ x: currX, y: currY });
      }
      if (trail.length > 5) trail.shift();
      
      if (trail.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length - 1; i++) {
          const xc = (trail[i].x + trail[i + 1].x) / 2;
          const yc = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
        
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.strokeStyle = 'rgba(192,132,252,0.15)'; // extremely soft
        ctx.stroke();
      }

      // Flower Petal Bubbles - significantly reduced spawn rate and max limit
      if (mode !== 'precision' && Math.random() > 0.88 && particles.length < 12) {
        particles.push(new Particle(currX, currY));
      }

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      rafId = requestAnimationFrame(lerpLoop);
    };

    rafId = requestAnimationFrame(lerpLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mode, isTouch]);

  // GSAP Morphing States
  useEffect(() => {
    if (isTouch) return;
    const bg = bgRef.current;
    const text = textRef.current;
    const ring = ringRef.current;
    if (!bg || !text || !ring) return;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([bg, text, ring]);

      // Base 100px circle transforms via scale
      // Base 100px circle transforms via scale
      // Locked to normal 18px (scale 0.18) so it never resizes on hover
      gsap.to(bg, { scaleX: 0.18, scaleY: 0.18, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', duration: 0.4, ease: 'power2.out' });
      gsap.to(text, { opacity: 0, scale: 0.8, duration: 0.2 });
      gsap.to(ring, { opacity: 0, scale: 0.5, duration: 0.3 });

      // Idle Breathing
      gsap.to(bg, { scaleX: 0.19, scaleY: 0.19, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, [bgRef, textRef, ringRef]);

    return () => ctx.revert();
  }, [mode, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
      <div
        ref={containerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 flex items-center justify-center mix-blend-screen"
        style={{ transformOrigin: 'center center' }}
      >
        <div ref={coreRef} className="relative flex items-center justify-center">
          
          {/* Main Morphing Background Orb (Base 100x100, scaled down) */}
          <div 
            ref={bgRef} 
            className="absolute w-[100px] h-[100px] rounded-full border backdrop-blur-[1px] shadow-[0_0_12px_rgba(192,132,252,0.15)] will-change-transform"
            style={{ transform: 'scale(0.18)' }}
          />

          {/* Thin rotating ring for Button Hover */}
          <div 
            ref={ringRef} 
            className="absolute w-[100px] h-[100px] border-[0.5px] border-[#FDBA74]/30 rounded-full opacity-0 animate-[spin_4s_linear_infinite] will-change-transform"
          />
          
          {/* Explore Text (Absolutely positioned, independent of bg scaling) */}
          <span 
            ref={textRef} 
            className="absolute font-outfit text-[8px] font-bold text-white uppercase tracking-widest opacity-0 scale-75 whitespace-nowrap will-change-transform"
          >
            Explore
          </span>
        </div>
      </div>
    </>
  );
}
