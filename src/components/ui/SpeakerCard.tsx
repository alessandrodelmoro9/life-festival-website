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
        "group relative bg-background border border-foreground/10 p-5 md:p-12 cursor-pointer hover:border-primary transition-colors duration-500 w-[320px] md:w-[600px] h-[170px] md:h-[340px] flex flex-col justify-between flex-shrink-0 mx-3 md:mx-10",
        className
      )}
    >
      {/* Index (Large background number) */}
      <span className="font-display font-bold text-5xl md:text-9xl text-foreground/5 absolute top-2 md:top-8 right-4 md:right-10 select-none">
        {String(speaker.id).padStart(2, '0')}
      </span>

      <div className="relative z-10">
        {/* Colored square indicator */}
        <div 
          className={cn(
            "w-3 h-3 md:w-5 md:h-5 mb-2 md:mb-6",
            speaker.color === 'primary' ? 'bg-primary' : 
            speaker.color === 'secondary' ? 'bg-secondary' : 'bg-accent'
          )} 
        />

        <h3 className="font-display font-bold text-base md:text-4xl text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 max-w-[80%] uppercase tracking-tight">
          {speaker.name}
        </h3>
        
        <p className="font-body text-[8px] md:text-sm uppercase tracking-[0.25em] text-muted-foreground mt-0 md:mt-2 line-clamp-1">
          {speaker.role}
        </p>
      </div>
      
      <div className="relative z-10">
        <p className="font-body text-[10px] md:text-base text-foreground/70 leading-relaxed line-clamp-2 md:line-clamp-3 max-w-[90%]">
          {speaker.description}
        </p>
      </div>

      {/* Arrow Indicator */}
      <div className="absolute bottom-3 md:bottom-10 right-3 md:right-10 w-7 h-7 md:w-12 md:h-12 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 md:translate-y-0 shadow-lg">
        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 md:w-5 md:h-5">
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
  );
};

export default SpeakerCard;
