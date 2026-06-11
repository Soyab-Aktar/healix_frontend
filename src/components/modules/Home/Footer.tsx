import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Find Doctors', href: '/consultation' },
    { label: 'Specialties', href: '/consultation' },
    { label: 'Book Appointment', href: '/consultation' },
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'For Doctors', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <HeartPulse className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Medi<span className="text-blue-400">Care</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Quality healthcare, accessible to everyone. Consult verified doctors from wherever you are.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-white text-sm mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Made with ❤️ for better healthcare access in India
          </p>
        </div>
      </div>
    </footer>
  );
}