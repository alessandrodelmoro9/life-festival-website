import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePaint } from '@/context/PaintContext';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const follower1Ref = useRef<HTMLDivElement>(null);
  const follower2Ref = useRef<HTMLDivElement>(null);
  const follower3Ref = useRef<HTMLDivElement>(null);
  const { mode, isActive } = usePaint();
  const [isMobile, setIsMobile] = useState(true); 
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
    if (isMobile) {
      document.body.classList.remove('hide-cursor');
      return;
    }

    // Aggiungiamo la classe solo se non siamo in modalità disegno
    // o se siamo sopra la toolbar
    const shouldHideNative = !isActive || mode !== 'draw' || isOverToolbar;
    
    if (shouldHideNative) {
      document.body.classList.add('hide-cursor');
    } else {
      document.body.classList.remove('hide-cursor');
    }

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
        });
      }

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
  }, [isMobile, isActive, mode, isOverToolbar]);

  if (isMobile) return null;
  
  // In draw mode, hide custom cursor ONLY if NOT over the toolbar
  const isCursorHidden = isActive && mode === 'draw' && !isOverToolbar;
  if (isCursorHidden) return null;

  return (
    <>
      <style>{`
        .hide-cursor, .hide-cursor * {
          cursor: none !important;
        }
      `}</style>
      
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
