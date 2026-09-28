# 404 Advisory Landing Page

Static bilingual (ID/EN) portfolio/landing site for 404 Advisory (business & tech consulting). Vanilla HTML/CSS/JS, no build step, no framework. Content driven by `config.js`. **Code lives on GitHub and is deployed straight from there** — repo `github.com/dnizdz/404landingpage` (public, SSH: `git@github.com:dnizdz/404landingpage.git`), served by GitHub Pages at the custom domain in `CNAME` (`404advisory.live`). A push to `main` is the deploy — no separate build/CI step, no server to SSH into. Because the repo is public, run the standard public-git PII/traceable-info check (global CLAUDE.md) before pushing anything beyond the business's own already-public marketing content.

## What's where
- `index.html`, `main.js`, `styles.css`, `config.js`, `assets/`, `CNAME`, `404.html`, `robots.txt`, `sitemap.xml`, `llms.txt` — the deployed site itself, lives at repo root (GitHub Pages serves from root; do not move these into `Brief/`).
- `Brief/` — write-ups/decisions not part of the deployed site (empty for now).
- `Handover/` — running handover doc.

## Editing content
Add/edit portfolio entries in `config.js` `projects` array (title/titleEn, description/descriptionEn, projectUrl, sampleDocs, folderUrl). Brand info, theme colors (CSS custom properties), and contact info also live in `config.js`. `main.js` renders everything from `CONFIG` at load — no other file needs editing for content changes.

## Design system
Redesigned 2026-09-28 via `redesign-existing-projects` skill. Font: Outfit (headings/body) + JetBrains Mono (404 page numeral), loaded via Google Fonts in `index.html`/`404.html` `<head>`. Dark navy theme (`--bg`/`--card`/etc set from `config.js` theme.colors, applied at runtime in `main.js`). Shadow tint (`--shadow-rgb`) is computed at runtime from `theme.colors.bg` — don't hardcode a shadow color, it must stay theme-reactive. Project cards use `auto-fit` grid (not a fixed 3-column split) so card count can change without layout breaking. Focus-area icons are Iconify heroicons-outline (tinted to `theme.colors.accent`), not emoji.

## Analytics and SEO / LLM discoverability
Added 2026-09-28. Google Analytics (GA4, property `G-3FBTWXL6FR`) is wired via `gtag.js` inline in both `index.html` and `404.html` `<head>` — keep the snippet in sync across both files if the property ever changes, and add it to any new page added later. `robots.txt` points crawlers at `sitemap.xml` (single homepage entry — this is a one-page site with in-page anchors, add a `<url>` entry only if separate real subpages are ever added). `llms.txt` (root, per the emerging llmstxt.org convention) gives LLM crawlers/answer engines a clean plain-text summary of services and project links — keep it in sync with `config.js`'s `projects` array and brand description when either changes. `index.html` also carries a static (non-JS-rendered) `ProfessionalService` JSON-LD block, canonical link, and absolute-URL OG/Twitter meta so crawlers that don't execute JS still see accurate metadata — update the JSON-LD if brand name/description/contact changes in `config.js`.

## Standing notes
- Project titles in `config.js` are intentionally internal/dated naming ("2026-02 - ..."), not polished case-study copy — left as-is during the 2026-09-28 redesign pending an explicit decision to rewrite them for public consumption.
- No new dependencies added; fonts and the GA tag are loaded via `<link>`/`<script src>` (Google CDN), not an npm package.
