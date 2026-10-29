import React, { useState, useMemo } from 'react';
import { PhoneBrand, StorageOption, TradeInRequest } from '../types';
import { RefreshCw, CheckCircle2, ShieldCheck, Zap, Calculator } from 'lucide-react';
import { ALL_MODELS_BY_BRAND } from '../data/mockPhones';
import { motion, AnimatePresence } from 'motion/react';

interface TradeInCalculatorProps {
  onTradeInSuccess?: () => void;
  onExploreCatalog?: () => void;
  onSubmitTradeIn?: (req: TradeInRequest) => void;
  usdToUzsRate: number;
}

export const TradeInCalculator: React.FC<TradeInCalculatorProps> = ({
  onExploreCatalog,
  onSubmitTradeIn,
  usdToUzsRate,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<PhoneBrand>('Apple');
  const [selectedModel, setSelectedModel] = useState<string>('iPhone 18 Pro Max');
  const [selectedStorage, setSelectedStorage] = useState<StorageOption>('256GB');
  const [screenCondition, setScreenCondition] = useState<'perfect' | 'minor' | 'cracked'>('perfect');
  const [bodyCondition, setBodyCondition] = useState<'perfect' | 'minor' | 'heavy'>('perfect');
  const [batteryLevel, setBatteryLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [hasBox, setHasBox] = useState(true);
  const [hasAccessories, setHasAccessories] = useState(true);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+998 ');
  const [selectedBranch, setSelectedBranch] = useState('Toshkent — Malika A-14');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const currentModelList = ALL_MODELS_BY_BRAND[selectedBrand] || ALL_MODELS_BY_BRAND.Apple;
  const currentModelInfo = currentModelList.find((m) => m.model === selectedModel) || currentModelList[0];

  const estimatedPriceUsd = useMemo(() => {
    const found = currentModelList.find((m) => m.model === selectedModel) || currentModelList[0];
    let price = found.baseUsd;

    if (selectedStorage === '256GB') price += 50;
    else if (selectedStorage === '512GB') price += 110;
    else if (selectedStorage === '1TB') price += 190;
    else if (selectedStorage === '64GB') price -= 40;

    if (screenCondition === 'minor') price *= 0.88;
    else if (screenCondition === 'cracked') price *= 0.65;

    if (bodyCondition === 'minor') price *= 0.94;
    else if (bodyCondition === 'heavy') price *= 0.82;

    if (batteryLevel === 'medium') price *= 0.93;
    else if (batteryLevel === 'low') price *= 0.84;

    if (hasBox) price += 20;
    if (hasAccessories) price += 15;

    return Math.round(price);
  }, [selectedModel, currentModelList, selectedStorage, screenCondition, bodyCondition, batteryLevel, hasBox, hasAccessories]);

  const estimatedPriceUzs = estimatedPriceUsd * usdToUzsRate;
  const tradeInNewPhoneBonusUzs = Math.round(estimatedPriceUzs * 1.05);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = clientPhone.replace(/\D/g, '');
    if (clientName.trim().length < 2) {
      setFormError('Ismni kamida 2 ta harf bilan kiriting.');
      return;
    }
    if (!/^998\d{9}$/.test(normalizedPhone)) {
      setFormError('Telefon raqamini +998 XX XXX XX XX formatida kiriting.');
      return;
    }
    setFormError('');
    
    if (onSubmitTradeIn) {
      onSubmitTradeIn({
        id: `TR-${Math.floor(10000 + Math.random() * 90000)}`,
        clientName: clientName.trim(),
        clientPhone: `+${normalizedPhone}`,
        brand: selectedBrand,
        model: selectedModel,
        storage: selectedStorage,
        conditionSummary: `Ekran: ${screenCondition}, Korpus: ${bodyCondition}, Batareya: ${batteryLevel}`,
        estimatedPriceUzs,
        estimatedPriceUsd,
        branchOrCourier: selectedBranch,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }

    setIsSubmitted(true);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="tradein-section" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
    >
      
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tezkor Trade-in Kalkulyatori
        </h2>
        <p className="text-base text-slate-300 font-medium">
          Telefoningiz qiymatini bir necha soniyada hisoblang va naqd pul oling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive options */}
        <div className="lg:col-span-7 bg-[#12151e] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
          
          {/* Brand */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Brend
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(['Apple', 'Samsung', 'Redmi', 'Realme', 'Nokia', 'Asus', 'Vivo', 'Spark', 'Infinix', 'Honor', 'Huawei', 'Xiaomi', 'Google', 'OnePlus', 'Boshqa'] as PhoneBrand[]).map((b) => (
                <motion.button
                  key={b}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(b);
                    const list = ALL_MODELS_BY_BRAND[b] || ALL_MODELS_BY_BRAND.Apple;
                    setSelectedModel(list[0].model);
                  }}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    selectedBrand === b
                      ? 'bg-amber-400 border-amber-400 text-black shadow-md shadow-amber-400/20'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
                  }`}
                >
                  {b}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Model & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Model ({currentModelList.length} ta)
                </label>
                {currentModelInfo && (
                  <span className="text-[10px] font-bold text-amber-300 uppercase">
                    {currentModelInfo.category === 'flagship' ? '★ Flagman' : currentModelInfo.category === 'foldable' ? '◫ Bukiluvchi' : currentModelInfo.category === 'camera' ? '◉ Kamerofon' : currentModelInfo.category === 'gaming' ? '⚡ O\'yinbop' : '◆ Hamyonbop'}
                  </span>
                )}
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full py-3 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {currentModelList.map((m) => (
                  <option key={m.model} value={m.model} className="bg-[#12151e] text-white">
                    {m.model} ({m.category === 'flagship' ? 'Flagman' : m.category === 'foldable' ? 'Bukiluvchi' : m.category === 'camera' ? 'Kamerofon' : m.category === 'gaming' ? 'O\'yinbop' : 'Hamyonbop'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Xotira
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['128GB', '256GB', '512GB', '1TB'] as StorageOption[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStorage(st)}
                    className={`py-2.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedStorage === st
                        ? 'bg-white text-black font-black border-white shadow-sm'
                        : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Screen Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Ekran holati
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'perfect', label: 'Ideal (10/10)' },
                { id: 'minor', label: 'Mayda chiziqlar' },
                { id: 'cracked', label: 'Darz ketgan' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScreenCondition(opt.id as 'perfect' | 'minor' | 'cracked')}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    screenCondition === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Korpus holati
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'perfect', label: 'Yangidek' },
                { id: 'minor', label: 'Yengil izlar' },
                { id: 'heavy', label: 'Urilgan joyi bor' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBodyCondition(opt.id as 'perfect' | 'minor' | 'heavy')}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    bodyCondition === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Battery */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Batareya salomatligi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: '90% – 100%' },
                { id: 'medium', label: '80% – 89%' },
                { id: 'low', label: '< 80%' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBatteryLevel(opt.id as 'high' | 'medium' | 'low')}
                  className={`py-2.5 px-3 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                    batteryLevel === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-2 flex items-center gap-6 text-xs text-slate-300 border-t border-white/[0.06]">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={hasBox}
                onChange={(e) => setHasBox(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-400"
              />
              <span>Qutisi mavjud (+20$)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={hasAccessories}
                onChange={(e) => setHasAccessories(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-400"
              />
              <span>Zaryadlovchi mavjud (+15$)</span>
            </label>
          </div>

        </div>

        {/* Right: Calculated Offer Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <motion.div 
            layout
            className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#181d2a] to-[#10131d] p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>{selectedBrand} {selectedModel}</span>
              <span>15 daqiqada naqd</span>
            </div>

            {/* Big price display */}
            <div>
              <motion.div 
                key={estimatedPriceUzs}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums"
              >
                {estimatedPriceUzs.toLocaleString('uz-UZ')} so'm
              </motion.div>
              <div className="text-sm font-mono font-bold text-amber-400 mt-1">
                ≈ ${estimatedPriceUsd.toLocaleString('en-US')} USD
              </div>
            </div>

            {/* Bonus Perk */}
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs text-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-300">Yangi modelga almashtirish:</div>
                <div className="font-mono font-bold text-white text-sm mt-0.5">
                  {tradeInNewPhoneBonusUzs.toLocaleString('uz-UZ')} so'm (+5%)
                </div>
              </div>
              <RefreshCw className="w-6 h-6 text-amber-400" />
            </div>

            {/* Form */}
            {isSubmitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Ariza qabul qilindi!</h4>
                <p className="text-xs text-slate-300">
                  Ariza ushbu brauzerda saqlandi. Hozircha mutaxassisga avtomatik yuborilmaydi.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs text-amber-400 underline font-semibold cursor-pointer"
                >
                  Yana hisoblash
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-3 pt-2">
                {formError && <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">{formError}</p>}
                <input
                  type="text"
                  required
                  placeholder="Ismingiz"
                  value={clientName}
                  onChange={(e) => { setClientName(e.target.value); setFormError(''); }}
                  className="w-full py-3 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-400"
                />

                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={clientPhone}
                  onChange={(e) => { setClientPhone(e.target.value); setFormError(''); }}
                  className="w-full py-3 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />

                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full py-3 px-3 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                >
                  <option value="Toshkent — Malika A-14">Toshkent — Malika A-14</option>
                  <option value="Toshkent — Chilonzor">Toshkent — Chilonzor</option>
                  <option value="Samarqand — Registon">Samarqand — Registon</option>
                  <option value="Kuryer bepul chaqirish">Kuryer orqali topshirish</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 px-4 text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Naqd pul olish</span>
                </motion.button>
              </form>
            )}

          </motion.div>

        </div>

      </div>

    </motion.section>
  );
};
