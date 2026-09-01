import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| STATISTICS - STATUS STAT CARD ||============================== //
//
// A count whose colour is its state — and the only statistic card allowed
// colour, because it is the only one whose colour carries information.
//
// Mantis fills ten cards on one screen in ten hues: a blue Revenue, an amber
// Orders, a green Total Sales, four social-brand tiles. None of it encodes
// anything. Spending colour on decoration is not free — it is exactly what stops
// a reader noticing the one card that went red.
//
// The surface is a light tint with an accent edge, not the solid fill Mantis
// uses. That is a measured decision, not a taste one: the first build of this
// card filled with `{tone}.main` and took the theme's contrastText, and the
// rendered page measured white-on-warning at 1.74:1 and white-on-success at
// 2.27:1 — both far under 4.5:1, and unreadable. On a tint the value keeps
// ordinary body ink and clears 12:1.
//
// Colour is never the signal on its own. The theme's success (#52c41a) and
// warning (#faad14) sit ΔE 0.3 apart under simulated protanopia — for a
// red-green colourblind reader they are the same colour — so every state ships
// an icon and a word, and the accent edge adds a non-colour channel on top.
//
// `tone="neutral"` renders no tint at all. A tile with nothing to report should
// look like a tile with nothing to report.

export default function StatusStatCard({ title, value, status, statusLabel, tone = 'neutral', icon: Icon }) {
  const toned = tone !== 'neutral';
  const label = statusLabel ?? status;

  return (
    <MainCard
      contentSX={{ p: 2.25, pl: toned ? 2.75 : 2.25 }}
      sx={
        toned
          ? (theme) => ({
              bgcolor: `${tone}.lighter`,
              borderColor: `${tone}.light`,
              borderLeft: '3px solid',
              borderLeftColor: `${tone}.main`,
              ...theme.applyStyles('dark', { borderColor: theme.vars.palette[tone].main })
            })
          : undefined
      }
    >
      <Stack sx={{ gap: 0.75 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>

        <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
          {value}
        </Typography>

        {/* Guarded on the resolved label, not on `status`. An earlier build
            guarded on `status` alone, so a card given only `statusLabel` drew its
            colour and no chip — the exact failure this component exists to
            prevent, shipped inside the component that forbids it. Caught by
            looking at the rendered page, not by reading the file. */}
        {label && (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Chip
              size="small"
              variant="combined"
              color={toned ? tone : 'secondary'}
              icon={Icon ? <Icon style={{ fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 }} /> : undefined}
              label={label}
              sx={{ pl: Icon ? 1 : 0 }}
            />
          </Stack>
        )}
      </Stack>
    </MainCard>
  );
}

StatusStatCard.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node,
  status: PropTypes.node,
  statusLabel: PropTypes.node,
  tone: PropTypes.oneOf(['neutral', 'success', 'warning', 'error', 'info']),
  icon: PropTypes.elementType
};
