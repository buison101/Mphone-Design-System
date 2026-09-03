import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

// project imports
import { ThemeDirection, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const getPieChartOptions = () => ({
  chart: {
    type: 'pie',
    background: 'transparent'
  },
  labels: ['Excellent', 'Satisfied', 'Poor', 'Very Poor'],
  legend: {
    show: true,
    offsetX: 10,
    offsetY: 10,
    labels: { useSeriesColors: false },
    markers: { size: 6, shape: 'circle', strokeWidth: 0 },
    itemMargin: { horizontal: 25, vertical: 4 }
  },
  responsive: [
    {
      breakpoint: 450,
      options: { chart: { width: 280, height: 280 }, legend: { show: false } }
    }
  ]
});

// ==============================|| APEXCHART - PIE ||============================== //

export default function ApexPieChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily, i18n }
  } = useConfig();

  const line = theme.vars.palette.divider;
  const textPrimary = theme.vars.palette.text.primary;
  const backColor = theme.vars.palette.background.paper;

  const [series] = useState([35.5, 29, 19.5, 16]);
  const [options, setOptions] = useState(getPieChartOptions());

  const primaryMain = theme.vars.palette.primary.main;
  const successMain = theme.vars.palette.success.main;
  const errorMain = theme.vars.palette.error.main;
  const warningMain = theme.vars.palette.warning.main;
  const isRTL = theme.direction === ThemeDirection.RTL;

  useEffect(() => {
    // Recomputed per locale: the labels below are substituted at build (§4.7).
    const pieChartOptions = getPieChartOptions();
    setOptions({
      ...pieChartOptions,
      chart: { ...pieChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain, warningMain, successMain, errorMain],
      grid: { borderColor: line },
      legend: {
        ...pieChartOptions.legend,
        position: isRTL ? 'left' : 'right',
        labels: { ...pieChartOptions.legend?.labels, colors: textPrimary }
      },
      stroke: { colors: [backColor] },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textPrimary, line, backColor, primaryMain, warningMain, errorMain, successMain, isRTL, i18n]);

  return <ReactApexChart options={options} series={series} type="pie" width={400} />;
}
