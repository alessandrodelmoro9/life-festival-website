import React from 'react';
import { usePaint } from '@/context/PaintContext';
import { cn } from '@/lib/utils';
import { MousePointer2, Pencil, Trash2, X, Undo2 } from 'lucide-react';

const COLORS = [
  { name: 'Blue', value: '#0070f3' },
  { name: 'Pink', value: '#F472B6' },
  { name: 'Orange', value: '#E25938' }, // Sincronizzato con brand orange
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Cream', value: '#F5F0E8' },
];

const PaintToolbar: React.FC = () => {
  // Use the correct property names from PaintContext
  const { isActive, setIsActive, mode, setMode, color, setColor, clearStrokes, undo } = usePaint();

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[10002] flex flex-col items-center gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 paint-toolbar-container w-[95%] md:w-auto pointer-events-auto">
      {/* Main Toolbar */}
      <div className="bg-background/95 backdrop-blur-md border border-foreground/10 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl flex items-center justify-between md:justify-start gap-4 md:gap-8 w-full md:w-auto">
        
        {/* Modes */}
        <div className="flex items-center gap-1 md:gap-2 border-r border-foreground/10 pr-4 md:pr-6">
          <button
            onClick={() => setMode('draw')}
            className={cn(
              "p-2 md:p-3 rounded-full transition-all",
              mode === 'draw' ? "bg-primary text-white scale-110" : "hover:bg-muted text-muted-foreground"
            )}
            title="Disegna"
          >
            <Pencil className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
          <button
            onClick={() => setMode('nav')}
            className={cn(
              "p-2 md:p-3 rounded-full transition-all",
              mode === 'nav' ? "bg-primary text-white scale-110" : "hover:bg-muted text-muted-foreground"
            )}
            title="Naviga"
          >
            <MousePointer2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar py-1">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setColor(c.value);
                setMode('draw');
              }}
              className={cn(
                "w-4 h-4 md:w-5 md:h-5 rounded-full border border-foreground/5 flex-shrink-0 transition-transform hover:scale-105",
                color === c.value && "ring-1 ring-primary ring-offset-1 scale-105"
              )}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2 border-l border-foreground/10 pl-4 md:pl-6">
          <button
            onClick={undo}
            className="p-2 md:p-3 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Annulla ultimo"
          >
            <Undo2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
          <button
            onClick={clearStrokes}
            className="p-2 md:p-3 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
            title="Pulisci tutto"
          >
            <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
          <button
            onClick={() => setIsActive(false)}
            className="p-2 md:p-3 rounded-full hover:bg-muted text-foreground transition-colors"
            title="Esci"
          >
            <X className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Info Tag */}
      <div className="bg-foreground text-background text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-body opacity-50 select-none">
        {mode === 'draw' ? 'lascia un tuo segno' : 'naviga nel sito'}
      </div>
    </div>
  );
};

export default PaintToolbar;
