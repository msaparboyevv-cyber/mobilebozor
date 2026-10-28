import { PhoneListing } from '../types';

export interface PhoneRecommendations {
  basedOn: PhoneListing | null;
  phones: PhoneListing[];
}

export function getPhoneRecommendations(
  phones: PhoneListing[],
  viewCounts: Record<string, number>,
  limit = 4,
  eligiblePhones: PhoneListing[] = phones,
): PhoneRecommendations {
  const mostViewed = Object.entries(viewCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => phones.find((phone) => phone.id === id))
    .find((phone): phone is PhoneListing => Boolean(phone));

  if (!mostViewed) {
    return {
      basedOn: null,
      phones: eligiblePhones.filter((phone) => phone.isFeatured).sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, limit),
    };
  }

  const similar = eligiblePhones
    .filter((phone) => phone.id !== mostViewed.id)
    .map((phone) => ({
      phone,
      score: (phone.brand === mostViewed.brand ? 3 : 0)
        + (phone.category === mostViewed.category ? 2 : 0)
        + (phone.storage === mostViewed.storage ? 1 : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.phone.viewsCount || 0) - (a.phone.viewsCount || 0))
    .slice(0, limit)
    .map((item) => item.phone);

  return { basedOn: mostViewed, phones: similar };
}
