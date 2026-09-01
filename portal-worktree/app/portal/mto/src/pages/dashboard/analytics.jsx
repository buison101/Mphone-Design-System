import { useState } from 'react';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

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

import WelcomeBanner from 'sections/dashboard/analytics/WelcomeBanner';
import MarketingCardChart from 'sections/dashboard/analytics/MarketingCardChart';
import OrdersCardChart from 'sections/dashboard/analytics/OrdersCardChart';
import OrdersList from 'sections/dashboard/analytics/OrdersList';
import PageViews from 'sections/dashboard/analytics/PageViews';
import ReportChart from 'sections/dashboard/analytics/ReportChart';
import SalesCardChart from 'sections/dashboard/analytics/SalesCardChart';
import TransactionHistory from 'sections/dashboard/analytics/TransactionHistory';
import UsersCardChart from 'sections/dashboard/analytics/UsersCardChart';
import LabelledTasks from 'sections/dashboard/analytics/LabelledTasks';
import ReaderCard from 'sections/dashboard/analytics/ReaderCard';
import AcquisitionChannels from 'sections/dashboard/analytics/AcquisitionChannels';
import IncomeOverviewCard from 'sections/dashboard/analytics/IncomeOverviewCard';
import SaleReportCard from 'sections/dashboard/analytics/SaleReportCard';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

export default function DashboardAnalytics() {
  const intl = useIntl();
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
        <WelcomeBanner />
      </Grid>
      {/* row 1 */}
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard title={intl.formatMessage({ id: 'dashboard.kpi.users' })} count="78,250" percentage={70.5}>
          <UsersCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard title={intl.formatMessage({ id: 'dashboard.kpi.orders' })} count="18,800" percentage={27.4} isLoss color="error">
          <OrdersCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={intl.formatMessage({ id: 'dashboard.kpi.sales' })}
          count="$35,078"
          percentage={27.4}
          isLoss
          color="warning"
        >
          <SalesCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 12, lg: 3 }}>
        <AnalyticsDataCard title={intl.formatMessage({ id: 'dashboard.kpi.marketing' })} count="$1,12,083" percentage={70.5}>
          <MarketingCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">
              <FormattedMessage id="dashboard.incomeOverview" />
            </Typography>
          </Grid>
        </Grid>
        <IncomeOverviewCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <PageViews />
      </Grid>
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">
              <FormattedMessage id="dashboard.recentOrders" />
            </Typography>
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
              <MenuItem onClick={handleOrderMenuClose}>
                <FormattedMessage id="common.export.csv" />
              </MenuItem>
              <MenuItem onClick={handleOrderMenuClose}>
                <FormattedMessage id="common.export.excel" />
              </MenuItem>
              <MenuItem onClick={handleOrderMenuClose}>
                <FormattedMessage id="common.export.print" />
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersList />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">
              <FormattedMessage id="dashboard.analyticsReport" />
            </Typography>
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
              <MenuItem onClick={handleAnalyticsMenuClose}>
                <FormattedMessage id="common.period.weekly" />
              </MenuItem>
              <MenuItem onClick={handleAnalyticsMenuClose}>
                <FormattedMessage id="common.period.monthly" />
              </MenuItem>
              <MenuItem onClick={handleAnalyticsMenuClose}>
                <FormattedMessage id="common.period.yearly" />
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary={<FormattedMessage id="dashboard.report.financeGrowth" />} />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary={<FormattedMessage id="dashboard.report.expensesRatio" />} />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary={<FormattedMessage id="dashboard.report.riskCases" />} />
              <Typography variant="h5">
                <FormattedMessage id="dashboard.report.low" />
              </Typography>
            </ListItemButton>
          </List>
          <ReportChart />
        </MainCard>
      </Grid>
      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <TransactionHistory />
      </Grid>
      {/* row 5 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Stack sx={{ gap: 3 }}>
          <LabelledTasks />
          <ReaderCard />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <AcquisitionChannels />
      </Grid>
    </Grid>
  );
}
