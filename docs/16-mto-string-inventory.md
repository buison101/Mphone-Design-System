# MTO stage 2 — string inventory and bilingual catalogs

Stage 2 of the Mantis 4.2.0 migration (`AGENTS.md` → *Migration stages*): inventory every
user-visible string in `portal-worktree/app/portal/mto`, and give each one complete
Vietnamese and English content. Neither language is a fallback for the other.

## What the vendor shipped

Mantis 4.2.0 routes only its **navigation and breadcrumbs** through `react-intl` — 168 flat
keys (`dashboard`, `account-profile`, …) in `src/utils/locales/{en,fr,ro,zh}.json`. Every other
screen carries English hardcoded in JSX. The first scan measured **3,150 candidate strings across
470 files**; the whole application, apart from the menu, was monolingual by construction.

## Decisions taken with the product owner (2026-09-01)

| Decision | Choice |
| --- | --- |
| Key shape | **Namespaced by domain** — `nav.apps.customerList`, `auth.field.password`, `dashboard.kpi.users`. The vendor's 168 flat keys were rewritten. |
| Languages | **Vietnamese and English only.** The vendor's `fr`, `ro` and `zh` catalogs covered the 168 menu keys and nothing else; they were removed rather than left to fall back to English on every new key. |
| Default locale | **Vietnamese.** `config.i18n` and `IntlProvider defaultLocale` are both `vi`; `<html lang>` follows. |
| Component demo pages | **Localized in full**, like every other page — scheduled as wave 5 below, not skipped. |
| Scope of this pass | Wave 1: the application shell, authentication, maintenance, dashboards and route errors. |

## The catalogs

`src/utils/locales/vi.json` and `src/utils/locales/en.json`, one flat map of dotted keys each,
sorted, written from the same input so a key cannot exist in one language and not the other.
**395 keys** after wave 1.

Namespaces in use: `app`, `nav`, `breadcrumb`, `header`, `drawer`, `footer`, `workspace`,
`profile`, `megaMenu`, `prompts`, `auth`, `authFooter`, `maintenance`, `dashboard`, `error`,
`common`.

## Tooling (all runnable from `mto/`)

| Command | What it does |
| --- | --- |
| `npm run i18n:inventory` | Scans `src/` and reports candidate user-visible strings per area. Re-run between waves to measure coverage. Add `--json` for the machine-readable report. |
| `npm run i18n:check` | Fails when the two catalogs disagree about which keys exist, when a value is empty, or when the source references an id no catalog has. Also lists keys with no literal reference. |
| `VITE_I18N_STRICT=1 npm run build` | Builds with react-intl's `onError` wired to the console, so a render check can fail on a missing message in a production bundle. |

## Waves

Wave 1 is complete. The rest are ordered by how much of the product a reader meets first.

| Wave | Area | Strings | Status |
| --- | --- | --- | --- |
| 1 | Shell, auth, maintenance, dashboards, route errors | ~550 | **Done — 395 keys** |
| 2 | `sections/apps` + `pages/apps` (chat, calendar, kanban, customer, invoice, profile, store) | 826 | Next |
| 3 | Forms and tables (`pages/forms`, `sections/forms`, `pages/tables`, `sections/tables`, `components/third-party`) | 322 | |
| 4 | Widgets, charts, maps, landing, AI, contact, FAQs, pricing, changelog | 320 | |
| 5 | Component and prompt demo pages (`components-overview`, `prompts-overview`) | 1,075 | |

Counts are candidate strings from `npm run i18n:inventory`, which is deliberately generous: a
false positive costs a line of review, a missed string ships an untranslated screen.
After wave 1 the scan reports **2,699 candidates in 369 files**, down from 3,150 in 470.

## Defects found while measuring, and fixed

- **The application fetched a script from a CDN on every page load.** `index.html` loaded
  `resize-observer-polyfill` from `cdn.jsdelivr.net`. The per-page acceptance rule forbids
  unintended external requests, and stage 1 was meant to leave no external runtime dependency.
  Removed; `ResizeObserver` has been baseline in every browser this Portal targets since 2020.
  The two Google Fonts `preconnect`/`dns-prefetch` hints went with it — the fonts are bundled,
  so those opened connections for nothing.
- **The document head was the vendor's.** Title, description, keywords, author and a
  `schema.org` block pointing at `mantisdashboard.com`. The browser-tab title is a user-visible
  string. Replaced with Mphone's, and `<html lang>` set to `vi`.
- **Button typography title-cased Vietnamese.** `themes/typography.js` set
  `textTransform: 'capitalize'`, which renders "Xem thống kê đầy đủ" as "Xem Thống Kê Đầy Đủ" —
  CSS capitalises every word, and Vietnamese sentence case does not. Set to `none`; labels are
  written in the case they should appear in, in both catalogs. Three component-level
  `capitalize` rules on wave-1 screens were fixed the same way; the remainder are listed below.
