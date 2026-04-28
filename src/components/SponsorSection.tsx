import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sponsorsData, Sponsor } from '@/data/sponsorsData';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const SponsorItem = ({ sponsor, size = 'medium' }: { sponsor: Sponsor, size?: 'large' | 'medium' | 'small' }) => {
  const sizeClasses = {
    large: 'h-12 md:h-16 w-auto',
    medium: 'h-12 md:h-16 w-auto',
    small: 'h-12 md:h-16 w-auto'
  };

  return (
    <div className="flex items-center justify-center transition-all duration-500 ease-in-out cursor-default">
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className={`${sizeClasses[size]} object-contain`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text');
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
      ) : null}
      <span className={cn(
        "fallback-text font-body font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#262626] opacity-40",
        sponsor.logo ? "hidden" : ""
      )}>
        {sponsor.name}
      </span>
    </div>
  );
};

const SponsorBlock = ({ label, sponsors, size = 'medium', gridCols = 'grid-cols-2 md:grid-cols-3', isPatron = false }: { label: string, sponsors: Sponsor[], size?: 'large' | 'medium' | 'small', gridCols?: string, isPatron?: boolean }) => {
  if (sponsors.length === 0) return null;
  
  return (
    <div className="sponsor-block border-t border-[#262626] pt-8 pb-16 md:pb-32">
      <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#262626] font-bold mb-10 md:mb-16">
        {label}
      </p>
      <div className={cn(
        isPatron ? "flex flex-wrap gap-x-12 gap-y-8 items-center justify-start" : `grid ${gridCols} gap-x-8 gap-y-12 md:gap-20 items-center justify-items-start`
      )}>
        {sponsors.map((sponsor) => (
          <SponsorItem key={sponsor.id} sponsor={sponsor} size={size} />
        ))}
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
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo('.sponsor-block',
        { opacity: 0.1, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2,
          scrollTrigger: { trigger: '.sponsor-block', start: 'top 85%' },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const experienceSponsors = sponsorsData.filter(s => s.category === 'experience');
  const activeSponsors = sponsorsData.filter(s => s.category === 'active');
  const partnerSponsors = sponsorsData.filter(s => s.category === 'partner');
  const patronSponsors = sponsorsData.filter(s => s.category === 'patron');

  return (
    <section id="sponsors" ref={sectionRef} className="relative pt-32 md:pt-56 pb-0 bg-[#F4EEE4] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="sponsor-animate mb-24 md:mb-40">
          <h2
            className="font-display text-[#262626] leading-[0.95] font-medium tracking-tighter mb-4"
            style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
          >
            Partner &<br />Support
          </h2>
          <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#262626] opacity-60">
            L'ecosistema che rende possibile LIFE 2026
          </p>
        </div>

        <div className="max-w-[1400px]">
          <SponsorBlock 
            label="EXPERIENCE SPONSOR" 
            sponsors={experienceSponsors} 
            size="large" 
            gridCols="grid-cols-2 md:grid-cols-3" 
          />
          
          <SponsorBlock 
            label="ACTIVE SPONSOR" 
            sponsors={activeSponsors} 
            size="medium" 
            gridCols="grid-cols-1" 
          />
          
          <SponsorBlock 
            label="PARTNER" 
            sponsors={partnerSponsors} 
            size="small" 
            gridCols="grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
          />
          
          <SponsorBlock 
            label="PATROCINI ISTITUZIONALI E STRATEGICI" 
            sponsors={patronSponsors} 
            size="medium" 
            isPatron={true}
          />
        </div>

      </div>
    </section>
  );
};

export default SponsorSection;
