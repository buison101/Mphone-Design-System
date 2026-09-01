# Changelog

## Unreleased — MTO migration (Mantis 4.2.0)

### Stage 2, wave 1 — bilingual shell, authentication, maintenance and dashboards

- **The Portal speaks Vietnamese first.** `config.i18n`, `IntlProvider defaultLocale` and `<html lang>` are all `vi`, and the language switcher offers exactly the two languages the catalogs cover. The vendor's `fr`, `ro` and `zh` files went with them: they held the 168 menu keys and nothing else, so every new key would have fallen back to English inside a French-labelled UI.
- Rewrote the vendor's 168 flat message keys as **namespaced ids** (`nav.apps.customerList`, `auth.field.password`, `dashboard.kpi.users`) and localized the application shell, all five authentication providers, the maintenance and error screens and both dashboards — **395 keys, complete in Vietnamese and English**, written from one source so the two catalogs cannot drift.
- Added `npm run i18n:inventory` (candidate user-visible strings per area, re-runnable to measure a wave) and `npm run i18n:check` (fails on catalog disagreement, empty values, or an id the source references and no catalog has). `VITE_I18N_STRICT=1` wires react-intl's `onError` into a production build so a render check can fail on a missing message. See `docs/16-mto-string-inventory.md`.
- **The application fetched a script from a CDN on every page load** — `resize-observer-polyfill` from `cdn.jsdelivr.net`, in `index.html`. Unintended external requests are exactly what the per-page acceptance rule forbids, and `ResizeObserver` has been baseline since 2020 in every browser this Portal targets. Removed, along with two Google Fonts preconnect hints that opened connections for bundled fonts.
- Replaced the vendor's document head: title, description, keywords, author and a `schema.org` block naming `mantisdashboard.com`. The browser tab is a user-visible string.
- **`textTransform: 'capitalize'` title-cased Vietnamese.** CSS capitalises every word, so "Xem thống kê đầy đủ" rendered as "Xem Thống Kê Đầy Đủ". Button typography is `none` now, and labels are written in the case they should appear in — in both languages. Three component-level rules on wave-1 screens were fixed with it; the rest are listed in `docs/16`.
- **Header search matched the message id, not the label.** It filtered `child.title`, which is now `nav.apps.chat`. It formats first, so typing "trò chuyện" finds the chat page.
- The sidebar rendered raw ids for the dashboard group because the mock menu API fed flat vendor keys straight into `<FormattedMessage>`. `data/local-api.js` and `api/menu.js` are namespaced with the rest.
- Removed the remaining vendor brand surfaces in the shell: two `codedthemes.gitbook.io` nav links (one item kept, pointing at the live Portal, so the external-link and chip states are still demonstrated), the auth screens' "after purchasing the theme" alert, and the workspace switcher's "Acme Corp / Globex Inc. / Stellar Labs" — now three sample tenants a PBX customer would recognise, labelled in both languages.
- The drawer's landmark said `aria-label="mailbox folders"`, copied from a MUI example. It is the main navigation.
- Verified with lint, `i18n:check`, a strict production build, and Playwright over 14 routes in both languages, light and dark, at 1440px and 390px, plus the header popovers: no raw ids on screen, no missing-message errors, no console errors, no horizontal overflow.

## Unreleased — Portal UI Lab

- Aligned the Portal dark surface hierarchy with the rendered Mantis Pro reference: `#121212` canvas, `#1e1e1e` shell/default surfaces, `#141414` compact KPI and navigation states, low-opacity card borders, and a restrained expanded-drawer elevation.
- Added the Mantis Pro Analytics reference workflow and dark-mode comparison baseline for AI-generated Portal work.
- Matched the measured Mantis Pro Dark sidebar states: regular labels/icons use `#bfbfbf`; hover and active use a 5% white overlay, white label and blue icon; active keeps the 2px blue edge.
- Replaced the header connection badge with a keyboard-accessible Portal page search and added persistent Fluid/Container layout width controls; Container now allows up to 1440px.
- Mirrored the shared Ant Design phone icon horizontally across Portal surfaces.
- Promoted Design to a level-one preview navigation item; grouped Calls, History, Recordings, Missed Calls, Reports, Contacts and Settings under the nested Legacy design section while keeping App phone and Design System at level two.
- Removed `scrollbar-gutter: stable` from `DataTableContainer`. It reserved a gutter for a *vertical* scrollbar on a container that only ever scrolls horizontally, so on classic-scrollbar platforms every table sat 15px short of its card's right edge while lining up flush on the left — invisible on macOS overlay scrollbars, which is why it survived review. Measured, not read: container 1098px, clientWidth 1083px, table right edge 15px inside the card. Horizontal scrolling and the 390px scroll hint are unchanged.

