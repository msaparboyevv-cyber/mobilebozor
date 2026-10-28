import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PHONE_LISTINGS } from '../data/mockPhones';
import { filterPhoneListings } from './phoneFilters';
import { formatListingDate, formatListingPrice, getListingConditionLabel } from './phoneCardFormat';
import { getPhoneRecommendations } from './recommendations';

test('search matches model keywords case-insensitively and ignores extra whitespace', () => {
  const expected = INITIAL_PHONE_LISTINGS.filter((phone) => phone.model.toLowerCase().includes('iphone 15'));
  assert.deepEqual(filterPhoneListings(INITIAL_PHONE_LISTINGS, { query: '  IPHONE   15  ' }), expected.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
});

test('search matches city and storage keywords', () => {
  const phone = INITIAL_PHONE_LISTINGS.find((item) => item.city && item.storage);
  assert.ok(phone);
  const result = filterPhoneListings(INITIAL_PHONE_LISTINGS, { query: `${phone.city} ${phone.storage}` });
  assert.ok(result.some((item) => item.id === phone.id));
});

test('multiple filters compose and return only matching records', () => {
  const expected = INITIAL_PHONE_LISTINGS.filter((phone) => phone.brand === 'Samsung' && phone.priceUsd >= 200 && phone.priceUsd <= 1000);
  const actual = filterPhoneListings(INITIAL_PHONE_LISTINGS, { brand: 'Samsung', minimumPrice: 200, maximumPrice: 1000 });
  assert.deepEqual(actual.map((phone) => phone.id).sort(), expected.map((phone) => phone.id).sort());
});

test('brand, category, condition, storage, city, query, and price all combine', () => {
  const phone = INITIAL_PHONE_LISTINGS.find((item) => item.city && item.model);
  assert.ok(phone);
  const results = filterPhoneListings(INITIAL_PHONE_LISTINGS, {
    query: phone.model,
    brand: phone.brand,
    category: phone.category,
    condition: phone.condition,
    storage: phone.storage,
    city: phone.city,
    minimumPrice: phone.priceUsd,
    maximumPrice: phone.priceUsd,
  });
  assert.ok(results.some((item) => item.id === phone.id));
  assert.ok(results.every((item) => item.brand === phone.brand && item.category === phone.category && item.condition === phone.condition && item.storage === phone.storage && item.city === phone.city && item.priceUsd === phone.priceUsd));
});

test('price sort orders low to high and high to low', () => {
  const ascending = filterPhoneListings(INITIAL_PHONE_LISTINGS, { sortBy: 'price_asc' });
  const descending = filterPhoneListings(INITIAL_PHONE_LISTINGS, { sortBy: 'price_desc' });
  assert.ok(ascending.every((phone, index) => index === 0 || ascending[index - 1].priceUsd <= phone.priceUsd));
  assert.ok(descending.every((phone, index) => index === 0 || descending[index - 1].priceUsd >= phone.priceUsd));
});

test('battery sort puts higher recorded battery health first', () => {
  const sorted = filterPhoneListings(INITIAL_PHONE_LISTINGS, { sortBy: 'battery' });
  assert.ok(sorted.every((phone, index) => index === 0 || (sorted[index - 1].batteryHealth || 0) >= (phone.batteryHealth || 0)));
});

test('unmatched queries return an empty result without inventing listings', () => {
  assert.deepEqual(filterPhoneListings(INITIAL_PHONE_LISTINGS, { query: 'no-such-phone-model-98765' }), []);
});

test('invalid or reversed price ranges return no listings', () => {
  assert.deepEqual(filterPhoneListings(INITIAL_PHONE_LISTINGS, { minimumPrice: 1000, maximumPrice: 100 }), []);
  assert.deepEqual(filterPhoneListings(INITIAL_PHONE_LISTINGS, { minimumPrice: -1 }), []);
});

test('card price formatting uses only the selected stored currency value', () => {
  const phone = INITIAL_PHONE_LISTINGS[0];
  assert.match(formatListingPrice(phone, 'UZS'), /so‘m$/);
  assert.doesNotMatch(formatListingPrice(phone, 'UZS'), /\$/);
  assert.match(formatListingPrice(phone, 'USD'), /^\$/);
  assert.doesNotMatch(formatListingPrice(phone, 'USD'), /so‘m/);
});

test('card condition and date labels use listing values and omit invalid dates', () => {
  assert.equal(getListingConditionLabel('new'), 'Yangi');
  assert.equal(getListingConditionLabel('good'), 'Yaxshi');
  assert.equal(getListingConditionLabel('fair'), 'Qoniqarli');
  assert.ok(formatListingDate(INITIAL_PHONE_LISTINGS[0].createdAt));
  assert.equal(formatListingDate('not-a-date'), null);
});

test('recommendations are similar to the most viewed listing', () => {
  const seed = INITIAL_PHONE_LISTINGS[0];
  const second = INITIAL_PHONE_LISTINGS.find((phone) => phone.id !== seed.id && phone.brand === seed.brand);
  assert.ok(second);
  const recommendations = getPhoneRecommendations(INITIAL_PHONE_LISTINGS, { [seed.id]: 2, [second.id]: 9 });
  assert.equal(recommendations.basedOn?.id, second.id);
  assert.ok(recommendations.phones.length > 0);
  assert.ok(recommendations.phones.every((phone) => phone.id !== second.id && (phone.brand === second.brand || phone.category === second.category || phone.storage === second.storage)));
});

test('recommendations use existing featured listings before the user has a view history', () => {
  const recommendations = getPhoneRecommendations(INITIAL_PHONE_LISTINGS, {});
  assert.equal(recommendations.basedOn, null);
  assert.ok(recommendations.phones.every((phone) => phone.isFeatured));
});
