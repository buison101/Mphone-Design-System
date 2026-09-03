# MPO Design — Stage 1 status

Updated: 2026-09-02. **This file replaces its previous version completely.**

The canonical roadmap is `docs/15-mpo-design-implementation-plan.vi.md`. `AGENTS.md` is authoritative. This file is Stage 1 evidence for the tree that is actually the target, and nothing more.

## Superseded evidence — read this before anything else

The earlier version of this document recorded Stage 1 work on a **different tree**: one where the vendor mock API had been replaced by a hand-written `src/data/local-api.js`, and where maps, video, flags, carousel imagery and reCAPTCHA had been swapped for local simulations. Its acceptance criterion was "no external hosts at runtime".

**That tree is no longer the target, and none of its evidence transfers.** If you have read the old version, discard it. In particular, the external hosts listed further down are **not** a defect list and **not** a cleanup backlog.

## The target, and why it is shaped this way

`portal-worktree/app/portal/mpo-design`, served at `http://127.0.0.1:4323/`. It is the pristine licensed Mantis 4.2.0 Vite JavaScript full version plus the small, listed set of edits below.

**Translation starts from the untouched Mantis original, and the vendor mock API is deliberately left external.** The reason is the stability of the surface being translated. Reconstructing the vendor's data by hand produces pages that quietly differ from real Mantis — an earlier reconstruction dropped the `Components` entry from the sidebar, and it went unnoticed for some time. A translator, human or AI, then cannot tell whether a missing string is a translation gap or a fixture gap, and every page must be double-checked against a reference that no longer matches. Reading the vendor's own API removes that ambiguity: what renders here is what Mantis renders.

The cost of that choice is a set of runtime external hosts, accepted as a bounded exception recorded in `AGENTS.md` under "Integration and simulation policy".

## Verified edits against the pristine extract

Measured 2026-09-02 with `diff -rq` between `.tools/mto-stage-20260902/full-version/src` and `src`: **4 files modified, 1 renamed, 1 added, out of 1,113** — plus `package.json`. Everything else is byte-identical to the vendor tree, and keeping it that way is what makes the next Mantis release an upgrade rather than a rewrite.

**This table is the Stage 1 figure and stays frozen at it.** Phase B localization has since added its own edits — hoists, and a small number of fixes where a display string was doubling as a lookup key. As of wave L8 the same measurement reads **86 modified files, 1 renamed, 4 project-owned additions**, still against 1,113. Every one of those files is listed with its reason and its reapply steps in `docs/vendor-patches.md`, which is the current manifest; this section is not.

| Change | What and why |
|---|---|
| `package.json` | The vendor inlines a GitHub PAT in `install:apm:windows` / `install:apm:linux`. Those, plus `setup:apm:*`, `apm.yml`, `apm.lock.yaml`, `scripts/telemetry.js`, `.env.qa` and the `build-stage` / `preview-stage` scripts that read it, are gone. `yarn.lock` and `.yarnrc.yml` removed — this repo is npm. Port pinned to 4323 via the `start` and `preview` scripts. Note that `vite.config.mjs` still carries the vendor's `server.open: true`, so a dev server does open a browser; the earlier claim that auto-open was disabled described the `-off` tree, not this one. **Always install with `npm install --ignore-scripts`.** |
| `.env`, `.env.example` | Vendor keys for Maps, Firebase, AWS Cognito, Auth0, Supabase, Clarity, Notify and Analytics are blanked so those pages degrade instead of crashing. Verified 2026-09-02: of 20 `VITE_` entries only three carry a value — `VITE_APP_VERSION`, `VITE_APP_BASE_NAME`, `VITE_APP_API_URL`. No secret remains. `.env` is gitignored; `.env.example` is the committed copy. Do not restore any blanked key. |
| `src/App.jsx` | `<Metrics />` unmounted. The files stay under `src/metrics/` but never render. |
| `src/contexts/JWTContext.jsx` | Live JWT initialisation replaced by a local preview session, so authenticated pages render without an account, token or API. |
| `src/utils/axios.js` + `src/utils/offline-cache.js` (new) | Every successful `GET` is remembered in `localStorage` under `mantis-offline:<url>` and served back when a request cannot reach the server. It also guards a latent vendor bug: the original error interceptor reads `error.response.status` unguarded and throws on any network failure. One payload, `api/menu/dashboard`, is seeded in the file so a cold offline start still shows the real sidebar including `Components`. |
| `PageViews.jsx` → `TopPagesCard.jsx` | Renamed, with its single import in `src/pages/dashboard/analytics.jsx`. A tracker/ad blocker in the developer's Chrome refuses dev-server URLs by filename, on `127.0.0.1` too, returning 503 with no body while neither Chrome nor Vite logs anything. Allowing `127.0.0.1` in the blocker is the better fix; the rename can then be reverted. Production builds are unaffected — the bundler hashes such names away. |

## Runtime external surface — an inventory, not a defect list

