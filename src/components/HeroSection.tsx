import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColoredSquare } from './SVGLines';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.split-char');

    gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -80 });

    gsap.to(chars, {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.035,
      delay,
    });
  }, [delay]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char inline-block my-0 py-[7px]"
          style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Info items stagger
      gsap.fromTo('.hero-animate',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.5 }
      );

      // Parallax on scroll
      gsap.to('.hero-title-wrap', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-between relative z-10">
        
        {/* TOP ROW: TITLE & KEYWORDS */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* 1. TITOLO PRINCIPALE (Top-Left) */}
          <div className="hero-title-wrap max-w-4xl">
            <h1
              className="hero-animate text-foreground leading-[0.85] tracking-tight font-display font-medium"
              style={{ fontSize: 'clamp(5.5rem, 18vw, 11rem)' }}
            >
              Life design<br />festival
            </h1>
          </div>

          {/* 5. NUOVO BLOCCO PAROLE CHIAVE (Mid/Top-Right) */}
          <div className="hero-animate hidden md:flex flex-col text-right font-body text-base leading-none tracking-tighter font-medium space-y-1 mt-4">
            <span>TALK</span>
            <span>WORKSHOP</span>
            <span>NETWORK</span>
            <span>EXPOSITION</span>
            <span>PERFORMANCE</span>
            <span>PARTY</span>
          </div>
        </div>

        {/* MIDDLE ROW: DATE BLOCK (Mid-Right) */}
        <div className="flex justify-end w-full md:pr-12 my-12 md:my-0">
          <div className="hero-animate flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Cerchi con bordo spesso */}
              <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border-[5px] border-foreground">
                <span className="font-display font-black text-4xl md:text-6xl text-foreground">5</span>
              </div>
              
              {/* Quadratino rosa cliccabile con freccia */}
              <button 
                onClick={() => {
                  const el = document.getElementById('about');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95 group"
                aria-label="Vai alla sezione About"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
                  <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border-[5px] border-foreground">
                <span className="font-display font-black text-4xl md:text-6xl text-foreground">6</span>
              </div>
            </div>
            
            {/* Scritta giugno sotto i cerchi */}
            <div className="w-full text-center md:text-left">
              <span className="font-display font-bold text-5xl md:text-8xl text-foreground leading-none lowercase">
                giugno
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: LOCATION & EDITION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8">
          {/* 3. BLOCCO LUOGO (Bottom-Left) */}
          <div className="hero-animate flex flex-col items-start gap-1">
            <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.25em] text-foreground">
              Gallitello, Terminal delle FAL
            </span>
            <span className="font-display font-bold text-7xl md:text-[9rem] leading-none text-foreground">
              (PZ)
            </span>
          </div>

          {/* 4. BLOCCO EDIZIONE (Spostato a Bottom-Center su desktop, Bottom-Left su mobile) */}
          <div className="hero-animate w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-0 text-left md:text-center pb-2">
            <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-muted-foreground font-medium">
              Seconda Edizione
            </span>
          </div>
          
          {/* Empty spacer for desktop right-alignment consistency if needed */}
          <div className="hidden md:block w-40"></div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
