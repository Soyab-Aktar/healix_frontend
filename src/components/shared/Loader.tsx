"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  fullScreen?: boolean;
  message?: string;
}

export default function Loader({ className, fullScreen = false, message = "Please wait..." }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 bg-transparent transition-all duration-300",
        fullScreen ? "fixed inset-0 z-50 h-screen w-screen bg-slate-50/80 backdrop-blur-xs" : "w-full min-h-[300px] py-12",
        className
      )}
    >
      <style>{`
        .spinner-bars-bar {
          height: 6px;
          animation: spinner-bars 0.8s ease-in-out infinite;
        }
        @keyframes spinner-bars {
          0%, 100% { height: 6px; }
          50% { height: 20px; }
        }
      `}</style>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-end gap-1.5 h-6 text-[#047857]">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-1.5 rounded-sm bg-current spinner-bars-bar"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        {message && (
          <p className="text-[10px] font-extrabold tracking-widest text-[#047857]/80 uppercase animate-pulse select-none">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
