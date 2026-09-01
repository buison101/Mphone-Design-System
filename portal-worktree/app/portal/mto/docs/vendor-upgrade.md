# Mantis vendor upgrade workflow

## Recorded baseline

- Product: Mantis Vite JavaScript full version
- Vendor version: 4.2.0
- Integration baseline commit: `9a00a037dc766fe8788cd3c71ebeb0edc8f0c600`
- Baseline branch: `vendor/mantis-js-4.2.0-sanitized`
- Baseline tag: `vendor-mantis-js-4.2.0-sanitized`
- Source archive: `Mantis_Javascript_4.2.0-ptburz/VITE-4.2.0.zip`
- Source archive SHA-256: `D277136E377B1738691E6D46A0B367376B2ACB10EC7E15B4272884F3CF0AFF28`

The baseline is the first safe MTO integration, not a byte-for-byte copy of the vendor archive. It preserves the complete page and route surface while removing credentials, APM, telemetry, vendor environment files, remote authentication/runtime dependencies, and unintended external requests.

The original licensed archive remains a local reference input and must not be committed or redistributed.

## Why the baseline is separate

The MTO implementation branch descends from the baseline commit. Future vendor releases can therefore be imported on a vendor branch and merged with a real common ancestor. This avoids treating every vendor file as an unrelated add/add conflict.

Do not move the 4.2.0 branch or tag after publishing them. Create a new vendor branch and tag for every release.

## Importing a later vendor release

1. Start a temporary upgrade branch from `vendor/mantis-js-4.2.0-sanitized`, named for the new version, for example `vendor/mantis-js-4.3.0-sanitized`.
2. Extract the new licensed archive into a dedicated staging directory. Never extract it over `mto`, `spa`, or the repository root.
3. Record the archive name, version, and SHA-256 without committing the archive.
4. Compare the staged source with the previous vendor baseline before copying anything.
5. Exclude vendor `.env` files, APM manifests and locks, telemetry code, embedded credentials, purchase data, and scripts that download or execute remote content.
6. Preserve the local authentication adapter, local API adapter, offline fixtures, Vietnamese and English catalogs, Mphone branding, and the no-external-runtime policy while applying upstream changes.
7. Inspect the complete staged diff for secrets, telemetry, external URLs, deleted routes, and dependency regressions.
8. Run formatting, ESLint, localization checks, a local build, and the full sidebar route smoke test.
9. Tag the reviewed vendor branch with the new sanitized version.
10. Merge that branch into the active MTO migration branch. Resolve conflicts in favor of the local safety boundary and bilingual Mphone behavior unless a reviewed upstream change is required.

## Required comparison checks

- Inventory vendor and MTO files by relative path.
- Classify missing files as intentional security/localization exclusions or accidental omissions.
- Compare route definitions and sidebar URLs.
- Compare dependencies and scripts without printing credential values.
- Check the staged tree for token patterns, telemetry imports, vendor environment values, and unintended network hosts.
- Verify Vietnamese and English, light and dark themes, desktop and 390px layouts for affected routes.
- Never connect the upgrade candidate to the vendor mock API, FusionPBX, SIP/PBX, production data, or external authentication providers.

## Current intentional omissions from the 4.2.0 archive

- Vendor metrics and telemetry entry points.
- Vendor environment files and APM configuration.
- French, Romanian, and Chinese navigation-only catalogs; MTO supports complete Vietnamese and English catalogs instead.

These omissions are governed security and product decisions, not missing application pages.
