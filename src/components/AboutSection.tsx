import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-48 overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Row: Title + Trigger */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            <h2
              className="about-heading font-display text-foreground leading-[0.95] font-medium tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 7.5rem)' }}
            >
              Progetta il tuo futuro.<br />
              Lascia tracce indelebili.
            </h2>

            {/* Interactive Trigger (Desktop: Right of Title, Mobile: Below Title) */}
            <div className="about-text flex flex-col items-center md:items-end md:pt-12">
              <button 
                className="group flex flex-col items-center cursor-pointer relative"
                onClick={() => console.log('Activate Paint System')}
              >
                <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap mb-2">
                  Lasciaci un segno
                </span>
                
                <div className="relative flex flex-col items-center">
                  {/* Long Curved Diagonal Arrow - Mirrored (Leaning Right) */}
                  <svg className="trace-curved-arrow w-16 h-24 text-muted-foreground group-hover:text-[#0070f3] transition-colors" viewBox="0 0 64 96" fill="none">
                    <path 
                      d="M 10 0 Q 34 40 24 85 M 15 77 L 24 85 L 33 77" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"
                    />
                  </svg>

                  {/* Pulsing Node - Centered on Arrow Tip (x=24 in 64 viewBox) and Lowered */}
                  <div 
                    className="trace-trigger-square w-5 h-5 bg-[#0070f3] shadow-[0_0_20px_rgba(0,112,243,0.4)] rounded-sm absolute" 
                    style={{ bottom: '-18px', left: '37.5%' }} // 24/64 = 37.5%
                  />
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
