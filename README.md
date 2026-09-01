# Mphone Portal UI Lab

> Project scope and safety rules: see [`AGENTS.md`](AGENTS.md). Current UI Lab release is v2.5.

This repository is the local interface experimentation environment for Mphone. All new product concepts are implemented as navigable Portal prototypes and reviewed at `http://localhost:4321/`. It does not deploy to FusionPBX, modify the native Android application, or connect prototypes to production services.

Current experimental surfaces include Bảng phân tích, Webphone, App Phone, Chat, and the Living Design System alongside the established Portal pages. They use local fixtures, stubbed sessions, and visibly simulated behavior where no backend exists.

## Run the UI Lab

```sh
cd portal-worktree/app/portal/spa
npm install
npm run preview:build
npm run preview:open
```

Open `http://localhost:4321/`. The preview server supplies the local session and sample responses needed to inspect the Portal without FusionPBX or PHP.

## Validate

Run `npm run release:check` from the repository root for the Design System contract. In `portal-worktree/app/portal/spa`, run formatting, lint, build, and the relevant local Playwright checks before handing off UI work.

Gate 6 added the machine-readable component registry, versioned token artifacts, bilingual validation, AI page schema, automated accessibility/visual test definitions, and formal contribution/release/deprecation workflows.

Run `npm run release:check` from this directory before a release. Generated artifacts are written to `dist/`; source tokens remain in `tokens/`.

Mphone Design System is the shared product language exercised through the local Portal UI Lab. External server and native-app repositories are reference-only from this workspace.

The system uses Mantis as the structural reference for enterprise web interfaces, while keeping Mphone's own brand, Vietnamese content, telecom states, and native mobile behavior.

## Principles

1. **Calm** — reduce visual noise and reserve strong color for meaning.
2. **Clear** — make hierarchy, status, and the next action obvious.
3. **Certain** — show what happened, what is affected, and how to recover.
4. **Efficient** — support dense data, keyboard use, filtering, and repeat work.
5. **Human** — use natural Vietnamese and never blame the user.

## Structure

- `tokens/`: platform-neutral source values.
- `css/`: generated-compatible CSS custom properties.
- `docs/`: foundations, components, patterns, templates, and governance.
- `docs/07-component-catalog.md`: catalog triển khai và hợp đồng prompt cho AI.
- `docs/08-living-design-system.md`: route, source and operating workflow for the visual catalog.
- `docs/14-mantis-pro-visual-reference.md`: nguồn tham chiếu Mantis Pro, quy trình duyệt các mục sidebar và baseline dark mode cho AI.
- `portal-worktree/app/portal/spa/`: source of truth for the local Portal UI Lab.

## Platform contract

The semantic token name is the contract. Platforms may use different primitives when required for contrast or native behavior.

```text
Mphone semantic token
├── Portal: MUI theme / CSS variables
└── Android: resources and theme attributes
```

## Version 1 scope

V1 covers the foundations and the reusable structures needed for dashboard, call history, recordings, reports, contacts, settings, account, and the core mobile calling flow. New product-specific patterns are added only after they have been exercised in a real product screen.
