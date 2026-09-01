import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';

// ==============================|| WIDGET - BACKGROUND MOTIF ||============================== //
//
// The decorative field behind an illustrated widget card.
//
// Mantis ships a raster illustration per card. Two reasons this is drawn
// instead. docs/12 rule 6 forbids copying Mantis Pro assets, so the artwork
// could not be reused even if it fitted. And an SVG in the stylesheet cannot
// arrive late, half-load, or need a second colour scheme — which matters on
// cards whose whole job is to be a coloured surface.
//
// Every motif is one path family in `currentColor`, so it inherits the card's
// ink and is correct on every fill without a variant per colour. All of it is
// aria-hidden: it encodes nothing.
//
// preserveAspectRatio="xMidYMid slice" makes the motif behave like a background
// cover rather than stretching — a wave squashed to a card's aspect ratio stops
// reading as a wave.
//
// Two things keep it from fighting the number on top of it.
//
// A mask fades the middle third away, so the text sits on the flat fill rather
// than on the pattern. That matters more than it looks: the contrast figures in
// widgetInk.js are measured against the flat colour, and they are only true of
// the rendered card if nothing is drawn between the fill and the text.
//
// Dark marks read heavier than light ones at the same alpha, so a motif inked
// dark (on amber, green, teal or red) is drawn fainter than one inked white.
// Same rule as the ink itself: the fill decides, not the author.

const MOTIFS = {
  // concentric arcs from the lower left: a signal leaving a point
  waves: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      {[36, 66, 96, 126, 156, 186].map((r) => (
        <circle key={r} cx="18" cy="128" r={r} />
      ))}
    </g>
  ),
  // a small graph of connected points: extensions on one switch
  nodes: (
    <g stroke="currentColor" strokeWidth="1.75" fill="none">
      <path d="M40 96 L96 52 M40 96 L96 140 M96 52 L168 74 M96 140 L168 74 M96 140 L162 154 M168 74 L214 118" />
      <g fill="currentColor" stroke="none">
        {[
          [40, 96, 7],
          [96, 52, 5],
          [96, 140, 5],
          [168, 74, 6],
          [162, 154, 4],
          [214, 118, 5]
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </g>
  ),
  // a dotted field: the neutral option when the subject is not a network
  grid: (
    <g fill="currentColor">
      {Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 11 }, (_, col) => <circle key={`${row}-${col}`} cx={16 + col * 22} cy={16 + row * 22} r="2.5" />)
      )}
    </g>
  )
};

const CLEAR_CENTRE = 'linear-gradient(90deg, #000 0%, #000 22%, transparent 44%, transparent 56%, #000 78%, #000 100%)';

export default function WidgetMotif({ motif = 'waves', sx }) {
  return (
    <Box
      aria-hidden="true"
      component="svg"
      viewBox="0 0 256 176"
      preserveAspectRatio="xMidYMid slice"
      sx={[
        {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          color: 'inherit',
          pointerEvents: 'none',
          maskImage: CLEAR_CENTRE,
          WebkitMaskImage: CLEAR_CENTRE
        },
        sx
      ]}
    >
      {MOTIFS[motif] ?? MOTIFS.waves}
    </Box>
  );
}

WidgetMotif.propTypes = { motif: PropTypes.oneOf(['waves', 'nodes', 'grid']), sx: PropTypes.any };
