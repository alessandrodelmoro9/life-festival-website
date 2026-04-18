import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePaint, Point, Stroke } from '@/context/PaintContext';
import { cn } from '@/lib/utils';

const PaintCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isActive, mode, color, strokes, setStrokes, activeSpeakerId } = usePaint();
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStroke = useRef<Point[]>([]);

  const getCanvasPoint = useCallback((e: React.PointerEvent | PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  // Rendering dello storico FILTRATO per contesto
  const renderStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // FILTRO: Mostra solo i tratti del contesto attuale
    // Se activeSpeakerId è null -> mostra solo tratti senza speakerId (sito)
    // Se activeSpeakerId è X -> mostra solo tratti con speakerId === X
    const filteredStrokes = strokes.filter(s => 
      activeSpeakerId === null ? !s.speakerId : s.speakerId === activeSpeakerId
    );

    filteredStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, activeSpeakerId]);

  const renderCurrent = useCallback(() => {
    const canvas = tempCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    if (isDrawing && currentStroke.current.length > 1) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.moveTo(currentStroke.current[0].x, currentStroke.current[0].y);
      for (let i = 1; i < currentStroke.current.length; i++) {
        ctx.lineTo(currentStroke.current[i].x, currentStroke.current[i].y);
      }
      ctx.stroke();
    }
  }, [isDrawing, color]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive || mode !== 'draw') return;
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    currentStroke.current = [point];
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const point = getCanvasPoint(e);
    const lastPoint = currentStroke.current[currentStroke.current.length - 1];
    const dist = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    if (dist > 2) {
      currentStroke.current.push(point);
      renderCurrent();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    if (currentStroke.current.length > 1) {
      const newStroke: Stroke = {
        points: currentStroke.current,
        color,
        width: 3,
        timestamp: Date.now(),
        speakerId: activeSpeakerId || undefined // Tagga il tratto con l'ID attuale
      };
      setStrokes([...strokes, newStroke]);
    }
    setIsDrawing(false);
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
          const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
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

    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(document.body);
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [renderStatic]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "absolute top-0 left-0 w-full pointer-events-none",
        // Se c'è uno speaker attivo (modale aperto), il canvas deve stare sopra lo z-9999 del modale
        activeSpeakerId ? "z-[10000]" : "z-[9998]",
        // Se siamo in modalità disegno, abilitiamo i pointer events e il cursore
        isActive && mode === 'draw' && "pointer-events-auto cursor-crosshair z-[10001] touch-none"
      )}
      style={{ 
        height: '100%',
        touchAction: isActive && mode === 'draw' ? 'none' : 'auto'
      }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full" />
      <canvas
        ref={tempCanvasRef}
        className="absolute top-0 left-0 w-full"
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
