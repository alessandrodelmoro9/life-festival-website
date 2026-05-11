import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bgTicket from '@/assets/backg ticket.svg';
import iconTwo from '@/assets/2 aquawax.svg';

gsap.registerPlugin(ScrollTrigger);

const TicketsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

    const initWidget = () => {
      if (window.EBWidgets) {
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: '1985936059213',
          modal: true,
          modalTriggerElementId: 'eventbrite-widget-modal-trigger-1985936059213',
          onOrderComplete: () => console.log('Ordine completato.')
        });
        return true;
      }
      return false;
    };

    if (!initWidget()) {
      const interval = setInterval(() => {
        if (initWidget()) {
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="tickets" 
      ref={sectionRef} 
      className="relative min-h-screen w-full flex items-center justify-center py-32 md:py-48 bg-[#7678F6] overflow-hidden"
    >
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
          
          {/* LEFT CONTENT (INTRO) - Box 487x219 with 49px gap */}
          <div className="ticket-animate flex flex-col w-full max-w-[487px] md:h-[219px] justify-start order-1">
            <h2 className="text-h1 text-[#262626] tracking-tighter capitalize leading-none mb-[49px]">
              Life pass 2 giorni
            </h2>
            <h5 className="text-[#262626] opacity-90 normal-case font-body">
              Assicurati il tuo ticket per entrare al Life design festival 2026
            </h5>
          </div>

          {/* RIGHT CONTENT (FLAT CARD) - Box 591x491 */}
          <div className="ticket-animate order-2 w-full max-w-[591px] lg:ml-auto">
            <div className="bg-[#F4EEE4] rounded-none relative flex flex-col md:w-[591px] md:h-[491px] overflow-hidden items-center justify-between p-10 md:p-14">
              
              {/* Card Title Block */}
              <div className="w-full max-w-[480px] flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <h3 className="text-[#262626] mb-0 whitespace-nowrap leading-none">
                    Life pass
                  </h3>
                  <img src={iconTwo} alt="2" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                  <h3 className="text-[#262626] mb-0 whitespace-nowrap leading-none">
                    giorni
                  </h3>
                </div>
                <h6 className="font-medium text-[#262626] normal-case mt-4 font-body text-left">
                  Accedi ad entrambi i giorni <br /> al Life design festival 2026
                </h6>
              </div>

              {/* Box with all texts & button - 480x300 container */}
              <div className="w-full max-w-[480px] flex flex-col mt-10">
                {/* List and Note Box - 480x144 hug */}
                <div className="flex flex-col md:h-[144px] justify-center mb-8">
                  <ul className="list-none p-0 m-0 space-y-0">
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
                        <span className="font-bold text-xs">-</span>
                        <p className="normal-case m-0 text-sm font-body">{item}</p>
                      </li>
                    ))}
                  </ul>

                  <p className="leading-tight text-[#262626] opacity-80 normal-case text-xs font-body italic mt-2">
                    *I workshop sono esclusi dal pass e sono prenotabili fino ad esaurimento posti.
                  </p>
                </div>

                {/* CTA BUTTON - 480x64 */}
                <button 
                  id="eventbrite-widget-modal-trigger-1985936059213"
                  className="group relative flex items-center justify-center gap-3 bg-[#E25938] text-[#262626] h-[64px] rounded-none w-full transition-all duration-300 hover:bg-[#E25938]/90 active:scale-[0.99]"
                >
                  <span className="text-xl transform transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 leading-none">
                    ↘
                  </span>
                  <span className="font-body font-bold text-sm uppercase tracking-[0.2em]">
                    ACQUISTA IL TICKET
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TicketsSection;
