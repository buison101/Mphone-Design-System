# mpo-design-2 — Mantis 4.2.0, original

An unmodified copy of the licensed **Mantis 4.2.0 Vite JavaScript full version**,
extracted from `Mantis_Javascript_4.2.0-ptburz/VITE-4.2.0.zip` (`full-version/`).

It exists so the Portal work has a faithful yardstick. Unlike `mpo-design` and
`mto`, **no data here is reconstructed** — the app reads the vendor's own mock
API, so every page shows what the CodedThemes demo shows.

```sh
npm install --ignore-scripts   # --ignore-scripts is required, see below
npm run start                  # http://127.0.0.1:4323/
npm run build
npm run preview                # http://127.0.0.1:4323/
```

Port 4323 keeps it clear of the legacy Portal (4321) and of `mpo-design` / `mto`
(both 4322).

## What was changed, and nothing else

Seven edits. Everything else is byte-for-byte the vendor tree.

**1. Vendor credentials removed.** `package.json` shipped a GitHub PAT inline in
`install:apm:windows` and `install:apm:linux`. Those two scripts, plus
`setup:apm:windows` / `setup:apm:linux`, `apm.yml`, `apm.lock.yaml` and
`scripts/telemetry.js`, are gone. **Always install with `--ignore-scripts`** —
that is the standing rule for every Mantis package in this repo, not just this
one.

**2. `.env` secrets blanked.** The vendor `.env` carried live keys for Google
Maps, Firebase, AWS Cognito, Auth0, Supabase, Microsoft Clarity, Notify and
Google Analytics. All are present but empty, so the pages that use them degrade
instead of crashing, and `src/metrics/` renders nothing because it is gated on
those ids being non-empty. **Do not restore them.** `.env` is gitignored;
`.env.example` is the committed copy.
`.env.qa` was deleted along with the `build-stage` / `preview-stage` scripts
that read it.

**3. `yarn.lock` and `.yarnrc.yml` removed.** The vendor ships both lockfiles;
this repo standardised on npm.

**4. Port pinned** to 4323 in `start` and `preview`.

**5. `<Metrics />` unmounted** — `src/App.jsx` no longer imports `metrics`. The
components stayed inert once the ids were blanked (point 2), but mounting them
made the whole app hostage to any ad/tracker blocker: `src/metrics/GTag.jsx` is
a **static** import, so when a blocker refuses it the module graph never
resolves and the page is blank. `mpo-design` and `mto` deleted the folder
outright; here the files are kept and simply not mounted.

**6. `PageViews.jsx` renamed to `TopPagesCard.jsx`** — same reason as 5, and the
one edit here that changes a vendor file's identity. The component's contents
are untouched; only the filename and the one import in
`src/pages/dashboard/analytics.jsx` changed. Without it `/dashboard/analytics`
throws `Failed to fetch dynamically imported module` on any machine running a
tracker blocker, and that page is the main reason this tree exists.

**7. Offline fallback added** — `src/utils/offline-cache.js`, plus a small,
commented edit in `src/utils/axios.js`. See below.

## Data: the vendor mock API, with a cache behind it

`VITE_APP_API_URL` points at `https://mock-data-api-nextjs.vercel.app/`, the
public mock API the original template uses. That is the source of truth, and it
needs internet.

The added interceptor does two things:

- remembers every successful `GET` in `localStorage` (`mantis-offline:<url>`);
- when a request never reaches the server, answers from that cache instead of
  failing the page.

It also fixes a latent vendor bug: the original error interceptor reads
`error.response.status` unguarded, which throws on any network failure.

One payload is seeded in the file: `api/menu/dashboard`, captured verbatim on
2026-09-02. That is the sidebar's **Dashboard** group, and it is the only place
the **Components** entry exists — it is not in any `menu-items/*.js` file, which
is why a source-only comparison never sees it. Seeding it means a cold offline
start still shows the correct sidebar.

**The boundary:** the cache covers reads. Sign-in does not — `/api/account/login`
is a POST and is never cached. So the first run needs the network
(`info@codedthemes.com` / `123456`, the vendor demo account); after that
`/api/account/me` is cached and offline reloads stay signed in.

## This tree must not ship into the Portal

It talks to third parties at runtime, which `AGENTS.md` forbids for the Portal
itself ("No external hosts at runtime"). Anything ported out of here has to drop
these first:

| Host | Used by |
|---|---|
| `mock-data-api-nextjs.vercel.app` | all application data |
| `cdn.jsdelivr.net` | ResizeObserver polyfill in `index.html` |
| `flagcdn.com` | country flags in forms and components |
| `tiles.basemaps.cartocdn.com`, `tiles.stadiamaps.com`, `tiles.openfreemap.org`, `demotiles.maplibre.org` | the map pages |
| `images.unsplash.com`, `d2elhhoq00m1pj.cloudfront.net`, `raw.githubusercontent.com` | demo imagery |
| `www.clarity.ms`, `www.googletagmanager.com`, `fomo.codedthemes.com` | `src/metrics/`, inert while the ids are blank |
| `fonts.googleapis.com`, `fonts.gstatic.com` | webfonts, self-host before shipping |

Vendor brand links (codedthemes.com, the gitbook docs, social) are still in the
footer and sidebar. They are original and left alone.

## If the page is blank, or /dashboard/analytics is empty

A tracker/ad blocker in Chrome will refuse dev-server URLs whose **file name**
looks like analytics, even on `127.0.0.1`. Two files in Mantis match:
`src/metrics/GTag.jsx` and `src/sections/dashboard/analytics/PageViews.jsx`.
The request comes back 503 with no body, and Vite reports nothing — there is no
console error to find, which is what makes this expensive to diagnose.

Confirm it in one line from the page's console: a request for the plain name
fails while the same file with one character percent-encoded succeeds.

```js
await fetch('/src/sections/dashboard/analytics/PageViews.jsx')    // blocked
await fetch('/src/sections/dashboard/analytics/%50ageViews.jsx')  // 200
```

The filter matches the token, not the whole name: `PageViewsCard.jsx` is blocked
too, `TopPagesCard.jsx` is not. You can test a candidate name before renaming —
a blocked URL throws, a name that merely does not exist returns 200 `text/html`
(the SPA fallback).

Both files are handled here (edits 5 and 6), so this tree runs with the blocker
on. **The better fix is still on your side:** allow `127.0.0.1` in the blocker
(uBlock Origin: click the icon → the big power button, on that site; or add it
under Trusted sites). Then no source has to bend around it.

This is not specific to `mpo-design-2`. `mpo-design` and `mto` lose their
analytics dashboard the same way — they still import `PageViews` — and only
survive boot because they deleted `src/metrics/`. `npm run build` +
`npm run preview` is unaffected everywhere, because the bundler hashes those
names away.

## Verified 2026-09-02

Built in the cloud container (`npm install --ignore-scripts`, `vite build`,
6.6s) and rendered with Playwright **with no network**, exercising the fallback:
all nine sidebar groups present, `Components` → `/components-overview` linked,
no page errors. A credential scan over the tree (`ghp_`, `github_pat_`, `sk-`,
`AIza`, `xox[baprs]-`) came back clean.
