# Portal (`/p/`) — guidance for AI agents

Read this before changing anything under `app/portal/`.

## Active workspace mode — local UI Lab only

The parent workspace now uses this Portal as the single canvas for interface experiments. MPO Design is the active implementation target, while the legacy preview at `http://localhost:4321/` remains available for comparison until cutover. These rules supersede legacy production and server workflow instructions below:

- Make all new Portal migration changes in `app/portal/mpo-design`. Treat `app/portal/spa` as a read-only product, behavior, localization, content, and accessibility reference unless the product owner explicitly requests a legacy fix.
- `app/portal/mto` is an abandoned, faulty implementation. Do not inspect, read, copy, import, compare against, repair, build, test, or cite it. No decision or completion claim from it carries into MPO Design.
- Use sample data, stubbed sessions, and simulated interactions so the preview works without FusionPBX, PHP, a database, SIP/PBX, Android, or an external network.
- Do not edit `app/portal/service`, `app/portal/resources`, PHP configuration, permissions, database files, themes, or generated `p/` output.
- Do not connect to or deploy to a FusionPBX server, and do not change the external Android application.
- Webphone is a simulated UI experiment; do not register it with a real PBX or place real calls.
- Bảng phân tích, App Phone, Chat, Webphone, and future concepts must be built and reviewed as routes in this Portal preview.
- When production-era instructions below mention endpoints, authentication, deployment, server builds, or real-data checks, retain them only as architectural context. They do not authorize those actions in the current workspace mode.

### Local completion path

MPO Design has its own local build and preview workflow at `http://127.0.0.1:4322/` and must not write to generated production `/p/` output. Until cutover, keep the legacy preview at `http://localhost:4321/` available for comparison. Run Prettier, ESLint, the local build, relevant quality checks, and visual inspection locally. Do not deploy afterward.

## Active Portal migration

| Path | Role |
|---|---|
| `app/portal/mpo-design` | New Portal based on the licensed Mantis 4.2.0 Vite JavaScript full version |
| `app/portal/spa` | Legacy Portal retained as a product, behavior, content, localization, and accessibility reference |

The product owner confirms that an official licence for the new Mantis package has been purchased.

The current priority is sequential: first preserve every Mantis 4.2.0 page and route in a clean safe baseline; then make the complete application bilingual in Vietnamese and English while preserving Mantis meaning and experience; only after that baseline is accepted may the team classify routes and implement Mphone branding, content, products, or new pages.

The single detailed roadmap is `../../../docs/15-mpo-design-implementation-plan.vi.md`. Do not create or follow a parallel migration plan.

- Do not remove Mantis pages or routes during the bilingual-content stage without product-owner approval.
- Every user-visible string must use shared localization and have complete Vietnamese and English messages in the same change.
- New copy must be concise, natural, consistent, relevant to Mphone, and aligned with Calm, Clear, Certain, Efficient, and Human.
- Preserve the UI state and interaction of pages involving external services, but replace live integrations with local fixtures, stubbed sessions, or simulated actions.
- Do not run vendor APM or telemetry, use the embedded GitHub PAT, import vendor `.env` files, or connect MPO Design to external authentication, mock APIs, FusionPBX, SIP/PBX, production databases, or Android.
- Do not import source files from `spa` into the `mpo-design` build. Read and reimplement verified behavior using the new foundation.

### Read-only product reference

The live Portal at `https://call.mphone.vn/p/` may be inspected read-only for current Mphone terminology, bilingual copy, visible data structure, and product behavior. Use only a Chrome session or access details supplied by the product owner for the current work session. Never store or repeat usernames, passwords, cookies, tokens, or session data; never modify live data or configuration; and never copy real customer data into local fixtures.

All detailed migration, security, archive-handling, localization, simulation, and acceptance rules in the parent `AGENTS.md` apply to MPO Design.

## What this is

`/p/` is the **self service portal for end customers**. It is not the admin
interface and it is not a second FusionPBX. A customer signs in and sees their
own telephony: their calls, their numbers, their settings.

It is a React single page application. It sits *beside* the 300+ PHP
administration pages, it does not replace them. The split is deliberate and is
the whole point of the architecture:

| | Who | Where | Why |
|---|---|---|---|
| Admin | operators, resellers, superadmin | PHP, `themes/mantis` | 300+ pages, heavy write logic, 3.700+ permission checks |
| Portal | **end customers** | React, `app/portal/mpo-design` as the active target; `app/portal/spa` as the legacy reference | interactive customer experiences, rebuilt locally on the Mantis 4.2.0 foundation |

**Never port an admin page into the portal because it would look nicer there.**
A screen belongs in `/p/` only when all three hold:

1. it is read mostly, or writes something narrow (agent status, call forward)
2. it is realtime or highly interactive, where a full page reload hurts
3. its audience is the end customer, not the system operator

