import React from 'react';
import { Heart, X } from 'lucide-react';
import { PhoneListing } from '../types';
import { PhoneCard } from './PhoneCard';

interface WishlistDrawerProps {
  isOpen: boolean;
  phones: PhoneListing[];
  currency: 'UZS' | 'USD';
  comparingPhoneIds: string[];
  onClose: () => void;
  onSelectPhone: (phone: PhoneListing) => void;
  onAddToCart: (phone: PhoneListing) => void;
  onToggleCompare: (phone: PhoneListing) => void;
  onToggleFavorite: (id: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  phones,
  currency,
  comparingPhoneIds,
  onClose,
  onSelectPhone,
  onAddToCart,
  onToggleCompare,
  onToggleFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/75 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="wishlist-title" className="flex h-full w-full max-w-3xl flex-col border-l border-white/10 bg-[#10131c] text-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-current text-rose-400" />
            <h2 id="wishlist-title" className="text-lg font-black">Istaklar</h2>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">{phones.length}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Istaklar oynasini yopish" className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
            <X className="h-5 w-5" />
          </button>
        </header>

        {phones.length ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {phones.map((phone) => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  currency={currency}
                  onSelect={(selected) => { onClose(); onSelectPhone(selected); }}
                  onAddToCart={onAddToCart}
                  isComparing={comparingPhoneIds.includes(phone.id)}
                  onToggleCompare={onToggleCompare}
                  isFavorite
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Heart className="mb-4 h-12 w-12 text-slate-600" />
            <h3 className="text-lg font-bold">Istaklar hozircha bo‘sh</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-400">Yoqtirgan telefoningiz kartasidagi yurakchani bosing — u shu yerda saqlanadi.</p>
            <button type="button" onClick={onClose} className="mt-5 min-h-11 rounded-xl bg-amber-400 px-5 py-2 font-bold text-black hover:bg-amber-300">E’lonlarni ko‘rish</button>
          </div>
        )}
      </section>
    </div>
  );
};
