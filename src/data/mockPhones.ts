import { PhoneListing, OrderDetails, TradeInRequest, PhoneBrand, PhoneCategory } from '../types';

export const USD_TO_UZS_RATE = 12850;

export const PHONE_CATEGORIES: { id: PhoneCategory | 'all'; label: string; desc: string }[] = [
  { id: 'all', label: 'Barcha turlar', desc: 'Barcha mavjud smartfonlar' },
  { id: 'flagship', label: 'Flagmanlar', desc: 'Eng so\'nggi premium texnologiyalar' },
  { id: 'foldable', label: 'Bukiluvchi', desc: 'Fold va Flip innovatsion ekranlar' },
  { id: 'camera', label: 'Kamerofonlar', desc: 'Professional fotokamera va zum' },
  { id: 'budget', label: 'Hamyonbop', desc: 'Arzon va sifatli o\'rta toifa' },
  { id: 'gaming', label: 'O\'yinbop', desc: 'Kuchli protsessor va sovitish' },
];

export const ALL_MODELS_BY_BRAND: Record<PhoneBrand, { model: string; category: PhoneCategory; baseUsd: number }[]> = {
  Apple: [
    { model: 'iPhone 18 Pro Max', category: 'flagship', baseUsd: 1590 },
    { model: 'iPhone 18 Pro', category: 'flagship', baseUsd: 1390 },
    { model: 'iPhone 17 Pro', category: 'flagship', baseUsd: 1250 },
    { model: 'iPhone 16 Pro Max', category: 'camera', baseUsd: 1200 },
    { model: 'iPhone 16 Pro', category: 'flagship', baseUsd: 1050 },
    { model: 'iPhone 16 Plus', category: 'flagship', baseUsd: 850 },
    { model: 'iPhone 16', category: 'flagship', baseUsd: 760 },
    { model: 'iPhone 15 Pro Max', category: 'camera', baseUsd: 910 },
    { model: 'iPhone 15 Pro', category: 'flagship', baseUsd: 780 },
    { model: 'iPhone 15 Plus', category: 'budget', baseUsd: 680 },
    { model: 'iPhone 15', category: 'budget', baseUsd: 610 },
    { model: 'iPhone 14 Pro Max', category: 'camera', baseUsd: 680 },
    { model: 'iPhone 14 Pro', category: 'flagship', baseUsd: 590 },
    { model: 'iPhone 14', category: 'budget', baseUsd: 460 },
    { model: 'iPhone 13 Pro Max', category: 'camera', baseUsd: 520 },
    { model: 'iPhone 13 Pro', category: 'flagship', baseUsd: 470 },
    { model: 'iPhone 13', category: 'budget', baseUsd: 390 },
    { model: 'iPhone 12', category: 'budget', baseUsd: 290 },
    { model: 'iPhone 11', category: 'budget', baseUsd: 220 },
  ],
  Samsung: [
    { model: 'Galaxy S25 Ultra', category: 'flagship', baseUsd: 1300 },
    { model: 'Galaxy S24 Ultra', category: 'camera', baseUsd: 950 },
    { model: 'Galaxy S24+', category: 'flagship', baseUsd: 700 },
    { model: 'Galaxy S24', category: 'flagship', baseUsd: 580 },
    { model: 'Galaxy Z Fold 6', category: 'foldable', baseUsd: 1250 },
    { model: 'Galaxy Z Flip 6', category: 'foldable', baseUsd: 720 },
    { model: 'Galaxy Z Fold 5', category: 'foldable', baseUsd: 890 },
    { model: 'Galaxy Z Flip 5', category: 'foldable', baseUsd: 550 },
    { model: 'Galaxy S23 Ultra', category: 'camera', baseUsd: 620 },
    { model: 'Galaxy S23 FE', category: 'budget', baseUsd: 410 },
    { model: 'Galaxy A55 5G', category: 'budget', baseUsd: 290 },
    { model: 'Galaxy A35 5G', category: 'budget', baseUsd: 240 },
    { model: 'Galaxy A25 5G', category: 'budget', baseUsd: 190 },
    { model: 'Galaxy A15', category: 'budget', baseUsd: 140 },
  ],
  Redmi: [
    { model: 'Redmi K70 Ultra (Dimensity 9300+)', category: 'gaming', baseUsd: 380 },
    { model: 'Redmi Turbo 3 (Snapdragon 8s Gen 3)', category: 'gaming', baseUsd: 290 },
    { model: 'Redmi Note 13 Pro+ 5G (200MP)', category: 'camera', baseUsd: 280 },
    { model: 'Redmi Note 13 Pro 4G', category: 'budget', baseUsd: 220 },
    { model: 'Redmi Note 13', category: 'budget', baseUsd: 160 },
    { model: 'Redmi 13C', category: 'budget', baseUsd: 120 },
    { model: 'Redmi A3', category: 'budget', baseUsd: 85 },
  ],
  Realme: [
    { model: 'Realme GT 6 (6000 nit)', category: 'gaming', baseUsd: 420 },
    { model: 'Realme GT Neo 6', category: 'gaming', baseUsd: 330 },
    { model: 'Realme 12 Pro+ 5G (Periscope Zoom)', category: 'camera', baseUsd: 290 },
    { model: 'Realme 12+ 5G', category: 'budget', baseUsd: 230 },
    { model: 'Realme C67', category: 'budget', baseUsd: 140 },
    { model: 'Realme C53', category: 'budget', baseUsd: 110 },
  ],
  Nokia: [
    { model: 'Nokia XR21 (Harbiy standart)', category: 'budget', baseUsd: 380 },
    { model: 'Nokia G42 5G (QuickFix ta\'mirlanuvchi)', category: 'budget', baseUsd: 190 },
    { model: 'Nokia G22', category: 'budget', baseUsd: 140 },
    { model: 'Nokia C32', category: 'budget', baseUsd: 110 },
    { model: 'Nokia 3310 4G (Afsonaviy klaviatura)', category: 'budget', baseUsd: 65 },
  ],
  Asus: [
    { model: 'Asus ROG Phone 8 Pro (165Hz)', category: 'gaming', baseUsd: 1050 },
    { model: 'Asus ROG Phone 8', category: 'gaming', baseUsd: 850 },
    { model: 'Asus ROG Phone 7 Ultimate', category: 'gaming', baseUsd: 690 },
    { model: 'Asus Zenfone 11 Ultra', category: 'flagship', baseUsd: 790 },
    { model: 'Asus Zenfone 10 Kompakt', category: 'flagship', baseUsd: 590 },
  ],
  Vivo: [
    { model: 'Vivo X100 Ultra (Zeiss 200MP APO)', category: 'camera', baseUsd: 980 },
    { model: 'Vivo X100 Pro', category: 'camera', baseUsd: 780 },
    { model: 'Vivo X Fold 3 Pro (Eng yengil Fold)', category: 'foldable', baseUsd: 1350 },
    { model: 'Vivo iQOO 12 (Gaming Flagship)', category: 'gaming', baseUsd: 590 },
    { model: 'Vivo V30 5G (Studio Aura Light)', category: 'camera', baseUsd: 340 },
    { model: 'Vivo Y28', category: 'budget', baseUsd: 150 },
  ],
  Spark: [
    { model: 'Tecno Spark 20 Pro+ (Kavisli AMOLED)', category: 'budget', baseUsd: 175 },
    { model: 'Tecno Spark 20 Pro', category: 'budget', baseUsd: 150 },
    { model: 'Tecno Spark 20', category: 'budget', baseUsd: 125 },
    { model: 'Tecno Spark Go 2024', category: 'budget', baseUsd: 90 },
    { model: 'Tecno Phantom V Fold 2', category: 'foldable', baseUsd: 890 },
    { model: 'Tecno Camon 30 Pro 5G', category: 'camera', baseUsd: 290 },
  ],
  Infinix: [
    { model: 'Infinix GT 20 Pro (Mecha Dizayn Gaming)', category: 'gaming', baseUsd: 295 },
    { model: 'Infinix Note 40 Pro+ 5G (100W MagCharge)', category: 'budget', baseUsd: 270 },
    { model: 'Infinix Note 40 Pro', category: 'budget', baseUsd: 220 },
    { model: 'Infinix Zero 30 5G (4K 60fps Selfie)', category: 'camera', baseUsd: 260 },
    { model: 'Infinix Hot 40 Pro', category: 'budget', baseUsd: 160 },
    { model: 'Infinix Smart 8', category: 'budget', baseUsd: 95 },
  ],
  Honor: [
    { model: 'Honor Magic6 Pro (Falcon Camera)', category: 'camera', baseUsd: 740 },
    { model: 'Honor Magic V3 (Ultra ingichka Fold)', category: 'foldable', baseUsd: 1290 },
    { model: 'Honor Magic V2', category: 'foldable', baseUsd: 820 },
    { model: 'Honor 200 Pro (Harcourt Portret)', category: 'camera', baseUsd: 410 },
    { model: 'Honor 90', category: 'budget', baseUsd: 260 },
    { model: 'Honor X9b (Sindirilmas ekran)', category: 'budget', baseUsd: 210 },
  ],
  Huawei: [
    { model: 'Huawei Pura 70 Ultra (Suriluvchi Ob\'yektiv)', category: 'camera', baseUsd: 1190 },
    { model: 'Huawei Pura 70 Pro', category: 'camera', baseUsd: 850 },
    { model: 'Huawei Mate 60 Pro+ (Sun\'iy Yo\'ldosh)', category: 'flagship', baseUsd: 950 },
    { model: 'Huawei Mate X5 (Foldable Kunlun)', category: 'foldable', baseUsd: 1490 },
    { model: 'Huawei Pocket 2 (Flip)', category: 'foldable', baseUsd: 890 },
    { model: 'Huawei Nova 12 SE', category: 'budget', baseUsd: 250 },
  ],
  Xiaomi: [
    { model: 'Xiaomi 15 Pro', category: 'flagship', baseUsd: 850 },
    { model: 'Xiaomi 14 Ultra (Leica)', category: 'camera', baseUsd: 820 },
    { model: 'Xiaomi 14 Pro', category: 'flagship', baseUsd: 580 },
    { model: 'Xiaomi 14', category: 'flagship', baseUsd: 490 },
    { model: 'Xiaomi 13T Pro', category: 'gaming', baseUsd: 420 },
    { model: 'Poco F6 Pro', category: 'gaming', baseUsd: 360 },
    { model: 'Poco F6', category: 'gaming', baseUsd: 290 },
    { model: 'Poco X6 Pro', category: 'gaming', baseUsd: 240 },
  ],
  Google: [
    { model: 'Pixel 9 Pro Fold', category: 'foldable', baseUsd: 1350 },
    { model: 'Pixel 9 Pro XL', category: 'camera', baseUsd: 890 },
    { model: 'Pixel 9', category: 'flagship', baseUsd: 610 },
    { model: 'Pixel 8 Pro', category: 'camera', baseUsd: 510 },
    { model: 'Pixel 8a', category: 'budget', baseUsd: 380 },
    { model: 'Pixel 7 Pro', category: 'camera', baseUsd: 350 },
  ],
  OnePlus: [
    { model: 'OnePlus 12', category: 'flagship', baseUsd: 590 },
    { model: 'OnePlus Open (Fold)', category: 'foldable', baseUsd: 880 },
    { model: 'OnePlus 12R', category: 'gaming', baseUsd: 390 },
    { model: 'OnePlus 11', category: 'flagship', baseUsd: 380 },
  ],
  Boshqa: [
    { model: 'Boshqa zamonaviy smartfon', category: 'budget', baseUsd: 180 },
  ],
};

