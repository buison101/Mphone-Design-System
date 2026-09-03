# Vendor patch manifest

Every file in `portal-worktree/app/portal/mpo-design` that differs from the pristine Mantis 4.2.0 extract at `.tools/mto-stage-20260902/full-version`, with the reason and how to reapply it after a vendor upgrade.

Updated 2026-09-03, after wave L8.

**The rule this file enforces:** localization does not edit vendor source (`docs/15` §4.7). Strings are bound in `i18n/keymap.json` and substituted at build. A vendor file appears below only when there was no way to make the change a level higher. Before adding a row, ask whether a theme override, a plugin, or a new project-owned file would do instead.

## Modified vendor files

| File | Change | Why | Reapply |
|---|---|---|---|
| `package.json` | Removed the inline GitHub PAT in `install:apm:*`, the `setup:apm:*` scripts, `apm.yml`, `apm.lock.yaml`, `scripts/telemetry.js`, `.env.qa` and the stage scripts. Removed `yarn.lock` / `.yarnrc.yml`. Pinned the port to 4323. Added the four `i18n:*` commands. Scoped `prettier` and `lint:fix` to project-owned paths. | Vendor security, and write-commands must never rewrite vendor files | Redo on the new `package.json`; never merge the vendor's version wholesale |
| `vite.config.mjs` | Two lines: import `scripts/i18n/vite-plugin-i18n.mjs` and put `i18nSubstitute()` first in `plugins` | Entry point for build-time substitution | Re-add the two lines |
| `.env`, `.env.example` | Seventeen of twenty `VITE_` keys blanked; only version, base name and API URL carry values | Vendor shipped live keys for Maps, Firebase, Cognito, Auth0, Supabase, Clarity, Notify, Analytics | Blank them again; never restore |
| `src/App.jsx` | `<Metrics />` unmounted; files kept under `src/metrics/` | No telemetry in the UI Lab | Remove the import and the element |
| `src/contexts/JWTContext.jsx` | Live JWT initialisation replaced by a local preview session. Its display text is written in Vietnamese directly, not bound in the keymap | Authenticated pages must render with no account, token or API. The object feeds `useReducer`'s initial state, evaluated once per mount, so a keymap binding would freeze the first locale loaded — and this text is the project's own, not vendor demonstration content | Reapply the preview-session initialiser |
| `src/utils/axios.js` | Response/error interceptor routed through `src/utils/offline-cache.js` | Caches successful GETs, and guards a vendor bug where the error interceptor reads `error.response.status` unguarded and throws on any network failure | Reapply the interceptor hook |
| `src/pages/dashboard/analytics.jsx` | One import path changed to `TopPagesCard` | Consequence of the rename below | Follow the rename |
| `src/components/Locales.jsx` | Catalog layering — project `en`, vendor `en`, vendor locale, project locale — with the catalogs imported **statically**, and `setRuntimeIntl` plus date-fns `setDefaultOptions` called during render. `IntlProvider` is keyed on the locale | The localization entry point; the base `en` layer is what stops `fr`/`ro`/`zh` leaking raw message ids on project keys (`docs/15` §4.1). The catalogs were dynamic imports resolved in an effect, which committed one frame where the locale had flipped but the catalog, the runtime singleton and date-fns had not — the interface visibly mixed the two languages. Static imports make the switch one synchronous render. The `key` forces a remount, which is the only way to clear translated strings that components copied into state | Reapply on the new file; the vendor version is a plain `IntlProvider` wrapper and is easy to re-patch. Keep the static imports, the render-time calls and the `key` — each one fixes a different half of the mixed-language defect |
| `src/config.js` | `i18n: 'en'` → `'vi'` | Default locale decision, 2026-09-02 | One line |
| `src/layout/Dashboard/Header/HeaderContent/Localization.jsx` | Added Vietnamese and limited the visible language switcher to Vietnamese and English | MPO Design supports these two product locales; showing the unmaintained French, Romanian and Chinese vendor demos creates unsupported choices | Keep only the Vietnamese and English `ListItemButton` blocks |
| `src/layout/Dashboard/Header/HeaderContent/Customization/index.jsx` | Hides the complete Menu Direction accordion | MPO Design is fixed to the default LTR direction, so exposing an RTL/LTR control adds an unsupported choice | Add the `hidden` prop to the Menu Direction accordion |
| `src/layout/Dashboard/Header/HeaderContent/Customization/ThemeLayout.jsx` | Filters `MINI_VERTICAL` from the rendered layout choices | Product-owner customization decision: hide Mini Drawer while preserving the vendor capability underneath | Reapply the `visibleLayouts` filter before rendering |
| `src/themes/theme/index.js` | Registers the project-owned `Mphone 1` preset | Makes the approved Mphone status palette selectable without changing the vendor Default preset | Re-add the import and `mphone1` switch case |
| `src/layout/Dashboard/Header/HeaderContent/Customization/ColorScheme.jsx` | Adds `Mphone 1`; renders only `default`, `mphone1`, `theme1` and `theme4` | Product-owner customization decision: expose the Mphone palette while hiding themes 2, 3, 5, 6, 7 and 8 | Re-add the Mphone option and the `visibleColorOptions` allowlist before rendering |
| `src/pages/landing.jsx` | Adds `Mphone 1` to the landing-page color selector | Keeps the global preset selectable on the landing surface | Re-add the option beside `default` |
| `src/utils/getImageUrl.js` | Resolves `mphone1` landing artwork names to the existing `default` assets | `Mphone 1` is a palette-only variant and should not require duplicate binary artwork | Re-add the one-line filename alias before constructing the URL |
| `src/layout/Dashboard/Header/HeaderContent/Customization/ThemeFont.jsx` | Adds the `System` option using the native system font stack and filters `public-sans` from the rendered choices; the canonical default font remains unchanged | Users can opt into their platform's familiar UI font; Public Sans remains the Portal baseline rather than a user-facing customization choice | Re-add the `system` item and reapply the `visibleFonts` filter before rendering |
| `src/themes/index.jsx` | Three locale-driven additions when the locale is `vi`: merges `viVN` from `@mui/material/locale` into `themes.components`; sets `typography.button.textTransform` to `none`; sets `MuiLocalizationProvider`'s default `adapterLocale` to date-fns `vi` | MUI writes chrome the vendor passes no text for: `Rows per page:`, the autocomplete empty state, rating labels. `capitalize` on buttons is the intended look in English and a spelling error in Vietnamese — measured across all 78 routes, that one line accounted for every wrongly-capitalised Vietnamese label. Fifteen `LocalizationProvider` call sites pass no `adapterLocale`, and the theme default reaches all of them. §2.5 exceptions, approved 2026-09-02. The `viVN` merge has to come **after** `themes.components = componentsOverride(themes)`, which replaces the object wholesale; vendor `defaultProps` win on every key the vendor sets | Re-add the imports, the typography branch, and the merge block — the merge must stay after the `componentsOverride` assignment |
| `src/pages/apps/customer/card.jsx` | Each column carries a stable `key`; sorting compares keys, `renderValue` looks the header back up | Sorting compared the **display text** (`sortBy === 'Customer Name'`), which silently stops matching once that text is translated. Same defect class as keying chart series by their label (L3) | Reapply the `key` field, the `dataSort` comparisons and the `renderValue` lookup |
| `src/components/Locales.jsx` (already listed above) | Also calls date-fns `setDefaultOptions({ locale: vi })` on a locale change | Eleven files call date-fns `format` directly, outside any MUI picker, so `adapterLocale` never reaches them. date-fns has one global default for exactly this, which avoids eleven vendor edits | Re-add the two imports and the effect |
| `src/pages/dashboard/default.jsx` | Removed `sx={{ textTransform: 'capitalize' }}` from the `Need Help?` button | The inline declaration overrides the theme, so it survived the §2.5 fix. It was redundant in English — the label is already title case — so removing it changes nothing there and fixes Vietnamese | Delete the `sx` prop again |
| `src/sections/dashboard/analytics/TransactionHistory.jsx` | Removed `textTransform: 'capitalize'` from the `Need Help?` button's `sx`, keeping the rest of the prop | Same as above | Delete that one key from `sx` |
| `src/pages/apps/calendar.jsx` | Passes `locale` and, in Vietnamese, `dayHeaderFormat={{ weekday: 'narrow' }}` to `FullCalendar` | FullCalendar writes its own day names, button text and empty state, none of it through the keymap, and it formats day names with `Intl` rather than date-fns — so neither the keymap nor the date-fns locale reaches it. `narrow` is what yields `CN`, `T2`, `T3` instead of `Thứ 2`. English keeps the vendor default on both props | Re-add the two imports, the `useConfig` line and the two props |

