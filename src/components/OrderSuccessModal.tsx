import React from 'react';
import { OrderDetails } from '../types';
import { CheckCircle2, PackageCheck, Phone, MapPin, Truck } from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const formatPrice = (val: number) => val.toLocaleString('uz-UZ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141822] border border-[#272d3e] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-white space-y-6">
        
        {/* Success Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <PackageCheck className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Buyurtmangiz qabul qilindi!</h2>
          <p className="text-xs text-slate-300">
            Demo buyurtma raqami: <span className="font-mono text-amber-400 font-bold">{order.id}</span>
          </p>
        </div>

        {/* Receipt Box */}
        <div className="p-4 rounded-xl bg-[#181d2a] border border-[#282f42] space-y-3 text-xs">
          
          <div className="flex justify-between items-center pb-2 border-b border-[#242a3b]">
            <span className="text-slate-400">Qabul qiluvchi:</span>
            <span className="font-medium text-white">{order.customerName}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#242a3b]">
            <span className="text-slate-400">Telefon:</span>
            <span className="font-mono text-white">{order.customerPhone}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#242a3b]">
            <span className="text-slate-400">Manzil:</span>
            <span className="text-white text-right max-w-[200px] truncate">{order.city}, {order.address}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#242a3b]">
            <span className="text-slate-400">To'lov holati:</span>
            <span className="text-amber-400 font-medium">{order.paymentMethod === 'cash_on_delivery' ? 'Yetkazilganda naqd' : `Tanlangan: ${order.paymentMethod} (to‘lov ulanmagan)`}</span>
          </div>

          <div className="pt-1 flex justify-between items-baseline">
            <span className="font-bold text-slate-300">Jami to'lov miqdori:</span>
            <span className="text-base font-extrabold text-white font-mono">{formatPrice(order.totalUzs)} so'm</span>
          </div>
        </div>

        {/* Next step guide */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#10131d] border border-[#202534] text-xs text-slate-300">
          <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Bu demo buyurtma faqat brauzeringizda saqlandi. Do'konga yuborilmadi va yetkazib berish rejalashtirilmadi.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 text-sm font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors text-center"
          >
            Bosh sahifaga qaytish
          </button>
        </div>

      </div>
    </div>
  );
};
