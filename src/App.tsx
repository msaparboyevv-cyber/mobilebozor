import React, { useState, useEffect } from 'react';
import { PhoneListing, CartItem, OrderDetails, TradeInRequest, PhoneCategory } from './types';
import { INITIAL_PHONE_LISTINGS, INITIAL_ORDERS, INITIAL_TRADE_IN_REQUESTS, USD_TO_UZS_RATE, CITIES_OF_UZBEKISTAN } from './data/mockPhones';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PhoneCatalog } from './components/PhoneCatalog';
import { SellPhoneModal } from './components/SellPhoneModal';
import { TradeInCalculator } from './components/TradeInCalculator';
import { PhoneDetailModal } from './components/PhoneDetailModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AccountModal, AccountUser } from './components/AccountModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ArrowLeftRight, CheckCircle2, Sparkles, PlusCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false);

  useEffect(() => {
    if (hasEnteredSite) return;
    const timer = window.setTimeout(() => setHasEnteredSite(true), 2000);
    return () => window.clearTimeout(timer);
  }, [hasEnteredSite]);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mb_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const savedPass = localStorage.getItem('mb_admin_password');
      if (savedPass) return savedPass;
    } catch {
      // fallback
    }
    return '';
  });

  // Manzil / Joylashuv bo'yicha filter
  const [selectedCity, setSelectedCity] = useState<string>('Barcha viloyatlar');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PhoneCategory | 'all'>('all');
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<'login' | 'register'>('login');
  const [accountUser, setAccountUser] = useState<AccountUser | null>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mb_account_session') || 'null');
      return saved && typeof saved.name === 'string' && typeof saved.email === 'string' ? saved : null;
    } catch {
      return null;
    }
  });
  const [isAdminView, setIsAdminView] = useState(false);

  // Dollar exchange rate
  const [usdRate, setUsdRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mb_usd_rate');
      if (saved) return Number(saved) || USD_TO_UZS_RATE;
    } catch (e) {
      console.error(e);
    }
    return USD_TO_UZS_RATE;
  });

  // Phone listings
  const [phones, setPhones] = useState<PhoneListing[]>(() => {
    try {
      const saved = localStorage.getItem('mb_phone_listings');
      if (saved) {
        const parsed: PhoneListing[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved listings', e);
    }
    return INITIAL_PHONE_LISTINGS;
  });

  // Orders
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('mb_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // Trade-In Requests
  const [tradeInRequests, setTradeInRequests] = useState<TradeInRequest[]>(() => {
    try {
      const saved = localStorage.getItem('mb_trade_ins');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRADE_IN_REQUESTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('mb_cart');
      if (savedCart) return JSON.parse(savedCart);
    } catch (e) {
      console.error('Error loading cart', e);
    }
    return [];
  });

  const [currency, setCurrency] = useState<'UZS' | 'USD'>('UZS');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const savedFavs = localStorage.getItem('mb_favorites');
      if (savedFavs) return JSON.parse(savedFavs);
    } catch (e) {
      console.error('Error loading favorites', e);
    }
    return [];
  });
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    try {
      const savedViews = JSON.parse(localStorage.getItem('mb_product_views') || '{}');
      if (!savedViews || typeof savedViews !== 'object' || Array.isArray(savedViews)) return {};
      return Object.entries(savedViews).reduce<Record<string, number>>((counts, [id, count]) => {
        if (typeof count === 'number' && Number.isFinite(count) && count > 0) counts[id] = count;
        return counts;
      }, {});
    } catch {
      return {};
    }
  });

  const [comparingPhones, setComparingPhones] = useState<PhoneListing[]>([]);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'tradein' | 'compare'>('buy');

  const [selectedPhone, setSelectedPhone] = useState<PhoneListing | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const showSearchResults = () => {
    setIsSearchOpen(false);
    setActiveTab('buy');
    window.setTimeout(() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  // City Phone Counts
  const cityPhoneCounts = React.useMemo(() => {
    const counts: Record<string, number> = { 'Barcha viloyatlar': phones.length };
    CITIES_OF_UZBEKISTAN.forEach((c) => {
      if (c !== 'Barcha viloyatlar') {
        counts[c] = phones.filter((p) => p.city.toLowerCase() === c.toLowerCase()).length;
      }
    });
    return counts;
  }, [phones]);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setActiveTab('buy');
    showToast(city === 'Barcha viloyatlar' ? "Barcha viloyatlar bo'yicha telefonlar ko'rsatilmoqda" : `📍 ${city} bo'yicha telefonlar ko'rsatilmoqda`);
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleSelectBrand = (brand: string) => {
    setSelectedBrand(brand);
    setActiveTab('buy');
    showToast(brand === 'all' ? "Barcha brendlar" : `📱 ${brand} brendidagi modellar`);
  };

  const handleSelectCategory = (cat: PhoneCategory | 'all') => {
    setSelectedCategory(cat);
    setActiveTab('buy');
    showToast(cat === 'all' ? "Barcha turlar" : `⚡ ${cat.toUpperCase()} toifasidagi modellar`);
  };

  // Sync state to local storage
  useEffect(() => {
    try { localStorage.setItem('mb_phone_listings', JSON.stringify(phones)); } catch (error) { console.error('E’lonlarni saqlab bo‘lmadi', error); }
  }, [phones]);

  useEffect(() => {
    try { localStorage.setItem('mb_orders', JSON.stringify(orders)); } catch (error) { console.error('Buyurtmalarni saqlab bo‘lmadi', error); }
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('mb_trade_ins', JSON.stringify(tradeInRequests)); } catch (error) { console.error('Trade-in arizalarini saqlab bo‘lmadi', error); }
  }, [tradeInRequests]);

  useEffect(() => {
    try { localStorage.setItem('mb_usd_rate', String(usdRate)); } catch (error) { console.error('Valyuta kursini saqlab bo‘lmadi', error); }
  }, [usdRate]);

  useEffect(() => {
    if (adminPassword) { try { localStorage.setItem('mb_admin_password', adminPassword); } catch (error) { console.error('Admin sozlamasini saqlab bo‘lmadi', error); } }
  }, [adminPassword]);

  useEffect(() => {
    try { localStorage.setItem('mb_cart', JSON.stringify(cart)); } catch (error) { console.error('Savatni saqlab bo‘lmadi', error); }
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('mb_favorites', JSON.stringify(favoriteIds)); } catch (error) { console.error('Sevimlilarni saqlab bo‘lmadi', error); }
  }, [favoriteIds]);

  useEffect(() => {
    try { localStorage.setItem('mb_product_views', JSON.stringify(viewCounts)); } catch (error) { console.error('Ko‘rish tarixini saqlab bo‘lmadi', error); }
  }, [viewCounts]);

  // Cart actions
  const handleAddToCart = (phone: PhoneListing) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.phone.id === phone.id);
      if (existing) {
        return prev.map((item) =>
          item.phone.id === phone.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { phone, quantity: 1 }];
    });
    showToast(`${phone.model} savatga qo'shildi!`);
  };

  const handleInstantBuy = (phone: PhoneListing) => {
    handleAddToCart(phone);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (phoneId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.phone.id === phoneId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (phoneId: string) => {
    setCart((prev) => prev.filter((item) => item.phone.id !== phoneId));
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSelectPhone = (phone: PhoneListing) => {
    setViewCounts((previous) => ({ ...previous, [phone.id]: (previous[phone.id] || 0) + 1 }));
    setSelectedPhone(phone);
  };

  const handleToggleCompare = (phone: PhoneListing) => {
    setComparingPhones((prev) => {
      const exists = prev.some((p) => p.id === phone.id);
      if (exists) return prev.filter((p) => p.id !== phone.id);
      if (prev.length >= 3) {
        showToast("Maksimal 3 ta telefon taqqoslanadi");
        return prev;
      }
      showToast(`${phone.model} taqqoslashga qo'shildi`);
      return [...prev, phone];
    });
  };

  const handleRemoveCompare = (phoneId: string) => {
    setComparingPhones((prev) => prev.filter((p) => p.id !== phoneId));
  };

  const handleAddNewListing = (newListing: PhoneListing): boolean => {
    const updatedListings = [newListing, ...phones];
    try {
      localStorage.setItem('mb_phone_listings', JSON.stringify(updatedListings));
    } catch (error) {
      console.error('E’lonni saqlab bo‘lmadi', error);
      showToast('E’lon brauzer xotirasiga saqlanmadi. Xotirada joy borligini tekshiring.');
      return false;
    }
    setPhones(updatedListings);
    showToast("E'loningiz qo'shildi!");
    return true;
  };

  const handleOrderSuccess = (order: OrderDetails) => {
    setCart([]);
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
  };

  const handleNewTradeInRequest = (req: TradeInRequest) => {
    setTradeInRequests((prev) => [req, ...prev]);
    showToast("Trade-in arizangiz qabul qilindi!");
  };

  // Admin Actions
  const handleAdminUpdateOrderStatus = (orderId: string, status: 'confirmed' | 'processing' | 'shipped') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Buyurtma holati yangilandi`);
  };

  const handleAdminUpdateTradeInStatus = (reqId: string, status: 'pending' | 'approved' | 'completed' | 'rejected') => {
    setTradeInRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status } : r))
    );
    showToast(`Trade-in arizasi holati yangilandi`);
  };

  const handleAdminAddPhone = (newPhone: PhoneListing) => {
    setPhones((prev) => [newPhone, ...prev]);
    showToast(`${newPhone.model} katalogga qo'shildi!`);
  };

  const handleAdminUpdatePhone = (updated: PhoneListing) => {
    setPhones((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Smartfon ma'lumotlari yangilandi`);
  };

  const handleAdminDeletePhone = (phoneId: string) => {
    setPhones((prev) => prev.filter((p) => p.id !== phoneId));
    showToast(`Smartfon ro'yxatdan o'chirildi`);
  };

  const handleAdminUpdateUsdRate = (newRate: number) => {
    setUsdRate(newRate);
    setPhones((prev) =>
      prev.map((p) => ({
        ...p,
        priceUzs: p.priceUsd * newRate
      }))
    );
    showToast(`Dollar kursi ${newRate.toLocaleString()} so'mga o'rnatildi!`);
  };

  const handleAdminUpdatePassword = (newPass: string) => {
    setAdminPassword(newPass);
    showToast(`Admin paroli yangilandi!`);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
    localStorage.removeItem('mb_admin_authenticated');
    showToast("Admin seansidan chiqildi.");
  };

  if (!hasEnteredSite) {
    return <WelcomeScreen />;
  }

  // If Admin View is active, render the Admin Console
  if (isAdminView && isAdminAuthenticated) {
    return (
      <AdminDashboard
        phones={phones}
        onAddPhone={handleAdminAddPhone}
        onUpdatePhone={handleAdminUpdatePhone}
        onDeletePhone={handleAdminDeletePhone}
        orders={orders}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        tradeInRequests={tradeInRequests}
        onUpdateTradeInStatus={handleAdminUpdateTradeInStatus}
        usdToUzsRate={usdRate}
        onUpdateUsdRate={handleAdminUpdateUsdRate}
        onExitAdmin={() => setIsAdminView(false)}
        adminPassword={adminPassword}
        onUpdateAdminPassword={handleAdminUpdatePassword}
        onLogout={handleAdminLogout}
      />
    );
  }

  // Otherwise, render Storefront
  return (
    <div className="flex min-h-dvh flex-col bg-[#0b0d13] pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] text-[#f1f3f7]">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'compare') {
            setIsCompareModalOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favoriteIds.length}
        orders={orders}
        openCart={() => {
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        openWishlist={() => {
          setIsCartOpen(false);
          setIsWishlistOpen(true);
        }}
        openSearch={() => {
          setActiveTab('buy');
          setIsSearchOpen(true);
        }}
        openHome={() => {
          setActiveTab('buy');
          setSelectedPhone(null);
          setIsSellModalOpen(false);
          setIsCartOpen(false);
          setIsWishlistOpen(false);
          setIsCompareModalOpen(false);
          setIsSearchOpen(false);
          setIsAccountModalOpen(false);
          setIsLoginModalOpen(false);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        openSellModal={() => setIsSellModalOpen(true)}
        currency={currency}
        toggleCurrency={() => setCurrency((c) => (c === 'UZS' ? 'USD' : 'UZS'))}
        compareCount={comparingPhones.length}
        onOpenAdmin={() => {
          if (isAdminAuthenticated) {
            setIsAdminView(true);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        onOpenAccount={(mode) => { setAccountModalMode(mode); setIsAccountModalOpen(true); }}
        accountName={accountUser?.name}
        accountSurname={accountUser?.surname}
        accountPhone={accountUser?.phone}
        onLogoutAccount={() => { localStorage.removeItem('mb_account_session'); setAccountUser(null); }}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        cityPhoneCounts={cityPhoneCounts}
        selectedBrand={selectedBrand}
        availableBrands={[...new Set(phones.map((phone) => phone.brand))]}
        onSelectBrand={handleSelectBrand}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* Main Views with Motion Transition */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* Buy View */}
          {activeTab === 'buy' && (
            <motion.div
              key="buy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Hero
                phones={phones}
                currency={currency}
                onSelectPhone={handleSelectPhone}
                onAddToCart={handleAddToCart}
                comparingPhoneIds={comparingPhones.map((phone) => phone.id)}
                onToggleCompare={handleToggleCompare}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />

              <PhoneCatalog
                phones={phones}
                currency={currency}
                onSelectPhone={handleSelectPhone}
                onAddToCart={handleAddToCart}
                comparingPhoneIds={comparingPhones.map((p) => p.id)}
                onToggleCompare={handleToggleCompare}
                favoriteIds={favoriteIds}
                viewCounts={viewCounts}
                onToggleFavorite={handleToggleFavorite}
                onOpenSellModal={() => setIsSellModalOpen(true)}
                selectedCity={selectedCity}
                onSelectCity={handleSelectCity}
                selectedBrand={selectedBrand}
                onSelectBrand={handleSelectBrand}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                isCatalogModalOpen={isCatalogModalOpen}
                setIsCatalogModalOpen={setIsCatalogModalOpen}
              />
            </motion.div>
          )}

          {/* Sell View */}
          {activeTab === 'sell' && (
            <motion.div
              key="sell"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10"
            >
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Telefoningizni soting
                </h1>
                <p className="text-base text-slate-300 font-medium">
                  Ikkita qulay usul: o'zingiz xohlagan narxda e'lon bering yoki tezkor naqd pulga topshiring.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* E'lon berish */}
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(251, 191, 36, 0.4)' }}
                  className="p-8 rounded-3xl bg-[#12151e] border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold">
                      <PlusCircle className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h3 className="text-2xl font-black text-white">E'lon joylashtirish</h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      Fotosuratlar va narxni ko'rsatib e'lon qoldiring. Xaridorlar to'g'ridan-to'g'ri bog'lanishadi.
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsSellModalOpen(true)}
                    className="w-full py-4 px-6 text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-2xl transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
                  >
                    E'lon berish
                  </motion.button>
                </motion.div>

                {/* Trade-in */}
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(56, 189, 248, 0.4)' }}
                  className="p-8 rounded-3xl bg-[#12151e] border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center font-bold">
                      <Sparkles className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h3 className="text-2xl font-black text-white">Tezkor Trade-in</h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      Telefoningizni 15 daqiqada naqd pulga soting yoki yangi flagmanga almashtirib +5% bonus oling.
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setActiveTab('tradein');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 px-6 text-sm font-bold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] rounded-2xl transition-all cursor-pointer"
                  >
                    Trade-in narxini hisoblash
                  </motion.button>
                </motion.div>
              </div>

            </motion.div>
          )}

          {/* Trade-in View */}
          {activeTab === 'tradein' && (
            <TradeInCalculator
              key="tradein"
              usdToUzsRate={usdRate}
              onExploreCatalog={() => {
                setActiveTab('buy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSubmitTradeIn={handleNewTradeInRequest}
            />
          )}

        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsSearchOpen(false);
            }}
          >
            <motion.form
              role="search"
              aria-label="Telefon qidiruvi"
              onSubmit={(event) => {
                event.preventDefault();
                showSearchResults();
              }}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#151922] p-4 shadow-2xl sm:p-5"
            >
              <label htmlFor="mobile-search-query" className="mb-3 block text-sm font-bold text-white">
                Telefon qidirish
              </label>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" aria-hidden="true" />
                  <input
                    id="mobile-search-query"
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Brend yoki model nomi..."
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-base text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-12 shrink-0 rounded-xl bg-amber-400 px-4 text-sm font-bold text-black transition hover:bg-amber-300"
                >
                  Qidirish
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="mt-3 min-h-10 w-full rounded-xl border border-white/10 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Yopish
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compare Button */}
      {comparingPhones.length > 0 && (
        <motion.div 
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="fixed bottom-36 right-4 z-30"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCompareModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-400 text-black font-extrabold text-xs shadow-2xl shadow-amber-400/30 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Taqqoslash ({comparingPhones.length})</span>
          </motion.button>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-52 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#1a202c]/95 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal (Faqat siz kira olishingiz uchun) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsLoginModalOpen(false);
          setIsAdminView(true);
          showToast('Xush kelibsiz, Bosh Admin!');
        }}
        onSetInitialPassword={handleAdminUpdatePassword}
        adminPassword={adminPassword}
      />

      {isAccountModalOpen && (
        <AccountModal
          mode={accountModalMode}
          account={accountUser}
          onClose={() => setIsAccountModalOpen(false)}
          onAuthenticated={(user) => { setAccountUser(user); setIsAccountModalOpen(false); showToast(`Xush kelibsiz, ${user.name}!`); }}
          onLogout={() => { localStorage.removeItem('mb_account_session'); setAccountUser(null); setIsAccountModalOpen(false); showToast('Akkauntdan chiqdingiz.'); }}
        />
      )}

      {/* Modals & Drawers */}
      <SellPhoneModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onAddListing={handleAddNewListing}
        usdToUzsRate={usdRate}
      />

      <PhoneDetailModal
        phone={selectedPhone}
        currency={currency}
        onClose={() => setSelectedPhone(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
        isComparing={selectedPhone ? comparingPhones.some((p) => p.id === selectedPhone.id) : false}
        onToggleCompare={handleToggleCompare}
        isFavorite={selectedPhone ? favoriteIds.includes(selectedPhone.id) : false}
        onToggleFavorite={handleToggleFavorite}
        listings={phones}
        onSelectListing={handleSelectPhone}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        phones={comparingPhones}
        onRemove={handleRemoveCompare}
        onAddToCart={handleAddToCart}
        currency={currency}
        onExploreCatalog={() => {
          setActiveTab('buy');
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        currency={currency}
        usdToUzsRate={usdRate}
        onOrderSuccess={handleOrderSuccess}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        phones={phones.filter((phone) => favoriteIds.includes(phone.id))}
        currency={currency}
        comparingPhoneIds={comparingPhones.map((phone) => phone.id)}
        onClose={() => setIsWishlistOpen(false)}
        onSelectPhone={handleSelectPhone}
        onAddToCart={handleAddToCart}
        onToggleCompare={handleToggleCompare}
        onToggleFavorite={handleToggleFavorite}
      />

      <OrderSuccessModal
        order={lastOrder}
        onClose={() => setLastOrder(null)}
      />

      {/* Clean 1-line Footer */}
      <Footer
        onOpenSell={() => setIsSellModalOpen(true)}
        onOpenAdmin={() => {
          if (isAdminAuthenticated) {
            setIsAdminView(true);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
      />

    </div>
  );
}
