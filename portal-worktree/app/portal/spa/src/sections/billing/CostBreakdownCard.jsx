import PropTypes from 'prop-types';

// material-ui
import { useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { PieChart } from '@mui/x-charts/PieChart';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';
import { costColors } from 'utils/chartSeries';

// ==============================|| BILLING - COST BREAKDOWN ||============================== //
//
// What made up this period's invoice.
//
// This portal replaced a pie with bars on the dashboard, so a ring here needs a
// reason. The rule the two decisions share: a ring is allowed only when there
// are at most five parts, the parts provably sum to a total, and the question is
// share-of-the-whole rather than rank. Call outcomes met none of those — seven
// slices, no meaningful total, and a length comparison. A bill meets all three:
// four lines that add up to a figure the reader has already seen on their
// invoice, and the question is "what is my bill made of".
//
// The ring is not the record. Every amount and every share is also written out
// in the legend beneath it, in order, so the comparison never depends on judging
// an angle — and so the card still works read aloud.
//
// The total sits above the ring rather than inside it. A centre label has to be
// positioned against the chart's own geometry and drifts the moment the card
// changes width; the same figure set as text is immune to that.

export default function CostBreakdownCard({
  title,
  subheader,
  totalLabel,
  total,
  items = [],
  valueFormatter,
  state = 'ready',
  emptyTitle,
  height = 208
}) {
  const { mode, systemMode } = useColorScheme();
  const palette = costColors(mode, systemMode);
  const empty = !items || items.length === 0;

  const data = items.map((item) => ({
    id: item.id,
    value: item.value,
    label: item.label,
    color: palette[item.id]
  }));

  return (
    <MainCard title={title} subheader={subheader} content={false}>
      <Box sx={{ p: 2.5 }}>
        {state === 'loading' ? (
          <ContentState state="loading" title={emptyTitle} compact />
        ) : empty ? (
          <ContentState state="empty" title={emptyTitle} compact />
        ) : (
          <Stack sx={{ gap: 2 }}>
            <Stack sx={{ gap: 0.25 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {totalLabel}
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </Stack>

            <Box aria-hidden="true">
              <PieChart
                hideLegend
                height={height}
                series={[
                  {
                    data,
                    innerRadius: 52,
                    outerRadius: 92,
                    // padding is taken off every slice equally, so at 2 degrees the
                    // 4.1% line loses an eighth of its angle and the 62.7% one loses
                    // under a percent; 1 keeps the gap visible without rewriting the
                    // proportions the card exists to show
                    paddingAngle: 1,
                    cornerRadius: 4,
                    valueFormatter: (item) => valueFormatter?.(item.value) ?? String(item.value),
                    highlightScope: { fade: 'global', highlight: 'item' }
                  }
                ]}
                margin={{ top: 4, bottom: 4, left: 4, right: 4 }}
              />
            </Box>

            <Stack sx={{ gap: 1.25 }}>
              {items.map((item) => (
                <Stack key={item.id} direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, bgcolor: palette[item.id] }} />
                  <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0 }} noWrap>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                    {item.share}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ flexShrink: 0, minWidth: 88, textAlign: 'right' }} noWrap>
                    {item.amount}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </Box>
    </MainCard>
  );
}

CostBreakdownCard.propTypes = {
  title: PropTypes.node,
  subheader: PropTypes.node,
  totalLabel: PropTypes.node,
  total: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.number,
      amount: PropTypes.node,
      share: PropTypes.node
    })
  ),
  valueFormatter: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
