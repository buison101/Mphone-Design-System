import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { BarChart, barClasses } from '@mui/x-charts';

// project imports
import { withAlpha } from 'utils/colorUtils';

// ==============================|| ANALYTICS - ACQUISITION CHART ||============================== //

export default function AcquisitionChart({ labels = ['Direct', 'Referral', 'Social'] }) {
  const theme = useTheme();

  const xAxisData = [
    '2025-03-26',
    '2025-03-27',
    '2025-03-28',
    '2025-03-29',
    '2025-03-30',
    '2025-03-31',
    '2025-04-01',
    '2025-04-02',
    '2025-04-03',
    '2025-04-04',
    '2025-04-05',
    '2025-04-06',
    '2025-04-07',
    '2025-04-08',
    '2025-04-09',
    '2025-04-10',
    '2025-04-11',
    '2025-04-12'
  ];

  const initialSeries = [
    {
      id: 'Direct',
      label: labels[0] || 'Direct',
      data: [21, 17, 15, 13, 15, 13, 16, 13, 8, 14, 11, 9, 7, 5, 3, 3, 7],
      color: theme.vars.palette.grey[900]
    },
    {
      id: 'Referral',
      label: labels[1] || 'Referral',
      data: [28, 30, 20, 26, 18, 27, 22, 28, 20, 21, 15, 14, 12, 10, 8, 18, 16],
      color: theme.vars.palette.primary.main
    },
    {
      id: 'Social',
      label: labels[2] || 'Social',
      data: [50, 51, 60, 54, 53, 48, 55, 40, 44, 42, 44, 44, 42, 40, 42, 32, 16],
      color: theme.vars.palette.primary[200]
    }
  ];

  // State to manage visibility of each series
  const [seriesVisibility, setSeriesVisibility] = useState({
    Direct: true,
    Referral: true,
    Social: true
  });

  // Toggle visibility by series id, not by label. The label is display text and
  // is translated at build time (docs/15 §4.7); keying state by it makes every
  // series invisible in any locale but English.
  const toggleSeriesVisibility = (seriesId) => {
    setSeriesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [seriesId]: !prevVisibility[seriesId]
    }));
  };

  const [highlightedItem, setHighLightedItem] = useState(null);

  const handleHighLightedSeries = (newHighLightedSeries) => {
    if (newHighLightedSeries !== null) {
      setHighLightedItem((prev) => ({
        ...prev,
        seriesId: newHighLightedSeries
      }));
    }
  };

  return (
    <>
      <BarChart
        hideLegend
        height={230}
        series={initialSeries
          .map((series) => ({
            ...series,
            type: 'bar',
            stack: '1',
            color: withAlpha(series.color, 0.85),
            visible: seriesVisibility[series.id], // Check visibility from state
            highlightScope: { highlight: 'series', fade: 'global' }
          }))
          .filter((series) => series.visible)}
        highlightedItem={highlightedItem}
        xAxis={[{ id: 'acquisition-x-axis', data: xAxisData, scaleType: 'band', position: 'none' }]}
        yAxis={[{ position: 'none' }]}
        axisHighlight={{ x: 'none' }}
        slotProps={{ tooltip: { trigger: 'item' } }}
        margin={{ left: 20, right: -5, top: 30, bottom: 15 }}
        sx={{ [`& .${barClasses.element}:hover`]: { opacity: 0.6 } }}
      />
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-around', width: 1, maxWidth: 250, ml: 2, mb: 2 }}>
        {initialSeries.map((series) => (
          <Stack
            key={series.label}
            direction="row"
            onClick={() => toggleSeriesVisibility(series.id)}
            onMouseEnter={() => handleHighLightedSeries(series.id)}
            onMouseLeave={() => setHighLightedItem(null)}
            sx={{ gap: 1, alignItems: 'center', opacity: seriesVisibility[series.id] ? 1 : 0.45, cursor: 'pointer' }}
          >
            <Box sx={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: series.color }} />
            <Typography>{series.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </>
  );
}

AcquisitionChart.propTypes = { labels: PropTypes.arrayOf(PropTypes.node) };
