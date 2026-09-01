// ==============================|| DATA CARDS - FILL AND INK ||============================== //
//
// The same argument as components/cards/widgets/widgetInk.js, re-measured for
// chip-sized text. Mantis's Data screen fills its chips with the Ant ramp this
// theme already ships, so the fills need no hard-coded hex: blue is primary,
// amber warning, green success, teal info, red error. The ink is chosen here,
// because Mantis sets white on all five and three of them are unreadable.
//
// Two things make this table different from widgetInk's:
//
// 1. A chip carries 13px text, so the 3:1 large-text allowance never applies.
//    White on primary.main measures 3.83 — enough for a 24px display figure,
//    not for a chip. The blue chip therefore takes the ramp's dark step in
//    light mode, which is widgetInk's own `strong` escape hatch: primary.dark
//    #0958d9 under white measures 6.16, and it is still the blue chip.
//
// 2. The ink has to be chosen per colour scheme, not once. The theme's grey
//    ramp is inverted in dark mode — grey.800 is #141414 in light and #f0f0f0
//    in dark — so an ink named from the grey ramp silently flips to near-white
//    on a light fill. common.black and common.white do not move, so the table
//    below names those, and picks between them per mode.
//
// Measured off the rendered page (white ink / black ink):
//
//   light  primary #1677ff   4.10 /  5.12  -> primary.dark + white, 6.16
//          warning #faad14   1.90 / 11.05  -> black
//          success #52c41a   2.27 /  9.27  -> black
//          info    #13c2c2   2.20 /  9.52  -> black
//          error   #ff4d4f   3.27 /  6.43  -> black
//   dark   primary #1668dc   5.19 /  2.53  -> white
//          warning #d89614   2.53 /  8.29  -> black
//          success #49aa19   2.98 /  7.05  -> black
//          info    #13a8a8   2.92 /  7.19  -> black
//          error   #a61d24   7.44 /  2.24  -> white
//
// error is the one tone that changes hands: the light ramp's red is bright
// enough to need black ink, the dark ramp's red is dark enough to need white.
// That is exactly why this is a table per mode rather than one rule.

export const DATA_TONES = ['primary', 'warning', 'success', 'info', 'error'];

const LIGHT = {
  primary: { bg: 'primary.dark', ink: 'common.white' },
  warning: { bg: 'warning.main', ink: 'common.black' },
  success: { bg: 'success.main', ink: 'common.black' },
  info: { bg: 'info.main', ink: 'common.black' },
  error: { bg: 'error.main', ink: 'common.black' }
};

const DARK = {
  primary: { bg: 'primary.main', ink: 'common.white' },
  warning: { bg: 'warning.main', ink: 'common.black' },
  success: { bg: 'success.main', ink: 'common.black' },
  info: { bg: 'info.main', ink: 'common.black' },
  error: { bg: 'error.main', ink: 'common.white' }
};

// Returns an sx fragment, not a pair of values, because the dark half has to be
// applied through theme.applyStyles - the same mechanism MainCard uses for its
// dark border. Both halves read the palette through theme.vars, so nothing here
// is a literal colour.

const paletteValue = (theme, token) => {
  const [group, key] = token.split('.');
  return theme.vars.palette[group][key];
};

export function toneFillSX(tone = 'primary') {
  const light = LIGHT[tone] || LIGHT.primary;
  const dark = DARK[tone] || DARK.primary;

  return (theme) => ({
    backgroundColor: paletteValue(theme, light.bg),
    color: paletteValue(theme, light.ink),
    ...theme.applyStyles('dark', {
      backgroundColor: paletteValue(theme, dark.bg),
      color: paletteValue(theme, dark.ink)
    })
  });
}
