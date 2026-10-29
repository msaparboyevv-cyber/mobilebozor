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

  const formatPrice = (value: number) => value.toLocaleString('uz-UZ');
  const categoryLabel = (phone: PhoneListing) => {
    switch (phone.category) {
      case 'flagship': return '★ Flagman';
      case 'foldable': return '◫ Bukiluvchi';
      case 'camera': return '◉ Kamerofon';
      case 'gaming': return "⚡ O'yinbop";
      case 'budget': return '◆ Hamyonbop';
    }
  };
  const conditionLabel = (phone: PhoneListing) => {
    switch (phone.condition) {
      case 'new': return 'Yangi';
      case 'ideal': return 'Ideal';
      case 'good': return 'Yaxshi';
      case 'fair': return 'Qoniqarli';
    }
  };

  const comparisonRows: { label: string; value: (phone: PhoneListing) => React.ReactNode }[] = [
    { label: 'Brend', value: (phone) => phone.brand },
    { label: 'Telefon turi', value: categoryLabel },
    { label: 'Doimiy xotira (ROM)', value: (phone) => phone.storage },
    { label: 'Operativ xotira (RAM)', value: (phone) => phone.ram },
    {
      label: 'Batareya holati',
      value: (phone) => phone.batteryHealth != null
        ? <span className="inline-flex items-center gap-1 text-emerald-400"><BatteryCharging className="h-3.5 w-3.5 shrink-0" />{phone.batteryHealth}%</span>
        : 'Ko‘rsatilmagan',
    },
    { label: 'Holati', value: conditionLabel },
    {
      label: 'UzIMEI ro‘yxati',
      value: (phone) => phone.uzImeiRegistered
        ? <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="h-3.5 w-3.5 shrink-0" />Ro‘yxatdan o‘tgan</span>
        : <span className="text-amber-300">Ro‘yxatdan o‘tmagan</span>,
    },
    { label: 'Kafolat muddati', value: (phone) => phone.warrantyMonths > 0 ? `${phone.warrantyMonths} oy` : 'Ko‘rsatilmagan' },
    { label: 'Shahar / Manzil', value: (phone) => phone.city || 'Ko‘rsatilmagan' },
  ];

  return (
    <div className="fixed inset-0 z-50 box-border flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        className="relative my-auto box-border flex max-h-[calc(100dvh-1rem)] w-full max-w-5xl min-w-0 flex-col overflow-y-auto overscroll-contain rounded-2xl border border-[#272d3e] bg-[#141822] p-3 text-white shadow-2xl sm:my-4 sm:max-h-[90dvh] sm:p-6 lg:p-8"
      >
        <div className="sticky top-0 z-20 -mx-3 -mt-3 mb-4 flex shrink-0 items-center justify-between gap-2 border-b border-[#222736] bg-[#141822] px-3 py-3 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
          <div className="min-w-0">
            <h2 id="compare-modal-title" className="text-base font-bold text-white sm:text-2xl">Smartfonlarni solishtirish</h2>
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
              Texnik ko'rsatkichlar va narxlarni birma-bir taqqoslang
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Taqqoslash oynasini yopish"
            className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#1f2433] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {phones.length === 0 ? (
          <div className="space-y-4 py-10 text-center sm:py-16">
            <p className="text-sm text-slate-400">
              Hali taqqoslash uchun hech qanday telefon tanlanmagan.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreCatalog();
              }}
              className="rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-amber-300"
            >
              Katalogdan smartfon tanlash
            </button>
          </div>
        ) : (
          <>
            <div className="compare-phone-grid mb-4 min-w-0 gap-3">
              {phones.map((phone) => (
              <article key={phone.id} className="relative flex h-full min-w-0 box-border flex-col rounded-xl border border-white/10 bg-[#181c28] p-3">
                  <button
                    type="button"
                    onClick={() => onRemove(phone.id)}
                    aria-label={`${phone.model}ni taqqoslashdan olib tashlash`}
                    title="O‘chirish"
                    className="absolute right-2 top-2 z-10 inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg bg-black/70 text-slate-200 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="mb-2 flex h-20 w-full shrink-0 items-center justify-center rounded-lg bg-[#10141e] p-2">
                    {phone.images[0]
                      ? <img src={phone.images[0]} alt={phone.model} referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                      : <span className="text-[10px] text-slate-500">Rasm mavjud emas</span>}
                  </div>
                  <h3 className="line-clamp-3 min-h-[3.25rem] break-words text-xs font-bold leading-[1.1rem] text-white [overflow-wrap:anywhere]">{phone.model}</h3>
                  <p className="mt-1 flex min-h-8 items-center break-words text-xs font-extrabold leading-tight text-amber-300 [overflow-wrap:anywhere]">
                    {currency === 'UZS' ? `${formatPrice(phone.priceUzs)} so‘m` : `$${formatPrice(phone.priceUsd)}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => onAddToCart(phone)}
                    className="mt-auto flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-lg bg-amber-400 px-2 text-[11px] font-semibold text-black transition-colors hover:bg-amber-300"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Savatga</span>
                  </button>
                </article>
              ))}
            </div>

            <div className="compare-mobile-rows space-y-2">
              {comparisonRows.map((row) => (
                <section key={row.label} className="box-border min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <h3 className="mb-2 break-words text-[11px] font-semibold leading-4 text-slate-400 [overflow-wrap:anywhere]">{row.label}</h3>
                  <div className={`grid min-w-0 gap-2 ${
                    phones.length === 2
                      ? 'grid-cols-2'
                      : phones.length > 2
                        ? 'grid-cols-1 min-[640px]:grid-cols-3'
                        : 'grid-cols-1'
                  }`}>
                    {phones.map((phone) => (
                      <div key={phone.id} className="flex min-h-8 min-w-0 items-center justify-center break-words text-center text-xs font-medium leading-4 text-slate-200 [overflow-wrap:anywhere]">
                        {phones.length > 2 && (
                          <span className="mb-1 block line-clamp-1 text-[10px] font-semibold text-slate-400">
                            {phone.brand} · {phone.model}
                          </span>
                        )}
                        <span>{row.value(phone)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="compare-desktop-table min-w-0">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#262c3e]">
                    <th scope="col" className="w-40 p-3 text-xs font-medium text-slate-400">Ko'rsatkich</th>
                    {phones.map((phone) => (
                      <th key={phone.id} scope="col" className="min-w-0 p-3 text-center align-top">
                        <div className="space-y-2">
                          <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-[#181c28] p-2">
                            {phone.images[0]
                              ? <img src={phone.images[0]} alt={phone.model} referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                              : <span className="text-xs text-slate-500">Rasm mavjud emas</span>}
                            <button
                              type="button"
                              onClick={() => onRemove(phone.id)}
                              aria-label={`${phone.model}ni taqqoslashdan olib tashlash`}
                              title="O‘chirish"
                              className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-slate-200 transition-colors hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="line-clamp-2 min-h-10 break-words text-xs font-bold leading-5 text-white [overflow-wrap:anywhere]">{phone.model}</div>
                          <div className="flex min-h-10 items-center break-words text-sm font-bold text-amber-400 [overflow-wrap:anywhere]">
                            {currency === 'UZS' ? `${formatPrice(phone.priceUzs)} so‘m` : `$${formatPrice(phone.priceUsd)}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => onAddToCart(phone)}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-2 text-xs font-semibold text-black transition-colors hover:bg-amber-300"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Savatga</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202534] text-xs">
                  {comparisonRows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="break-words p-3 text-left font-medium text-slate-400">{row.label}</th>
                      {phones.map((phone) => (
                        <td key={phone.id} className="break-words p-3 text-center font-medium text-slate-200">{row.value(phone)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