### Hoist patches — module-scope data arrays

Each of these moves a `const x = [...]` declared at module scope into `const getX = () => [...]`, and updates its callers. The array then rebuilds on every render, which is what makes its display strings substitutable at all: as a module-scope constant it is evaluated once on import and freezes the first locale loaded. `docs/15` §4.7 has the reasoning; this is the standard remedy for that whole class.

| File | Array | Callers updated | Why it mattered |
|---|---|---|---|
| `.../HeaderContent/data/search-data.jsx` | `searchData` → `getSearchData` | `HeaderContent/Search.jsx` | 38 navigation labels, a hardcoded English duplicate of the sidebar. Without this, header search matched English only while the sidebar showed Vietnamese |
| `.../HeaderContent/data/workspace-data.js` | `workspaceData` → `getWorkspaceData` | `HeaderContent/Workspace.jsx` | Sample company names and plan badges |
| `.../HeaderContent/Notification/data.jsx` | `notificationFilterOptions`, `notificationData` → getters | `Notification/index.jsx`, `Notification/NotificationContent.jsx` | Filter labels and 19 positions of sample notification content |
| `.../HeaderContent/Customization/ThemeLayout.jsx` | `layouts` → `getLayouts` | same file | `Default`, `Horizontal`, `Mini Drawer` in the settings drawer |
| `.../HeaderContent/Customization/ThemeMenuDirection.jsx` | `layouts` → `getLayouts` | same file | `LTR`, `RTL` |
| `.../HeaderContent/Chat/index.jsx` | `userFilterOptions` → `getUserFilterOptions` | same file | Chat filter tabs |
| `src/components/pages/MegaMenuContent.jsx` | `menuSections` → `getMenuSections` | same file | Authentication and maintenance page links in the mega menu |
| `src/sections/dashboard/default/OrdersTable.jsx` | `headCells` → `getHeadCells` | same file | Order table column headers |
| `src/sections/dashboard/analytics/OrdersList.jsx` | `headCells` → `getHeadCells` | same file | Order list column headers |
| `src/sections/dashboard/default/SaleReportCard.jsx` | `status` → `getStatus` | same file | Chart filter options |
| `src/sections/dashboard/analytics/SaleReportCard.jsx` | `status` → `getStatus` | same file | Chart filter options |
| `src/sections/apps/calendar/Toolbar.jsx` | `viewOptions` → `getViewOptions` | same file | Calendar view switcher labels |
| `src/sections/apps/customer/FormCustomerAdd.jsx` | `skills`, `allStatus` → getters | same file | Skill and status option labels |
| `src/sections/apps/customer/ExpandingUserDetail.jsx` | `allStatus` → `getAllStatus` | same file | Status option labels |
| `src/sections/apps/invoice/InvoiceCard.jsx` | `invoiceItems` → `getInvoiceItems` | same file | Invoice summary card labels |
| `src/sections/apps/invoice/InvoiceNotificationList.jsx` | `notifications` → `getNotifications` | same file | Sample notification content |
| `src/sections/apps/invoice/InvoiceChartCard.jsx` | `datasets` → `getDatasets` | same file | Chart series labels |
| `src/sections/apps/e-commerce/checkout/CheckoutTab.jsx` | `tabsOption` → `getTabsOption` | same file | Checkout step labels |
| `src/sections/apps/e-commerce/products/ColorOptions.js` | `ColorsOptions` → `getColorsOptions`, **exported as the function** | `Cart.jsx`, `ProductInfo.jsx`, `Colors.jsx`, `ProductFilterView.jsx` | Colour names. The default export must be the function; exporting `getColorsOptions()` re-freezes the locale |
| `src/sections/apps/e-commerce/checkout/PaymentOptions.js` | `PaymentOptions` → `getPaymentOptions`, **exported as the function** | `Payment.jsx` | Payment method labels; same export caveat |
| `src/sections/apps/e-commerce/products/SortOptions.js` | `SortOptions` → `getSortOptions`, **exported as the function** | `ProductsHeader.jsx` | Sort option labels; same export caveat |

