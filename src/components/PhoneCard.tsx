import React from 'react';
import { PhoneListing } from '../types';
import { ShoppingBag, ArrowLeftRight, Heart, BatteryCharging } from 'lucide-react';
import { motion } from 'motion/react';

interface PhoneCardProps {
  phone: PhoneListing;
  currency: 'UZS' | 'USD';
  onSelect: (phone: PhoneListing) => void;
  onAddToCart: (phone: PhoneListing) => void;
  isComparing: boolean;
  onToggleCompare: (phone: PhoneListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
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
}) => {
  const formatPrice = (val: number) => val.toLocaleString('uz-UZ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-2xl border border-white/[0.08] hover:border-amber-400/40 bg-[#12151e]/90 hover:bg-[#151926] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm"
    >
      
      {/* Visual Area */}
      <div 
        onClick={() => onSelect(phone)}
        className="relative h-60 sm:h-64 w-full bg-gradient-to-b from-[#181d2a] to-[#0f121a] overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        <img
          src={phone.images[0]}
          alt={phone.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center transform transition-transform duration-500 group-hover:scale-108"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Top Floating Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(phone);
            }}
            title={isComparing ? "Taqqoslanmoqda" : "Taqqoslash"}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
              isComparing
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(phone.id);
            }}
            title="Sevimli"
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/60 text-slate-300 hover:text-rose-400 hover:bg-black'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Category & Condition Tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {phone.category && (
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-md ${
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

        {/* Condition Tag */}
        <div className="absolute bottom-3 left-3 z-10 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          {phone.condition === 'new' ? 'Yangi' : phone.condition === 'ideal' ? 'Ideal 10/10' : 'Yaxshi 9/10'}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        
        {/* Unboxed Metadata */}
        <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
          <span className="font-bold text-amber-400">{phone.brand}</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-200">{phone.storage}</span>
          {phone.batteryHealth && (
            <>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <BatteryCharging className="w-3.5 h-3.5" />
                {phone.batteryHealth}%
              </span>
            </>
          )}
        </div>

        {/* Model Title */}
        <h3 
          onClick={() => onSelect(phone)}
          className="text-base font-bold text-white line-clamp-1 hover:text-amber-400 cursor-pointer transition-colors"
        >
          {phone.model}
        </h3>

        {/* Price Row */}
        <div className="pt-2 border-t border-white/[0.06] flex items-baseline justify-between">
          <div>
            <div className="text-xl font-black text-white font-mono tabular-nums">
              {currency === 'UZS' 
                ? `${formatPrice(phone.priceUzs)} so'm` 
                : `$${formatPrice(phone.priceUsd)}`
              }
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {currency === 'UZS' 
                ? `$${phone.priceUsd}` 
                : `${formatPrice(phone.priceUzs)} so'm`
              }
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-400">
              UzIMEI ✓
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(phone)}
            className="py-2.5 px-3 text-xs font-bold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl transition-colors cursor-pointer text-center"
          >
            Batafsil
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(phone)}
            className="py-2.5 px-3 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/10 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>Sotib olish</span>
          </motion.button>
        </div>

      </div>

    </motion.div>
  );
};
