# Mphone Design Workspace

## Overview

This workspace contains the Mphone design system and local Portal interface projects.

## Main areas

- `portal-worktree/app/portal/mpo-design`: current React and Vite Portal UI.
- `portal-worktree/app/portal/spa`: earlier Portal implementation available for reference.
- `tokens`: design-token sources.
- `css`: generated and shared CSS assets.
- `registry`: component metadata.
- `contracts`: shared interface contracts.
- `scripts`: design-system build and validation scripts.
- `docs`: space for new project documentation.

## Local development

The current Portal preview runs from `portal-worktree/app/portal/mpo-design`:

```sh
npm run start
```

Useful checks:

```sh
npm run prettier:check
npm run lint
npm run i18n:check
npm run build
```

The root design-system checks run with:

```sh
npm run release:check
```

## Card borders

- Cards placed directly on the page background use the existing `border={false}` prop.
- Keep borders and dividers that separate content inside tables, lists, inputs, buttons, nested cards and similar components.

## Browser and screenshot permission

- Do not open, navigate, inspect, or control a web browser unless the user explicitly permits browser use in the current request.
- Do not capture browser or application screenshots unless the user explicitly permits screenshots in the current request.
- Local UI verification must use non-browser checks by default. Ask for permission before any browser-based visual verification.
