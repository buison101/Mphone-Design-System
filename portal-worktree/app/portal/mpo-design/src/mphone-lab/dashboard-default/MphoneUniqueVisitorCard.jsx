import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IncomeAreaChart from './MphoneIncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard({ monthLabel = 'Month', seriesLabels, title = 'Unique Visitor', weekLabel = 'Week' }) {
  const [view, setView] = useState('monthly'); // 'monthly' or 'weekly'

  return (
    <>
      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              {monthLabel}
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}
            >
              {weekLabel}
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard border={false} content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} seriesLabels={seriesLabels} />
        </Box>
      </MainCard>
    </>
  );
}

UniqueVisitorCard.propTypes = {
  monthLabel: PropTypes.node,
  seriesLabels: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node,
  weekLabel: PropTypes.node
};
