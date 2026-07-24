import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Contact Data ─────────────────────────────────────────────────────────────
const LINKS = [
  {
    id: 'email',
    label: 'Direct Mail',
    value: 'official.i2flow.ai@gmail.com',
    href: 'mailto:official.i2flow.ai@gmail.com',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    color: '#FDBA74',
    glow: 'rgba(253,186,116,0.18)',
  },
  {
    id: 'github',
    label: 'Source Code',
    value: 'github.com/kskreddy2k7',
    href: 'https://github.com/kskreddy2k7',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
    color: '#C084FC',
    glow: 'rgba(192,132,252,0.18)',
  },
  {
    id: 'linkedin',
    label: 'Professional Network',
    value: 'linkedin.com/in/kskreddy',
    href: 'https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377/',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.18)',
  },
  {
    id: 'instagram',
    label: 'Visual Studio',
    value: '@i2flow.ai',
    href: 'https://www.instagram.com/i2flow.ai/',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.18)',
  },
  {
    id: 'brand',
    label: 'Brand Studio',
    value: 'i2flow.ai',
    href: 'https://kskreddy2k7.github.io/i2flow/',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    color: '#FDBA74',
    glow: 'rgba(253,186,116,0.18)',
  },
];

// ─── Floating Particles ───────────────────────────────────────────────────────
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const COLORS = ['#C084FC', '#FDBA74', '#F472B6', '#EA580C', '#8B5CF6'];
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.3 + 0.06),
      a: Math.random() * 0.4 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: Math.random() * Math.PI * 2,
      ds: Math.random() * 0.007 + 0.003,
    }));
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.drift += p.ds;
        p.x += p.vx + Math.sin(p.drift) * 0.2;
        p.y += p.vy;
        if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[2]" />;
}

// ─── Link Card ────────────────────────────────────────────────────────────────
function LinkCard({ link }: { link: typeof LINKS[0] }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card || !shine) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(card, { rotateX: ((y - rect.height / 2) / rect.height) * -5, rotateY: ((x - rect.width / 2) / rect.width) * 5, scale: 1.03, duration: 0.3, ease: 'power2.out', transformPerspective: 700, force3D: true });
    gsap.to(shine, { opacity: 1, left: `${(x / rect.width) * 100}%`, top: `${(y / rect.height) * 100}%`, duration: 0.12 });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    gsap.to(shineRef.current, { opacity: 0, duration: 0.35 });
    setHovered(false);
  }, []);

  return (
    <a
      ref={cardRef}
      href={link.href}
      target={link.id !== 'email' ? '_blank' : undefined}
      rel="noreferrer"
      className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl overflow-hidden no-underline"
      style={{
        background: 'rgba(13,8,20,0.8)',
        border: `1px solid ${hovered ? link.color + '44' : 'rgba(255,255,255,0.09)'}`,
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.85), 0 0 20px ${link.glow}` : '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
    >
      <div ref={shineRef} className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0 z-[1]"
        style={{ background: `radial-gradient(circle, ${link.glow} 0%, transparent 65%)` }} />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${link.color}0F 0%, transparent 55%)` }} />

      {/* Icon */}
      <div className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center border relative z-[5] transition-all duration-350"
        style={{
          background: hovered ? link.color + '18' : 'rgba(255,255,255,0.03)',
          borderColor: hovered ? link.color + '55' : 'rgba(255,255,255,0.08)',
          color: hovered ? link.color : '#6B6380',
          boxShadow: hovered ? `0 0 16px ${link.glow}` : 'none',
        }}
      >
        <div className="w-4 h-4" dangerouslySetInnerHTML={{ __html: link.icon }} />
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0 relative z-[5]">
        <span className="text-[9px] font-outfit uppercase tracking-[0.22em] mb-0.5 transition-colors duration-300"
          style={{ color: hovered ? link.color : '#4A4358' }}>
          {link.label}
        </span>
        <span className="text-sm font-general font-medium truncate transition-colors duration-300"
          style={{ color: hovered ? '#F5F5F5' : '#9087A0' }}>
          {link.value}
        </span>
      </div>

      {/* Arrow */}
      <svg className="ml-auto w-4 h-4 shrink-0 relative z-[5] transition-all duration-300"
        style={{ color: hovered ? link.color : '#2E2840', transform: hovered ? 'translate(3px,-3px)' : 'none' }}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