## 2.14.0 — 2026-08-29

- Reconstructed Mantis's `Customer > Cards` as `/customer/cards`, in a new **Khách hàng / Customer** navigation section beside the existing directory list, so the two shapes of the same records sit next to each other while the reconstruction is under review. Mantis groups its customer screens the same way.
- **This one runs on real data.** Unlike the widget racks, the portal already has the endpoint: `contacts.php` answers with name, title, organization, type and the contact's phone numbers, paged, plus the scope of the directory and whether this identity may place a call. There is no sample-data file behind this page.
- Added `ContactCard` and `ContactPreviewDialog` as experimental, with `contactFields.js` as the one place that knows the endpoint's shape.
- **Nothing is drawn that has nothing behind it.** Mantis's card carries email, country, website, age, gender, education, employment and skills; `contacts.php` returns none of those. Six dashes in a row would tell a reader the record is empty rather than that the field does not exist, so the anatomy is kept — avatar and name over a rule, a body line, a two-by-two block of facts, chips, a footer with one action — and filled with what the directory actually holds: the primary number, the extension, the organization, the type, and every other number as a chip.
- **Add Customer, Edit, Delete and Export PDF are gone**, all four for the same reason: `contacts.php` answers 405 to anything that is not a GET. What takes the primary button's place is the control the screen genuinely needs — the extension a call is placed from. The overflow menu keeps what works without an endpoint: place the call, and copy the number.
- **Sorting says where it applies.** The endpoint sorts by name and accepts no sort parameter, so any sort here can only reorder the twenty rows on screen; the control is labelled "trong trang" / "this page" rather than implying the other four hundred moved. Search is the server's own `q` (name, organization or number), debounced at 350ms, capped at the 64 characters the server accepts, and it resets to page one.
- Page size offers 20, 50 and 100 — the three values `contacts.php` accepts. Anything else is silently coerced to 20 server-side, which is the kind of control that looks like it works.
- Added `sections/customer/callErrors.js`. `click_to_call.php` answers with a code and the codes are not interchangeable: `extension_forbidden` means the caller extension is not yours (retrying the number cannot help), `switch_unavailable` means FreeSWITCH never answered (the number is fine), `originate_failed` is the one worth retrying, usually because the caller's own handset is unregistered. The existing Contacts page maps all of them to one sentence; this page does not.
- `useAnalytics` gained an `enabled` option. A screen the identity has no permission for now renders its forbidden state without also putting a 403 in the server log on every open.
- The preview server stubs `contacts.php` with 24 Vietnamese directory records across eight organizations, honouring `q`, `page` and `page_size`, so search and pagination can be reviewed offline; the session stub also carries the permission keys `session.php` actually exposes (`contact_view`, `click_to_call_call` and friends) rather than the invented ones it had.
- Added 65 matching Vietnamese and English messages and advanced the catalog badge to v2.14.

## 2.13.0 — 2026-08-29

