# 404 Advisory Landing Page

Static bilingual (ID/EN) portfolio/landing site for 404 Advisory (business & tech consulting). Vanilla HTML/CSS/JS, no build step, no framework. Content driven by `config.js`. Deployed via GitHub Pages (`CNAME` present). Repo: `git@github.com:dnizdz/404landingpage.git`.

## What's where
- `index.html`, `main.js`, `styles.css`, `config.js`, `assets/`, `CNAME`, `404.html` — the deployed site itself, lives at repo root (GitHub Pages serves from root; do not move these into `Brief/`).
- `Brief/` — write-ups/decisions not part of the deployed site (empty for now).
- `Handover/` — running handover doc.

## Editing content
Add/edit portfolio entries in `config.js` `projects` array (title/titleEn, description/descriptionEn, projectUrl, sampleDocs, folderUrl). Brand info, theme colors (CSS custom properties), and contact info also live in `config.js`. `main.js` renders everything from `CONFIG` at load — no other file needs editing for content changes.

## Design system
Redesigned 2026-09-28 via `redesign-existing-projects` skill. Font: Outfit (headings/body) + JetBrains Mono (404 page numeral), loaded via Google Fonts in `index.html`/`404.html` `<head>`. Dark navy theme (`--bg`/`--card`/etc set from `config.js` theme.colors, applied at runtime in `main.js`). Shadow tint (`--shadow-rgb`) is computed at runtime from `theme.colors.bg` — don't hardcode a shadow color, it must stay theme-reactive. Project cards use `auto-fit` grid (not a fixed 3-column split) so card count can change without layout breaking. Focus-area icons are Iconify heroicons-outline (tinted to `theme.colors.accent`), not emoji.

## Standing notes
- Project titles in `config.js` are intentionally internal/dated naming ("2026-02 - ..."), not polished case-study copy — left as-is during the 2026-09-28 redesign pending an explicit decision to rewrite them for public consumption.
- No new dependencies added; fonts are loaded via `<link>` (Google Fonts CDN), not an npm package.
