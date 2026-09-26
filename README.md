# Kaamgar (working title)

A dual-role marketplace connecting hirers and workers for any local, in-person job or service — skilled or unskilled — starting in Mumbai. Built as a Next.js Progressive Web App (TypeScript, Tailwind, MongoDB).

## Documentation

Full product and technical documentation lives in [`/docs`](./docs):

| Document | Covers |
|---|---|
| `PRD.docx` | Scope, access model, functional requirements |
| `DataModel.docx` | MongoDB schema, indexes, entity relationships |
| `TRD.docx` | System architecture, security, hosting |
| `APISpec.docx` | Every endpoint, request/response shapes |
| `UserFlows.docx` | Visual flow diagrams for core journeys |
| `DesignSystem.docx` | Colour palette, typography, screen mockups |

Start with the PRD if you're new to the project — everything else builds on it.

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB (Atlas), with 2dsphere geospatial indexing
- **Auth:** Phone + OTP, access/refresh token pair
- **Payments:** Razorpay (UPI rails)
- **Platform:** PWA, packaged for Play Store via Trusted Web Activity (TWA)
- **Languages:** English, Hindi, Marathi

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev
```

## Status

Early development. See the PRD's "Open Questions" section for decisions still pending (monetization model, cancellation penalty policy, final product name).