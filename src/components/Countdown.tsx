import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ColoredSquare = ({ color, className, size = 12 }: { color: 'blue' | 'pink' | 'red', className?: string, size?: number }) => {
  const bgClass = {
    blue: 'bg-[#0070f3]',
    pink: 'bg-[#ff0080]',
    red: 'bg-[#ff4500]'
  }[color];

  return (
    <div 
      className={`countdown-deco absolute ${bgClass} ${className} opacity-0`}
      style={{ width: size, height: size }}
    />
  );
};

const Countdown = () => {
  const [displayTime, setDisplayTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [actualTime, setActualTime] = useState<TimeLeft | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const isAnimating = useRef(false);
  const hasFinishedInitialAnimation = useRef(false);

  useEffect(() => {
    const targetDate = new Date('2026-06-05T09:00:00').getTime();
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        const time = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
        setActualTime(time);
        if (hasFinishedInitialAnimation.current) setDisplayTime(time);
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!actualTime || isAnimating.current || hasFinishedInitialAnimation.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (isAnimating.current || hasFinishedInitialAnimation.current) return;
          isAnimating.current = true;

          const proxy = { d: 0, h: 0, m: 0, s: 0 };
          gsap.to(proxy, {
            d: actualTime.days, h: actualTime.hours, m: actualTime.minutes, s: actualTime.seconds,
            duration: 2.5, ease: "expo.out",
            onUpdate: () => setDisplayTime({
              days: Math.round(proxy.d),
              hours: Math.round(proxy.h),
              minutes: Math.round(proxy.m),
              seconds: Math.round(proxy.s),
            }),
            onComplete: () => {
              hasFinishedInitialAnimation.current = true;
              isAnimating.current = false;
            }
          });

          // Line animation
          if (lineRef.current) {
            const length = lineRef.current.getTotalLength();
            gsap.fromTo(lineRef.current, 
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut" }
            );
          }

          // Floating squares entrance
          gsap.to('.countdown-deco', {
            opacity: 0.6,
            scale: 1,
            duration: 1.5,
            stagger: 0.15,
            ease: "back.out(1.7)"
          });

          // Labels entrance
          gsap.fromTo('.countdown-label', 
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 1, ease: "power2.out" }
          );
        },
        once: true
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [actualTime !== null]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.1;
    const y = (clientY - top - height / 2) * 0.1;

    gsap.to(currentTarget.querySelector('.current-value'), {
      x, y,
      scale: 1.05,
      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget.querySelector('.current-value'), {
      x: 0, y: 0,
      scale: 1,
      filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
      duration: 0.6,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  const items = [
    { value: displayTime.days, label: 'Giorni' },
    { value: displayTime.hours, label: 'Ore' },
    { value: displayTime.minutes, label: 'Minuti' },
    { value: displayTime.seconds, label: 'Secondi' },
  ];

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Single Dynamic Background Line */}
      <svg className="absolute top-0 left-0 w-full h-[200px] md:h-[400px] pointer-events-none z-0 opacity-20" viewBox="0 0 1500 400" preserveAspectRatio="none">
        <path 
          ref={lineRef} 
          d="M -50 -50 Q 300 200 750 150 Q 1200 100 1600 350" 
          stroke="hsl(var(--foreground))" 
          strokeWidth="1.2" 
          fill="none" 
        />
      </svg>

      {/* Floating Squares for Continuity - Reduced to 6 */}
      <ColoredSquare color="blue" className="top-[15%] left-[10%]" size={14} />
      <ColoredSquare color="pink" className="top-[45%] left-[20%]" size={10} />
      <ColoredSquare color="red" className="bottom-[25%] left-[35%]" size={12} />
      <ColoredSquare color="blue" className="top-[25%] right-[15%]" size={16} />
      <ColoredSquare color="pink" className="bottom-[20%] right-[30%]" size={14} />
      <ColoredSquare color="red" className="top-[60%] right-[10%]" size={10} />

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-row flex-nowrap justify-center items-center gap-4 md:gap-16 lg:gap-24 max-w-6xl mx-auto overflow-hidden">
          {items.map((item) => (
            <div 
              key={item.label} 
              className="flex flex-col items-center text-center cursor-default group py-2"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative h-[1.1em] flex items-center justify-center">
                <span className="current-value font-display text-4xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-none text-foreground transition-all duration-300">
                  {formatNumber(item.value)}
                </span>
              </div>
              <span className="countdown-label font-body text-[7px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground mt-2 md:mt-10 opacity-0">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Countdown;
