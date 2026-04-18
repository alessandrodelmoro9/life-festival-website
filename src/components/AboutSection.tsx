import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePaint } from '@/context/PaintContext';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { setIsActive, setMode } = usePaint();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.about-text',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.about-text',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo('.about-heading',
        { opacity: 0, x: -80 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: '.about-heading',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Pulse animation for the trigger square
      gsap.to('.trace-trigger-square', {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut"
      });

      // Subtle arrow "bounce"
      gsap.to('.trace-curved-arrow', {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut"
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleActivatePaint = () => {
    setIsActive(true);
    setMode('draw');
  };

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-48 overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Row: Title + Trigger */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            <h2
              className="about-heading font-display text-foreground leading-[0.95] font-medium tracking-tighter"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}
            >
              Ogni gesto<br />
              lascia una<br />
              traccia.
            </h2>

            {/* Interactive Trigger (Desktop: Right of Title, Mobile: Below Title) */}
            <div className="about-text flex flex-col items-center md:items-end md:pt-16">
              <button 
                className="group flex flex-col items-center md:items-end cursor-pointer gap-4 text-center md:text-right"
                onClick={handleActivatePaint}
              >
                <span className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                  Lascia il<br />tuo segno
                </span>
                
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-[0_0_25px_rgba(244,114,182,0.3)]">
                  <span className="flex items-center justify-center font-display font-bold text-black text-3xl md:text-4xl">
                    <span className="leading-none">[</span>
                    <span className="inline-block translate-y-[12px] md:translate-y-[22px] mx-[2px] text-4xl md:text-6xl font-medium">~</span>
                    <span className="leading-none">]</span>
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-16 md:mt-24 grid md:grid-cols-2 gap-12 md:gap-24">
            <p className="about-text font-body text-lg md:text-xl leading-relaxed text-foreground">
              Crediamo che la vita non sia un binario da seguire, ma una superficie da disegnare. LIFE è il punto di incontro tra la visione creativa e l'azione consapevole: due giorni per esplorare nuove traiettorie, connettere nodi distanti e trasformare l'incertezza in un progetto di valore.
            </p>
            <p className="about-text font-body text-lg md:text-xl leading-relaxed text-muted-foreground">
              Il 5 e 6 giugno 2026, il Terminal Gallitello di Potenza diventa il laboratorio di una comunità che non aspetta il futuro, ma lo disegna. Oltre i talk e i workshop, LIFE è lo spazio dove ogni connessione diventa una traccia indelebile. Qui, ogni idea conta. Ogni segno è l'inizio di qualcosa di nuovo.
            </p>
          </div>

          {/* Minimalist Mobile Line */}
          <div className="md:hidden mt-16 opacity-20">
            <svg className="w-full h-px" viewBox="0 0 1000 1">
              <line x1="0" y1="0" x2="1000" y2="0" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
