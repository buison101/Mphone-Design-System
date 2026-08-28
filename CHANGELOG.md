# Changelog

## 2.5.0 — 2026-08-28

- Added the **App phone** section at `/app-phone`: the whole Mphone app rebuilt in Mantis at the 360 × 780 reference device, with a screen index on the left and the app running in a device frame on the right.
- Eight screens: Đăng nhập, Cuộc gọi, Tin nhắn, Gọi điện, Máy nhánh, Cài đặt, Chi tiết tin nhắn and Đang gọi. The last two are detail screens the app only reaches through a row, so the index jumps to them directly.
- Added `PhoneFrame`, `AppTopBar` and `AppBottomNav` as experimental. Bottom navigation carries five destinations, not the app's six — the app's own audit flags six as a risk at narrow widths with Vietnamese labels, and it is right.
- The conversation and in-call screens reuse `MessageThread`, `MessageComposer` and `CallPanel` unchanged. A design system that needs a mobile fork to render a conversation at 360px has a hole in it, and this page is where that gets checked.
- Sign-in offers one primary path and QR pairing, against the app assistant's six. QR is kept because it is the only route that does not ask someone to type a SIP password on a phone keyboard.
- Settings groups by what a setting changes rather than which service owns it, switches act immediately with no Save button anywhere, and no row carries both a switch and a chevron.
- Extensions uses a radio rather than a switch per row: the device answers as exactly one extension, and a column of switches would suggest otherwise.
- Added 65 matching Vietnamese and English messages and advanced the catalog badge to v2.5.

## 2.4.0 — 2026-08-28

- Added `/webphone`, the web form of the app's Bàn phím screen: keypad, recent calls and the internal directory on the left, the live call on the right.
- Added `WebphoneProvider` — one call session for the whole portal, so a call survives navigating away from the page it started on. Chat and Webphone now share it instead of each holding their own.
- Added `IncomingCallDialog`, rendered by the provider so a ringing call reaches the reader on any page. It cannot be dismissed by Escape or a backdrop click; answer and decline are the only ways out.
- Added `sections/webphone/sipSession.js`, a SIP.js 0.21 transport loaded only when the server supplies credentials. It has never talked to a real FreeSWITCH and is marked as such in the file.
- The portal falls back to a simulated driver when SIP config is absent, and says so on screen — a demo call that looks real is worse than no demo at all.
- `WebphonePanel` gained `dialPad={false}` for surfaces that already offer a keypad; the Webphone page showed two pads before this.
- Added `docs/13-app-screen-map.md` mapping the app's 61 fragments and 9 baseline screens onto the Portal, with the server-side gap for real calling written out.
- Added `sip.js@0.21.2`. Run `npm install` in `app/portal/spa` before the next build.
- Added 14 matching Vietnamese and English messages and advanced the catalog badge to v2.4.

## 2.3.0 — 2026-08-28

- Reconstructed the Mantis chat screen as `/chat`: conversation rail, message thread and a right column that is either the contact or the softphone.
- Added `ConversationList`, `MessageThread`, `MessageComposer`, `ContactPanel` and `PresenceBadge` as experimental, all presentational and driven entirely by props.
- Added the webphone surface — `DialPad`, `CallPanel` and `WebphonePanel` — which holds no SIP session: every state arrives as a prop and every intent leaves as a callback, so a SIP.js client, a click-to-call bridge and the demo driver can all drive the same UI.
- Call events render inside the message timeline rather than in a separate history, because on a PBX the call and the message are one conversation.
- Presence is always a ring plus its name in text; colour alone never carries the state.
- Below md the three columns collapse to one: the rail and thread swap in place and the right column becomes a drawer that starts closed.
- Mantis fills its right rail with shared files and links; this portal has no file store behind chat, so that block is recent calls with the same person instead.
- Messaging has no endpoint yet — `sections/chat/chatSample.js` stands in for one, and `useWebphoneDemo` walks the call states on timers. Both are named for what they are and both are replaced by changing an import.
- Added 55 matching Vietnamese and English messages and advanced the catalog badge to v2.3.

## 2.2.0 — 2026-08-28

- Rebuilt the Account screen on the Mantis account shape: one tabbed card over Profile, Extensions, Devices and Security, replacing the previous stack of four separate cards.
- Added `TabbedCard`, `DetailList`, `DangerAction` and `ProfileSummaryCard` as experimental, all composed from registered components and semantic tokens.
- Account keeps a single H1 and lets the tab strip name the section; Mantis retitles the page per tab, which announces a new document for what is still one record.
- Only server-backed actions appear: Mantis ships Change Password and notification preferences on this screen, and the portal has no endpoint for either.
- Device rows lay themselves out instead of using ListItemText with a secondaryAction, which MUI positions absolutely and which landed on top of the wrapped activity line at 390px.
- Ended sessions moved behind the existing history toggle, and the device holding the current session is labelled and has no sign-out control.
- Added the Design System catalog to the sidebar for preview builds only, gated on `VITE_PORTAL_PREVIEW`, so every route is reachable from one place while reviewing.
- Renamed the Vietnamese Analytics navigation item to "Bảng phân tích"; it sat inside a group already called "Phân tích".
- Added 27 matching Vietnamese and English messages and advanced the catalog badge to v2.2.

## 2.1.0 — 2026-08-28

