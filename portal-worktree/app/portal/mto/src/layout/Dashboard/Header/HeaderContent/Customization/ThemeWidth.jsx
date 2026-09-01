import CardMedia from '@mui/material/CardMedia';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// assets
import defaultLayout from 'assets/images/customization/default.svg';
import containerLayout from 'assets/images/customization/container.svg';

// ==============================|| CUSTOMIZATION - CONTAINER ||============================== //

export default function ThemeWidth() {
  const intl = useIntl();
  const { state, setField } = useConfig();

  const handleContainerChange = (e) => {
    const newValue = e.target.value === 'container';
    setField('container', newValue);
  };

  const activeCardStyle = (theme) => ({
    bgcolor: 'primary.lighter',
    boxShadow: theme.vars.customShadows.primary,
    '&:hover': { boxShadow: theme.vars.customShadows.primary }
  });

  return (
    <RadioGroup
      row
      aria-label="theme-width"
      name="theme-width"
      value={state.container ? 'container' : 'fluid'}
      onChange={handleContainerChange}
    >
      <Grid container spacing={2.5}>
        <Grid>
          <FormControlLabel
            control={<Radio value="fluid" sx={{ display: 'none' }} />}
            label={
              <MainCard
                content={false}
                border={false}
                boxShadow
                sx={(theme) => ({ bgcolor: 'secondary.lighter', p: 1, ...(!state.container && { ...activeCardStyle(theme) }) })}
              >
                <Stack sx={{ gap: 1.25, alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    src={defaultLayout}
                    alt={intl.formatMessage({ id: 'header.customization.previewAlt' })}
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="header.customization.width.fluid" />
                  </Typography>
                </Stack>
              </MainCard>
            }
            sx={{ m: 0 }}
          />
        </Grid>
        <Grid>
          <FormControlLabel
            control={<Radio value="container" sx={{ display: 'none' }} />}
            label={
              <MainCard
                content={false}
                border={false}
                boxShadow
                sx={(theme) => ({ bgcolor: 'secondary.lighter', p: 1, ...(state.container && { ...activeCardStyle(theme) }) })}
              >
                <Stack sx={{ gap: 1.25, alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    src={containerLayout}
                    alt={intl.formatMessage({ id: 'header.customization.previewAlt' })}
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="header.customization.width.container" />
                  </Typography>
                </Stack>
              </MainCard>
            }
            sx={{ m: 0 }}
          />
        </Grid>
      </Grid>
    </RadioGroup>
  );
}
