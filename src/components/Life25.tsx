import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CONFIG = {
  mouseThreshold: 45,
  imageLifespan: 1200,
  inDuration: 0.4,
  outDuration: 0.8,
  baseRotation: 15,
  maxRotationFactor: 2.0,
  minImageSize: 140,
  maxImageSize: 280,
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

interface PooledImage {
  element: HTMLDivElement;
  imgElement: HTMLImageElement;
  inUse: boolean;
  removeTime: number;
}

const Life25 = () => {
  const containerRef = useRef<HTMLElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());
  const smoothedSpeed = useRef(0);
  const maxSpeed = useRef(0.5);
  const imageIndex = useRef(0);
  
  // Object Pool for Zero-Lag Rendering
  const imagePool = useRef<PooledImage[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize the pool
    const initializePool = () => {
      for (let i = 0; i < CONFIG.maxActiveImages; i++) {
        const div = document.createElement('div');
        div.className = 'absolute pointer-events-none overflow-hidden opacity-0 will-change-transform';
        div.style.zIndex = '10';
        div.style.transform = 'translate(-50%, -50%) scale(0)';
        
        const img = document.createElement('img');
        img.className = 'w-full h-full object-cover';
        img.style.display = 'block';
        div.appendChild(img);
        
        container.appendChild(div);
        
        imagePool.current.push({
          element: div,
          imgElement: img,
          inUse: false,
          removeTime: 0
        });
      }
    };

    initializePool();

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

      const triggerImage = () => {
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

        // Find an available image in the pool
        const pooled = imagePool.current.find(p => !p.inUse);
        if (!pooled) return;

        const speed = calculateSpeed();
        const size = CONFIG.minImageSize + (CONFIG.maxImageSize - CONFIG.minImageSize) * speed;
        const rot = (Math.random() - 0.5) * CONFIG.baseRotation * (1 + speed * (CONFIG.maxRotationFactor - 1));

        const x = mousePos.current.x - rect.left;
        const y = mousePos.current.y - rect.top;

        // Update pooled element
        pooled.inUse = true;
        pooled.removeTime = Date.now() + CONFIG.imageLifespan;
        
        pooled.imgElement.src = IMAGES[imageIndex.current];
        pooled.element.style.width = `${size}px`;
        pooled.element.style.height = `${size}px`;
        pooled.element.style.left = `${x}px`;
        pooled.element.style.top = `${y}px`;
        
        // Reset transform before new animation
        gsap.set(pooled.element, { 
          scale: 0.9, 
          opacity: 0, 
          rotation: rot 
        });

        gsap.to(pooled.element, {
          scale: 1,
          opacity: 1,
          duration: CONFIG.inDuration,
          ease: 'power2.out',
          force3D: true
        });

        imageIndex.current = (imageIndex.current + 1) % IMAGES.length;
        lastMousePos.current = { ...mousePos.current };
      };

      const update = () => {
        const now = Date.now();
        
        // Handle removals
        imagePool.current.forEach(pooled => {
          if (pooled.inUse && now >= pooled.removeTime) {
            // Mark as "removing" by setting removeTime to infinity so it doesn't trigger again
            pooled.removeTime = Infinity; 
            
            gsap.to(pooled.element, {
              opacity: 0,
              scale: 0.1,
              rotation: "-=30",
              duration: CONFIG.outDuration,
              ease: 'power2.in',
              force3D: true,
              onComplete: () => {
                pooled.inUse = false;
                pooled.removeTime = 0;
                gsap.set(pooled.element, { scale: 0, opacity: 0 });
              }
            });
          }
        });

        triggerImage();
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

    return () => {
      ctx.revert();
      // Cleanup DOM
      imagePool.current.forEach(p => p.element.remove());
      imagePool.current = [];
    };
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

      <div className="relative select-none pointer-events-none flex items-center justify-center w-full h-full px-[40px] overflow-hidden box-border">
        {/* Desktop Version */}
        <h2 
          className="hidden md:flex whitespace-nowrap font-display font-medium text-[#262626] w-full"
          style={{ 
            fontSize: 'min(36vw, 30rem)', 
            lineHeight: '0.8', 
            letterSpacing: '-0.05em',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div className="flex">
            <span className="relative z-[15]">L</span>
            <span className="relative z-[5]">i</span>
            <span className="relative z-[15]">f</span>
            <span className="relative z-[5]">e</span>
          </div>
          <div className="flex">
            <span className="relative z-[15]">2</span>
            <span className="relative z-[5]">5</span>
          </div>
        </h2>

        {/* Mobile Version */}
        <h2 
          className="flex md:hidden flex-col items-center justify-center font-display font-medium uppercase text-[#262626] text-[32vw] w-full relative z-[15]"
          style={{ 
            lineHeight: '0.8', 
            letterSpacing: '-0.05em',
          }}
        >
          <div className="flex flex-col items-center">
            <div className="flex">
              <span className="w-[0.55em] text-center">L</span>
              <span className="w-[0.55em] text-center">I</span>
            </div>
            <div className="flex -mt-[0.05em]">
              <span className="w-[0.55em] text-center">F</span>
              <span className="w-[0.55em] text-center">E</span>
            </div>
            <div className="flex -mt-[0.05em]">
              <span className="w-[0.55em] text-center">2</span>
              <span className="w-[0.55em] text-center">5</span>
            </div>
          </div>
        </h2>
      </div>
    </section>
  );
};

export default Life25;
