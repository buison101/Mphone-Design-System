# Mphone Portal UI Lab — Project Control

This file is the source of truth for project scope, delivery stage, and rules for every agent working in this workspace. Read it completely before changing the Design System or Portal UI Lab.

## Current operating mode — local UI lab

This workspace is now a **local interface experimentation environment**, not a production deployment workspace.

- The legacy Portal preview remains available at `http://localhost:4321/` for comparison until the product owner approves the MPO Design cutover. The MPO Design preview is served separately at `http://127.0.0.1:4323/`.
- Build all new Portal migration work in `portal-worktree/app/portal/mpo-design`. Keep `portal-worktree/app/portal/spa` as a read-only product, behavior, content, localization, and accessibility reference unless the product owner explicitly requests a legacy fix.
- `portal-worktree/app/portal/mto` is an abandoned, faulty implementation. Do not inspect, read, copy, import, compare against, repair, build, test, or cite it. It is not a product, design, content, localization, behavior, architecture, or migration reference.
- Use local sample data, stubbed sessions, simulated actions, and presentational adapters. A prototype must remain understandable when no FusionPBX server, SIP service, database, Android project, or external network is available.
- **Do not connect to, deploy to, copy files to, or change the internal FusionPBX server.** Do not use SSH, SCP, rsync, remote shell commands, production builds, production databases, or server-side configuration from this workspace.
- **Do not edit or build the external Android application** at `D:\Projects\FusionPBX\tham-chieu\linphone-android-master-copy` or any other application repository.
- **Do not edit FusionPBX PHP administration, themes, services, endpoints, permissions, database schemas, or generated `/p/` production output.** Existing copies may be read only as historical/product context.
- Do not replace sample data with live endpoints or turn the simulated Webphone into a real SIP/PBX integration unless the product owner explicitly changes this operating mode in writing.
- If a requested concept appears to require backend or native-app work, represent the proposed experience in the Portal with mock data and document the integration boundary; do not implement outside this UI Lab.
- Instructions elsewhere in this workspace that describe server deployment, Android changes, real authentication, production endpoints, or production verification are historical constraints and do not authorize those actions. This section takes precedence for all new work.

### Local preview workflow

For the legacy reference, from `portal-worktree/app/portal/spa`:

1. Run `npm run preview:build` to refresh the self-contained preview.
2. Run `npm run preview:open` to serve it at `http://localhost:4321/`.
3. Verify the affected routes locally in Vietnamese and English, light and dark themes, desktop and 390px layouts.
4. Run formatting, lint, build, and relevant local quality checks. A production deployment is never part of completion.

## Current position

- **Current release:** Portal UI Lab v2.5; Portal v1.4 and Design System v2.0 remain the last production-era baselines.
- **Current stage:** Gate B1 accepted; Phase C route classification and Mphone UI Lab product experimentation may begin. Gate B2 remains open for the Component Catalog.
- **Primary target:** `http://localhost:4321/`.
- **Active Portal target:** `portal-worktree/app/portal/mpo-design`.
- **Legacy Portal reference:** `portal-worktree/app/portal/spa`.
- **External server and Android app:** reference only; no writes, builds, deployments, or runtime integration.
- **Shared system:** `D:\Projects\FusionPBX\design-system`.
- **Last scope update:** 2026-09-02.

## Active migration — Mantis 4.2.0 Portal

The Portal UI Lab is migrating to a new Mantis 4.2.0 foundation.

- **New implementation target:** `portal-worktree/app/portal/mpo-design`
- **Legacy Portal reference:** `portal-worktree/app/portal/spa`
- **Primary technical foundation:** the licensed Mantis 4.2.0 Vite JavaScript full version.
- The product owner confirms that an official licence for the new Mantis package has been purchased.
- `mpo-design` is the sole source of truth for all new Portal implementation work.
- Restart the migration from Stage 1 in `mpo-design`. No implementation decision, completion claim, inventory, test result, or documentation from the abandoned implementation carries forward.
- Preserve `spa` for reference throughout the migration. Do not overwrite, rename, delete, or mechanically merge it into `mpo-design`.
- Do not switch the primary preview to MPO Design or retire the legacy Portal until the product owner explicitly approves the cutover.

