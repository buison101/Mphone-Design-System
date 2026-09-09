import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import SalesChart from 'mphone-lab/dashboard-default/MphoneSalesChart';

// sales report getStatus()
// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getStatus = () => [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function SaleReportCard({ chartLabels, periodLabels, title = 'Sales Report' }) {
  const [value, setValue] = useState('today');

  return (
    <>
      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid>
          <TextField
            id="standard-select-currency"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            slotProps={{ htmlInput: { sx: { py: 0.75, fontSize: '0.875rem' } } }}
          >
            {getStatus().map((option, index) => (
              <MenuItem key={option.value} value={option.value}>
                {periodLabels?.[index] || option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <SalesChart filter={value} labels={chartLabels} />
    </>
  );
}

SaleReportCard.propTypes = {
  chartLabels: PropTypes.object,
  periodLabels: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node
};