| `src/pages/tables/mui-table/basic.jsx` | `rows`, `header` → getters (**`header` is exported**) | `collapse.jsx`, `custom.jsx`, `datatable.jsx`, `dense.jsx` | Nutrition column labels and sample rows, shared by four other table demos |
| `src/pages/tables/mui-table/datatable.jsx` | `rows`, `headCells` → getters | same file | Column labels and sample rows |
| `src/pages/tables/mui-table/enhanced.jsx` | `rows`, `headCells` → getters | same file | Column labels and sample rows |
| `src/pages/tables/mui-table/fixed-header.jsx` | `columns`, `rows` → getters | same file | Country column labels and 15 sample country rows |
| `src/sections/forms/wizard/basic-wizard/Review.jsx` | `products`, `payments` → getters | same file | Order review line items |
| `src/sections/forms/wizard/validation-wizard/Review.jsx` | `products`, `payments` → getters | same file | Order review line items |
| `src/sections/maps/InteractionMap.jsx` | `interactionList` → `getInteractionList` | same file | Map interaction labels |
| `src/sections/forms/wizard/basic-wizard/index.jsx` | `steps` → `getSteps` | same file | Stepper labels of the multi-step form |
| `src/sections/forms/wizard/validation-wizard/index.jsx` | `steps` → `getSteps` | same file | Stepper labels of the multi-step form |
| `src/sections/forms/validation/AutoCompleteForm.jsx` | `roles` → `getRoles` | same file | Role options. `skills` beside it stays a recorded array exception — technology names |
| `src/sections/charts/apexchart/ApexBarChart.jsx` | `barChartOptions` → `getBarChartOptions` | same file | Country labels on the x axis. `i18n` was added to the `useConfig` destructure and to the effect's dependencies, so the options object is rebuilt on a locale change |
| `src/sections/charts/apexchart/ApexPieChart.jsx` | `pieChartOptions` → `getPieChartOptions` | same file | Satisfaction labels; same `i18n` dependency |
| `src/data/org-chart.js` | `data` → `getData` | `src/pages/charts/org-chart.jsx` | Ten sample names and nine job titles in the organisation chart |
| `src/sections/dashboard/default/OrdersTable.jsx` | `rows` → `getRows` | same file | Product names in the recent-orders table |
| `src/sections/dashboard/analytics/OrdersList.jsx` | `rows` → `getRows` | same file | Product names in the recent-orders list |