### First-stage objective

The first objective is to establish a clean, complete Mantis 4.2.0 baseline in `mpo-design`. Preserve all pages, routes, navigation, dashboards, widgets, applications, forms, tables, charts, authentication demonstrations, maintenance pages, component demonstrations, themes, responsive layouts, and interaction states.

During Stage 1, change only vendor security/configuration and the local simulation layer required for safe UI Lab operation. Do not translate, rebrand, add Mphone pages, remove pages, merge pages, or redesign the Mantis experience.

**Gate A was retired on 2026-09-02 and is not a precondition for anything.** It specified construction work — replacing external runtime dependencies with local adapters, building fixtures, removing every runtime external host — and that whole body of work belongs to the abandoned `mpo-design-off` tree. The chosen tree deliberately does not take that route: it reads the vendor mock API precisely so that no one hand-builds data that drifts from real Mantis. Requiring Gate A would be demanding back the thing that was rejected. Treat its criteria and its evidence as history of `-off`, never as outstanding debt against the current tree. What remained useful in it — a record of how every route renders, the console, lint and build, and 390px light/dark — became the baseline snapshot taken during wave L1 (`docs/15` §4.9): a one-time record for attributing later breakage, not a bar to clear and not something to sign off.

**Gate B1 was accepted by the product owner on 2026-09-03 after manual verification.** Phase C may now classify routes and introduce approved Mphone branding, content, products, new pages, and UI Lab experiments in project-owned paths. The Component Catalog remains covered by Gate B2, which does not block product work; until B2 runs it stays in English, labelled a UI Lab surface.

The canonical detailed roadmap is `docs/15-mpo-design-implementation-plan.vi.md`. Do not create a second migration plan; update that file and this controlling summary together.

### Bilingual Mphone content

- Every user-visible string must resolve through the shared localization system at runtime. Do not add new hardcoded Vietnamese or English to components. Vendor English left in vendor files is bound to a key through the keymap rather than edited out — see Localization architecture below.
- Every message key must have complete Vietnamese and English content in the same change. Neither language is secondary, temporary, or a TODO.
- Preserve each Mantis page's structure and demonstration purpose during the first stage, but replace generic demo copy with content relevant to Mphone products and services.
- New copy must follow the Design System principles: Calm, Clear, Certain, Efficient, and Human.
- Copy must be concise, natural, consistent, and understandable to telecommunications customers. Do not translate word by word when that produces unnatural language.
- Use consistent terminology for features, states, actions, validation, errors, and guidance across all pages.
- English must be complete product copy, not an incomplete fallback for Vietnamese.
- Do not retain Mantis company names, brands, customers, products, addresses, phone numbers, or commercial sample data. These vendor sample identities are replaced during the bilingual phase rather than waiting for Stage 6 — a bounded exception, decided 2026-09-02 and specified in `docs/15` §4.8. Replacement is name-for-name from one shared set of invented, non-sensitive sample identities, carrying a single value across every locale because a name is not a translation. It does not authorize changing a page's purpose, its layout, or introducing Mphone product semantics.
- Do not copy real customer data from the live Portal into local fixtures.

When a Mantis page has no current Mphone equivalent, preserve its page and layout, reinterpret its content as a plausible Mphone scenario, use local sample data, label it clearly as sample, experimental, or unconnected where appropriate, and document the future integration boundary.

### Localization architecture

Localization does not edit vendor source. As of wave L6, `mpo-design` differs from the pristine Mantis 4.2.0 extract by 86 modified files, one rename and four additions out of 1,113 in `src` — mostly hoists, each listed in `docs/vendor-patches.md`; keeping that number small is what makes the next Mantis version an upgrade rather than a rewrite. `docs/15-mpo-design-implementation-plan.vi.md` §4.7 holds the full design.

