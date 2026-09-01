import CardMedia from '@mui/material/CardMedia';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import { ThemeDirection } from 'config';

//asset
import WelcomeImage from 'assets/images/analytics/welcome-banner.png';
import WelcomeImageArrow from 'assets/images/analytics/welcome-arrow.png';

// ==============================|| ANALYTICS - WELCOME ||============================== //

export default function WelcomeBanner() {
  const intl = useIntl();
  return (
    <MainCard
      border={false}
      sx={(theme) => ({
        background: `linear-gradient(250.38deg, ${theme.vars.palette.primary.lighter} 2.39%, ${theme.vars.palette.primary.light} 34.42%, ${theme.vars.palette.primary.main} 60.95%, ${theme.vars.palette.primary.dark} 84.83%, ${theme.vars.palette.primary.darker} 104.37%)`,
        ...(theme.direction === ThemeDirection.RTL && {
          background: `linear-gradient(60.38deg, ${theme.vars.palette.primary.lighter} 114%, ${theme.vars.palette.primary.light} 34.42%, ${theme.vars.palette.primary.main} 60.95%, ${theme.vars.palette.primary.dark} 84.83%, ${theme.vars.palette.primary.darker} 104.37%)`
        })
      })}
    >
      <Grid container>
        <Grid size={{ md: 6, sm: 6, xs: 12 }}>
          <Stack
            sx={(theme) => ({ gap: 2, padding: 3.4, color: 'background.paper', ...theme.applyStyles('dark', { color: 'text.primary' }) })}
          >
            <Typography variant="h2">
              <FormattedMessage id="dashboard.welcome.title" />
            </Typography>
            <Typography variant="h6">
              <FormattedMessage id="dashboard.welcome.body" />
            </Typography>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                sx={(theme) => ({
                  color: 'background.paper',
                  borderColor: 'background.paper',
                  ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
                  '&:hover': {
                    color: 'background.paper',
                    borderColor: 'background.paper',
                    bgcolor: 'primary.main',
                    ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary', bgcolor: 'primary.dark' })
                  }
                })}
              >
                <FormattedMessage id="dashboard.welcome.action" />
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid sx={{ display: { xs: 'none', sm: 'initial' } }} size={{ sm: 6, xs: 12 }}>
          <Stack sx={{ alignItems: 'flex-end', justifyContent: 'center', position: 'relative', pr: { sm: 3, md: 8 } }}>
            <CardMedia
              component="img"
              src={WelcomeImage}
              alt={intl.formatMessage({ id: 'dashboard.welcome.imageAlt' })}
              sx={{ width: 'auto' }}
            />
            <Box sx={{ position: 'absolute', bottom: 0, right: '10%' }}>
              <CardMedia component="img" src={WelcomeImageArrow} alt={intl.formatMessage({ id: 'dashboard.welcome.arrowAlt' })} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
