import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          Your health can't wait.
          <br />
          <span className="text-blue-200">Neither should you.</span>
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
          Book a consultation in under 2 minutes. Available today, evenings, and weekends.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/consultation">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 h-12 text-base group"
            >
              Find a Doctor Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 h-12 text-base bg-transparent"
            >
              Create free account
            </Button>
          </Link>
        </div>
        <p className="text-blue-200/70 text-xs mt-6">No credit card required · Free to sign up</p>
      </div>
    </section>
  );
}