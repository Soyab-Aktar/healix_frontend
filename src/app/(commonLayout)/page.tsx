import HeroSection from "@/components/modules/Home/HeroSection";
import SpecialtiesSection from "@/components/modules/Home/SpecialtiesSection";
import PlatformBenefits from "@/components/modules/Home/PlatformBenefits";
import HowItWorksSection from "@/components/modules/Home/HowItWorksSection";
import FeaturedDoctors from "@/components/modules/Home/FeaturedDoctors";
import TestimonialsSection from "@/components/modules/Home/TestimonialsSection";
import FaqSection from "@/components/modules/Home/FaqSection";
import CTASection from "@/components/modules/Home/CTASection";
import Footer from "@/components/modules/Home/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Specialty Grid */}
      <SpecialtiesSection />

      {/* Platform Core Benefits */}
      <PlatformBenefits />

      {/* Dynamic Walkthrough Stepper */}
      <HowItWorksSection />

      {/* Featured Clinical Roster */}
      <FeaturedDoctors />

      {/* Trust & Testimonial Panels */}
      <TestimonialsSection />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Final Conversion Panel */}
      <CTASection />

      {/* Rebranded Footer */}
      <Footer />
    </main>
  );
}