import React from 'react';
import { PhoneListing } from '../types';
import { X, Check, BatteryCharging, Phone, Send, ShoppingBag, ArrowLeftRight, Heart } from 'lucide-react';
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
}

export const PhoneDetailModal: React.FC<PhoneDetailModalProps> = ({
  phone,
  currency,
  onClose,
  onAddToCart,
  onInstantBuy,
  isComparing,
  onToggleCompare,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!phone) return null;

  const formatPrice = (val: number) => val.toLocaleString('uz-UZ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl bg-[#12151e] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden my-8 text-white max-h-[90vh] flex flex-col"
      >
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {phone.brand}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-slate-300">{phone.model}</span>
            {phone.category && (
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ml-2 ${
                phone.category === 'flagship'
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                  : phone.category === 'foldable'
                  ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30'
                  : phone.category === 'camera'
                  ? 'bg-rose-400/20 text-rose-300 border-rose-400/30'
                  : phone.category === 'gaming'
                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30'
              }`}>
                {phone.category === 'flagship'
                  ? '★ Flagman'
                  : phone.category === 'foldable'
                  ? '◫ Bukiluvchi'
                  : phone.category === 'camera'
                  ? '◉ Kamerofon'
                  : phone.category === 'gaming'
                  ? '⚡ O\'yinbop'
                  : '◆ Hamyonbop'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(phone)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isComparing
                  ? 'bg-amber-400 border-amber-400 text-black'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-300 hover:text-white'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(phone.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-300 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery */}
            <div className="relative h-72 sm:h-80 rounded-2xl bg-gradient-to-b from-[#181d2a] to-[#0f121a] border border-white/[0.08] overflow-hidden flex items-center justify-center p-4">
              <img
                src={phone.images[0]}
                alt={phone.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info & Buy Module */}
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-white leading-tight">
                  {phone.title}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>{phone.city}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-200">{phone.storage}</span>
                  {phone.batteryHealth && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        {phone.batteryHealth}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <div className="text-3xl font-black text-white font-mono tabular-nums">
                  {currency === 'UZS'
                    ? `${formatPrice(phone.priceUzs)} so'm`
                    : `$${formatPrice(phone.priceUsd)}`
                  }
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                  {currency === 'UZS' ? `≈ $${phone.priceUsd}` : `≈ ${formatPrice(phone.priceUzs)} so'm`}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-slate-400 block text-[11px]">Holati</span>
                  <span className="font-bold text-white">
                    {phone.condition === 'new' ? 'Yangi' : phone.condition === 'ideal' ? 'Ideal 10/10' : 'Yaxshi 9/10'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-slate-400 block text-[11px]">UzIMEI</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Ro'yxatdan o'tgan
                  </span>
                </div>
              </div>

              {/* Seller */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Sotuvchi:</div>
                  <div className="text-sm font-bold text-white">{phone.seller.name}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${phone.seller.phone.replace(/\s+/g, '')}`}
                    className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  {phone.seller.telegram && (
                    <a
                      href={`https://t.me/${phone.seller.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#0088cc]/20 text-[#38bdf8] hover:bg-[#0088cc]/30 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Buy Actions */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onAddToCart(phone);
                    onClose();
                  }}
                  className="py-3 px-4 text-xs font-bold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Savatga</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onInstantBuy(phone);
                    onClose();
                  }}
                  className="py-3 px-4 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Hoziroq sotib olish</span>
                </motion.button>
              </div>

            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};
