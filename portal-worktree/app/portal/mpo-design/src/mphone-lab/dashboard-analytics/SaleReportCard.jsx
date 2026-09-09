import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import SalesChart from 'mphone-lab/dashboard-analytics/SalesChart';

// sales report getStatus()
// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getStatus = (labels = []) => [
  {
    value: 'today',
    label: labels[0] || 'Today'
  },
  {
    value: 'month',
    label: labels[1] || 'This Month'
  },
  {
    value: 'year',
    label: labels[2] || 'This Year'
  }
];

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function SaleReportCard({ content = {} }) {
  const [value, setValue] = useState('today');

  return (
    <>
      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <Typography variant="h5">{content.title || 'Sales Report'}</Typography>
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
            {getStatus(content.periods).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <SalesChart filter={value} content={content.chart} />
    </>
  );
}

SaleReportCard.propTypes = { content: PropTypes.object };
