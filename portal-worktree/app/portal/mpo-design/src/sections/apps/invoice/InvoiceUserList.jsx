import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import MoreOutlined from '@ant-design/icons/MoreOutlined';

import Avatar1 from 'assets/images/users/avatar-5.png';
import Avatar2 from 'assets/images/users/avatar-6.png';
import Avatar3 from 'assets/images/users/avatar-7.png';
import Avatar4 from 'assets/images/users/avatar-8.png';
import Avatar5 from 'assets/images/users/avatar-9.png';

// ==============================|| INVOICE - DASHBOARD USER LIST ||============================== //

export default function InvoiceUserList() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard
      border={false}
      title="Recent Invoice"
      secondary={
        <>
          <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
            <MoreOutlined style={{ fontSize: '1.15rem' }} />
          </IconButton>
          <Menu
            id="fade-menu"
            slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem>Print</MenuItem>
            <MenuItem>Share</MenuItem>
          </Menu>
        </>
      }
    >
      <Grid container spacing={2.5} sx={{ alignItems: 'center' }}>
        <Grid size={12}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar alt="User 1" src={Avatar1} />
            </Grid>
            <Grid size="grow">
              <Typography variant="subtitle1">
                David Jones -{' '}
                <Typography sx={{ color: 'secondary.main' }} component="span">
                  {' '}
                  #790841
                </Typography>
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>$329.20</Typography>
            </Grid>
            <Grid>
              <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                5 min ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar alt="User 1" src={Avatar2} />
            </Grid>
            <Grid size="grow">
              <Typography variant="subtitle1">
                Jenny Jones -{' '}
                <Typography sx={{ color: 'secondary.main' }} component="span">
                  {' '}
                  #790841
                </Typography>
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>$182.89</Typography>
            </Grid>
            <Grid>
              <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                1 day ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar alt="User 1" src={Avatar3} />
            </Grid>
            <Grid size="grow">
              <Typography variant="subtitle1">
                Harry Ben -{' '}
                <Typography sx={{ color: 'secondary.main' }} component="span">
                  {' '}
                  #790841
                </Typography>
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>3 week ago</Typography>
            </Grid>
            <Grid>
              <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                5 min ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar alt="User 1" src={Avatar4} />
            </Grid>
            <Grid size="grow">
              <Typography variant="subtitle1">
                Jenifer Vintage -{' '}
                <Typography sx={{ color: 'secondary.main' }} component="span">
                  {' '}
                  #790841
                </Typography>
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>$182.89</Typography>
            </Grid>
            <Grid>
              <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                3 week ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar alt="User 1" src={Avatar5} />
            </Grid>
            <Grid size="grow">
              <Typography variant="subtitle1">
                Stebin Ben -{' '}
                <Typography sx={{ color: 'secondary.main' }} component="span">
                  {' '}
                  #790841
                </Typography>
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>$324.00</Typography>
            </Grid>
            <Grid>
              <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                1 month ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Button fullWidth variant="outlined" color="secondary">
            View All
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
}
