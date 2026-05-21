import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sponsorsData, Sponsor } from '@/data/sponsorsData';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const CategoryBlock = ({ label, sponsors }: { label: string, sponsors: Sponsor[] }) => {
  if (sponsors.length === 0) return null;

  // Detect if this block has few items to make them larger
  const isSmallSet = sponsors.length <= 2;

  return (
    <div className="category-block border-t border-white/10 pt-2 pb-2 flex flex-col w-full overflow-hidden">
      <span className="uppercase text-white/40 mb-2 text-left font-body font-medium text-[10px] md:text-[11px]">
        {label}
      </span>
      
      {/* Grid container to enforce max 4 logos per row */}
      <div className={cn(
        "grid items-center justify-items-start gap-4 md:gap-8 w-full min-h-[4rem] md:min-h-[8rem]",
        isSmallSet ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
      )}>
        {sponsors.map((sponsor) => {
          const isBCC = sponsor.name === "BCC Basilicata";
          const isMainSponsor = sponsor.name === "La Gala Home";
          
          return (
            <div 
              key={sponsor.id} 
              className={cn(
                "flex items-center justify-start relative w-full",
                isSmallSet ? "h-16 md:h-32" : "h-12 md:h-24",
                (isBCC || isMainSponsor) && "col-span-full"
              )}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className={cn(
                  "object-contain object-left h-full w-auto opacity-90 hover:opacity-100 transition-opacity duration-300",
                  isBCC && "scale-[2.2] origin-left",
                  isMainSponsor && "scale-[1.2] origin-left",
                  (isSmallSet && !isBCC && !isMainSponsor) && "scale-[1.1] md:scale-[1.2] origin-left"
                )}
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
    <section id="sponsors" ref={sectionRef} className="bg-life-black py-24 md:py-32 overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-[1441px] flex items-center justify-center">
        <div className="w-full max-w-[1011px] h-full flex flex-col justify-center px-6 md:px-0">
          
          <div className="sponsor-animate mb-12 md:mb-16">
            <h2 className="text-h1 text-life-cream mb-6 tracking-tighter">
              Partner <br />& sponsor
            </h2>
            <h5 className="text-white/40 uppercase font-body">
              L'ECOSISTEMA CHE RENDE POSSIBILE LIFE 2026
            </h5>
          </div>

          <div className="flex flex-col w-full max-w-[1011px] gap-y-8 md:gap-y-10">
            {/* Main Sponsor Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20">
              <div className="flex flex-col min-w-0">
                <CategoryBlock 
                  label="MAIN SPONSOR" 
                  sponsors={sponsorsData.filter(s => s.category === 'top')} 
                />
              </div>
              <div className="hidden md:block" />
            </div>

            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20">
                <div className="flex flex-col min-w-0">
                  <CategoryBlock 
                    label={row.left.label} 
                    sponsors={sponsorsData.filter(s => s.category === row.left.category)} 
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <CategoryBlock 
                    label={row.right.label} 
                    sponsors={sponsorsData.filter(s => s.category === row.right.category)} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
