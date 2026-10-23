import React, { useState } from 'react';
import { CartItem, OrderDetails } from '../types';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Truck, CreditCard } from 'lucide-react';
import { CITIES_OF_UZBEKISTAN } from '../data/mockPhones';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (phoneId: string, delta: number) => void;
  onRemoveItem: (phoneId: string) => void;
  currency: 'UZS' | 'USD';
  usdToUzsRate: number;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  usdToUzsRate,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [selectedCity, setSelectedCity] = useState('Toshkent');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'standard' | 'pickup'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'click' | 'payme' | 'installment'>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatPrice = (val: number) => val.toLocaleString('uz-UZ');

  const totalUsd = items.reduce((sum, item) => sum + item.phone.priceUsd * item.quantity, 0);
  const totalUzs = totalUsd * usdToUzsRate;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerPhone.length < 9) {
      setError('Iltimos, ismingiz va to\'liq telefon raqamingizni kiriting.');
      return;
    }
    if (!address.trim() && deliveryMethod !== 'pickup') {
      setError('Iltimos, yetkazib berish manzilini kiriting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const newOrder: OrderDetails = {
      id: `MB-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      city: selectedCity,
      address: address.trim() || 'Do\'kondan olib ketish',
      deliveryMethod,
      paymentMethod,
      items: [...items],
      totalUzs,
      totalUsd,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#13161f] border-l border-[#242939] h-full flex flex-col text-white shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212534] flex items-center justify-between bg-[#0e1017]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Savat va rasmiylashtirish</h3>
            <span className="text-xs bg-[#1f2434] text-slate-300 font-mono px-2 py-0.5 rounded-full">
              {items.reduce((acc, cur) => acc + cur.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e2332] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#1b202c] text-slate-500 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-white text-base">Savatingiz hozircha bo'sh</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Katalogimizdagi yangi va tekshirilgan smartfonlardan birini tanlang.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 text-xs font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-300"
            >
              Katalogni ko'rish
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Items List */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tanlangan mahsulotlar:
              </div>
              {items.map((item) => (
                <div
                  key={item.phone.id}
                  className="p-3 rounded-xl bg-[#181d28] border border-[#272d3e] flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-lg bg-[#11141c] p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={item.phone.images[0]}
                      alt={item.phone.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {item.phone.model}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.phone.storage} · {item.phone.color}
                    </div>
                    <div className="text-xs font-bold text-amber-400 font-mono mt-0.5">
                      {currency === 'UZS'
                        ? `${formatPrice(item.phone.priceUzs)} so'm`
                        : `$${formatPrice(item.phone.priceUsd)}`
                      }
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => onRemoveItem(item.phone.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-[#12151e] border border-[#2b3243] rounded px-1.5 py-0.5 text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.phone.id, -1)}
                        className="text-slate-400 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.phone.id, 1)}
                        className="text-slate-400 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-[#202534]">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Yetkazib berish ma'lumotlari:
              </div>

              {error && (
                <div className="p-2.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Ism va familiyangiz *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Azizbek Aliyev"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-[#171b26] border border-[#293042] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Telefon raqam *</label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-[#171b26] border border-[#293042] text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Viloyat / Shahar *</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-[#171b26] border border-[#293042] text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {CITIES_OF_UZBEKISTAN.filter((c) => c !== 'Barcha viloyatlar').map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Manzil (ko'cha, uy) *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Mirobod tuman, Nukus ko'chasi 15-uy"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-[#171b26] border border-[#293042] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Delivery method */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">Yetkazib berish usuli:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      deliveryMethod === 'express'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                        : 'bg-[#171b26] border-[#293042] text-slate-300'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      Express (2 soat)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Bepul yetkazish</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      deliveryMethod === 'pickup'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                        : 'bg-[#171b26] border-[#293042] text-slate-300'
                    }`}
                  >
                    <div className="font-semibold">Olib ketish</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Malika filiali</div>
                  </button>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">To'lov turi:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'cash_on_delivery', label: 'Naqd (kuryerga)', sub: 'Tekshirgandan so\'ng' },
                    { id: 'click', label: 'Click Up', sub: 'Onlayn to\'lov' },
                    { id: 'payme', label: 'Payme', sub: 'Onlayn to\'lov' },
                    { id: 'installment', label: 'Bo\'lib to\'lash', sub: 'Uzum Nasiya / Anor' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        paymentMethod === p.id
                          ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                          : 'bg-[#171b26] border-[#293042] text-slate-300'
                      }`}
                    >
                      <div className="font-semibold">{p.label}</div>
                      <div className="text-[10px] text-slate-400">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="p-3.5 rounded-xl bg-[#0f121a] border border-[#222736] space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Mahsulotlar:</span>
                  <span className="font-mono text-white">{formatPrice(totalUzs)} so'm</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Yetkazib berish:</span>
                  <span className="text-emerald-400 font-medium">Bepul (Aksiya)</span>
                </div>
                <div className="pt-2 border-t border-[#1e2330] flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">Jami to'lov:</span>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-400 font-mono">
                      {currency === 'UZS' ? `${formatPrice(totalUzs)} so'm` : `$${formatPrice(totalUsd)}`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {currency === 'UZS' ? `≈ $${formatPrice(totalUsd)}` : `≈ ${formatPrice(totalUzs)} so'm`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-sm font-semibold text-black bg-amber-400 hover:bg-amber-300 active:scale-98 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Rasmiylashtirilmoqda...' : 'Buyurtmani tasdiqlash'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