export const INITIAL_PHONE_LISTINGS: PhoneListing[] = [
  // 1. Apple iPhone 18 Pro Max (Flagman / Kamerofon)
  {
    id: 'phone-000-max',
    title: 'Apple iPhone 18 Pro Max 512GB Cosmic Titanium',
    brand: 'Apple',
    model: 'iPhone 18 Pro Max',
    category: 'flagship',
    series: 'iPhone 18',
    storage: '512GB',
    ram: '12GB',
    color: 'Cosmic Titanium',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 1590,
    priceUzs: 1590 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Zavod qutisi', 'Original to\'qilgan USB-C kabel', '1 yil rasmiy kafolat taloni'],
    city: 'Toshkent',
    seller: {
      name: 'Apple Premium Reseller Tashkent',
      phone: '+998 90 000 18 18',
      telegram: 'apple_reseller_uz',
      type: 'verified_partner',
      rating: 5.0,
      dealsCount: 380
    },
    images: [
      '/src/assets/images/phone_iphone_titanium_1792582841706.jpg',
      '/src/assets/images/hero_smartphones_showcase_1792582840711.jpg'
    ],
    description: 'Yangi avlod flagmani: Apple iPhone 18 Pro Max! A19 Pro neyron chipi, titan korpus va periskop zum. To\'liq UzIMEI ro\'yxatdan o\'tgan.',
    createdAt: '2026-10-21T05:50:00Z',
    isFeatured: true,
    viewsCount: 2890
  },

  // 2. Apple iPhone 18 Pro (Flagman)
  {
    id: 'phone-000-pro',
    title: 'Apple iPhone 18 Pro 256GB Desert Titanium',
    brand: 'Apple',
    model: 'iPhone 18 Pro',
    category: 'flagship',
    series: 'iPhone 18',
    storage: '256GB',
    ram: '12GB',
    color: 'Desert Titanium',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 1390,
    priceUzs: 1390 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Yangi ochilmagan qutisi', 'USB-C kabel', 'Chek va kafolat'],
    city: 'Toshkent',
    seller: {
      name: 'iStore Official Tashkent',
      phone: '+998 90 123 45 67',
      telegram: 'istore_uz',
      type: 'verified_partner',
      rating: 4.9,
      dealsCount: 260
    },
    images: [
      '/src/assets/images/phone_iphone_titanium_1792582841706.jpg',
      '/src/assets/images/hero_smartphones_showcase_1792582840711.jpg'
    ],
    description: 'Yangi Apple iPhone 18 Pro 256GB. Kompakt o\'lcham va flagman quvvati. 100% original, to\'liq UzIMEI kafolatlangan.',
    createdAt: '2026-10-21T05:40:00Z',
    isFeatured: true,
    viewsCount: 2150
  },

  // 3. Samsung Galaxy S24 Ultra (Kamerofon & Flagman)
  {
    id: 'phone-002',
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    category: 'camera',
    series: 'Galaxy S',
    storage: '512GB',
    ram: '12GB',
    color: 'Titanium Black',
    condition: 'ideal',
    batteryHealth: 98,
    priceUsd: 1080,
    priceUzs: 1080 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 8,
    boxAndAccessories: ['To\'liq qutisi', 'Original S-Pen', 'Type-C kabel', 'Original 45W tezkor blok'],
    city: 'Xorazm',
    seller: {
      name: 'Urganch Mobile Plus',
      phone: '+998 97 765 43 21',
      telegram: 'urganch_gadget',
      type: 'store',
      rating: 4.8,
      dealsCount: 54
    },
    images: [
      '/src/assets/images/phone_samsung_ultra_1792582841173.jpg'
    ],
    description: '200MP sun\'iy intellektli kamera, 100x Space Zoom va titanium rom. G\'ilofda ehtiyotlab tutilgan.',
    createdAt: '2026-10-19T14:15:00Z',
    isFeatured: true,
    viewsCount: 1980
  },

  // 4. Samsung Galaxy Z Fold 6 (Bukiluvchi)
  {
    id: 'phone-007',
    title: 'Samsung Galaxy Z Fold 6 256GB Silver Shadow',
    brand: 'Samsung',
    model: 'Galaxy Z Fold 6',
    category: 'foldable',
    series: 'Galaxy Z',
    storage: '256GB',
    ram: '12GB',
    color: 'Silver Shadow',
    condition: 'ideal',
    batteryHealth: 99,
    priceUsd: 1380,
    priceUzs: 1380 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 10,
    boxAndAccessories: ['To\'liq qutisi', 'Hujjatlari', 'S-Penli original g\'ilof sovga'],
    city: 'Qashqadaryo',
    seller: {
      name: 'Qarshi Smart Gadgets',
      phone: '+998 75 200 11 22',
      telegram: 'qarshi_mobiles',
      type: 'verified_partner',
      rating: 5.0,
      dealsCount: 180
    },
    images: [
      '/src/assets/images/phone_samsung_ultra_1792582841173.jpg'
    ],
    description: 'Katta bukiluvchi ekran: planshet va smartfon 2 tasi 1 da! Eng yangi yupqa korpus va menteşe tizimi.',
    createdAt: '2026-10-21T02:10:00Z',
    isFeatured: true,
    viewsCount: 2650
  },

  // 5. Samsung Galaxy Z Flip 6 (Bukiluvchi / Yilqiroq)
  {
    id: 'phone-009',
    title: 'Samsung Galaxy Z Flip 6 256GB Mint Green',
    brand: 'Samsung',
    model: 'Galaxy Z Flip 6',
    category: 'foldable',
    series: 'Galaxy Z',
    storage: '256GB',
    ram: '12GB',
    color: 'Mint Green',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 840,
    priceUzs: 840 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Original qutisi', 'Kabel', 'Kafolat qog\'ozi'],
    city: 'Samarqand',
    seller: {
      name: 'Samarqand Gadget Center',
      phone: '+998 93 111 22 33',
      telegram: 'gadget_sam',
      type: 'store',
      rating: 4.8,
      dealsCount: 88
    },
    images: [
      '/src/assets/images/phone_samsung_ultra_1792582841173.jpg'
    ],
    description: 'Kompakt bukiluvchi cho\'ntakbop flagman! 50MP kamera va katta tashqi ekran (FlexWindow).',
    createdAt: '2026-10-21T04:10:00Z',
    isFeatured: false,
    viewsCount: 1240
  },

  // 6. Xiaomi 14 Ultra (Kamerofon)
  {
    id: 'phone-004',
    title: 'Xiaomi 14 Ultra 512GB Leica Photography Edition',
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra (Leica)',
    category: 'camera',
    series: 'Xiaomi Flagship',
    storage: '512GB',
    ram: '16GB',
    color: 'Midnight Black',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 940,
    priceUzs: 940 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Katta qutisi', '90W tezkor zaryadlash bloki', 'Leica kamera qoplamasi'],
    city: 'Navoiy',
    seller: {
      name: 'Navoiy Texno Store',
      phone: '+998 91 234 56 78',
      telegram: 'navoiy_texno',
      type: 'store',
      rating: 4.9,
      dealsCount: 130
    },
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Haqiqiy professional kamerali flagman! Leica 1 dyuymli sensori, o\'zgaruvchan diafragma va 90W tezkor zaryadka.',
    createdAt: '2026-10-20T09:00:00Z',
    isFeatured: true,
    viewsCount: 1750
  },

  // 7. Poco F6 Pro (O'yinbop / Gaming)
  {
    id: 'phone-010',
    title: 'Xiaomi Poco F6 Pro 512GB Cyber Black 120Hz',
    brand: 'Xiaomi',
    model: 'Poco F6 Pro',
    category: 'gaming',
    series: 'Poco Gaming',
    storage: '512GB',
    ram: '16GB',
    color: 'Cyber Black',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 460,
    priceUzs: 460 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Qutisi', '120W HyperCharge quvvatlagich', 'O\'yinbop g\'ilof'],
    city: 'Surxondaryo',
    seller: {
      name: 'Termiz GameZone',
      phone: '+998 90 777 88 99',
      telegram: 'termiz_game',
      type: 'store',
      rating: 4.9,
      dealsCount: 95
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Snapdragon 8 Gen 2 kuchli protsessori, 120W o\'ta tezkor zaryadlash va LiquidCool sovitish tizimi. PUBG va Genshin Impact 120 FPS!',
    createdAt: '2026-10-20T18:00:00Z',
    isFeatured: false,
    viewsCount: 1890
  },

  // 8. Google Pixel 9 Pro Fold (Bukiluvchi & Kamera)
  {
    id: 'phone-011',
    title: 'Google Pixel 9 Pro Fold 256GB Obsidian',
    brand: 'Google',
    model: 'Pixel 9 Pro Fold',
    category: 'foldable',
    series: 'Pixel Fold',
    storage: '256GB',
    ram: '16GB',
    color: 'Obsidian',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 1490,
    priceUzs: 1490 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Zavod qutisi', 'Type-C kabel', 'Google kafolat taloni'],
    city: 'Jizzax',
    seller: {
      name: 'Jizzax Smart Mobile',
      phone: '+998 95 111 44 77',
      telegram: 'jizzax_smart',
      type: 'verified_partner',
      rating: 5.0,
      dealsCount: 120
    },
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Google kompaniyasining eng yupqa bukiluvchi smartfoni! Katta 8 dyuymli Super Actua ekrani va Gemini AI imkoniyatlari.',
    createdAt: '2026-10-21T03:30:00Z',
    isFeatured: true,
    viewsCount: 1420
  },

  // 9. Samsung Galaxy A55 5G (Hamyonbop / Budget)
  {
    id: 'phone-012',
    title: 'Samsung Galaxy A55 5G 128GB Awesome Iceblue',
    brand: 'Samsung',
    model: 'Galaxy A55 5G',
    category: 'budget',
    series: 'Galaxy A',
    storage: '128GB',
    ram: '8GB',
    color: 'Awesome Iceblue',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 310,
    priceUzs: 310 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Original qutisi', 'Kabel', '1 yillik rasmiy kafolat'],
    city: 'Farg\'ona',
    seller: {
      name: 'Farg\'ona TexnoMarket',
      phone: '+998 91 666 55 44',
      telegram: 'fergana_texno',
      type: 'store',
      rating: 4.7,
      dealsCount: 210
    },
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'O\'rta toifadagi eng xaridorgir telefon! Metall rom, shisha korpus, suvdan IP67 himoya va 5000 mAh batareya.',
    createdAt: '2026-10-18T12:00:00Z',
    isFeatured: false,
    viewsCount: 2300
  },

  // 10. Redmi Note 13 Pro+ 5G (Hamyonbop & Kamera)
  {
    id: 'phone-013',
    title: 'Xiaomi Redmi Note 13 Pro+ 5G 256GB Aurora Purple',
    brand: 'Xiaomi',
    model: 'Redmi Note 13 Pro+ 5G',
    category: 'budget',
    series: 'Redmi Note',
    storage: '256GB',
    ram: '12GB',
    color: 'Aurora Purple',
    condition: 'ideal',
    batteryHealth: 99,
    priceUsd: 320,
    priceUzs: 320 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 9,
    boxAndAccessories: ['To\'liq qutisi', '120W quvvatlagich blok', 'Original g\'ilof'],
    city: 'Andijon',
    seller: {
      name: 'Shavkatbek M.',
      phone: '+998 90 222 33 44',
      type: 'individual',
      rating: 4.8,
      dealsCount: 26
    },
    images: [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=900&auto=format&fit=crop&q=80'
    ],
    description: '200MP kamera, bukilgan AMOLED ekran, 120W tezkor zaryadlash (19 daqiqada 100%). Holati deyarli yangi.',
    createdAt: '2026-10-19T10:15:00Z',
    isFeatured: false,
    viewsCount: 1950
  },

  // 11. Apple iPhone 15 Pro (Flagman / Kamerofon)
  {
    id: 'phone-003',
    title: 'Apple iPhone 15 Pro 128GB Blue Titanium',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    category: 'flagship',
    series: 'iPhone 15',
    storage: '128GB',
    ram: '8GB',
    color: 'Blue Titanium',
    condition: 'ideal',
    batteryHealth: 94,
    priceUsd: 840,
    priceUzs: 840 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 4,
    boxAndAccessories: ['Qutisi', 'Original to\'qilgan kabel', 'Spigen g\'ilof'],
    city: 'Samarqand',
    seller: {
      name: 'SmartZone Samarqand',
      phone: '+998 93 456 78 90',
      telegram: 'smartzone_sam',
      type: 'store',
      rating: 4.7,
      dealsCount: 112
    },
    images: [
      '/src/assets/images/phone_iphone_titanium_1792582841706.jpg'
    ],
    description: 'A17 Pro protsessor, titan korpus, 120Hz ProMotion ekrani. Batareya 94%. Usta ko\'rmagan.',
    createdAt: '2026-10-18T18:00:00Z',
    isFeatured: false,
    viewsCount: 1150
  },

  // 12. Apple iPhone 13 (Hamyonbop Apple)
  {
    id: 'phone-014',
    title: 'Apple iPhone 13 128GB Midnight Black',
    brand: 'Apple',
    model: 'iPhone 13',
    category: 'budget',
    series: 'iPhone 13',
    storage: '128GB',
    ram: '4GB',
    color: 'Midnight',
    condition: 'good',
    batteryHealth: 87,
    priceUsd: 410,
    priceUzs: 410 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 2,
    boxAndAccessories: ['Qutisi bor', 'Kabel', 'Shisha himoya qo\'yilgan'],
    city: 'Buxoro',
    seller: {
      name: 'Ulug\'bek Saidov',
      phone: '+998 91 888 22 11',
      telegram: 'ulugbek_buxoro',
      type: 'individual',
      rating: 4.8,
      dealsCount: 19
    },
    images: [
      '/src/assets/images/phone_iphone_titanium_1792582841706.jpg'
    ],
    description: 'Juda mashhur va ishonchli iPhone 13. Kameralari tiniq, Face ID va True Tone ishlaydi.',
    createdAt: '2026-10-17T09:30:00Z',
    isFeatured: false,
    viewsCount: 1620
  },

  // 13. Honor Magic6 Pro (Kamerofon)
  {
    id: 'phone-008',
    title: 'Honor Magic6 Pro 512GB Epi Green (Falcon Camera)',
    brand: 'Honor',
    model: 'Honor Magic6 Pro',
    category: 'camera',
    series: 'Honor Magic',
    storage: '512GB',
    ram: '12GB',
    color: 'Epi Green',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 890,
    priceUzs: 890 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['To\'liq qutisi', '80W original zaryadka', 'Zavod g\'ilofi'],
    city: 'Andijon',
    seller: {
      name: 'Andijon TexnoBozor',
      phone: '+998 90 999 00 11',
      telegram: 'andijon_texno',
      type: 'store',
      rating: 4.7,
      dealsCount: 95
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80'
    ],
    description: '180MP periskop telephoto kamera, 5600 mAh kremniy-uglerodli akkumulyator. DxOMark yetakchisi.',
    createdAt: '2026-10-15T08:30:00Z',
    isFeatured: false,
    viewsCount: 710
  },

  // 14. Realme GT 6 (O'yinbop / Gaming)
  {
    id: 'phone-015',
    title: 'Realme GT 6 512GB Fluid Silver 6000 nit',
    brand: 'Realme',
    model: 'Realme GT 6',
    category: 'gaming',
    series: 'Realme GT',
    storage: '512GB',
    ram: '16GB',
    color: 'Fluid Silver',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 490,
    priceUzs: 490 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Original qutisi', '120W zaryadlovchi blok', 'G\'ilof'],
    city: 'Namangan',
    seller: {
      name: 'Namangan Mobile City',
      phone: '+998 97 222 11 00',
      telegram: 'namangan_mobile',
      type: 'store',
      rating: 4.9,
      dealsCount: 160
    },
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Dunyoning eng yorug\' ekrani (6000 nit!), Snapdragon 8s Gen 3 va 120W tezkor zaryadka.',
    createdAt: '2026-10-21T01:00:00Z',
    isFeatured: false,
    viewsCount: 930
  },
  // 15. Asus ROG Phone 8 Pro (Geyming / O'yinbop)
  {
    id: 'phone-asus-rog8',
    title: 'Asus ROG Phone 8 Pro 512GB Phantom Black (165Hz)',
    brand: 'Asus',
    model: 'Asus ROG Phone 8 Pro (165Hz)',
    category: 'gaming',
    series: 'ROG Phone 8',
    storage: '512GB',
    ram: '16GB',
    color: 'Phantom Black AniMe Matrix',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 1050,
    priceUzs: 1050 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['ROG maxsus quti', '65W HyperCharge adapter', 'AeroActive Cooler 8 sovitkich', 'Braided Type-C kabel'],
    city: 'Toshkent',
    seller: {
      name: 'CyberTech Gaming Zone',
      phone: '+998 90 777 88 99',
      telegram: 'cybertech_uz',
      type: 'verified_partner',
      rating: 5.0,
      dealsCount: 220
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Haqiqiy geymerlar uchun: Snapdragon 8 Gen 3, 165Hz Samsung AMOLED, AniMe Matrix mini-LED orqa panel va faol sovitish tizimi.',
    createdAt: '2026-10-21T07:10:00Z',
    isFeatured: true,
    viewsCount: 1420
  },
  // 16. Huawei Pura 70 Ultra (Kamerofon / Flagman)
  {
    id: 'phone-huawei-pura70',
    title: 'Huawei Pura 70 Ultra 512GB Chanson Green (Suriluvchi Kamera)',
    brand: 'Huawei',
    model: 'Huawei Pura 70 Ultra (Suriluvchi Ob\'yektiv)',
    category: 'camera',
    series: 'Pura 70',
    storage: '512GB',
    ram: '16GB',
    color: 'Chanson Green Eko-charm',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 1190,
    priceUzs: 1190 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Zavod qutisi', '100W SuperCharge adapter', 'Monogrammali g\'ilof', 'Kafolat taloni'],
    city: 'Toshkent',
    seller: {
      name: 'Huawei Official Experience Store',
      phone: '+998 99 444 33 22',
      telegram: 'huawei_flagship_uz',
      type: 'verified_partner',
      rating: 4.9,
      dealsCount: 310
    },
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Mobil fotografiyaning cho\'qqisi: 1 dyuymli mexanik suriluvchi sensor, ultra-tezkor Ultra Speed Snapshot va sun\'iy yo\'ldosh aloqasi.',
    createdAt: '2026-10-21T06:50:00Z',
    isFeatured: true,
    viewsCount: 1680
  },
  // 17. Vivo X Fold 3 Pro (Bukiluvchi / Foldable)
  {
    id: 'phone-vivo-xfold3',
    title: 'Vivo X Fold 3 Pro 512GB Solar White (Eng yengil Fold)',
    brand: 'Vivo',
    model: 'Vivo X Fold 3 Pro (Eng yengil Fold)',
    category: 'foldable',
    series: 'X Fold 3',
    storage: '512GB',
    ram: '16GB',
    color: 'Solar White',
    condition: 'ideal',
    batteryHealth: 99,
    priceUsd: 1350,
    priceUzs: 1350 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 11,
    boxAndAccessories: ['Original quti', '100W FlashCharge blok', 'Charm g\'ilof'],
    city: 'Toshkent',
    seller: {
      name: 'Premium Mobile Tashkent',
      phone: '+998 90 123 45 67',
      telegram: 'premium_mob_uz',
      type: 'store',
      rating: 4.9,
      dealsCount: 195
    },
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Dunyoning eng yengil va mustahkam bukiluvchi smartfoni! Zeiss T* optikasi, Snapdragon 8 Gen 3 va 5700 mAh uglerod batareyasi.',
    createdAt: '2026-10-21T06:30:00Z',
    isFeatured: true,
    viewsCount: 1120
  },
  // 18. Vivo X100 Ultra (Kamerofon / Zeiss)
  {
    id: 'phone-vivo-x100u',
    title: 'Vivo X100 Ultra 512GB Titanium (Zeiss 200MP APO)',
    brand: 'Vivo',
    model: 'Vivo X100 Ultra (Zeiss 200MP APO)',
    category: 'camera',
    series: 'X100 Series',
    storage: '512GB',
    ram: '16GB',
    color: 'Titanium Grey',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 980,
    priceUzs: 980 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['To\'liq zavod quti', '80W FlashCharge', 'Zeiss sertifikati'],
    city: 'Samarqand',
    seller: {
      name: 'Samarqand Electronics',
      phone: '+998 93 300 12 34',
      telegram: 'sam_electr',
      type: 'store',
      rating: 4.8,
      dealsCount: 140
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Thanos laqabli kamera qiroli: 200MP Zeiss APO periskop telefoto kamera, 1 dyuym Sony LYT-900 asosiy sensor.',
    createdAt: '2026-10-21T05:40:00Z',
    isFeatured: false,
    viewsCount: 980
  },
  // 19. Tecno Spark 20 Pro+ (Hamyonbop / Byudjet)
  {
    id: 'phone-spark-20pro',
    title: 'Tecno Spark 20 Pro+ 256GB Temporal Orbits (Kavisli AMOLED)',
    brand: 'Spark',
    model: 'Tecno Spark 20 Pro+ (Kavisli AMOLED)',
    category: 'budget',
    series: 'Spark 20',
    storage: '256GB',
    ram: '8GB+8GB',
    color: 'Temporal Orbits Gold',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 175,
    priceUzs: 175 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 13,
    boxAndAccessories: ['Qutisi', '33W Super Charge', 'Silikon g\'ilof', '13 oylik Carlcare kafolat'],
    city: 'Toshkent',
    seller: {
      name: 'Tecno Official Store Tashkent',
      phone: '+998 90 888 12 12',
      telegram: 'tecno_uzbekistan',
      type: 'verified_partner',
      rating: 4.8,
      dealsCount: 430
    },
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'O\'z toifasining eng chiroyli smartfoni: 120Hz kavisli AMOLED ekran, 108MP kamera va Helio G99 Ultimate protsessor.',
    createdAt: '2026-10-21T05:20:00Z',
    isFeatured: false,
    viewsCount: 1540
  },
  // 20. Infinix GT 20 Pro (O'yinbop / Geyming)
  {
    id: 'phone-infinix-gt20',
    title: 'Infinix GT 20 Pro 256GB Mecha Silver (Cyber Gaming 144Hz)',
    brand: 'Infinix',
    model: 'Infinix GT 20 Pro (Mecha Dizayn Gaming)',
    category: 'gaming',
    series: 'GT Series',
    storage: '256GB',
    ram: '12GB',
    color: 'Mecha Silver RGB',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 295,
    priceUzs: 295 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Mecha futuristik quti', '45W tezkor adapter', 'Gaming g\'ilof', 'Magnitli sovitkich'],
    city: 'Andijon',
    seller: {
      name: 'Andijon Mobile Market',
      phone: '+998 97 555 66 77',
      telegram: 'andijon_infinix',
      type: 'store',
      rating: 4.9,
      dealsCount: 210
    },
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'PUBG Mobile 120 FPS rasmiy chempionat smartfoni: Dimensity 8200 Ultimate, Pixelworks displey chipi va RGB yoritgich.',
    createdAt: '2026-10-21T04:50:00Z',
    isFeatured: true,
    viewsCount: 1390
  },
  // 21. Nokia G42 5G (Hamyonbop / Byudjet)
  {
    id: 'phone-nokia-g42',
    title: 'Nokia G42 5G 128GB So Purple (QuickFix ta\'mirlanuvchi)',
    brand: 'Nokia',
    model: 'Nokia G42 5G (QuickFix ta\'mirlanuvchi)',
    category: 'budget',
    series: 'G-Series',
    storage: '128GB',
    ram: '6GB',
    color: 'So Purple',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 190,
    priceUzs: 190 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 24,
    boxAndAccessories: ['Ekologik qayta ishlangan quti', 'Zaryadlovchi kabel', 'iFixit yo\'riqnomasi', '2 yil rasmiy kafolat'],
    city: 'Farg\'ona',
    seller: {
      name: 'Nokia Rasmiy Distribyutori',
      phone: '+998 90 333 99 00',
      telegram: 'nokia_uz',
      type: 'verified_partner',
      rating: 4.8,
      dealsCount: 180
    },
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Afsonaviy Nokia sifati: Snapdragon 480+ 5G, 50MP kamera, 3 kunlik batareya va o\'zingiz mustaqil ta\'mirlay oladigan QuickFix korpus.',
    createdAt: '2026-10-21T04:20:00Z',
    isFeatured: false,
    viewsCount: 860
  },
  // 22. Redmi K70 Ultra (O'yinbop / Geyming)
  {
    id: 'phone-redmi-k70u',
    title: 'Redmi K70 Ultra 512GB Ink Rock Black (Dimensity 9300+)',
    brand: 'Redmi',
    model: 'Redmi K70 Ultra (Dimensity 9300+)',
    category: 'gaming',
    series: 'K70 Series',
    storage: '512GB',
    ram: '16GB',
    color: 'Ink Rock Black',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 380,
    priceUzs: 380 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['K70 Ultra maxsus quti', '120W HyperCharge adapter', 'Original qora g\'ilof'],
    city: 'Toshkent',
    seller: {
      name: 'Xiaomi Mi Store Malika',
      phone: '+998 97 100 20 30',
      telegram: 'redmi_k_seriya',
      type: 'store',
      rating: 4.9,
      dealsCount: 390
    },
    images: [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'AnTuTu 2.38 million ball! Dimensity 9300+ protsessori, 144Hz 1.5K OLED ekran, 120W zaryadka va IP68 suv o\'tkazmaslik.',
    createdAt: '2026-10-21T03:50:00Z',
    isFeatured: true,
    viewsCount: 1720
  },
  // 23. Samsung Galaxy S25 Ultra (Flagman / Kamerofon)
  {
    id: 'phone-samsung-s25u',
    title: 'Samsung Galaxy S25 Ultra 512GB Titanium Silver Shadow',
    brand: 'Samsung',
    model: 'Galaxy S25 Ultra',
    category: 'flagship',
    series: 'Galaxy S25',
    storage: '512GB',
    ram: '16GB',
    color: 'Titanium Silver Shadow',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 1300,
    priceUzs: 1300 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Zavod qutisi', 'S-Pen stilus', 'Type-C kabel', 'Rasmiy Samsung kafolati'],
    city: 'Toshkent',
    seller: {
      name: 'Samsung Experience Store',
      phone: '+998 90 999 25 25',
      telegram: 'samsung_uzbekistan',
      type: 'verified_partner',
      rating: 5.0,
      dealsCount: 520
    },
    images: [
      '/src/assets/images/phone_samsung_ultra_1792582841173.jpg'
    ],
    description: '2025/2026 yil flagmani: Snapdragon 8 Elite for Galaxy, dumaloqlangan yengil titan rom, Galaxy AI 2.0 va 200MP sun\'iy aql kamerasi.',
    createdAt: '2026-10-21T03:10:00Z',
    isFeatured: true,
    viewsCount: 2450
  },
  // 24. Huawei Mate X5 (Bukiluvchi / Foldable)
  {
    id: 'phone-huawei-matex5',
    title: 'Huawei Mate X5 Fold 512GB Feather Sand Purple (Kunlun Glass)',
    brand: 'Huawei',
    model: 'Huawei Mate X5 (Foldable Kunlun)',
    category: 'foldable',
    series: 'Mate X5',
    storage: '512GB',
    ram: '16GB',
    color: 'Feather Sand Purple',
    condition: 'ideal',
    batteryHealth: 98,
    priceUsd: 1490,
    priceUzs: 1490 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 10,
    boxAndAccessories: ['To\'liq lyuks quti', '66W SuperCharge', 'Maxsus stendli g\'ilof'],
    city: 'Sirdaryo',
    seller: {
      name: 'Guliston VIP Mobiles',
      phone: '+998 90 001 01 01',
      telegram: 'guliston_mobiles',
      type: 'verified_partner',
      rating: 5.0,
      dealsCount: 145
    },
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Ultra-chidamli Kunlun oynasi, IPX8 suv o\'tkazmaslik va eng ixcham bukiluvchi mexanizmga ega hashamatli biznes flagman.',
    createdAt: '2026-10-21T02:40:00Z',
    isFeatured: true,
    viewsCount: 1310
  },
  // 25. Nokia 3310 4G (Hamyonbop / Afsona)
  {
    id: 'phone-nokia-3310',
    title: 'Nokia 3310 4G Warm Red (Afsonaviy Batareya & Snake)',
    brand: 'Nokia',
    model: 'Nokia 3310 4G (Afsonaviy klaviatura)',
    category: 'budget',
    series: 'Classic',
    storage: '64GB',
    ram: '512MB',
    color: 'Warm Red',
    condition: 'new',
    batteryHealth: 100,
    priceUsd: 65,
    priceUzs: 65 * USD_TO_UZS_RATE,
    isOriginal: true,
    uzImeiRegistered: true,
    warrantyMonths: 12,
    boxAndAccessories: ['Qutisi', 'Original zaryadlovchi', 'Quloqchin', 'Kafolat qog\'ozi'],
    city: 'Qoraqalpog\'iston',
    seller: {
      name: 'Nukus Retro & Mobile',
      phone: '+998 91 400 55 66',
      telegram: 'nukus_classic',
      type: 'store',
      rating: 4.9,
      dealsCount: 290
    },
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=80'
    ],
    description: '30 kunlik avtonomiya, sindirib bo\'lmas korpus, 4G VoLTE qo\'ng\'iroqlar va mashhur Snake o\'yini!',
    createdAt: '2026-10-21T02:00:00Z',
    isFeatured: false,
    viewsCount: 2190
  }
];

