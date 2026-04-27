import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TicketsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ticketLink = "https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213";

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.ticket-animate',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
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
    <section id="tickets" ref={sectionRef} className="relative py-24 md:py-48 bg-[#7678F6] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* LEFT CONTENT (EDITORIAL) */}
          <div className="flex flex-col gap-6 md:gap-8 order-1">
            <h2 className="ticket-animate font-display leading-[0.8] font-medium tracking-tighter lowercase text-[#262626]" style={{ fontSize: 'clamp(4.5rem, 12vw, 9.5rem)' }}>
              <span className="capitalize">Accedi</span> al<br />festival
            </h2>
            <p className="ticket-animate font-body text-xl md:text-2xl leading-tight max-w-sm text-[#262626]">
              Assicurati il tuo ticket per entrare al Life design festival 2026
            </p>
            
            <div className="ticket-animate mt-16 hidden lg:block">
              <span className="font-body text-[10px] uppercase tracking-[0.5em] font-bold text-[#262626]">
                TICKET IN VENDITA SU EVENTBRITE.IT
              </span>
            </div>
          </div>

          {/* RIGHT CONTENT (THE TICKET CARD) */}
          <div className="ticket-animate order-2 relative group w-full max-w-2xl ml-auto">
            {/* The Cream Box */}
            <div className="bg-[#F4EEE4] p-8 md:p-14 text-[#262626] relative min-h-[500px] flex flex-col">
              
              {/* Card Title */}
              <h3 className="font-display text-4xl md:text-6xl font-medium tracking-tighter lowercase mb-6 text-[#262626]">
                Life pass 2 giorni
              </h3>

              {/* Card Body */}
              <p className="font-body text-lg md:text-xl mb-12 leading-tight text-[#262626] max-w-[280px] md:max-w-[400px]">
                Accedi ad entrambi i giorni al Life<br />design festival 2026
              </p>

              {/* Feature List - Moved down with mt-auto or large margin */}
              <ul className="space-y-0 mb-10 mt-20 md:mt-auto flex-grow">
                {[
                  "Accesso ai **talk**",
                  "Accesso alla **zona lounge**",
                  "Possibilità di partecipare alle **attività in stand**",
                  "Zona **food and beverage**",
                  "Accesso a **zona stand e bookshop**",
                  "Accesso alla **prenotazione dei workshop**"
                ].map((item, index) => {
                  const formattedItem = item.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
                  );
                  return (
                    <li key={index} className="font-body text-[12px] md:text-[13px] flex items-start gap-2 text-[#262626] opacity-90 leading-tight">
                      <span className="opacity-50">•</span>
                      <span>{formattedItem}</span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA BUTTON (Floating inside padding) */}
              <div className="mt-auto self-end md:absolute md:bottom-10 md:right-10">
                <a 
                  href={ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#FF76BF] text-[#262626] px-6 py-3 md:px-8 md:py-4 font-body font-bold text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="text-lg leading-none">↘</span> TICKET
                </a>
              </div>
            </div>

            {/* Mobile Footer Label */}
            <div className="mt-8 lg:hidden text-center">
              <span className="font-body text-[9px] uppercase tracking-[0.4em] font-bold text-[#262626] opacity-80">
                TICKET IN VENDITA SU EVENTBRITE.IT
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TicketsSection;
