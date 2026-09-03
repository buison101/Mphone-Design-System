import PropTypes from 'prop-types';

// material-ui
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateCard from 'components/@extended/AnimateCard';
import MainCard from 'components/MainCard';

// ==============================|| DEMO - CARD ||============================== //

export default function DemoCard({ title, description, action, image, contentSX }) {
  return (
    <AnimateCard variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}>
      <MainCard contentSX={{ p: 3, ...(contentSX || {}) }}>
        <Stack sx={{ gap: 3.25, mt: 2, alignItems: 'flex-start' }}>
          <Stack sx={{ gap: 1.25 }}>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1" sx={{ color: 'secondary.main' }}>
              {description}
            </Typography>
          </Stack>
          {action}
          {image && (
            <Box sx={{ '& img': { mb: -3.75, width: `calc(100% + 28px)`, borderTopLeftRadius: 4 } }}>
              <CardMedia component="img" src={image} alt="feature" />
            </Box>
          )}
        </Stack>
      </MainCard>
    </AnimateCard>
  );
}

DemoCard.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  action: PropTypes.node,
  image: PropTypes.string,
  contentSX: PropTypes.object
};
