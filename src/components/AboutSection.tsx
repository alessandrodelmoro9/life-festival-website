import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePaint } from '@/context/PaintContext';
import BottoneIcon from '@/assets/bottone.svg';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { setIsActive, setMode } = usePaint();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.about-animate',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleActivatePaint = () => {
    setIsActive(true);
    setMode('draw');
  };

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-[1008px] mx-auto h-auto px-6 md:px-0">
        
        {/* RIGA SUPERIORE: H1 + Bottone */}
        <div className="about-animate flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-0">
          <h2 className="text-h1 text-life-black leading-[0.9] tracking-tighter">
            Ogni gesto<br />lascia una<br />traccia.
          </h2>

          <div 
            className="group flex items-center justify-end gap-4 cursor-pointer md:mt-4 w-[199px] h-[86px]"
            onClick={handleActivatePaint}
          >
            <span className="font-body text-[12px] font-bold uppercase text-left leading-tight tracking-[0px] text-life-black">
              DISEGNA <br /> LA TUA <br /> TRACCIA
            </span>
            <div className="w-14 h-14 bg-life-pink flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm flex-shrink-0">
              <img src={BottoneIcon} alt="Paint Mode" className="w-8 h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* RIGA CENTRALE: Sottotitolo */}
        <div className="about-animate mt-[90px] mb-8 max-w-[356px]">
          <h4 className="text-life-black leading-tight">
            Il festival del design <br /> digitale in Basilicata
          </h4>
        </div>

        {/* RIGA INFERIORE: Colonne di testo */}
        <div className="about-animate grid grid-cols-1 md:grid-cols-2 gap-[34px] w-full">
          <h5 className="text-life-black tracking-[0px] leading-snug font-body normal-case">
            Il 5 e 6 giugno 2026, torna per la seconda edizione Life Design Festival, il festival del design della comunicazione della Basilicata. Il Terminal Gallitello di Potenza diventa il fulcro della creatività in lucania: 2 giorni di talk, workshop, mostre e attività per esplorare il presente ed il futuro della progettazione, con grandi professionisti, esperti del settore e docenti accademici. Qui, ogni idea conta.
          </h5>
          <h5 className="text-life-black tracking-[0px] leading-snug font-body normal-case">
            Crediamo che la vita sia una superficie da disegnare. Ogni segno è l'inizio di qualcosa di nuovo, al Life definiamo una cultura progettuale lucana. Il festival è il punto di incontro tra la visione creativa e l'azione consapevole: due giorni per connettere idee, persone e territori. Vivi un'esperienza immersiva e definisci il futuro attraverso decisioni progettuali consapevoli, perché ogni gesto lascia una traccia.
          </h5>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
