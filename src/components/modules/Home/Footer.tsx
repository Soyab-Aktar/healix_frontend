"use client";

import Link from "next/link";
import { ShieldCheck, Heart, Lock, Globe } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Consultation", href: "/consultation" },
    { label: "Find Specialists", href: "/consultation" },
    { label: "Patient Dashboard", href: "/dashboard" },
  ],
  Security: [
    { label: "HIPAA Compliance", href: "#" },
    { label: "Data Encryption", href: "#" },
    { label: "Trust Center", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-900/60 shadow-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <span className="text-lg tracking-tight font-extrabold text-white">
                Healix
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Quality healthcare, securely re-imagined for modern lives. Consult board-certified medical specialists from wherever you are.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-semibold">
              <Lock className="h-3 w-3 text-emerald-400" /> ISO 27001 & HIPAA Secured
            </div>
          </div>

          {/* Links Cols */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Footer Bottom info */}
        <div className="border-t border-slate-900 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} Healix Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>for clinical-grade telehealth.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}