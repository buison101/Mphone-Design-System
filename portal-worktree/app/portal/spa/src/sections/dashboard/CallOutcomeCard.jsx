import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, barClasses, chartsGridClasses } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| DASHBOARD - CALL OUTCOME ||============================== //
//
// How every call in the period ended, with the total called out above it.
//
// Bars on a common baseline rather than the pie this page used to carry. Seven
// outcomes is past the three or four a pie can be read at, and the question here
// is "how many failed this way versus that way" — a length comparison, which is
// exactly what a pie is worst at.
//
// One bar per outcome, each in the colour that outcome already has everywhere
// else in the portal. The colour is a repeat of the label beneath it, never the
// only thing carrying the meaning.
//
// The answered bar is left out by the caller and stated as text instead. On a
// healthy PBX it is ten times the next bar and flattens every failure mode into
// the axis — which is the opposite of what someone opens this card to see.

export default function CallOutcomeCard({ title, totalLabel, total, note, outcomes = [], state = 'ready', emptyTitle, height = 300 }) {
  const theme = useTheme();

  return (
    <MainCard title={title} content={false}>
      <Box sx={{ p: 2.5, pb: 1 }}>
        {state === 'loading' ? (
          <ContentState state="loading" title={emptyTitle} />
        ) : outcomes.length === 0 ? (
          <ContentState state="empty" title={emptyTitle} />
        ) : (
          <>
            <Stack sx={{ gap: 0.5, mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {totalLabel}
              </Typography>
              <Typography variant="h4">{total}</Typography>
              {note && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {note}
                </Typography>
              )}
            </Stack>

            <BarChart
              hideLegend
              height={height}
              grid={{ horizontal: true }}
              xAxis={[
                {
                  data: outcomes.map((row) => row.label),
                  scaleType: 'band',
                  disableLine: true,
                  tickSize: 7,
                  categoryGapRatio: 0.55,
                  colorMap: { type: 'ordinal', values: outcomes.map((row) => row.label), colors: outcomes.map((row) => row.color) },
                  tickLabelStyle: { fontSize: 12 }
                }
              ]}
              yAxis={[{ disableLine: true, tickSize: 7, tickMinStep: 1, tickLabelStyle: { fontSize: 12 } }]}
              series={[{ data: outcomes.map((row) => row.value) }]}
              slotProps={{ bar: { rx: 4, ry: 4 }, tooltip: { trigger: 'item' } }}
              axisHighlight={{ x: 'none' }}
              margin={{ top: 16, left: 4, bottom: 8, right: 8 }}
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

CallOutcomeCard.propTypes = {
  title: PropTypes.node,
  totalLabel: PropTypes.node,
  total: PropTypes.node,
  note: PropTypes.node,
  outcomes: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number, color: PropTypes.string })),
  state: PropTypes.oneOf(['loading', 'empty', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
