import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
  speakerId?: number; // Nuovo: ancora il tratto a uno speaker specifico
};

type PaintMode = 'draw' | 'nav';

interface PaintContextType {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  mode: PaintMode;
  setMode: (mode: PaintMode) => void;
  color: string;
  setColor: (color: string) => void;
  strokes: Stroke[];
  setStrokes: (strokes: Stroke[]) => void;
  clearStrokes: () => void;
  undo: () => void;
  activeSpeakerId: number | null;
  setActiveSpeakerId: (id: number | null) => void;
}

const PaintContext = createContext<PaintContextType | undefined>(undefined);

export const PaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<PaintMode>('nav');
  const [color, setColor] = useState('#0070f3');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<number | null>(null);

  const clearStrokes = () => {
    // Pulisce solo i tratti del contesto attuale
    setStrokes(prev => prev.filter(s => s.speakerId !== (activeSpeakerId || undefined)));
  };

  const undo = () => {
    // Trova l'ultimo tratto del contesto attuale e lo rimuove
    setStrokes(prev => {
      const lastIdx = [...prev].reverse().findIndex(s => s.speakerId === (activeSpeakerId || undefined));
      if (lastIdx === -1) return prev;
      const newStrokes = [...prev];
      newStrokes.splice(prev.length - 1 - lastIdx, 1);
      return newStrokes;
    });
  };

  return (
    <PaintContext.Provider
      value={{
        isActive,
        setIsActive,
        mode,
        setMode,
        color,
        setColor,
        strokes,
        setStrokes,
        clearStrokes,
        undo,
        activeSpeakerId,
        setActiveSpeakerId,
      }}
    >
      {children}
    </PaintContext.Provider>
  );
};

export const usePaint = () => {
  const context = useContext(PaintContext);
  if (!context) throw new Error('usePaint must be used within a PaintProvider');
  return context;
};
