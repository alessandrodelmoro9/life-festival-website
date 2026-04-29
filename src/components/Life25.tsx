import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CONFIG = {
  mouseThreshold: 80,       // Increased threshold to reduce image density
  imageLifespan: 1200,      // Longer lifespan for better visual impact
  inDuration: 0.4,          
  outDuration: 0.8,         
  baseRotation: 15,         
  maxRotationFactor: 2.0,   
  minImageSize: 180,        // Slightly smaller images
  maxImageSize: 350,        
  speedSmoothingFactor: 0.1,
  maxActiveImages: 15,      // Hard limit on DOM nodes for performance
};

// Selection of lighter images (avoiding the 14MB ones)
const IMAGES = [
  '/assets/life25/06051.jpg', '/assets/life25/06052.jpg', '/assets/life25/06053.jpg',
  '/assets/life25/06054.jpg', '/assets/life25/06055.jpg', '/assets/life25/06056.jpg',
  '/assets/life25/060510.jpg', '/assets/life25/060511.jpg', '/assets/life25/060512.jpg',
  '/assets/life25/0705103.jpg', '/assets/life25/0705105.jpg', '/assets/life25/0705106.jpg',
];

const Life25 = () => {
  const containerRef = useRef<HTMLElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());
  const smoothedSpeed = useRef(0);
  const maxSpeed = useRef(0.5);
  const imageIndex = useRef(0);
  const activeImages = useRef<{ element: HTMLDivElement; removeTime: number; isRemoving: boolean }[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        mousePos.current = { x: clientX, y: clientY };
      };

      const calculateSpeed = () => {
        const now = Date.now();
        const dt = now - lastMoveTime.current;
        if (dt <= 0) return smoothedSpeed.current;

        const dx = mousePos.current.x - lastMousePos.current.x;
        const dy = mousePos.current.y - lastMousePos.current.y;
        const dist = Math.hypot(dx, dy);
        
        const raw = dist / dt;
        if (raw > maxSpeed.current) maxSpeed.current = raw;
        
        const norm = Math.min(raw / (maxSpeed.current || 0.5), 1);
        smoothedSpeed.current = smoothedSpeed.current * (1 - CONFIG.speedSmoothingFactor) + norm * CONFIG.speedSmoothingFactor;
        lastMoveTime.current = now;
        
        return smoothedSpeed.current;
      };

      const createImage = () => {
        // Performance guard: don't create too many images
        if (activeImages.current.length >= CONFIG.maxActiveImages) return;

        const rect = container.getBoundingClientRect();
        const isInside = (
            mousePos.current.x >= rect.left && 
            mousePos.current.x <= rect.right && 
            mousePos.current.y >= rect.top && 
            mousePos.current.y <= rect.bottom
        );
        if (!isInside) return;

        const dx = mousePos.current.x - lastMousePos.current.x;
        const dy = mousePos.current.y - lastMousePos.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < CONFIG.mouseThreshold) return;

        const speed = calculateSpeed();
        const size = CONFIG.minImageSize + (CONFIG.maxImageSize - CONFIG.minImageSize) * speed;
        const rot = (Math.random() - 0.5) * CONFIG.baseRotation * (1 + speed * (CONFIG.maxRotationFactor - 1));

        const x = mousePos.current.x - rect.left;
        const y = mousePos.current.y - rect.top;

        const imgDiv = document.createElement('div');
        imgDiv.className = 'absolute pointer-events-none overflow-hidden will-change-transform';
        imgDiv.style.width = `${size}px`;
        imgDiv.style.height = `${size}px`;
        imgDiv.style.left = `${x}px`;
        imgDiv.style.top = `${y}px`;
        imgDiv.style.zIndex = '10'; // Images at z-10
        imgDiv.style.transform = 'translate(-50%, -50%) scale(0)';
        
        const img = document.createElement('img');
        img.src = IMAGES[imageIndex.current];
        img.className = 'w-full h-full object-cover';
        img.loading = 'eager'; // Force loading for trail effect
        imgDiv.appendChild(img);
        
        container.appendChild(imgDiv);
        
        gsap.to(imgDiv, {
          scale: 1,
          rotation: rot,
          opacity: 1,
          duration: CONFIG.inDuration,
          ease: 'power2.out'
        });

        activeImages.current.push({
          element: imgDiv,
          removeTime: Date.now() + CONFIG.imageLifespan,
          isRemoving: false
        });

        imageIndex.current = (imageIndex.current + 1) % IMAGES.length;
        lastMousePos.current = { ...mousePos.current };
      };

      const update = () => {
        const now = Date.now();
        
        // Use a reverse loop for safer array modification if needed, 
        // but here we just process the first one that needs removal
        if (activeImages.current.length > 0) {
          const toRemove = activeImages.current.filter(img => now >= img.removeTime && !img.isRemoving);
          toRemove.forEach(imgObj => {
            imgObj.isRemoving = true;
            gsap.to(imgObj.element, {
              opacity: 0,
              scale: 0.1,
              duration: CONFIG.outDuration,
              ease: 'power2.in',
              onComplete: () => {
                const idx = activeImages.current.indexOf(imgObj);
                if (idx > -1) activeImages.current.splice(idx, 1);
                if (imgObj.element.parentNode) imgObj.element.remove();
              }
            });
          });
        }

        createImage();
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchstart', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleMouseMove, { passive: true });

      gsap.ticker.add(update);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchstart', handleMouseMove);
        window.removeEventListener('touchmove', handleMouseMove);
        gsap.ticker.remove(update);
      };
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="life25"
      ref={containerRef}
      className="relative h-screen w-full bg-[#262626] overflow-hidden flex items-center justify-center z-20"
    >
      {/* Monumental Typography with layered z-indexes */}
      <div className="flex select-none pointer-events-none items-center justify-center w-full h-full px-4 overflow-hidden">
        {/* Desktop Layout: Horizontal single line (lowercase) */}
        <h2 className="hidden md:flex whitespace-nowrap justify-center font-display font-bold text-[28vw] lowercase leading-none tracking-tighter text-[#F4EEE4]">
          <span className="relative z-[15]">l</span>
          <span className="relative z-[5]">i</span>
          <span className="relative z-[15]">f</span>
          <span className="relative z-[5]">e</span>
          <span className="mx-[0.03em]"></span>
          <span className="relative z-[15]">2</span>
          <span className="relative z-[5]">5</span>
        </h2>

        {/* Mobile Layout: 3 Lines (LI, FE, 25) in Uppercase with grid alignment */}
        <h2 className="flex md:hidden flex-col items-center justify-center font-display font-bold uppercase leading-[0.8] tracking-tighter text-[#F4EEE4]">
          <div className="flex flex-col items-center">
            <div className="flex text-[38vw] leading-none">
              <span className="relative z-[15] inline-block w-[0.5em] text-center">L</span>
              <span className="relative z-[5] inline-block w-[0.5em] text-center">I</span>
            </div>
            <div className="flex text-[38vw] leading-none -mt-[0.05em]">
              <span className="relative z-[15] inline-block w-[0.5em] text-center">F</span>
              <span className="relative z-[5] inline-block w-[0.5em] text-center">E</span>
            </div>
            <div className="flex text-[38vw] leading-none -mt-[0.05em]">
              <span className="relative z-[15] inline-block w-[0.5em] text-center">2</span>
              <span className="relative z-[5] inline-block w-[0.5em] text-center">5</span>
            </div>
          </div>
        </h2>
      </div>
    </section>
  );
};

export default Life25;