- **`i18n/keymap.json` is the contract.** Each entry binds one string position in vendor source — file, occurrence, source text — to one semantic message key, plus the context, routes, role and length budget a translator needs.
- **Keys are semantic, never the English sentence.** The same English word in two contexts gets two keys, so it can have two Vietnamese translations. This is the reason for the keymap rather than a global dictionary.
- **Substitution happens at build.** A Vite plugin replaces only the positions listed in the keymap. It never guesses: a string with no keymap entry is left untouched. This keeps the transform deterministic and auditable.
- **Machines propose, people decide.** `i18n:extract` proposes candidates with their surrounding context; a person assigns the key, writes the context note, and translates. Translation quality lives in that review step.
- **Project catalogs live at `src/locales-mphone/{en,vi}.json`**, merged with the vendor catalog at load. Never add keys to `src/utils/locales/` — the vendor owns that path and the next Mantis will overwrite it.
- **Never reformat vendor files.** One Prettier or `eslint --fix` pass over vendor paths destroys every comparison against the vendor tree. The guard is not an ignore file — ignoring `src/` would blind the linter on our own patched files too. It is that **the commands that write are scoped and the commands that check are not**: `npm run prettier` and `npm run lint:fix` cover only project-owned paths and the files in `docs/vendor-patches.md`, while `npm run lint` and `npm run prettier:check` still cover all of `src`. Never run `prettier --write` or `eslint --fix` with a broad `src/**` glob.
- **Every vendor file that must be edited goes in `docs/vendor-patches.md`** with its reason and how to reapply it. Before editing one, ask whether the change can be made a level higher — a MUI theme override instead of nineteen inline edits, for example.
- **A locale switch must be one synchronous render, and it must remount.** The catalogs are imported statically and the runtime singleton and date-fns defaults are set during render, not in an effect — otherwise React commits a frame where the locale has flipped but the text has not, and the interface visibly mixes the two languages. `IntlProvider` is keyed on the locale so the subtree remounts, because a component that copied a translated string into state keeps the old language until it unmounts. Do not "optimise" either of these back.
- **Date, month, weekday and day-period wording is not in the keymap.** Libraries generate it from a locale code, so the decision lives in `src/locales-mphone/date-locale-vi.js` and the table is in `docs/19`. Three consumers, three separate wirings: direct `format()` calls, MUI pickers, and FullCalendar — fixing one does not fix the others.
- **Verify by reading the rendered text, in DEV mode.** Not by the coverage number, not by `pageerror`, not by a production build alone. Every occurrence kind the extractor knows about was added because the tools reported full coverage while the screen still showed English. §4.7 lists the kinds and the two opt-in files that gate the risky ones, `i18n/array-exceptions.json` and `i18n/call-arguments.json`.
- **Not every translatable-looking string is a string.** Some are message ids handed to `<FormattedMessage id={...} />` — a menu `title`, a breadcrumb slug — and translating those in source breaks the lookup and puts a raw id on screen. Others are reference or sample data — a country list, a film catalogue, coordinates — where a wrong translation is a data error, not a wording error. Both are listed with reasons in `i18n/id-files.json` and `i18n/data-files.json`, and the scanner skips them. Read how a string is consumed before translating it.
- **A display string must never double as a lookup key.** Sorting that compares `sortBy === 'Customer Name'`, or a chart series keyed by its label, breaks the moment that text is translated — sometimes loudly, usually silently. `i18n:check` warns when a string is used both ways; confirm the two uses are independent, or give the lookup a stable key of its own.
- **The dev server caches the keymap at startup** and reloads it on a watcher event. A keymap replaced wholesale, rather than edited in place, can leave the server serving the old one while every page looks convincingly translated. After a bulk keymap change that did not come from an in-place edit, restart the dev server before believing what you see.
- **Keep the pristine vendor tree of every version.** `.tools/mto-stage-20260902/full-version` is the untouched 4.2.0 extract and must not be deleted; it is what makes vendor-to-vendor diffs possible.