| `src/sections/apps/profiles/account/TabRole.jsx` | `rows` → `getRows` | same file | Sample member names in the team table |
| `src/sections/apps/profiles/user/TabPayment.jsx` | `paymentCards` → `getPaymentCards` | same file | Cardholder names |
| `src/sections/landing/{ElementBlock,FeatureBlock,NumberBlock}.jsx` | `appsList`, `features`, `numberItems` → getters | same file | Landing block titles and descriptions |
| `src/sections/landing/Category.jsx` | `categoryMetadata` → `getCategoryMetadata`, **rekeyed by `slug`** | same file | Category descriptions. The lookup used the category's own display name, so translating it dropped every card to the fallback |
| `src/pages/prompts-overview/index.jsx` | `categoryMetadata` → `getCategoryMetadata`, **rekeyed by `slug`** | same file | Same defect, same fix |
| `src/sections/ai/{FeatureBlock,FreeSamplesSection,Hero,Pricing,Workflow}.jsx` | `featureCaseData`, `freeSamplesData`, `promptsItems`, `steps` → getters | same file | Prompt-library copy. `Pricing.jsx` also drops `folderNameToCategory` and matches categories on `slug` instead of on their label |
| `src/sections/widget/data/{ProjectTable,ProductSales,ApplicationSales,ActiveTickets,LatestCustomers,LatestOrder,RecentTickets}.jsx` | `rows` → `getRows` | same file | Sample rows in seven widget tables |
| `src/pages/faqs.jsx` | `faqData` → `getFaqData` | same file | Sixteen questions and their answers |
| `src/pages/pricing.jsx`, `src/pages/extra-pages/pricing.jsx` | `plans`, `planList` → getters | same file | Plan names and feature bullets |
| `src/sections/contact-us/ContactForm.jsx` | `currencies` → `getCurrencies` | same file | Budget options |
| `src/pages/apps/customer/card.jsx` | `allColumns` → `getAllColumns` | same file | Sort-menu column labels (listed above for its `key` fix too) |
| `src/sections/components-overview/Components.jsx` | `categories` → `getCategories`, plus a stable `id` per group and `key={category.id}` | same file | The six Component Catalog group headings. `title` is now translated, so it can no longer serve as the React key — the same display-string-as-lookup-key class that emptied the pricing cards |

