# Product patterns

## Search and filter

Keep query, filters, result count, and reset action in one toolbar. Preserve state when the user visits a detail and returns.

## Create and edit

Use clear sections, validate near the field, warn before leaving unsaved work, and show the final result. Server validation remains authoritative.

## Permissions

Scope is decided on the server. The interface may hide unavailable actions for clarity but never treats hiding as authorization.

## Destructive actions

Name the object, explain downstream impact, require intentional confirmation, show progress, and provide recovery or an audit reference.

## System and call status

Differentiate live connection state from historical call results. Never infer an answered call from a timestamp alone; use the authoritative normalized call status.

## Loading, empty, error, and offline

- Loading preserves enough layout to prevent jumping.
- Empty explains why no data exists and what can be done next.
- Error includes a recovery action when retry is possible.
- Offline keeps cached/read-only information distinguishable from live data.

