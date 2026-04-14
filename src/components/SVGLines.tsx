import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CurvedLine = ({ className = '' }: { className?: string }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: pathRef.current,
        start: 'top 90%',
        end: 'bottom 30%',
        scrub: 1,
      },
    });
  }, []);

  return (
    <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 400 800" fill="none" preserveAspectRatio="none">
      <path
        ref={pathRef}
        d="M 50 0 Q 350 200 50 400 Q -50 500 200 600 Q 400 700 300 800"
        stroke="hsl(var(--foreground))"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export const ColoredSquare = ({
  color,
  className = '',
  size = 24,
}: {
  color: 'pink' | 'blue' | 'red';
  className?: string;
  size?: number;
}) => {
  const colorMap = {
    pink: 'bg-primary',
    blue: 'bg-secondary',
    red: 'bg-accent',
  };

  return (
    <div
      className={`${colorMap[color]} ${className}`}
      style={{ width: size, height: size }}
      data-scroll-parallax="-0.15"
    />
  );
};
