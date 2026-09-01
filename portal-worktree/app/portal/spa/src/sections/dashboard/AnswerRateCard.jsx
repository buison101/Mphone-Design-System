import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, barClasses } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| DASHBOARD - ANSWER RATE ||============================== //
//
// The headline ratio with the shape of the period under it. Mantis puts a week
// of bars beneath a single figure here and the pairing is right: a rate on its
// own cannot say whether the quiet hours or the busy ones are dragging it down.
//
// The bars are answered calls per bucket, not the rate per bucket. A rate
// computed over three calls at 6am swings to 0% or 100% and would draw a
// dramatic chart out of nothing.
//
// No y-axis. This chart is a shape, and the number that matters is already set
// in h3 above it.

export default function AnswerRateCard({ title, label, value, hourly = [], state = 'ready', emptyTitle, height = 180 }) {
  const theme = useTheme();
  const data = hourly.map((row) => row.answered ?? 0);

  return (
    <MainCard title={title} content={false}>
      <Box sx={{ p: 2.5, pb: data.length ? 0 : 2.5 }}>
        {state === 'loading' ? (
          <ContentState state="loading" title={emptyTitle} compact />
        ) : (
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {label}
            </Typography>
            <Typography variant="h3">{value}</Typography>
          </Stack>
        )}
      </Box>

      {state !== 'loading' &&
        (data.length > 0 ? (
          <BarChart
            hideLegend
            height={height}
            series={[{ data, color: theme.vars.palette.info.light }]}
            xAxis={[{ data: hourly.map((_, index) => index), scaleType: 'band', position: 'none', categoryGapRatio: 0.4 }]}
            yAxis={[{ position: 'none' }]}
            slotProps={{ bar: { rx: 4, ry: 4 } }}
            axisHighlight={{ x: 'none' }}
            margin={{ top: 8, left: 12, right: 12, bottom: 8 }}
            sx={{
              [`& .${barClasses.element}:hover`]: { opacity: 0.7 },
              [`& .${axisClasses.root} .${axisClasses.tick}`]: { stroke: 'transparent' }
            }}
          />
        ) : (
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <FormattedMessage id="overview.volume.empty" />
            </Typography>
          </Box>
        ))}
    </MainCard>
  );
}

AnswerRateCard.propTypes = {
  title: PropTypes.node,
  label: PropTypes.node,
  value: PropTypes.node,
  hourly: PropTypes.array,
  state: PropTypes.oneOf(['loading', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
