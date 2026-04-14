import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const programItems = [
  { time: '09:00', title: 'Apertura', day: '5 GIU', type: 'Event' },
  { time: '10:00', title: 'Talk — Progettare il futuro', day: '5 GIU', type: 'Talk' },
  { time: '11:30', title: 'Workshop — Design Thinking', day: '5 GIU', type: 'Workshop' },
  { time: '14:00', title: 'Talk — Mauro Bubbico', day: '5 GIU', type: 'Talk' },
  { time: '16:00', title: 'Exposition', day: '5 GIU', type: 'Exposition' },
  { time: '21:00', title: 'Performance & Party', day: '5 GIU', type: 'Party' },
  { time: '10:00', title: 'Talk — EGO55', day: '6 GIU', type: 'Talk' },
  { time: '12:00', title: 'Workshop — Visual Identity', day: '6 GIU', type: 'Workshop' },
  { time: '15:00', title: 'Network & Closing', day: '6 GIU', type: 'Network' },
  { time: '16:30', title: 'Talk — Design Sostenibile', day: '6 GIU', type: 'Talk' },
  { time: '17:30', title: 'Workshop — Branding Creativo', day: '6 GIU', type: 'Workshop' },
  { time: '19:00', title: 'Exposition Finale', day: '6 GIU', type: 'Exposition' },
  { time: '20:30', title: 'Closing Party', day: '6 GIU', type: 'Party' },
];

const typeColors: Record<string, string> = {
  Talk: 'bg-primary',
  Workshop: 'bg-secondary',
  Exposition: 'bg-accent',
  Party: 'bg-primary',
  Network: 'bg-secondary',
  Event: 'bg-foreground',
};

const ProgramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.program-heading',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.program-heading', start: 'top 85%' },
        }
      );

      gsap.fromTo('.program-item',
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.program-item', start: 'top 85%' },
        }
      );

      // Timeline line grows
      gsap.fromTo('.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="program" ref={sectionRef} className="relative py-32 md:py-48 bg-foreground overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <h2
          className="program-heading font-display font-black text-background leading-[0.95] mb-16 md:mb-24"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
        >
          Programma
        </h2>

        <div className="relative">
          {/* Vertical timeline */}
          <div className="timeline-line absolute left-0 md:left-8 top-0 bottom-0 w-px bg-background/20 origin-top" />

          <div className="flex flex-col gap-0">
            {programItems.map((item, i) => {
              const prevDay = i > 0 ? programItems[i - 1].day : null;
              const showDay = item.day !== prevDay;

              return (
                <div key={i}>
                  {showDay && (
                    <div className="program-item pl-6 md:pl-20 py-4">
                      <span className="font-display font-bold text-xl md:text-2xl text-primary">
                        {item.day}
                      </span>
                    </div>
                  )}
                  <div className="program-item group flex items-center gap-4 md:gap-8 pl-6 md:pl-20 py-5 border-b border-background/10 hover:bg-background/5 transition-colors duration-300 cursor-pointer relative">
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-8 w-2 h-2 rounded-full bg-background/40 -translate-x-[3px] group-hover:bg-primary group-hover:scale-150 transition-all duration-300" />

                    <span className="font-body text-sm text-background/50 w-14 shrink-0">
                      {item.time}
                    </span>
                    <div className={`w-3 h-3 shrink-0 ${typeColors[item.type]}`} />
                    <span className="font-display font-medium text-lg md:text-2xl text-background group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </span>
                    <span className="font-body text-xs uppercase tracking-widest text-background/30 ml-auto hidden md:block">
                      {item.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
