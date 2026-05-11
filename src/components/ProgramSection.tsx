import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { programData, ProgramItem } from '@/data/programData';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Day5Icon from '@/assets/5.svg';
import Day6Icon from '@/assets/6.svg';

gsap.registerPlugin(ScrollTrigger);

const typeColors: Record<string, string> = {
  Talk: "bg-[#FF76BF]",           // Pink
  Workshop: "bg-[#7678F6]",       // Blue
  "Portfolio Review": "bg-[#B78F75]", // Brown
  Exposition: "bg-[#E25938]",      // Orange
  Party: "bg-[#E25938]",           // Orange
  Intro: "bg-[#E25938]",           // Orange
  Break: "bg-[#F4EEE4]",           // Cream
  Activity: "bg-[#B78F75]"         // Brown
};

const ProgramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({
    '5': false,
    '6': false
  });

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
  }, [openDays]); // Re-run GSAP when accordions toggle to re-register triggers

  const dayOneItems = programData.filter(item => item.day === '5 GIU');
  const dayTwoItems = programData.filter(item => item.day === '6 GIU');

  const toggleDay = (day: string) => {
    if (window.innerWidth < 1024) {
      setOpenDays(prev => ({
        ...prev,
        [day]: !prev[day]
      }));
      
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);
    }
  };

  const DayHeader = ({ number, month }: { number: string, month: string }) => {
    const isOpen = openDays[number];
    const icon = number === '5' ? Day5Icon : Day6Icon;

    return (
      <div 
        onClick={() => toggleDay(number)}
        className={cn(
          "program-day-header relative flex flex-col items-start w-full mt-4 md:mt-24 mb-4 md:mb-12 pl-10 md:pl-14 transition-all duration-300",
          "lg:cursor-default cursor-pointer group"
        )}
      >
        <div className="flex items-center gap-3 md:gap-4 relative z-10 mb-2 w-full">
          <div className="flex-shrink-0 w-[40px] md:w-[75px]">
            <img 
              src={icon} 
              alt={`Giorno ${number}`} 
              className="w-full h-auto block" 
            />
          </div>
          <h2 className="lowercase leading-none flex-grow">{month}</h2>
          
          <div className="lg:hidden ml-auto pr-4">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-[#F4EEE4] opacity-50" size={24} />
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="program" ref={sectionRef} className="relative py-24 md:py-40 bg-[#262626] text-[#F4EEE4] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {/* HEADER SECTION */}
          <div className="mb-12 md:mb-24 ml-10 md:ml-14">
            <h2 className="text-h1 text-life-cream mb-4 md:mb-6 tracking-tighter program-heading">Programma</h2>
            <h5 className="text-life-cream/80 max-w-[642.86px] leading-snug font-body uppercase tracking-[0px] program-heading">
              CHI LASCERÀ UNA TRACCIA SUL NOSTRO PALCO
            </h5>
          </div>

          {/* DUAL TIMELINE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 relative">
            
            {/* COLUMN: DAY 1 */}
            <div className="program-column relative">
              <DayHeader number="5" month="giugno" />
              <AnimatePresence initial={false}>
                {(openDays['5'] || window.innerWidth >= 1024) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid gap-0 relative overflow-hidden"
                  >
                    {dayOneItems.map((item, index) => (
                      <ProgramItemComponent 
                        key={item.id} 
                        item={item} 
                        prevColorClass={index > 0 ? typeColors[dayOneItems[index-1].type] : null}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* COLUMN: DAY 2 */}
            <div className="program-column relative">
              <DayHeader number="6" month="giugno" />
              <AnimatePresence initial={false}>
                {(openDays['6'] || window.innerWidth >= 1024) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid gap-0 relative overflow-hidden"
                  >
                    {dayTwoItems.map((item, index) => (
                      <ProgramItemComponent 
                        key={item.id} 
                        item={item} 
                        prevColorClass={index > 0 ? typeColors[dayTwoItems[index-1].type] : null}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgramItemComponent = ({ item, prevColorClass }: { item: ProgramItem, prevColorClass: string | null }) => {
  const currentColorClass = typeColors[item.type] || "bg-white/20";

  return (
    <div id={`event-${item.id}`} className="program-item group relative flex items-start justify-between py-8 pl-10 md:pl-14 pr-4 transition-all duration-500 cursor-default">
      
      {/* SEPARATOR LINE */}
      <div className="absolute bottom-0 left-10 md:left-14 right-4 h-[1px] bg-white/10" />

      {/* TIMELINE CONTAINER */}
      <div className="absolute left-[7px] top-0 bottom-0 w-[2px] z-0">
        
        {/* TOP HALF: Takes color from PREVIOUS item */}
        {prevColorClass && (
          <div className="absolute top-0 h-[38px] w-full overflow-hidden">
            <div className={cn("segment-grow w-full h-full origin-top", prevColorClass.includes('bg-') ? prevColorClass : "")} 
                 style={!prevColorClass.includes('bg-') ? { backgroundColor: prevColorClass } : {}}></div>
          </div>
        )}

        {/* BOTTOM HALF: Takes color from CURRENT item */}
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
      
      <div className="flex flex-col gap-1 relative z-10 pr-4 mt-[-6px]">
        <h4 className="group-hover:text-white transition-colors duration-300">{item.title}</h4>
        <h6 className="text-[#F4EEE4]/60 mt-1 uppercase">{item.time}</h6>
      </div>

      <div className="text-right shrink-0 relative z-10 mt-[-2px]">
        <p className="uppercase text-[#F4EEE4]/40 font-bold text-[10px] tracking-[0.05em]">{item.type}</p>
      </div>
    </div>
  );
};

export default ProgramSection;
