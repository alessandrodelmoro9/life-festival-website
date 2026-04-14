import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColoredSquare } from './SVGLines';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out', delay: 0.3 }
      );

      // Info items stagger
      gsap.fromTo('.hero-info',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.8 }
      );

      // Decorative elements float in
      gsap.fromTo('.hero-deco',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.15, delay: 1.2 }
      );

      // SVG line draw
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.5,
        });
      }

      // Parallax on scroll
      gsap.to('.hero-title-wrap', {
        yPercent: -30,
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
    <section id="hero" ref={sectionRef} className="relative min-h-screen items-center overflow-hidden pt-20 text-9xl font-normal flex flex-row">
      {/* Decorative SVG line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <path
          ref={lineRef}
          d="M -50 100 Q 200 50 300 300 Q 400 550 600 400 Q 900 200 1100 500 Q 1300 800 1500 600"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* Colored squares */}
      <ColoredSquare color="blue" className="hero-deco absolute top-[15%] left-[8%]" size={20} />
      <ColoredSquare color="pink" className="hero-deco absolute top-[25%] right-[12%]" size={16} />
      <ColoredSquare color="red" className="hero-deco absolute bottom-[30%] right-[20%]" size={22} />
      <ColoredSquare color="blue" className="hero-deco absolute bottom-[15%] left-[15%]" size={18} />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-title-wrap">
          <h1
            ref={titleRef}
            className="font-display font-black text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 12rem)' }}
          >
            Life design<br />
            festival
          </h1>

          <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
            {/* Date block */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hero-info flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full border-[2.5px] border-foreground">
                <span className="font-display font-black text-3xl md:text-5xl text-foreground">5</span>
              </div>
              <div className="hero-info bg-primary w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
                  <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="hero-info flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full border-[2.5px] border-foreground">
                <span className="font-display font-black text-3xl md:text-5xl text-foreground">6</span>
              </div>
              <div className="hero-info">
                <span className="font-display font-bold text-2xl md:text-4xl text-foreground">giugno</span>
              </div>
            </div>

            {/* Info block */}
            <div className="hero-info flex flex-col gap-1 text-right">
              <span className="font-body text-xs uppercase tracking-[0.25em] text-foreground">Gallitello, Terminal delle FAL</span>
              <span className="font-display font-bold text-2xl md:text-3xl text-foreground">(PZ)</span>
              <span className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground mt-2">Seconda Edizione</span>
            </div>
          </div>

          {/* Tags */}
          <div className="hero-info mt-10 md:mt-14 flex flex-wrap gap-3">
            {['Talk', 'Workshop', 'Network', 'Exposition', 'Performance', 'Party'].map((tag) => (
              <span
                key={tag}
                className="font-body text-xs uppercase tracking-[0.2em] text-foreground border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-300 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
