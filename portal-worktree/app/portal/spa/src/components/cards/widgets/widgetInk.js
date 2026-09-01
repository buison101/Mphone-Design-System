// ==============================|| WIDGET CARDS - FILL AND INK ||============================== //
//
// Mantis's statistics widgets are filled with the Ant Design ramp this portal
// already ships, so "keep the colours" needs no hard-coded hex anywhere: blue is
// primary.main (#1677ff), amber warning.main (#faad14), green success.main
// (#52c41a), teal info.main (#13c2c2), red error.main (#ff4d4f).
//
// What is not kept is Mantis's ink. It sets white on all six fills, and on four
// of them that is unreadable. Measured against each light fill (white / black):
//
//   primary #1677ff   3.83 / 5.48   -> white, and primary.dark for small text
//   warning #faad14   1.90 / 11.05  -> black
//   success #52c41a   2.27 /  8.27  -> black
//   info    #13c2c2   2.20 /  8.52  -> black
//   error   #ff4d4f   3.27 /  6.43  -> black
//   dark    #141414  16.48 /  1.09  -> white
//
// **The choice has to be made per colour scheme.** This was shipped in v2.12 as
// a single table naming `grey.800`, and that is a defect: the theme's grey ramp
// is inverted in dark mode, so `grey.800` is #141414 in light and #f0f0f0 in
// dark. Every amber, green and teal card came out with near-white ink on a light
// fill in dark mode - measured 2.22 to 2.61 off the rendered page - and the
// near-black `dark` tile turned into a white tile carrying white text at 1.14.
// Nothing in the code said so; both schemes read the same token.
//
// So the tables below name `common.black` and `common.white`, which do not move,
// and the dark ramp gets its own row. Measured against each dark fill:
//
//   primary #1668dc   5.19 / 2.53   -> white
//   warning #d89614   2.53 / 8.29   -> black
//   success #49aa19   2.98 / 6.05   -> black
//   info    #13a8a8   2.92 / 6.19   -> black
//   error   #a61d24   7.44 / 2.24   -> white
//   dark    #1f1f1f  15.30 / 1.18   -> white
//
// error is the one tone that changes hands: the light ramp's red is bright
// enough to need black ink, the dark ramp's red dark enough to need white. That
// is the whole reason this is a table per scheme rather than one rule. No hue
// moves in either direction - the amber card is still the amber card.
//
// The dark tile is the other per-scheme value. `grey.800` is the darkest usable
// step of the light ramp; in dark mode the equivalent step is `grey.100`
// (#1f1f1f), which is Mantis's own near-black tile and still reads as a tile
// against the #1e1e1e card beside it.

export const WIDGET_TONES = ['primary', 'warning', 'success', 'info', 'error', 'dark'];

const LIGHT = {
  primary: { bg: 'primary.main', strongBg: 'primary.dark', ink: 'common.white' },
  warning: { bg: 'warning.main', ink: 'common.black' },
  success: { bg: 'success.main', ink: 'common.black' },
  info: { bg: 'info.main', ink: 'common.black' },
  error: { bg: 'error.main', ink: 'common.black' },
  dark: { bg: 'grey.800', ink: 'common.white' }
};

const DARK = {
  primary: { bg: 'primary.main', ink: 'common.white' },
  warning: { bg: 'warning.main', ink: 'common.black' },
  success: { bg: 'success.main', ink: 'common.black' },
  info: { bg: 'info.main', ink: 'common.black' },
  error: { bg: 'error.main', ink: 'common.white' },
  dark: { bg: 'grey.100', ink: 'common.white' }
};

// `strong` swaps the fill for the ramp's dark step. It exists for one measured
// case: white on primary.main is 3.83 in light mode, which clears the 3:1
// large-text bar and misses the 4.5:1 small-text bar. Black ink on that fill is
// only 5.48 and looks like an error, so the way to carry small text on a blue
// card is the darker step - primary.dark #0958d9 takes white to 6.16. It is the
// same blue family, so the card still reads as the blue card. In dark mode the
// blue fill already measures 5.19 and `primary.dark` runs *lighter* than main,
// so `strong` is a light-scheme instruction only.
const fillOf = (table, tone, strong) => {
  const entry = table[tone] || table.primary;
  return strong && entry.strongBg ? entry.strongBg : entry.bg;
};

// The translucent values that sit on top of a fill - the footer band, the corner
// watermark, the muted line, the motif's alpha - all follow the ink, because
// what they are hiding from is the ink's own contrast figure. Dark marks read
// heavier than light ones at equal alpha, so the dark-ink side is always fainter.
const ALPHA = {
  black: { muted: 'rgba(0,0,0,0.62)', band: 'rgba(0,0,0,0.10)', watermark: 'rgba(0,0,0,0.13)', motif: 0.13 },
  white: { muted: 'rgba(255,255,255,0.78)', band: 'rgba(0,0,0,0.18)', watermark: 'rgba(255,255,255,0.20)', motif: 0.24 }
};

const paletteValue = (theme, token) => {
  const [group, key] = token.split('.');
  return theme.vars.palette[group][key];
};

const alphaOf = (table, tone, name) => ALPHA[(table[tone] || table.primary).ink === 'common.black' ? 'black' : 'white'][name];

// Everything a filled widget card needs. The two card halves are returned
// separately because MainCard already emits its own theme.applyStyles('dark')
// block and spreads it *after* the caller's sx: a dark block passed through sx
// is overwritten by MainCard's, silently, with the light values left standing.
// MainCard's `darkSX` prop exists for exactly this, so `card` carries the light
// values and `cardDark` the dark ones. The remaining fragments go on plain Box
// and Typography elements, where nothing competes for the same key, so those
// stay self-contained.
export function widgetSurface(tone = 'primary', { strong = false } = {}) {
  const sxPair = (build) => (theme) => ({ ...build(theme, LIGHT), ...theme.applyStyles('dark', build(theme, DARK)) });
  const cardValues = (table) => (theme) => {
    const bg = paletteValue(theme, fillOf(table, tone, strong));
    return { backgroundColor: bg, borderColor: bg, color: paletteValue(theme, (table[tone] || table.primary).ink) };
  };

  return {
    card: cardValues(LIGHT),
    cardDark: cardValues(DARK),
    band: sxPair((theme, table) => ({ backgroundColor: alphaOf(table, tone, 'band') })),
    watermarkFill: sxPair((theme, table) => ({ backgroundColor: alphaOf(table, tone, 'watermark') })),
    watermarkInk: sxPair((theme, table) => ({ color: alphaOf(table, tone, 'watermark') })),
    muted: sxPair((theme, table) => ({ color: alphaOf(table, tone, 'muted') })),
    motif: sxPair((theme, table) => ({ opacity: alphaOf(table, tone, 'motif') }))
  };
}
