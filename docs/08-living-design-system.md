# Living Design System v2.0

## Access

The authenticated catalog is deployed at:

`https://192.168.1.201/p/design-system`

It intentionally has no customer-navigation entry. Open the route directly when reviewing or designing product UI.

## Sections

1. **Foundations** — semantic color, production typography and spacing rhythm.
2. **Components** — actions, fields, statuses, feedback, content states and destructive confirmation.
3. **Patterns** — authentication, search/filter, create/edit, permissions, destructive actions and system status.
4. **Templates** — dashboard, list, form and detail compositions.
5. **Governance** — registry, quality gates, versioning and deprecation rules.
6. **AI contract** — required inputs and review checklist for AI-generated pages.

## Source

- Page: `app/portal/spa/src/pages/design-system/DesignSystem.jsx`
- Route: `app/portal/spa/src/routes/MainRoutes.jsx`
- Locales: `app/portal/spa/src/locales/en.json` and `vi.json`

The page imports production components and consumes the active MUI theme. It must never become a separate theme or mock implementation.

## Adding an example

1. Prove the component or pattern in a real product flow.
2. Add all meaningful states, not only the default state.
3. Add Vietnamese and English together.
4. Verify light/dark and the 390px breakpoint.
5. Run Prettier, ESLint and the production build.
6. Update the changelog and catalog documentation.

Gate 6 also requires the root `npm run release:check`, registry updates, and authenticated browser quality checks when a component or golden route changes.

## AI workflow

Before generating a page, provide the user goal, role/permission scope, real data shape and volume, actions, destructive consequences, data states, responsive priority and localization needs. Generated output must use approved semantic tokens and production components, then pass the catalog review checklist before release.
