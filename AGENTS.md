# Mphone Portal UI Lab — Project Control

This file is the source of truth for project scope, delivery stage, and rules for every agent working in this workspace. Read it completely before changing the Design System or Portal UI Lab.

## Current operating mode — local UI lab

This workspace is now a **local interface experimentation environment**, not a production deployment workspace.

- The primary product surface is the Portal preview at `http://localhost:4321/`.
- Build and demonstrate every new interface, interaction, page, mobile concept, and product experiment inside the existing Portal UI under `portal-worktree/app/portal/spa`.
- Use local sample data, stubbed sessions, simulated actions, and presentational adapters. A prototype must remain understandable when no FusionPBX server, SIP service, database, Android project, or external network is available.
- **Do not connect to, deploy to, copy files to, or change the internal FusionPBX server.** Do not use SSH, SCP, rsync, remote shell commands, production builds, production databases, or server-side configuration from this workspace.
- **Do not edit or build the external Android application** at `D:\Projects\FusionPBX\tham-chieu\linphone-android-master-copy` or any other application repository.
- **Do not edit FusionPBX PHP administration, themes, services, endpoints, permissions, database schemas, or generated `/p/` production output.** Existing copies may be read only as historical/product context.
- Do not replace sample data with live endpoints or turn the simulated Webphone into a real SIP/PBX integration unless the product owner explicitly changes this operating mode in writing.
- If a requested concept appears to require backend or native-app work, represent the proposed experience in the Portal with mock data and document the integration boundary; do not implement outside this UI Lab.
- Instructions elsewhere in this workspace that describe server deployment, Android changes, real authentication, production endpoints, or production verification are historical constraints and do not authorize those actions. This section takes precedence for all new work.

### Local preview workflow

From `portal-worktree/app/portal/spa`:

1. Run `npm run preview:build` to refresh the self-contained preview.
2. Run `npm run preview:open` to serve it at `http://localhost:4321/`.
3. Verify the affected routes locally in Vietnamese and English, light and dark themes, desktop and 390px layouts.
4. Run formatting, lint, build, and relevant local quality checks. A production deployment is never part of completion.

## Current position

- **Current release:** Portal UI Lab v2.5; Portal v1.4 and Design System v2.0 remain the last production-era baselines.
- **Current stage:** Governed local product/interface experimentation after Gate 6.
- **Primary target:** `http://localhost:4321/`.
- **Portal UI source:** `portal-worktree/app/portal/spa`.
- **External server and Android app:** reference only; no writes, builds, deployments, or runtime integration.
- **Shared system:** `D:\Projects\FusionPBX\design-system`.
- **Last scope update:** 2026-08-29.

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

1. Treat `portal-worktree/app/portal/spa` as the source of truth for all new UI Lab work.
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