- Reconstructed Mantis's `Widget > Data` as `/widget/data`, preview-only, beside `/widget/statistics` in the Widget section. All eighteen cards, the same grid at the same breakpoints, the same fills; the content is a PBX tenant's and bilingual.
- Fourteen components in `components/cards/data/` do the drawing, and three of them draw more than one card — `PeopleListCard` (Team Members, User Activity, New Customers), `FeedListCard` (Feeds, Incoming Requests) and `MetricTable` (Application Sales, Latest Customers). The same shape with different data is one component; a copy made to match a card count is two things to keep in step forever. Traffic Sources needed no component at all — `ProgressListCard` gained a `stacked` layout instead.
- **The ink has to be chosen per colour scheme, and that is a defect class, not a preference.** This theme's grey ramp inverts in dark mode: `grey.800` is #141414 in light and #f0f0f0 in dark. An ink named from the grey ramp therefore flips to near-white on an amber fill the moment the reader switches themes, with nothing in the code to show for it. `dataInk.js` names `common.black` and `common.white`, which do not move, and picks between them per mode.
- Measured off the rendered page for chip-sized text, white then black: light primary #1677ff 4.10 / 5.12, warning #faad14 1.90 / 11.05, success #52c41a 2.27 / 9.27, info #13c2c2 2.20 / 9.52, error #ff4d4f 3.27 / 6.43; dark primary #1668dc 5.19 / 2.53, warning #d89614 2.53 / 8.29, success #49aa19 2.98 / 7.05, info #13a8a8 2.92 / 7.19, error #a61d24 7.44 / 2.24. `error` is the one tone that changes hands between schemes — which is why this is a table per mode rather than one rule.
- A chip carries 13px text, so the 3:1 large-text allowance never applies to it. White on `primary.main` is 3.83, enough for a display figure and not for a chip, so the blue chip takes v2.12's own `strong` escape hatch in light mode: `primary.dark` #0958d9 under white, 6.16, still the blue chip.
- Coloured text uses the ramp's `dark` step rather than `main`. `success.main` #52c41a measures 2.27 on white paper — under the bar for text and even for a graphical object — while `success.dark` #237804 measures 5.58, and because Ant's dark ramp runs light at the top end the same token reads 9.35 against #1e1e1e without a second value.
- Avatar initials are text, so the disc has to clear 4.5:1 rather than the 3:1 an icon needs. `success.main` on `success.lighter` measured 2.21; the initials take the ramp's `darker` step and now measure 10.10 to 15.77 in light and 9.50 to 13.44 in dark.
- **The priority scale is turned the right way up.** Mantis paints its highest priority green and its lowest red. The five fills are kept exactly; red now runs at the top of the scale and green at the bottom. Every chip still carries its word, because success #52c41a and warning #faad14 sit ΔE 0.3 apart under simulated protanopia.
- "View all" is drawn only on the six cards with a real destination — `/contacts`, `/calls/history`, `/billing` and `/reports`. The rest have no route in this portal, and a link that goes nowhere is worse than no link on a page whose whole purpose is to be copied from.
- `OrderTable`'s two action controls act. Mantis draws a pencil and a bin that go nowhere; here the pencil opens the quantity in the cell (Enter commits, Escape cancels) and the bin removes the row from the list the page owns. Pass no handler and the column is not drawn.
- The To Do card's plus opens a field that adds a line, for the same reason. Everything either control changes lives in the page's state, which is all a checklist on a widget rack owns.
- No image files. Avatars are initials on a tinted disc, Mantis's photo thumbnails are a tinted block with the type's icon, and the flag column is the region's dialling code — `docs/12` rule 6 forbids copying Mantis Pro assets, and a portrait that has not loaded is a hole in a list.
- The sample figures reconcile: the eight charges sum to the week's total printed above them, yesterday's figure is the newest row, the four plan rows multiply out to their own totals, and the nine region shares sum to 100.00%. All of it sits in `sections/widget/dataSample.js` behind message ids, so the day an endpoint exists the swap is one import.
- Added 231 matching Vietnamese and English messages and advanced the catalog badge to v2.13.

### Fixed while measuring this page (v2.11 – v2.12 components)

