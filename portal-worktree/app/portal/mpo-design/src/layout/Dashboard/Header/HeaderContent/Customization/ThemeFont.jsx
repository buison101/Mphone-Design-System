import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

export default function ThemeFont() {
  const { state, setField } = useConfig();

  const handleFontChange = (event) => {
    setField('fontFamily', event.target.value);
  };

  const fonts = [
    {
      id: 'system',
      value: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
      label: 'System'
    },
    {
      id: 'inter',
      value: `'Inter', sans-serif`,
      label: 'Inter'
    },
    {
      id: 'roboto',
      value: `'Roboto', sans-serif`,
      label: 'Roboto'
    },
    {
      id: 'poppins',
      value: `'Poppins', sans-serif`,
      label: 'Poppins'
    },
    {
      id: 'public-sans',
      value: `'Public Sans', sans-serif`,
      label: 'Public Sans'
    }
  ];
  const visibleFonts = fonts.filter(({ id }) => !['poppins', 'public-sans'].includes(id));

  return (
    <RadioGroup row aria-label="theme-font" name="theme-font" value={state.fontFamily} onChange={handleFontChange}>
      <Grid container rowSpacing={2} columnSpacing={2.5}>
        {visibleFonts.map((item, index) => (
          <Grid key={index}>
            <FormControlLabel
              control={<Radio value={item.value} sx={{ display: 'none' }} />}
              label={
                <MainCard
                  content={false}
                  border={false}
                  boxShadow
                  sx={(theme) => ({
                    bgcolor: 'secondary.lighter',
                    p: 1,
                    ...(state.fontFamily === item.value && {
                      bgcolor: 'primary.lighter',
                      boxShadow: theme.vars.customShadows.primary,
                      '&:hover': { boxShadow: theme.vars.customShadows.primary }
                    })
                  })}
                >
                  <Box sx={{ minWidth: 60, bgcolor: 'background.paper', p: 1, '&:hover': { bgcolor: 'background.paper' } }}>
                    <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                      <Typography variant="h5" sx={{ color: 'text.primary', fontFamily: item.value }}>
                        Aa
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  </Box>
                </MainCard>
              }
              sx={{ m: 0 }}
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
}
