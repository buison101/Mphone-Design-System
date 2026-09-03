import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateCard from 'components/@extended/AnimateCard';
import MainCard from 'components/MainCard';

// assets
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';

// ==============================|| CATEGORY - CATEGORY CARD ||============================== //

export default function CategoryCard({ id, image, title, description, promptsNumber, items, animationVariants }) {
  const navigate = useNavigate();
  const { filter } = useParams();
  const variants = animationVariants || { hidden: { opacity: 0, translateY: 100 }, visible: { opacity: 1, translateY: 0 } };
  const filterPrefix = filter && ['free', 'pro'].includes(filter) ? `/${filter}` : '';

  const handleCardClick = () => {
    if (items && items.length > 0) {
      const firstItem = items[0];
      navigate(`/prompts-overview${filterPrefix}/category/${id}/${firstItem.id}`);
    }
  };

  return (
    <AnimateCard variants={variants}>
      <MainCard sx={{ height: 1, cursor: 'pointer' }} onClick={handleCardClick}>
        <Stack sx={{ gap: 1.25, width: 1, alignItems: 'flex-start' }}>
          <CardMedia component="img" sx={{ width: 'auto' }} src={image} alt="prompts" />
          <Typography variant="h5" sx={{ fontWeight: 500, mt: 1.25 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'secondary.main' }}>
            {description}
          </Typography>
        </Stack>
        <Divider sx={{ pt: 3, width: '100%' }} />
        <Stack direction="row" sx={{ pt: 3, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {promptsNumber} prompts
          </Typography>
          <ArrowRightOutlined />
        </Stack>
      </MainCard>
    </AnimateCard>
  );
}

CategoryCard.propTypes = {
  id: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  promptsNumber: PropTypes.number,
  items: PropTypes.array,
  animationVariants: PropTypes.any
};
