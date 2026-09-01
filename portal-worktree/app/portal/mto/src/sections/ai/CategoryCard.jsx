import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateCard from 'components/@extended/AnimateCard';
import MainCard from 'components/MainCard';

// ==============================|| CATEGORY - CATEGORY CARD ||============================== //

export default function CategoryCard({ image, title, description, promptsNumber, freePrompts, folderName, items, animationVariants }) {
  const navigate = useNavigate();
  const { filter } = useParams();
  const variants = animationVariants || {
    hidden: { opacity: 0, translateY: 280 },
    visible: { opacity: 1, translateY: 0 }
  };
  const filterPrefix = filter && ['free', 'pro'].includes(filter) ? `/${filter}` : '';

  const handleClick = () => {
    if (items && items.length > 0) {
      const firstItem = items[0];
      navigate(`/prompts-overview${filterPrefix}/category/${folderName}/${firstItem.id}`);
    }
  };

  const handleFreeClick = (e) => {
    e.stopPropagation();
    if (items && items.length > 0) {
      const freeItem = items.find((item) => item.type === 'free') || items[0];
      navigate(`/prompts-overview/free/category/${folderName}/${freeItem.id}`);
    }
  };

  return (
    <AnimateCard variants={variants} style={{ height: '100%' }}>
      <MainCard
        onClick={handleClick}
        contentSX={{ p: 3, display: 'flex', flexDirection: 'column', height: 1 }}
        sx={{ height: 1, position: 'relative', cursor: 'pointer' }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
          <CardMedia component="img" sx={{ width: 'auto' }} src={image} alt="prompts" />
          <Typography variant="h4" sx={{ fontWeight: 600, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
            {promptsNumber}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              prompts
            </Typography>
          </Typography>
        </Stack>
        <Stack sx={{ mt: 1.25, gap: 1.25, flexGrow: 1, width: 1, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body1" sx={{ color: 'secondary.main' }}>
              {description}
            </Typography>
          </Box>
          {freePrompts && (
            <Chip
              label={freePrompts}
              variant="combined"
              color="success"
              size="small"
              onClick={handleFreeClick}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Stack>
      </MainCard>
    </AnimateCard>
  );
}

CategoryCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  promptsNumber: PropTypes.number,
  freePrompts: PropTypes.string,
  folderName: PropTypes.string,
  items: PropTypes.array,
  animationVariants: PropTypes.any
};
