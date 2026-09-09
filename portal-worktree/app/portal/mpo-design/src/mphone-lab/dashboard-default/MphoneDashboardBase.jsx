import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'mphone-lab/dashboard-default/MphoneAnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'mphone-lab/dashboard-default/MphoneUniqueVisitorCard';
import SaleReportCard from 'mphone-lab/dashboard-default/MphoneSaleReportCard';
import OrdersTable from 'mphone-lab/dashboard-default/MphoneOrdersTable';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault({ content = {} }) {
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
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">{content.title || 'Dashboard'}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title={content.metrics?.[0] || 'Total Page Views'}
          count="4,42,236"
          percentage={59.3}
          extra="35,000"
          captionPrefix={content.captionPrefix}
          captionSuffix={content.captionSuffix}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title={content.metrics?.[1] || 'Total Users'}
          count="78,250"
          percentage={70.5}
          extra="8,900"
          captionPrefix={content.captionPrefix}
          captionSuffix={content.captionSuffix}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title={content.metrics?.[2] || 'Total Order'}
          count="18,800"
          percentage={27.4}
          isLoss
          color="warning"
          extra="1,943"
          captionPrefix={content.captionPrefix}
          captionSuffix={content.captionSuffix}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title={content.metrics?.[3] || 'Total Sales'}
          count="35,078"
          percentage={27.4}
          isLoss
          color="warning"
          extra="20,395"
          captionPrefix={content.captionPrefix}
          captionSuffix={content.captionSuffix}
        />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard
          title={content.visitorTitle}
          monthLabel={content.month}
          weekLabel={content.week}
          seriesLabels={content.trendSeries}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.incomeTitle || 'Income Overview'}</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {content.weekStatistics || 'This Week Statistics'}
              </Typography>
              <Typography variant="h3">$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.recentTitle || 'Recent Orders'}</Typography>
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
              {(content.exportActions || ['Export as CSV', 'Export as Excel', 'Print Table']).map((label) => (
                <MenuItem key={label} onClick={handleOrderMenuClose}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <OrdersTable content={content.table} />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.analyticsTitle || 'Analytics Report'}</Typography>
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
              {(content.analyticsPeriods || ['Weekly', 'Monthly', 'Yearly']).map((label) => (
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
              <ListItemText primary={content.analyticsRows?.[0] || 'Company Finance Growth'} />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary={content.analyticsRows?.[1] || 'Company Expenses Ratio'} />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary={content.analyticsRows?.[2] || 'Business Risk Cases'} />
              <Typography variant="h5">{content.low || 'Low'}</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>
      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard title={content.salesTitle} periodLabels={content.salesPeriods} chartLabels={content.salesChart} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">{content.transactionTitle || 'Transaction History'}</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                px: 2,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                    78%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{content.transactions?.[0]?.title || 'Order #002434'}</Typography>}
                secondary={content.transactions?.[0]?.time || 'Today, 2:00 AM'}
              />
            </ListItem>
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                    8%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{content.transactions?.[1]?.title || 'Order #984947'}</Typography>}
                secondary={content.transactions?.[1]?.time || '5 August, 1:45 PM'}
              />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                    16%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{content.transactions?.[2]?.title || 'Order #988784'}</Typography>}
                secondary={content.transactions?.[2]?.time || '7 hours ago'}
              />
            </ListItem>
          </List>
        </MainCard>
        <MainCard border={false} sx={{ mt: 2 }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Grid>
                <Stack>
                  <Typography variant="h5" noWrap>
                    {content.supportTitle || 'Help & Support Chat'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'secondary.main' }} noWrap>
                    {content.supportResponse || 'Typical replay within 5 min'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt={content.supportNames?.[0] || 'Remy Sharp'} src={avatar1} />
                  <Avatar alt={content.supportNames?.[1] || 'Travis Howard'} src={avatar2} />
                  <Avatar alt={content.supportNames?.[2] || 'Cindy Baker'} src={avatar3} />
                  <Avatar alt={content.supportNames?.[3] || 'Agnes Walker'} src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained">
              {content.supportAction || 'Need Help?'}
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}

DashboardDefault.propTypes = { content: PropTypes.object };