### Read-only live Portal reference

`https://call.mphone.vn/p/` may be inspected read-only to understand current Mphone terminology, route groupings, bilingual copy, visible data structure, call states, reports, recordings, contacts, account settings, and product behavior that MPO Design should preserve.

- Use only a Chrome session or access details supplied directly by the product owner for the current work session.
- Never store usernames, passwords, cookies, tokens, or sessions in `AGENTS.md`, source code, fixtures, tests, screenshots, logs, documentation, or committed files.
- Never repeat credentials in progress reports or handoffs.
- Do not change data, configuration, or state in the live Portal.
- Do not deploy, upload, or synchronize anything from this workspace to the live Portal.
- Inspect only what is necessary for the local implementation, and do not transfer real or sensitive customer data into MPO Design.

The live Portal is a read-only product reference, not a test environment or deployment target.

### Vendor-source security

The supplied Mantis 4.2.0 packages contain a GitHub PAT in package scripts, together with APM, telemetry, vendor `.env` files, and external-service adapters.

- Never run vendor `setup:apm:*` or `install:apm:*` scripts.
- Never copy, use, validate, display, or commit the embedded PAT.
- Never import vendor `.env` files or run vendor telemetry or scripts that download and execute remote content.
- Before committing migrated code, inspect staged files for credentials, telemetry, vendor environment values, and unintended external URLs.

Preserving all Mantis pages means preserving the UI experience, not retaining credentials, telemetry, or live external connections.

### Integration and simulation policy

Pages involving Auth0, Firebase, Supabase, Amazon Cognito, Google reCAPTCHA, mock APIs, e-commerce, customers, invoices, chat, or other external services must continue to render with enough state and interaction for visual evaluation, but must use local fixtures, stubbed sessions, or simulated actions. They must not require external accounts, transmit workspace data externally, or present a simulation as a live integration.

**Recorded exception, decided by the product owner 2026-09-02.** `mpo-design` reads the Mantis vendor mock API rather than a hand-reconstructed local data layer, because rebuilding fixtures by hand is what made earlier trees drift from the vendor and lose pages silently. It therefore does load some vendor-side hosts at runtime — the mock API, flag and map-tile services, and web fonts. The boundary is strict: vendor demonstration data only, read-only requests, no writes, no Mphone or customer data leaving the browser, and no presenting any of it as a live Mphone integration. An offline cache keeps the UI Lab usable when those hosts are unreachable. This exception covers the vendor demo layer and nothing else; it does not relax any other rule in this section.

Do not connect Webphone to real SIP/PBX services, use a production database, or connect MPO Design to the FusionPBX backend during the UI Lab stage.

### Vendor archive handling

- Treat the original Mantis ZIP and Figma files as local reference inputs.
- Do not commit or redistribute them without explicit product-owner approval.
- Never extract them over `spa`, `mpo-design`, or the workspace root; use a dedicated staging directory.
- Do not use broad ignore rules that could hide reviewed `mpo-design` source.
- Commit only the Mantis source incorporated into `mpo-design` after embedded credentials, telemetry, and unsafe configuration have been removed.
- Never place purchase information, licence keys, or access credentials in the repository.

### Migration stages

