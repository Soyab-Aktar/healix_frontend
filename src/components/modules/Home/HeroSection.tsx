import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center overflow-hidden pt-16">
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <Badge className="mb-6 bg-blue-500/15 text-blue-300 border-blue-500/25 hover:bg-blue-500/20 text-xs font-medium px-3 py-1">
              🩺 Trusted by 50,000+ patients across India
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Healthcare that
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                comes to you
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
              Connect with verified, experienced doctors from the comfort of your home.
              Same-day appointments, prescriptions, and follow-ups — all in one place.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {[
                { icon: Shield, text: 'Verified Doctors' },
                { icon: Clock, text: '24/7 Available' },
                { icon: Star, text: '4.8 Avg Rating' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Icon className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/consultation">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 h-12 text-base group"
                >
                  Find a Doctor
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 text-base bg-transparent"
                >
                  How it works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Visual card stack */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Background card 2 */}
            <div className="absolute -left-2 top-4 w-64 h-80 bg-white/5 rounded-2xl border border-white/10 rotate-[-6deg]" />
            {/* Background card 1 */}
            <div className="absolute left-4 top-2 w-64 h-80 bg-white/8 rounded-2xl border border-white/10 rotate-[-3deg]" />

            {/* Main card */}
            <div className="relative w-72 sm:w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Card header */}
              <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-700" />
              <div className="px-5 pb-5 -mt-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center mb-3 text-blue-600 font-bold text-2xl shadow">
                  Dr
                </div>
                <div className="mb-1 font-bold text-slate-900">Dr. Ananya Sharma</div>
                <div className="text-xs text-slate-500 mb-3">Cardiologist · Apollo Hospital</div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs text-slate-500 ml-1">4.9 (128 reviews)</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">Cardiology</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">ECG</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Consultation fee</p>
                    <p className="font-bold text-slate-900 text-lg">₹800</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating badge: next available */}
            <div className="absolute -bottom-3 right-4 sm:right-0 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Next Available</p>
                <p className="text-xs text-slate-500">Today, 3:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}