export const INITIAL_ORDERS: OrderDetails[] = [
  {
    id: 'MB-841920',
    customerName: 'Jasur Bekmirzayev',
    customerPhone: '+998 90 987 65 43',
    city: 'Toshkent',
    address: 'Shayxontohur tumani, Navoiy ko\'chasi 24-uy',
    deliveryMethod: 'express',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        phone: INITIAL_PHONE_LISTINGS[0],
        quantity: 1
      }
    ],
    totalUzs: 1590 * USD_TO_UZS_RATE,
    totalUsd: 1590,
    createdAt: '2026-10-21T03:45:00Z',
    status: 'processing'
  },
  {
    id: 'MB-739102',
    customerName: 'Dilshod Rahmatov',
    customerPhone: '+998 93 512 34 56',
    city: 'Samarqand',
    address: 'Dagbit ko\'chasi 18-uy',
    deliveryMethod: 'standard',
    paymentMethod: 'payme',
    items: [
      {
        phone: INITIAL_PHONE_LISTINGS[2],
        quantity: 1
      }
    ],
    totalUzs: 1080 * USD_TO_UZS_RATE,
    totalUsd: 1080,
    createdAt: '2026-10-20T19:20:00Z',
    status: 'confirmed'
  },
  {
    id: 'MB-619283',
    customerName: 'Madina Umarova',
    customerPhone: '+998 97 123 99 88',
    city: 'Farg\'ona',
    address: 'Sayilgoh ko\'chasi 4-uy',
    deliveryMethod: 'express',
    paymentMethod: 'click',
    items: [
      {
        phone: INITIAL_PHONE_LISTINGS[3],
        quantity: 1
      }
    ],
    totalUzs: 1380 * USD_TO_UZS_RATE,
    totalUsd: 1380,
    createdAt: '2026-10-19T11:10:00Z',
    status: 'shipped'
  }
];

