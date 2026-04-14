import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { speakersData } from '@/data/speakersData';
import SpeakerCard from './ui/SpeakerCard';

gsap.registerPlugin(ScrollTrigger);

const SpeakersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo('.speakers-heading',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.speakers-heading', start: 'top 85%' },
        }
      );

      // Line draw (Restore the original SVG animation)
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        });
      }

      // Horizontal Marquee Logic (Infinite Loop)
      const setupMarquee = (ref: React.RefObject<HTMLDivElement>, direction: number, speed: number) => {
        if (!ref.current) return;
        const totalWidth = ref.current.scrollWidth / 2;
        
        // Ensure initial position is filled
        gsap.set(ref.current, { x: direction > 0 ? 0 : -totalWidth });

        const tl = gsap.to(ref.current, {
          x: direction > 0 ? -totalWidth : 0,
          duration: speed,
          ease: "none",
          repeat: -1,
        });

        // Interactive slowdown
        const container = ref.current.parentElement;
        if (container) {
          container.addEventListener("mouseenter", () => gsap.to(tl, { timeScale: 0.1, duration: 0.5 }));
          container.addEventListener("mouseleave", () => gsap.to(tl, { timeScale: 1, duration: 0.5 }));
        }
        
        return tl;
      };

      const isMobile = window.innerWidth < 768;
      const baseSpeed = isMobile ? 60 : 55; // Slightly slower on desktop for the wider cards

      setupMarquee(marqueeRef1, 1, baseSpeed);
      setupMarquee(marqueeRef2, -1, baseSpeed + 10); // Variety in speeds for a more organic feel

    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const row1 = speakersData.slice(0, 8);
  const row2 = speakersData.slice(8, 16);

  return (
    <section id="speakers" ref={sectionRef} className="relative py-24 md:py-48 overflow-hidden">
      {/* Background line (RESTORED) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <path
          ref={lineRef}
          d="M 0 150 Q 300 50 500 250 Q 700 450 1000 350 Q 1300 250 1500 450"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.2"
          fill="none"
          className="opacity-20 md:opacity-100"
        />
      </svg>

      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between text-center md:text-left">
          <h2
            className="speakers-heading font-display text-foreground leading-[0.95] font-medium"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
          >
            Speaker
          </h2>
          <p className="speakers-heading font-body text-sm uppercase tracking-[0.25em] text-muted-foreground mt-4 md:mt-0">
            Seconda Edizione — 2026
          </p>
        </div>
      </div>

      <div className="relative z-10">
        {/* Row 1 */}
        <div className="flex overflow-hidden py-2 md:py-4 select-none cursor-grab active:cursor-grabbing">
          <div ref={marqueeRef1} className="flex whitespace-nowrap">
            {[...row1, ...row1].map((speaker, i) => (
              <SpeakerCard key={`${speaker.id}-row1-${i}`} speaker={speaker} />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex overflow-hidden py-2 md:py-4 select-none mt-2 md:mt-8 cursor-grab active:cursor-grabbing">
          <div ref={marqueeRef2} className="flex whitespace-nowrap">
            {[...row2, ...row2].map((speaker, i) => (
              <SpeakerCard key={`${speaker.id}-row2-${i}`} speaker={speaker} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
