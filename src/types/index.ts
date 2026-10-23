export type PhoneBrand = 
  | 'Apple' 
  | 'Samsung' 
  | 'Redmi' 
  | 'Realme' 
  | 'Nokia' 
  | 'Asus' 
  | 'Vivo' 
  | 'Spark' 
  | 'Infinix' 
  | 'Honor' 
  | 'Huawei' 
  | 'Xiaomi' 
  | 'Google' 
  | 'OnePlus' 
  | 'Boshqa';


export type PhoneCondition = 'new' | 'ideal' | 'good' | 'fair';

export type PhoneCategory = 'flagship' | 'foldable' | 'camera' | 'budget' | 'gaming';

export type StorageOption = '64GB' | '128GB' | '256GB' | '512GB' | '1TB';

export interface PhoneListing {
  id: string;
  title: string;
  brand: PhoneBrand;
  model: string;
  category: PhoneCategory;
  series?: string;
  storage: StorageOption;
  ram: string;
  color: string;
  condition: PhoneCondition;
  batteryHealth?: number; // percentage (e.g. 100, 94)
  priceUsd: number;
  priceUzs: number;
  isOriginal: boolean;
  uzImeiRegistered: boolean;
  warrantyMonths: number;
  boxAndAccessories: string[];
  city: string;
  seller: {
    name: string;
    phone: string;
    telegram?: string;
    type: 'individual' | 'store' | 'verified_partner';
    rating: number;
    dealsCount: number;
  };
  images: string[];
  description: string;
  createdAt: string;
  isFeatured?: boolean;
  viewsCount: number;
}

export interface TradeInOption {
  brand: PhoneBrand;
  model: string;
  storage: StorageOption;
  screenCondition: 'perfect' | 'minor_scratches' | 'scratched' | 'cracked';
  bodyCondition: 'like_new' | 'used' | 'heavy_wear';
  batteryStatus: '95-100' | '85-94' | '80-84' | 'below_80';
  hasBox: boolean;
  hasOriginalAccessories: boolean;
}

export interface TradeInRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  brand: PhoneBrand;
  model: string;
  storage: StorageOption;
  conditionSummary: string;
  estimatedPriceUzs: number;
  estimatedPriceUsd: number;
  branchOrCourier: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
}

export interface CartItem {
  phone: PhoneListing;
  quantity: number;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  deliveryMethod: 'express' | 'standard' | 'pickup';
  paymentMethod: 'cash_on_delivery' | 'click' | 'payme' | 'installment';
  items: CartItem[];
  totalUzs: number;
  totalUsd: number;
  createdAt: string;
  status: 'confirmed' | 'processing' | 'shipped';
}
