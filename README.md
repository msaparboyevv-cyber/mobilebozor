<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# MobileBozor

MobileBozor is a React 19 and Vite storefront demo for browsing, comparing, and listing phones.

## Run locally

**Prerequisite:** Node.js

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open `http://localhost:3000`.

## Demo data and persistence

This repository does not include a server API or database. Listings, favorites, cart contents, demo orders, trade-in requests, demo account data, and the demo admin password are stored in the current browser's local storage and are not shared with a store or other devices. The admin screen is client-side demo access, not production authentication. Online payments and real order processing are not connected. Do not enter sensitive information.

## Validation

- `npm run lint` checks TypeScript.
- `npm test` runs the phone filter and utility tests.
- `npm run build` creates the production bundle.
