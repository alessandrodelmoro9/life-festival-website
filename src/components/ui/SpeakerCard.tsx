import { Speaker } from "@/data/speakersData";
import { cn } from "@/lib/utils";

interface SpeakerCardProps {
  speaker: Speaker;
  className?: string;
}

const SpeakerCard = ({ speaker, className }: SpeakerCardProps) => {
  return (
    <div
      className={cn(
        "group relative bg-background border border-foreground/10 p-6 md:p-10 cursor-pointer hover:border-primary transition-all duration-500 w-[320px] md:w-[650px] h-[180px] md:h-[360px] flex flex-row gap-4 md:gap-8 flex-shrink-0 mx-3 md:mx-10 overflow-hidden",
        className
      )}
    >
      {/* LEFT COLUMN: Text Content */}
      <div className="flex flex-col justify-between h-full w-[65%] md:w-[60%] relative z-10">
        <div>
          {/* Colored square indicator */}
          <div 
            className={cn(
              "w-2 h-2 md:w-4 md:h-4 mb-3 md:mb-6",
              speaker.color === 'primary' ? 'bg-primary' : 
              speaker.color === 'secondary' ? 'bg-secondary' : 'bg-accent'
            )} 
          />

          <h3 className="font-display font-bold text-base md:text-[2.2rem] leading-[1.1] text-foreground group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">
            {speaker.name}
          </h3>
          
          <p className="font-body text-[8px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1 md:mt-3">
            {speaker.role}
          </p>
        </div>
        
        <div className="mt-auto">
          <p className="font-body text-[10px] md:text-base text-foreground/70 leading-relaxed">
            {speaker.description}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Image & Arrow */}
      <div className="flex flex-col items-end justify-start w-[35%] md:w-[40%] h-full relative">
        {/* Speaker Image (Passport style) */}
        {speaker.image ? (
          <div className="w-full aspect-square md:w-40 md:h-40 overflow-hidden border border-foreground/5 group-hover:border-primary/30 transition-colors duration-500 shadow-sm bg-muted">
             <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-110 group-hover:scale-100"
            />
          </div>
        ) : (
          <span className="font-display font-bold text-5xl md:text-9xl text-foreground/5 select-none leading-none">
            {String(speaker.id).padStart(2, '0')}
          </span>
        )}

        {/* Arrow Indicator (Bottom Right) */}
        <div className="absolute bottom-0 right-0 w-8 h-8 md:w-14 md:h-14 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg z-20">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-6 md:h-6">
            <path 
              d="M7 7L17 17M17 17V7M17 17H7" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SpeakerCard;
