import Link from 'next/link';

const specialties = [
  { name: 'Cardiology', emoji: '❤️', desc: 'Heart & blood vessels' },
  { name: 'Dermatology', emoji: '🧴', desc: 'Skin, hair & nails' },
  { name: 'Pediatrics', emoji: '👶', desc: 'Children\'s health' },
  { name: 'Orthopedics', emoji: '🦴', desc: 'Bones & joints' },
  { name: 'Neurology', emoji: '🧠', desc: 'Brain & nervous system' },
  { name: 'Gynecology', emoji: '🌸', desc: 'Women\'s health' },
  { name: 'Psychiatry', emoji: '💬', desc: 'Mental health' },
  { name: 'General Medicine', emoji: '🩺', desc: 'Primary care' },
];

export default function SpecialtiesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">30+ specialties</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Whatever you need, we have a specialist
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {specialties.map((s) => (
            <Link key={s.name} href={`/consultation?specialty=${encodeURIComponent(s.name)}`}>
              <div className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center h-full flex flex-col items-center justify-center gap-2">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200 inline-block">
                  {s.emoji}
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{s.name}</p>
                <p className="text-xs text-slate-400 hidden sm:block leading-tight">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}