If any one fails, it stays in PHP. Extensions, dialplans, devices, domains,
users, groups and settings all stay in PHP.

## Design language: Mantis

The portal follows the **Mantis** design system by CodedThemes.

- **Licensed primary foundation:** the supplied Mantis 4.2.0 Vite JavaScript full version, used to build `app/portal/mpo-design`. The product owner confirms that an official licence has been purchased.
- **Legacy free reference (MIT, vendored):** `mantis-free` — the free React template from which `app/portal/spa` was scaffolded. Keep it as historical reference and never import it into MPO Design at build time.
- **Design system tokens:** `uiux-demo/mantis-free/mantis-free-react-admin-template/mantis-design-system/`
  — palette, typography, layout and shadow tokens for both schemes, matched
  against the Pro demo. `src/themes/palette.js` reproduces `mantis-tokens.json`
  exactly: feed `presetDarkPalettes` plus the inverted grey scale through the
  existing `ThemeOption`, do not hand-write a second palette builder.
- **External reference:** <https://mantisdashboard.com/dashboard/default> may be inspected for comparison when useful, but the supplied licensed Mantis 4.2.0 package is the primary MPO Design foundation.

The free template omits a lot the Pro demo shows. When a screen needs something
missing, reconstruct it rather than inventing a new visual language: match the
Pro demo's layout, spacing and states, but build it from `MainCard`,
`components/@extended/*`, and the MUI components already installed.

### Where the design tokens live

| Concern | File |
|---|---|
| Palette (light + dark) | `spa/src/themes/palette.js` |
| Type scale | `spa/src/themes/typography.js` |
| Shadows | `spa/src/themes/custom-shadows.jsx` |
| Component overrides | `spa/src/themes/overrides/` |
| App constants, endpoints | `spa/src/config.js` |

The PHP admin theme mirrors the same numbers in `themes/mantis/palette.php` and
`themes/mantis/css/tokens.css`, so the two halves of the product look like one.
**Change one, change the other**, or they drift.

## Hard rules

### Portal role hierarchy

- `superadmin` is the only role allowed to create, change, enable, disable, or delete configuration shared by an entire Domain.
- `admin` manages the users placed below that admin and may operate on their authorized records, but admin is not a Domain-wide configuration owner.
- `user` operates only within the Extensions and records assigned to that user.
- A shared Domain catalogue or policy must never grant its management permission to `admin` or `user`. This includes the shared call-tag catalogue; only `superadmin` receives `portal_call_tag_edit`.
- Using a shared value is separate from managing it. `admin` and `user` may receive a narrow assignment/use permission, such as `portal_call_tag_assign`, while creation, disabling, and deletion remain superadmin-only.
- Enforce this hierarchy in server-side permission checks and application permission defaults. Hiding a control in React is not authorization.

**Scope is decided on the server, never in the browser.** The SPA renders what
the API and the websocket give it. Do not filter by domain or extension in React
and call it access control.

**Reuse FusionPBX permission names.** `call_active_view`, `xml_cdr_view`,
`xml_cdr_domain`, `portal_view`. Never invent a parallel permission vocabulary
for the portal — the websocket filter chain and the PHP pages already agree on
these names, and a second set would drift out of sync silently.

**Every query is pinned to `domain_uuid`.** Missing it leaks one customer's data
to another. There is no acceptable reason to omit it.

**Endpoints are read only.** Writes stay on the PHP side where the permission
checks already live. A narrow write (toggle call forward) may be added, but it
gets its own endpoint with its own permission check, never a generic one.

**Never put an endpoint under a path containing `/api/`.** nginx rewrites any
URI matching `^.*/api/.*$` to `index.php?rewrite_uri=…`, which 404s. Portal
endpoints live in `app/portal/service/`.

**No external hosts at runtime.** No CDN scripts, no Google Fonts, no remote
images. Fonts are self hosted. An installation may have no internet access.

## How auth works

There is no login in the portal. It rides the FusionPBX PHP session:

```
browser → /app/portal/service/session.php
          401  → redirect to the normal PHP login
          403  → user lacks portal_view
          200  → user, domain, permission subset, websocket token
        → wss://host/websockets/   authenticate with that token
```

`subscriber::save_token()` writes the token to `/dev/shm`, which is how the
websocket router authorises a socket without a PHP session. The token has a TTL
(`portal/token_time_limit`, default 60 min) and `SessionContext` renews it a
minute before expiry.

A permission added to the database is **not** visible to an already signed in
user: permissions are loaded into the PHP session at login. Sign out and in.

## Data sources

