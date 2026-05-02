import { useEffect, useRef, useState, useCallback } from 'react';
import { usePaint, Point, Stroke } from '@/context/PaintContext';
import { cn } from '@/lib/utils';

const PaintCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isActive, mode, color, strokes, setStrokes, activeSpeakerId } = usePaint();
  const [isDrawingState, setIsDrawingState] = useState(false);
  const isDrawingRef = useRef(false);
  const currentStroke = useRef<Point[]>([]);
  const requestRef = useRef<number>();
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  // Monitoriamo lo scroll per ridisegnare i tratti nella posizione corretta
  useEffect(() => {
    const handleScroll = () => {
      setScrollPos({ x: window.scrollX, y: window.scrollY });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCanvasPoint = useCallback((e: React.PointerEvent | PointerEvent): Point => {
    // Se siamo in un modale, salviamo le coordinate relative al viewport
    if (activeSpeakerId !== null) {
      return { x: e.clientX, y: e.clientY };
    }
    // Altrimenti coordinate assolute (documento)
    return {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY
    };
  }, [activeSpeakerId]);

  const drawSmoothedLine = (ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number, scrollY: number, isModal?: boolean) => {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Se è un tratto modale, non sottraiamo lo scroll perché è già in coordinate viewport
    const offset = isModal ? 0 : scrollY;
    const firstPoint = { x: points[0].x, y: points[0].y - offset };
    ctx.moveTo(firstPoint.x, firstPoint.y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y - offset);
    } else {
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2 - offset;
        ctx.quadraticCurveTo(points[i].x, points[i].y - offset, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y - offset);
    }
    ctx.stroke();
  };

  const renderStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const filteredStrokes = strokes.filter(s => 
      activeSpeakerId === null ? s.speakerId === undefined : s.speakerId === activeSpeakerId
    );

    const viewHeight = window.innerHeight;
    const currentScrollY = window.scrollY;

    filteredStrokes.forEach(stroke => {
      // Per i tratti modali la visibilità è sempre vera se il modale è aperto
      const isVisible = stroke.isModal || stroke.points.some(p => 
        p.y > currentScrollY - 200 && p.y < currentScrollY + viewHeight + 200
      );
      if (isVisible) {
        drawSmoothedLine(ctx, stroke.points, stroke.color, stroke.width, currentScrollY, stroke.isModal);
      }
    });
  }, [strokes, activeSpeakerId, scrollPos]);

  const draw = useCallback(() => {
    if (!isDrawingRef.current) return;

    const canvas = tempCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    if (currentStroke.current.length >= 2) {
      drawSmoothedLine(ctx, currentStroke.current, color, 3, window.scrollY, activeSpeakerId !== null);
    }
    
    requestRef.current = requestAnimationFrame(draw);
  }, [color, activeSpeakerId]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive || mode !== 'draw' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    
    isDrawingRef.current = true;
    setIsDrawingState(true);
    
    const point = getCanvasPoint(e);
    currentStroke.current = [point];
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(draw);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    const point = getCanvasPoint(e);
    currentStroke.current.push(point);
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    
    isDrawingRef.current = false;
    setIsDrawingState(false);
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    if (currentStroke.current.length > 1) {
      const newStroke: Stroke = {
        points: [...currentStroke.current],
        color,
        width: 3,
        timestamp: Date.now(),
        speakerId: activeSpeakerId ?? undefined,
        isModal: activeSpeakerId !== null
      };
      setStrokes([...strokes, newStroke]);
    }
    
    currentStroke.current = [];
    const tempCanvas = tempCanvasRef.current;
    if (tempCanvas) {
      const ctx = tempCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      ctx?.clearRect(0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    }
  };

  useEffect(() => {
    renderStatic();
  }, [renderStatic]);

  useEffect(() => {
    const updateCanvasSize = () => {
      [canvasRef.current, tempCanvasRef.current].forEach(canvas => {
        if (canvas) {
          const dpr = window.devicePixelRatio || 1;
          const width = window.innerWidth;
          const height = window.innerHeight; // Solo l'altezza del viewport!
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
          }
        }
      });
      renderStatic();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [renderStatic]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "fixed top-0 left-0 w-full h-screen pointer-events-none", // Fixed e h-screen!
        activeSpeakerId !== null ? "z-[10000]" : "z-[9998]",
        isActive && mode === 'draw' && "pointer-events-auto cursor-crosshair z-[10001] touch-none"
      )}
      style={{ 
        touchAction: isActive && mode === 'draw' ? 'none' : 'auto'
      }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <canvas
        ref={tempCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
};

export default PaintCanvas;
