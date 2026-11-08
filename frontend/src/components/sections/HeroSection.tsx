import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon5 from '@/assets/5-dark.svg';
import Icon6 from '@/assets/6-dark.svg';
import heroScrollCta from '@/assets/hero-scroll-cta.svg';

gsap.registerPlugin(ScrollTrigger);

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
};

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-animate', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      gsap.to('.hero-parallax', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 z-10 select-none overflow-hidden"
    >
      {/* MOBILE LAYOUT */}
      <div className="flex md:hidden flex-col justify-between flex-grow w-full relative z-20">
        <div className="hero-animate font-body text-xs leading-tight tracking-normal font-normal text-[#262626] uppercase">
          <span>TALK</span><br />
          <span>WORKSHOP</span><br />
          <span>NETWORK</span><br />
          <span>EXHIBITIONS</span><br />
          <span>PARTY</span>
        </div>

        <div className="hero-parallax hero-animate mt-8 max-w-[300px]">
          <h1 className="text-[#262626] leading-[1] tracking-tight font-display font-medium text-[5.5rem]">
            Life<br />design<br />festival
          </h1>
        </div>

        {/* CENTER CLUSTER: Date Axis */}
        <div className="hero-parallax hero-animate flex items-center justify-between w-full max-w-[348px] mx-auto mt-10 mb-10 flex-nowrap">
          <img src={Icon5} alt="5" className="w-[82px] h-[82px] object-contain shrink-0" />
          <button
            onClick={scrollToAbout}
            className="w-[79px] h-[79px] flex items-center justify-center transform transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
          >
            <img src={heroScrollCta} alt="Go to About" className="w-full h-full object-contain" />
          </button>
          <img src={Icon6} alt="6" className="w-[82px] h-[82px] object-contain shrink-0" />
        </div>

        {/* INFORMATION MID-LAYER */}
        <div className="relative w-full flex justify-between items-end mb-16">
          <div className="hero-animate">
            <span className="font-display font-medium text-7xl text-[#262626] leading-none lowercase">
              giugno
            </span>
          </div>

          <div className="hero-animate text-right font-body text-sm leading-tight tracking-normal font-normal text-[#262626] uppercase">
            TERMINAL FAL<br />GALLITELLO
          </div>
        </div>

        {/* BOTTOM ANCHOR */}
        <div className="w-full flex justify-between items-end relative z-20">
          <div className="hero-animate">
            <span className="font-display font-medium text-6xl text-[#262626] leading-none">
              (PZ)
            </span>
          </div>
          <div className="hero-animate text-right font-body text-sm leading-tight tracking-normal text-[#262626] uppercase">
            SECONDA<br />EDIZIONE
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex flex-col justify-between flex-grow w-full max-w-[1400px] mx-auto relative z-20">
        <div className="flex justify-between items-start w-full relative z-40">
          <div className="hero-parallax hero-animate">
            <h1 className="text-[#262626] leading-[0.85] tracking-tight font-display font-medium text-[clamp(4rem,9.5vw,9.5rem)] text-left">
              Life<br />design<br />festival
            </h1>
          </div>

          <div className="hero-animate text-right font-body text-[23px] leading-tight tracking-normal font-normal text-[#262626] z-40 uppercase">
            <span>TALK</span><br />
            <span>WORKSHOP</span><br />
            <span>NETWORK</span><br />
            <span>EXHIBITIONS</span><br />
            <span>PERFORMANCE</span><br />
            <span>PARTY</span>
          </div>
        </div>

        <div className="flex justify-between items-center w-full relative z-40">
          <div className="hero-animate font-body text-[23px] uppercase tracking-normal font-normal text-[#262626] leading-tight text-left">
            TERMINAL FAL<br />
            GALLITELLO
          </div>

          <div className="hero-animate flex items-center gap-6">
            <img src={Icon5} alt="5" className="w-40 h-40 object-contain" />
            <button 
              onClick={scrollToAbout}
              className="w-24 h-24 flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
              <img src={heroScrollCta} alt="Go to About" className="w-full h-full object-contain" />
            </button>
            <img src={Icon6} alt="6" className="w-40 h-40 object-contain" />
          </div>
        </div>

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
