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
      if (target.closest('.paint-toolbar-container')) {
        setIsOverToolbar(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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
      
      {/* Main Cursor (SVG) - The tip is at top-left of the div */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10003] will-change-transform"
      >
        <img 
          src="/Pointer.svg" 
          alt="Cursor"
          className="w-full h-full object-contain"
        />
      </div>
    </>
  );
};

export default CustomCursor;
