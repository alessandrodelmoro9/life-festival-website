import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CONFIG = {
  mouseThreshold: 45,
  imageLifespan: 1200,
  inDuration: 0.4,
  outDuration: 0.8,
  baseRotation: 15,
  maxRotationFactor: 2.0,
  minImageSize: 140,        // Immagini più grandi
  maxImageSize: 280,        // Immagini più grandi
  speedSmoothingFactor: 0.1,
  maxActiveImages: 22,
};

const IMAGES = [
  '/assets/life25/060522.jpg',
  '/assets/life25/06054.jpg',
  '/assets/life25/06058.jpg',
  '/assets/life25/070502.jpg',
  '/assets/life25/070503.jpg',
  '/assets/life25/0705102.jpg',
  '/assets/life25/070519.jpg',
  '/assets/life25/070522.jpg',
  '/assets/life25/070540.jpg',
  '/assets/life25/070549.jpg',
  '/assets/life25/070574.jpg',
  '/assets/life25/070577.jpg',
  '/assets/life25/070584.jpg',
  '/assets/life25/070592.jpg',
  '/assets/life25/070599.jpg'
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
        imgDiv.style.zIndex = '10';
        imgDiv.style.transform = 'translate(-50%, -50%) scale(0)';

        const img = document.createElement('img');
        img.src = IMAGES[imageIndex.current];
        img.className = 'w-full h-full object-cover';
        img.loading = 'eager'; 
        imgDiv.appendChild(img);

        container.appendChild(imgDiv);

        gsap.to(imgDiv, {
          scale: 0.9, // Parte quasi a dimensione piena
          rotation: rot,
          opacity: 1,
          duration: CONFIG.inDuration,
          ease: 'power2.out',
          force3D: true
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
        if (activeImages.current.length > 0) {
          const toRemove = activeImages.current.filter(img => now >= img.removeTime && !img.isRemoving);
          toRemove.forEach(imgObj => {
            imgObj.isRemoving = true;
            // Correzione: rimpicciolisce (scale: 0.1) ruotando in senso anti-orario (-=30)
            gsap.to(imgObj.element, {
              opacity: 0,
              scale: 0.1,
              rotation: "-=30",
              duration: CONFIG.outDuration,
              ease: 'power2.in',
              force3D: true,
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
      className="relative h-screen w-full bg-[#FF76BF] overflow-hidden flex items-center justify-center z-20"
    >
      <div className="absolute inset-0 pointer-events-none p-[40px] z-30">
        <div className="relative w-full h-full text-[#262626] font-display uppercase text-[12px] tracking-widest opacity-100">
          <span className="absolute top-0 left-0">RICORDI</span>
          <span className="absolute top-0 right-0">DALLA</span>
          <span className="absolute bottom-0 left-0">SCORSA</span>
          <span className="absolute bottom-0 right-0">EDIZIONE</span>
        </div>
      </div>

      <div className="relative select-none pointer-events-none flex items-center justify-center w-full h-full px-4 overflow-hidden">
        <h2 
          className="hidden md:flex whitespace-nowrap justify-center font-display font-medium text-[#262626]"
          style={{ 
            fontSize: 'min(30vw, 22rem)', 
            lineHeight: '0.9', 
            letterSpacing: '-0.04em' 
          }}
        >
          <span className="relative z-[15]">L</span>
          <span className="relative z-[5]">i</span>
          <span className="relative z-[15]">f</span>
          <span className="relative z-[5]">e</span>
          <span className="mx-[0.03em]"></span>
          <span className="relative z-[15]">2</span>
          <span className="relative z-[5]">5</span>
        </h2>

        <h2 
          className="flex md:hidden flex-col items-center justify-center font-display font-medium uppercase text-[#262626] text-[28vw]"
          style={{ lineHeight: '0.85', letterSpacing: '-0.04em' }}
        >
          <div className="flex flex-col items-center">
            <div className="flex">
              <span className="relative z-[15] w-[0.55em] text-center">L</span>
              <span className="relative z-[5] w-[0.55em] text-center">I</span>
            </div>
            <div className="flex -mt-[0.05em]">
              <span className="relative z-[15] w-[0.55em] text-center">F</span>
              <span className="relative z-[5] w-[0.55em] text-center">E</span>
            </div>
            <div className="flex -mt-[0.05em]">
              <span className="relative z-[15] w-[0.55em] text-center">2</span>
              <span className="relative z-[5] w-[0.55em] text-center">5</span>
            </div>
          </div>
        </h2>
      </div>
    </section>
  );
};

export default Life25;
