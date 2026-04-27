import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon5 from '@/assets/5.svg';
import Icon6 from '@/assets/6.svg';
import Group46 from '@/assets/Group 46.svg';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger entrance for all elements with .hero-animate
      gsap.fromTo('.hero-animate',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.5 }
      );

      // Parallax effect on mobile title and icons
      gsap.to('.hero-parallax', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen w-full flex flex-col overflow-hidden bg-transparent">
      
      {/* ============================================================
          MOBILE VERSION (Editorial Grid)
          ============================================================ */}
      <div className="md:hidden relative w-full h-screen px-6 pt-24 pb-10 flex flex-col z-10">
        
        {/* UPPER RIGHT BLOCK: Tags */}
        <div className="hero-animate absolute right-6 top-32 text-right font-body text-[13px] leading-[1.4] tracking-normal font-normal text-[#262626] uppercase">
          <span>TALK</span><br />
          <span>WORKSHOP</span><br />
          <span>NETWORK</span><br />
          <span>EXPOSITION</span><br />
          <span>PARTY</span>
        </div>

        {/* MAIN TITLE (Left) */}
        <div className="hero-parallax hero-animate mt-12 max-w-[300px]">
          <h1 className="text-[#262626] leading-[0.8] tracking-tight font-display font-medium text-[5.5rem] lowercase">
            life<br />design<br />festival
          </h1>
        </div>

        {/* CENTER CLUSTER: Date Axis */}
        <div className="hero-parallax hero-animate flex items-center justify-center gap-10 my-auto w-full">
          <img src={Icon5} alt="5" className="w-24 h-24 object-contain" />
          <button
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-32 h-32 flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <img src={Group46} alt="Go to About" className="w-full h-full object-contain" />
          </button>
          <img src={Icon6} alt="6" className="w-24 h-24 object-contain" />
        </div>

        {/* INFORMATION MID-LAYER */}
        <div className="relative w-full flex justify-between items-end mb-32">
          {/* Month (Left) */}
          <div className="hero-animate">
            <span className="font-display font-medium text-7xl text-[#262626] leading-none lowercase">
              giugno
            </span>
          </div>

          {/* Location (Right) */}
          <div className="hero-animate text-right font-body text-sm leading-tight tracking-normal font-normal text-[#262626] uppercase">
            TERMINAL FAL<br />GALLITELLO
          </div>
        </div>

        {/* FOOTER ELEMENTS */}
        <div className="absolute bottom-10 left-6 right-6 flex justify-between items-end">
          {/* Bottom-Left: Edition */}
          <div className="hero-animate mb-2">
            <span className="font-body text-[13px] uppercase tracking-[0.2em] text-[#262626] font-normal">
              SECONDA EDIZIONE
            </span>
          </div>

          {/* Bottom-Right: PZ */}
          <div className="hero-animate">
            <span className="font-display font-medium text-8xl text-[#262626] leading-[0.7]">
              (PZ)
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          DESKTOP VERSION (Unchanged)
          ============================================================ */}
      <div className="hidden md:flex container mx-auto px-12 flex-1 flex-col justify-between py-20 relative z-10">
        
        {/* RIGA SUPERIORE: TOP */}
        <div className="flex justify-between items-start w-full">
          <div className="relative z-40 max-w-4xl">
            <h1 className="hero-animate text-[#262626] leading-[0.82] tracking-tight font-display font-medium text-left text-[clamp(5.5rem,12vw,9rem)]">
              Life design<br />festival
            </h1>
          </div>

          <div className="hero-animate text-right font-body text-[23px] leading-tight tracking-normal font-normal text-[#262626] z-40 uppercase">
            <span>TALK</span><br />
            <span>WORKSHOP</span><br />
            <span>NETWORK</span><br />
            <span>EXPOSITION</span><br />
            <span>PERFORMANCE</span><br />
            <span>PARTY</span>
          </div>
        </div>

        {/* RIGA CENTRALE: CENTER */}
        <div className="flex justify-between items-center w-full relative z-40">
          <div className="hero-animate font-body text-[23px] uppercase tracking-normal font-normal text-[#262626] leading-tight text-left">
            TERMINAL FAL<br />
            GALLITELLO
          </div>

          <div className="hero-animate flex items-center gap-6">
            <img src={Icon5} alt="5" className="w-40 h-40 object-contain" />
            <button 
              onClick={() => {
                const el = document.getElementById('about');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-24 h-24 flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
              <img src={Group46} alt="Go to About" className="w-full h-full object-contain" />
            </button>
            <img src={Icon6} alt="6" className="w-40 h-40 object-contain" />
          </div>
        </div>

        {/* RIGA INFERIORE: BOTTOM */}
        <div className="flex justify-between items-end w-full relative z-40">
          <div className="hero-animate">
            <span className="font-display font-medium text-[clamp(5rem,12vw,10rem)] leading-[0.8] text-[#262626]">
              (PZ)
            </span>
          </div>

          <div className="hero-animate absolute left-1/2 -translate-x-1/2 bottom-2 text-center">
            <div className="font-body text-[23px] uppercase tracking-normal text-[#262626] font-normal leading-tight">
              SECONDA<br />EDIZIONE
            </div>
          </div>

          <div className="hero-animate">
            <span className="font-display font-medium text-9xl text-[#262626] leading-none lowercase">
              giugno
            </span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
