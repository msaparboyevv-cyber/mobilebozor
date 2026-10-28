import { PhoneListing } from '../types';

export type ListingCurrency = 'UZS' | 'USD';

export function formatListingPrice(phone: Pick<PhoneListing, 'priceUzs' | 'priceUsd'>, currency: ListingCurrency): string {
  return currency === 'UZS'
    ? `${phone.priceUzs.toLocaleString('uz-UZ')} so‘m`
    : `$${phone.priceUsd.toLocaleString('uz-UZ')}`;
}

export function getListingConditionLabel(condition: PhoneListing['condition']): string {
  switch (condition) {
    case 'new': return 'Yangi';
    case 'ideal': return 'Ideal';
    case 'good': return 'Yaxshi';
    case 'fair': return 'Qoniqarli';
  }
}

export function formatListingDate(createdAt: string): string | null {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('uz-UZ', { day: 'numeric', month: 'short' }).format(date);
}
