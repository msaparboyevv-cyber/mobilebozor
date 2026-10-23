import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu,
  X,
  ShoppingBag, 
  PlusCircle, 
  Smartphone, 
  Check, 
  MapPin, 
  ChevronDown, 
  ChevronRight,
  Search, 
  RefreshCw,
  ArrowLeftRight,
  Sparkles,
  Gamepad2,
  Camera,
  Layers,
  Tag,
  ShieldCheck,
  LayoutGrid,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES_OF_UZBEKISTAN } from '../data/mockPhones';

interface HeaderProps {
  activeTab: 'buy' | 'sell' | 'tradein' | 'compare';
  setActiveTab: (tab: 'buy' | 'sell' | 'tradein' | 'compare') => void;
  cartCount: number;
  openCart: () => void;
  openSellModal: () => void;
  currency: 'UZS' | 'USD';
  toggleCurrency: () => void;
  compareCount: number;
  onOpenAdmin: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  cityPhoneCounts?: Record<string, number>;
  selectedBrand?: string;
  onSelectBrand?: (brand: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenCatalogModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openSellModal,
  currency,
  toggleCurrency,
  compareCount,
  onOpenAdmin,
  selectedCity,
  onSelectCity,
  cityPhoneCounts = {},
  selectedBrand = 'all',
  onSelectBrand,
  selectedCategory = 'all',
  onSelectCategory,
  onOpenCatalogModal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const brandSubRef = useRef<HTMLDivElement>(null);
  const categorySubRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (brandSubRef.current && !brandSubRef.current.contains(e.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
      if (categorySubRef.current && !categorySubRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const filteredCities = CITIES_OF_UZBEKISTAN.filter((c) =>
    c.toLowerCase().includes(locationSearch.toLowerCase().trim())
  );

  const handleCityPick = (city: string) => {
    onSelectCity(city);
    setIsLocationDropdownOpen(false);
    setLocationSearch('');
  };

  const handleDrawerNav = (tab: 'buy' | 'sell' | 'tradein' | 'compare') => {
    setIsDrawerOpen(false);
    if (tab === 'sell') {
      openSellModal();
    } else if (tab === 'buy' && onOpenCatalogModal) {
      setActiveTab('buy');
      onOpenCatalogModal();
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBrandPick = (brand: string) => {
    setIsDrawerOpen(false);
    if (onSelectBrand) {
      onSelectBrand(brand);
    }
    setActiveTab('buy');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCategoryPick = (cat: string) => {
    setIsDrawerOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setActiveTab('buy');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const brandList = [
    { name: 'Apple (iPhone)', key: 'Apple' },
    { name: 'Samsung', key: 'Samsung' },
    { name: 'Redmi', key: 'Redmi' },
    { name: 'Realme', key: 'Realme' },
    { name: 'Nokia', key: 'Nokia' },
    { name: 'Asus (ROG)', key: 'Asus' },
    { name: 'Vivo', key: 'Vivo' },
    { name: 'Tecno Spark', key: 'Spark' },
    { name: 'Infinix', key: 'Infinix' },
    { name: 'Honor', key: 'Honor' },
    { name: 'Huawei', key: 'Huawei' },
    { name: 'Xiaomi', key: 'Xiaomi' },
    { name: 'Google Pixel', key: 'Google' },
    { name: 'OnePlus', key: 'OnePlus' },
    { name: 'Boshqa brendlar', key: 'Boshqa' },
  ];

  const phoneTypesList = [
    { id: 'flagship', label: 'Flagman', icon: Sparkles, color: 'text-amber-400' },
    { id: 'gaming', label: "O'yin (Gaming)", icon: Gamepad2, color: 'text-emerald-400' },
    { id: 'camera', label: 'Kamera', icon: Camera, color: 'text-rose-400' },
    { id: 'foldable', label: 'Bukiluvchi', icon: Layers, color: 'text-cyan-400' },
    { id: 'budget', label: 'Hamyonbop', icon: Tag, color: 'text-indigo-400' },
    { id: 'all', label: 'Barcha turlar', icon: Smartphone, color: 'text-white' },
  ];

  const currentCount = cityPhoneCounts[selectedCity] ?? cityPhoneCounts['Barcha viloyatlar'] ?? 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0b0d13]/95 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* LEFT: 3-line hamburger menu + Brand Logo */}
          <div className="flex items-center gap-3">
            {/* 3 ta chiziqcha (Hamburger Menu button) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Asosiy menyu"
              title="Menyu (3 ta chiziqcha)"
              className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-amber-400/15 border border-white/[0.1] hover:border-amber-400/40 text-amber-400 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </motion.button>

            {/* Brand Logo */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('buy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20 group-hover:shadow-amber-400/30 transition-all shrink-0">
                <Smartphone className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white hidden xs:inline sm:inline">
                Mobile<span className="text-amber-400">Bozor</span>
              </span>
            </motion.button>
          </div>

          {/* CENTER: Clean Location Selector Button */}
          <div ref={locationRef} className="relative flex-1 max-w-xs sm:max-w-sm mx-2">
            <button
              onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
              className={`w-full px-3 py-1.5 sm:py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer shadow-sm ${
                isLocationDropdownOpen || selectedCity !== 'Barcha viloyatlar'
                  ? 'bg-amber-400/15 border-amber-400/80 text-white shadow-amber-500/10'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 leading-none hidden sm:block">
                    Manzil
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white truncate flex items-center gap-1.5">
                    <span>{selectedCity}</span>
                    {selectedCity !== 'Barcha viloyatlar' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 hidden sm:inline">
                        {currentCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-amber-400 shrink-0 transition-transform duration-200 ${
                  isLocationDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown panel for location */}
            <AnimatePresence>
              {isLocationDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 sm:right-auto sm:w-[380px] top-full mt-2 z-50 p-3 rounded-2xl bg-[#0f121d]/98 backdrop-blur-2xl border border-amber-400/40 shadow-2xl shadow-black/90"
                >
                  <div className="relative mb-2.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Shahar yoki viloyatni qidiring..."
                      autoFocus
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    {locationSearch && (
                      <button
                        onClick={() => setLocationSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[11px] font-bold text-slate-400">
                    <span>Viloyatni tanlang:</span>
                    <button
                      onClick={() => handleCityPick('Barcha viloyatlar')}
                      className="text-amber-400 hover:underline"
                    >
                      Barchasi
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {filteredCities.map((city) => {
                      const isSel = selectedCity === city;
                      const count = cityPhoneCounts[city] ?? 0;
                      return (
                        <button
                          key={city}
                          onClick={() => handleCityPick(city)}
                          className={`p-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between gap-1 border ${
                            isSel
                              ? 'bg-amber-400 text-black border-amber-400 font-bold'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 border-white/[0.06]'
                          }`}
                        >
                          <span className="truncate">{city}</span>
                          <span
                            className={`text-[10px] px-1 rounded-full font-mono shrink-0 ${
                              isSel ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            {city === 'Barcha viloyatlar' ? cityPhoneCounts['Barcha viloyatlar'] || 'Hammasi' : count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Compact Clean Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Currency */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleCurrency}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono font-bold text-slate-200 transition-colors cursor-pointer"
            >
              {currency}
            </motion.button>

            {/* Cart with Badge */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              aria-label="Savat"
              className="relative p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-amber-300 text-black text-[11px] font-black rounded-full flex items-center justify-center font-mono shadow-md">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* Sell CTA button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openSellModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">E'lon berish</span>
              <span className="sm:hidden">Sotish</span>
            </motion.button>

            {/* Admin Discreet Trigger */}
            <button
              onClick={onOpenAdmin}
              title="Admin kirish"
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors cursor-pointer ml-0.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

        </div>

        {/* BOZORNI TAGI: Telefon brendlari va Telefon turlari */}
        <div className="border-t border-white/[0.08] bg-[#0c0e15]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5 overflow-x-auto scrollbar-none">
            {/* 1. Telefon brendlari (11+) */}
            <div ref={brandSubRef} className="relative">
              <button
                onClick={() => {
                  setIsBrandDropdownOpen(prev => !prev);
                  setIsCategoryDropdownOpen(false);
                }}
                className={`px-3.5 py-1.5 sm:py-2 rounded-xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 ${
                  isBrandDropdownOpen || (selectedBrand && selectedBrand !== 'all')
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                    : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.12] text-white hover:border-amber-400/40'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Telefon brendlari</span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  ({!selectedBrand || selectedBrand === 'all' ? '11+' : selectedBrand})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${
                  isBrandDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Brendlar ochiluvchi darchasi */}
              <AnimatePresence>
                {isBrandDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 p-3 rounded-2xl bg-[#0f131e]/98 backdrop-blur-2xl border border-amber-400/30 shadow-2xl shadow-black/95"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <span className="text-xs font-bold text-white">Barcha telefon brendlari:</span>
                      <button
                        onClick={() => setIsBrandDropdownOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                      {brandList.map((item) => {
                        const isCur = selectedBrand === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => {
                              if (onSelectBrand) onSelectBrand(item.key);
                              setIsBrandDropdownOpen(false);
                              setActiveTab('buy');
                              setTimeout(() => {
                                const el = document.getElementById('catalog-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }, 80);
                            }}
                            className={`p-2 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                              isCur
                                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-slate-300'
                            }`}
                          >
                            <span className="text-xs truncate">{item.name}</span>
                            {isCur && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.08] text-center">
                      <button
                        onClick={() => {
                          if (onSelectBrand) onSelectBrand('all');
                          setIsBrandDropdownOpen(false);
                        }}
                        className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer"
                      >
                        Barcha brendlarni ko'rsatish
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Telefon turlari (6 tur) */}
            <div ref={categorySubRef} className="relative">
              <button
                onClick={() => {
                  setIsCategoryDropdownOpen(prev => !prev);
                  setIsBrandDropdownOpen(false);
                }}
                className={`px-3.5 py-1.5 sm:py-2 rounded-xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 ${
                  isCategoryDropdownOpen || (selectedCategory && selectedCategory !== 'all')
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                    : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.12] text-white hover:border-amber-400/40'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Telefon turlari</span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  ({!selectedCategory || selectedCategory === 'all' ? '6 tur' : phoneTypesList.find(t => t.id === selectedCategory)?.label || selectedCategory})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Telefon turlari ochiluvchi darchasi */}
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-72 sm:w-80 p-3 rounded-2xl bg-[#0f131e]/98 backdrop-blur-2xl border border-amber-400/30 shadow-2xl shadow-black/95"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">Telefon turlari:</span>
                      </div>
                      <button
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {phoneTypesList.map((t) => {
                        const Icon = t.icon;
                        const isCur = selectedCategory === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              if (onSelectCategory) onSelectCategory(t.id);
                              setIsCategoryDropdownOpen(false);
                              setActiveTab('buy');
                              setTimeout(() => {
                                const el = document.getElementById('catalog-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }, 80);
                            }}
                            className={`p-2 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                              isCur
                                ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-md shadow-amber-400/20'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Icon className={`w-4 h-4 shrink-0 ${isCur ? 'text-black' : t.color}`} />
                              <span className="text-xs font-bold truncate">{t.label}</span>
                            </div>
                            {isCur && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.08] text-center">
                      <button
                        onClick={() => {
                          if (onSelectCategory) onSelectCategory('all');
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer"
                      >
                        Barcha turlarni ko'rsatish
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Katalog tugmasi (qator oxirida) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (onOpenCatalogModal) {
                  onOpenCatalogModal();
                } else {
                  setActiveTab('buy');
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
              <span>Katalog</span>
            </motion.button>

          </div>
        </div>
      </header>

      {/* 3 TA CHIZIQCHA DRAWER (Top-Left Hamburger Slide-out Menu) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-sm sm:max-w-md bg-[#0d1019] border-r border-white/10 h-full flex flex-col justify-between z-10 shadow-2xl shadow-black/95 overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                    <Smartphone className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white leading-tight">
                      Mobile<span className="text-amber-400">Bozor</span>
                    </div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Asosiy Menyu
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content inside Drawer */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin">
                
                {/* 1. Manzilni Tanlash */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>Manzil / Viloyat</span>
                    </span>
                    <span className="text-[11px] text-slate-400 lowercase font-medium">
                      {selectedCity}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                    <div className="text-xs text-slate-300 flex items-center justify-between">
                      <span>Joriy hudud:</span>
                      <span className="font-bold text-amber-400">{selectedCity}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                      {CITIES_OF_UZBEKISTAN.map((city) => {
                        const isCur = selectedCity === city;
                        const count = cityPhoneCounts[city] ?? 0;
                        return (
                          <button
                            key={city}
                            onClick={() => {
                              onSelectCity(city);
                              setIsDrawerOpen(false);
                            }}
                            className={`p-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                              isCur
                                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                                : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 border-white/[0.05]'
                            }`}
                          >
                            <span className="truncate">{city}</span>
                            <span className="text-[10px] opacity-75 font-mono">
                              {city === 'Barcha viloyatlar' ? 'Hammasi' : count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Asosiy Bo'limlar */}
                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                    Asosiy Xizmatlar
                  </div>

                  <button
                    onClick={() => handleDrawerNav('buy')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                      activeTab === 'buy'
                        ? 'bg-amber-400/15 border-amber-400/50 text-white font-bold'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06] text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">Smartfonlar katalogi</div>
                        <div className="text-[11px] text-slate-400">Barcha telefonlarni ko'rish va xarid</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      openSellModal();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0">
                        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">Telefon sotish (E'lon berish)</div>
                        <div className="text-[11px] text-slate-400">Tez va bepul e'lon joylashtirish</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleDrawerNav('tradein')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                      activeTab === 'tradein'
                        ? 'bg-amber-400/15 border-amber-400/50 text-white font-bold'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06] text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">Trade-in hisoblagich</div>
                        <div className="text-[11px] text-slate-400">15 daqiqada yangisiga almashtirish</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setActiveTab('compare');
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">Taqqoslash</div>
                        <div className="text-[11px] text-slate-400">Smartfon parametrlarini yonma-yon solishtirish</div>
                      </div>
                    </div>
                    {compareCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400 text-black font-black">
                        {compareCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      openCart();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">Savatcha</div>
                        <div className="text-[11px] text-slate-400">Buyurtma berishga tayyor smartfonlar</div>
                      </div>
                    </div>
                    {cartCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-black font-black">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* 3. Telefon Turlari (Kategoriya) */}
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                    Telefon Turlari
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'flagship', label: 'Flagman', icon: Sparkles, color: 'text-amber-400' },
                      { id: 'gaming', label: 'O\'yin (Gaming)', icon: Gamepad2, color: 'text-emerald-400' },
                      { id: 'camera', label: 'Kamera', icon: Camera, color: 'text-rose-400' },
                      { id: 'foldable', label: 'Bukiluvchi', icon: Layers, color: 'text-cyan-400' },
                      { id: 'budget', label: 'Hamyonbop', icon: Tag, color: 'text-indigo-400' },
                      { id: 'all', label: 'Barcha turlar', icon: Smartphone, color: 'text-white' },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryPick(cat.id)}
                          className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <Icon className={`w-4 h-4 ${cat.color} shrink-0`} />
                          <span className="text-xs font-bold text-slate-200 truncate">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Telefon Brendlari (11+ brend) */}
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                    Telefon Brendlari
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {brandList.map((b) => (
                      <button
                        key={b.key}
                        onClick={() => handleBrandPick(b.key)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-400 hover:text-black border border-white/[0.08] text-xs font-bold text-slate-200 transition-all cursor-pointer"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Bottom Bar: Valyuta & Admin */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#090b11] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Valyuta:</span>
                  <button
                    onClick={toggleCurrency}
                    className="px-3 py-1 rounded-lg bg-white/[0.08] text-xs font-mono font-bold text-amber-400 border border-white/10 cursor-pointer"
                  >
                    {currency === 'UZS' ? "UZS (so'm)" : 'USD ($)'}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenAdmin();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin kirish</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
