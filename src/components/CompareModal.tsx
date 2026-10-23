import React from 'react';
import { PhoneListing } from '../types';
import { X, Trash2, ShoppingBag, Check, BatteryCharging } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  phones: PhoneListing[];
  onRemove: (id: string) => void;
  onAddToCart: (phone: PhoneListing) => void;
  currency: 'UZS' | 'USD';
  onExploreCatalog: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  phones,
  onRemove,
  onAddToCart,
  currency,
  onExploreCatalog,
}) => {
  if (!isOpen) return null;

  const formatPrice = (val: number) => val.toLocaleString('uz-UZ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#141822] border border-[#272d3e] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222736] pb-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Smartfonlarni solishtirish</h2>
            <p className="text-xs text-slate-400 mt-1">
              Texnik ko'rsatkichlar va narxlarni birma-bir taqqoslang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2433] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {phones.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Hali taqqoslash uchun hech qanday telefon tanlanmagan.
            </p>
            <button
              onClick={() => {
                onClose();
                onExploreCatalog();
              }}
              className="px-5 py-2.5 text-xs font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
            >
              Katalogdan smartfon tanlash
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#262c3e]">
                  <th className="p-3 text-xs text-slate-400 font-medium w-40">Ko'rsatkich</th>
                  {phones.map((phone) => (
                    <th key={phone.id} className="p-3 text-center align-top min-w-[200px]">
                      <div className="space-y-2">
                        <div className="relative h-28 bg-[#181c28] rounded-lg overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={phone.images[0]}
                            alt={phone.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={() => onRemove(phone.id)}
                            className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-1">{phone.model}</div>
                        <div className="text-sm font-bold text-amber-400 font-mono">
                          {currency === 'UZS' ? `${formatPrice(phone.priceUzs)} so'm` : `$${phone.priceUsd}`}
                        </div>
                        <button
                          onClick={() => onAddToCart(phone)}
                          className="w-full py-1.5 px-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Savatga</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202534] text-xs">
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Brend</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center font-semibold text-slate-200">{p.brand}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Telefon turi</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-amber-300 text-[11px]">
                      {p.category === 'flagship' ? '★ Flagman' : p.category === 'foldable' ? '◫ Bukiluvchi' : p.category === 'camera' ? '◉ Kamerofon' : p.category === 'gaming' ? '⚡ O\'yinbop' : '◆ Hamyonbop'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Doimiy xotira (ROM)</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center font-mono text-slate-200">{p.storage}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Operativ xotira (RAM)</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center font-mono text-slate-200">{p.ram}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Batareya holati</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-medium">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        {p.batteryHealth ? `${p.batteryHealth}%` : '100%'}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Holati</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-300">
                      {p.condition === 'new' ? 'Yangi (Upakovka)' : p.condition === 'ideal' ? 'Ideal (10/10)' : 'Yaxshi (9/10)'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">UzIMEI ro'yxati</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center text-emerald-400 font-medium">
                      ✓ Ro'yxatdan o'tgan
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Kafolat muddati</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-300">
                      {p.warrantyMonths > 0 ? `${p.warrantyMonths} oy` : 'Do\'kon tekshiruvi'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-400 font-medium">Shahar / Manzil</td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-300">{p.city}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