- **Header search matched the message id, not the label.** `Search.jsx` filtered
  `child.title.toLowerCase()`, which after this change would have been `nav.apps.chat`. It now
  filters the formatted label, so typing "trò chuyện" finds the chat page.
- **The menu that comes from the mock API kept flat vendor ids.** `data/local-api.js` and
  `api/menu.js` fed `dashboard`, `default`, `analytics` straight into `<FormattedMessage>`,
  which rendered the raw id in the sidebar. Namespaced with the rest.
- **Vendor brand links in the navigation.** The `documentation` and `roadmap` items pointed at
  `codedthemes.gitbook.io`. One item remains, pointing at the live Portal, so the external-link
  and chip states are still demonstrated; the second was dropped. The auth screens' "read the
  documentation … after purchasing the theme" alert became a sentence about what the screen
  actually is.
- **Vendor demo data in the shell.** The workspace switcher shipped "Acme Corp", "Globex Inc."
  and "Stellar Labs". Replaced with three sample tenants a PBX customer would recognise — head
  office, a branch, a test environment — labelled in both languages, still local sample data.
- **The drawer's landmark said `aria-label="mailbox folders"`**, copied from a MUI example. It
  is the main navigation, and now says so.

## Known follow-ups

- **The application still reaches third parties at runtime in four places.** Found by grepping
  every external host in `src/` during the pre-commit scan, after the `index.html` polyfill was
  removed:
  - `flagcdn.com` — country flags in `pages/apps/invoice/{create,edit}`,
    `sections/apps/profiles/user/TabPersonal`, `sections/components-overview/autocomplete`. One
    request per row. The Portal's own answer (see `docs/07-component-catalog.md`) is the region's
    dialling code, not a flag.
  - `demotiles.maplibre.org` and `tiles.openfreemap.org` — `sections/maps/GeoJSONAnimation`,
    `HeatMap` and `RegionalMap` load their whole map style from the network.
  - `tiles.basemaps.cartocdn.com` and `tiles.stadiamaps.com` — the three *local* style files in
    `sections/maps/map-data/` are local JSON that names remote tile and sprite sources, so the
    tiles are fetched anyway. The `mto` README's stage 1 claim that maps use local simulations
    was wrong on this point and has been corrected.
  - `images.unsplash.com` — carousel images in `sections/components-overview/stepper`.
- **Vendor brand links remain outside the shell**: `codedthemes.com` (13), `codedthemes.gitbook.io`
  (8), `codedthemes.support-hub.io` (5) and `figma.com` (3), mostly in the landing page, the
  prompts pages and component demos. The shell's are gone; the rest go wave by wave.
- **Vendor demo identities**: `anshan.dh.url` and similar appear as sample portfolio URLs in
  customer and profile screens. Wave 2 content.
- **The logo is still the Mantis wordmark** (`components/logo/LogoMain.jsx`,
  `LogoIcon.jsx`). Branding is stage 3, but it is the most visible vendor mark left.
- **`textTransform: 'capitalize'` remains** in `pages/apps/e-commerce/products-list`,
  `sections/apps/chat/UserDetails`, `sections/apps/e-commerce/*` and
  `sections/components-overview/*`. Fix as each wave reaches them.
- **The nav's `search:` keywords are English-only** (`menu-items/components.js`). They are not
  displayed, but they are matched against what a reader types, so Vietnamese search misses.
  Needs a keyword catalog, not a message key.
- **The browser-tab title is static.** `Mphone Portal` reads correctly in both languages; a
  per-locale, per-route title needs the app to set `document.title`.
- **The config storage key is `mantis-react-js-config`.** Not user-visible; renaming it resets
  everyone's saved theme, so it belongs with stage 3 branding, deliberately.

## How wave 1 was verified

`npm run lint` and `npm run i18n:check` clean; production build with `VITE_I18N_STRICT=1`; then
Playwright over 14 routes in Vietnamese and English, light and dark, at 1440px and 390px, plus
the header's profile, notification, theme and language popovers — asserting no raw message id on
screen, no `[i18n]` missing-message error, no console error, and no page-level horizontal
overflow. Zero findings.

`vite build` cannot run in the desktop Linux VM: `node_modules` on that machine holds Windows
native bindings and rolldown fails on `rolldown-binding.linux-x64-gnu.node`. Build and render in
the cloud container instead — tar `src public index.html package*.json vite.config.mjs
jsconfig*.json .prettierrc eslint.config.mjs scripts`, `npm install --ignore-scripts`, build,
then drive a static server with Playwright at `/opt/pw-browsers/chromium`.
