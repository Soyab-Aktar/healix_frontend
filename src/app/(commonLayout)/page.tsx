import Navbar from '@/components/modules/Home/Navbar';
import HeroSection from '@/components/modules/Home/HeroSection';
import HowItWorksSection from '@/components/modules/Home/HowItWorksSection';
import FeaturedDoctors from '@/components/modules/Home/FeaturedDoctors';
import SpecialtiesSection from '@/components/modules/Home/SpecialtiesSection';
import TestimonialsSection from '@/components/modules/Home/TestimonialsSection';
import CTASection from '@/components/modules/Home/CTASection';
import Footer from '@/components/modules/Home/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {/* <StatsSection /> */}
        <HowItWorksSection />
        <FeaturedDoctors />
        <SpecialtiesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}