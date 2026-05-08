import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight } from 'lucide-react';
import utentiIcon from '@/assets/utenti.svg';

const SocialProofWidget = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [count, setCount] = useState(() => Math.floor(Math.random() * (47 - 5 + 1)) + 5);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateCount = () => {
      setCount((prevCount) => {
        const variation = Math.floor(Math.random() * 3) + 1;
        const isIncrement = Math.random() > 0.5;
        let nextCount = isIncrement ? prevCount + variation : prevCount - variation;

        if (nextCount < 5) nextCount = 5 + (Math.floor(Math.random() * 3) + 1);
        if (nextCount > 47) nextCount = 47 - (Math.floor(Math.random() * 3) + 1);

        return nextCount;
      });
      
      const nextInterval = (Math.floor(Math.random() * (12 - 7 + 1)) + 7) * 1000;
      timeoutId = setTimeout(updateCount, nextInterval);
    };

    timeoutId = setTimeout(updateCount, (Math.floor(Math.random() * (12 - 7 + 1)) + 7) * 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!isVisible) return null;

  const handleRedirect = () => {
    window.open('https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213?discount=PROMO-WEBSITE', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] w-[400px] bg-[#F4EEE4] rounded-[24px] shadow-2xl border border-black/5 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1.5 text-[#262626]/30 hover:text-[#262626] hover:bg-black/5 rounded-full transition-all z-10"
        aria-label="Chiudi"
      >
        <X size={14} strokeWidth={3} />
      </button>

      <div className="p-7 flex gap-7 items-start">
        {/* Larger Avatar Stack + Elegant Live Badge */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-20 h-auto flex items-center justify-center opacity-90">
            <img src={utentiIcon} alt="Users" className="w-full h-auto object-contain" />
          </div>
          <div className="bg-white/80 rounded-full px-2 py-0.5 shadow-sm border border-black/[0.03] flex items-center gap-1.5">
            <div className="w-1 h-1 bg-[#4ade80] rounded-full animate-pulse" />
            <span className="text-[9px] font-medium text-[#262626]/80 whitespace-nowrap">
              {count} utenti online
            </span>
          </div>
        </div>

        {/* Text content - Welcoming */}
        <div className="flex flex-col pt-1.5">
          <h4 className="font-display font-bold text-[#262626] text-[20px] leading-[1] mb-2.5">
            Un regalo per te!
          </h4>
          <p className="font-body text-[13px] text-[#262626]/70 leading-[1.5]">
            Per festeggiare il nostro nuovo sito abbiamo uno <span className="font-bold text-[#262626]">sconto speciale del 30%</span> sui nostri ticket
          </p>
        </div>
      </div>

      <div className="px-7 pb-6">
        <button 
          onClick={handleRedirect}
          className="w-full bg-[#7678F6] text-[#262626] font-body font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all shadow-md group"
        >
          <ArrowDownRight size={16} strokeWidth={3} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          <span className="text-[10px] tracking-[0.1em] uppercase">ACCEDI ALLO SCONTO</span>
        </button>
      </div>
    </div>
  );
};

export default SocialProofWidget;