1. **Stage 1 — clean baseline (closed; the local-adapter half describes the abandoned `-off` tree):** Create `mpo-design` from clean licensed Mantis 4.2.0 source, preserve every page and route, and remove unsafe vendor configuration. The chosen tree stops there and keeps the vendor mock API rather than replacing external runtime dependencies with local adapters — see `docs/16-mpo-design-stage-1-status.md` for what it actually contains.
2. **Stage 2 — localization foundation:** Inventory every user-visible string, bring it into shared localization through the keymap described below, and maintain complete matching English and Vietnamese catalogs.
3. **Stage 3 — Vietnamese content:** Write natural Vietnamese that preserves the exact meaning and purpose of the Mantis English experience. Change text only; do not introduce Mphone product semantics yet.
4. **Stage 4 — bilingual verification:** Verify every page in Vietnamese and English, light and dark themes, desktop and 390px layouts, including accessibility and interaction states. Gate B1 must pass before product work begins; Gate B2 covers the Component Catalog and runs later.
5. **Stage 5 — route classification:** Classify each Mantis route to retain, adjust, merge, redesign, keep only in the UI Lab, or propose for removal. Do not remove or merge routes without product-owner approval.
6. **Stage 6 — Mphone branding and content:** Apply Mphone identity and rewrite approved demo scenarios with non-sensitive bilingual sample data while keeping experimental and unconnected behavior honest.
7. **Stage 7 — Mphone product surfaces:** Reimplement verified Portal behavior from `spa` and add approved Mphone experiences in prioritized vertical slices. Do not import `spa` source files into the `mpo-design` build.

### Per-page acceptance

Every MPO Design page must be verified in Vietnamese and English, light and dark themes, desktop and 390px layouts, without page-level horizontal overflow, clipped or overlapping text, unintended external requests, runtime errors, console errors, leaked credentials, or real customer data. Verify keyboard navigation, visible focus, loading, empty, error, disabled, and interactive states, plus local sample data and simulated actions.

A change is complete only after formatting, lint, local build, relevant quality checks, and visual inspection of the local preview pass.

## Product vision

Build one extensible Mphone product language by exercising future product ideas as coherent, navigable prototypes inside the local Portal. The Portal is the shared canvas for desktop, responsive, Webphone, analytics, chat, and mobile-app concepts. The system uses Mantis as a structural reference, keeps Mphone's own identity, and follows five principles: Calm, Clear, Certain, Efficient, and Human.

## Active UI Lab surfaces

- **Portal product pages:** the established dashboard, calls, contacts, recordings, reports, settings, and account experiences.
- **Bảng phân tích:** `/dashboard/analytics`, a sample-data analytics composition for call trends, service quality, queues, channels, and cost.
- **Webphone:** `/webphone`, a browser-call experience driven by simulation in the UI Lab. It must not register with a real PBX or place real calls.
- **App Phone:** `/app-phone`, a 360 × 780 in-Portal mobile product prototype with indexed screens and a device frame. It represents future app UX without changing the native Android project.
- **Chat and related experiments:** local, presentational experiences backed by samples or simulated state.
- **Living Design System:** `/design-system` within the Portal route base, using the same components and theme as the experiments.

New UI concepts should extend one of these surfaces or add a clearly named Portal route. They should reuse shared semantic tokens and components rather than become disconnected mockups.

## Delivery map

| Gate | Version | Outcome | Status |
|---|---|---|---|
| 0 | Discovery | Product inventory, constraints, reference direction, golden flows | Complete |
| 1 | v1.0 Foundations | Principles, color, typography, spacing, radius, elevation, motion, semantic tokens and governance | Complete |
| 2 | v1.1 Product patterns | Page hierarchy, navigation groups, content states, destructive confirmation, Portal golden flow and Android token mapping | Complete |
| 3 | v1.2 Living Design System | Visual catalog similar in purpose to Ant Design, component examples, usage rules, pattern demos and AI page contract | Complete |
| 4 | v1.3 Mobile golden flow | Login, Dialpad, incoming/active/ended call, History and Dialpad Contacts visually unified and device-tested | Complete |
| 5 | v1.4 Portal hardening | Complete the customer Portal experience, responsive behavior, content states and production consistency | Complete |
| 6 | v2.0 Scale and governance | Package/version tokens and components, contribution workflow, automated visual/accessibility checks and release process | Complete |

## Completed evidence

### v1.0

