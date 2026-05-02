import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bgTicket from '@/assets/backg ticket.svg';

gsap.registerPlugin(ScrollTrigger);

const TicketsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ticketLink = "https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213";

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.ticket-animate',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="tickets" 
      ref={sectionRef} 
      className="relative min-h-screen w-full flex items-center justify-center py-24 md:py-48 bg-[#7678F6] overflow-hidden"
    >
      {/* Background SVG - Fixed alignment to prevent deformation */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgTicket})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* LEFT CONTENT (INTRO) - Positioned higher with mt-8 on desktop */}
          <div className="flex flex-col md:mt-8 order-1">
            <h1 className="ticket-animate font-display font-medium text-[#262626] tracking-tighter capitalize">
              Ticket
            </h1>
            <h5 className="ticket-animate font-body leading-tight max-w-[280px] md:max-w-[450px] text-[#262626] mt-[49px] opacity-90 normal-case">
              Assicurati il tuo ticket per entrare al Life design festival 2026
            </h5>
          </div>

          {/* RIGHT CONTENT (FLAT CARD) */}
          <div className="ticket-animate order-2 w-full max-w-xl lg:ml-auto">
            <div className="bg-[#F4EEE4] rounded-none p-10 md:p-16 relative flex flex-col min-h-[600px]">
              
              {/* Card Title Block */}
              <div className="mb-0">
                <h3 className="font-display font-medium tracking-tighter text-[#262626] mb-0">
                  Life pass ② giorni
                </h3>
                <h6 className="font-body font-bold tracking-[0.1em] text-[#262626] uppercase mt-[18px]">
                  ACCEDI AD ENTRAMBI I GIORNI AL LIFE DESIGN FESTIVAL 2026
                </h6>
              </div>

              {/* Dense Editorial List - p (16px) size */}
              <ul className="list-none p-0 m-0 space-y-1 mb-10 mt-[40px]">
                {[
                  "Accesso ai talk",
                  "Accesso alla zona lounge",
                  "Possibilità di partecipare alle attività in stand",
                  "Zona food and beverage",
                  "Accesso a zona stand e bookshop",
                  "Accesso alla prenotazione dei workshop"
                ].map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-2 text-[#262626] leading-tight py-0"
                  >
                    <span className="font-bold">-</span>
                    <p className="normal-case m-0">{item}</p>
                  </li>
                ))}
              </ul>

              {/* Legal Note - p (16px) size */}
              <p className="leading-tight text-[#262626] mb-12 opacity-80 normal-case">
                *I workshop sono esclusi dal pass e sono prenotabili fino ad esaurimento posti.
              </p>

              {/* CTA BUTTON - Geometric Rigid */}
              <div className="mt-auto">
                <a 
                  href={ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-3 bg-[#E25938] text-[#262626] px-8 py-5 md:py-6 rounded-none w-full transition-all duration-300 hover:bg-[#E25938]/90 active:scale-[0.99]"
                >
                  <span className="text-2xl transform transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 leading-none">
                    ↘
                  </span>
                  <span className="font-body font-bold text-sm md:text-base uppercase tracking-[0.2em]">
                    ACQUISTA IL TICKET
                  </span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TicketsSection;
