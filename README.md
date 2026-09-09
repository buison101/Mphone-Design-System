# Mphone Design Workspace

This repository contains the Mphone design system and local Portal interface projects.

## Structure

- `portal-worktree/app/portal/mpo-design/`: current React, Vite and MUI Portal UI.
- `portal-worktree/app/portal/spa/`: earlier Portal implementation.
- `tokens/`: design-token sources.
- `css/`: generated and shared CSS assets.
- `contracts/`: shared interface contracts.
- `registry/`: component metadata.
- `scripts/`: build and validation scripts.

## Run the Portal

```sh
cd portal-worktree/app/portal/mpo-design
npm install
npm run start
```

Open `http://127.0.0.1:4323/`.

## Checks

Run the Portal checks from `portal-worktree/app/portal/mpo-design`:

```sh
npm run prettier:check
npm run lint
npm run i18n:check
npm run build
```

Run the design-system checks from the repository root:

```sh
npm run release:check
```
