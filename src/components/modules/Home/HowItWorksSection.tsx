import { Search, CalendarCheck, Video, FileText } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Find your doctor',
    description: 'Search by specialty, symptoms, or doctor name. Filter by experience, rating, and fees.',
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Book a slot',
    description: 'Pick a time that works for you — today, tomorrow, or any day this week.',
  },
  {
    step: '03',
    icon: Video,
    title: 'Consult online',
    description: 'Meet your doctor via secure video call from anywhere — phone, tablet, or laptop.',
  },
  {
    step: '04',
    icon: FileText,
    title: 'Get your prescription',
    description: 'Receive a digital prescription and follow-up notes directly in your account.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            From search to prescription<br />in under an hour
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            No waiting rooms. No paperwork. Just quality healthcare, on your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-8px)] w-[calc(100%-40px+16px)] h-px bg-blue-100 z-0" />
                )}

                <div className="relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-100 select-none">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}