- **`widgetInk.js` picked its ink with `grey.800`, and this theme's grey ramp inverts in dark mode.** Every filled widget card came out with near-white ink on a light fill in dark mode — measured 2.22 on amber, 2.61 on green, 2.56 on teal — and the near-black tile turned into a **white tile carrying white text at 1.14**. `widgetSurface()` replaces `widgetFill()`: two halves, light and dark, naming `common.black` / `common.white`, with `grey.100` (#1f1f1f) as the dark scheme's dark tile. `/widget/statistics` now measures zero text failures in dark mode, down from thirteen.
- **MainCard silently discards a dark block passed through `sx`.** It emits its own `theme.applyStyles('dark', …)` and spreads it after the caller's, so both land on the same key and the caller's loses. That is what `darkSX` is for; `ChannelTile`, `FeatureMetricCard`, `IllustratedMetricCard` and `HeroStatCard` use it now. Worth remembering: the first fix looked right in the file and changed nothing on the page.
- **`themes/overrides/Chip.js` wrote `${color}.main` on `${color}.lighter` in light mode** while dark mode already used `darker`. Measured 1.83 on warning, 2.21 on success, 2.97 on error — the `light` and `combined` chips on `StatusStatCard`, `SparkStatCard`, `ProfileSummaryCard`, `MessageThread` and the header's connection badge were unreadable in one scheme and fine in the other, from one line. Both schemes take `darker` now; no fill, border or hue moves.
- Small text on a flat blue fill needs `strong`, and three places were missing it: `FeatureMetricCard`'s title renders at 16px (the v2.12 note assumed 20px, where the large-text allowance would have applied), `ChannelTile`'s caption, and `HeroStatCard` when filled. All three measured 4.10 against a 4.5 bar and now sit at 6.16.
- `ChannelTile`'s label at `opacity: 0.85` and `IllustratedMetricCard`'s at `0.88` took white to 4.20 and 4.39 on the blue fill in dark mode; both carry full ink now.

## 2.12.0 — 2026-08-29