- Primitive and semantic token sources exist in `tokens/`.
- CSS token mapping exists in `css/tokens.css`.
- Foundations, components, patterns, templates, governance, and platform mapping exist in `docs/`.
- Portal v1.0 was deployed with a server backup and a successful production build.
- Android typography tokens use `sp`; a debug APK built successfully.

### v1.1

- Portal navigation is grouped by Overview, Calls, Insights, and Workspace.
- Dashboard uses four priority metrics plus supporting summaries rather than eight equal cards.
- `PageHeader` is shared by Overview, Active Calls, Call History, Contacts, and Settings.
- Ending a live call uses `ConfirmActionDialog`.
- Click-to-call uses semantic success/error feedback.
- Desktop and 390px mobile layouts were verified without horizontal page overflow.
- Light/dark and Vietnamese/English were verified in the signed-in Portal.
- The call-details drawer was verified with real data and no console errors.
- Android Dialpad, History, and Contacts use shared spacing/typography/sub-tab/touch-target tokens.
- Android `assembleDebug` succeeds. The current suite has 26 tests: 21 pass and 5 pre-existing configuration/session tests fail; resource-only UI work does not cause those failures.

### v1.2

- The authenticated Living Design System is available at `/p/design-system` and remains absent from customer navigation.
- Foundations, Components, Patterns, Templates, and AI Contract use production theme and components.
- Component examples cover actions, forms, status, feedback, empty/error states, and destructive confirmation.
- Template examples cover dashboard, list, form, and detail layouts without customer data.
- Desktop and 390px mobile were verified without horizontal page overflow.
- Light/dark and Vietnamese/English were verified, including interactive confirmation behavior.
- Portal Prettier, ESLint, production build, asset smoke test, and browser console inspection passed.

### v1.3 release candidate

- Android authentication now uses semantic page, field, section, and primary-action spacing roles.
- Login modes, login actions, and password visibility expose a minimum 48dp touch target.
- Incoming, active/paused, and ended call identity blocks share semantic spacing and typography.
- Caller names support two centered lines with safe ellipsis for long Vietnamese content.
- Dialpad, History, and Dialpad Contacts retain the shared v1.1 sub-tab and typography contract; the legacy Contacts tab remains outside active product scope.
- Android `assembleDebug` succeeds. The current suite remains at 26 tests: 21 pass and the same 5 inherited configuration/session tests fail.
- No emulator/device interaction was performed because it requires explicit authorization in the Android repository rules.
- Product owner manually validated the v1.3 Android build on 2026-08-28 and confirmed it was working as expected.

### v1.4 stable

