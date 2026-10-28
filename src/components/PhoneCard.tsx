import React, { useState } from 'react';
import { PhoneListing } from '../types';
import { ShoppingBag, ArrowLeftRight, Heart, MapPin, CalendarDays, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { formatListingDate, formatListingPrice, getListingConditionLabel } from '../utils/phoneCardFormat';

interface PhoneCardProps {
  phone: PhoneListing;
  currency: 'UZS' | 'USD';
  onSelect: (phone: PhoneListing) => void;
  onAddToCart: (phone: PhoneListing) => void;
  isComparing: boolean;
  onToggleCompare: (phone: PhoneListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  compact?: boolean;
}

export const PhoneCard: React.FC<PhoneCardProps> = ({
  phone,
  currency,
  onSelect,
  onAddToCart,
  isComparing,
  onToggleCompare,
  isFavorite,
  onToggleFavorite,
  compact = false,
}) => {
  const imageSrc = phone.images?.find(Boolean);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(imageSrc) && failedImage !== imageSrc;
  const dateLabel = formatListingDate(phone.createdAt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`group relative flex h-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#12151e] shadow-lg transition-colors hover:border-amber-400/40 hover:bg-[#151926] focus-within:border-amber-400/60 ${compact ? 'flex-row items-center' : 'flex-col'}`}
    >
      <button
        type="button"
        onClick={() => onSelect(phone)}
        aria-label={`${phone.model} e’loni tafsilotlarini ochish`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-amber-300"
      />

      <div className={`relative z-10 shrink-0 overflow-hidden bg-gradient-to-b from-[#1a2030] to-[#0d1018] p-3 pointer-events-none ${compact ? 'h-24 w-24 sm:h-28 sm:w-28' : 'aspect-[4/3] w-full'}`}>
        {showImage ? (
          <img
            src={imageSrc}
            alt={phone.model}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailedImage(imageSrc || '')}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div role="img" aria-label={`${phone.model} rasmi mavjud emas`} className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
            <Smartphone className="h-10 w-10" aria-hidden="true" />
            <span className="text-xs">Rasm mavjud emas</span>
          </div>
        )}

        <div className="pointer-events-auto absolute right-3 top-3 z-10 flex gap-2">
          {!compact && <button
            type="button"
            onClick={() => onToggleCompare(phone)}
            aria-pressed={isComparing}
            aria-label={isComparing ? `${phone.model}ni taqqoslashdan olib tashlash` : `${phone.model}ni taqqoslashga qo‘shish`}
            title={isComparing ? 'Taqqoslashdan olib tashlash' : 'Taqqoslash'}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 shadow-sm backdrop-blur transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${isComparing ? 'bg-amber-400 text-black' : 'bg-black/65 text-white hover:bg-black'}`}
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>}
        </div>
      </div>

      <div className={`relative z-10 flex min-w-0 flex-1 flex-col pointer-events-none ${compact ? 'gap-1.5 p-3' : 'gap-2.5 p-4'}`}>
        <p className="truncate text-xs font-bold text-amber-300">{phone.brand} <span className="text-slate-500">·</span> {phone.storage}</p>
        <h3 className={`break-words font-bold leading-5 text-white ${compact ? 'line-clamp-2 text-sm' : 'line-clamp-2 min-h-10 text-base'}`}>{phone.model}</h3>
        <p className={`break-words font-black leading-tight tabular-nums text-white ${compact ? 'text-base' : 'text-xl'}`} aria-label={`Narxi ${formatListingPrice(phone, currency)}`}>
          {formatListingPrice(phone, currency)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-slate-200">
            {getListingConditionLabel(phone.condition)}
          </span>
          {phone.uzImeiRegistered && <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">IMEI ro‘yxatdan o‘tgan</span>}
        </div>
        <div className="mt-auto flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.08] pt-2 text-xs text-slate-400">
          {phone.city && <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" /><span className="truncate">{phone.city}</span></span>}
          {dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 shrink-0" />{dateLabel}</span>}
        </div>
        <div className="pointer-events-auto mt-1 grid grid-cols-[1fr_auto] gap-2">
          <button
          type="button"
          onClick={() => onAddToCart(phone)}
            className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-3 py-2.5 font-bold text-black transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 ${compact ? 'text-xs' : 'text-sm'}`}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {compact ? 'Savatga' : 'Savatga qo‘shish'}
        </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(phone.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `${phone.model}ni istaklardan olib tashlash` : `${phone.model}ni istaklarga qo‘shish`}
            title={isFavorite ? 'Istaklardan olib tashlash' : 'Istaklarga qo‘shish'}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${isFavorite ? 'border-rose-400/40 bg-rose-500/15 text-rose-300' : 'border-white/10 bg-white/[0.05] text-slate-200 hover:border-rose-400/40 hover:text-rose-300'}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
