import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '../utils';
import { gsap } from 'gsap';
import { profile } from '../data';
import { scrollToTarget } from '../lib/scrollEngine';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const links = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollToTarget(href);
  };

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-100%', opacity: 0 }
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-colors duration-700 pointer-events-none",
      )}
    >
      <div className={cn(
        "absolute inset-0 transition-opacity duration-700 border-b border-white/10",
        isScrolled ? "bg-[#08060A]/85 backdrop-blur-xl opacity-100" : "opacity-0"
      )} />
      
      <div className="relative max-w-7xl mx-auto px-6 h-22 flex items-center justify-between pointer-events-auto">
        <a 
          ref={logoRef}
          href="#home" 
          onClick={(e) => scrollTo(e, '#home')}
          data-cursor="pointer"
          className="group flex items-center gap-2 p-2 origin-left"
        >
          <span className="text-[#F5F5F5] font-general font-bold text-base tracking-[0.15em] uppercase transition-colors group-hover:text-[#C084FC]">
            {profile.fullName}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map(link => (
            <a 
              key={link.name} 
              href={link.href}
              data-cursor="pointer"
              onClick={(e) => scrollTo(e, link.href)}
              className="group relative text-[10px] font-outfit uppercase tracking-[0.25em] text-[#A7A7A7] hover:text-[#C084FC] transition-colors py-2 overflow-hidden"
            >
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-full">{link.name}</span>
              <span className="absolute inset-0 z-10 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[#C084FC] flex items-center">{link.name}</span>
            </a>
          ))}
        </nav>
        
        <button
          type="button"
          data-cursor="pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden text-[#F5F5F5] flex flex-col gap-1.5 p-2"
        >
          <span className="w-6 h-[1.5px] bg-[#F5F5F5] block" />
          <span className="w-4 h-[1.5px] bg-[#F5F5F5] block ml-auto" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-t border-white/10 bg-[#08060A]/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2 pointer-events-auto">
            {links.map(link => (
              <a
                key={link.name}
                href={link.href}
                data-cursor="pointer"
                onClick={(e) => scrollTo(e, link.href)}
                className="rounded-xl px-4 py-3 text-[11px] font-outfit uppercase tracking-[0.22em] text-[#A7A7A7] border border-white/8 bg-white/[0.02] hover:text-[#C084FC] hover:border-[#C084FC]/25 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
