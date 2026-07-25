import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Social Links ─────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@kskreddy2k7',
    desc: '6 pinned repositories · AI, React, TypeScript',
    url: 'https://github.com/kskreddy2k7',
    accentColor: '#E6EDF3',
    bgGlow: 'rgba(230,237,243,0.06)',
    borderGlow: 'rgba(230,237,243,0.18)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Kata Sai Kranthu Reddy',
    desc: 'Open to internship opportunities',
    url: 'https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377',
    accentColor: '#0A66C2',
    bgGlow: 'rgba(10,102,194,0.1)',
    borderGlow: 'rgba(10,102,194,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@i2flow.ai',
    desc: 'AI experiments · dev journey · projects',
    url: 'https://www.instagram.com/i2flow.ai/',
    accentColor: '#E1306C',
    bgGlow: 'rgba(225,48,108,0.08)',
    borderGlow: 'rgba(225,48,108,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    id: 'website',
    label: 'i2Flow',
    handle: 'i2flow.ai project',
    desc: 'Live web experiment · Vite · React',
    url: 'https://kskreddy2k7.github.io/i2flow/',
    accentColor: '#C084FC',
    bgGlow: 'rgba(192,132,252,0.08)',
    borderGlow: 'rgba(192,132,252,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'official.i2flow.ai@gmail.com',
    desc: 'Open to collaborations & opportunities',
    url: 'mailto:official.i2flow.ai@gmail.com',
    accentColor: '#FDBA74',
    bgGlow: 'rgba(253,186,116,0.08)',
    borderGlow: 'rgba(253,186,116,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

