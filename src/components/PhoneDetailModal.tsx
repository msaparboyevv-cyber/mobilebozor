import React, { useEffect, useState } from 'react';
import { PhoneListing } from '../types';
import { X, Check, BatteryCharging, Phone, Send, ShoppingBag, ArrowLeftRight, Heart, MapPin, CalendarDays, ImageOff } from 'lucide-react';
import { motion } from 'motion/react';

interface PhoneDetailModalProps {
  phone: PhoneListing | null;
  currency: 'UZS' | 'USD';
  onClose: () => void;
  onAddToCart: (phone: PhoneListing) => void;
  onInstantBuy: (phone: PhoneListing) => void;
  isComparing: boolean;
  onToggleCompare: (phone: PhoneListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  listings: PhoneListing[];
  onSelectListing: (phone: PhoneListing) => void;
}

export const PhoneDetailModal: React.FC<PhoneDetailModalProps> = ({
  phone, currency, onClose, onAddToCart, onInstantBuy, isComparing,
  onToggleCompare, isFavorite, onToggleFavorite, listings, onSelectListing,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  useEffect(() => {
    setActiveImage(0);
    setFailedImages([]);
  }, [phone?.id]);

  if (!phone) return null;

  if (!listings.some((listing) => listing.id === phone.id)) {
    return <div className="fixed inset-0 z-50 flex min-h-[100dvh] items-center justify-center bg-[#12151e] p-6 text-center text-white" role="dialog" aria-modal="true" aria-labelledby="missing-listing-title">
      <div className="max-w-sm"><h1 id="missing-listing-title" className="text-2xl font-bold">E’lon topilmadi</h1><p className="mt-2 text-sm text-slate-400">Bu e’lon o‘chirilgan yoki endi mavjud emas.</p><button type="button" onClick={onClose} className="mt-5 rounded-xl bg-amber-400 px-5 py-3 font-bold text-black">Orqaga qaytish</button></div>
    </div>;
  }

  const formatPrice = (value: number) => value.toLocaleString('uz-UZ');
  const images = phone.images.filter(Boolean);
  const conditionLabels: Record<PhoneListing['condition'], string> = {
    new: 'Yangi', ideal: 'Ideal', good: 'Yaxshi', fair: 'Qoniqarli',
  };
  const phoneNumber = phone.seller.phone?.trim();
  const canCall = Boolean(phoneNumber && phoneNumber.replace(/\D/g, '').length >= 7);
  const date = new Date(phone.createdAt);
  const listingDate = Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('uz-UZ');
  const similarListings = listings
    .filter((item) => item.id !== phone.id)
    .map((item) => ({
      item,
      score: (item.brand === phone.brand ? 3 : 0)
        + (item.category === phone.category ? 2 : 0)
        + (item.storage === phone.storage ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ item }) => item);
  const categoryLabels = {
    flagship: 'Flagman', foldable: 'Bukiluvchi', camera: 'Kamerofon', gaming: "O'yinbop", budget: 'Hamyonbop',
  };

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full overflow-y-auto overscroll-contain bg-[#12151e]">
      <motion.div role="dialog" aria-modal="true" aria-labelledby="phone-detail-title" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.18 }} className="relative flex min-h-full w-full flex-col bg-[#12151e] text-white">
        <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#12151e]/95 px-3 py-2 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{phone.brand}</span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300">{categoryLabels[phone.category]}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => onToggleCompare(phone)} aria-label={isComparing ? 'Taqqoslashdan olib tashlash' : 'Taqqoslashga qo‘shish'} title="Taqqoslash" className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border p-2 transition-colors ${isComparing ? 'border-amber-400 bg-amber-400 text-black' : 'border-white/[0.08] bg-white/[0.05] text-slate-300 hover:text-white'}`}><ArrowLeftRight className="h-4 w-4" /></button>
            <button type="button" onClick={() => onToggleFavorite(phone.id)} aria-label={isFavorite ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo‘shish'} title="Sevimlilar" aria-pressed={isFavorite} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border p-2 transition-colors ${isFavorite ? 'border-rose-500 bg-rose-500 text-white' : 'border-white/[0.08] bg-white/[0.05] text-slate-300 hover:text-rose-400'}`}><Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} /></button>
            <button type="button" onClick={onClose} aria-label="E’lon tafsilotlarini yopish" className="ml-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"><X className="h-5 w-5" /></button>
          </div>
        </header>

        <main className="flex-1 space-y-5 p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6 lg:p-8">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-4 md:grid-cols-2 lg:gap-8">
            <section aria-label="Telefon rasmlari" className="space-y-2">
              <div className="flex h-60 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181d2a] to-[#0f121a] p-3 sm:h-[22rem]">
                {images[activeImage] && !failedImages.includes(images[activeImage]) ? (
                  <img src={images[activeImage]} alt={`${phone.title} rasmi ${activeImage + 1}`} referrerPolicy="no-referrer" onError={() => setFailedImages((current) => [...current, images[activeImage]])} className="h-full w-full object-contain" />
                ) : <div className="flex flex-col items-center gap-2 text-slate-500"><ImageOff className="h-10 w-10" aria-hidden="true" /><span className="text-sm">Rasm mavjud emas</span></div>}
              </div>
              {images.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Galereya rasmlari">
                {images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`${index + 1}-rasmni ko‘rsatish`} aria-pressed={activeImage === index} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-[#181d2a] p-1 ${activeImage === index ? 'border-amber-400' : 'border-white/10'}`}>
                  {!failedImages.includes(image) ? <img src={image} alt="" onError={() => setFailedImages((current) => [...current, image])} className="h-full w-full object-contain" /> : <ImageOff className="m-auto h-5 w-5 text-slate-500" />}
                </button>)}
              </div>}
            </section>

            <section className="min-w-0 space-y-3">
              <div className="min-w-0">
                <h1 id="phone-detail-title" className="line-clamp-2 break-words text-xl font-black leading-tight text-white [overflow-wrap:anywhere] sm:text-2xl">{phone.model}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-400">
                  <span>{phone.storage}</span>
                  <span aria-hidden="true">·</span>
                  <span>{phone.ram} RAM</span>
                  <span aria-hidden="true">·</span>
                  <span className="break-words">{phone.color}</span>
                </div>
              </div>

              <div className="flex min-w-0 items-baseline gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2">
                <span className="shrink-0 text-[11px] font-semibold text-amber-200/75">Narxi</span>
                <div className="min-w-0 break-words text-2xl font-black leading-tight tabular-nums text-amber-300 sm:text-[30px]">
                  {currency === 'UZS' ? `${formatPrice(phone.priceUzs)} so‘m` : `$${formatPrice(phone.priceUsd)}`}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-bold text-white">{conditionLabels[phone.condition]}</span>
                {phone.uzImeiRegistered
                  ? <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-bold text-emerald-300"><Check className="h-3 w-3" />IMEI ro‘yxatdan o‘tgan</span>
                  : <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 font-bold text-amber-200">IMEI ro‘yxatdan o‘tmagan</span>}
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-300">Kafolat: {phone.warrantyMonths > 0 ? `${phone.warrantyMonths} oy` : 'yo‘q'}</span>
                {phone.batteryHealth != null && <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-300"><BatteryCharging className="h-3 w-3 text-emerald-400" />{phone.batteryHealth}%</span>}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white">{phone.seller.name || 'Sotuvchi'}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400">
                    {phone.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-amber-400" />{phone.city}</span>}
                    {listingDate && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{listingDate}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {canCall && <a href={`tel:${phoneNumber!.replace(/\s+/g, '')}`} aria-label={`Sotuvchiga qo‘ng‘iroq qilish: ${phoneNumber}`} title="Qo‘ng‘iroq qilish" className="rounded-xl bg-emerald-500/20 p-3 text-emerald-300 transition hover:bg-emerald-500/30"><Phone className="h-4 w-4" /></a>}
                  {phone.seller.telegram?.trim() && <a href={`https://t.me/${phone.seller.telegram.trim().replace(/^@/, '')}`} aria-label={`${phone.seller.name} bilan Telegram orqali bog‘lanish`} title="Telegram orqali bog‘lanish" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-sky-500/20 p-3 text-sky-300 transition hover:bg-sky-500/30"><Send className="h-4 w-4" /></a>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => { onAddToCart(phone); onClose(); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-xs font-bold text-slate-200 transition-colors hover:bg-white/[0.12]"><ShoppingBag className="h-4 w-4" /><span>Savatga</span></motion.button>
                <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => { onInstantBuy(phone); onClose(); }} className="flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-3 text-xs font-bold text-black shadow-md transition hover:from-amber-300 hover:to-amber-200">Hoziroq sotib olish</motion.button>
              </div>
            </section>
          </div>

          {phone.description?.trim() && <section className="mx-auto w-full max-w-6xl rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
            <h2 className="mb-2 text-base font-bold">Tavsif</h2>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{phone.description}</p>
          </section>}

          {similarListings.length > 0 && <section className="mx-auto w-full max-w-6xl">
            <h2 className="mb-3 text-lg font-bold">O‘xshash e’lonlar</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {similarListings.map((item) => <button key={item.id} type="button" onClick={() => onSelectListing(item)} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-amber-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
                <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-[#0f121a] p-2">{item.images[0] ? <img src={item.images[0]} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="h-full w-full object-contain" /> : <ImageOff className="h-6 w-6 text-slate-500" />}</div>
                <span className="line-clamp-2 break-words text-xs font-semibold text-white">{item.title}</span>
                <span className="mt-1 block break-words text-sm font-extrabold text-amber-300">{currency === 'UZS' ? `${formatPrice(item.priceUzs)} so‘m` : `$${formatPrice(item.priceUsd)}`}</span>
              </button>)}
            </div>
          </section>}
        </main>
      </motion.div>
    </div>
  );
};
