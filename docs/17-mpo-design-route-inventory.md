# MPO Design — Stage 1 route inventory

Updated: 2026-09-02

This document records the clean Mantis 4.2.0 route baseline in `portal-worktree/app/portal/mpo-design`. It is verification evidence for Gate A, not a second implementation plan.

## Inventory rules

- Router definitions are the source of truth; navigation files are checked only for discoverability.
- Dynamic parameters are represented with `:id`, `:filter`, `:category`, and `:item` rather than expanded into sample records.
- Authentication variants remain separate demonstrations even when the local UI Lab session uses JWT-style preview routing.
- A route reached from a tab, button, card, or detail link is considered discoverable even when it is not a top-level drawer item.

## Authenticated application routes

### Dashboards and widgets

- `/dashboard/default`
- `/dashboard/analytics`
- `/dashboard/invoice`
- `/widget/statistics`
- `/widget/data`
- `/widget/chart`

### Applications

- `/apps/chat`
- `/apps/calendar`
- `/apps/kanban/backlogs`
- `/apps/kanban/board`
- `/apps/customer/customer-list`
- `/apps/customer/customer-card`
- `/apps/invoice/dashboard`
- `/apps/invoice/create`
- `/apps/invoice/details/:id`
- `/apps/invoice/edit/:id`
- `/apps/invoice/list`
- `/apps/profiles/account/basic`
- `/apps/profiles/account/personal`
- `/apps/profiles/account/my-account`
- `/apps/profiles/account/password`
- `/apps/profiles/account/role`
- `/apps/profiles/account/settings`
- `/apps/profiles/user/personal`
- `/apps/profiles/user/payment`
- `/apps/profiles/user/password`
- `/apps/profiles/user/settings`
- `/apps/e-commerce/products`
- `/apps/e-commerce/product-details/:id`
- `/apps/e-commerce/product-list`
- `/apps/e-commerce/add-product`
- `/apps/e-commerce/checkout`

### Forms

- `/forms/validation`
- `/forms/wizard`
- `/forms/layout/basic`
- `/forms/layout/multi-column`
- `/forms/layout/action-bar`
- `/forms/layout/sticky-bar`
- `/forms/plugins/mask`
- `/forms/plugins/clipboard`
- `/forms/plugins/re-captcha`
- `/forms/plugins/editor`
- `/forms/plugins/dropzone`

### Tables

- `/tables/react-table/basic`
- `/tables/react-table/dense`
- `/tables/react-table/sorting`
- `/tables/react-table/filtering`
- `/tables/react-table/grouping`
- `/tables/react-table/pagination`
- `/tables/react-table/row-selection`
- `/tables/react-table/expanding`
- `/tables/react-table/editable`
- `/tables/react-table/drag-drop`
- `/tables/react-table/column-visibility`
- `/tables/react-table/column-resizing`
- `/tables/react-table/sticky-table`
- `/tables/react-table/umbrella`
- `/tables/react-table/empty`
- `/tables/react-table/virtualized`
- `/tables/mui-table/basic`
- `/tables/mui-table/dense`
- `/tables/mui-table/enhanced`
- `/tables/mui-table/datatable`
- `/tables/mui-table/custom`
- `/tables/mui-table/fixed-header`
- `/tables/mui-table/collapse`

### Charts, maps, and general pages

- `/charts/apexchart`
- `/charts/org-chart`
- `/map`
- `/sample-page`
- `/pricing`

## Component catalog routes

Base route: `/components-overview`.

Child routes: `autocomplete`, `buttons`, `checkbox`, `radio`, `rating`, `switch`, `select`, `slider`, `textfield`, `avatars`, `badges`, `chips`, `lists`, `tooltip`, `typography`, `alert`, `dialogs`, `progress`, `snackbar`, `breadcrumbs`, `pagination`, `speeddial`, `stepper`, `tabs`, `accordion`, `cards`, `color`, `date-time-picker`, `modal`, `shadows`, `timeline`, and `treeview`.

## Public and maintenance routes

- `/maintenance/404`
- `/maintenance/500`
- `/maintenance/under-construction`
- `/maintenance/coming-soon`
- `/maintenance/join-waitlist`
- `/change-log`
- `/faqs`
- `/ai`
- `/contact-us`

## Authentication demonstrations

The common demonstrations are available below `/auth`: `login`, `register`, `forgot-password`, `reset-password`, `check-mail`, and `code-verification`.

The same six-state demonstration set also exists for the configured provider root and for the explicit provider prefixes `/jwt`, `/firebase`, `/auth0`, `/aws`, and `/supabase`. These routes must remain local simulations during the UI Lab stage.

## Prompt Explorer routes

- `/prompts-overview`
- `/prompts-overview/:filter`
- `/prompts-overview/category/:category/:item`
- `/prompts-overview/:filter/category/:category/:item`

## Discoverability findings

- The primary drawer exposes the principal dashboards, widgets, applications, forms, tables, charts, map, component catalog, public pages, and Prompt Explorer.
- Profile subpages are discoverable through their local account/user tabs rather than separate drawer items.
- Kanban backlog is paired with the board experience but is not a separate primary drawer entry.
- Dynamic invoice and product detail/edit routes use local sample ID `1` in navigation.
- Provider-specific authentication variants are route demonstrations, not separate customer navigation entries.
- Vendor documentation, support, purchase, social, and framework-documentation links are retained as intentional user-initiated external navigation; they are not runtime application dependencies.

## Verification status

- Static router-to-menu inventory: complete.
- Previously verified route groups: dashboards, local-data applications, Maps, reCAPTCHA, Stepper, and Data Widgets.
- Automated route smoke pass: all concrete route patterns listed in this inventory render without the local Error Boundary.
- The completed batches cover advanced React/MUI tables, every Component Catalog child, all form and application subpages, maintenance/public pages, configured-root authentication, all 30 explicit provider/state combinations, and representative dynamic Prompt Explorer routes.
- Dynamic invoice verification: `/apps/invoice/details/1` and `/apps/invoice/edit/1` pass with the local sample invoice.
- Route-level console, external-request, responsive, theme, language, and interaction acceptance remain separate checks; render-smoke completion does not imply those checks have passed.
- High-risk runtime audit passes for landing, AI, local reCAPTCHA, Maps, and Firebase login: same-origin resources only and no console error.
- Full inventory-group audit passes across 160 route visits with no new console error and no cross-origin runtime media/script/style source.
- Representative 390px overflow checks pass for 15 high-density route groups; representative Dark-mode checks pass for eight principal groups.
- Gate A1 populated-data checks pass for Chat, Calendar, Kanban Board/Backlogs, Customer List/Cards, Invoice List, Product Grid/List/Details, related products, and Reviews.
- Gate A1 Chat acceptance includes fifteen direct/group conversations, a thirteen-message primary history, three presence states, read/unread previews, and Sending/Sent/Delivered/Read/Failed message states.
- Product owner manually verified and accepted the Gate B1 product surfaces in Vietnamese/English, light/dark, and desktop/390px on 2026-09-03. Component Catalog remains outside B1 and continues under Gate B2.
