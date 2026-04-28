import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

      gsap.fromTo('.location-collage',
        { opacity: 0, scale: 0.9, rotate: -5 },
        {
          opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: '.location-collage', start: 'top 80%' },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="location" ref={sectionRef} className="relative py-32 md:py-48 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* COLONNA SINISTRA (Testo) */}
          <div className="flex flex-col justify-center">
            <h2 className="location-heading font-display text-5xl md:text-8xl leading-none font-medium text-foreground">
              Una traccia <br /> indelebile sul <br /> territorio
            </h2>
            
            <p className="location-detail font-body text-base md:text-lg text-foreground/80 mt-8 max-w-xl leading-relaxed">
              L'anno scorso abbiamo fatto proliferare le connessioni, quest'anno ne tracciamo la rotta. 
              Il Terminal Gallitello si conferma la nostra casa: un luogo naturalmente simbolo del passaggio temporaneo 
              che viene trasformato nell'epicentro di un'impronta indelebile. Qui il design non è di passaggio, lascia il segno.
            </p>

            <div className="mt-12 md:mt-16 space-y-8">
              <div className="location-detail">
                <p className="font-body text-xs uppercase tracking-normal text-black font-bold">VENUE</p>
                <p className="font-body font-bold text-xl text-foreground mt-1 uppercase">TERMINAL FAL GALLITELLO</p>
              </div>
              
              <div className="location-detail">
                <p className="font-body text-xs uppercase tracking-normal text-black font-bold">INDIRIZZO</p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=TERMINAL+FAL+GALLITELLO+POTENZA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-body font-bold text-lg text-foreground mt-1 uppercase hover:text-primary transition-colors duration-300"
                >
                  VIA DEL GALLITELLO, 85100 POTENZA PZ
                </a>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA (Collage "A Ventaglio") */}
          <div className="location-collage relative w-full h-[450px] md:h-[650px] flex items-center justify-center mt-12 md:mt-0">
            
            {/* FOTO 1 (Sinistra) */}
            <div 
              className="collage-item collage-left absolute left-1/2 bottom-16 md:bottom-24 w-48 h-64 md:w-72 md:h-[400px] shadow-2xl cursor-pointer origin-bottom z-10 overflow-hidden"
              style={{ transform: 'translateX(calc(-50% - 40px)) rotate(-12deg)' }}
            >
              <img 
                src="/assets/location/060520 1.png" 
                alt="Location 1" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* FOTO 3 (Destra) */}
            <div 
              className="collage-item collage-right absolute left-1/2 bottom-16 md:bottom-24 w-48 h-64 md:w-72 md:h-[400px] shadow-2xl cursor-pointer origin-bottom z-10 overflow-hidden"
              style={{ transform: 'translateX(calc(-50% + 40px)) rotate(12deg)' }}
            >
              <img 
                src="/assets/location/060520 2.png" 
                alt="Location 3" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* FOTO 2 (Centrale) */}
            <div 
              className="collage-item collage-center absolute left-1/2 bottom-16 md:bottom-24 w-48 h-64 md:w-72 md:h-[400px] shadow-2xl cursor-pointer origin-bottom z-20 rotate-0 overflow-hidden"
              style={{ transform: 'translateX(-50%) rotate(0deg)' }}
            >
              <img 
                src="/assets/location/070535 1.png" 
                alt="Location 2" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* LA "PUNTINA" ARANCIONE */}
            <div className="absolute bottom-[60px] md:bottom-[80px] left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-[#E25938] z-50 pointer-events-none shadow-lg"></div>
            
          </div>
        </div>
      </div>

      <style>{`
        .collage-item {
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 768px) {
          .collage-left {
            transform: translateX(calc(-50% - 100px)) rotate(-12deg) !important;
          }
          .collage-right {
            transform: translateX(calc(-50% + 100px)) rotate(12deg) !important;
          }
        }
        
        .collage-center:hover {
          transform: translateX(-50%) rotate(0deg) scale(1.1) !important;
          z-index: 45 !important;
        }

        .collage-left:hover {
          transform: translateX(calc(-50% - 40px)) rotate(0deg) scale(1.1) !important;
          z-index: 45 !important;
        }

        .collage-right:hover {
          transform: translateX(calc(-50% + 40px)) rotate(0deg) scale(1.1) !important;
          z-index: 45 !important;
        }
      `}</style>
    </section>
  );
};

export default LocationSection;
