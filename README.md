# Sowji Collections – Frontend

React + Vite + Tailwind storefront. Brand: burgundy, champagne gold, ivory, charcoal, beige; Playfair Display / Poppins / Cormorant Garamond.

## Run locally
```bash
npm install
cp .env.example .env   # then fill values
npm run dev
```
Needs the backend API (stage 2) at `VITE_API_URL`. Until then, product grids show empty/error states (no hardcoded products).

## Environment (.env, no secrets)
- `VITE_API_URL` – backend base URL, e.g. https://your-api.onrender.com
- `VITE_WHATSAPP_NUMBER` – digits with country code, e.g. 91XXXXXXXXXX
- `VITE_INSTAGRAM_URL`, `VITE_SITE_URL`

## Deploy (Vercel)
Import the GitHub repo, framework Vite, build `npm run build`, output `dist`, add the env vars. `vercel.json` handles client-side routing.

## Stage 1 status
Done: design system, logo, header, footer, WhatsApp button, homepage, shop/category listing, cart/wishlist/compare store.
Next: product page, cart/checkout, accounts, admin.
