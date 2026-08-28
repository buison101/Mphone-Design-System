import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, chartsGridClasses, lineClasses } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts/LineChart';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| ANALYTICS - QUALITY REPORT ||============================== //
//
// Three headline ratios, then the shape of the one that moves. The list carries
// the numbers a reader quotes in a meeting; the line underneath only has to show
// direction, which is why it has no y-axis and no marks.
//
// Warning is the mark colour on purpose: this card reports pressure, not
// failure. Error would claim something is already broken.

export default function QualityReportCard({
  title,
  action,
  metrics = [],
  labels = [],
  series = [],
  state = 'ready',
  emptyTitle,
  height = 260
}) {
  const theme = useTheme();
  const hasChart = labels.length > 0 && series.length > 0;

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && metrics.length === 0 && !hasChart && <ContentState state="empty" title={emptyTitle} compact />}

      {state !== 'loading' && metrics.length > 0 && (
        <List sx={{ p: 0, '& .MuiListItem-root': { py: 2, px: 2.5 } }}>
          {metrics.map((metric, index) => (
            <ListItem key={metric.id ?? index} divider={index < metrics.length - 1}>
              <ListItemText primary={metric.label} slotProps={{ primary: { variant: 'body2' } }} />
              <Typography variant="h5" sx={{ color: metric.tone ? `${metric.tone}.main` : 'text.primary' }}>
                {metric.value}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}

      {state !== 'loading' && hasChart && (
        <LineChart
          hideLegend
          height={height}
          grid={{ horizontal: true }}
          xAxis={[{ data: labels, scaleType: 'point', disableLine: true, tickSize: 7, tickLabelStyle: { fontSize: 12 } }]}
          yAxis={[{ position: 'none' }]}
          series={[{ id: 'quality', data: series, showMark: false, color: theme.vars.palette.warning.main }]}
          margin={{ top: 24, bottom: 8, left: 16, right: 16 }}
          sx={{
            [`& .${lineClasses.root}`]: { strokeWidth: 2 },
            [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', stroke: theme.vars.palette.divider },
            [`& .${axisClasses.root} .${axisClasses.tick}`]: { stroke: 'transparent' },
            [`& .${axisClasses.tickLabel}`]: { fill: theme.vars.palette.text.secondary }
          }}
        />
      )}
    </MainCard>
  );
}

QualityReportCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      value: PropTypes.node,
      tone: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info'])
    })
  ),
  labels: PropTypes.array,
  series: PropTypes.array,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
