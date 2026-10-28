import { PhoneListing, PhoneCategory, PhoneCondition } from '../types';

export type PhoneSort = 'newest' | 'price_asc' | 'price_desc' | 'battery';

export interface PhoneFilterOptions {
  query?: string;
  category?: PhoneCategory | 'all';
  brand?: string;
  condition?: PhoneCondition | 'all';
  storage?: string;
  city?: string;
  minimumPrice?: string | number;
  maximumPrice?: string | number;
  sortBy?: PhoneSort;
}

const normalize = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim();

export function filterPhoneListings(phones: PhoneListing[], options: PhoneFilterOptions = {}): PhoneListing[] {
  const queryWords = normalize(options.query || '').split(/\s+/).filter(Boolean);
  const minimumPrice = options.minimumPrice === '' || options.minimumPrice === undefined ? undefined : Number(options.minimumPrice);
  const maximumPrice = options.maximumPrice === '' || options.maximumPrice === undefined ? undefined : Number(options.maximumPrice);
  const sortBy = options.sortBy || 'newest';

  if ((minimumPrice !== undefined && (!Number.isFinite(minimumPrice) || minimumPrice < 0))
    || (maximumPrice !== undefined && (!Number.isFinite(maximumPrice) || maximumPrice < 0))
    || (minimumPrice !== undefined && maximumPrice !== undefined && minimumPrice > maximumPrice)) return [];

  return phones.filter((phone) => {
    const searchable = normalize([
      phone.title,
      phone.model,
      phone.brand,
      phone.series,
      phone.storage,
      phone.ram,
      phone.color,
      phone.city,
      phone.description,
      phone.condition,
    ].filter(Boolean).join(' '));

    if (queryWords.some((word) => !searchable.includes(word))) return false;
    if (options.category && options.category !== 'all' && phone.category !== options.category) return false;
    if (options.brand && options.brand !== 'all' && normalize(phone.brand) !== normalize(options.brand)) return false;
    if (options.condition && options.condition !== 'all' && phone.condition !== options.condition) return false;
    if (options.storage && options.storage !== 'all' && normalize(phone.storage) !== normalize(options.storage)) return false;
    if (options.city && options.city !== 'Barcha viloyatlar' && normalize(phone.city) !== normalize(options.city)) return false;
    if (minimumPrice !== undefined && Number.isFinite(minimumPrice) && phone.priceUsd < minimumPrice) return false;
    if (maximumPrice !== undefined && Number.isFinite(maximumPrice) && phone.priceUsd > maximumPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.priceUsd - b.priceUsd;
    if (sortBy === 'price_desc') return b.priceUsd - a.priceUsd;
    if (sortBy === 'battery') return (b.batteryHealth || 0) - (a.batteryHealth || 0);
    const dateDifference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return Number.isNaN(dateDifference) ? 0 : dateDifference;
  });
}
