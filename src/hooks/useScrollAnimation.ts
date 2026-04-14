import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      // Fade-in-up elements
      gsap.utils.toArray<HTMLElement>('[data-scroll-fade]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Scale-in elements
      gsap.utils.toArray<HTMLElement>('[data-scroll-scale]').forEach((el) => {
        gsap.fromTo(el,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Parallax elements
      gsap.utils.toArray<HTMLElement>('[data-scroll-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.scrollParallax || '0.2');
        gsap.to(el, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Horizontal slide elements
      gsap.utils.toArray<HTMLElement>('[data-scroll-slide]').forEach((el) => {
        const dir = el.dataset.scrollSlide || 'left';
        gsap.fromTo(el,
          { x: dir === 'left' ? -100 : 100, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, ref.current);

    return () => ctx.revert();
  }, []);

  return ref;
}
