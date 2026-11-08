import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePaint } from '@/context/PaintContext';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { mode, isActive } = usePaint();
  const [isMobile, setIsMobile] = useState(true); 
  const [isOverToolbar, setIsOverToolbar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(window.innerWidth < 1024 || touchCapable);
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

    const shouldHideNative = !isActive || mode !== 'draw' || isOverToolbar;
    document.body.classList.toggle('hide-cursor', shouldHideNative);

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
      }
    };

    const handleToolbarCheck = (e: MouseEvent, over: boolean) => {
      if ((e.target as HTMLElement).closest('.paint-toolbar-container')) {
        setIsOverToolbar(over);
      }
    };

    const onMouseOver = (e: MouseEvent) => handleToolbarCheck(e, true);
    const onMouseOut = (e: MouseEvent) => handleToolbarCheck(e, false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      document.body.classList.remove('hide-cursor');
    };
  }, [isMobile, isActive, mode, isOverToolbar]);

  if (isMobile) return null;
  if (isActive && mode === 'draw' && !isOverToolbar) return null;

  return (
    <>
      <style>{`
        .hide-cursor, .hide-cursor * {
          cursor: none !important;
        }
      `}</style>
      
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] will-change-transform"
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
