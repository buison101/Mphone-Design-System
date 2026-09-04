// ==============================|| FROSTED SURFACE ||============================== //

/**
 * Translucent surface over a blurred backdrop, shared by the header and the
 * sidebar so the two never drift apart.
 *
 * Both modes tint with `grey.A100`, so no `theme.applyStyles('dark', …)` split
 * is needed: the palette declares the token per colour scheme and MUI emits one
 * CSS variable that already resolves differently in light and dark. Under
 * Mphone 1 and 2 that is `#FCFCFD` / `#1C1C1E`, which is also what their
 * `background.paper` resolves to.
 *
 * Careful with `A100` on the vendor presets: their `grey.A*` ascent scale is
 * declared once outside `buildGrey` in `themes/palette.js` and is therefore
 * mode-independent, so `A100` stays `#fafafa` in dark - near white. Only the
 * Mphone presets give it a real dark value. Switch to `background.paper` if this
 * ever has to hold up under Default or Theme 1-8.
 *
 * Browsers without `backdrop-filter` fall back to the opaque tint: the
 * translucency on its own would let the content underneath read through.
 */

export const FROSTED_FILTER = 'blur(12px) saturate(180%)';
export const FROSTED_SURFACE_OPACITY = 90;

const tint = (color) => `color-mix(in srgb, ${color} ${FROSTED_SURFACE_OPACITY}%, transparent)`;

export default function frostedSurface(theme) {
  const surface = theme.vars.palette.grey.A100;

  return {
    backgroundColor: tint(surface),
    backdropFilter: FROSTED_FILTER,
    WebkitBackdropFilter: FROSTED_FILTER,
    '@supports not (backdrop-filter: blur(1px))': {
      backgroundColor: surface
    }
  };
}
