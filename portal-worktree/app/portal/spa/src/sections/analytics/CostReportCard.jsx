import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, useColorScheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { axisClasses, barClasses, chartsGridClasses } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';
import { useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';
import { withAlpha } from 'utils/colorUtils';
import { seriesColors } from 'utils/chartSeries';

// ==============================|| ANALYTICS - COST REPORT ||============================== //
//
// Two cost streams side by side over the same period, with the total called out
// above them. Grouped rather than stacked: the question this card answers is
// which stream is larger, and a stack makes the upper segment impossible to
// compare across columns.
//
// The legend is clickable and doubles as the visibility control, so there is one
// place to look for what a colour means and one place to turn it off.

export default function CostReportCard({
  title,
  totalLabel,
  total,
  periods = [],
  period,
  onPeriodChange,
  labels = [],
  internal = [],
  external = [],
  internalLabel,
  externalLabel,
  valueFormatter,
  axisFormatter,
  state = 'ready',
  emptyTitle,
  height = 340
}) {
  const theme = useTheme();
  const intl = useIntl();
  const { mode, systemMode } = useColorScheme();
  const palette = seriesColors(mode, systemMode);
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [visible, setVisible] = useState({ internal: true, external: true });

  const legend = [
    { id: 'internal', label: internalLabel, color: palette.internal },
    { id: 'external', label: externalLabel, color: palette.external }
  ];

  const series = [
    {
      id: 'internal',
      data: internal,
      label: internalLabel,
      color: withAlpha(palette.internal, 0.9),
      valueFormatter
    },
    {
      id: 'external',
      data: external,
      label: externalLabel,
      color: withAlpha(palette.external, 0.9),
      valueFormatter
    }
  ].filter((item) => visible[item.id]);

  const control = periods.length > 0 && (
    <TextField
      select
      size="small"
      value={period}
      onChange={(event) => onPeriodChange?.(event.target.value)}
      label={intl.formatMessage({ id: 'analytics.cost.periodLabel' })}
      sx={{ minWidth: 150 }}
    >
      {periods.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <MainCard title={title} secondary={control} content={false}>
      <Box sx={{ p: 2.5, pb: 1 }}>
        {state === 'loading' ? (
          <ContentState state="loading" title={emptyTitle} />
        ) : labels.length === 0 ? (
          <ContentState state="empty" title={emptyTitle} />
        ) : (
          <>
            <Stack
              direction="row"
              sx={{
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {totalLabel}
                </Typography>
                <Typography variant="h4">{total}</Typography>
              </Stack>

              <Stack direction="row" sx={{ gap: 2.5, flexWrap: 'wrap' }}>
                {legend.map((item) => (
                  <Stack
                    key={item.id}
                    component="button"
                    type="button"
                    direction="row"
                    aria-pressed={visible[item.id]}
                    onClick={() =>
                      setVisible((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }))
                    }
                    sx={{
                      gap: 1,
                      alignItems: 'center',
                      border: 0,
                      p: 0.5,
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      color: 'text.primary',
                      opacity: visible[item.id] ? 1 : 0.45,
                      transition: 'opacity 0.2s ease-in-out',
                      '&:focus-visible': {
                        outline: `2px solid ${theme.vars.palette.primary.main}`,
                        outlineOffset: 2
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: item.color
                      }}
                    />
                    <Typography variant="body2">{item.label}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

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
                  categoryGapRatio: downSM ? 0.5 : 0.6,
                  barGapRatio: 0.2,
                  tickLabelStyle: { fontSize: 12 }
                }
              ]}
              // the tooltip carries the exact amount; a full currency string on
              // every tick would be clipped to "8,00…" and tell the reader nothing
              yAxis={[
                {
                  disableLine: true,
                  tickSize: 7,
                  valueFormatter: axisFormatter,
                  tickLabelStyle: { fontSize: 12 }
                }
              ]}
              series={series}
              slotProps={{
                bar: { rx: 4, ry: 4 },
                tooltip: { trigger: 'item' }
              }}
              axisHighlight={{ x: 'none' }}
              margin={{ top: 24, left: 4, bottom: 8, right: 8 }}
              sx={{
                [`& .${barClasses.element}:hover`]: { opacity: 0.7 },
                [`& .${chartsGridClasses.line}`]: {
                  strokeDasharray: '4 4',
                  stroke: theme.vars.palette.divider
                },
                [`& .${axisClasses.root} .${axisClasses.tick}`]: {
                  stroke: 'transparent'
                },
                [`& .${axisClasses.tickLabel}`]: {
                  fill: theme.vars.palette.text.secondary
                }
              }}
            />
          </>
        )}
      </Box>
    </MainCard>
  );
}

CostReportCard.propTypes = {
  title: PropTypes.node,
  totalLabel: PropTypes.node,
  total: PropTypes.node,
  periods: PropTypes.array,
  period: PropTypes.string,
  onPeriodChange: PropTypes.func,
  labels: PropTypes.array,
  internal: PropTypes.array,
  external: PropTypes.array,
  internalLabel: PropTypes.string,
  externalLabel: PropTypes.string,
  valueFormatter: PropTypes.func,
  axisFormatter: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  height: PropTypes.number
};