| Source | Carries | Notes |
|---|---|---|
| `wss://host/websockets/` | live call events | `core/websockets`, service `active.calls` |
| `service/session.php` | identity, permissions, token | |
| `service/dashboard.php` | call history summary from `v_xml_cdr` | read only, window capped at 168h |
| `service/calls.php` | paged, filtered call history | read only, page size capped at 100 |
| `service/recording.php` | streams one recording | scoped, supports Range |

`app/xml_cdr/download.php` serves recordings for the admin pages but looks the
record up by `xml_cdr_uuid` alone, with no domain filter. **Do not link the portal
at it.** `service/recording.php` pins the lookup to the caller's domain and, without
`xml_cdr_domain`, to their own extensions.

Live and historical data are kept in separate components on purpose, so a
stalled socket cannot make the history look wrong, or the reverse.

## Demo data

There is no browser in the agent environment and a fresh install has an empty
portal, which makes every screen look correct and proves nothing. `app/demo_data`
generates calls, recordings, transcripts, tags, notes, contacts and extensions
into the same tables the portal reads, so the filters, the paging, the status
partition and the charts all run against real rows.

Turn it on at **Advanced → Data & Telephony → Demo Data**, or with
`app/demo_data/resources/cli.php on --domain=<name>`. Everything generated is
listed in `v_demo_data_records`; turning it off deletes exactly those rows, so it
is safe on a database that also holds real calls. Read
`app/demo_data/README.md` before changing what it generates — several details in
there are load bearing, in particular that `answer_stamp` is written on every leg
on purpose.

## Charts

Chart colour is **computed, not chosen by eye**. Before shipping any palette, run
the validator in the `dataviz` skill. The obvious green/red pair for
answered/missed **fails** colour vision deficiency separation (ΔE 4.9); the
portal uses `#1677ff` / `#ff4d4f`, which passes every check including contrast.

Dark mode needs its own validated steps against the dark surface. Never flip the
light values automatically.

**A chart mark is not a UI colour.** The palette's `error.main` and purple main on
dark (`#a61d24`, `#642ab5`) are drawn to sit under text on a chip or button. As a
filled shape on the page they fall outside the lightness band and reach only
2.5:1 against the surface. The chart takes the step from the same ramp that
passes: `redDark[5]`, `purpleDark[6]`.

### Two deliberate deviations from the reference

Both are load bearing. Do not "correct" them back without re-measuring.

1. **`text.secondary` uses `grey[500]`, not `grey[400]`.** The reference's
   `#595959` reaches 2.67:1 on the paper colour — below the 4.5:1 body text
   needs, and darker than its own disabled step. `grey[500]` reaches 5.57:1.
2. **`background.paper` is `grey.A50` (#121212) and `default` is `grey.A800`
   (#1e1e1e).** `mantis-tokens.css` lists these the other way round, but
   `palette.js` in the same reference computes the pair used here, and `MainCard`
   draws its border with `grey.A800`: against a #1e1e1e paper that border is
   invisible.

`customShadows.z1` is based on `common.black`, never `grey[900]` — that step is
white on the dark scale and would ring every raised surface with a white glow.

## Localisation

All user visible text goes through `react-intl`. Message catalogues live in
`spa/src/locales/`. English and Vietnamese are both first class — a new string
lands in both files in the same change, never one and a TODO.

Do not hardcode a Vietnamese or English string in a component.

## Call status

**Never decide "answered" from `answer_stamp`.** The switch sets an answer stamp
on legs that never connected. On this system every one of the 314 records has
one, including those with status `cancelled`, `busy` and `failed` — counting them
reports every abandoned call as answered.

The `status` column is the value FusionPBX itself displays and filters on, with
seven values: `answered`, `no_answer`, `busy`, `missed`, `voicemail`,
`cancelled`, `failed`. When it is empty the CDR page derives it from `billsec`,
`hangup_cause`, `missed_call` and the destination number.

`app/portal/resources/call_status.php` expresses those same rules as SQL. Both
portal endpoints use it, so the dashboard totals, the history filter and the row
badge can never disagree. The seven statuses must partition the result set —
check that they sum to the unfiltered total after any change.

## Building

```sh
cd app/portal/spa
npm install       # .npmrc pins legacy-peer-deps, the lint toolchain needs it
npm run build     # writes to /var/www/fusionpbx/p
```

`/p/` is generated output and is not committed. Node 20+ is required (Vite 8);
Debian 12 ships Node 18, so it is installed from NodeSource.

After changing anything in `spa/src`, rebuild — the served page is the build, not
the source.

## Verifying

There is no browser in the agent environment. Verify what can be verified and say
plainly what cannot:

- endpoints with `curl` against `https://127.0.0.1` with a `Host: fusionpbx` header
- the websocket handshake with a small Node script, including a **bad token** to
  prove the refusal path actually fires
- routes and assets return 200, and the built bundle contains the expected code

Do not claim the interface renders correctly. You have not seen it.
