# Cross-Border-E-Commerce

AI prototype for a cross-border ecommerce MVP focused on:

- AI competitor analysis
- Amazon Listing localization
- TikTok Shop ad script generation

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
7. Edit output manually.
8. Export a Word `.docx` file.

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

## DOCX Export

Click `Export DOCX` to save the current output tab. In Chrome on localhost, the app uses the system save dialog first so the user can choose the exact save location. If the browser does not support that API, it falls back to a normal browser download.

Backend work expected after prototype validation:

- URL parser service for Amazon and TikTok Shop
- AI generation API gateway
- prompt templates by output type
- server-side `.docx` template export, if richer document styling is needed later
- project persistence
- audit-safe logging without sensitive user data