// ─── Social Card ──────────────────────────────────────────────────────────────
function SocialCard({ social }: { social: typeof SOCIALS[0] }) {
  const [hovered, setHovered] = useState(false);
  const isEmail = social.id === 'email';

  return (
    <a
      href={social.url}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      className="group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 select-none"
      style={{
        background: hovered ? `rgba(18,11,24,0.9)` : 'rgba(18,11,24,0.5)',
        border: `1px solid ${hovered ? social.borderGlow : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered
          ? `0 8px 30px ${social.bgGlow}, 0 0 0 1px ${social.borderGlow}, inset 0 1px 0 rgba(255,255,255,0.07)`
          : 'none',
        transform: hovered ? 'translateY(-4px)' : 'none',
        backdropFilter: 'blur(20px)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Reflection sweep */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        >
          <div
            className="absolute -left-full top-0 w-1/2 h-full opacity-10"
            style={{
              background: `linear-gradient(90deg, transparent, ${social.accentColor}, transparent)`,
              animation: 'sweep 0.5s ease-out forwards',
            }}
          />
        </div>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: hovered ? `${social.accentColor}22` : 'rgba(255,255,255,0.04)',
          color: hovered ? social.accentColor : 'rgba(255,255,255,0.5)',
          border: `1px solid ${hovered ? social.accentColor + '40' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered ? `0 0 16px ${social.accentColor}30` : 'none',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {social.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="font-outfit text-[11px] uppercase tracking-[0.22em] font-bold transition-colors duration-300"
            style={{ color: hovered ? social.accentColor : 'rgba(255,255,255,0.4)' }}
          >
            {social.label}
          </span>
        </div>
        <p className="font-outfit text-[13px] text-white/80 truncate font-medium">{social.handle}</p>
        <p className="font-outfit text-[10px] text-white/35 truncate mt-0.5">{social.desc}</p>
      </div>

      {/* Arrow */}
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="w-4 h-4 shrink-0 transition-all duration-300"
        style={{
          color: hovered ? social.accentColor : 'rgba(255,255,255,0.2)',
          transform: hovered ? 'translate(2px, -2px)' : 'translate(0,0)',
        }}
      >
        <line x1="7" y1="17" x2="17" y2="7"/>
        <polyline points="7 7 17 7 17 17"/>
      </svg>
    </a>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 4000);
    }, 1800);
  };

  const fieldClass = (id: string) => `
    w-full bg-transparent py-3.5 font-outfit text-[14px] text-white
    placeholder-transparent focus:outline-none resize-none transition-all duration-300
    border-b-2 ${focused === id ? 'border-[#C084FC]' : 'border-white/10'}
  `;

  const labelClass = (id: string, hasValue?: boolean) => `
    absolute left-0 font-outfit text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none
    ${focused === id || hasValue ? '-top-1 text-[#C084FC]' : 'top-3.5 text-white/40 text-[13px] normal-case tracking-normal'}
  `;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-8 p-8 md:p-10 rounded-3xl"
      style={{
        background: 'rgba(18,11,24,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(28px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-8 right-8 h-[1px] rounded-full"
        style={{ background: 'linear-gradient(to right, transparent, rgba(192,132,252,0.5), transparent)' }} />

      {/* Form header */}
      <div className="flex flex-col gap-1">
        <h3 className="font-playfair text-xl font-normal text-white">Send a message</h3>
        <p className="font-outfit text-[12px] text-white/40">I typically respond within 24 hours.</p>
      </div>

      {/* Name */}
      <div className="relative">
        <input
          type="text"
          id="ct-name"
          required
          className={fieldClass('name')}
          placeholder="Name"
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
        />
        <label htmlFor="ct-name" className={labelClass('name')}>Full Name</label>
        {focused === 'name' && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(to right, #C084FC, #FDBA74)', animation: 'expand 0.3s ease-out' }} />
        )}
      </div>

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          id="ct-email"
          required
          className={fieldClass('email')}
          placeholder="Email"
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
        />
        <label htmlFor="ct-email" className={labelClass('email')}>Email Address</label>
        {focused === 'email' && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(to right, #C084FC, #FDBA74)', animation: 'expand 0.3s ease-out' }} />
        )}
      </div>

      {/* Subject */}
      <div className="relative">
        <input
          type="text"
          id="ct-subject"
          className={fieldClass('subject')}
          placeholder="Subject"
          onFocus={() => setFocused('subject')}
          onBlur={() => setFocused(null)}
        />
        <label htmlFor="ct-subject" className={labelClass('subject')}>Subject (optional)</label>
        {focused === 'subject' && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(to right, #C084FC, #FDBA74)', animation: 'expand 0.3s ease-out' }} />
        )}
      </div>

      {/* Message */}
      <div className="relative">
        <textarea
          id="ct-message"
          required
          rows={4}
          className={fieldClass('message')}
          placeholder="Message"
          onFocus={() => setFocused('message')}
          onBlur={() => setFocused(null)}
        />
        <label htmlFor="ct-message" className={labelClass('message')}>Your Message</label>
        {focused === 'message' && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(to right, #C084FC, #FDBA74)', animation: 'expand 0.3s ease-out' }} />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={formState !== 'idle'}
        className="relative overflow-hidden rounded-xl py-4 font-outfit font-bold text-[12px] uppercase tracking-[0.18em] transition-all duration-500"
        style={{
          background: formState === 'success'
            ? 'linear-gradient(135deg, #34D399, #10B981)'
            : 'linear-gradient(135deg, #C084FC, #A855F7)',
          color: '#0A070E',
          boxShadow: formState === 'success'
            ? '0 0 30px rgba(52,211,153,0.4)'
            : '0 0 30px rgba(192,132,252,0.35)',
          transform: formState === 'idle' ? 'none' : 'scale(0.99)',
        }}
      >
        <span className={`block transition-transform duration-300 ${formState !== 'idle' ? '-translate-y-10' : 'translate-y-0'}`}>
          Send Message ↗
        </span>
        <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${formState === 'submitting' ? 'translate-y-0' : 'translate-y-10'}`}>
          <span className="w-5 h-5 border-2 border-[#0A070E]/30 border-t-[#0A070E] rounded-full animate-spin" />
        </span>
        <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${formState === 'success' ? 'translate-y-0' : 'translate-y-10'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
          Message Sent!
        </span>
      </button>
    </form>
  );
}

// ─── Main Contact Section ─────────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Badge
    const badge = headingRef.current?.querySelector('.contact-badge');
    if (badge) {
      gsap.fromTo(badge,
        { opacity: 0, y: 18, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%' } }
      );
    }

    // SplitText title char-by-char reveal
    const h2 = headingRef.current?.querySelector('h2');
    if (h2) {
      const split = new SplitType(h2, { types: 'chars' });
      if (split.chars) {
        gsap.fromTo(split.chars,
          { opacity: 0, y: 50, rotateX: -80, filter: 'blur(10px)' },
          {
            opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
            duration: 1.1, stagger: 0.025, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: headingRef.current, start: 'top 85%', invalidateOnRefresh: true },
          }
        );
      }
    }

    // Subtitle words
    const sub = headingRef.current?.querySelector('.contact-sub');
    if (sub) {
      const split = new SplitType(sub as HTMLElement, { types: 'words' });
      if (split.words) {
        gsap.fromTo(split.words,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out', delay: 0.3,
            scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
          }
        );
      }
    }

    // Left panel slide-in
    if (leftRef.current) {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -50, filter: 'blur(6px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 82%', invalidateOnRefresh: true } }
      );
    }

    // Right form slide-in
    if (rightRef.current) {
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 50, filter: 'blur(6px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, delay: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: rightRef.current, start: 'top 82%', invalidateOnRefresh: true } }
      );
    }

    // Social cards stagger
    const cards = gsap.utils.toArray<HTMLElement>('.social-card-item');
    gsap.fromTo(cards,
      { opacity: 0, y: 24, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: leftRef.current, start: 'top 78%', invalidateOnRefresh: true },
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 bg-[#050307] text-[#F5F5F5] overflow-hidden">

      {/* Ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse at center top, #C084FC, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-[0.05]"
          style={{ background: 'radial-gradient(ellipse at bottom right, #FDBA74, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse at bottom left, #F472B6, transparent 70%)' }} />
        {/* Floating pollen */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 rounded-full opacity-20"
            style={{
              background: i % 2 === 0 ? '#C084FC' : '#FDBA74',
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Heading */}
        <div ref={headingRef} className="mb-20 text-center flex flex-col items-center gap-5">
          <div className="contact-badge opacity-0 inline-flex items-center gap-2.5 border border-[#FDBA74]/20 px-4 py-1.5 rounded-full bg-[#120B18]/60 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" style={{ boxShadow: '0 0 6px #FDBA74' }} />
            <span className="text-[10px] uppercase tracking-[0.26em] text-[#FDBA74] font-outfit font-medium">Let's Build Something Amazing</span>
          </div>

          <h2 className="font-playfair text-[clamp(36px,5.5vw,80px)] font-normal tracking-tight leading-[1.05] perspective-[800px]">
            Let's <span className="italic text-[#FDBA74]">Create</span><br />
            Something Meaningful
          </h2>

          <p className="contact-sub font-outfit text-[14px] text-[#A7A7A7] max-w-[600px] text-center leading-[1.8]">
            Whether it's an AI project, website, collaboration, internship opportunity or simply a conversation — I'm always open to building something meaningful.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* Left Panel — Personal Contact Card */}
          <div ref={leftRef} className="flex flex-col gap-6 opacity-0">

            {/* Identity card */}
            <div
              className="relative rounded-3xl p-7 overflow-hidden"
              style={{
                background: 'rgba(18,11,24,0.75)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(28px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Top border glow */}
              <div className="absolute top-0 left-8 right-8 h-[1px]"
                style={{ background: 'linear-gradient(to right, transparent, rgba(192,132,252,0.5), transparent)' }} />
              {/* Ambient bloom */}
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(253,186,116,0.1), transparent 70%)' }} />

              {/* Avatar + Name */}
              <div className="flex items-center gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl shrink-0 relative overflow-hidden"
                  style={{
                    border: '1.5px solid rgba(205,133,63,0.45)',
                    boxShadow: '0 0 18px rgba(205,133,63,0.3), 0 0 40px rgba(205,133,63,0.12)',
                    background: '#0a0707',
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/i2flow-logo.jpg`}
                    alt="i2Flow logo"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Subtle inner rim */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)' }} />
                </div>
                <div>
                  {/* i2Flow brand name */}
                  <h3 className="font-playfair text-2xl font-normal leading-tight"
                    style={{ background: 'linear-gradient(135deg, #CD853F, #E8A94D, #B8730A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    i²Flow
                  </h3>
                  <p className="font-outfit text-[10px] uppercase tracking-[0.26em] mt-0.5"
                    style={{ color: 'rgba(205,133,63,0.75)' }}>
                    AI · Design · Engineering
                  </p>
                  <p className="font-outfit text-[11px] text-white/35 mt-1.5 leading-relaxed max-w-[180px]">
                    Building intelligent, cinematic digital experiences
                  </p>
                </div>
              </div>

              {/* Animated divider */}
              <div className="relative h-[1px] mb-6 overflow-hidden rounded-full">
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, transparent, #C084FC, #FDBA74, #C084FC, transparent)', animation: 'shimmer 3s ease-in-out infinite' }} />
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl mb-2"
                style={{ background: 'rgba(205,133,63,0.08)', border: '1px solid rgba(205,133,63,0.25)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: '#CD853F', boxShadow: '0 0 6px #CD853F' }} />
                <span className="font-outfit text-[11px] font-medium" style={{ color: '#E8A94D' }}>i²Flow — actively building & shipping</span>
              </div>
            </div>

            {/* Social Cards */}
            <div className="flex flex-col gap-3">
              {SOCIALS.map((social) => (
                <div key={social.id} className="social-card-item">
                  <SocialCard social={social} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel — Contact Form */}
          <div ref={rightRef} className="opacity-0">
            <ContactForm />
          </div>
        </div>

        {/* Bottom footer line */}
        <div className="mt-24 flex flex-col items-center gap-4">
          <div className="h-[1px] w-64"
            style={{ background: 'linear-gradient(to right, transparent, rgba(192,132,252,0.3), transparent)' }} />
          <p className="font-outfit text-[10px] uppercase tracking-[0.25em] text-white/20">
            © {new Date().getFullYear()} K S K Reddy · Crafted with love & code
          </p>
        </div>

      </div>

      <style>{`
        @keyframes sweep {
          from { left: -100%; }
          to { left: 100%; }
        }
        @keyframes expand {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-12px) rotate(12deg); }
        }
      `}</style>
    </section>
  );
}
