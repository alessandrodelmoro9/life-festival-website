import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sponsorsData, Sponsor } from '@/data/sponsorsData';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const CategoryBlock = ({ label, sponsors }: { label: string, sponsors: Sponsor[] }) => {
  if (sponsors.length === 0) return null;

  return (
    <div className="category-block border-t border-white/10 pt-4 pb-4 flex flex-col h-full w-full">
      <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mb-4 text-left">
        {label}
      </p>
      
      <div className="flex flex-nowrap items-center justify-start gap-x-8 md:gap-x-10 w-full overflow-visible">
        {sponsors.map((sponsor) => {
          const isBCC = sponsor.name === "BCC Basilicata";
          const isGrafica = sponsor.name === "Grafica Metelliana";
          const isOrdine = sponsor.name.includes("Architetti");
          
          return (
            <div 
              key={sponsor.id} 
              className={cn(
                "flex items-center justify-start relative shrink-0",
                isBCC ? "h-24 md:h-36" : (isGrafica || isOrdine ? "h-16 md:h-24" : "h-12 md:h-16")
              )}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className={cn(
                  "object-contain object-left h-full w-auto opacity-90 hover:opacity-100 transition-opacity duration-300",
                  isBCC ? "max-w-[280px] md:max-w-[450px]" : (isGrafica || isOrdine ? "max-w-[180px] md:max-w-[280px]" : "max-w-[120px] md:max-w-[160px]")
                )}
                style={{ 
                  filter: 'brightness(0) invert(1)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SponsorSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.sponsor-animate',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
        }
      );

      gsap.fromTo('.category-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 70%',
            toggleActions: 'play none none none'
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const rows = [
    {
      left: { label: "CON IL SOSTEGNO DEL FONDO ETICO DI", category: 'main' as const },
      right: { label: "EXPERIENCE SPONSOR", category: 'experience' as const }
    },
    {
      left: { label: "ACTIVE SPONSOR", category: 'active' as const },
      right: { label: "PARTNER", category: 'partner' as const }
    },
    {
      left: { label: "COMMUNITY E CULTURAL PARTNER", category: 'community' as const },
      right: { label: "PATROCINI ISTITUZIONALI E STRATEGICI", category: 'institutional' as const }
    }
  ];

  return (
    <section id="sponsors" ref={sectionRef} className="bg-[#262626] pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="sponsor-animate mb-24 md:mb-32">
          <h2 className="font-display text-[#F4EEE4] text-5xl md:text-8xl leading-[0.9] mb-6 tracking-tighter">
            Partner &<br />sponsor
          </h2>
          <p className="font-body text-white/40 text-[10px] md:text-xs uppercase tracking-[0.4em]">
            L'ECOSISTEMA CHE RENDE POSSIBILE LIFE 2026
          </p>
        </div>

        <div className="flex flex-col w-full">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 xl:gap-x-32">
              <div>
                <CategoryBlock 
                  label={row.left.label} 
                  sponsors={sponsorsData.filter(s => s.category === row.left.category)} 
                />
              </div>
              <div>
                <CategoryBlock 
                  label={row.right.label} 
                  sponsors={sponsorsData.filter(s => s.category === row.right.category)} 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SponsorSection;