| Host | Serves | Where |
|---|---|---|
| `mock-data-api-nextjs.vercel.app` | menu, chat, calendar, kanban, customer, invoice, address, product, review data | `VITE_APP_API_URL`, through `src/utils/axios.js` |
| `cdn.jsdelivr.net` | ResizeObserver polyfill script | `index.html` |
| `fonts.googleapis.com`, `fonts.gstatic.com` | web fonts | `index.html` |
| `flagcdn.com` | country flags, 10 references | apps and components-overview |
| `images.unsplash.com` | carousel imagery, 4 references | `sections/components-overview/stepper` |
| `youtube.com/embed` | three video embeds | prompt details, `sections/ai/VideoDialog`, `sections/widget/data/LatestPosts` |
| `demotiles.maplibre.org`, `tiles.stadiamaps.com`, `tiles.openfreemap.org`, `tiles.basemaps.cartocdn.com`, `maplibre.org` | map styles, sprites, tiles, sample GeoJSON | `sections/maps` |
| Google reCAPTCHA (`react-google-recaptcha` 3.1.0) | the forms plugin demonstration | `pages/forms/plugins/re-captcha.jsx` |

Links to `mui.com`, `github.com`, `codedthemes.com`, the documentation site and social profiles are user-initiated navigation. They load nothing until someone follows them.

**Do not "fix" any of this by rebuilding local fixtures.** That is precisely the reconstruction the product owner rejected, and doing it silently reintroduces the drift this tree exists to avoid. If a specific host genuinely has to go, that is a separate decision recorded in `AGENTS.md` — not a cleanup task to pick up between other work.

## The boundary that makes the exception acceptable

- Vendor demonstration data only. No Mphone content and no customer data ever reaches these hosts.
- Reads only. No writes, no deployment, no data or configuration change anywhere upstream.
- Nothing is presented as a live Mphone integration. Sample, simulated and unconnected surfaces stay labelled as such.
- No FusionPBX, SIP/PBX, production database or Android integration, under any circumstances.
- The offline cache keeps the UI Lab usable when the hosts are unreachable.
- Neither the cloud container nor the desktop Linux VM can reach `vercel.app`; only the developer's own machine can. Sign-in is a POST and is therefore not cached — a first run needs network, after which `/api/account/me` is cached and offline reloads stay signed in.

## Baseline snapshot, not a gate

**Gate A was retired on 2026-09-02.** It specified construction work — local adapters, hand-built fixtures, no runtime external hosts — and that work belongs to the abandoned `-off` tree. The chosen tree deliberately does not do it. Nothing in this section is a bar to clear before Phase B, and **Phase B is open**.

What survived is a **snapshot**, taken once during wave L1 on the untouched tree, so that a breakage found mid-translation can be attributed to the right cause. It records defects; it does not require them to be fixed. Fixing any of them is a separate decision in a separate change set.

To record:

- Every route in `docs/17-mpo-design-route-inventory.md`: renders normally, or falls into the error boundary.
- The console for each route, including the warnings and errors the vendor produces on its own.
- Document width at 390px, plus light and dark captures for the principal route groups.
- Prettier, ESLint and `vite build` results.
- A cold start with no network: which routes the offline cache covers and which it does not.

Two checks sit outside the snapshot because they guard something other than debuggability. Both were run on 2026-09-02 against the source:

- No credential, PAT, cloud access key, API secret, private key or site key in source or committed configuration. Verified across the `.env` surface; re-run before every commit.
- Every runtime external host appears in the inventory above and nothing unlisted appears. Verified by source scan; confirm again in the browser when the snapshot is taken.

One risk is accepted for local UI Lab use only: a low-severity Quill HTML-export XSS advisory. MPO Design does not export editor HTML, persist it externally, or render it as trusted product content. It must be re-evaluated before any production mode.

## What Stage 1 has deliberately not done

- No translation, no keymap, no message extraction. Phase B opens with wave L1; nothing here has begun it.
- No Mphone branding, no product copy, no sample-identity replacement.
- No page removed, merged, renamed or redesigned.
- `src/metrics/` still exists, unmounted. `react-google-recaptcha` is still installed and live.
- Vendor identity remains in the `index.html` JSON-LD (`mantisdashboard.com`) and throughout the demonstration content. That belongs to Stage 6 and to `docs/15` §4.8, not to Stage 1.

## Rules for anyone continuing here

1. **Localization never edits vendor source.** Strings are bound in `i18n/keymap.json` and substituted at build — `docs/15` §4.7 and the "Localization architecture" section of `AGENTS.md`.
2. **Do not rebuild a local data layer.** The external mock API is the decision, not an oversight.
3. **Do not delete `.tools/mto-stage-20260902/full-version`.** It is the pristine 4.2.0 extract and the only way to diff vendor against vendor.
4. **Never reformat vendor files.** One Prettier or `eslint --fix` pass over them destroys every comparison.
5. **Install with `npm install --ignore-scripts`**, always.
6. `mpo-design-off`, `mto` and every earlier experiment are not references. `spa` remains a read-only terminology reference.
