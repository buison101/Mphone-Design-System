import PropTypes from 'prop-types';

// material-ui
import { useTheme, useColorScheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, barClasses, chartsGridClasses } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';
import { withAlpha } from 'utils/colorUtils';
import { seriesColors } from 'utils/chartSeries';

// ==============================|| BILLING - BILLED TREND ||============================== //
//
// Twelve closed billing periods, one bar each.
//
// Bars, not the line Mantis draws here. Twelve monthly invoices are twelve
// separate events; a line joins them into a continuous quantity and invites the
// reader to read a value off the slope between two months that never existed.
//
// One colour, and no split by payment status. The draft of this card painted the
// unpaid periods in a second hue, and it was wrong twice over. It was the fourth
// card on the page to say which invoices are unpaid — the stat tiles, the filter
// counts and the invoice chips all say it already, and they say it in text — and
// the hue it spent was the amber the cost breakdown beside it needs for outbound
// usage. Two charts on one screen using one colour for two meanings is the exact
// thing utils/chartSeries.js exists to stop. The reading this card owns is the
// shape of the spend, and that needs no second colour.

export default function BilledTrendCard({
  title,
  caption,
  labels = [],
  data = [],
  valueFormatter,
  axisFormatter,
  state = 'ready',
  emptyTitle,
  height = 300
}) {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const palette = seriesColors(mode, systemMode);
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainCard title={title} content={false}>
      <Box sx={{ p: 2.5, pb: 1 }}>
        {state === 'loading' ? (
          <ContentState state="loading" title={emptyTitle} />
        ) : labels.length === 0 ? (
          <ContentState state="empty" title={emptyTitle} />
        ) : (
          <>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {caption}
            </Typography>

            <BarChart
              hideLegend
              height={height}
              grid={{ horizontal: true }}
              xAxis={[
                {
                  data: labels,
                  scaleType: 'band',
                  tickSize: 7,
                  disableLine: true,
                  categoryGapRatio: downSM ? 0.4 : 0.5,
                  tickLabelStyle: { fontSize: 12 }
                }
              ]}
              // a money axis with no unit is unreadable, and the full currency
              // string on every tick clips to "7.730.00…"; compact notation is
              // the only spelling that fits and still says what the number is
              yAxis={[{ disableLine: true, tickSize: 7, valueFormatter: axisFormatter, tickLabelStyle: { fontSize: 12 } }]}
              series={[{ id: 'billed', data, label: title, color: withAlpha(palette.answered, 0.9), valueFormatter }]}
              slotProps={{ bar: { rx: 4, ry: 4 }, tooltip: { trigger: 'item' } }}
              axisHighlight={{ x: 'none' }}
              margin={{ top: 24, left: 4, bottom: 8, right: 8 }}
              sx={{
                [`& .${barClasses.element}:hover`]: { opacity: 0.7 },
                [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', stroke: theme.vars.palette.divider },
                [`& .${axisClasses.root} .${axisClasses.tick}`]: { stroke: 'transparent' },
                [`& .${axisClasses.tickLabel}`]: { fill: theme.vars.palette.text.secondary }
              }}
            />
          </>
        )}
      </Box>
    </MainCard>
  );
}

BilledTrendCard.propTypes = {
  title: PropTypes.node,
  caption: PropTypes.node,
  labels: PropTypes.array,
  data: PropTypes.array,
  valueFormatter: PropTypes.func,
  axisFormatter: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
