# Automated quality gates

## Static contract

Run `npm run release:check` from the Design System root. This builds versioned CSS/JSON token artifacts and validates token shape, required semantic groups, component sources, registry version, duplicate names, lifecycle states and VI/EN key parity.

## Portal quality suite

The Portal owns 28 browser checks across desktop-dark and 390px mobile-light: 20 route-level accessibility/single-H1/page-overflow checks and 8 screenshot comparisons for Dashboard, Call History, Settings and Living Design System.

The suite requires an authenticated Playwright storage state kept outside source control:

```sh
set PORTAL_STORAGE_STATE=C:\secure\portal-state.json
set PORTAL_BASE_URL=https://192.168.1.201
npm run test:quality
```

Initialize or intentionally update screenshots with `npm run test:visual:update`, inspect every diff, then commit only reviewed baselines. Authentication state and reports are ignored by Git. CI must inject authentication through an encrypted secret and never print it.
