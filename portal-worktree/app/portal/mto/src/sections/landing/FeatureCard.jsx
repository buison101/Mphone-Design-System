import PropTypes from 'prop-types';
// material-ui
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateCard from 'components/@extended/AnimateCard';
import MainCard from 'components/MainCard';

// ==============================|| FEATURE - FEATURE CARD ||============================== //

export default function FeatureCard({ image, title, description, animationVariants }) {
  const variants = animationVariants || {
    hidden: { opacity: 0, translateY: 280 },
    visible: { opacity: 1, translateY: 0 }
  };

  return (
    <Box sx={{ '&>div': { height: 1 }, height: 1 }}>
      <AnimateCard variants={variants}>
        <MainCard contentSX={{ p: 3 }} sx={{ height: 1 }}>
          <Stack sx={{ alignItems: 'flex-start', gap: 1.25, width: 1 }}>
            <CardMedia component="img" sx={{ width: 'auto' }} src={image} alt="feature" />
            <Typography variant="h5" sx={{ fontWeight: 500, mt: 1.25 }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'secondary.main' }}>
              {description}
            </Typography>
          </Stack>
        </MainCard>
      </AnimateCard>
    </Box>
  );
}

FeatureCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  animationVariants: PropTypes.any
};
