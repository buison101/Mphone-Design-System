import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses, lineClasses } from '@mui/x-charts';

// project imports
import { withAlpha } from 'utils/colorUtils';

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const byWeekVolume = [100, 20, 60, 20, 20, 80, 20];
const byWeekMargin = [51, 40, 28, 51, 42, 109, 100];
const byWeekSales = [21, 40, 28, 51, 42, 109, 100];

const byMonthVolume = [100, 40, 60, 40, 40, 40, 80, 40, 40, 50, 40, 40];
const byMonthSales = [90, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35];
const byMonthMargin = [120, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35];

const weekDataMap = { margin: byWeekMargin, sales: byWeekSales, volume: byWeekVolume };

const monthDataMap = { margin: byMonthMargin, sales: byMonthSales, volume: byMonthVolume };

// ==============================|| ANALYTICS - INCOME ||============================== //

export default function IncomeChart({ slot, quantity, content = {} }) {
  const theme = useTheme();

  const [data, setData] = useState(byMonthVolume);
  const [labels, setLabels] = useState(monthLabels);

  useEffect(() => {
    switch (slot) {
      case 'week':
        setData(weekDataMap[quantity] ?? byWeekVolume);
        setLabels(content.weekLabels || weekLabels);
        break;
      case 'month':
        setData(monthDataMap[quantity] ?? byMonthVolume);
        setLabels(content.monthLabels || monthLabels);
        break;
    }
  }, [content.monthLabels, content.weekLabels, slot, quantity]);

  return (
    <LineChart
      hideLegend
      grid={{ horizontal: true, vertical: true }}
      xAxis={[{ data: labels, scaleType: 'point', disableLine: true, tickSize: 7 }]}
      yAxis={[{ disableLine: true, tickMaxStep: 20, tickSize: 7 }]}
      series={[
        {
          curve: 'linear',
          data,
          showMark: false,
          area: true,
          id: 'IncomeChart',
          color: theme.vars.palette.primary.main,
          label: content.label || 'Income',
          valueFormatter: (value) => `${content.valuePrefix ?? '$ '}${value}${content.valueSuffix || ''}`
        }
      ]}
      height={355}
      margin={{ top: 30, bottom: 25, left: 0, right: 22 }}
      sx={{
        [`& .${lineClasses.line}`]: { strokeDasharray: 0, strokeWidth: 1 },
        [`& .${lineClasses.area}`]: { fill: `url('#myGradient3')`, paintOrder: 'stroke' },
        [`& .${axisClasses.tick}`]: { stroke: theme.vars.palette.divider },
        [`& .${axisClasses.root}.${axisClasses.directionX} .${axisClasses.tick}`]: { stroke: theme.vars.palette.divider },
        [`& .${axisClasses.root}.${axisClasses.directionY} .${axisClasses.tick}`]: { stroke: 'transparent' }
      }}
    >
      <defs>
        <linearGradient id="myGradient3" gradientTransform="rotate(90)">
          <stop offset="10%" stopColor={withAlpha(theme.vars.palette.primary.main, 0.2)} />
          <stop offset="80%" stopColor={withAlpha(theme.vars.palette.background.default, 0.4)} />
        </linearGradient>
      </defs>
    </LineChart>
  );
}

IncomeChart.propTypes = {
  content: PropTypes.object,
  slot: PropTypes.oneOf(['week', 'month']),
  quantity: PropTypes.oneOf(['margin', 'sales', 'volume'])
};
