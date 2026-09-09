import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';

import WelcomeBanner from 'mphone-lab/dashboard-analytics/WelcomeBanner';
import MarketingCardChart from 'mphone-lab/dashboard-analytics/MarketingCardChart';
import OrdersCardChart from 'mphone-lab/dashboard-analytics/OrdersCardChart';
import OrdersList from 'mphone-lab/dashboard-analytics/OrdersList';
// Renamed from PageViews.jsx: tracker blockers refuse dev URLs containing that token. See README.
import PageViews from 'mphone-lab/dashboard-analytics/TopPagesCard';
import ReportChart from 'mphone-lab/dashboard-analytics/ReportChart';
import SalesCardChart from 'mphone-lab/dashboard-analytics/SalesCardChart';
import TransactionHistory from 'mphone-lab/dashboard-analytics/TransactionHistory';
import UsersCardChart from 'mphone-lab/dashboard-analytics/UsersCardChart';
import LabelledTasks from 'mphone-lab/dashboard-analytics/LabelledTasks';
import ReaderCard from 'mphone-lab/dashboard-analytics/ReaderCard';
import AcquisitionChannels from 'mphone-lab/dashboard-analytics/AcquisitionChannels';
import IncomeOverviewCard from 'mphone-lab/dashboard-analytics/IncomeOverviewCard';
import SaleReportCard from 'mphone-lab/dashboard-analytics/SaleReportCard';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

export default function DashboardAnalytics({ content = {} }) {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);

  const handleOrderMenuClick = (event) => {
    setOrderMenuAnchor(event.currentTarget);
  };
  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  const handleAnalyticsMenuClick = (event) => {
    setAnalyticsMenuAnchor(event.currentTarget);
  };
  const handleAnalyticsMenuClose = () => {
    setAnalyticsMenuAnchor(null);
  };
  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid size={12}>
        <WelcomeBanner content={content.banner} />
      </Grid>
      {/* row 1 */}
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={content.metrics?.[0]?.title || 'Total Users'}
          count={content.metrics?.[0]?.value || '78,250'}
          percentage={70.5}
        >
          <UsersCardChart label={content.metrics?.[0]?.chartLabel} />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={content.metrics?.[1]?.title || 'Total Order'}
          count={content.metrics?.[1]?.value || '18,800'}
          percentage={27.4}
          isLoss
          color="error"
        >
          <OrdersCardChart label={content.metrics?.[1]?.chartLabel} />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={content.metrics?.[2]?.title || 'Total Sales'}
          count={content.metrics?.[2]?.value || '$35,078'}
          percentage={27.4}
          isLoss
          color="warning"
        >
          <SalesCardChart label={content.metrics?.[2]?.chartLabel} />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 12, lg: 3 }}>
        <AnalyticsDataCard
          title={content.metrics?.[3]?.title || 'Total Marketing'}
          count={content.metrics?.[3]?.value || '$1,12,083'}
          percentage={70.5}
        >
          <MarketingCardChart label={content.metrics?.[3]?.chartLabel} />
        </AnalyticsDataCard>
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.trend?.title || 'Income Overview'}</Typography>
          </Grid>
        </Grid>
        <IncomeOverviewCard content={content.trend} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <PageViews content={content.topLines} />
      </Grid>
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.table?.title || 'Recent Orders'}</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleOrderMenuClick}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              anchorEl={orderMenuAnchor}
              onClose={handleOrderMenuClose}
              open={Boolean(orderMenuAnchor)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {(content.table?.actions || ['Export as CSV', 'Export as Excel', 'Print Table']).map((label) => (
                <MenuItem key={label} onClick={handleOrderMenuClose}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <OrdersList content={content.table} />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.quality?.title || 'Analytics Report'}</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleAnalyticsMenuClick}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              anchorEl={analyticsMenuAnchor}
              open={Boolean(analyticsMenuAnchor)}
              onClose={handleAnalyticsMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {(content.quality?.periods || ['Weekly', 'Monthly', 'Yearly']).map((label) => (
                <MenuItem key={label} onClick={handleAnalyticsMenuClose}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary={content.quality?.rows?.[0]?.label || 'Company Finance Growth'} />
              <Typography variant="h5">{content.quality?.rows?.[0]?.value || '+45.14%'}</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary={content.quality?.rows?.[1]?.label || 'Company Expenses Ratio'} />
              <Typography variant="h5">{content.quality?.rows?.[1]?.value || '0.58%'}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary={content.quality?.rows?.[2]?.label || 'Business Risk Cases'} />
              <Typography variant="h5">{content.quality?.rows?.[2]?.value || 'Low'}</Typography>
            </ListItemButton>
          </List>
          <ReportChart content={content.quality?.chart} />
        </MainCard>
      </Grid>
      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard content={content.cost} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <TransactionHistory content={content.alerts} />
      </Grid>
      {/* row 5 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Stack sx={{ gap: 3 }}>
          <LabelledTasks content={content.goals} />
          <ReaderCard content={content.plan} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <AcquisitionChannels content={content.channels} />
      </Grid>
    </Grid>
  );
}

DashboardAnalytics.propTypes = { content: PropTypes.object };
