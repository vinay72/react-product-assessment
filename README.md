# Premium Outdoor Gear Product Page

This repository implements a production-style product detail page (PDP) for a premium outdoor gear store using React, Vite, TypeScript, and SCSS modules.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app locally:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## What’s included

- Product metadata fetched from Fake Store API (`https://fakestoreapi.com/products` and `https://fakestoreapi.com/products/:id`)
- Image gallery with thumbnail selection, mobile scrolling, and desktop hover zoom
- Colour swatches and size buttons with available/low-stock/sold-out states
- Quantity picker constrained by selected variant stock
- Add to cart persistence via `localStorage`
- Selected variant reflected in URL query string for deep-linking
- Responsive desktop/mobile layout
- Product details implemented as accessible tabs
- React Context for global cart state

## Folder structure

- `src/components` — reusable UI components
- `src/context` — cart state provider
- `src/hooks` — reusable hooks
- `src/data` — product configuration, stock, specs, reviews
- `src/styles` — global SCSS styles
- `src/types` — TypeScript type definitions

## Notes

- Cart data is saved to localStorage under `pdp-cart-state-v1`
- Cart state is also synced to Fake Store API cart endpoints for user `1`
- Product variant selection persists in the URL with `?color=...&size=...`
- Local static config adds premium gear details while still using Fake Store API for main product data

## Known trade-offs

- The gallery currently reuses the API image for all thumbnails. With more time, I would add variant-specific product imagery and a dedicated zoom lens.
- There is no cart drawer UI yet; only a cart badge count is shown.
- The app is a single-page product detail experience and does not include full routing.
