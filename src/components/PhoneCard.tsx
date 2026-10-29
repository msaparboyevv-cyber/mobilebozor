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
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12151e] shadow-lg transition-colors hover:border-amber-400/40 hover:bg-[#151926] focus-within:border-amber-400/60"
    >
      <button
        type="button"
        onClick={() => onSelect(phone)}
        aria-label={`${phone.model} e’loni tafsilotlarini ochish`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-amber-300"
      />

      <div className={`pointer-events-none relative z-10 h-28 w-full shrink-0 overflow-hidden bg-gradient-to-b from-[#1a2030] to-[#0d1018] p-2 sm:h-32 ${compact ? 'sm:h-28' : ''}`}>
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

        {phone.uzImeiRegistered === true && (
          <span className="absolute bottom-2 left-2 z-10 rounded-md border border-emerald-300/40 bg-emerald-950/85 px-1.5 py-1 text-[9px] font-bold leading-none text-emerald-200 shadow-sm sm:text-[10px]">
            ✓ IMEI tasdiqlangan
          </span>
        )}
        {phone.uzImeiRegistered === false && (
          <span className="absolute bottom-2 left-2 z-10 rounded-md border border-amber-300/40 bg-amber-950/90 px-1.5 py-1 text-[9px] font-bold leading-none text-amber-200 shadow-sm sm:text-[10px]">
            IMEI ro‘yxatdan o‘tmagan
          </span>
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

      <div className={`relative z-10 flex min-w-0 flex-1 flex-col pointer-events-none ${compact ? 'gap-1 p-2' : 'gap-2 p-3'}`}>
        <p className="h-4 truncate text-[10px] font-medium leading-4 text-slate-400 sm:text-[11px]">{phone.brand} <span className="text-slate-500">·</span> {phone.storage}</p>
        <h3 className="line-clamp-2 min-h-9 break-words text-xs font-bold leading-[18px] text-white sm:text-sm">{phone.model}</h3>
        <p className="min-h-8 break-words text-xs font-black leading-4 tabular-nums text-white [overflow-wrap:anywhere] sm:text-sm" aria-label={`Narxi ${formatListingPrice(phone, currency)}`}>
          {formatListingPrice(phone, currency)}
        </p>
        <div className="flex h-5 min-w-0 items-center">
          <span className="max-w-full truncate rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold leading-4 text-slate-300">
            {getListingConditionLabel(phone.condition)}
          </span>
        </div>
        <div className="mt-auto flex min-h-7 min-w-0 items-center justify-between gap-2 border-t border-white/[0.08] pt-2 text-[10px] text-slate-400 sm:text-[11px]">
          {phone.city && <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3 w-3 shrink-0 text-amber-400" /><span className="truncate">{phone.city}</span></span>}
          {dateLabel && <span className="inline-flex shrink-0 items-center gap-1"><CalendarDays className="h-3 w-3 shrink-0" />{dateLabel}</span>}
        </div>
        <div className="pointer-events-auto grid grid-cols-[minmax(0,1fr)_2.5rem] gap-2">
          <button
          type="button"
          onClick={() => onAddToCart(phone)}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-2 text-[11px] font-bold text-black transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:text-xs"
        >
          <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Savatga
        </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(phone.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `${phone.model}ni istaklardan olib tashlash` : `${phone.model}ni istaklarga qo‘shish`}
            title={isFavorite ? 'Istaklardan olib tashlash' : 'Istaklarga qo‘shish'}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${isFavorite ? 'border-rose-400/40 bg-rose-500/15 text-rose-300' : 'border-white/10 bg-white/[0.05] text-slate-200 hover:border-rose-400/40 hover:text-rose-300'}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
