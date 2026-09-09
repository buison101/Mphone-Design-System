# Repository Guidelines

## Project Context

This repository is an active development copy of a FusionPBX PHP application. It is running on a Debian 12 virtual machine inside VirtualBox, so treat local paths, services, permissions, and web-server behavior as development-environment details unless the user says otherwise. Prefer small, reversible changes and verify them locally with targeted commands before reporting completion.

The complete product also includes the Mphone Android application, maintained in a separate repository mounted from the VirtualBox host at `/mnt/linphone`. Treat the FusionPBX repository and that Android repository as two parts of the same product when a feature spans the PBX, Supabase, push notifications, or the mobile UI. Follow the Android repository's own `AGENTS.md` before changing files there.

The decoded SoftphonePro reference source is available at `/var/www/fusionpbx/uiux-demo/softphonepro-decode`. Consult it when web or Mphone application work needs to understand or compare softphone behavior, call flows, UI interactions, or implementation details. Treat it as reference material unless the user explicitly asks to modify it.

The corresponding decoded SoftphonePro web reference is located at `/var/www/fusionpbx/uiux-demo/mteam-analysis`. Consult this directory for web behavior and UI/UX comparisons when working on the FusionPBX web application or features shared with Mphone. Treat it as reference material unless the user explicitly asks to modify it.

The Android repository is mounted at `/mnt/linphone`. Before Android work, verify it with `findmnt /mnt/linphone` and confirm the directory is not empty. Do not mistake an empty, unmounted directory for an empty Android repository.

Assume this is not a clean production checkout. There may be local experiments, deployment-specific files, or unfinished work in progress. Do not overwrite, normalize, or revert unrelated changes.

## Mphone UI development and promotion flow

The Mphone UI source of record is the Windows design workspace mounted at `/mnt/design-system`, specifically `portal-worktree/app/portal/mpo-design`. Develop and edit Mphone UI there; do not treat generated Debian releases as editable source. To preview a candidate, run `mphone-ui-stage`: it copies the required source from the mount to local Debian storage, builds there, and atomically publishes the result at `/p-next/`. Review and approve the candidate on `/p-next/` before promoting it to the customer portal at `/p/`. Never overwrite or promote to `/p/` without the user's explicit approval; `/p/` remains the currently approved release until then.

## Strict No-Touch Files

Do not read, edit, format, regenerate, move, delete, or otherwise modify `themes/mybrand/custom.css`. That file is not intended for AI changes. If a task appears to require changes to that file, stop and ask the user for explicit direction instead.

## Project Structure & Module Organization

This repository is a FusionPBX PHP application. Feature modules live in `app/<module>/` and usually include `app_config.php`, `app_languages.php`, `app_menu.php`, and one or more page/controller PHP files. Core platform modules are under `core/`, including authentication, users, groups, domains, menus, installs, and upgrades. Shared classes, functions, vendor libraries, JavaScript, templates, and install resources are in `resources/`. Theme and branding work belongs in `themes/default/` or project-specific themes such as `themes/mybrand/`. The `secure/` directory is reserved for protected runtime/configuration material.

## Build, Test, and Development Commands

There is no root build system in this tree. Use targeted checks before committing:

```sh
php -l path/to/file.php
find app core resources themes -name '*.php' -print0 | xargs -0 -n1 php -l
lua app/switch/resources/scripts/resources/tests/self_test.lua
```

`php -l` catches syntax errors in changed PHP files. The `find` command runs a broader syntax sweep. The Lua command runs the available FreeSWITCH script self-test when script resources are changed. Run the app through the configured web server and verify login/module pages after UI or permission changes.

## Coding Style & Naming Conventions

Match the surrounding FusionPBX style. Use tabs for PHP indentation, keep opening `<?php` tags and license headers consistent with nearby files, and prefer existing helper functions/classes from `resources/` over new utility patterns. Name modules and files with lowercase snake case, for example `app/device_logs/device_logs.php`. Keep module metadata files named exactly as expected: `app_config.php`, `app_defaults.php`, `app_languages.php`, and `app_menu.php`.

## Testing Guidelines

This repository has limited automated tests, so contributors are responsible for focused manual verification. Test the exact module changed, its permissions/menu visibility, database reads or writes, and any FreeSWITCH-facing behavior. For language or UI changes, check the relevant pages in the browser and confirm text renders without layout regressions.

## Menu and Translation Safety

The default FusionPBX menu in this development database contains locally customized Vietnamese titles. Treat the existing rows in `v_menu_items` and `v_menu_languages` as user data that must be preserved.

Do not run `php core/upgrade/upgrade.php --menu default` merely to install, register, or expose a new module. That command is a destructive reset: it deletes unprotected menu rows and rebuilds all menu translations from `app_menu.php`. Applications without a `vi-vn` title then fall back to English, which overwrites the customized Vietnamese sidebar and creates a mixed-language menu.

When adding or updating a module menu:

- Declare an explicit `title['vi-vn']` in its `app_menu.php`.
- Add or synchronize only that module's missing menu item, translations, and group mappings. Do not reset the complete default menu.
- Preserve every existing translation in `v_menu_languages`; only insert a translation when the corresponding language row is missing, unless the user explicitly requests a rename.
- Preserve existing menu titles, hierarchy, order, icons, and group mappings outside the module being changed.
- Before any operation that can delete or rebuild menu rows, make a recoverable backup of `v_menus`, `v_menu_items`, `v_menu_languages`, and `v_menu_item_groups`, and verify the backup contains those tables.
- Treat instructions in an application README that suggest `--menu default` as unsafe for this customized installation. Follow this repository-level rule instead.

Only run `--menu default` when the user explicitly asks to reset the entire menu to source defaults and acknowledges that local translations and menu customizations will be replaced. After any authorized menu mutation, compare Vietnamese titles before and after and verify the affected module directly.

## Commit & Pull Request Guidelines

Recent commits use short, direct summaries, often in Vietnamese, such as `Chinh lai sidebar 8`. Keep commits concise and scoped to one logical change. Pull requests should describe the affected module, summarize manual or command-line checks performed, link any issue or ticket, and include screenshots for visible UI/theme changes.

## Security & Configuration Tips

Do not commit secrets, local database credentials, generated call recordings, or environment-specific runtime files. Treat files under `secure/` and deployment config as sensitive. Validate user input with existing FusionPBX patterns and preserve permission checks when editing module pages.
