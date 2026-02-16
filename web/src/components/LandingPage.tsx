import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { PersonaEvolutionSection } from './sections/PersonaEvolutionSection';
import { InstallSection } from './sections/InstallSection';
import { ScreenshotsSection } from './sections/ScreenshotsSection';
import { WhyOpenSourceSection } from './sections/WhyOpenSourceSection';
import { BuiltBySection } from './sections/BuiltBySection';
import { CTASection } from './sections/CTASection';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lipilot-dark via-gray-900 to-lipilot-dark">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PersonaEvolutionSection />
      <InstallSection />
      <ScreenshotsSection />
      <WhyOpenSourceSection />
      <BuiltBySection />
      <CTASection />
      <Footer />
    </div>
  );
}
