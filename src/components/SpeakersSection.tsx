import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const speakers = [
  {
    name: 'Mauro Bubbico',
    role: 'Graphic Designer',
    description: 'Maestro della comunicazione visiva nel Sud Italia',
  },
  {
    name: 'EGO55',
    role: 'Creative Studio',
    description: 'Duo creativo tra design e sperimentazione',
  },
  {
    name: 'Speaker 3',
    role: 'Coming Soon',
    description: 'Annuncio in arrivo...',
  },
  {
    name: 'Speaker 4',
    role: 'Coming Soon',
    description: 'Annuncio in arrivo...',
  },
];

const SpeakersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Section heading
      gsap.fromTo('.speakers-heading',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.speakers-heading', start: 'top 85%' },
        }
      );

      // Speaker cards stagger
      gsap.fromTo('.speaker-card',
        { opacity: 0, y: 80, rotation: -3 },
        {
          opacity: 1, y: 0, rotation: 0, duration: 1, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.speaker-card', start: 'top 85%' },
        }
      );

      // Line draw
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
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="speakers" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Background line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          ref={lineRef}
          d="M 0 100 Q 300 0 500 200 Q 700 400 1000 300 Q 1300 200 1500 400"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24">
          <h2
            className="speakers-heading font-display font-black text-foreground leading-[0.95]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
          >
            Speaker
          </h2>
          <p className="speakers-heading font-body text-sm uppercase tracking-[0.25em] text-muted-foreground mt-4 md:mt-0">
            Seconda Edizione — 2026
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {speakers.map((speaker, i) => (
            <div
              key={speaker.name}
              className="speaker-card group relative bg-background border border-foreground/10 p-8 md:p-12 cursor-pointer hover:border-primary transition-colors duration-500"
            >
              {/* Index */}
              <span className="font-display font-bold text-6xl md:text-8xl text-foreground/5 absolute top-4 right-6">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Colored square indicator */}
              <div className={`w-4 h-4 mb-6 ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'}`} />

              <h3 className="font-display font-bold text-2xl md:text-4xl text-foreground group-hover:text-primary transition-colors duration-300">
                {speaker.name}
              </h3>
              <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mt-2">
                {speaker.role}
              </p>
              <p className="font-body text-base text-foreground/70 mt-4 leading-relaxed">
                {speaker.description}
              </p>

              {/* Arrow */}
              <div className="absolute bottom-8 right-8 w-10 h-10 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7L17 17M17 17V7M17 17H7" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
