# Foundations

## Color

Use brand color for the primary action and current selection. Status colors describe system meaning and must never be used as decoration. Charts use a separately validated data-visualization palette.

## Typography

Portal uses Public Sans with Vietnamese subsets. Android uses the system sans family for native rendering. Both platforms share role and hierarchy, not necessarily identical metrics.

| Role | Portal | Android |
|---|---:|---:|
| Page title | 30/38, 600 | 22/28sp, 600 |
| Section title | 16/24, 600 | 18/24sp, 600 |
| Body | 14/22, 400 | 15/20sp, 400 |
| Label | 12/20, 500 | 13/18sp, 500 |

All Android text tokens use `sp`; layout and touch dimensions use `dp`.

## Spacing and density

The base unit is 4. Portal uses 8, 12, 16, 20, 24, and 32 most often. Compact data rows may be 40px high; default rows are 48px. Android touch targets are at least 48dp.

## Shape and elevation

Default radius is 8px/dp. Use 4 for compact controls, 12 for prominent mobile sheets, and fully round only for pills or circular controls. Prefer border and surface contrast over heavy shadow.

## Motion

Motion explains state change. Use 120ms for feedback, 180ms for component transitions, and 240ms for page-level panels. Respect reduced-motion preferences.

