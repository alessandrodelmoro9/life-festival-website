import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { programData, ProgramItem } from '@/data/programData';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const typeColors: Record<string, string> = {
  Talk: "bg-primary",
  Workshop: "bg-life-blue",
  Network: "bg-life-red",
  Exposition: "bg-[#FFB800]",
  Party: "bg-[#E85D36]",
  Event: "bg-white/40",
  Break: "bg-transparent border-2 border-white/20",
  Attività: "bg-[#E85D36]"
};

const ProgramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header and items entrance
      gsap.fromTo('.program-heading', 
        { opacity: 0, y: 60 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.program-heading', start: 'top 85%' } }
      );

      // Animate line segments growth
      const segments = gsap.utils.toArray<HTMLElement>('.segment-grow');
      segments.forEach((segment) => {
        gsap.fromTo(segment, { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: segment.closest('.program-item'),
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
          }
        });
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const dayOneItems = programData.filter(item => item.day === '5 GIU');
  const dayTwoItems = programData.filter(item => item.day === '6 GIU');

  const DayHeader = ({ number, month, label }: { number: string, month: string, label: string }) => (
    <div className="program-day-header relative flex items-center justify-between w-full mt-16 md:mt-24 mb-10 ml-12 md:ml-16">
      <div className="flex items-center gap-4 md:gap-6 relative z-10">
        <div className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full border-[4px] border-[#F3F2EB] font-display text-3xl md:text-5xl pt-1 bg-[#1a1a1a]">
          {number}
        </div>
        <span className="font-display text-4xl md:text-6xl lowercase leading-none">{month}</span>
      </div>
      <span className="font-display text-4xl md:text-6xl lowercase leading-none text-[#F3F2EB]/40 hidden sm:block pr-4">{label}</span>
    </div>
  );

  return (
    <section id="program" ref={sectionRef} className="relative py-24 md:py-40 bg-[#1a1a1a] text-[#F3F2EB] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-16 md:mb-24">
          <h2 className="program-heading font-display leading-[0.95] font-medium tracking-tighter" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}>Programma</h2>
          <p className="program-heading font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#F3F2EB]/60 mt-4 font-bold">IL PROGRAMMA DETTAGLIATO DEL FESTIVAL</p>
        </div>

        <div className="max-w-6xl mx-auto program-total-container relative">
          <DayHeader number="5" month="giugno" label="giorno uno" />
          <div className="grid gap-0 relative">
            {dayOneItems.map((item, index) => (
              <ProgramItemComponent 
                key={item.id} 
                item={item} 
                prevColorClass={index > 0 ? typeColors[dayOneItems[index-1].type] : null}
              />
            ))}
          </div>

          <div className="mt-32">
            <DayHeader number="6" month="giugno" label="giorno due" />
            <div className="grid gap-0 relative">
              {dayTwoItems.map((item, index) => (
                <ProgramItemComponent 
                  key={item.id} 
                  item={item} 
                  prevColorClass={index > 0 ? typeColors[dayTwoItems[index-1].type] : (dayOneItems.length > 0 ? typeColors[dayOneItems[dayOneItems.length-1].type] : null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgramItemComponent = ({ item, prevColorClass }: { item: ProgramItem, prevColorClass: string | null }) => {
  const currentColorClass = typeColors[item.type] || "bg-white/20";
  const isBreak = item.type === 'Break';

  return (
    <div id={`event-${item.id}`} className="program-item group relative flex items-center justify-between py-10 border-b border-white/10 pl-10 md:pl-16 transition-all duration-500 cursor-default">
      
      {/* TIMELINE CONTAINER */}
      <div className="absolute left-[7px] top-0 bottom-0 w-[2px] z-0">
        
        {/* TOP HALF: Takes color from PREVIOUS item */}
        {prevColorClass && (
          <div className="absolute top-0 h-[38px] w-full overflow-hidden">
            <div className={cn("segment-grow w-full h-full origin-top", prevColorClass.includes('bg-') ? prevColorClass : "")} 
                 style={!prevColorClass.includes('bg-') ? { backgroundColor: prevColorClass } : {}}></div>
          </div>
        )}

        {/* BOTTOM HALF: Takes color from CURRENT item and goes to next */}
        <div className="absolute top-[38px] bottom-0 w-full overflow-hidden">
          <div className={cn("segment-grow w-full h-full origin-top", currentColorClass.includes('bg-') ? currentColorClass : "")}
               style={!currentColorClass.includes('bg-') ? { backgroundColor: currentColorClass } : {}}></div>
        </div>
      </div>

      {/* QUADRATINO (NODO) */}
      <div 
        className={cn(
          "absolute left-0 top-[38px] w-4 h-4 z-10 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-transform duration-300 group-hover:scale-125",
          currentColorClass
        )}
      ></div>
      
      <div className="flex flex-col gap-1 relative z-10">
        <h3 className="font-display font-medium text-2xl md:text-4xl leading-tight tracking-tight group-hover:text-white transition-colors duration-300">{item.title}</h3>
        <span className="font-body text-sm md:text-base text-[#F3F2EB]/60 mt-1 uppercase tracking-wider">{item.time}</span>
      </div>

      <div className="text-right shrink-0 ml-4 relative z-10">
        <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#F3F2EB]/40 font-bold">{item.type}</span>
      </div>
    </div>
  );
};

export default ProgramSection;
