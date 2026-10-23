import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Layers, 
  Camera, 
  Gamepad2, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause,
  Smartphone,
  CheckCircle2,
  X,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { USD_TO_UZS_RATE } from '../data/mockPhones';

interface HeroProps {
  onBrowseClick: () => void;
  onSellClick: () => void;
  onTradeInClick: () => void;
  selectedBrand?: string;
  selectedCategory?: string;
}

interface ShowcasePhone {
  id: string;
  brand: string;
  model: string;
  subtitle: string;
  category: 'flagship' | 'foldable' | 'camera' | 'gaming' | 'budget';
  categoryLabel: string;
  categoryColor: string;
  specs: string[];
  priceUsd: number;
  image: string;
  badge: string;
}

export const Hero: React.FC<HeroProps> = ({
  onBrowseClick,
  onSellClick,
  selectedBrand = 'all',
  selectedCategory = 'all',
}) => {
  // All 11+ requested brands with authentic, dedicated smartphone photos (strictly distinct, no iPhone/Samsung for other brands)
  const SHOWCASE_PHONES: ShowcasePhone[] = [
    {
      id: 'phone-000-max',
      brand: 'Apple',
      model: 'iPhone 18 Pro Max',
      subtitle: 'Cosmic Titanium 512GB • A19 Pro',
      category: 'flagship',
      categoryLabel: 'Flagman',
      categoryColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
      specs: ['A19 Pro chip', '512GB Titan', '100% Batareya', 'UzIMEI bor'],
      priceUsd: 1590,
      image: '/src/assets/images/phone_iphone_titanium_1792582841706.jpg',
      badge: 'Yangi Avlod'
    },
    {
      id: 'phone-samsung-s25u',
      brand: 'Samsung',
      model: 'Galaxy S25 Ultra',
      subtitle: 'Titanium Silver Shadow 512GB • Snapdragon 8 Elite',
      category: 'flagship',
      categoryLabel: 'Flagman',
      categoryColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
      specs: ['Galaxy AI 2.0', '200MP sensor', 'S-Pen stilus', '16GB RAM'],
      priceUsd: 1300,
      image: '/src/assets/images/phone_samsung_ultra_1792582841173.jpg',
      badge: 'Top Flagman'
    },
    {
      id: 'phone-asus-rog8',
      brand: 'Asus',
      model: 'Asus ROG Phone 8 Pro',
      subtitle: 'Phantom Black 165Hz • AniMe Matrix LED',
      category: 'gaming',
      categoryLabel: 'O\'yinbop',
      categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      specs: ['165Hz AMOLED', '16GB RAM', 'AeroActive Cooler', '65W zaryad'],
      priceUsd: 1050,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
      badge: 'Geymerlar Uchun'
    },
    {
      id: 'phone-huawei-pura70',
      brand: 'Huawei',
      model: 'Huawei Pura 70 Ultra',
      subtitle: 'Chanson Green • Mexanik Suriluvchi Kamera',
      category: 'camera',
      categoryLabel: 'Kamerofon',
      categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      specs: ['1 dyuym suriluvchi optika', 'Ultra Snapshot', '512GB', '100W SuperCharge'],
      priceUsd: 1190,
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&auto=format&fit=crop&q=80',
      badge: 'Foto 1-o\'rin'
    },
    {
      id: 'phone-vivo-xfold3',
      brand: 'Vivo',
      model: 'Vivo X Fold 3 Pro',
      subtitle: 'Solar White • Dunyodagi eng yengil Fold',
      category: 'foldable',
      categoryLabel: 'Bukiluvchi',
      categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      specs: ['Zeiss T* optika', '5700 mAh batareya', 'Snapdragon 8 Gen 3', '236g ultra-yengil'],
      priceUsd: 1350,
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80',
      badge: 'Bukiluvchi'
    },
    {
      id: 'phone-redmi-k70u',
      brand: 'Redmi',
      model: 'Redmi K70 Ultra',
      subtitle: 'Ink Rock Black • Dimensity 9300+ 144Hz',
      category: 'gaming',
      categoryLabel: 'O\'yinbop',
      categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      specs: ['AnTuTu 2.38M ball', '120W quvvatlash', '144Hz 1.5K OLED', '16GB RAM'],
      priceUsd: 380,
      image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=900&auto=format&fit=crop&q=80',
      badge: 'Quvvatli'
    },
    {
      id: 'phone-realme-gt6',
      brand: 'Realme',
      model: 'Realme GT 6',
      subtitle: 'Fluid Silver • 6000 nit eng yorug\' ekran',
      category: 'gaming',
      categoryLabel: 'O\'yinbop',
      categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      specs: ['6000 nit ekran', 'Snapdragon 8s Gen 3', '120W zaryad', '512GB'],
      priceUsd: 420,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&auto=format&fit=crop&q=80',
      badge: '6000 Nit'
    },
    {
      id: 'phone-spark-20pro',
      brand: 'Spark',
      model: 'Tecno Spark 20 Pro+',
      subtitle: 'Temporal Orbits Gold • 120Hz Kavisli AMOLED',
      category: 'budget',
      categoryLabel: 'Hamyonbop',
      categoryColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      specs: ['Kavisli AMOLED', '108MP kamera', '256GB xotira', 'Helio G99'],
      priceUsd: 175,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80',
      badge: 'Ommabop Hit'
    },
    {
      id: 'phone-infinix-gt20',
      brand: 'Infinix',
      model: 'Infinix GT 20 Pro',
      subtitle: 'Mecha Silver Cyber • 144Hz Gaming Flagman',
      category: 'gaming',
      categoryLabel: 'O\'yinbop',
      categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      specs: ['PUBG 120 FPS', 'Dimensity 8200 Ultimate', 'RGB yoritgich', 'Pixelworks chip'],
      priceUsd: 295,
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=900&auto=format&fit=crop&q=80',
      badge: 'Cyber Gaming'
    },
    {
      id: 'phone-honor-magic6',
      brand: 'Honor',
      model: 'Honor Magic6 Pro',
      subtitle: 'Epi Green • 180MP Falcon Periskop Zum',
      category: 'camera',
      categoryLabel: 'Kamerofon',
      categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      specs: ['180MP Periskop', '5600 mAh kremniy-uglerod', '5000 nit HDR', 'IP68'],
      priceUsd: 740,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80',
      badge: 'Falcon Zum'
    },
    {
      id: 'phone-nokia-g42',
      brand: 'Nokia',
      model: 'Nokia G42 5G QuickFix',
      subtitle: 'So Purple • Mustaqil Ta\'mirlanuvchi 5G',
      category: 'budget',
      categoryLabel: 'Hamyonbop',
      categoryColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      specs: ['QuickFix oson ta\'mir', '3 kun batareya', '50MP AI kamera', '2 yil kafolat'],
      priceUsd: 190,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=80',
      badge: 'Mustahkam'
    },
  ];

  // Filtered active list for sequential downward slide
  const activePhones = React.useMemo(() => {
    let list = SHOWCASE_PHONES;
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (selectedBrand !== 'all') {
      list = list.filter(p => 
        p.brand.toLowerCase() === selectedBrand.toLowerCase() ||
        (selectedBrand === 'iPhone' && p.brand === 'Apple') ||
        (selectedBrand === 'Spark' && p.brand === 'Spark')
      );
    }
    return list.length > 0 ? list : SHOWCASE_PHONES;
  }, [selectedCategory, selectedBrand]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'down' | 'up'>('down');

  // Keep index within bounds when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, selectedBrand]);

  // Automatic downward sliding timer (ketma-ket pastga surilishi har 3 soniyada)
  useEffect(() => {
    if (!isAutoSliding) return;
    const interval = setInterval(() => {
      setSlideDirection('down');
      setCurrentIndex((prev) => (prev + 1) % activePhones.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isAutoSliding, activePhones.length]);

  const handleNextDown = () => {
    setSlideDirection('down');
    setCurrentIndex((prev) => (prev + 1) % activePhones.length);
  };

  const handlePrevUp = () => {
    setSlideDirection('up');
    setCurrentIndex((prev) => (prev - 1 + activePhones.length) % activePhones.length);
  };

  const currentPhone = activePhones[currentIndex % activePhones.length] || SHOWCASE_PHONES[0];
  const nextPhone1 = activePhones[(currentIndex + 1) % activePhones.length] || SHOWCASE_PHONES[1];
  const nextPhone2 = activePhones[(currentIndex + 2) % activePhones.length] || SHOWCASE_PHONES[2];

  const categoryIconMap = {
    all: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
    flagship: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
    foldable: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
    camera: <Camera className="w-3.5 h-3.5 text-rose-400" />,
    gaming: <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />,
    budget: <Tag className="w-3.5 h-3.5 text-indigo-400" />
  };

  return (
    <section className="relative isolate border-b border-white/[0.08] bg-[#090b10] overflow-hidden">
      
      {/* Background Animated Ambient Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(245,158,11,0.14),transparent_38%),radial-gradient(ellipse_at_85%_45%,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,#10131c_0%,#090b10_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        
        {/* Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clean, uncluttered, focused */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            
            {/* Single Elegant Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-400/[0.08] border border-amber-300/20 text-amber-200 text-xs font-bold shadow-lg shadow-amber-950/20">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>O'zbekistondagi telefonlar bozori</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-[2.65rem] sm:text-6xl lg:text-[4.25rem] font-black text-white tracking-[-0.045em] leading-[1.02]">
              Telefon topish va sotish <span className="block mt-2 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent">endi oson.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-7 font-normal max-w-lg">
              O'zingizga mos smartfonni toping, narxlarni solishtiring yoki ishlatilgan telefoningizni qulay soting.
            </p>

            {/* Trust and Key Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.045] border border-white/[0.08]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% UzIMEI ro'yxatdan o'tgan</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.045] border border-white/[0.08]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1 yil rasmiy kafolat</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onBrowseClick}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-400 px-6 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-400/20 transition hover:-translate-y-0.5 hover:shadow-amber-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                Katalogni ko'rish <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onSellClick}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Telefonni sotish
              </button>
            </div>

          </motion.div>

          {/* Right Column: Ketma-ket pastga suriladigan jonli vitrina (Downward Sliding Feed) */}
          <div className="lg:col-span-6 lg:pl-2">
            <div 
              onMouseEnter={() => setIsAutoSliding(false)}
              onMouseLeave={() => setIsAutoSliding(true)}
              className="relative rounded-[2rem] border border-white/[0.13] bg-white/[0.035] p-4 sm:p-5 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden ring-1 ring-white/[0.035]"
            >
              
              {/* Header Bar of Slide Widget */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    Jonli vitrina: <span className="text-amber-400 font-extrabold">Ketma-ket pastga surilmoqda</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-400 font-bold">
                    {currentIndex + 1} / {activePhones.length}
                  </span>
                </div>

                {/* Compact Controls: Pause/Play, Up, Down */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsAutoSliding(prev => !prev)}
                    title={isAutoSliding ? "To'xtatish" : "Avto-surilishni yoqish"}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors cursor-pointer"
                  >
                    {isAutoSliding ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    onClick={handlePrevUp}
                    title="Yuqoriga"
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleNextDown}
                    title="Pastga surish"
                    className="p-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Main Animated Card sliding DOWN */}
              <div className="relative h-[23rem] sm:h-[27rem] overflow-hidden rounded-[1.5rem] bg-[#141824] border border-white/[0.08]">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={currentPhone.id}
                    custom={slideDirection}
                    initial={{ opacity: 0, y: slideDirection === 'down' ? -40 : 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: slideDirection === 'down' ? 40 : -40 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5"
                  >
                    {/* Background visual overlay */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img 
                        src={currentPhone.image} 
                        alt={currentPhone.model}
                        className="w-full h-full object-cover object-center opacity-25 filter blur-[1px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0e111a]/95 via-[#0e111a]/65 to-[#0e111a]/15" />
                      <div className="absolute inset-y-0 right-0 w-[58%] flex items-center justify-center p-3 sm:p-5">
                        <img src={currentPhone.image} alt="" className="w-full h-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.65)]" />
                      </div>
                    </div>

                    {/* Top Row inside card */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white text-xs font-black tracking-wide border border-white/15">
                          {currentPhone.brand}
                        </span>

                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border ${currentPhone.categoryColor}`}>
                          {categoryIconMap[currentPhone.category]}
                          <span>{currentPhone.categoryLabel}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 text-[10px] font-bold uppercase border border-amber-400/30">
                          {currentPhone.badge}
                        </span>
                      </div>

                      {/* Device Thumbnail */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/40 border border-white/15 p-1 shrink-0 overflow-hidden flex items-center justify-center backdrop-blur-sm">
                        <img 
                          src={currentPhone.image} 
                          alt={currentPhone.model} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Mid Details */}
                    <div className="relative z-10 my-auto">
                      <h3 className="max-w-[60%] text-xl sm:text-2xl font-black text-white tracking-tight">
                        {currentPhone.model}
                      </h3>
                      <p className="max-w-[60%] text-xs text-slate-300 font-medium line-clamp-2 mt-1">
                        {currentPhone.subtitle}
                      </p>

                      {/* Specs Tags */}
                      <div className="relative z-10 flex max-w-[62%] flex-wrap items-center gap-1.5 mt-3">
                        {currentPhone.specs.map((sp, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[11px] text-slate-300"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row inside card */}
                    <div className="relative z-10 flex items-end justify-between pt-2.5 border-t border-white/[0.08]">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Narxi</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black font-mono text-amber-400">
                            {currentPhone.priceUsd.toLocaleString()} USD
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ≈ {(currentPhone.priceUsd * USD_TO_UZS_RATE).toLocaleString()} so'm
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={onBrowseClick}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Katalogda ko'rish
                      </button>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Downward Queue Feed: Next items */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                    <span>Ketma-ket navbatdagi modellar:</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[nextPhone1, nextPhone2].map((nextP, i) => (
                    <div
                      key={nextP.id}
                      onClick={() => {
                        setSlideDirection('down');
                        const targetIdx = activePhones.findIndex(p => p.id === nextP.id);
                        if (targetIdx !== -1) setCurrentIndex(targetIdx);
                      }}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] cursor-pointer flex items-center gap-2 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10">
                        <img src={nextP.image} alt={nextP.model} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-amber-400 truncate">
                          ↓ #{i + 1} {nextP.brand}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {nextP.model}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Marketplace benefits */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/[0.08]">
          {[
            { num: '01', label: 'Keng tanlov' },
            { num: '02', label: 'Oson taqqoslash' },
            { num: '03', label: 'Qulay savdo' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] transition hover:bg-white/[0.045] hover:border-amber-300/20"
            >
              <div className="text-sm font-black text-amber-400 font-mono">{item.num}</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