- Web UI/UX scope is explicitly limited to the customer Portal; no FusionPBX PHP administration theme was changed.
- Missed Calls, Recordings, Reports, and Account now share the approved `PageHeader` hierarchy and bilingual descriptions.
- Account device sign-out actions use `ConfirmActionDialog` instead of native browser confirmation UI.
- Missed-call callback feedback uses semantic success/error alerts and handles network failure.
- Dense tables on Missed Calls, Recordings, Reports, and Account scroll within their cards at narrow breakpoints without page overflow.
- Reports, Recordings, and Missed Calls share the responsive, labelled `FilterBar` pattern.
- Shared loading states render accessible structured skeletons; the Living Design System demonstrates both FilterBar and loading examples.
- The Pattern tab labels the production filter example explicitly as `FilterBar`, rather than only by its generic search/filter category.
- FilterBar supports reset-to-default and an accessible background-updating state; Recording search is debounced by 350ms before querying.
- At 390px the FilterBar reset action fills the available width, the controls stack vertically, and the page does not overflow.
- Contacts, Missed Calls, and Recordings share the responsive `DataPagination` pattern with localized visible-result ranges.
- The Pattern tab includes an interactive `DataPagination` example using the same production component.
- Recordings, Missed Calls, Reports, and Account devices share the accessible `DataTableContainer` pattern.
- Narrow screens receive localized horizontal-scroll guidance; table regions are keyboard focusable with a visible focus ring.
- The Pattern tab includes a production `DataTableContainer` example.
- Active Calls, Call History, and Dashboard recent calls now use the same `DataTableContainer` contract.
- Call History uses `DataPagination` with preserved selectable page sizes and one-based display mapped to its existing zero-based state.
- Call History keeps search and date range visible, while extension, duration, direction, status, tag, note, transcript, and summary filters are expandable.
- The advanced-filter trigger exposes its expanded state and active-condition count; text search is debounced by 350ms.
- Settings exposes unsaved state, validates enabled forwarding destinations and ring duration, supports discard, and handles network failure.
- Contacts click-to-call and Account device actions handle network failure without leaving the interface stuck.
- All ten authenticated Portal routes were audited at desktop and 390px; no route-level horizontal overflow or runtime error screen was found.
- Vietnamese/English and light/dark switching were verified in the authenticated production Portal.
- Latest rollback backup: `/root/backups/mphone-design-system-v2.0-gate6-20260828-173838/`.
- Portal formatting, ESLint, and production build pass.
- Signed-in server checks cover real-data rendering, 390px without page overflow, light/dark, Vietnamese/English, and zero browser console errors.
- Rollback backups include `/root/backups/mphone-portal-v1.4-responsive-20260828-163958/`, `/root/backups/mphone-portal-v1.4-filter-loading-20260828-164454/`, and `/root/backups/mphone-portal-v1.4-catalog-badge-20260828-164644/`.

## Historical Gate 3 — v1.2 scope

Gate 3 created the living visual reference described below. This section is retained as historical acceptance criteria:

1. Foundations: brand/semantic colors, typography scale, spacing, radius, elevation, icon and motion guidance.
2. Components: Button, Input, Select, Form, Table, Chip/Status, Alert, ContentState, Modal/Drawer and ConfirmationDialog.
3. Every component state: default, hover/pressed, focus, disabled, loading, empty, error and destructive where applicable.
4. Patterns: authentication, search/filter, create/edit, permissions, destructive actions and system status.
5. Templates: dashboard, list, detail, form and mobile main flow.
6. Copyable usage guidance and explicit “use / avoid” examples.
7. AI page contract: required inputs, approved components/tokens and a review checklist.

The catalog must use the same production components and theme. It must not be a disconnected mockup. It may use an authenticated hidden route such as `/p/design-system`, but it must not appear in the normal customer navigation until product ownership explicitly approves that exposure.

### Gate 3 completion criteria

- Production build and lint pass.
- Catalog works in light/dark, Vietnamese/English, desktop and 390px mobile.
- No customer data is required to render component examples.
- At least one complete dashboard, list, detail and form example is present.
- Documentation and changelog are updated.
- Internal server deployment has a timestamped rollback backup.

## Historical later stages

### Gate 4 — v1.3 Mobile golden flow

- Apply the approved living-system patterns to login and call lifecycle screens.
- Preserve native Android behavior and call reliability over visual changes.
- Verify 1.0x and enlarged font scale, light/dark, long Vietnamese text, offline/error states and phone/tablet breakpoints.
- Build APK and run focused tests. Device/emulator interaction requires explicit user authorization for ADB or BlueStacks.

### Gate 5 — v1.4 Portal hardening

- UI work is limited to the customer Portal under `app/portal/spa` and its generated `/p/` output.
- FusionPBX PHP administration remains the backend/control plane and is outside UI/UX development scope.
- Complete responsive behavior, content states, high-frequency Portal flows and visual consistency against the Living Design System.
- Preserve server-side permissions, domain isolation, existing endpoints and customer workflows.
- Do not modify FusionPBX administration themes, including `themes/mybrand/custom.css`.

### Gate 6 — v2.0 Scale and governance

- Establish component/token versioning and release notes.
- Add automated contrast, accessibility and screenshot regression checks.
- Define contribution, review, deprecation and migration workflows.
- Prepare repeatable AI generation/evaluation prompts for new ecosystem products.

