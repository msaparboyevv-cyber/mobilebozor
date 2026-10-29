import React from 'react';
import { PhoneListing } from '../types';
import { PhoneCard } from './PhoneCard';

interface HeroProps {
  phones: PhoneListing[];
  currency: 'UZS' | 'USD';
  onSelectPhone: (phone: PhoneListing) => void;
  onAddToCart: (phone: PhoneListing) => void;
  comparingPhoneIds: string[];
  onToggleCompare: (phone: PhoneListing) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ phones, currency, onSelectPhone, onAddToCart, comparingPhoneIds, onToggleCompare, favoriteIds, onToggleFavorite }) => {
  const featuredPhones = [...phones]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <section aria-labelledby="hero-listings-title" className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#090b10]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(245,158,11,0.16),transparent_42%),linear-gradient(180deg,#10131c_0%,#090b10_100%)]" />
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <h1 id="hero-listings-title" className="text-lg font-black text-white sm:text-xl">Telefonlar va narxlari</h1>
        {featuredPhones.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featuredPhones.map((phone) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                currency={currency}
                onSelect={onSelectPhone}
                onAddToCart={onAddToCart}
                isComparing={comparingPhoneIds.includes(phone.id)}
                onToggleCompare={onToggleCompare}
                isFavorite={favoriteIds.includes(phone.id)}
                onToggleFavorite={onToggleFavorite}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-slate-400">
            Hozircha telefon e’lonlari yo‘q.
          </div>
        )}
      </div>
    </section>
  );
};
