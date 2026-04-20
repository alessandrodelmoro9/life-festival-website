import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePaint } from '@/context/PaintContext';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const follower1Ref = useRef<HTMLDivElement>(null);
  const follower2Ref = useRef<HTMLDivElement>(null);
  const follower3Ref = useRef<HTMLDivElement>(null);
  const { mode, isActive } = usePaint();
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flash
  const [isOverToolbar, setIsOverToolbar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const smallScreen = window.innerWidth < 1024;
      setIsMobile(smallScreen || touchCapable);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    document.body.classList.add('hide-cursor');

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0,
        });
      }

      // Three followers with increasing delays
      if (follower1Ref.current) {
        gsap.to(follower1Ref.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: 'power2.out',
        });
      }
      if (follower2Ref.current) {
        gsap.to(follower2Ref.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
      if (follower3Ref.current) {
        gsap.to(follower3Ref.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, .cursor-pointer')) {
        gsap.to(cursorRef.current, { scale: 1.3, duration: 0.3 });
      }
      if (target.closest('.paint-toolbar-container')) {
        setIsOverToolbar(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, .cursor-pointer')) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
      }
      if (target.closest('.paint-toolbar-container')) {
        setIsOverToolbar(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      document.body.classList.remove('hide-cursor');
    };
  }, [isMobile]);

  // Hide cursor on mobile
  if (isMobile) return null;
  
  // In draw mode, hide custom cursor ONLY if NOT over the toolbar
  if (isActive && mode === 'draw' && !isOverToolbar) return null;

  return (
    <>
      <style>{`
        .hide-cursor, .hide-cursor * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Elongated Tail Components */}
      <div
        ref={follower3Ref}
        className="fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 rounded-full bg-black/10 pointer-events-none z-[10000] blur-xl"
        style={{ WILL_CHANGE: 'transform' }}
      />
      <div
        ref={follower2Ref}
        className="fixed top-0 left-0 w-7 h-7 -ml-3.5 -mt-3.5 rounded-full bg-black/20 pointer-events-none z-[10001] blur-lg"
        style={{ WILL_CHANGE: 'transform' }}
      />
      <div
        ref={follower1Ref}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full bg-black/40 pointer-events-none z-[10002] blur-md mix-blend-multiply"
        style={{ WILL_CHANGE: 'transform' }}
      />
      
      {/* Main Cursor (SVG) - The tip is at top-left of the div */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10003] will-change-transform"
      >
        <svg 
          viewBox="0 0 602 772" 
          className="w-full h-full drop-shadow-md"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22.9881 22.9678V743.637L267.681 539.247L570.952 487.137L22.9881 22.9678Z" fill="black"/>
          <path d="M275.952 554.137L34.6748 757.376C31.1639 761.543 25.4187 763.075 20.2996 761.224C15.1805 759.374 11.7555 754.521 11.7555 749.067L10 22.9923C9.98776 17.9431 12.9095 13.3474 17.5007 11.215C22.0796 9.08256 27.4811 9.79337 31.3603 13.0533L587.39 481.106C591.551 484.611 593.086 490.346 591.208 495.457C589.342 500.567 584.468 503.974 579.017 503.974L275.952 554.137ZM261.221 526.195L543.478 478.091L36.0374 50.9097L37.6333 713.564L261.221 526.195Z" fill="white"/>
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
