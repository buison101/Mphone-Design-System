import PropTypes from 'prop-types';
import { useId } from 'react';

// material-ui
import { useTheme, useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, chartsGridClasses, lineClasses } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts/LineChart';

// project imports
import { withAlpha } from 'utils/colorUtils';
import { seriesColors } from 'utils/chartSeries';

// ==============================|| ANALYTICS - CALL TREND CHART ||============================== //
//
// Two filled lines over the same period: answered against missed. The fill is
// what makes the gap between them readable as volume rather than as two
// unrelated lines that happen to share an axis.
//
// The gradient fades to the page background rather than to transparent, so the
// area never darkens the grid it crosses in either colour scheme. Gradient ids
// come from useId — two of these charts on one page would otherwise fight over
// the same <defs>.

export default function CallTrendChart({ labels = [], answered = [], missed = [], answeredLabel, missedLabel, emptyLabel, height = 380 }) {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const palette = seriesColors(mode, systemMode);
  const uid = useId().replace(/[:]/g, '');

  if (labels.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {emptyLabel}
        </Typography>
      </Box>
    );
  }

  const answeredFill = `trend-answered-${uid}`;
  const missedFill = `trend-missed-${uid}`;

  return (
    <LineChart
      hideLegend
      height={height}
      grid={{ horizontal: true, vertical: false }}
      xAxis={[{ scaleType: 'point', data: labels, tickSize: 7, disableLine: true, tickLabelStyle: { fontSize: 12 } }]}
      yAxis={[{ tickSize: 7, disableLine: true, tickMinStep: 1, tickLabelStyle: { fontSize: 12 } }]}
      margin={{ top: 24, bottom: 0, left: 4, right: 12 }}
      series={[
        { id: 'answered', type: 'line', data: answered, label: answeredLabel, area: true, showMark: false, color: palette.answered },
        { id: 'missed', type: 'line', data: missed, label: missedLabel, area: true, showMark: false, color: palette.missed }
      ]}
      sx={{
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', stroke: theme.vars.palette.divider },
        [`& .${lineClasses.root}`]: { strokeWidth: 2 },
        [`& .${lineClasses.area}`]: {
          '&[data-series-id="answered"]': { fill: `url('#${answeredFill}')`, opacity: 0.8 },
          '&[data-series-id="missed"]': { fill: `url('#${missedFill}')`, opacity: 0.8 }
        },
        [`& .${axisClasses.root} .${axisClasses.tick}`]: { stroke: 'transparent' },
        [`& .${axisClasses.tickLabel}`]: { fill: theme.vars.palette.text.secondary }
      }}
    >
      <defs>
        <linearGradient id={answeredFill} gradientTransform="rotate(90)">
          <stop offset="10%" stopColor={withAlpha(palette.answered, 0.4)} />
          <stop offset="90%" stopColor={withAlpha(theme.vars.palette.background.default, 0.4)} />
        </linearGradient>
        <linearGradient id={missedFill} gradientTransform="rotate(90)">
          <stop offset="10%" stopColor={withAlpha(palette.missed, 0.35)} />
          <stop offset="90%" stopColor={withAlpha(theme.vars.palette.background.default, 0.4)} />
        </linearGradient>
      </defs>
    </LineChart>
  );
}

CallTrendChart.propTypes = {
  labels: PropTypes.array,
  answered: PropTypes.array,
  missed: PropTypes.array,
  answeredLabel: PropTypes.string,
  missedLabel: PropTypes.string,
  emptyLabel: PropTypes.node,
  height: PropTypes.number
};
