import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| REPORT CARD ||============================== //

export default function ReportCard({ primary, secondary, iconPrimary, color }) {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <MainCard>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h4">{primary}</Typography>
          <Typography variant="body1" sx={{ color: 'secondary.main' }}>
            {secondary}
          </Typography>
        </Stack>
        <Typography variant="h2" sx={{ color }}>
          {primaryIcon}
        </Typography>
      </Stack>
    </MainCard>
  );
}

ReportCard.propTypes = { primary: PropTypes.any, secondary: PropTypes.any, iconPrimary: PropTypes.any, color: PropTypes.any };