export const INITIAL_TRADE_IN_REQUESTS: TradeInRequest[] = [
  {
    id: 'TR-10492',
    clientName: 'Aziz Karimov',
    clientPhone: '+998 91 345 67 89',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    storage: '128GB',
    conditionSummary: 'Ekran toza, korpus yengil izlar, batareya 86%, qutisi bor',
    estimatedPriceUsd: 580,
    estimatedPriceUzs: 580 * USD_TO_UZS_RATE,
    branchOrCourier: 'Toshkent — Malika A-14',
    status: 'pending',
    createdAt: '2026-10-21T04:15:00Z'
  },
  {
    id: 'TR-10491',
    clientName: 'Sardor Ergashev',
    clientPhone: '+998 99 876 54 32',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    storage: '256GB',
    conditionSummary: 'Ideal 10/10, batareya 94%, to\'liq komplekt',
    estimatedPriceUsd: 620,
    estimatedPriceUzs: 620 * USD_TO_UZS_RATE,
    branchOrCourier: 'Kuryer orqali topshirish',
    status: 'approved',
    createdAt: '2026-10-20T16:30:00Z'
  },
  {
    id: 'TR-10489',
    clientName: 'Bekzod Toxirov',
    clientPhone: '+998 90 111 22 33',
    brand: 'Xiaomi',
    model: 'Xiaomi 13 Ultra',
    storage: '512GB',
    conditionSummary: 'Mayda tirnalishlar bor, qutisi yo\'q',
    estimatedPriceUsd: 450,
    estimatedPriceUzs: 450 * USD_TO_UZS_RATE,
    branchOrCourier: 'Samarqand — Registon',
    status: 'completed',
    createdAt: '2026-10-19T10:00:00Z'
  }
];

export const CITIES_OF_UZBEKISTAN = [
  'Barcha viloyatlar',
  'Toshkent',
  'Samarqand',
  'Farg\'ona',
  'Andijon',
  'Namangan',
  'Buxoro',
  'Xorazm',
  'Navoiy',
  'Qashqadaryo',
  'Surxondaryo',
  'Jizzax',
  'Sirdaryo',
  'Qoraqalpog\'iston'
];
