import { useRef, useState, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { timeline } from '../data';

gsap.registerPlugin(ScrollTrigger);

// Memoized card so activeStep state changes don't re-render heading
const TimelineCard = memo(({ event, isActive, idx, activeStep }: {
  event: typeof timeline[0];
  isActive: boolean;
  idx: number;
  activeStep: number;
}) => (
  <div
    className="absolute inset-0 rounded-2xl border p-6 md:p-10 flex flex-col justify-between backdrop-blur-2xl transition-all duration-500 ease-out will-change-transform"
    style={{
      opacity: isActive ? 1 : 0,
      transform: isActive
        ? 'translate3d(0,0,0) scale(1)'
        : idx < activeStep
        ? 'translate3d(0,-40px,0) scale(0.93)'
        : 'translate3d(0,40px,0) scale(0.93)',
      pointerEvents: isActive ? 'auto' : 'none',
      borderColor: isActive ? 'rgba(192,132,252,0.45)' : 'rgba(255,255,255,0.06)',
      background: 'rgba(15, 8, 22, 0.92)',
    }}
  >
    {/* Ambient glow */}
    <div
      className="absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-500"
      style={{
        background: 'linear-gradient(135deg, rgba(88,28,135,0.18) 0%, rgba(234,88,12,0.10) 100%)',
        filter: 'blur(16px)',
        opacity: isActive ? 1 : 0,
      }}
    />

    {/* Year + type badge */}
    <div className="flex justify-between items-center z-[10] mb-4">
      <div className="inline-flex items-center gap-2 border border-[#C084FC]/20 px-3.5 py-1 rounded-full bg-[#2D122D]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" />
        <span className="text-[10px] font-outfit uppercase tracking-[0.2em] text-[#FDBA74] font-bold">{event.year}</span>
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#C084FC]">{event.type}</span>
    </div>

    {/* Title */}
    <div className="z-[10] mb-3">
      <h3 className="font-general text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-1 leading-tight">{event.title}</h3>
      <p className="font-outfit text-sm text-[#FDBA74] font-medium">@{event.company}</p>
    </div>

    {/* Description */}
    <p className="font-outfit text-sm text-[#A7A7A7] leading-relaxed mb-5 z-[10] flex-1">{event.description}</p>

    {/* Tech chips */}
    {event.tech_stack && event.tech_stack.length > 0 && (
      <div className="flex flex-wrap gap-2 z-[10] pt-4 border-t border-white/10">
        {event.tech_stack.map(tech => (
          <span
            key={tech}
            className="px-3 py-1 border border-[#C084FC]/20 rounded-full text-xs font-outfit uppercase tracking-wider text-[#F5F5F5] bg-[#2D122D]/40 hover:border-[#FDBA74] hover:text-[#FDBA74] transition-colors cursor-default"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
  </div>
));

TimelineCard.displayName = 'TimelineCard';

// Memoized chapter nav item
const ChapterNavItem = memo(({ event, idx, isActive }: {
  event: typeof timeline[0];
  idx: number;
  isActive: boolean;
}) => (
  <div
    className="flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-300 ease-out"
    style={{
      background: isActive ? 'rgba(45,18,45,0.65)' : 'rgba(255,255,255,0.01)',
      borderColor: isActive ? 'rgba(192,132,252,0.6)' : 'rgba(255,255,255,0.05)',
      transform: isActive ? 'translateX(6px)' : 'translateX(0)',
      opacity: isActive ? 1 : 0.38,
    }}
  >
    <div className="flex flex-col min-w-0">
      <span
        className="text-[9px] font-mono tracking-widest"
        style={{ color: isActive ? '#FDBA74' : '#A7A7A7' }}
      >
        CH.{String(idx + 1).padStart(2, '0')}
      </span>
      <span className="text-xs font-general font-medium text-white truncate max-w-[170px]">
        {event.company}
      </span>
    </div>
    <div
      className="w-2.5 h-2.5 rounded-full border shrink-0 ml-2 transition-all duration-300"
      style={{
        background: isActive ? '#FDBA74' : 'transparent',
        borderColor: isActive ? '#FDBA74' : 'rgba(255,255,255,0.2)',
        transform: isActive ? 'scale(1.25)' : 'scale(1)',
        boxShadow: isActive ? '0 0 8px #FDBA74' : 'none',
      }}
    />
  </div>
));

ChapterNavItem.displayName = 'ChapterNavItem';

// ─── Static Heading (never re-renders due to activeStep) ─────────────────────
const TimelineHeading = memo(({ total, activeStep }: { total: number; activeStep: number }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const split = new SplitType(ref.current, { types: 'words' });
    if (split.words) {
      gsap.fromTo(split.words,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.0, stagger: 0.045, ease: 'power4.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', invalidateOnRefresh: true }
        }
      );
    }
  }, { scope: ref });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 w-full">
      <div>
        <div className="inline-flex items-center gap-2 border border-[#C084FC]/20 px-3.5 py-1 rounded-full bg-[#2D122D]/40 mb-3 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#C084FC] font-outfit font-medium">CAREER CHAPTERS</span>
        </div>
        <h2
          ref={ref}
          className="font-playfair text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.1] text-[#F5F5F5]"
        >
          DEVELOPER <span className="font-serif italic text-[#FDBA74]">EVOLUTION</span>
        </h2>
      </div>

      {/* Chapter counter */}
      <div className="hidden md:flex items-center gap-3 border border-white/10 px-4 py-2 rounded-full bg-[#1C0D26]/60 backdrop-blur-md shrink-0">
        <span className="text-xs font-mono text-[#FDBA74] font-bold tabular-nums">
          {String(activeStep + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C084FC] font-outfit">CHAPTER</span>
      </div>
    </div>
  );
});

TimelineHeading.displayName = 'TimelineHeading';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    if (!sectionRef.current || !pinWrapRef.current) return;

    const totalChapters = timeline.length;
    const scrollDistance = totalChapters * 750;

    // Pin the inner wrapper
    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: pinWrapRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const raw = self.progress * totalChapters;
        const step = Math.min(totalChapters - 1, Math.floor(raw));
        setActiveStep(step);
      }
    });

    let lineTween: gsap.core.Tween | null = null;

    // Animated vertical line grows
    if (lineRef.current) {
      lineTween = gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        }
      );
    }

    return () => {
      pinTrigger.kill();
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, { scope: sectionRef });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative text-[#F5F5F5] z-[10]"
      style={{ background: '#08060A' }}
    >
      {/* Full-bleed opaque background to prevent bleed-through from Projects */}
      <div className="absolute inset-0 bg-[#08060A] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.14)_0%,_rgba(234,88,12,0.05)_55%,_transparent_80%)] pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(#C084FC_1px,_transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none z-[1]" />

      {/* ── Pin Wrapper (only this is pinned) ── */}
      <div
        ref={pinWrapRef}
        className="relative h-screen w-full flex flex-col justify-between pt-16 pb-10 overflow-hidden z-[2]"
        style={{ background: '#08060A' }}
      >
        {/* Header row */}
        <div className="max-w-7xl mx-auto px-6 w-full relative z-[10]">
          <TimelineHeading total={timeline.length} activeStep={activeStep} />
        </div>

        {/* Main content grid */}
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-[10] flex-1 py-4">

          {/* Left: Chapter Nav */}
          <div className="hidden md:flex md:col-span-4 flex-col gap-2 pr-8 relative border-r border-white/10">
            {/* Static track line */}
            <div className="absolute right-[-1px] inset-y-0 w-[2px] bg-white/[0.07]" />
            {/* Animated fill line */}
            <div
              ref={lineRef}
              className="absolute right-[-1px] top-0 bottom-0 w-[2px] bg-[#C084FC] origin-top"
            />

            {timeline.map((event, idx) => (
              <ChapterNavItem
                key={event.id}
                event={event}
                idx={idx}
                isActive={idx === activeStep}
              />
            ))}
          </div>

          {/* Right: Story Cards */}
          <div className="md:col-span-8 relative min-h-[360px] flex items-stretch">
            {timeline.map((event, idx) => (
              <TimelineCard
                key={event.id}
                event={event}
                isActive={idx === activeStep}
                idx={idx}
                activeStep={activeStep}
              />
            ))}
          </div>
        </div>

        {/* Footer label */}
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center text-[10px] font-outfit text-[#A7A7A7] uppercase tracking-[0.2em] relative z-[10] shrink-0">
          <span>DEVELOPER EVOLUTION STORYTELLER</span>
          <span>SCROLL TO ADVANCE CHAPTERS ↓</span>
        </div>
      </div>
    </section>
  );
}
