import { useEffect, useRef, useState, useCallback } from 'react';
import { usePaint, Point, Stroke } from '@/context/PaintContext';
import { cn } from '@/lib/utils';

const clearCanvasContext = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  return { ctx, dpr };
};

const PaintCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isActive, mode, color, strokes, setStrokes, activeSpeakerId } = usePaint();
  const [, setIsDrawingState] = useState(false);
  const isDrawingRef = useRef(false);
  const currentStroke = useRef<Point[]>([]);
  const requestRef = useRef<number>();

  const cancelFrame = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  };

  const getCanvasPoint = useCallback((e: React.PointerEvent | PointerEvent): Point => {
    if (activeSpeakerId !== null) {
      return { x: e.clientX, y: e.clientY };
    }
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
    const res = clearCanvasContext(canvasRef.current);
    if (!res) return;

    const filteredStrokes = strokes.filter(s => 
      activeSpeakerId === null ? s.speakerId === undefined : s.speakerId === activeSpeakerId
    );

    const viewHeight = window.innerHeight;
    const currentScrollY = window.scrollY;

    filteredStrokes.forEach(stroke => {
      const isVisible = stroke.isModal || stroke.points.some(p => 
        p.y > currentScrollY - 200 && p.y < currentScrollY + viewHeight + 200
      );
      if (isVisible) {
        drawSmoothedLine(res.ctx, stroke.points, stroke.color, stroke.width, currentScrollY, stroke.isModal);
      }
    });
  }, [strokes, activeSpeakerId]);

  const draw = useCallback(() => {
    if (!isDrawingRef.current) return;
    const res = clearCanvasContext(tempCanvasRef.current);
    if (!res) return;
    
    if (currentStroke.current.length >= 2) {
      drawSmoothedLine(res.ctx, currentStroke.current, color, 3, window.scrollY, activeSpeakerId !== null);
    }
    
    requestRef.current = requestAnimationFrame(draw);
  }, [color, activeSpeakerId]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive || mode !== 'draw' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    
    isDrawingRef.current = true;
    setIsDrawingState(true);
    currentStroke.current = [getCanvasPoint(e)];
    
    cancelFrame();
    requestRef.current = requestAnimationFrame(draw);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    currentStroke.current.push(getCanvasPoint(e));
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    
    isDrawingRef.current = false;
    setIsDrawingState(false);
    cancelFrame();
    
    if (currentStroke.current.length > 1) {
      setStrokes([...strokes, {
        points: [...currentStroke.current],
        color,
        width: 3,
        timestamp: Date.now(),
        speakerId: activeSpeakerId ?? undefined,
        isModal: activeSpeakerId !== null
      }]);
    }
    
    currentStroke.current = [];
    clearCanvasContext(tempCanvasRef.current);
  };

  useEffect(() => {
    renderStatic();
    window.addEventListener('scroll', renderStatic, { passive: true });
    return () => window.removeEventListener('scroll', renderStatic);
  }, [renderStatic]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      [canvasRef.current, tempCanvasRef.current].forEach(canvas => {
        if (canvas) {
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
      cancelFrame();
    };
  }, [renderStatic]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "fixed top-0 left-0 w-full h-screen", 
        activeSpeakerId !== null ? "z-[10000]" : (isActive ? "z-[9998]" : "z-[1]"),
        isActive && mode === 'draw' ? "cursor-crosshair touch-none" : "pointer-events-none"
      )}
      style={{ 
        pointerEvents: isActive && mode === 'draw' ? 'auto' : 'none',
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