- Rebuilt each Mantis statistics widget as its own component so a card can be lifted onto a real screen later: `MetricTile`, `FeatureMetricCard`, `ChannelTile`, `IllustratedMetricCard` and `WidgetMotif`. Mantis's fourth and fifth rows produced no new components — `PeriodStatCard` and `SparkStatCard` are already those shapes, and a copy made to match a row count is two components to keep in step forever.
- **Fills kept exactly, and no hex is hard-coded.** Read off the original with computed style rather than guessed from a screenshot: Mantis uses the same Ant ramp this theme ships, so blue is `primary.main` (#1677ff), amber `warning.main` (#faad14), green `success.main` (#52c41a), teal `info.main` (#13c2c2), red `error.main` (#ff4d4f).
- **Ink not kept, because it measures wrong.** Mantis sets white on all six fills; measured, that is 1.90 on amber, 2.21 on teal, 2.27 on green and 3.27 on red. `widgetInk.js` carries the table and the single rule that follows: a light fill takes dark ink, a dark fill takes white. No hue moves — the amber card is still the amber card.
- Kept Mantis's darker footer strip on `FeatureMetricCard` because the original has it, and it turns out to be what rescues the last shortfall: white on the blue fill is 4.10 flat (large text only) and 5.69 on the band, where the caption passes outright. The card title also went to weight 600, which moves 20px text over the large-text threshold the same pair already clears.
- Added `strong`, a measured escape hatch for the one case a band cannot fix — small text on a flat blue fill. It swaps `primary.main` for `primary.dark` (#0958d9), taking white from 4.10 to 6.16, same blue family. Off by default because `primary.main` is what Mantis draws. With it on, the illustrated row re-measured at 8.13/6.75 green, 6.16/5.09 blue, 9.70/7.85 amber — value and label both passing on all three.
- Illustrations are inline SVG, not files: `docs/12` rule 6 forbids copying Mantis Pro assets, and these are cards whose whole job is to be a coloured surface, so artwork that can arrive late is not an option. Three motifs — waves, nodes, grid — one path family in `currentColor`, `aria-hidden`.
- The motif is masked clear of the middle third. Not styling: every contrast figure above is measured against the flat fill, and those numbers are only true of the rendered card if nothing is drawn between the fill and the text. Dark-inked motifs also draw at 0.13 against 0.24, because dark marks read heavier at equal alpha.
- Reworked `/widget/statistics` into a rack: one specimen per component, each row labelled with the component that draws it, in Mantis's own order, with the decision table kept at the end.
- **Repeat defect worth naming.** For the second session running, a string patch into JSX slid because prettier had already rewrapped the lines, so `strong` was declared on the component and present in the data but never passed — no lint error, no runtime error, just the wrong colour. Caught only because the page was measured after rendering. Rewrite the file when a change touches more than a couple of lines.
- Added 21 matching Vietnamese and English messages and advanced the catalog badge to v2.12.

## 2.11.0 — 2026-08-29

- Reconstructed Mantis's `Widget > Statistics` as `/widget/statistics`, preview-only, under a new Widget section in the design group. The original is not a dashboard, it is a rack — eight ways to draw one number with no statement about when to use which — so this is a catalogue with an argument instead: five shapes, each answering a question the other four cannot, and a decision table as the last card on the page.
- Added `HeroStatCard`, `PeriodStatCard` and `StatusStatCard` as experimental, and gave `StatCard` an `icon` prop rather than making a sixth component. Mantis's eight variants collapse to five because four of them differ only in background colour — that is one shape, not four.
- Exactly one hero figure per page. Mantis puts nineteen display figures on this screen; a page where everything is emphasised has nothing emphasised. `HeroStatCard` renders its value as `component="p"`, because `variant="h1"` maps to an `<h1>` element — the defect the maintenance screens shipped in v2.10.0.
- Only `StatusStatCard` is allowed colour, because it is the only card whose colour carries information. Mantis fills ten cards in ten hues that encode nothing, and spending colour on decoration is exactly what stops a reader noticing the one card that went red.
- **Measured, not asserted.** Running the palette validator on the theme's status set put success `#52c41a` and warning `#faad14` at **ΔE 0.3 under simulated protanopia** — the same colour to a red-green colourblind reader — so every state ships an icon and a word. The first build of the card then filled with `{tone}.main` and took the theme's `contrastText`; measured off the rendered page, white on warning was **1.74:1** and on success **2.27:1**. It now uses a light tint with a 3px accent edge, re-measured at **11.53:1 worst case** across both colour schemes.
- Fixed a defect the render caught: `StatusStatCard` guarded its chip on `status` while the page passed `statusLabel`, so the cards drew colour and no label — the exact failure the component exists to prevent, inside the component that forbids it.
- `StatCard`'s `featured` prop is superseded by `HeroStatCard` and is used by no product page. It keeps working; new work should not use it, and it is scheduled for removal in 3.0.0 per docs/10.
- Added 60 matching Vietnamese and English messages and advanced the catalog badge to v2.11.

## 2.10.0 — 2026-08-29

- Built `NavCollapse`, the nested navigation level the free Mantis template leaves as "collapse - only available in paid version". It opens itself when one of its children is the current route, still lets the reader close it, rotates its chevron, animates with `timeout="auto"`, and keeps a closed section's links out of the tab order with `unmountOnExit` — verified by render: a closed section contributes zero links.
- In the mini drawer the collapse header opens the drawer and expands together, rather than floating a popper out of the rail. A popper anchored to a 36px icon needs its own focus trap and dismissal rules, and getting those subtly wrong is worse than one extra frame of drawer animation.
- Added a preview-only **Pages** group holding three collapse sections: Thiết kế (App phone, Design System), Xác thực (7 screens) and Bảo trì (4 screens). These are the screens the application never links to from inside itself, so the only way to review them is a list that admits they are a set. Folding the design surfaces in is also what gives the collapse a section whose children render inside the shell, so open-on-active-child has somewhere to actually happen.
- Reconstructed Mantis's four Maintenance screens, and wired three of them to something real. `notFound` is now the router's catch-all, replacing a silent redirect to the dashboard that told anyone who mistyped a URL that nothing had gone wrong. `serverError` is the router's `errorElement` and the fallback of a new `ErrorBoundary`, so a thrown component or a stale lazy chunk after a deploy lands somewhere deliberate instead of on a white page. `underMaintenance` is what `SessionGate` shows when the session endpoint answers 503 — nginx returns that on its own when PHP-FPM is down, and "check your connection" is the wrong advice for someone whose connection is fine.
- The 404 renders outside `DashboardLayout`. Keeping the shell would let a reader click where they meant to go, but an error page wearing the full application chrome reads as "this page exists and is empty"; one clear way back wins.
- The 500 offers reload rather than a link home: if the fault is a stale bundle, a route change inside the same broken bundle changes nothing. `underMaintenance` offers only retry, because home is down too.
- Dropped the countdown and the notify-me capture from Coming Soon. There is no launch date, and a clock counting down to an invented one is the same class of thing as an invoice showing invented money; there is no endpoint behind the capture either, and taking an address that goes nowhere is worse than not asking.
- No illustrations. Mantis renders 3D artwork on all four; these are the pages a reader sees when something is already wrong, and an image request that has not answered is a second thing wrong.
- Renamed `AuthLayout` to **`StandaloneLayout`** and `AuthResultCard` to **`ResultCard`**, both moved to `components/patterns/`. Both were experimental, so docs/10 allows it. A 404 and a sign-in have nothing in common except this frame — no drawer, no header, no session, and they must still look like one product — and naming it after the first family to need it would leave the next one importing something called "auth".
- `ResultCard` gained `mark`, a display numeral for pages whose subject is a status code.
- Fixed a defect the render sweep caught: the 404/500 numeral used `variant="h1"`, which MUI maps to an `<h1>` **element**, so every maintenance page had two top-level headings and its accessible name was "404". The numeral is a `div` now; one `h1` per page, rechecked across five routes.
- Added 18 matching Vietnamese and English messages and advanced the catalog badge to v2.10.

## 2.9.0 — 2026-08-29

- Reconstructed the rest of Mantis's Authentication group: activate, forgot password, check mail, reset password, verify email and code verification, all on the `AuthLayout` from 2.8.0.
- **Register became Activate account.** An Identity is created by an operator who then assigns it an Extension — the whole model in `PHASE_2_CUSTOMER_ASSIGNMENT` — and `PHASE_2_IDENTITY_IMPLEMENTATION.md` lists self-service registration under "Deliberately not enabled yet". Somebody who signed themselves up would land in a portal with no phone and no customer, so the screen at that address is the second half of the operator's action: an invited person arrives from an emailed link and sets their first password. The address is shown and cannot be edited; no name, company or terms checkbox is collected.
- **Code Verification split in two.** Bước 3 of the identity plan uses an HTTPS callback link, not a one-time code, so `/auth/verify-email` — the page that link opens — is the screen the plan actually calls for, with pending, verified and expired states. `/auth/code` keeps Mantis's code entry as the alternative, at six digits rather than Mantis's four.
- Added `PasswordField`, `PasswordStrengthMeter`, `PasswordRules`, `CodeInput`, `AuthResultCard`, `SetPasswordForm`, `ForgotPasswordForm` and `CodeVerificationForm` as experimental. `LoginForm` was refactored onto `PasswordField` rather than keeping its own reveal toggle.
- Wired up `utils/password-strength.js` and `utils/password-validation.js`, which arrived with the Mantis template and had never been called by anything. `sections/auth/passwordStrength.js` wraps the first because it returns its own English label straight out of the scoring function — a Vietnamese reader would be told their password is "Weak" — and because its trailing band is unreachable.
- The forgot-password screen has no failure path, by design. Bước 3 requires that a recovery response not reveal whether an email exists, so submitting always lands on the same confirmation and the confirmation is worded conditionally: "if this address belongs to an Mphone account". An error state there would be an account-enumeration oracle with a friendly tone.
- Moved the spam-folder hint off the form and onto the screen after it. Mantis puts it under the email field, before anything has been sent; nobody can check a spam folder for a message that does not exist yet.
- `maskEmail` keeps the first character of the mailbox and the whole domain. Mantis masks the other way round — "jone. ****@company.com" reveals the person and hides the only part that distinguishes two accounts at one company.
- The reset screen has an expired-link state. Mantis's is only ever the form, and Bước 3 makes these tokens single-use and short-lived, so a dead link is not an edge case — it is what the second opening of an old email always shows.
- Password rules are a list, not just a bar. A strength meter says "Poor" without saying what would fix it; the list is the half that can be acted on, so it is the half the form validates against, with met and unmet as two icons rather than two colours of one.
- Every set-password screen carries the SIP note. A customer password and an extension's SIP password are different secrets here, and Bước 3 states that changing one must not change the other — someone resetting because a desk phone stopped registering needs to know this is not the fix.
- Resend buttons show their countdown. Bước 3 asks for rate limits on verify, resend and recovery; a limit the reader cannot see is a button that works until it suddenly does not. The browser's number is the interface's promise, not the enforcement.
- Routes moved to `/auth/:screen`, still registered only when `VITE_PORTAL_PREVIEW` is set, with a preview-only "Xác thực" navigation group. `AuthPreviewBanner` switches each screen's state, because the states worth reviewing — an expired link, a verification in flight — cannot be reached by clicking, and they are the ones nobody remembers to design. Forgot password → check mail is wired for real so the hand-off can be walked.
- Documented the identity contract each screen is written against, action by action, in `docs/07-component-catalog.md`.
- Added 71 matching Vietnamese and English messages and advanced the catalog badge to v2.9.

## 2.8.0 — 2026-08-29

- Stat cards no longer paint their own dark surface. `SparkStatCard` sat on `grey[50]` (#141414) so a compact KPI would read as a layer below the content cards under it; on the page it read as two kinds of card rather than one row of smaller ones. It takes `background.paper` like every other card now. Affects `/dashboard`, `/dashboard/analytics` and `/billing`, and reverses the "#141414 compact KPI states" line in Unreleased.
- Rebuilt the sign-in screen on the Mantis `auth/login` composition. Unlike every screen reconstructed before it, this one already had a working endpoint: `SessionGate` was rendering an undesigned form over a live `identity.php`. It is the portal's real sign-in, not a mockup.
- Added `AuthLayout` and `LoginForm` as experimental. `pages/auth/Login.jsx` holds no state and calls no endpoint; the gate owns the attempt, which is what lets the same screen be reviewed in a preview build with no way to sign anyone in.
- Dropped three Mantis controls, all for one reason — `identity.php` answers exactly `login` and `logout`. No registration link: an extension is issued by whoever runs the PBX. No "Forgot Password?" link: there is no reset endpoint, so the line under the fields names who can actually reset it; a dead link on the one screen where the reader is already stuck is worse than no link. No "Keep me sign in": session lifetime is the PHP session's, and a checkbox that silently does nothing is a promise about someone's security.
- Kept the password reveal toggle. It needs no server, and this password is typed on a phone keyboard often enough that "wrong password" is usually a typo the reader cannot see.
- Added `sections/auth/loginErrors.js` and fixed two errors the gate was hiding. `invalid_csrf` — a token that aged out in an open tab — was reported as a wrong password, so a correct password could be retyped forever; the gate now refreshes the session on that code, making "try again" advice that works. `invalid_identity_mapping` — correct credentials on an account not linked to a PBX user — was also reported as a wrong password, sending the reader back to a field that cannot fix it.
- The auth backdrop is CSS gradients, not artwork. This is the first screen the portal paints and it is painted before the session exists; an image request that has not answered leaves the one screen a locked-out user is looking at visibly unfinished. Light and dark carry their own alphas — the pair tuned for #121212 washes out on #fafafb.
- Added `/auth/login`, registered only when `VITE_PORTAL_PREVIEW` is set, as a sibling of the application rather than one of its children so it renders without the drawer, header and footer. A production build has no route to a sign-in form that signs nobody in. Submitting in preview shows the failed state, because the success path navigates away and the error path is the half worth reviewing.
- Added 9 matching Vietnamese and English messages and advanced the catalog badge to v2.8.

## 2.7.0 — 2026-08-29

- Reconstructed the Mantis Pro Invoice dashboard as `/billing`, from the receiving side: a tenant gets invoices, it does not issue them, and the whole page is read back in that direction.
- Added `BilledTrendCard`, `InvoiceFilterGrid`, `InvoiceListCard` and `CostBreakdownCard` as experimental. The stat row reuses `SparkStatCard` with no `data` (title, value and caption, no sparkline) and the activity column reuses `ActivityListCard` — neither needed a new component.
- Currency is one page-level choice. Mantis prices its stat tiles in £ and its invoice list in $ on the same screen; here every figure follows one selector, so no total is ever a sum of two currencies. Switching currency resets the status filter, because a filter carried across accounts can leave the reader on an empty list with no visible cause.
- The numbers reconcile. The twelve bars sum to the Total tile, paid + pending + overdue sum to it as well, and the four breakdown lines sum to the current period's invoice. Mantis shows £5678.09 on all four of its tiles and a chart unrelated to any of them.
- Only the total carries a delta. A "-4.7%" over five overdue invoices is a statistic computed to fill a slot; the other three tiles carry their invoice count instead.
- No `draft` status: a draft invoice is the issuer's private state and a tenant never sees one. The filter grid also drops Mantis's "Reports" tile — it is a sidebar destination, and a navigating tile inside a filter group teaches the wrong thing about what a click does.
- Every filter tile carries its count, so "Overdue" answers itself before the click.
- No View All, no Pay, no Download PDF, and invoice rows are `ListItem` rather than `ListItemButton`. There is no invoice detail route and no endpoint behind any of those. The card footer states how many rows are held back instead.
- Bars, not the line Mantis draws: twelve monthly invoices are twelve separate events, and a line invites reading a value off the slope between two months that never existed.
- The trend chart is one colour. The draft painted unpaid periods in a second hue; it was the fourth card on the page to say which invoices are unpaid — the others say it in text — and the hue it spent was the amber the breakdown ring beside it needs for outbound usage. Two charts on one screen using one colour for two meanings is what `utils/chartSeries.js` exists to prevent. Caught by rendering, not by reading.
- Added a donut rule that reconciles this card with v2.6's pie-to-bar change: a ring is allowed only at five parts or fewer, when the parts provably sum to a stated total, and when the question is share-of-whole rather than rank. Call outcomes met none of the three; a bill meets all three. Every amount and share is still written out in the legend, so no comparison depends on judging an angle.
- Added `utils/invoiceStatus.js` (four tenant-facing statuses, their colour and icon, and the single `isBilled()` that keeps cancelled amounts out of every total) and `costColors()` in `utils/chartSeries.js`, which borrows four already-checked marks rather than introducing a second ramp.
- Added `chart.monthShort`: Vietnamese's `Intl` short month is "Tháng 9" and twelve of those fit no axis at any width, so each language gets its own axis convention — "T9" against "Sep".
- The activity rows put the invoice reference on the secondary line with the timestamp. At 390px the reference sat on the primary line and broke mid-token against the amount.
- Added a standing sample-data notice on the page. It comes off with `sections/billing/billingSample.js` and not before: showing a tenant a number that looks like money and is not is the worst failure this page could ship.
- Added 48 matching Vietnamese and English messages and advanced the catalog badge to v2.7.

## 2.6.0 — 2026-08-28

- Rebuilt `/dashboard` on the Mantis Default composition: a four-card stat row, then 8/4 pairs pairing the period's chart with the figure that judges it. It runs on the real `dashboard.php` payload and the live websocket — no placeholder data on this page.
- Added `AnswerRateCard` and `CallOutcomeCard` as experimental.
- Call outcomes are bars on a common baseline, replacing the pie this page carried. Seven outcomes is past what a pie can be read at, and the question is a length comparison — the one thing a pie is worst at.
- The answered bar is split out of that chart and stated as text. At a healthy answer rate it is ten times the next bar and flattens every failure mode into the axis.
- Section titles stay inside their MainCards. Mantis Default hangs them above the card; every other page in this portal titles inside the card, and one page spelling the same idea differently costs more than the extra air buys.
- Fixed the call volume chart drawing below zero: the auto domain padded past the axis and rendered a y-axis reading -10 on a quiet period. A call count now floors at zero.
- The "live right now" card holds only genuinely live rows. Talk time and unconnected calls are period figures and had been placed there, which made the card lie about what it showed.
- The quality card no longer repeats the answer rate printed in the card directly above it; it carries missed, unconnected and average talk instead, over a missed-per-hour trend with real hour labels.
- `RecentCallsTable` takes `thirdColumnLabelId`: the same column is the extension on Analytics and the dialled destination on the dashboard.
- The preview server now stubs `dashboard.php`, so the default dashboard can be reviewed without a PBX.
- Added 9 matching Vietnamese and English messages and advanced the catalog badge to v2.6.

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
