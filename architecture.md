# Architecture

Update this file when a module boundary or an external call changes.

## Overview
Static bilingual (ID/EN) portfolio/landing page for 404 Advisory. No backend, no build step - three plain files (`config.js`, `main.js`, `styles.css`) served as-is by GitHub Pages under the custom domain in `CNAME`. All content (brand copy, theme colors, project list, contact info) lives as data in `config.js`; `main.js` reads it once on page load and renders the DOM.

## Entry points
- `index.html` - loaded on every visit to the site root; pulls in `config.js` then `main.js` via `<script>` tags.
- `404.html` - served by GitHub Pages for any unmatched path; standalone page, does not load `config.js`/`main.js` (static markup only).

## Modules
Function-level detail (single-service static site, small enough to enumerate every function).

### config.js
- Purpose: data-only. Defines `window.CONFIG` - brand info, theme color tokens, the `projects` array (portfolio cards), and contact info. No functions, no logic.
- Depends on (this codebase): none.
- Called by / Depended on by (this codebase): `main.js` reads `window.CONFIG` at load.

### main.js
- Purpose: renders the entire page from `window.CONFIG`. Runs once, immediately, as an IIFE on script load.
- Key functions:
  - `byId(id)` - `document.getElementById` shorthand.
  - `normalizeUrl(value)` - prefixes bare domains with `https://`, passes through `http(s)/mailto/tel` links unchanged. Used by every link-rendering call below.
  - `hexToRgb(hex)` - converts a `#rrggbb`/`#rgb` theme color to an `"r, g, b"` string; feeds the `--shadow-rgb` CSS variable so card/button shadows tint to the active theme background instead of a hardcoded color.
  - `setLanguage(lang)` - sets `document.body.dataset.lang`, which `styles.css` uses to show/hide `[data-lang="id"]` / `[data-lang="en"]` elements. Exposed as `window.setLanguage`.
  - Inline render blocks (not separate named functions) build: header brand/nav, hero (title, tagline, description, social CTAs, Focus icon grid), about section, project cards grid (`projectsSection.innerHTML`), contact cards grid, footer year line.
- Depends on (this codebase): `config.js` (`window.CONFIG`), `index.html` (element IDs it queries: `brandName`, `brandLogo`, `favicon`, `brandNav`, `langSwitch`, `menuToggle`, `hero`, `about`, `projects`, `contact`, `footer`), `styles.css` (CSS custom properties it sets: `--base-font`, `--bg`, `--text`, `--muted`, `--card`, `--border`, `--accent`, `--accent-2`, `--shadow-rgb`).
- Called by / Depended on by (this codebase): none (top-level script, nothing else in-repo calls into it).
- External: fetches icon SVGs at render time from `api.iconify.design` (heroicons/simple-icons sets) for the email/Instagram/Threads contact icons and the hero Focus-area icons.

### styles.css
- Purpose: all visual styling and the dark-navy theme; CSS custom properties (`:root` block) are the theme's single source of truth and get overridden at runtime by `main.js` from `config.js` theme colors. Loads "Outfit" (body/headings) and "JetBrains Mono" (404 page numeral) from Google Fonts.
- Depends on (this codebase): none directly, but its selectors (`.hero`, `.projects-grid`, `.project-card`, `.contact-grid`, etc.) are a contract with the markup `main.js` generates.
- Called by / Depended on by (this codebase): `index.html`, `404.html` (both `<link>` it directly).
- External: `fonts.googleapis.com` / `fonts.gstatic.com` (Google Fonts CDN, `@import`-style `<link>` in each HTML file's `<head>`, not in this file itself).

### index.html
- Purpose: page shell - header/nav/lang-switch markup, empty `<section>` containers (`#hero`, `#about`, `#projects`, `#contact`) that `main.js` fills, meta/OG/Twitter/canonical tags, static `ProfessionalService` JSON-LD block (crawler-visible without JS), Google Fonts `<link>`, skip-to-content link, GA4 `gtag.js` snippet.
- Depends on (this codebase): `styles.css`, `config.js`, `main.js` (script load order matters: config before main).
- Called by / Depended on by (this codebase): none.
- External: GA4 tracking (`googletagmanager.com/gtag/js`, property `G-3FBTWXL6FR`) - see "External system boundaries" below.

### 404.html
- Purpose: branded not-found page GitHub Pages serves for any unmatched route. Static markup, no `config.js`/`main.js` dependency (renders even if the config/render pipeline is broken). Carries its own copy of the GA4 `gtag.js` snippet so 404 hits are still tracked.
- Depends on (this codebase): `styles.css` (shares base tokens; page-specific layout is inlined in a `<style>` block rather than added to `styles.css`, since it's the only consumer).
- Called by / Depended on by (this codebase): none.
- External: GA4 tracking (same as `index.html`).

### robots.txt / sitemap.xml / llms.txt
- Purpose: static SEO/LLM-discoverability files served as-is by GitHub Pages. `robots.txt` allows all crawlers and points at `sitemap.xml`. `sitemap.xml` lists the single homepage URL (one-page site with in-page anchors, not separate routes). `llms.txt` is a plain-text/Markdown summary (llmstxt.org convention) of services and project links, mirrored from `config.js` content for LLM answer-engine crawlers that don't execute JS.
- Depends on (this codebase): none (static, hand-maintained; not generated from `config.js` at build time since there is no build step).
- Called by / Depended on by (this codebase): none in-repo; consumed externally by search/LLM crawlers.

## Dependency graph (condensed)
```
config.js --> main.js --> index.html (DOM)
styles.css --> index.html
styles.css --> 404.html
main.js --> externalService["api.iconify.design (icon SVGs)"]
index.html --> externalService2["fonts.googleapis.com / fonts.gstatic.com"]
404.html --> externalService2
index.html --> externalService3["googletagmanager.com (GA4 gtag.js)"]
404.html --> externalService3
robots.txt --> sitemap.xml
```

## External system boundaries
### main.js
- Icon SVGs fetched client-side from `api.iconify.design` (heroicons-outline, simple-icons) for social/contact/focus-area icons. One-way, read-only, no auth.

### index.html / 404.html
- Web fonts (Outfit, JetBrains Mono) loaded client-side from Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`). One-way, read-only, no auth.
- Google Analytics 4 (`gtag.js` from `googletagmanager.com`, property `G-3FBTWXL6FR`): page views and events pushed client-side to Google Analytics. One-way, no auth secret in the client snippet (GA4 measurement IDs are not sensitive), but the property itself is tied to the business's own GA account.

### Deployment
- GitHub Pages serves the repo root directly at the custom domain in `CNAME` (`404advisory.live`). No CI/build step - a push to `main` on the public GitHub repo (`github.com/dnizdz/404landingpage`) is the deploy.
- `robots.txt` / `sitemap.xml` / `llms.txt` are crawled externally by search engines and LLM/answer-engine crawlers - no code in this repo calls out to them, they're passive discoverability files.

## Known gaps / TODO
- Project titles in `config.js` are internal/dated naming, not polished public case-study copy - deliberate, pending an explicit decision (see `CLAUDE.md`).
- No automated tests (static content site, no logic to unit-test beyond `main.js` render functions).
- `llms.txt` and `sitemap.xml` are hand-maintained, not regenerated from `config.js` - update them manually if the project list or brand description changes materially.

## Last checked
- 2026-09-28: module boundaries and external calls checked against `config.js`, `main.js`, `styles.css`, `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `llms.txt` after adding GA4 analytics and SEO/LLM-discoverability files.
