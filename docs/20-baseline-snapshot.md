# Baseline snapshot — MPO Design

Taken 2026-09-02 during wave L1, on `portal-worktree/app/portal/mpo-design`.

**This is a record, not a gate** (`docs/15` §4.9). It exists so that a breakage found mid-translation can be attributed: the first question when a page fails during L2 or later is always whether it worked before. Everything below is written down; **nothing below is a requirement to fix.** Fixing any of it is a separate decision in a separate change set.

## Method

- Built from the current tree with `vite build`, then served from `dist` with an SPA-fallback static server.
- Driven with Playwright over the concrete routes in `docs/17-mpo-design-route-inventory.md` — 78 fixed routes plus three parameterised samples (`/apps/invoice/details/1`, `/apps/invoice/edit/1`, `/apps/e-commerce/product-details/1`) — 81 in total.
- Three passes: desktop light (1440×900), desktop dark (1440×900), mobile light (390×844). Locale seeded to `vi`.
- Build and rendering ran in the cloud container; `vite build` cannot run in the desktop Linux VM, where rolldown has no Linux binding.

## The one caveat that governs how to read this

**The container cannot reach the vendor mock API.** All 81 routes logged network failures for `mock-data-api-nextjs.vercel.app` and the other vendor hosts. So this is the **offline** baseline: it is exactly the cold-start-with-no-network case §4.9 asks for, and it is *not* a picture of the app with data.

Every data-dependent finding below is therefore provisional. A second pass with network, run on the developer's own machine, is still owed — that is the only place the vendor API is reachable.

## Results

| Pass | Routes | Not rendering | 390px overflow | Raw message ids | Console (excluding network) |
|---|---|---|---|---|---|
| desktop light | 81 | 1 | — | 0 | 10 routes |
| desktop dark | 81 | 1 | — | 0 | 9 routes |
| mobile 390px light | 81 | 1 | 5 routes | 0 | 10 routes |

**No raw message id reached the interface on any route in any pass.** One regex hit on `/apps/profiles/account/basic` was checked by hand and is `anshan.dh.url`, vendor demo data in the profile card, not a leaked id.

Light and dark behaved identically apart from one fewer console warning in dark. No route rendered in one theme and failed in the other.

## Findings

### Falls into the error boundary

- `/apps/e-commerce/products` — in all three passes. Console shows `TypeError: i.map is not a function`, i.e. the page maps over a product list that never arrived. Almost certainly a consequence of the missing API rather than a defect; confirm in the networked pass.

### Horizontal overflow at 390px

Measured as `document.scrollWidth − window.innerWidth`.

| Route | Overflow |
|---|---|
| `/apps/chat` | +192px |
| `/apps/customer/customer-list` | +192px |
| `/apps/invoice/list` | +192px |
| `/apps/invoice/edit/1` | +192px |
| `/apps/customer/customer-card` | +20px |

The repeated +192px points at one shared fixed-width element rather than four separate layout faults. Note that four of these five pages are in an error or empty state offline, so the measurement may not reflect the page as a user sees it. Re-measure with data before drawing conclusions.

### Console output that is not a network failure

| Route | What |
|---|---|
| `/apps/chat` | `TypeError: Cannot read properties of undefined (reading 'filter')` — no conversation data |
| `/apps/customer/customer-list` | `TypeError: Cannot read properties of undefined (reading 'length')` — no customer data |
| `/apps/invoice/edit/1` | `TypeError: Cannot read properties of undefined (reading 'filter')` — no invoice data |
| `/apps/e-commerce/products` | `TypeError: i.map is not a function` plus a `HydrateFallback` warning |
| `/apps/e-commerce/product-list`, `/apps/e-commerce/product-details/1` | `No HydrateFallback element provided to render during initial hydration` |
| `/change-log` | `Error fetching changelog: Wrong Services` |
| `/pricing` | a minified error, `je` |
| `/apps/invoice/details/1` | `Buffer is not defined` — a Node global reaching browser code in the PDF path |
| `/map` | WebGL software-fallback warnings from the container's headless GPU; an environment artefact, not the app |

The first six lines are all downstream of the absent API. `Buffer is not defined` and `/pricing` are worth a look on their own, because neither obviously depends on data.

## What this means for the waves

- L2 onward: when a page breaks, check it here first. A route already listed above was already broken.
- The `+192px` cluster and `Buffer is not defined` are candidates for a separate baseline-fix change set, never mixed into a localization change set.
- The networked pass is still owed and can only be run on the developer's machine.

Raw data: `i18n/`-adjacent tooling did not produce this; it came from a one-off Playwright pass. The per-route JSON was kept in the build workspace and is not committed — regenerate it rather than trusting a stale copy.
