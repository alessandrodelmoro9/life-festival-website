import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const [displayTime, setDisplayTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const targetDate = useRef(new Date('2026-06-05T09:00:00').getTime());
  const hasAnimated = useRef(false);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate.current - now;
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => {
          if (hasAnimated.current) return;
          
          const finalTime = calculateTimeLeft();
          const proxy = { d: 0, h: 0, m: 0, s: 0 };

          // Count up animation
          gsap.to(proxy, {
            d: finalTime.days,
            h: finalTime.hours,
            m: finalTime.minutes,
            s: finalTime.seconds,
            duration: 2.5,
            ease: "power4.out",
            onUpdate: () => {
              setDisplayTime({
                days: Math.round(proxy.d),
                hours: Math.round(proxy.h),
                minutes: Math.round(proxy.m),
                seconds: Math.round(proxy.s),
              });
            },
            onComplete: () => {
              hasAnimated.current = true;
            }
          });
        },
        once: true
      });
    }, sectionRef.current);

    const timer = setInterval(() => {
      if (hasAnimated.current) {
        setDisplayTime(calculateTimeLeft());
      }
    }, 1000);

    return () => {
      ctx.revert();
      clearInterval(timer);
    };
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  
  const items = [
    { value: displayTime.days, label: 'Giorni', color: '#B78F75' }, // Marroncino
    { value: displayTime.hours, label: 'Ore', color: '#FF76BF' },   // Rosa
    { value: displayTime.minutes, label: 'Minuti', color: '#E25938' }, // Arancione
    { value: displayTime.seconds, label: 'Secondi', color: '#7678F6' }, // Blu
  ];

  return (
    <section ref={sectionRef} className="relative py-12 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-row justify-center items-stretch max-w-4xl mx-auto">
          {items.map((item) => (
            <div 
              key={item.label} 
              className="countdown-square relative flex-1 aspect-square md:aspect-auto md:h-[220px] flex flex-col items-center justify-center p-2 md:p-6 transition-all duration-500 hover:z-20 md:hover:scale-105"
              style={{ backgroundColor: item.color }}
            >
              <div className="flex flex-col items-center justify-center text-foreground">
                <span className="font-display text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-none mb-1">
                  {formatNumber(item.value)}
                </span>
                <span className="font-body text-[6px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-80">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Countdown;
