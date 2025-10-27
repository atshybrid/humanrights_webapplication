# Human Rights Council - Next.js Starter (Wired to HRCI APIs)

This project is a ready-to-run **Next.js + Tailwind CSS** landing site wired to the public HRCI APIs you provided.

## What changed
- `lib/api.js` now uses `https://app.hrcitodaynews.in/api/v1` as default and provides helpers:
  - `getOrgSettings()`
  - `getDonationEvents()`
  - `getEventById(id)`
  - `getTopDonors()`
  - `getStories()`
  - `getStoryById(id)`
- Components fetch real data client-side and gracefully fall back to included SVG placeholders in `/public/images`.
- Sample SVG images are embedded in `public/images/` so the project is fully self-contained and shows visual assets even without external image downloads.

## Quick start

1. Copy `.env.example` to `.env.local` if you want to override API URL:
```bash
cp .env.example .env.local
# edit .env.local if needed
```

2. Install dependencies and run:
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

