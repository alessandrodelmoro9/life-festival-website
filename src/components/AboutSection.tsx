import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Blob morph on scroll
      gsap.to('.about-blob', {
        scale: 1.15,
        rotation: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.fromTo('.about-text',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.about-text',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo('.about-heading',
        { opacity: 0, x: -80 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: '.about-heading',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Organic blob */}
      <div className="about-blob absolute -right-32 top-0 w-[500px] h-[600px] md:w-[700px] md:h-[800px] opacity-60">
        <svg viewBox="0 0 500 600" fill="hsl(var(--life-pink))">
          <path d="M 400 0 Q 500 100 450 200 Q 400 300 500 400 Q 450 500 350 500 Q 250 550 200 450 Q 150 350 50 400 Q 0 350 50 250 Q 100 150 200 100 Q 300 50 400 0 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl">
          <h2
            className="about-heading font-display font-black text-foreground leading-[0.95]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}
          >
            Progetta<br />la tua vita
          </h2>

          <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="about-text font-body text-lg md:text-xl leading-relaxed text-foreground">
              Life Design Festival è un evento dedicato a chi vuole ripensare la propria vita attraverso il design, la creatività e l'innovazione. Due giorni di talk, workshop e connessioni autentiche.
            </p>
            <p className="about-text font-body text-lg md:text-xl leading-relaxed text-muted-foreground">
              Seconda edizione — 5 e 6 giugno 2026 a Potenza, nel Terminal Gallitello. Un luogo dove le idee prendono forma e il futuro si progetta insieme.
            </p>
          </div>

          {/* Decorative line with nodes */}
          <svg className="about-text mt-16 w-full h-2" viewBox="0 0 1000 8">
            <line x1="0" y1="4" x2="1000" y2="4" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <circle cx="200" cy="4" r="4" fill="hsl(var(--life-pink))" />
            <circle cx="500" cy="4" r="4" fill="hsl(var(--life-blue))" />
            <circle cx="800" cy="4" r="4" fill="hsl(var(--life-red))" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
