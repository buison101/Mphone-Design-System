// ==============================|| CHART SERIES COLOR ||============================== //
//
// One place for the marks a chart is allowed to paint, so two charts on the same
// page cannot disagree about what "missed" looks like.
//
// Both palettes were checked against their own paper colour, #ffffff and #121212.
// Green for answered reads as the obvious choice and fails colour vision
// deficiency separation against red. Orange fails beside red as well
// (normal-vision ΔE 14). Purple passes cleanly in both modes.
//
// The dark marks are not the palette's error.main and purple main. Those steps
// (#a61d24, #642ab5) are drawn to sit under text on a chip or a button; as a
// filled shape on the page they fall outside the lightness band and reach only
// 2.5:1 against the surface. A chart mark has a different job, so it takes the
// step from the same Ant Design dark ramp that passes: redDark[5], purpleDark[6].

export const SERIES_COLOR = {
  light: {
    answered: '#1677ff',
    missed: '#ff4d4f',
    unconnected: '#722ed1',
    internal: '#13c2c2',
    external: '#faad14',
    mobile: '#597ef7'
  },
  dark: {
    answered: '#1668dc',
    missed: '#d32029',
    unconnected: '#854eca',
    internal: '#13a8a8',
    external: '#d89614',
    mobile: '#3c89e8'
  }
};

// Resolve the active colour scheme without every chart repeating the
// mode/systemMode dance that useColorScheme returns.
export function resolveScheme(mode, systemMode) {
  return (mode === 'system' ? systemMode : mode) === 'dark' ? 'dark' : 'light';
}

export function seriesColors(mode, systemMode) {
  return SERIES_COLOR[resolveScheme(mode, systemMode)];
}