Reapply: same edit on the new vendor file. The shape is mechanical, and `i18n:scan --frozen` finds any that were missed.

**Renamed files need a keymap note.** `TopPagesCard.jsx` is `PageViews.jsx` in the vendor tree, so its keymap entries carry `vendorFile: "src/sections/dashboard/analytics/PageViews.jsx"`. Without it, `i18n:diff` reports every string in the file as moved on every run. Any future rename needs the same field.

## Renamed

| From | To | Why |
|---|---|---|
| `src/sections/dashboard/analytics/PageViews.jsx` | `TopPagesCard.jsx` | A tracker/ad blocker in the developer's Chrome refuses dev-server URLs by filename — on `127.0.0.1` too — returning 503 with no body while neither Chrome nor Vite logs anything. Allowing `127.0.0.1` in the blocker is the better fix, after which this rename can be reverted. Production builds are unaffected: the bundler hashes such names away. |

## Project-owned files, added

These are not patches. They live in paths the vendor does not own and survive an upgrade untouched.

| Path | What |
|---|---|
| `i18n/keymap.json` | The keymap contract (`docs/15` §4.7) |
| `scripts/i18n/lib.mjs` | Shared AST helpers: candidate collection, keymap matching, catalog IO |
| `scripts/i18n/vite-plugin-i18n.mjs` | Build-time substitution. Substitutes only keymap positions; never guesses |
| `scripts/i18n/extract.mjs` | `i18n:extract` — proposes candidates for human review |
| `scripts/i18n/diff.mjs` | `i18n:diff` — keymap against a vendor tree: matched / reworded / moved / vanished |
| `scripts/i18n/check.mjs` | `i18n:check` — en/vi parity and the translation-quality rules |
| `scripts/i18n/scan.mjs` | `i18n:scan` — display strings still outside the keymap, and raw ids reaching the interface |
| `src/i18n/runtime.js` | Resolves substituted calls; falls back to the source English so no raw id ever renders |
| `src/locales-mphone/{en,vi}.json` | Project catalogs |
| `i18n/id-files.json` | Paths whose display-looking strings are message ids, not text. The scanner and extractor skip them |
| `i18n/data-files.json` | Paths holding reference or sample data rather than interface text — a country list, a film catalogue, coordinates |
| `i18n/call-arguments.json` | Sample-data factory functions opted in by name, so their string arguments become candidates |
| `i18n/array-exceptions.json` | Bare string arrays reviewed and deliberately not translated, each with a reason |
| `i18n/keep-english.json` | Keys where the approved Vietnamese is the English term, each with a reason |
| `i18n/catalog-exceptions.json` | Component Catalog trees whose non-chrome demo payload is deliberately kept in English (Gate B2, `docs/15` §4.7b). Each tree pins an `expected` position count; `i18n:scan` prints `DRIFT` when the real number moves, so the exception cannot swallow a new gap |
| `src/locales-mphone/date-locale-vi.js` | The project's Vietnamese date vocabulary — `T2`, `Tháng 9`, `SA`/`CH`. Wraps date-fns `vi`, replacing `localize` only and leaving `match` alone so parsing is never narrowed. `docs/19` holds the table and the decisions |
| `src/utils/offline-cache.js` | Offline read cache for the vendor mock API |
| `src/themes/theme/mphone1.js` | `Mphone 1` palette derived from Default's structure with approved Primary, Error, Warning, Info and Success ramps for Light and Dark modes; Grey remains shared with Default |

## How write commands are kept off vendor files

`.prettierignore` was considered and rejected: ignoring `src/` would also blind the linter on our own patched files, and gitignore semantics make re-including a file under an ignored directory unreliable.

What is enforced instead is narrower and actually holds: **the commands that write are scoped, the commands that check are not.**

- `npm run prettier` and `npm run lint:fix` target only project-owned paths and the patched files listed above.
- `npm run lint` and `npm run prettier:check` still cover all of `src`, so vendor problems are still visible — they just cannot be rewritten by accident.

Never run `prettier --write` or `eslint --fix` with a broad `src/**` glob. One such pass reformats the vendor tree and destroys every comparison against it.
