import React from 'react';
import { Phone, Check } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenSell?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenSell }) => (
  <footer className="border-t border-white/[0.08] bg-[#090b10] px-4 py-8 sm:px-8 sm:py-10">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">© 2026</span>
          {onOpenAdmin && <button type="button" onClick={onOpenAdmin} title="Admin" aria-label="Admin" className="ml-1 inline-flex min-h-11 min-w-11 items-center justify-center text-slate-600 transition-colors hover:text-emerald-400"><Check className="h-3.5 w-3.5" /></button>}
        </div>
        <p className="max-w-xs text-xs leading-5">Telefon topish va sotish uchun e’lonlar maydoni.</p>
      </div>

      <nav aria-label="Foydali havolalar" className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Foydali havolalar</h2>
        <a href="/#catalog-section" className="flex min-h-11 w-fit items-center py-2 hover:text-amber-300">Telefonlar katalogi</a>
        {onOpenSell && <button type="button" onClick={onOpenSell} className="flex min-h-11 items-center py-2 text-left hover:text-amber-300">E’lon joylashtirish</button>}
      </nav>

      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Aloqa</h2>
        <a href="tel:+998712000000" className="flex min-h-11 w-fit items-center gap-2 py-2 font-mono text-slate-300 hover:text-amber-300"><Phone className="h-4 w-4 text-amber-400" />+998 71 200 00 00</a>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Huquqiy ma’lumot</h2>
        <p className="text-xs leading-5">Foydalanish shartlari va maxfiylik hujjatlari hozircha qo‘shilmagan.</p>
      </div>
    </div>
  </footer>
);
