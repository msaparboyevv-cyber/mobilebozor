import React, { useState } from 'react';
import { PhoneListing, OrderDetails, TradeInRequest, PhoneBrand, StorageOption, PhoneCategory } from '../../types';
import { 
  LayoutDashboard, 
  Smartphone, 
  ShoppingBag, 
  RefreshCw, 
  Settings, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  X,
  Save,
  PhoneCall,
  LogOut,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  phones: PhoneListing[];
  onAddPhone: (phone: PhoneListing) => void;
  onUpdatePhone: (phone: PhoneListing) => void;
  onDeletePhone: (phoneId: string) => void;
  orders: OrderDetails[];
  onUpdateOrderStatus: (orderId: string, status: 'confirmed' | 'processing' | 'shipped') => void;
  tradeInRequests: TradeInRequest[];
  onUpdateTradeInStatus: (requestId: string, status: 'pending' | 'approved' | 'completed' | 'rejected') => void;
  usdToUzsRate: number;
  onUpdateUsdRate: (newRate: number) => void;
  onExitAdmin: () => void;
  ownerEmail: string;
  adminPassword: string;
  onUpdateAdminPassword: (newPass: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  phones,
  onAddPhone,
  onUpdatePhone,
  onDeletePhone,
  orders,
  onUpdateOrderStatus,
  tradeInRequests,
  onUpdateTradeInStatus,
  usdToUzsRate,
  onUpdateUsdRate,
  onExitAdmin,
  ownerEmail,
  adminPassword,
  onUpdateAdminPassword,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'orders' | 'tradein' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  
  // Rate edit state
  const [tempRate, setTempRate] = useState<number>(usdToUzsRate);
  const [rateSuccess, setRateSuccess] = useState(false);

  // Password change state
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Edit Phone Modal state
  const [editingPhone, setEditingPhone] = useState<PhoneListing | null>(null);
  const [isAddPhoneOpen, setIsAddPhoneOpen] = useState(false);

  // New phone form
  const [newBrand, setNewBrand] = useState<PhoneBrand>('Apple');
  const [newModel, setNewModel] = useState('');
  const [newCategory, setNewCategory] = useState<PhoneCategory>('flagship');
  const [newStorage, setNewStorage] = useState<StorageOption>('256GB');
  const [newPriceUsd, setNewPriceUsd] = useState(900);
  const [newCity, setNewCity] = useState('Toshkent');

  const formatPrice = (val: number) => val.toLocaleString('uz-UZ');

  // Metrics
  const totalRevenueUsd = orders.reduce((sum, o) => sum + o.totalUsd, 0);
  const totalRevenueUzs = totalRevenueUsd * usdToUzsRate;
  const pendingOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length;
  const pendingTradeInCount = tradeInRequests.filter((t) => t.status === 'pending').length;

  const filteredPhones = phones.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || p.seller.name.toLowerCase().includes(q) || p.seller.phone.includes(q);
      if (!match) return false;
    }
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    return true;
  });

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempRate > 1000) {
      onUpdateUsdRate(tempRate);
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 2500);
    }
  };

  const handleAddNewPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.trim()) return;

    const newPhone: PhoneListing = {
      id: `phone-${Date.now()}`,
      title: `${newBrand} ${newModel.trim()} ${newStorage}`,
      brand: newBrand,
      model: newModel.trim(),
      category: newCategory,
      storage: newStorage,
      ram: '8GB',
      color: 'Titanium / Standart',
      condition: 'new',
      batteryHealth: 100,
      priceUsd: newPriceUsd,
      priceUzs: newPriceUsd * usdToUzsRate,
      isOriginal: true,
      uzImeiRegistered: true,
      warrantyMonths: 12,
      boxAndAccessories: ['Original qutisi', 'Kabel'],
      city: newCity,
      seller: {
        name: 'MobileBozor Admin',
        phone: '+998 71 200 00 00',
        type: 'verified_partner',
        rating: 5.0,
        dealsCount: 500
      },
      images: ['/src/assets/images/hero_smartphones_showcase_1792582840711.jpg'],
      description: `${newBrand} ${newModel} rasmiy kafolat va to'liq UzIMEI bilan.`,
      createdAt: new Date().toISOString(),
      viewsCount: 1
    };

    onAddPhone(newPhone);
    setIsAddPhoneOpen(false);
    setNewModel('');
  };

  const handleUpdatePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhone) return;

    onUpdatePhone({
      ...editingPhone,
      priceUzs: editingPhone.priceUsd * usdToUzsRate
    });
    setEditingPhone(null);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col font-sans">
      
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0f121a]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: Breadcrumb & Title */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Do'konga qaytish</span>
          </motion.button>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">MobileBozor</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono font-bold">
              Admin Console
            </span>
          </div>
        </div>

        {/* Center / Right: Live Currency Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
            <span className="text-slate-400">1 USD =</span>
            <span className="font-bold text-amber-400">{usdToUzsRate.toLocaleString()} UZS</span>
          </div>

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black flex items-center justify-center text-xs">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-none">Bosh Admin</div>
              <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">{ownerEmail}</div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              title="Admin seansidan chiqish"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors ml-1 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Chiqish</span>
            </motion.button>
          </div>
        </div>

      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/[0.06]">
          {[
            { id: 'overview', label: 'Umumiy ko\'rsatkichlar', icon: LayoutDashboard },
            { id: 'listings', label: `E'lonlar (${phones.length})`, icon: Smartphone },
            { id: 'orders', label: `Buyurtmalar (${orders.length})`, icon: ShoppingBag, badge: pendingOrdersCount },
            { id: 'tradein', label: `Trade-in arizalari (${tradeInRequests.length})`, icon: RefreshCw, badge: pendingTradeInCount },
            { id: 'settings', label: 'Sozlamalar & Valyuta', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                ) : null}

                {isActive && (
                  <motion.div
                    layoutId="adminTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#11141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>JAMI SAVDO AYLANMASI</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatPrice(totalRevenueUzs)} so'm
                </div>
                <div className="text-xs text-emerald-400 font-mono">
                  ≈ ${totalRevenueUsd.toLocaleString()} USD
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#11141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>FAOL E'LONLAR</span>
                  <Smartphone className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {phones.length} ta
                </div>
                <div className="text-xs text-slate-400">
                  Katalogda ko'rinmoqda
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#11141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>BUYURTMALAR</span>
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {orders.length} ta
                </div>
                <div className="text-xs text-blue-400">
                  {pendingOrdersCount} ta yangi / jarayonda
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#11141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>TRADE-IN SO'ROVLARI</span>
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {tradeInRequests.length} ta
                </div>
                <div className="text-xs text-amber-400">
                  {pendingTradeInCount} ta ko'rib chiqish kutilmoqda
                </div>
              </div>

            </div>

            {/* Recent Orders & Trade-Ins split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Orders List */}
              <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">So'nggi buyurtmalar</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Barchasini ko'rish →
                  </button>
                </div>

                <div className="divide-y divide-white/[0.06] text-xs">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{order.customerPhone} · {order.city}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-amber-400">{formatPrice(order.totalUzs)} so'm</div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'shipped' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-300'
                        }`}>
                          {order.status === 'shipped' ? 'Yetkazildi' : 'Jarayonda'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Trade-Ins */}
              <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Kutilayotgan Trade-in arizalari</h3>
                  <button
                    onClick={() => setActiveTab('tradein')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Barchasini ko'rish →
                  </button>
                </div>

                <div className="divide-y divide-white/[0.06] text-xs">
                  {tradeInRequests.slice(0, 4).map((req) => (
                    <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-white">{req.brand} {req.model} ({req.storage})</div>
                        <div className="text-slate-400 text-[11px]">{req.clientName} · {req.clientPhone}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400">
                          {formatPrice(req.estimatedPriceUzs)} so'm
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-300'
                        }`}>
                          {req.status === 'approved' ? 'Maqullandi' : 'Kutilmoqda'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: LISTINGS (E'lonlar) */}
        {activeTab === 'listings' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Model yoki sotuvchini qidirish..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                >
                  <option value="all" className="bg-[#12151e]">Barcha brendlar</option>
                  <option value="Apple" className="bg-[#12151e]">Apple (iPhone)</option>
                  <option value="Samsung" className="bg-[#12151e]">Samsung</option>
                  <option value="Redmi" className="bg-[#12151e]">Redmi</option>
                  <option value="Realme" className="bg-[#12151e]">Realme</option>
                  <option value="Nokia" className="bg-[#12151e]">Nokia</option>
                  <option value="Asus" className="bg-[#12151e]">Asus</option>
                  <option value="Vivo" className="bg-[#12151e]">Vivo</option>
                  <option value="Spark" className="bg-[#12151e]">Tecno Spark</option>
                  <option value="Infinix" className="bg-[#12151e]">Infinix</option>
                  <option value="Honor" className="bg-[#12151e]">Honor</option>
                  <option value="Huawei" className="bg-[#12151e]">Huawei</option>
                  <option value="Xiaomi" className="bg-[#12151e]">Xiaomi</option>
                  <option value="Google" className="bg-[#12151e]">Google</option>
                  <option value="OnePlus" className="bg-[#12151e]">OnePlus</option>
                  <option value="Boshqa" className="bg-[#12151e]">Boshqa</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAddPhoneOpen(true)}
                className="px-4 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Yangi smartfon qo'shish</span>
              </motion.button>

            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11141c] overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">Smartfon</th>
                    <th className="p-3.5">Xotira</th>
                    <th className="p-3.5">Narx (USD / UZS)</th>
                    <th className="p-3.5">Holati</th>
                    <th className="p-3.5">Sotuvchi</th>
                    <th className="p-3.5">Shahar</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredPhones.map((phone) => (
                    <tr key={phone.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/40 p-1 shrink-0 flex items-center justify-center">
                          <img src={phone.images[0]} alt={phone.title} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="font-bold text-white line-clamp-1 flex items-center gap-1.5">
                            <span>{phone.model}</span>
                            {phone.category && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                                phone.category === 'flagship'
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : phone.category === 'foldable'
                                  ? 'bg-cyan-400/20 text-cyan-300'
                                  : phone.category === 'camera'
                                  ? 'bg-rose-400/20 text-rose-300'
                                  : phone.category === 'gaming'
                                  ? 'bg-emerald-400/20 text-emerald-300'
                                  : 'bg-indigo-400/20 text-indigo-300'
                              }`}>
                                {phone.category}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-amber-400">{phone.brand}</div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 font-bold">{phone.storage}</td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-white">${phone.priceUsd}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{formatPrice(phone.priceUzs)} so'm</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/[0.05] text-slate-300">
                          {phone.condition === 'new' ? 'Yangi' : phone.condition === 'ideal' ? 'Ideal' : 'Yaxshi'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-white font-medium">{phone.seller.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{phone.seller.phone}</div>
                      </td>
                      <td className="p-3.5 text-slate-300">{phone.city}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingPhone(phone)}
                            className="p-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePhone(phone.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </motion.div>
        )}

        {/* TAB 3: ORDERS (Buyurtmalar) */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#11141c] overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">ID & Sana</th>
                    <th className="p-3.5">Mijoz</th>
                    <th className="p-3.5">Manzil & Shahar</th>
                    <th className="p-3.5">Mahsulot</th>
                    <th className="p-3.5">Summa</th>
                    <th className="p-3.5">To'lov</th>
                    <th className="p-3.5 text-right">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-amber-400">{order.id}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-white">{order.city}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{order.address}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-white font-medium">
                          {order.items.map((i) => `${i.phone.model} (${i.quantity}x)`).join(', ')}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-black text-white">{formatPrice(order.totalUzs)} so'm</div>
                        <div className="text-[10px] text-slate-400 font-mono">${order.totalUsd}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 uppercase text-[10px] font-bold">
                        {order.paymentMethod}
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                          className="py-1 px-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                        >
                          <option value="confirmed" className="bg-[#12151e]">Tasdiqlangan</option>
                          <option value="processing" className="bg-[#12151e]">Yetkazilmoqda</option>
                          <option value="shipped" className="bg-[#12151e]">Yetkazildi</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 4: TRADE-IN REQUESTS */}
        {activeTab === 'tradein' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#11141c] overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">Ariza ID</th>
                    <th className="p-3.5">Mijoz & Aloqa</th>
                    <th className="p-3.5">Telefon modeli</th>
                    <th className="p-3.5">Holat tavsifi</th>
                    <th className="p-3.5">Hisoblangan to'lov</th>
                    <th className="p-3.5">Qabul joyi</th>
                    <th className="p-3.5 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {tradeInRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-cyan-400">{req.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{req.clientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{req.clientPhone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{req.brand} {req.model}</div>
                        <div className="text-[11px] text-amber-400 font-mono">{req.storage}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 text-[11px] max-w-[200px]">
                        {req.conditionSummary}
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-emerald-400">{formatPrice(req.estimatedPriceUzs)} so'm</div>
                        <div className="text-[10px] text-slate-400 font-mono">${req.estimatedPriceUsd}</div>
                      </td>
                      <td className="p-3.5 text-slate-300">{req.branchOrCourier}</td>
                      <td className="p-3.5 text-right">
                        <select
                          value={req.status}
                          onChange={(e) => onUpdateTradeInStatus(req.id, e.target.value as any)}
                          className="py-1 px-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-bold text-emerald-300 focus:outline-none cursor-pointer"
                        >
                          <option value="pending" className="bg-[#12151e]">Kutilmoqda</option>
                          <option value="approved" className="bg-[#12151e]">Maqullandi (To'landi)</option>
                          <option value="completed" className="bg-[#12151e]">Yakunlandi</option>
                          <option value="rejected" className="bg-[#12151e]">Rad etildi</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SETTINGS & CURRENCY */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl bg-[#11141c] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div>
              <h3 className="text-xl font-black text-white">Platforma Sozlamalari</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dollar kursi va platforma narxlarini markazlashgan holda boshqarish.
              </p>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1 AQSH Dollari (USD) kursi so'mda:
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">UZS</span>
                    <input
                      type="number"
                      min="5000"
                      step="50"
                      value={tempRate}
                      onChange={(e) => setTempRate(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-lg font-mono font-black text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="py-3 px-6 text-xs sm:text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Saqlash</span>
                  </motion.button>
                </div>

                {rateSuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dollar kursi muvaffaqiyatli yangilandi va barcha telefon narxlariga tatbiq etildi!</span>
                  </div>
                )}
              </div>
            </form>

            {/* Password Change Card */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Admin Parolini O'zgartirish
                </h4>
              </div>

              <p className="text-xs text-slate-400">Yangi parol kamida 8 belgidan iborat bo‘lsin.</p>

              <div className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Yangi parol kiriting..."
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (newPasswordInput.trim().length >= 8) {
                      onUpdateAdminPassword(newPasswordInput.trim());
                      setNewPasswordInput('');
                      setPasswordSuccess(true);
                      setTimeout(() => setPasswordSuccess(false), 2500);
                    }
                  }}
                  className="py-2.5 px-5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  O'zgartirish
                </motion.button>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Admin paroli muvaffaqiyatli yangilandi!</span>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs text-slate-300">
              <div className="font-bold text-white">Do'kon filiallari:</div>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Toshkent — Malika savdo markazi, A-14 do'kon (+998 71 200 00 00)</li>
                <li>• Toshkent — Chilonzor metro bekati, 3-chi chiqish</li>
                <li>• Samarqand — Registon ko'chasi, 45-uy</li>
              </ul>
            </div>
          </motion.div>
        )}

      </div>

      {/* MODAL 1: ADD NEW PHONE AS ADMIN */}
      {isAddPhoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12151e] border border-white/[0.1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Yangi smartfon qo'shish</h3>
              <button onClick={() => setIsAddPhoneOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewPhoneSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Brend</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value as PhoneBrand)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                  >
                    <option value="Apple" className="bg-[#12151e]">Apple (iPhone)</option>
                    <option value="Samsung" className="bg-[#12151e]">Samsung</option>
                    <option value="Redmi" className="bg-[#12151e]">Redmi</option>
                    <option value="Realme" className="bg-[#12151e]">Realme</option>
                    <option value="Nokia" className="bg-[#12151e]">Nokia</option>
                    <option value="Asus" className="bg-[#12151e]">Asus</option>
                    <option value="Vivo" className="bg-[#12151e]">Vivo</option>
                    <option value="Spark" className="bg-[#12151e]">Tecno Spark</option>
                    <option value="Infinix" className="bg-[#12151e]">Infinix</option>
                    <option value="Honor" className="bg-[#12151e]">Honor</option>
                    <option value="Huawei" className="bg-[#12151e]">Huawei</option>
                    <option value="Xiaomi" className="bg-[#12151e]">Xiaomi</option>
                    <option value="Google" className="bg-[#12151e]">Google</option>
                    <option value="OnePlus" className="bg-[#12151e]">OnePlus</option>
                    <option value="Boshqa" className="bg-[#12151e]">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Telefon turi (Kategoriya)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PhoneCategory)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-amber-300 font-bold"
                  >
                    <option value="flagship" className="bg-[#12151e] text-white">★ Flagman</option>
                    <option value="foldable" className="bg-[#12151e] text-white">◫ Bukiluvchi</option>
                    <option value="camera" className="bg-[#12151e] text-white">◉ Kamerofon</option>
                    <option value="gaming" className="bg-[#12151e] text-white">⚡ O'yinbop</option>
                    <option value="budget" className="bg-[#12151e] text-white">◆ Hamyonbop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Model nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: iPhone 16 Pro, S24 Ultra..."
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Xotira</label>
                  <select
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value as StorageOption)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                  >
                    <option value="128GB" className="bg-[#12151e]">128 GB</option>
                    <option value="256GB" className="bg-[#12151e]">256 GB</option>
                    <option value="512GB" className="bg-[#12151e]">512 GB</option>
                    <option value="1TB" className="bg-[#12151e]">1 TB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Narxi (USD)</label>
                  <input
                    type="number"
                    min="10"
                    value={newPriceUsd}
                    onChange={(e) => setNewPriceUsd(Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Shahar</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPhoneOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl font-bold text-black bg-amber-400 hover:bg-amber-300"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PHONE MODAL */}
      {editingPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12151e] border border-white/[0.1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Smartfonni tahrirlash</h3>
              <button onClick={() => setEditingPhone(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePhoneSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Model nomi</label>
                <input
                  type="text"
                  value={editingPhone.model}
                  onChange={(e) => setEditingPhone({ ...editingPhone, model: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Xotira</label>
                  <select
                    value={editingPhone.storage}
                    onChange={(e) => setEditingPhone({ ...editingPhone, storage: e.target.value as StorageOption })}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                  >
                    <option value="64GB" className="bg-[#12151e]">64 GB</option>
                    <option value="128GB" className="bg-[#12151e]">128 GB</option>
                    <option value="256GB" className="bg-[#12151e]">256 GB</option>
                    <option value="512GB" className="bg-[#12151e]">512 GB</option>
                    <option value="1TB" className="bg-[#12151e]">1 TB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Narxi (USD)</label>
                  <input
                    type="number"
                    value={editingPhone.priceUsd}
                    onChange={(e) => setEditingPhone({ ...editingPhone, priceUsd: Number(e.target.value) })}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Shahar</label>
                <input
                  type="text"
                  value={editingPhone.city}
                  onChange={(e) => setEditingPhone({ ...editingPhone, city: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPhone(null)}
                  className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl font-bold text-black bg-amber-400 hover:bg-amber-300"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
