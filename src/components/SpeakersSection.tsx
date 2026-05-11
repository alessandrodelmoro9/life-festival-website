import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { speakersData, Speaker } from '@/data/speakersData';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, ArrowUpRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePaint } from '@/context/PaintContext';

gsap.registerPlugin(ScrollTrigger);

// HELPER FOR NAME FORMATTING (Exceptions: PUG, EGO55, AUGE)
const formatSpeakerName = (name: string) => {
  const exceptions = ['PUG', 'EGO55', 'AUGE'];
  const upperName = name.toUpperCase();
  if (exceptions.some(ex => upperName.includes(ex))) {
    return upperName;
  }
  return name;
};

const SpeakersSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { setActiveSpeakerId } = usePaint();

  // Initial display: first 5 speakers (Host + next 4)
  const host = speakersData[0];
  const initialOthers = speakersData.slice(1, 5);
  const remainingSpeakers = speakersData.slice(5);

  useEffect(() => {
    document.body.style.overflow = isDialogOpen ? 'hidden' : 'auto';
    setActiveSpeakerId(isDialogOpen && selectedSpeaker ? selectedSpeaker.id : null);
  }, [isDialogOpen, selectedSpeaker, setActiveSpeakerId]);

  const toggleExpand = () => {
    if (isExpanded) {
      // Use scrollIntoView for more reliable scrolling to the top of the section
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Delay collapsing until the scroll is mostly complete to avoid jumping
      setTimeout(() => setIsExpanded(false), 600);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <section 
      id="speakers" 
      ref={sectionRef} 
      className="relative py-24 md:py-48 overflow-hidden bg-background scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="mb-24 md:mb-32 text-left">
          <h2 className="text-h1 text-life-black mb-6 tracking-tighter about-animate">
            Speakers
          </h2>
          <h5 className="text-life-black/80 max-w-[642.86px] leading-snug font-body uppercase tracking-[0px] about-animate">
            I PROTAGONISTI DELLA SCENA CREATIVA NAZIONALE
          </h5>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-24">
            <SpeakerItem 
              key={host.id}
              speaker={host}
              index={0}
              isHost={true}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onClick={() => {
                setSelectedSpeaker(host);
                setIsDialogOpen(true);
              }}
            />
            {initialOthers.map((speaker, index) => (
              <SpeakerItem 
                key={speaker.id}
                speaker={speaker}
                index={index + 1}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onClick={() => {
                  setSelectedSpeaker(speaker);
                  setIsDialogOpen(true);
                }}
              />
            ))}
          </div>

          <AnimatePresence>
            {!isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10"
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-24">
                {remainingSpeakers.map((speaker, index) => (
                  <SpeakerItem 
                    key={speaker.id}
                    speaker={speaker}
                    index={index + 5}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    onClick={() => {
                      setSelectedSpeaker(speaker);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 md:mt-16 flex justify-center relative z-20"
        >
          <button 
            onClick={toggleExpand}
            className="group flex items-center gap-2 text-sm uppercase tracking-normal font-bold border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-all duration-300"
          >
            <span>{isExpanded ? 'Riduci lista' : 'Scopri gli ospiti'}</span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={cn(
                "transform transition-transform duration-300",
                isExpanded ? "rotate-180" : "group-hover:translate-y-1"
              )}
            >
              <path d="M7 13l5 5 5-5M12 18V6" />
            </svg>
          </button>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed inset-0 z-[9999] max-w-none w-screen h-screen m-0 p-0 border-none bg-primary rounded-none translate-x-0 translate-y-0 left-0 top-0 overflow-hidden [&>button]:hidden"
        >
          {selectedSpeaker && (
            <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-12 lg:p-20 gap-8 md:gap-12 lg:gap-20 overflow-hidden">
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-6 right-6 md:top-10 md:right-10 z-[10000] text-foreground/60 hover:text-foreground transition-colors"
              >
                <X size={window.innerWidth < 768 ? 32 : 48} strokeWidth={1.5} />
              </button>

              <div className="w-full md:w-[55%] lg:w-[60%] order-2 md:order-1 flex flex-col justify-center">
                <h2 className="text-foreground font-display font-medium text-4xl md:text-[5vw] lg:text-[5.5vw] leading-[0.9] tracking-tighter mb-4 md:mb-6">
                  {formatSpeakerName(selectedSpeaker.name)}
                </h2>
                <div className="max-w-2xl">
                  <span className="text-foreground/70 font-display font-medium uppercase tracking-[0.2em] text-xs md:text-sm block mb-4 md:mb-6">
                    {selectedSpeaker.role}
                  </span>
                  <p className="text-foreground/90 text-base md:text-lg lg:text-[1.25rem] leading-[1.4] font-body font-light mb-8 md:mb-10 whitespace-pre-wrap">
                    {selectedSpeaker.description}
                  </p>
                  <div className="flex flex-wrap gap-6 md:gap-10">
                    {selectedSpeaker.instagram && (
                      <a 
                        href={selectedSpeaker.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground/40 hover:text-foreground uppercase tracking-widest text-[10px] md:text-xs font-display font-medium border-b border-foreground/20 pb-1 transition-all"
                      >
                        Instagram ↗
                      </a>
                    )}
                    {selectedSpeaker.website && (
                      <a 
                        href={selectedSpeaker.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground/40 hover:text-foreground uppercase tracking-widest text-[10px] md:text-xs font-display font-medium border-b border-foreground/20 pb-1 transition-all"
                      >
                        Website ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-[50vw] md:w-[28vw] lg:w-[24vw] aspect-square order-1 md:order-2 flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-none overflow-hidden border border-foreground/10 bg-background/20 shadow-2xl">
                  {selectedSpeaker.image ? (
                    <img src={selectedSpeaker.image} className="w-full h-full object-cover" alt={selectedSpeaker.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/5 text-6xl md:text-8xl font-black font-display">LIFE</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

const SpeakerItem = ({ 
  speaker, 
  index, 
  isHost = false,
  hoveredId, 
  setHoveredId, 
  onClick 
}: { 
  speaker: Speaker, 
  index: number, 
  isHost?: boolean,
  hoveredId: number | null, 
  setHoveredId: (id: number | null) => void,
  onClick: () => void 
}) => {
  const isHovered = hoveredId === speaker.id;

  return (
    <motion.div 
      onMouseEnter={() => setHoveredId(speaker.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={onClick}
      animate={{ 
        opacity: hoveredId === null || isHovered ? 1 : 0.2,
        backgroundColor: isHovered ? "#FF76BF" : "transparent",
      }}
      transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1.0] }}
      className={cn(
        "group cursor-pointer border-b border-foreground/10 px-6 transition-all duration-300 relative flex flex-col justify-center items-start text-left will-change-[opacity,background-color]",
        isHost ? "md:col-span-2 h-[190px] border-t" : "h-[150px]"
      )}
    >
      <div className="space-y-2 text-left">
        <h3 className={cn(
          "font-display font-medium leading-tight tracking-tighter text-foreground text-left whitespace-nowrap overflow-hidden pb-1",
          "text-[30px] md:text-[60px]" // Standard H3 sizes from index.css
        )}>
          {formatSpeakerName(speaker.name)}
        </h3>
        <h6 className={cn(
          "font-body uppercase transition-colors duration-300 text-left",
          isHovered ? "text-foreground/70" : "text-muted-foreground"
        )}>
          {speaker.role}
        </h6>
      </div>
    </motion.div>
  );
};

export default SpeakersSection;
