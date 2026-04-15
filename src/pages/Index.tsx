import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SpeakersSection from '@/components/SpeakersSection';
import ProgramSection from '@/components/ProgramSection';
import LocationSection from '@/components/LocationSection';
import SponsorSection from '@/components/SponsorSection';
import FooterSection from '@/components/FooterSection';

const Index = () => {
  useLenis();

  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SpeakersSection />
      <ProgramSection />
      <LocationSection />
      <SponsorSection />
      <FooterSection />
    </main>
  );
};

export default Index;
