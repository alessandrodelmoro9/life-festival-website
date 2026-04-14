import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColoredSquare } from './SVGLines';

gsap.registerPlugin(ScrollTrigger);

const LocationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.location-heading',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.location-heading', start: 'top 85%' },
        }
      );

      gsap.fromTo('.location-detail',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.location-detail', start: 'top 85%' },
        }
      );

      gsap.fromTo('.location-map',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.location-map', start: 'top 85%' },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="location" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      <ColoredSquare color="pink" className="absolute top-[10%] right-[5%]" size={28} />
      <ColoredSquare color="blue" className="absolute bottom-[20%] left-[3%]" size={20} />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2
              className="location-heading font-display text-foreground leading-[0.95] font-medium"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
            >
              Potenza<br />(PZ)
            </h2>

            <div className="mt-12 space-y-6">
              <div className="location-detail">
                <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Venue</p>
                <p className="font-display font-bold text-xl md:text-2xl text-foreground mt-1">Terminal Gallitello</p>
              </div>
              <div className="location-detail">
                <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Indirizzo</p>
                <p className="font-body text-lg text-foreground mt-1">Gallitello, Potenza (PZ)</p>
              </div>
              <div className="location-detail">
                <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Date</p>
                <p className="font-body text-lg text-foreground mt-1">5 — 6 Giugno 2026</p>
              </div>
            </div>

            <button className="location-detail mt-10 font-body text-sm uppercase tracking-[0.2em] bg-primary text-primary-foreground px-8 py-4 hover:opacity-90 transition-opacity duration-300">
              Acquista Ticket
            </button>
          </div>

          {/* Map placeholder */}
          <div className="location-map aspect-square bg-foreground/5 border border-foreground/10 relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3050.0!2d15.8!3d40.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDM4JzAuMCJOIDE1wrA0OCcwLjAiRQ!5e0!3m2!1sit!2sit!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) contrast(1.1)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Terminal Gallitello, Potenza"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
