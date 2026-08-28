# Contribution workflow

## Entry criteria

A proposal must name the user problem, affected products, owner, real product flow, accessibility behavior, localization impact, and why an existing component cannot solve it.

## Lifecycle

1. **Proposal** — complete `contracts/page.schema.json` for a page or describe the component API and states.
2. **Experimental** — prove the change in one real flow; breaking changes are allowed and the catalog must label it experimental.
3. **Stable** — prove reuse or clear cross-product value, document every meaningful state, add VI/EN content, and pass the release checks.
4. **Deprecated** — name the replacement, migration steps, and removal version. Deprecated APIs remain functional for at least one minor release.
5. **Removed** — major release only, after the documented migration window.

## Required review

- Product owner: user goal and workflow.
- Design-system owner: hierarchy, tokens, reuse, responsive behavior.
- Engineering owner: API, permissions, failure states, migration risk.
- Accessibility reviewer: keyboard, focus, accessible names, contrast and zoom.

## Definition of done

- Uses registered stable components and semantic tokens.
- Includes loading, empty, error, forbidden and offline states where relevant.
- Server remains authoritative for permissions and scope.
- Vietnamese and English catalogues have identical keys.
- `npm run release:check` succeeds at the Design System root.
- Portal lint/build and authenticated quality suite succeed.
- Living catalog, registry, changelog and migration notes agree.
