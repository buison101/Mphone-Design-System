# Release and deprecation policy

## Versioning

The canonical version is `package.json` at the Design System root. `registry/components.json` must match it.

- **Patch** — compatible visual, accessibility or behavioral correction.
- **Minor** — additive token, component, variant, pattern or template.
- **Major** — removed/renamed token, incompatible component API, or required consumer migration.

## Release sequence

1. Freeze the candidate and update `CHANGELOG.md`.
2. Run `npm run release:check` at the Design System root.
3. Run Portal lint, build and the authenticated quality suite.
4. Review changed screenshots; never update baselines without human review.
5. Back up the server and deploy the candidate.
6. Smoke-test all golden routes in production.
7. Update the Living Design System badge and mark the gate complete.

## Deprecation record

Every deprecated item must be marked `deprecated` in the registry and document its reason, replacement, first deprecated version, earliest removal version, migration steps, owner and affected products.

Removal occurs only in a major version. Security or data-isolation defects may bypass the window but require explicit release notes.
