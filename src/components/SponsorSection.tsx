import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sponsorsData, Sponsor } from '@/data/sponsorsData';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const CategoryBlock = ({ label, sponsors, category }: { label: string, sponsors: Sponsor[], category: Sponsor['category'] }) => {
  if (sponsors.length === 0) return null;

  // 1. Even More Compact Container Height
  const containerHeight = (category === 'main' || category === 'experience') 
    ? "h-20 md:h-28" 
    : "h-14 md:h-20";

  return (
    <div className="category-block border-t border-white/10 pt-6 pb-8 h-full flex flex-col">
      <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50 mb-4 text-center">
        {label}
      </p>
      
      {/* 2. CENTERED SINGLE LINE: Consistent container widths for uniform layout */}
      <div className="flex flex-nowrap items-center justify-center gap-x-8 md:gap-x-12 w-full">
        {sponsors.map((sponsor) => {
          const scale = sponsor.scale || 1.0;
          const isArchitetti = sponsor.name === "Ordine degli Architetti di Potenza";
          const isEtimologia = sponsor.name === "Etimologia";
          
          let transform = `scale(${scale})`;
          if (isArchitetti) transform += ' translateY(12%)';
          if (isEtimologia) transform += ' translateY(8%) translateX(-6%)';

          return (
            <div 
              key={sponsor.id} 
              className={cn(
                "flex items-center justify-center relative overflow-visible",
                // Ensuring same size for all containers in the same row
                "w-[120px] md:w-[160px]", 
                containerHeight
              )}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="object-contain object-center transition-all duration-300 opacity-90 hover:opacity-100 h-full w-auto max-w-full"
                style={{ 
                  filter: 'brightness(0) invert(1) contrast(200%)',
                  transform: transform,
                  transformOrigin: 'center center'
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
      left: { label: "MAIN SPONSOR", category: 'main' as const },
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
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 xl:gap-x-32 items-stretch">
              <div className="flex flex-col">
                <CategoryBlock 
                  label={row.left.label} 
                  sponsors={sponsorsData.filter(s => s.category === row.left.category)} 
                  category={row.left.category}
                />
              </div>
              <div className="flex flex-col">
                <CategoryBlock 
                  label={row.right.label} 
                  sponsors={sponsorsData.filter(s => s.category === row.right.category)} 
                  category={row.right.category}
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
