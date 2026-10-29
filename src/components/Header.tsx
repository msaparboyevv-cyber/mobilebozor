import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Menu,
  X,
  ShoppingBag, 
  PlusCircle, 
  Heart,
  House,
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
  SlidersHorizontal,
  UserRound,
  CalendarDays,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES_OF_UZBEKISTAN } from '../data/mockPhones';
import { OrderDetails, PhoneCategory } from '../types';

interface HeaderProps {
  activeTab: 'buy' | 'sell' | 'tradein' | 'compare';
  setActiveTab: (tab: 'buy' | 'sell' | 'tradein' | 'compare') => void;
  cartCount: number;
  favoritesCount: number;
  orders: OrderDetails[];
  openCart: () => void;
  openWishlist: () => void;
  openSearch: () => void;
  openHome: () => void;
  openSellModal: () => void;
  currency: 'UZS' | 'USD';
  toggleCurrency: () => void;
  compareCount: number;
  onOpenAdmin: () => void;
  onOpenAccount: (mode: 'login' | 'register') => void;
  accountName?: string | null;
  accountSurname?: string | null;
  accountPhone?: string | null;
  onLogoutAccount: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  cityPhoneCounts?: Record<string, number>;
  selectedBrand?: string;
  availableBrands?: string[];
  onSelectBrand?: (brand: string) => void;
  selectedCategory?: PhoneCategory | 'all';
  onSelectCategory?: (category: PhoneCategory | 'all') => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  favoritesCount,
  orders,
  openCart,
  openWishlist,
  openSearch,
  openHome,
  openSellModal,
  currency,
  toggleCurrency,
  compareCount,
  onOpenAdmin,
  onOpenAccount,
  accountName = null,
  accountSurname = null,
  accountPhone = null,
  onLogoutAccount,
  selectedCity,
  onSelectCity,
  cityPhoneCounts = {},
  selectedBrand = 'all',
  availableBrands = [],
  onSelectBrand,
  selectedCategory = 'all',
  onSelectCategory,
  searchQuery = '',
  onSearchQueryChange,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerLocationOpen, setIsDrawerLocationOpen] = useState(false);
  const [isDrawerOrdersOpen, setIsDrawerOrdersOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const brandSubRef = useRef<HTMLDivElement>(null);
  const categorySubRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [categoryDropdownStyle, setCategoryDropdownStyle] = useState<React.CSSProperties>({});

  const updateCategoryDropdownPosition = useCallback(() => {
    const anchor = categorySubRef.current?.querySelector('button');
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const top = rect.bottom + 8;
    setCategoryDropdownStyle({
      position: 'fixed',
      left,
      top,
      width,
      maxHeight: `calc(100dvh - ${top + 12}px)`,
    });
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (brandSubRef.current && !brandSubRef.current.contains(e.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
      if (
        categorySubRef.current
        && !categorySubRef.current.contains(e.target as Node)
        && !categoryDropdownRef.current?.contains(e.target as Node)
      ) {
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

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDrawerOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isCategoryDropdownOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCategoryDropdownOpen(false);
    };
    updateCategoryDropdownPosition();
    window.addEventListener('resize', updateCategoryDropdownPosition);
    window.addEventListener('scroll', updateCategoryDropdownPosition, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', updateCategoryDropdownPosition);
      window.removeEventListener('scroll', updateCategoryDropdownPosition, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryDropdownOpen, updateCategoryDropdownPosition]);

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
    } else if (tab === 'buy') {
      setActiveTab('buy');
      setTimeout(() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }), 80);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  ].filter((brand) => availableBrands.includes(brand.key));

  const phoneTypesList: { id: PhoneCategory | 'all'; label: string; icon: typeof Sparkles; color: string }[] = [
    { id: 'flagship', label: 'Flagman', icon: Sparkles, color: 'text-amber-400' },
    { id: 'gaming', label: "O'yin (Gaming)", icon: Gamepad2, color: 'text-emerald-400' },
    { id: 'camera', label: 'Kamera', icon: Camera, color: 'text-rose-400' },
    { id: 'foldable', label: 'Bukiluvchi', icon: Layers, color: 'text-cyan-400' },
    { id: 'budget', label: 'Hamyonbop', icon: Tag, color: 'text-indigo-400' },
    { id: 'all', label: 'Barcha turlar', icon: Smartphone, color: 'text-white' },
  ];

  const normalizedAccountPhone = accountPhone?.replace(/\D/g, '');
  const accountOrders = normalizedAccountPhone
    ? orders.filter((order) => order.customerPhone.replace(/\D/g, '') === normalizedAccountPhone)
    : [];
  const orderStatusLabels: Record<OrderDetails['status'], string> = {
    confirmed: 'Tasdiqlandi',
    processing: 'Jarayonda',
    shipped: 'Yuborildi',
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0b0d13]/95 backdrop-blur-xl border-b border-white/[0.08]">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="w-full flex flex-wrap items-center gap-1 sm:gap-2">
            <div className="order-last flex basis-full min-w-0 items-center gap-1 sm:order-none sm:basis-auto sm:flex-1 sm:gap-2">
              <div className="relative min-w-0 flex-1 sm:min-w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => onSearchQueryChange?.(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setActiveTab('buy');
                      setTimeout(() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }), 80);
                    }
                  }}
                  placeholder="Telefon brendi yoki turini qidiring..."
                  aria-label="Telefon brendi yoki turini qidirish"
                  className="min-h-11 w-full rounded-xl border border-white/[0.12] bg-white/[0.05] py-2 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:border-amber-400/60 focus:outline-none"
                />
              </div>

              <div ref={locationRef} className="relative shrink-0">
            <button
              type="button"
              aria-label={`Manzilni tanlash. Hozirgi manzil: ${selectedCity}`}
              aria-expanded={isLocationDropdownOpen}
              aria-haspopup="true"
              title={`Manzil: ${selectedCity}`}
              onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border transition-all shadow-sm ${
                isLocationDropdownOpen || selectedCity !== 'Barcha viloyatlar'
                  ? 'bg-amber-400/15 border-amber-400/80 text-white shadow-amber-500/10'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-slate-200'
              }`}
            >
              <MapPin className="w-5 h-5 text-amber-400" />
            </button>

            {/* Dropdown panel for location */}
            <AnimatePresence>
              {isLocationDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-amber-400/40 bg-[#0f121d]/98 p-3 shadow-2xl shadow-black/90 backdrop-blur-2xl sm:w-[380px]"
                >
                  <div className="relative mb-2.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Shahar yoki viloyatni qidiring..."
                      autoFocus
                      className="w-full min-h-11 pl-8 pr-7 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-base text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
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
          </div>

          {/* Admin panel */}
          <button type="button" onClick={onOpenAdmin} title="Admin kirish" aria-label="Admin kirish" className="ml-0.5 hidden min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-emerald-400 sm:flex">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
          </div>

        {/* BOZORNI TAGI: Telefon brendlari va Telefon turlari */}
        <div className="border-t border-white/[0.08] bg-[#0c0e15]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto space-y-2">

          <div className="relative flex flex-wrap items-center gap-2 overflow-visible sm:gap-2.5">
            {/* Telefon brendlari (11+) */}
            <div ref={brandSubRef} className="relative">
              <button
                type="button"
                aria-expanded={isBrandDropdownOpen}
                aria-haspopup="true"
                onClick={() => {
                  setIsBrandDropdownOpen(prev => !prev);
                  setIsCategoryDropdownOpen(false);
                }}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold shadow-sm transition-all sm:px-3.5 sm:text-sm ${
                  isBrandDropdownOpen || (selectedBrand && selectedBrand !== 'all')
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                    : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.12] text-white hover:border-amber-400/40'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Brendlar</span>
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
                    className="absolute left-0 right-auto top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-amber-400/30 bg-[#0f131e]/98 p-3 shadow-2xl shadow-black/95 backdrop-blur-2xl min-[334px]:left-[-6.625rem] sm:left-0 sm:w-80"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <span className="text-xs font-bold text-white">Barcha telefon brendlari:</span>
                      <button
                        onClick={() => setIsBrandDropdownOpen(false)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid max-h-[60vh] grid-cols-2 gap-1.5 overflow-y-auto pr-1 scrollbar-thin">
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
                            className={`flex min-h-11 items-center justify-between rounded-xl border p-2 text-left transition-all ${
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
                type="button"
                aria-expanded={isCategoryDropdownOpen}
                aria-haspopup="true"
                onClick={() => {
                  if (!isCategoryDropdownOpen) updateCategoryDropdownPosition();
                  setIsCategoryDropdownOpen(prev => !prev);
                  setIsBrandDropdownOpen(false);
                }}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold shadow-sm transition-all sm:px-3.5 sm:text-sm ${
                  isCategoryDropdownOpen || (selectedCategory && selectedCategory !== 'all')
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                    : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.12] text-white hover:border-amber-400/40'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Turlar</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Telefon turlari ochiluvchi darchasi */}
              {createPortal(
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      ref={categoryDropdownRef}
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      style={categoryDropdownStyle}
                      className="z-[60] overflow-y-auto overscroll-contain rounded-2xl border border-amber-400/40 bg-[#0f131e] p-3 shadow-2xl shadow-black/95"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black text-white uppercase tracking-wider">Telefon turlari:</span>
                        </div>
                        <button
                          onClick={() => setIsCategoryDropdownOpen(false)}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-1.5">
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
                              className={`flex min-h-11 min-w-0 items-center justify-between rounded-xl border p-2 text-left transition-all ${
                                isCur
                                  ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-md shadow-amber-400/20'
                                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-slate-200'
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <Icon className={`w-4 h-4 shrink-0 ${isCur ? 'text-black' : t.color}`} />
                                <span className="break-words text-left text-xs font-bold leading-tight [overflow-wrap:anywhere]">{t.label}</span>
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
                          className="min-h-11 w-full rounded-lg px-2 text-[11px] font-bold text-amber-400 hover:bg-white/[0.05] hover:underline cursor-pointer"
                        >
                          Barcha turlarni ko'rsatish
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body,
              )}
            </div>

          </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Pastki navigatsiya"
        className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-6 items-center border-t border-white/10 bg-[#0b0d13]/95 px-1 pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {[
          { label: 'Asosiy menyu', title: 'Asosiy menyu', onClick: () => setIsDrawerOpen(true), icon: <Menu className="h-5 w-5 text-amber-900 stroke-[2.5]" aria-hidden="true" /> },
          { label: 'Asosiy bo‘limga qaytish', title: 'Asosiy bo‘limga qaytish', onClick: () => { setIsDrawerOpen(false); openHome(); }, icon: <House className="h-5 w-5" aria-hidden="true" /> },
          { label: `Istaklarni ochish, ${favoritesCount} ta telefon`, title: 'Istaklar', onClick: openWishlist, icon: <Heart className="h-5 w-5" aria-hidden="true" /> },
          { label: `Savatni ochish, ${cartCount} ta mahsulot`, title: 'Savat', onClick: openCart, icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" /> },
          { label: "E'lon berish", title: "E'lon berish", onClick: openSellModal, icon: <PlusCircle className="h-5 w-5" aria-hidden="true" /> },
          { label: 'Qidiruvni ochish', title: 'Qidiruv', onClick: openSearch, icon: <Search className="h-5 w-5" aria-hidden="true" /> },
        ].map((item) => (
          <div key={item.label} className="flex min-w-0 justify-center">
            <button
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              title={item.title}
              className="inline-flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border border-amber-200/70 bg-amber-400 text-black shadow-xl shadow-black/40 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {item.icon}
            </button>
          </div>
        ))}
      </nav>

      {/* 3 TA CHIZIQCHA DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Drawer Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Asosiy menyu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.12, ease: 'easeOut' }}
              className="relative w-full max-w-sm sm:max-w-md bg-[#0d1019] border-r border-white/10 h-full flex flex-col justify-between z-10 shadow-2xl shadow-black/95 overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                    <Smartphone className="w-4 h-4 stroke-[2.5]" />
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

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleCurrency}
                    aria-label={`Valyutani almashtirish, hozir ${currency}`}
                    className="min-h-11 rounded-xl border border-white/10 bg-white/[0.08] px-3 text-xs font-mono font-bold text-amber-400 transition-colors hover:bg-white/[0.12]"
                  >
                    {currency === 'UZS' ? "UZS (so'm)" : 'USD ($)'}
                  </button>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Menyuni yopish"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content inside Drawer */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin">
                
                {/* 1. Manzilni Tanlash */}
                <div className="space-y-2">
                  <button
                    type="button"
                    aria-expanded={isDrawerLocationOpen}
                    onClick={() => setIsDrawerLocationOpen((open) => !open)}
                    className="w-full flex items-center justify-between text-xs font-extrabold text-amber-400 uppercase tracking-wider p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>Manzil</span>
                    </span>
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] text-slate-400 normal-case font-medium truncate max-w-40">
                        {selectedCity}
                      </span>
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isDrawerLocationOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {isDrawerLocationOpen && <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
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
                  </div>}
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    aria-expanded={isDrawerOrdersOpen}
                    onClick={() => setIsDrawerOrdersOpen((open) => !open)}
                    className="w-full flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-left transition-colors hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                      <ClipboardList className="h-4 w-4" />
                      Buyurtmalarim
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">{accountOrders.length}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isDrawerOrdersOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {isDrawerOrdersOpen && (
                    <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2.5">
                      {!normalizedAccountPhone ? (
                        <div className="space-y-2 text-center">
                          <p className="text-xs leading-relaxed text-slate-400">Buyurtmalaringizni ko‘rish uchun telefon raqamingiz ulangan akkauntga kiring.</p>
                          <button
                            type="button"
                            onClick={() => { setIsDrawerOpen(false); onOpenAccount('login'); }}
                            className="min-h-10 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-black hover:bg-amber-300"
                          >
                            Akkauntga kirish
                          </button>
                        </div>
                      ) : accountOrders.length === 0 ? (
                        <p className="py-2 text-center text-xs text-slate-400">Telefon raqamingizga bog‘langan buyurtmalar topilmadi.</p>
                      ) : (
                        <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                          {accountOrders.map((order) => {
                            const orderDate = new Date(order.createdAt);
                            const dateLabel = Number.isNaN(orderDate.getTime())
                              ? ''
                              : orderDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
                            return (
                              <article key={order.id} className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0d1019] p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-bold text-white">{order.id}</p>
                                    {dateLabel && <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays className="h-3 w-3" />{dateLabel}</p>}
                                  </div>
                                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                                    order.status === 'shipped'
                                      ? 'bg-emerald-400/10 text-emerald-300'
                                      : order.status === 'processing'
                                        ? 'bg-amber-400/10 text-amber-300'
                                        : 'bg-sky-400/10 text-sky-300'
                                  }`}>
                                    {orderStatusLabels[order.status]}
                                  </span>
                                </div>
                                <p className="mt-2 break-words text-[11px] leading-relaxed text-slate-300">
                                  {order.items.map((item) => `${item.phone.model} ×${item.quantity}`).join(', ')}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2">
                                  <span className="truncate text-[10px] text-slate-400">{order.city}</span>
                                  <span className="shrink-0 text-xs font-extrabold text-amber-300">
                                    {currency === 'UZS' ? `${order.totalUzs.toLocaleString('uz-UZ')} so‘m` : `$${order.totalUsd.toLocaleString('uz-UZ')}`}
                                  </span>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
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

              </div>

              {/* Drawer account and footer actions */}
              <div className="space-y-2 px-4 pt-4 sm:px-5 border-t border-white/[0.08] bg-[#090b11]">
                <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <UserRound className="h-4 w-4" />
                  Shaxsingiz
                </h2>
                {accountName ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-bold text-white">{[accountName, accountSurname].filter(Boolean).join(' ')}</p>
                      <p className="truncate text-xs text-slate-300">{accountPhone || 'Telefon raqami kiritilmagan'}</p>
                    </div>
                    <button type="button" onClick={() => { setIsDrawerOpen(false); onLogoutAccount(); }} className="shrink-0 text-xs font-semibold text-slate-300 hover:text-amber-300">Chiqish</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setIsDrawerOpen(false); onOpenAccount('login'); }} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-bold text-white hover:border-amber-400/60">Kirish</button>
                    <button type="button" onClick={() => { setIsDrawerOpen(false); onOpenAccount('register'); }} className="rounded-xl bg-amber-400 px-3 py-2.5 text-sm font-extrabold text-black hover:bg-amber-300">Ro‘yxatdan o‘tish</button>
                  </div>
                )}
              </div>

              {/* Drawer Bottom Bar: Valyuta & Admin */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#090b11] flex items-center justify-between gap-3">
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
