# Cross-Border-E-Commerce

AI prototype for a cross-border ecommerce MVP focused on:

- Chinese cross-border ecommerce operation report
- English Amazon Listing localization
- English TikTok Shop ad script generation
- skill-orchestrated opportunity scoring
- cost, exchange-rate, and margin simulation
- image, sourcing, and service-provider readiness checks

## MVP Decisions

- First platforms: Amazon and TikTok Shop
- First target market: United States
- Input priority: link parsing first, manual pasted facts as fallback
- Export format: real `.docx`, with manual download and print fallback
- Account model: single-user version first

## Product Flow

1. Select Amazon and/or TikTok Shop.
2. Add product link, competitor links, and product facts.
3. Add sale price, purchase cost, shipping cost, ad cost, and exchange rate.
4. Generate a Chinese operation report.
5. Review visual KPIs, skill orchestration results, competitor insights, action items, and English assets.
6. Export the full report as a `.docx` file when needed.
7. If browser download is blocked, use the manual link or printable view.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current Prototype Scope

This is a front-end MVP prototype. The current link parsing, competitor readout, scoring, and AI generation behavior is simulated in the browser to validate the workflow, report structure, data fields, and UI layout before connecting real backend services.

## Skill-Inspired Modules

The prototype now models these uploaded skill capabilities as product modules:

- `ecom-product-orchestrator`: product workflow orchestration
- `product-spy`: trend and competitor signal checks
- `blue-ocean-sourcing`: sourcing gate and factory vetting
- `global-price-comparison`: price spread normalization
- `exchange-rate`: CNY/USD cost conversion
- `ecommerce-listing-generator`: Amazon listing rules
- `skill-listing-image-optimizer`: Amazon image readiness checks
- `mjzj-sp`: logistics and service-provider follow-up tasks

These modules are currently simulated in the browser. They define the UX, fields, and output contract before real API credentials and backend pipelines are connected.

## Word Export

Click `Export DOCX` to save the full Chinese operation report as a real `.docx` file. The DOCX generator is lazy-loaded only when the user exports, keeping the initial app lighter.

After every export attempt, the page also creates a manual download link under the export status message. If the browser blocks or hides the automatic download, use the manual link or open the printable view.

- `打印版`: opens a clean printable report view

Backend work expected after prototype validation:

- URL parser service for Amazon and TikTok Shop
- AI generation API gateway
- prompt templates by output type
- optional server-side `.docx` template export, if richer document styling is needed later
- project persistence
- audit-safe logging without sensitive user data
