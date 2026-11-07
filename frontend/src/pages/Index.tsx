import { useLenis } from '@/hooks/useLenis';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import Countdown from '@/components/widgets/Countdown';
import SpeakersSection from '@/components/sections/SpeakersSection';
import ProgramSection from '@/components/sections/ProgramSection';
import LocationSection from '@/components/sections/LocationSection';
import TicketsSection from '@/components/sections/TicketsSection';
import AccommodationSection from '@/components/sections/AccommodationSection';
import Life25 from '@/components/sections/Life25';
import SponsorSection from '@/components/sections/SponsorSection';
import FooterSection from '@/components/sections/FooterSection';
import { PaintProvider } from '@/context/PaintContext';
import PaintCanvas from '@/components/paint/PaintCanvas';
import PaintToolbar from '@/components/paint/PaintToolbar';
import ChatWidget from '@/components/widgets/ChatWidget';
import CustomCursor from '@/components/layout/CustomCursor';
import bgSite from '@/assets/bg-site.svg';

const Index = () => {
  useLenis();
  useImagePreloader();

  return (
    <PaintProvider>
      <CustomCursor />
      <main className="bg-background">
        <Navbar />
        
        {/* TOP WRAPPER WITH BACKGROUND SVG */}
        <div className="relative w-full">
          {/* Background SVG - Covers Hero and About */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-90 md:opacity-100"
            style={{ 
              backgroundImage: `url(${bgSite})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          <div className="relative z-10 w-full">
            <HeroSection />
            <AboutSection />
          </div>
        </div>

        <Countdown />

        <SpeakersSection />
        <ProgramSection />
        <LocationSection />
        <Life25 />
        <TicketsSection />
        <AccommodationSection />
        <SponsorSection />
        <FooterSection />
        <PaintCanvas />
        <PaintToolbar />
        <ChatWidget />
      </main>
    </PaintProvider>
  );
};

export default Index;
