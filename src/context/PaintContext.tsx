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
  speakerId?: number;
  isModal?: boolean; // Nuovo: indica se il tratto è relativo al viewport (modale)
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
  const [mode, setMode] = useState<PaintMode>('draw');
  const [color, setColor] = useState('#7678F6');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<number | null>(null);

  const clearStrokes = () => {
    // Pulisce TUTTI i tratti (globale + modali)
    setStrokes([]);
  };

  const undo = () => {
    // Rimuove l'ultimo tratto in ordine temporale, ovunque sia stato fatto
    setStrokes(prev => prev.slice(0, -1));
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
