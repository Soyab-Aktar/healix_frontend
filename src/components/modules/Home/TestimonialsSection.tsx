import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Mehta',
    location: 'Mumbai',
    rating: 5,
    text: 'I had a rash that was worrying me for days. Got a dermatology consultation within 20 minutes. The doctor was thorough and the prescription was in my inbox before the call even ended.',
    specialty: 'Dermatology',
  },
  {
    name: 'Rahul Krishnan',
    location: 'Bangalore',
    rating: 5,
    text: 'As someone with a busy schedule, MediCare has been a game-changer. No more half-day off work just to see a doctor. Booked a slot at 7 AM and was done before my first meeting.',
    specialty: 'General Medicine',
  },
  {
    name: 'Sunita Agarwal',
    location: 'Delhi',
    rating: 5,
    text: 'My elderly mother needed a cardiology follow-up and couldn\'t travel easily. The doctor was patient, professional, and even called back to check on her the next day.',
    specialty: 'Cardiology',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Patient stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Real people, real results
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <Quote className="h-7 w-7 text-blue-200 mb-4 shrink-0" />
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">
                {t.text}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location} · {t.specialty}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}