### v2.0 completion evidence

- Root package version `2.0.0` is canonical and matches the component registry.
- Eight stable production components have machine-readable owners, lifecycle states, source paths, and introduced versions.
- Core and semantic token sources build into versioned CSS and JSON artifacts.
- Root validation checks tokens, required semantic groups, registry integrity, component sources, lifecycle values, version alignment, and all 502 VI/EN message keys.
- The AI page input contract is expressed as JSON Schema and accompanied by generation/acceptance rules.
- Contribution, release, deprecation, migration, and automated-quality workflows are documented.
- Portal defines 28 Playwright checks across desktop-dark and 390px mobile-light: 20 accessibility/structure/overflow checks and 8 golden-route screenshots.
- CI validates the Design System contract, Portal lint/build, and browser-suite discovery. Authenticated browser execution requires an encrypted storage-state secret.
- React Router and Vite use patched releases; `npm audit --omit=dev` reports zero known vulnerabilities.
- The Living Design System includes a Governance tab and separates Portal v1.4 from Design System v2.0 version badges.

## Working rules

1. Treat `portal-worktree/app/portal/mpo-design` as the source of truth for all new Portal migration work. Keep `portal-worktree/app/portal/spa` as a read-only reference unless the product owner explicitly requests a legacy change.
2. Keep all implementation and verification local to this workspace and `http://localhost:4321/`.
3. Never deploy, upload, synchronize, or write to an internal/external server from this project.
4. Never edit the external Android project or use ADB, emulator, device, SIP/PBX, or production services as part of UI Lab work.
5. Do not create or modify PHP endpoints, database schemas, FusionPBX permissions, administration themes, or generated production output. Model required backend behavior with local fixtures and an explicit integration note.
6. Preserve unrelated dirty files and existing historical copies.
7. Read narrower `AGENTS.md` files before editing, but this document's **Current operating mode — local UI lab** remains the workspace-wide safety boundary and cannot be relaxed by narrower legacy instructions.
8. Portal UI changes must pass Prettier, ESLint, a local build, relevant local quality checks, and visual inspection of the local preview where available.
9. Update Vietnamese and English together for every visible string.
10. Reuse semantic tokens and approved components. Do not introduce one-off color, spacing, or typography values without documenting the missing semantic role.
11. Mantis Pro is a visual reference only. Do not copy proprietary source or assets.
12. Keep experimental behavior visibly honest: sample data is sample data, simulated calls are simulated, and unavailable integrations must not appear live.
13. Do not claim server deployment, real telephony, real-data integration, or native-app validation as part of local UI Lab completion.

## Progress reporting format

At the beginning of work, report:

```text
Current UI Lab focus → intended prototype outcome → Portal routes/files in scope → local completion checks
```

At handoff, report:

```text
Completed → locally verified → preview route → integration boundaries → known issues → next experiment
```

## Decision log

| Date | Decision |
|---|---|
| 2026-08-28 | Use Mantis for enterprise layout direction, not as a source-code dependency. |
| 2026-08-28 | Use semantic token names as the cross-platform contract. |
| 2026-08-28 | Keep Android native; share hierarchy and semantics rather than the Portal shell. |
| 2026-08-28 | Complete and validate one golden flow before expanding to new products. |
| 2026-08-28 | Build the Living Design System in v1.2 before deep mobile and PHP-admin convergence. |
| 2026-08-28 | Accept product-owner manual validation as the final device check for v1.3 and proceed to Gate 5. |
| 2026-08-28 | Restrict all web UI/UX development to the customer Portal; do not redesign the FusionPBX PHP administration interface. |
| 2026-08-29 | Convert this workspace into a local Portal UI Lab at `http://localhost:4321/`; prohibit server, production, and external Android changes. |
| 2026-08-29 | Treat Webphone, Bảng phân tích, App Phone, Chat, and future product concepts as Portal-hosted prototypes using samples and simulation. |