- Reconstructed the Mantis analytics composition on the Mphone foundation: `WelcomeBanner`, `SparkStatCard`, `RankedListCard`, `ActivityListCard`, `ProgressListCard`, `SupportCard` and `SetupProgressCard` join the component layer as experimental.
- Added the `sections/analytics` compositions `CallTrendCard`, `CallTrendChart`, `RecentCallsTable`, `QualityReportCard`, `CostReportCard` and `ChannelMixCard`, all built from registered components and semantic tokens.
- Added the `/dashboard/analytics` route, its navigation entry and 74 matching Vietnamese and English messages.
- Moved chart series colours into `utils/chartSeries.js` so answered, missed and unconnected cannot drift between charts, and extended the ramp with on-net, off-net and mobile marks checked in both colour schemes.
- Chart axes now format their own ticks: call cost shows compact amounts instead of a clipped currency string, and sparklines pad a narrow domain so a stable rate is not drawn against the top edge.
- Analytics buckets are stored as ordinals and rendered through the reader's locale, so weekday, week and quarter labels follow the language switch.
- Analytics currently reads `sections/analytics/analyticsSample.js`; the endpoint swap is the only change needed before release.

## 2.0.0 — 2026-08-28

- Added the machine-readable component registry with owner, lifecycle status, source path, and introduced version for eight stable production components.
- Added versioned token builds that generate CSS and JSON artifacts from canonical core and semantic sources.
- Added automated validation for token structure, semantic groups, registry integrity, component sources, version alignment, and Vietnamese/English locale parity.
- Added a JSON Schema contract for AI-generated pages and formal contribution, release, deprecation, migration, and quality workflows.
- Added 28 Playwright quality checks across desktop-dark and 390px mobile-light, covering accessibility, single-H1 structure, page overflow, and visual regression on four golden routes.
- Added a CI workflow for Design System validation, Portal lint/build, and browser-suite discovery.
- Added the Governance section and separate Portal/Design System version badges to the Living Design System.
- Upgraded React Router and Vite to patched releases; production dependency audit now reports zero known vulnerabilities.

## 1.4.0 — 2026-08-28

- Restricted all web UI/UX work to the customer Portal; FusionPBX PHP administration remains outside visual-development scope.
- Extended the shared `PageHeader` pattern to Missed Calls, Recordings, Reports, and Account.
- Added matching Vietnamese and English page descriptions for those four high-frequency routes.
- Replaced native browser confirmations for account device sign-out actions with the shared destructive confirmation dialog.
- Upgraded missed-call callback feedback to semantic success/error alerts with a network-failure fallback.
- Added bounded horizontal scrolling for dense Missed Calls, Recordings, Reports, and Account tables on narrow screens.
- Added the shared responsive `FilterBar` pattern to Reports, Recordings, and Missed Calls.
- Replaced blank loading regions with accessible structured skeletons through the shared `ContentState`.
- Added live FilterBar and loading-skeleton examples to the authenticated Design System catalog and advanced its badge to v1.4 RC.
- Made the FilterBar example explicitly discoverable by its component name and bilingual production-use description in the Pattern tab.
- Added reset-to-default and accessible background-updating behavior to the shared FilterBar.
- Added a reusable 350ms debounce hook and applied it to Recording search so typing does not request data for every keystroke.
- Made the catalog FilterBar example interactive, including its reset state.
- Added the shared responsive `DataPagination` pattern with localized result ranges and applied it to Contacts, Missed Calls, and Recordings.
- Added an interactive `DataPagination` example to the authenticated Design System catalog.
- Added the shared accessible `DataTableContainer` pattern to Recordings, Missed Calls, Reports, and Account devices.
- Added keyboard focus treatment and localized horizontal-scroll guidance for data tables on narrow screens.
- Added a production-component `DataTableContainer` example to the authenticated Design System catalog.
- Extended `DataTableContainer` to Active Calls, Call History, and the Dashboard recent-calls table.
- Replaced Call History's isolated pagination with `DataPagination` while preserving selectable row counts.
- Extended the catalog pagination demo with interactive page-size selection.
- Simplified Call History filters into an always-visible primary row and an expandable advanced group with an active-condition count.
- Added debounced Call History search and accessible background-update feedback while preserving all server-side query parameters.
- Extended the catalog FilterBar demo with expandable advanced-filter behavior.
- Hardened Settings with unsaved-change indication, forwarding validation, discard behavior, disabled pristine submission, and network-failure handling.
- Added network-failure fallbacks to Contacts click-to-call and Account device actions.
- Completed the production audit across all ten authenticated Portal routes at desktop and 390px, including Vietnamese/English and light/dark switching.
- Promoted the Living Design System badge from release candidate to v1.4 Stable and closed Gate 5.
- Verified production formatting, ESLint, Vite build, real-data rendering, 390px layout, light/dark, Vietnamese/English, and browser console.

## 1.2.0 — 2026-08-28

- Added the authenticated Living Design System at `/p/design-system` without exposing it in customer navigation.
- Added interactive Foundations, Components, Patterns, Templates, and AI Contract sections.
- Added production-component examples for buttons, forms, statuses, feedback, content states, destructive confirmation, dashboard, list, form, and detail templates.
- Verified desktop/mobile, light/dark, Vietnamese/English, interactive confirmation, production lint/build, and browser console.
- Added Living Design System operating documentation.

## 1.1.0 — 2026-08-28

- Chuẩn hóa `PageHeader` cho Tổng quan, Cuộc gọi, Lịch sử, Danh bạ và Cấu hình.
- Bổ sung `ConfirmActionDialog` cho thao tác kết thúc cuộc gọi.
- Chuẩn hóa phản hồi click-to-call bằng Alert semantic.
- Thêm component catalog và prompt contract cho AI.
- Ánh xạ spacing, typography, sub-tab và touch target 48dp sang luồng Bàn phím–Lịch sử–Danh bạ Android.

## 1.0.0 — 2026-08-28

- Established Mphone experience principles and system scope.
- Added primitive and semantic token sources for light and dark schemes.
- Defined foundations, component contract, telecom patterns, page templates, governance, and platform mapping.
- Adopted Mantis as the Portal structural reference without copying Pro source.
