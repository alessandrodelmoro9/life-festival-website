import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Countdown from '@/components/Countdown';
import SpeakersSection from '@/components/SpeakersSection';
import ProgramSection from '@/components/ProgramSection';
import LocationSection from '@/components/LocationSection';
import TicketsSection from '@/components/TicketsSection';
import SponsorSection from '@/components/SponsorSection';
import FooterSection from '@/components/FooterSection';
import { PaintProvider } from '@/context/PaintContext';
import PaintCanvas from '@/components/paint/PaintCanvas';
import PaintToolbar from '@/components/paint/PaintToolbar';
import CustomCursor from '@/components/ui/CustomCursor';
import bgSite from '@/assets/bg-site.svg';

const Index = () => {
  useLenis();

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
            <Countdown />
          </div>
        </div>

        <SpeakersSection />
        <ProgramSection />
        <LocationSection />
        <TicketsSection />
        <SponsorSection />
        <FooterSection />
        <PaintCanvas />
        <PaintToolbar />
      </main>
    </PaintProvider>
  );
};

export default Index;
