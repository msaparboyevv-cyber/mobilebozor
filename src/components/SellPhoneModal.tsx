import React, { useState } from 'react';
import { PhoneListing, PhoneBrand, PhoneCondition, StorageOption, PhoneCategory } from '../types';
import { X, Upload, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { CITIES_OF_UZBEKISTAN, ALL_MODELS_BY_BRAND } from '../data/mockPhones';
import { motion, AnimatePresence } from 'motion/react';

interface SellPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: PhoneListing) => void;
  usdToUzsRate: number;
}

export const SellPhoneModal: React.FC<SellPhoneModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  usdToUzsRate,
}) => {
  const [brand, setBrand] = useState<PhoneBrand>('Apple');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<PhoneCategory>('flagship');
  const [storage, setStorage] = useState<StorageOption>('128GB');
  const [ram, setRam] = useState('8GB');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState<PhoneCondition>('ideal');
  const [batteryHealth, setBatteryHealth] = useState<number>(95);
  const [priceUsd, setPriceUsd] = useState<number>(750);
  const [uzImeiRegistered, setUzImeiRegistered] = useState(true);
  const [warrantyMonths, setWarrantyMonths] = useState(3);
  const [city, setCity] = useState('Toshkent');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('+998 ');
  const [sellerTelegram, setSellerTelegram] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('/src/assets/images/phone_iphone_titanium_1792582841706.jpg');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Faqat rasm faylini tanlang.');
      e.target.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Rasm hajmi 8 MB dan kichik bo‘lishi kerak.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setErrorMessage('Rasmni o‘qib bo‘lmadi. Boshqa rasm tanlang.');
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setImagePreview(canvas.toDataURL('image/jpeg', 0.82));
        setErrorMessage('');
      };
      image.onerror = () => setErrorMessage('Rasm formati o‘qilmadi. Boshqa rasm tanlang.');
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectModelSuggestion = (suggestedModel: string, suggestedCat: PhoneCategory, basePrice: number) => {
    setModel(suggestedModel);
    setCategory(suggestedCat);
    setPriceUsd(basePrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setErrorMessage('Telefon modelini kiriting.');
      return;
    }
    if (!sellerName.trim() || sellerPhone.length < 9) {
      setErrorMessage('Ism va telefon raqamni to\'g\'ri kiriting.');
      return;
    }

    setErrorMessage('');

    const newListing: PhoneListing = {
      id: `phone-${Date.now()}`,
      title: `${brand} ${model.trim()} ${storage} ${color ? `(${color})` : ''}`,
      brand,
      model: model.trim(),
      category,
      storage,
      ram,
      color: color.trim() || 'Standart',
      condition,
      batteryHealth: condition === 'new' ? 100 : batteryHealth,
      priceUsd,
      priceUzs: priceUsd * usdToUzsRate,
      isOriginal: true,
      uzImeiRegistered,
      warrantyMonths,
      boxAndAccessories: ['Qutisi', 'Kabel'],
      city,
      seller: {
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        telegram: sellerTelegram.trim().replace('@', ''),
        type: 'individual',
        rating: 5.0,
        dealsCount: 1
      },
      images: [imagePreview],
      description: description.trim() || `${brand} ${model} ${storage}. Holati ${condition}.`,
      createdAt: new Date().toISOString(),
      viewsCount: 1
    };

    onAddListing(newListing);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-[#12151e] border border-white/[0.1] rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">E'lon joylashtirildi!</h3>
            <p className="text-sm text-slate-300">
              Smartfoningiz darhol katalogda paydo bo'ldi.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-6 py-3 text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
              >
                Katalogda ko'rish
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-black text-white">E'lon joylashtirish</h2>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Brand, Category & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Brend</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as PhoneBrand)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Apple" className="bg-[#12151e]">Apple (iPhone)</option>
                  <option value="Samsung" className="bg-[#12151e]">Samsung</option>
                  <option value="Redmi" className="bg-[#12151e]">Redmi</option>
                  <option value="Realme" className="bg-[#12151e]">Realme</option>
                  <option value="Nokia" className="bg-[#12151e]">Nokia</option>
                  <option value="Asus" className="bg-[#12151e]">Asus (ROG / Zenfone)</option>
                  <option value="Vivo" className="bg-[#12151e]">Vivo</option>
                  <option value="Spark" className="bg-[#12151e]">Tecno Spark</option>
                  <option value="Infinix" className="bg-[#12151e]">Infinix</option>
                  <option value="Honor" className="bg-[#12151e]">Honor</option>
                  <option value="Huawei" className="bg-[#12151e]">Huawei</option>
                  <option value="Xiaomi" className="bg-[#12151e]">Xiaomi</option>
                  <option value="Google" className="bg-[#12151e]">Google Pixel</option>
                  <option value="OnePlus" className="bg-[#12151e]">OnePlus</option>
                  <option value="Boshqa" className="bg-[#12151e]">Boshqa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Telefon turi</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PhoneCategory)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-amber-300 focus:outline-none focus:border-amber-400"
                >
                  <option value="flagship" className="bg-[#12151e] text-white">★ Flagman</option>
                  <option value="foldable" className="bg-[#12151e] text-white">◫ Bukiluvchi (Fold/Flip)</option>
                  <option value="camera" className="bg-[#12151e] text-white">◉ Kamerofon</option>
                  <option value="gaming" className="bg-[#12151e] text-white">⚡ O'yinbop (Gaming)</option>
                  <option value="budget" className="bg-[#12151e] text-white">◆ Hamyonbop (Budget)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Model nomi</label>
                <input
                  type="text"
                  required
                  placeholder="iPhone 18 Pro, S24 Ultra..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick model suggestion tags */}
            {ALL_MODELS_BY_BRAND[brand] && ALL_MODELS_BY_BRAND[brand].length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Tezkor modellar:</span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {ALL_MODELS_BY_BRAND[brand].slice(0, 6).map((item) => (
                    <button
                      key={item.model}
                      type="button"
                      onClick={() => handleSelectModelSuggestion(item.model, item.category, item.baseUsd)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        model === item.model
                          ? 'bg-amber-400 text-black border-amber-400 font-bold'
                          : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:text-white'
                      }`}
                    >
                      {item.model}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage, Condition, Battery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Xotira</label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(e.target.value as StorageOption)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="128GB" className="bg-[#12151e]">128 GB</option>
                  <option value="256GB" className="bg-[#12151e]">256 GB</option>
                  <option value="512GB" className="bg-[#12151e]">512 GB</option>
                  <option value="1TB" className="bg-[#12151e]">1 TB</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Holati</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as PhoneCondition)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="new" className="bg-[#12151e]">Yangi (Qutida)</option>
                  <option value="ideal" className="bg-[#12151e]">Ideal (10/10)</option>
                  <option value="good" className="bg-[#12151e]">Yaxshi (9/10)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Batareya: {batteryHealth}%</label>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(Number(e.target.value))}
                  className="w-full accent-amber-400 mt-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Price block */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 mb-1">Narxi (USD)</label>
                <input
                  type="number"
                  min="10"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/[0.1] text-base font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">So'mda:</span>
                <span className="font-mono font-black text-amber-400 text-base">
                  {(priceUsd * usdToUzsRate).toLocaleString('uz-UZ')} so'm
                </span>
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Rasm</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/[0.05] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl cursor-pointer text-slate-200 transition-colors">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Rasm tanlash</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Seller Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Ismingiz</label>
                <input
                  type="text"
                  required
                  placeholder="Ali"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Telefon</label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Bekor qilish
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="py-3 px-6 text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-md cursor-pointer"
              >
                E'lonni chop etish
              </motion.button>
            </div>

          </form>
        )}
      </motion.div>
    </div>
  );
};
