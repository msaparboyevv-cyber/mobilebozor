import React from 'react';
import { Smartphone, Phone, Check } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#090b10] py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
            <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-white text-sm">
            Mobile<span className="text-amber-400">Bozor</span>
          </span>
          <span className="text-slate-600">·</span>
          <span>© 2026</span>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              title="Admin"
              aria-label="Admin"
              className="text-slate-600 hover:text-emerald-400 transition-colors cursor-pointer ml-1 p-0.5 focus:outline-none"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-slate-300">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>+998 71 200 00 00</span>
        </div>
      </div>
    </footer>
  );
};
