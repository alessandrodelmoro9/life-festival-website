import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sponsorsData, Sponsor } from '@/data/sponsorsData';

gsap.registerPlugin(ScrollTrigger);

const SponsorItem = ({ sponsor }: { sponsor: Sponsor }) => {
  return (
    <div className="flex items-center justify-center px-6 md:px-12 py-6 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-in-out cursor-default">
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className={sponsor.category === 'main' ? 'h-10 md:h-14 w-auto object-contain' : 'h-8 md:h-11 w-auto object-contain'}
        />
      ) : (
        <span className="font-display font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-foreground/40 text-center">
          {sponsor.name}
        </span>
      )}
    </div>
  );
};

const SponsorSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo('.sponsor-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.sponsor-heading', start: 'top 90%' },
        }
      );

      // SVG line draw
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 20%',
            scrub: 1,
          },
        });
      }

      // Stagger logos
      gsap.fromTo('.sponsor-row',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.sponsor-row', start: 'top 85%' },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const mainSponsors = sponsorsData.filter(s => s.category === 'main');
  const others = sponsorsData.filter(s => s.category !== 'main');

  return (
    <section id="sponsors" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Decorative SVG Line - Optimized for mobile height */}
      <svg 
        className="absolute top-0 left-0 w-full h-[120px] md:h-[200px] pointer-events-none z-0"
        viewBox="0 0 1500 200"
        preserveAspectRatio="none"
      >
        <path
          ref={lineRef}
          d="M -50 40 Q 200 -20 450 40 Q 750 110 1000 40 Q 1300 -20 1600 60"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.2"
          fill="none"
          className="opacity-20"
        />
      </svg>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-16 text-center md:text-left">
          <h2
            className="sponsor-heading font-display text-foreground leading-[0.95] font-medium mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
          >
            Partner & Support
          </h2>
          <p className="sponsor-heading font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground">
            L'ecosistema che rende possibile LIFE 2026
          </p>
        </div>

        {/* MAIN SPONSORS ROW */}
        <div className="sponsor-row border-t border-b border-foreground/20 py-10 md:py-14">
          <p className="font-body text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 mb-10 text-center md:text-left">
            Sponsor Ufficiali
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-10 -ml-6 md:-ml-12">
            {mainSponsors.map((sponsor) => (
              <SponsorItem key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>

        {/* OTHERS ROW (Partners & Patrons combined for elegance) */}
        <div className="sponsor-row py-10 md:py-14">
          <p className="font-body text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 mb-8 md:mb-12 text-center md:text-left">
            Patrocini Istituzionali & Partner Strategici
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-12 -ml-6 md:-ml-12">
            {others.map((sponsor) => (
              <SponsorItem key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
