import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PhoneListing, StorageOption, PhoneCategory } from '../types';
import { PHONE_CATEGORIES, CITIES_OF_UZBEKISTAN } from '../data/mockPhones';
import { PhoneCard } from './PhoneCard';
import { 
  Search, 
  RotateCcw, 
  Smartphone, 
  Sparkles, 
  Layers, 
  Camera, 
  Gamepad2, 
  Tag,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Play,
  Pause,
  MapPin,
  ArrowRight,
  X,
  Check,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhoneCatalogProps {
  phones: PhoneListing[];
  currency: 'UZS' | 'USD';
  onSelectPhone: (phone: PhoneListing) => void;
  onAddToCart: (phone: PhoneListing) => void;
  comparingPhoneIds: string[];
  onToggleCompare: (phone: PhoneListing) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onOpenSellModal: () => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  selectedBrand?: string;
  onSelectBrand?: (brand: string) => void;
  selectedCategory?: PhoneCategory | 'all';
  onSelectCategory?: (cat: PhoneCategory | 'all') => void;
  isCatalogModalOpen?: boolean;
  setIsCatalogModalOpen?: (open: boolean) => void;
}

export const PhoneCatalog: React.FC<PhoneCatalogProps> = ({
  phones,
  currency,
  onSelectPhone,
  onAddToCart,
  comparingPhoneIds,
  onToggleCompare,
  favoriteIds,
  onToggleFavorite,
  onOpenSellModal,
  selectedCity: propSelectedCity = 'Barcha viloyatlar',
  onSelectCity,
  selectedBrand: propSelectedBrand,
  onSelectBrand,
  selectedCategory: propSelectedCategory,
  onSelectCategory,
  isCatalogModalOpen: propIsModalOpen,
  setIsCatalogModalOpen: propSetIsModalOpen,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const isModalOpen = propIsModalOpen !== undefined ? propIsModalOpen : internalModalOpen;
  const setIsModalOpen = propSetIsModalOpen || setInternalModalOpen;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PhoneCategory | 'all'>(propSelectedCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(propSelectedBrand || 'all');
  const [showBrandOptions, setShowBrandOptions] = useState(false);
  const [showPhoneModels, setShowPhoneModels] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>(propSelectedCity);
  const [minimumPrice, setMinimumPrice] = useState('');
  const [maximumPrice, setMaximumPrice] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'battery'>('newest');

  // Sync with propSelectedCity when changed externally from Header
  useEffect(() => {
    if (propSelectedCity) {
      setSelectedCity(propSelectedCity);
    }
  }, [propSelectedCity]);

  // Sync with propSelectedBrand when changed externally
  useEffect(() => {
    if (propSelectedBrand !== undefined) {
      setSelectedBrand(propSelectedBrand);
      if (propSelectedBrand !== 'all') setShowPhoneModels(true);
    }
  }, [propSelectedBrand]);

  // Sync with propSelectedCategory when changed externally
  useEffect(() => {
    if (propSelectedCategory !== undefined) {
      setSelectedCategory(propSelectedCategory);
    }
  }, [propSelectedCategory]);
  
  // View mode: 'grid' or 'stream' (ketma-ket pastga suriluvchi oqim)
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('grid');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const streamContainerRef = useRef<HTMLDivElement>(null);

  // Keep the catalog filter complete for every brand supported by PhoneBrand.
  const brands = [
    { id: 'all', label: 'Barcha brendlar' },
    { id: 'Apple', label: 'Apple (iPhone)' },
    { id: 'Samsung', label: 'Samsung' },
    { id: 'Redmi', label: 'Redmi' },
    { id: 'Realme', label: 'Realme' },
    { id: 'Nokia', label: 'Nokia' },
    { id: 'Asus', label: 'Asus (ROG)' },
    { id: 'Vivo', label: 'Vivo' },
    { id: 'Spark', label: 'Tecno Spark' },
    { id: 'Infinix', label: 'Infinix' },
    { id: 'Honor', label: 'Honor' },
    { id: 'Huawei', label: 'Huawei' },
    { id: 'Xiaomi', label: 'Xiaomi' },
    { id: 'Google', label: 'Google Pixel' },
    { id: 'OnePlus', label: 'OnePlus' },
    { id: 'Boshqa', label: 'Boshqa brendlar' },
  ];
  const otherBrandGroups = [
    { id: 'tablets', title: 'Planshet brendlari', brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Honor', 'OnePlus'] },
    { id: 'computers', title: 'Kompyuter brendlari', brands: ['Apple', 'Samsung', 'Asus', 'Huawei', 'Xiaomi', 'Google'] },
    { id: 'laptops', title: 'Noutbuk brendlari', brands: ['Apple', 'Samsung', 'Asus', 'Huawei', 'Xiaomi', 'Honor'] },
    { id: 'watches', title: 'Smartwatch brendlari', brands: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Honor', 'OnePlus'] },
    { id: 'chargers', title: 'Zaryadnik brendlari', brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Asus', 'Infinix'] },
    { id: 'headphones', title: 'Naushnik brendlari', brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Honor', 'Asus', 'OnePlus'] },
  ];
  const [openOtherBrandGroup, setOpenOtherBrandGroup] = useState<string | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <Smartphone className="w-4 h-4" />,
    flagship: <Sparkles className="w-4 h-4 text-amber-400" />,
    foldable: <Layers className="w-4 h-4 text-cyan-400" />,
    camera: <Camera className="w-4 h-4 text-rose-400" />,
    gaming: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
    budget: <Tag className="w-4 h-4 text-indigo-400" />,
  };

  const conditions = [
    { id: 'all', label: 'Barcha holat' },
    { id: 'new', label: 'Yangi' },
    { id: 'ideal', label: 'Ideal' },
    { id: 'good', label: 'Yaxshi' },
  ];

  const storageOptions: StorageOption[] = ['128GB', '256GB', '512GB', '1TB'];

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: phones.length };
    PHONE_CATEGORIES.forEach((c) => {
      if (c.id !== 'all') {
        counts[c.id] = phones.filter((p) => p.category === c.id).length;
      }
    });
    return counts;
  }, [phones]);

  const filteredPhones = useMemo(() => {
    return phones
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const searchable = [p.title, p.model, p.brand, p.series, p.storage, p.color, p.city, p.description]
            .filter(Boolean).join(' ').toLocaleLowerCase();
          if (!searchable.includes(q)) return false;
        }

        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (selectedCondition !== 'all' && p.condition !== selectedCondition) return false;
        if (selectedStorage !== 'all' && p.storage !== selectedStorage) return false;
        if (selectedCity !== 'Barcha viloyatlar' && p.city !== selectedCity) return false;
        if (minimumPrice && p.priceUsd < Number(minimumPrice)) return false;
        if (maximumPrice && p.priceUsd > Number(maximumPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.priceUsd - b.priceUsd;
        if (sortBy === 'price_desc') return b.priceUsd - a.priceUsd;
        if (sortBy === 'battery') return (b.batteryHealth || 0) - (a.batteryHealth || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [phones, searchQuery, selectedCategory, selectedBrand, selectedCondition, selectedStorage, selectedCity, minimumPrice, maximumPrice, sortBy]);

  // Ketma-ket pastga avtomatik surilish (Auto-slide down in stream mode)
  useEffect(() => {
    if (!isAutoScrolling || viewMode !== 'stream' || filteredPhones.length === 0) return;

    const interval = setInterval(() => {
      setHighlightedIndex((prev) => {
        const next = (prev + 1) % filteredPhones.length;
        const targetEl = document.getElementById(`stream-phone-${filteredPhones[next]?.id}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, viewMode, filteredPhones]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setShowPhoneModels(false);
    setSelectedCondition('all');
    setSelectedStorage('all');
    setSelectedCity('Barcha viloyatlar');
    setMinimumPrice('');
    setMaximumPrice('');
    setSortBy('newest');
    onSelectBrand?.('all');
    onSelectCategory?.('all');
    onSelectCity?.('Barcha viloyatlar');
  };

  const isFiltered = searchQuery !== '' || selectedCategory !== 'all' || selectedBrand !== 'all' || selectedCondition !== 'all' || selectedStorage !== 'all' || selectedCity !== 'Barcha viloyatlar' || minimumPrice !== '' || maximumPrice !== '';

  // Smooth scroll down to next item in stream mode
  const handleScrollToNextPhone = () => {
    if (filteredPhones.length === 0) return;
    const nextIdx = (highlightedIndex + 1) % filteredPhones.length;
    setHighlightedIndex(nextIdx);
    const targetEl = document.getElementById(`stream-phone-${filteredPhones[nextIdx]?.id}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleApplyFilters = () => {
    setIsModalOpen(false);
    const el = document.getElementById('catalog-content-area');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 
        CLEAN, AKURAT HEADER: 
        All the cluttered filter pills (search, category tags, brand tags, condition, storage, city) 
        have been removed from the main screen and placed INSIDE the "Smartfonlar katalogi" button!
      */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Smartfonlar
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.08] text-amber-300 font-mono font-extrabold border border-white/10">
              {filteredPhones.length} ta smartfon topildi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            O'zbekiston bo'yicha kafolatlangan flagman va hamyonbop modellar
          </p>
        </div>

        {/* CONTROLS RIGHT SIDE */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* View mode toggle (Katakcha / Pastga oqim) */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode('grid')}
              title="Katakcha ko'rinishi"
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Katakcha</span>
            </button>

            <button
              onClick={() => {
                setViewMode('stream');
                setIsAutoScrolling(true);
              }}
              title="Ketma-ket pastga suriladigan oqim"
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'stream'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Pastga oqim</span>
            </button>
          </div>

          {/* Quick Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="newest" className="bg-[#12151e] text-white">Yangi e'lonlar</option>
            <option value="price_asc" className="bg-[#12151e] text-white">Arzondan qimmatga</option>
            <option value="price_desc" className="bg-[#12151e] text-white">Qimmatdan arzonga</option>
            <option value="battery" className="bg-[#12151e] text-white">Batareya quvvati</option>
          </select>

          {/* 
            THE YELLOW BUTTON: "Smartfonlar katalogi →" 
            All the filters, categories, brands, condition, storage and search live cleanly INSIDE this button!
          */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-400/25 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
            <span>Filtrlar</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
            )}
          </motion.button>

        </div>
      </div>

      {/* DISCREET ACTIVE FILTERS STRIP (Only appears when filters are actually active) */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 py-1 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Faol filtrlar:</span>

          {searchQuery && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center gap-1.5 font-bold">
              <span>Qidiruv: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center gap-1.5 font-bold">
              <span>Turi: {selectedCategory}</span>
              <button onClick={() => { setSelectedCategory('all'); onSelectCategory?.('all'); }} className="hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrand !== 'all' && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center gap-1.5 font-bold">
              <span>Brend: {selectedBrand}</span>
              <button onClick={() => { setSelectedBrand('all'); onSelectBrand?.('all'); }} className="hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCondition !== 'all' && (
            <span className="px-2.5 py-1 rounded-xl bg-white/[0.08] border border-white/15 text-slate-200 flex items-center gap-1.5 font-bold">
              <span>Holat: {selectedCondition}</span>
              <button onClick={() => setSelectedCondition('all')} className="hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedStorage !== 'all' && (
            <span className="px-2.5 py-1 rounded-xl bg-white/[0.08] border border-white/15 text-slate-200 flex items-center gap-1.5 font-bold">
              <span>Xotira: {selectedStorage}</span>
              <button onClick={() => setSelectedStorage('all')} className="hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCity !== 'Barcha viloyatlar' && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 font-bold">
              <span>Manzil: {selectedCity}</span>
              <button onClick={() => { setSelectedCity('Barcha viloyatlar'); onSelectCity?.('Barcha viloyatlar'); }} className="hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold ml-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Tozalash</span>
          </button>
        </div>
      )}

      <div id="catalog-content-area" />

      {/* 
        STREAM MODE: Ketma-ket pastga suriluvchi oqim rejimi 
      */}
      {showPhoneModels && viewMode === 'stream' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0f121b] border border-amber-400/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-white">
                Ketma-ket pastga surilish rejimi: <span className="text-amber-300">{filteredPhones.length} ta smartfon</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isAutoScrolling
                    ? 'bg-amber-400 text-black'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoScrolling ? 'Avto-surilish to\'xtatish' : 'Avto-surilishni yoqish'}</span>
              </button>

              <button
                onClick={handleScrollToNextPhone}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Keyingisiga pastga surish</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Vertical Stream List with smooth downward cascade */}
          <div ref={streamContainerRef} className="space-y-4">
            {filteredPhones.map((phone, idx) => (
              <motion.div
                id={`stream-phone-${phone.id}`}
                key={phone.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                  highlightedIndex === idx
                    ? 'bg-[#151926] border-amber-400 shadow-xl shadow-amber-400/10'
                    : 'bg-[#10131d] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => onSelectPhone(phone)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black/50 border border-white/10 p-1 shrink-0 overflow-hidden cursor-pointer"
                    >
                      <img src={phone.images[0]} alt={phone.title} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
                          {phone.brand}
                        </span>
                        <span className="text-xs text-amber-400 font-medium">
                          📍 {phone.city}
                        </span>
                      </div>
                      <h3 
                        onClick={() => onSelectPhone(phone)}
                        className="text-base sm:text-lg font-black text-white hover:text-amber-400 cursor-pointer mt-1"
                      >
                        {phone.title}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                        <span>Xotira: {phone.storage}</span>
                        <span>•</span>
                        <span>Holati: {phone.condition}</span>
                        <span>•</span>
                        <span>Batareya: {phone.batteryHealth}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-lg font-black font-mono text-amber-400">
                        {currency === 'USD' ? `$${phone.priceUsd}` : `${phone.priceUzs.toLocaleString()} so'm`}
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(phone)}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      Savatga
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 
        GRID MODE: Clean, spacious, premium phones grid 
      */}
      {showPhoneModels && viewMode === 'grid' && (
        <>
          {filteredPhones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPhones.map((phone) => (
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-xl font-black text-white">
                Hech qanday telefon topilmadi
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Tanlangan parametrlar bo'yicha e'lon mavjud emas. Filtrlarni tozalab qaytadan urinib ko'ring.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Barcha filtrlarni tozalash
              </button>
            </div>
          )}
        </>
      )}
      {!showPhoneModels && (
        <div className="py-10 text-center text-sm font-semibold text-slate-400">
          Telefon modellarini ko‘rish uchun “Barcha brendlar” tugmasini bosing.
        </div>
      )}

      {/* 
        THE COMPLETE "SMARTFONLAR KATALOGI" MODAL / DRAWER
        Contains every single filter requested:
        Search, Telefon turlari (categories), Brendlar (11+ brands), Holat, Xotira, Manzil (Viloyatlar), and Sorting.
      */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#0f121d] border border-amber-400/40 rounded-3xl shadow-2xl shadow-black/95 z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#121524]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                    <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Smartfonlar katalogi va filtrlash
                    </h3>
                    <p className="text-xs text-slate-400">
                      Barcha turlar, brendlar, xotira va manzil parametrlari
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filter Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
                
                {/* 1. Qidiruv input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Qidiruv (Model yoki nomi)
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Masalan: iPhone 18, Galaxy S25, ROG 8, Pura 70, Spark..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Telefon Turlari (Categories) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Telefon turlari</span>
                    <span className="text-[11px] text-amber-400 normal-case font-bold">
                      {selectedCategory === 'all' ? 'Barchasi' : selectedCategory.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PHONE_CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      const count = categoryCounts[cat.id] || 0;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            onSelectCategory?.(cat.id);
                          }}
                          className={`p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-400 text-black border-amber-400 font-black shadow-md shadow-amber-400/20'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={isActive ? 'text-black' : ''}>
                              {categoryIcons[cat.id]}
                            </span>
                            <span className="text-xs font-bold truncate">{cat.label}</span>
                          </div>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                            isActive ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-slate-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Katalog bo'limlari va har birining brendlari */}
                <div className="space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Telefon brendlari
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                      <button
                        type="button"
                        aria-expanded={showBrandOptions}
                        onClick={() => setShowBrandOptions((open) => !open)}
                        className="w-full p-3 flex items-center justify-between text-left text-sm font-bold text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                      >
                        <span>Telefon brendlari</span>
                        <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${showBrandOptions ? 'rotate-180' : ''}`} />
                      </button>
                      {showBrandOptions && (
                        <div className="p-3 pt-0 flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBrand('all');
                              setShowPhoneModels(true);
                              onSelectBrand?.('all');
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-amber-400 text-black border-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                          >
                            Barcha brendlar
                          </button>
                          {brands.filter((brand) => brand.id !== 'all').map((brand) => (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() => {
                                setSelectedBrand(brand.id);
                                setShowPhoneModels(true);
                                onSelectBrand?.(brand.id);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                selectedBrand === brand.id
                                  ? 'bg-white text-black border-white shadow-md'
                                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]'
                              }`}
                            >
                              {brand.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {otherBrandGroups.map((group) => {
                      const isOpen = openOtherBrandGroup === group.id;
                      return (
                        <div key={group.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setOpenOtherBrandGroup(isOpen ? null : group.id)}
                            className="w-full p-3 flex items-center justify-between text-left text-sm font-bold text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                          >
                            <span>{group.title}</span>
                            <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="p-3 pt-0 flex flex-wrap gap-1.5">
                              {group.brands.map((brand) => (
                                <span key={brand} className="px-3 py-1.5 rounded-xl text-xs font-bold border border-white/[0.08] bg-white/[0.04] text-slate-300">
                                  {brand}
                                </span>
                              ))}
                              <p className="w-full mt-1 text-[11px] text-slate-500">
                                Bu bo‘lim uchun mahsulotlar katalogga qo‘shilmoqda.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Holat va Xotira */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Condition */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Holati
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {conditions.map((c) => {
                        const isActive = selectedCondition === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedCondition(c.id)}
                            className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                              isActive
                                ? 'bg-amber-400 text-black border-amber-400'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Xotira hajmi
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['all', ...storageOptions].map((st) => {
                        const isActive = selectedStorage === st;
                        return (
                          <button
                            key={st}
                            onClick={() => setSelectedStorage(st)}
                            className={`p-2 rounded-xl text-xs font-mono font-bold border text-center transition-all cursor-pointer ${
                              isActive
                                ? 'bg-amber-400 text-black border-amber-400'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                            }`}
                          >
                            {st === 'all' ? 'Barcha xotira' : st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Narx oralig'i */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Narx oralig'i (USD)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input aria-label="Eng kam narx (USD)" type="number" min="0" inputMode="numeric" placeholder="Dan" value={minimumPrice} onChange={(e) => setMinimumPrice(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" />
                    <input aria-label="Eng yuqori narx (USD)" type="number" min="0" inputMode="numeric" placeholder="Gacha" value={maximumPrice} onChange={(e) => setMaximumPrice(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" />
                  </div>
                </div>

                {/* 5. Manzil / Viloyat tanlash */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Manzil / Viloyat</span>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCity('Barcha viloyatlar');
                        onSelectCity?.('Barcha viloyatlar');
                      }}
                      className="text-amber-400 lowercase hover:underline font-bold"
                    >
                      barcha viloyatlar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                    {CITIES_OF_UZBEKISTAN.map((city) => {
                      const isSel = selectedCity === city;
                      return (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            onSelectCity?.(city);
                          }}
                          className={`p-2 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                            isSel
                              ? 'bg-amber-400 text-black border-amber-400 font-bold'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/[0.06]'
                          }`}
                        >
                          <span className="truncate">{city}</span>
                          {isSel && <Check className="w-3 h-3 text-black shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Modal Footer Bar */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#121524] flex items-center justify-between gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Filtrlarni tozalash</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyFilters}
                  className="px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-400/25 cursor-pointer"
                >
                  <span>Natijalarni ko'rsatish ({filteredPhones.length} ta)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
