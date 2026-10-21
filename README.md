# Cross-Border-E-Commerce

AI prototype for a cross-border ecommerce MVP focused on:

- AI competitor analysis
- Amazon Listing localization
- TikTok Shop ad script generation
- skill-assisted product opportunity scoring
- cost, exchange-rate, and margin simulation
- image, sourcing, and service-provider readiness checks

## MVP Decisions

- First platforms: Amazon and TikTok Shop
- First target market: United States
- Input priority: link parsing first, manual pasted facts as fallback
- Export format: real Word `.docx`
- Account model: single-user version first

## Product Flow

1. Create one product project.
2. Add product and competitor links.
3. Review parsed product facts.
4. Generate competitor analysis.
5. Generate Amazon Listing copy.
6. Generate TikTok Shop ad scripts.
7. Review the skill-assisted opportunity brief.
8. Edit output manually.
9. Export a Word `.docx` file.

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

This is a front-end MVP prototype. The current link parsing and AI generation behavior is simulated in the browser to validate the workflow, data fields, and UI layout before connecting real backend services.

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

## DOCX Export

Click `Export DOCX` to save the current output tab. In Chrome on localhost, the app uses the system save dialog first so the user can choose the exact save location. If the browser does not support that API, it falls back to a normal browser download.

After every export attempt, the page also creates a `Manual DOCX download` link under the export status message. Use that link if the browser save dialog is blocked, canceled, or hidden behind another window.

Backend work expected after prototype validation:

- URL parser service for Amazon and TikTok Shop
- AI generation API gateway
- prompt templates by output type
- server-side `.docx` template export, if richer document styling is needed later
- project persistence
- audit-safe logging without sensitive user data