// ─── Float Label Input ────────────────────────────────────────────────────────
function FloatInput({ label, type = 'text', isTextarea = false, required = true, placeholder }: {
  label: string; type?: string; isTextarea?: boolean; required?: boolean; placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  const onFocus = () => {
    setFocused(true);
    if (lineRef.current) gsap.to(lineRef.current, { scaleX: 1, duration: 0.4, ease: 'power2.out' });
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    setFilled(e.target.value.length > 0);
    if (!e.target.value) gsap.to(lineRef.current, { scaleX: 0, duration: 0.3, ease: 'power2.in' });
  };

  const up = focused || filled;
  const shared: React.CSSProperties = { background: 'transparent', color: '#F5F5F5', outline: 'none', width: '100%', paddingTop: '28px', paddingBottom: '10px', fontSize: '15px', fontFamily: 'Outfit, sans-serif', resize: 'none', border: 'none' };

  return (
    <div className="relative">
      <label className="absolute pointer-events-none font-outfit z-[5] transition-all duration-250"
        style={{ top: up ? '8px' : '20px', left: 0, fontSize: up ? '10px' : '14px', letterSpacing: up ? '0.18em' : '0.01em', textTransform: up ? 'uppercase' : 'none', color: focused ? '#C084FC' : up ? '#6B6380' : '#4A4358' }}>
        {label}
      </label>
      <div className="relative border-b" style={{ borderBottomColor: focused ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.1)' }}>
        {isTextarea
          ? <textarea required={required} rows={4} placeholder={focused ? placeholder : ''} onFocus={onFocus} onBlur={onBlur} style={shared} className="placeholder:text-[#3D3549] placeholder:text-sm" />
          : <input required={required} type={type} placeholder={focused ? placeholder : ''} onFocus={onFocus} onBlur={onBlur} style={shared} className="placeholder:text-[#3D3549] placeholder:text-sm" />
        }
        <div ref={lineRef} className="absolute bottom-0 left-0 right-0 h-[2px] origin-left rounded-sm"
          style={{ transform: 'scaleX(0)', background: 'linear-gradient(90deg,#C084FC,#FDBA74,#F472B6)' }} />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const linksColRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Drifting ambient orb
  useEffect(() => {
    if (!bgGlowRef.current) return;
    gsap.to(bgGlowRef.current, { x: 70, y: -50, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }, []);

  // Mouse parallax on form card
  useEffect(() => {
    const section = sectionRef.current;
    const card = formCardRef.current;
    if (!section || !card) return;
    let rafId: number;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      tx = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 7;
      ty = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 4;
    };
    const lerp = () => {
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      gsap.set(card, { x: cx, y: cy });
      rafId = requestAnimationFrame(lerp);
    };
    rafId = requestAnimationFrame(lerp);
    section.addEventListener('mousemove', onMove);
    return () => { cancelAnimationFrame(rafId); section.removeEventListener('mousemove', onMove); };
  }, []);

  // GSAP scroll reveals — use 'top bottom' so they fire as soon as section enters viewport
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Set initial hidden states via GSAP (not inline styles so they're properly tracked)
    gsap.set([headingRef.current, subRef.current, labelRef.current], { opacity: 0, y: 40 });
    gsap.set(formCardRef.current, { opacity: 0, x: -60 });
    gsap.set(footerRef.current, { opacity: 0, y: 20 });

    const links = linksColRef.current?.querySelectorAll('a, [class*="avail"]');
    if (links) gsap.set(links, { opacity: 0, x: 50 });

    // Section becomes visible as soon as ANY part enters viewport
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Label
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0);

        // Heading — SplitType
        if (headingRef.current && !headingRef.current.querySelector('.word')) {
          const split = new SplitType(headingRef.current, { types: 'words' });
          if (split.words) {
            gsap.set(split.words, { opacity: 0, y: 50 });
            tl.to(split.words, { opacity: 1, y: 0, duration: 1.0, stagger: 0.06 }, 0.1);
          }
        } else {
          tl.to(headingRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.1);
        }

        // Subtext
        tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.3);

        // Form card
        tl.to(formCardRef.current, { opacity: 1, x: 0, duration: 1.1 }, 0.25);

        // Link cards
        if (links) {
          tl.to(links, { opacity: 1, x: 0, duration: 0.8, stagger: 0.08 }, 0.35);
        }

        // Footer
        tl.to(footerRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.5);
      },
    });
  }, { scope: sectionRef });

  // Button magnetic
  const onBtnMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.13, y: (e.clientY - rect.top - rect.height / 2) * 0.13, duration: 0.3, ease: 'power2.out' });
  }, []);
  const onBtnLeave = useCallback(() => { gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => { setFormState('success'); setTimeout(() => { setFormState('idle'); (e.target as HTMLFormElement).reset(); }, 3500); }, 1600);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative text-[#F5F5F5] overflow-hidden z-[10]"
      style={{ background: '#08060A', minHeight: '100vh', paddingTop: '9rem', paddingBottom: '5rem' }}
    >
      {/* ── Solid base ── */}
      <div className="absolute inset-0 bg-[#08060A] z-0" />

      {/* ── Layered ambient flower gradients ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 15% 85%, rgba(88,28,135,0.24) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 50% at 85% 15%, rgba(234,88,12,0.13) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 105%, rgba(244,114,182,0.11) 0%, transparent 65%)' }} />

      {/* ── Drifting orb ── */}
      <div ref={bgGlowRef} className="absolute z-[1] pointer-events-none rounded-full"
        style={{ width: '480px', height: '480px', left: '12%', top: '18%', background: 'radial-gradient(circle, rgba(192,132,252,0.09) 0%, rgba(88,28,135,0.06) 45%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(192,132,252,1) 1px, transparent 1px)', backgroundSize: '36px 36px', opacity: 0.07 }} />

      {/* ── Particles ── */}
      <FloatingParticles />

      {/* ── Content ── */}
      <div ref={innerRef} className="relative z-[10] max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div ref={labelRef} className="inline-flex items-center gap-2.5 border border-[#C084FC]/20 px-4 py-1.5 rounded-full bg-[#2D122D]/40 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FDBA74] animate-pulse" style={{ boxShadow: '0 0 8px rgba(253,186,116,0.7)' }} />
            <span className="text-[10px] font-outfit uppercase tracking-[0.26em] text-[#C084FC] font-medium">Open for Collaboration</span>
          </div>

          <h2 ref={headingRef} className="font-playfair text-4xl sm:text-5xl md:text-7xl font-normal tracking-tight leading-[1.1] text-[#F5F5F5] mb-5">
            Let's build something{' '}
            <span className="font-serif italic" style={{ background: 'linear-gradient(135deg,#FDBA74 0%,#F472B6 45%,#C084FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              exceptional.
            </span>
          </h2>

          <p ref={subRef} className="font-outfit text-base md:text-lg max-w-lg leading-relaxed" style={{ color: '#7C6B8E' }}>
            Available for high-impact AI architecture, creative engineering,{' '}
            <br className="hidden md:block" />and digital systems.
          </p>
        </div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* LEFT: Form */}
          <div ref={formCardRef} className="lg:col-span-7">
            <div className="relative rounded-[26px] border overflow-hidden"
              style={{ background: 'rgba(11,6,19,0.88)', borderColor: 'rgba(192,132,252,0.13)', boxShadow: '0 28px 80px rgba(0,0,0,0.95), 0 0 60px rgba(88,28,135,0.09), inset 0 1px 0 rgba(255,255,255,0.04)', backdropFilter: 'blur(30px)' }}>
              {/* Top shimmer */}
              <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(192,132,252,0.5),rgba(253,186,116,0.4),transparent)' }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 35% at 50% 0%,rgba(88,28,135,0.10) 0%,transparent 70%)' }} />

              {/* Success overlay */}
              {formState === 'success' && (
                <div className="absolute inset-0 z-[30] flex flex-col items-center justify-center text-center p-10 rounded-[26px]"
                  style={{ background: 'rgba(8,6,10,0.97)', backdropFilter: 'blur(20px)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ border: '1.5px solid rgba(192,132,252,0.5)', background: 'rgba(192,132,252,0.08)', boxShadow: '0 0 30px rgba(192,132,252,0.25)' }}>
                    <svg className="w-7 h-7 text-[#C084FC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h3 className="font-general text-xl font-bold text-[#F5F5F5] tracking-wider uppercase mb-2">Message Transmitted</h3>
                  <p className="font-outfit text-sm" style={{ color: '#7C6B8E' }}>I'll respond as soon as I can.</p>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="relative z-[10] p-8 md:p-12 flex flex-col gap-8">
                <div className="border-b border-white/[0.07] pb-5">
                  <div className="text-[10px] font-outfit uppercase tracking-[0.25em] mb-1" style={{ color: '#4A4358' }}>Message Studio</div>
                  <div className="font-general text-lg font-semibold text-[#F5F5F5]">Send a private message</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <FloatInput label="Full Name" placeholder="How should I address you?" />
                  <FloatInput label="Email Address" type="email" placeholder="Where can I reach you?" />
                </div>
                <FloatInput label="Your Message" isTextarea placeholder="Tell me about your vision, project, or idea…" />

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.07] gap-4 flex-wrap">
                  <p className="text-[10px] font-outfit tracking-wider" style={{ color: '#3A3249' }}>✦ All messages are read personally</p>
                  <button
                    ref={btnRef}
                    type="submit"
                    disabled={formState !== 'idle'}
                    onMouseMove={onBtnMove}
                    onMouseLeave={onBtnLeave}
                    className="relative overflow-hidden group flex items-center gap-3 px-8 py-3.5 rounded-full font-outfit font-semibold text-sm uppercase tracking-[0.14em] cursor-pointer border-none select-none outline-none"
                    style={{ background: formState === 'submitting' ? 'rgba(192,132,252,0.2)' : 'linear-gradient(135deg,#581C87 0%,#7C3AED 45%,#C084FC 100%)', color: '#F5F5F5', boxShadow: '0 8px 28px rgba(124,58,237,0.4)', opacity: formState === 'submitting' ? 0.6 : 1, transition: 'opacity 0.3s, box-shadow 0.3s' }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full"
                      style={{ background: 'linear-gradient(135deg,rgba(253,186,116,0.22) 0%,transparent 55%)' }} />
                    <span className="relative z-[5]">{formState === 'submitting' ? 'Transmitting…' : 'Send Message'}</span>
                    <span className="relative z-[5] w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Link cards */}
          <div ref={linksColRef} className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="mb-3 pl-1">
              <div className="text-[9px] font-outfit uppercase tracking-[0.25em] mb-1" style={{ color: '#4A4358' }}>Find me on</div>
              <div className="font-general text-lg font-semibold text-[#F5F5F5]">Every corner of the web</div>
            </div>

            {LINKS.map(link => <LinkCard key={link.id} link={link} />)}

            {/* Availability badge */}
            <div className="mt-3 p-4 rounded-2xl border flex items-center gap-3 avail"
              style={{ background: 'rgba(11,6,19,0.75)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}>
              <div className="relative shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74] block" style={{ boxShadow: '0 0 8px rgba(253,186,116,0.7)' }} />
                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#FDBA74] animate-ping opacity-40" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-general font-medium text-[#F5F5F5]">Available for new projects</span>
                <span className="text-[10px] font-outfit tracking-wide" style={{ color: '#4A4358' }}>Typical response within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div ref={footerRef} className="relative z-[10] max-w-7xl mx-auto px-6 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74] animate-pulse" style={{ boxShadow: '0 0 8px rgba(253,186,116,0.6)' }} />
          <span className="text-[11px] font-outfit uppercase tracking-[0.22em]" style={{ color: '#4A4358' }}>Hyderabad, India — IST</span>
        </div>
        <div className="text-[11px] font-outfit text-center tracking-wider" style={{ color: '#3A3249' }}>
          © {new Date().getFullYear()} K S K Reddy · i2Flow AI · All rights reserved
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-outfit uppercase tracking-[0.22em]" style={{ color: '#4A4358' }}>Crafted with</span>
          <span className="text-[#FDBA74] text-sm">✦</span>
          <span className="text-[11px] font-outfit uppercase tracking-[0.22em]"
            style={{ background: 'linear-gradient(90deg,#C084FC,#FDBA74)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            i2Flow
          </span>
        </div>
      </div>
    </section>
  );
}
