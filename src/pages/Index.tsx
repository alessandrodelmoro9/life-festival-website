import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Countdown from '@/components/Countdown';
import SpeakersSection from '@/components/SpeakersSection';
import ProgramSection from '@/components/ProgramSection';
import LocationSection from '@/components/LocationSection';
import SponsorSection from '@/components/SponsorSection';
import FooterSection from '@/components/FooterSection';
import { PaintProvider } from '@/context/PaintContext';
import PaintCanvas from '@/components/paint/PaintCanvas';
import PaintToolbar from '@/components/paint/PaintToolbar';
import CustomCursor from '@/components/ui/CustomCursor';

const Index = () => {
  useLenis();

  return (
    <PaintProvider>
      <CustomCursor />
      <main className="bg-background">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <Countdown />
        <SpeakersSection />
        <ProgramSection />
        <LocationSection />
        <SponsorSection />
        <FooterSection />
        <PaintCanvas />
        <PaintToolbar />
      </main>
    </PaintProvider>
  );
};

export default Index;
