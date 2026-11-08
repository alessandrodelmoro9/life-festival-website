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

const DESKTOP_TITLE_GROUPS = [
  [
    { char: 'L', z: 'z-[15]' },
    { char: 'i', z: 'z-[5]' },
    { char: 'f', z: 'z-[15]' },
    { char: 'e', z: 'z-[5]' },
  ],
  [
    { char: '2', z: 'z-[15]' },
    { char: '5', z: 'z-[5]' },
  ],
];

const MOBILE_TITLE_PAIRS = [
  ['L', 'I'],
  ['F', 'E'],
  ['2', '5'],
];

const Life25 = () => {
  const containerRef = useRef<HTMLElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());
  const smoothedSpeed = useRef(0);
  const maxSpeed = useRef(0.5);
  const imageIndex = useRef(0);
  const imagePool = useRef<PooledImage[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      
      imagePool.current.push({ element: div, imgElement: img, inUse: false, removeTime: 0 });
    }

    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        mousePos.current = { x: clientX, y: clientY };
      };

      const getMovement = () => {
        const dx = mousePos.current.x - lastMousePos.current.x;
        const dy = mousePos.current.y - lastMousePos.current.y;
        return { dx, dy, dist: Math.hypot(dx, dy) };
      };

      const calculateSpeed = (dist: number) => {
        const now = Date.now();
        const dt = now - lastMoveTime.current;
        if (dt <= 0) return smoothedSpeed.current;

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

        const { dist } = getMovement();
        if (dist < CONFIG.mouseThreshold) return;

        const pooled = imagePool.current.find(p => !p.inUse);
        if (!pooled) return;

        const speed = calculateSpeed(dist);
        const size = CONFIG.minImageSize + (CONFIG.maxImageSize - CONFIG.minImageSize) * speed;
        const rot = (Math.random() - 0.5) * CONFIG.baseRotation * (1 + speed * (CONFIG.maxRotationFactor - 1));

        pooled.inUse = true;
        pooled.removeTime = Date.now() + CONFIG.imageLifespan;
        pooled.imgElement.src = IMAGES[imageIndex.current];
        pooled.element.style.width = `${size}px`;
        pooled.element.style.height = `${size}px`;
        pooled.element.style.left = `${mousePos.current.x - rect.left}px`;
        pooled.element.style.top = `${mousePos.current.y - rect.top}px`;
        
        gsap.set(pooled.element, { scale: 0.9, opacity: 0, rotation: rot });
        gsap.to(pooled.element, { scale: 1, opacity: 1, duration: CONFIG.inDuration, ease: 'power2.out', force3D: true });

        imageIndex.current = (imageIndex.current + 1) % IMAGES.length;
        lastMousePos.current = { ...mousePos.current };
      };

      const update = () => {
        const now = Date.now();
        imagePool.current.forEach(pooled => {
          if (pooled.inUse && now >= pooled.removeTime) {
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
      <div className="relative w-full h-full max-w-[1440px] max-h-[611px] mx-auto flex items-center justify-center">
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
            {DESKTOP_TITLE_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="flex">
                {group.map(({ char, z }) => (
                  <span key={char} className={`relative ${z}`}>{char}</span>
                ))}
              </div>
            ))}
          </h2>

          {/* Mobile Version */}
          <h2 
            className="flex md:hidden flex-col items-center justify-center font-display font-medium uppercase text-[#262626] text-[32vw] w-full relative z-[15]"
            style={{ lineHeight: '0.8', letterSpacing: '-0.05em' }}
          >
            <div className="flex flex-col items-center">
              {MOBILE_TITLE_PAIRS.map((pair, pIdx) => (
                <div key={pIdx} className={pIdx > 0 ? "flex -mt-[0.05em]" : "flex"}>
                  {pair.map(char => (
                    <span key={char} className="w-[0.55em] text-center">{char}</span>
                  ))}
                </div>
              ))}
            </div>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Life25;
