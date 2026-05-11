import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LocationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [topIndex, setTopIndex] = useState<number | null>(null);

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
    <section id="location" ref={sectionRef} className="relative py-16 md:py-48 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* COLONNA SINISTRA (Testo) */}
          <div className="flex flex-col justify-start">
            <h2 className="text-h1 location-heading text-life-black mb-10 leading-[0.9] tracking-tighter">
              Una traccia <br /> indelebile
            </h2>
            
            <h5 className="location-detail text-life-black/80 max-w-xl leading-snug font-body normal-case">
              Nel 2025 sono proliferate le connessioni, quest'anno ne tracciamo la rotta. 
              Il Terminal Gallitello si conferma la nostra casa: un luogo naturalmente simbolo del passaggio temporaneo 
              che viene trasformato nell'epicentro di un'impronta indelebile. In Basilicata il design non è più solo di passaggio, 
              finalmente lascia il segno.
            </h5>

            <div className="mt-12 md:mt-16 w-full max-w-xl flex flex-col gap-y-4 location-detail">
              <div className="flex justify-between items-center w-full">
                <span className="text-[14px] font-body font-bold uppercase tracking-wider text-life-black">VENUE</span>
                <span className="text-[14px] font-body font-bold uppercase text-life-black">TERMINAL GALLITELLO</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="text-[14px] font-body font-bold uppercase tracking-wider text-life-black">INDIRIZZO</span>
                <span className="text-[14px] font-body font-bold uppercase text-life-black">VIA DEL GALLITELLO, POTENZA</span>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA (Collage "A Ventaglio") */}
          <div className="location-collage relative w-full h-[320px] md:h-[550px] flex items-start justify-center mt-8 md:mt-0">
            
            {/* FOTO 1 (Sinistra) */}
            <div 
              onClick={() => setTopIndex(0)}
              className={`collage-item collage-left absolute left-1/2 top-0 w-40 h-56 md:w-56 md:h-80 shadow-2xl cursor-pointer origin-bottom overflow-hidden ${topIndex === 0 ? 'is-active z-40' : 'z-10'}`}
              style={{ transform: 'translateX(calc(-50% - 30px)) rotate(-12deg)' }}
            >
              <img 
                src="/assets/location/060520 1.png" 
                alt="Location 1" 
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* FOTO 3 (Destra) */}
            <div 
              onClick={() => setTopIndex(2)}
              className={`collage-item collage-right absolute left-1/2 top-0 w-40 h-56 md:w-56 md:h-80 shadow-2xl cursor-pointer origin-bottom overflow-hidden ${topIndex === 2 ? 'is-active z-40' : 'z-10'}`}
              style={{ transform: 'translateX(calc(-50% + 30px)) rotate(12deg)' }}
            >
              <img 
                src="/assets/location/060520 2.png" 
                alt="Location 3" 
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* FOTO 2 (Centrale) */}
            <div 
              onClick={() => setTopIndex(1)}
              className={`collage-item collage-center absolute left-1/2 top-0 w-40 h-56 md:w-56 md:h-80 shadow-2xl cursor-pointer origin-bottom overflow-hidden ${topIndex === 1 ? 'is-active z-40' : (topIndex === null ? 'z-20' : 'z-10')}`}
              style={{ transform: 'translateX(-50%) rotate(0deg)' }}
            >
              <img 
                src="/assets/location/070535 1.png" 
                alt="Location 2" 
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* LA "PUNTINA" ARANCIONE */}
            <div className="absolute top-[210px] md:top-[300px] left-1/2 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 bg-life-red z-50 pointer-events-none shadow-lg"></div>
            
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
        
        /* Active states for jumping to front (Original Animation on Click) */
        .collage-center.is-active {
          transform: translateX(-50%) rotate(0deg) scale(1.1) !important;
        }

        .collage-left.is-active {
          transform: translateX(calc(-50% - 40px)) rotate(0deg) scale(1.1) !important;
        }

        .collage-right.is-active {
          transform: translateX(calc(-50% + 40px)) rotate(0deg) scale(1.1) !important;
        }

        /* Hover effect (just a slight bump) */
        .collage-item:hover:not(.is-active) {
          transform: scale(1.05) !important;
        }
        @media (min-width: 768px) {
          .collage-left:hover:not(.is-active) {
            transform: translateX(calc(-50% - 100px)) rotate(-12deg) scale(1.05) !important;
          }
          .collage-right:hover:not(.is-active) {
            transform: translateX(calc(-50% + 100px)) rotate(12deg) scale(1.05) !important;
          }
          .collage-center:hover:not(.is-active) {
            transform: translateX(-50%) rotate(0deg) scale(1.05) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LocationSection;
