# Mphone Portal MTO

MTO is the local Mphone Portal migration target based on the licensed Mantis 4.2.0 Vite JavaScript full version.

## Local workflow

```text
npm install --ignore-scripts
npm run start
npm run lint
npm run build
npm run preview
```

- Development and preview port: `4322`
- Local URL: `http://127.0.0.1:4322/`
- Legacy Portal comparison URL: `http://localhost:4321/`

## Stage 1 boundaries

- All original Mantis pages and routes remain available.
- Authentication uses `LocalAuthContext`; it does not contact an identity provider.
- API calls use the local Axios adapter in `src/utils/axios.js` and fixtures in `src/data/local-api.js`.
- Analytics, APM, telemetry, vendor environment files, embedded credentials, and remote reCAPTCHA are disabled.
- The map catalogue keeps all demonstration sections. Three of its styles are local JSON, but
  they still name remote tile and sprite sources, and three maps load their style from the
  network outright, so the map pages do reach third parties. Tracked in
  `docs/16-mto-string-inventory.md`; not yet fixed.
- Do not connect this application to FusionPBX, SIP/PBX, production databases, Android, or external authentication services during the UI Lab stage.

## Stage 2 — bilingual content

The application is Vietnamese-first and ships two complete languages, `vi` and `en`. Every
user-visible string goes through `react-intl` with a namespaced id; the catalogs are
`src/utils/locales/{vi,en}.json`.

```text
npm run i18n:inventory     # candidate user-visible strings per area
npm run i18n:check         # catalog parity + every referenced id exists
VITE_I18N_STRICT=1 npm run build   # a missing message logs to the console
```

Wave 1 (shell, authentication, maintenance, dashboards, route errors) is done. The remaining
waves and every decision behind them are in `docs/16-mto-string-inventory.md`.

Rules that hold for all of stage 2:

- No hardcoded Vietnamese or English in a component.
- A key lands in both catalogs in the same change; neither language is a draft.
- New copy is Mphone's, not Mantis's — no vendor brands, sample companies or commercial data.
