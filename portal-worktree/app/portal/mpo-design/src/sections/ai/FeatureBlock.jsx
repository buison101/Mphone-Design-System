import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// project imports
import ContainerWrapper from 'components/ContainerWrapper';
import MainCard from 'components/MainCard';
import SectionTypeset from 'components/pages/SectionTypeset';

// assets
import imgdemo1 from 'assets/images/landing/kanban-filter.jpg';
import imgdemo2 from 'assets/images/landing/course-management-system.jpg';
import imgdemo3 from 'assets/images/landing/switch-auth provider.jpg';

// ==============================|| AI PROMPTS - FEATURED CARD DATA ||============================== //

// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getFeatureCaseData = () => [
  {
    id: 1,
    image: imgdemo1,
    title: 'Kanban Activity Filter',
    description: 'Helps users build a dynamic Kanban board with activity tracking, filtering, and task blocking.',
    isPro: true,
    categorySlug: 'apps',
    promptId: 'kanban-activity-filter'
  },
  {
    id: 2,
    image: imgdemo2,
    title: 'Course Management System',
    description: 'This prompt helps users manage course content and structure to align with their business type.',
    isPro: false,
    categorySlug: 'apps',
    promptId: 'course-management-system'
  },
  {
    id: 3,
    image: imgdemo3,
    title: 'Switch Auth Provider',
    description: 'This prompt helps users switch authentication providers to align with their business type.',
    isPro: true,
    categorySlug: 'auth',
    promptId: 'switch-auth-provider'
  }
];

// ==============================|| FEATURE - FEATURE CASE CARD ||============================== //

function FeatureCaseCard({ image, title, description, isPro, animationVariants, categorySlug, promptId }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const variants = animationVariants || {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handlePromptClick = () => {
    if (categorySlug && promptId) {
      navigate(`/prompts-overview/category/${categorySlug}/${promptId}`);
    }
  };

  const isClickable = !!(categorySlug && promptId);

  return (
    <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <MainCard contentSX={{ p: 0, '&:last-child': { pb: 1 } }} sx={{ height: 1, overflow: 'hidden' }}>
        {/* Image Preview Section */}
        <Box onClick={handlePromptClick} sx={{ position: 'relative', pb: 1.5, cursor: isClickable ? 'pointer' : 'default' }}>
          {/* PRO Badge */}
          {isPro && (
            <Chip
              label="PRO"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1,
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 22,
                bgcolor: theme.vars.palette.secondary[800],
                color: 'common.white',
                border: `1px solid ${theme.vars.palette.secondary[600]}`,
                ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.grey[100], border: `1px solid ${theme.vars.palette.grey[200]}` })
              }}
            />
          )}

          {/* Screenshot Image */}
          <CardMedia
            component="img"
            src={image}
            alt={title}
            sx={{ width: 1, height: 1, objectFit: 'cover', borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
          />
        </Box>

        {/* Content Section */}
        <Stack sx={{ px: 2.5, pt: 2, pb: 1.5, gap: 1 }}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1" sx={{ color: 'secondary.main' }}>
            {description}
          </Typography>
        </Stack>
      </MainCard>
    </motion.div>
  );
}

// ==============================|| AI PROMPTS - FEATURED USE CASE BLOCK ||============================== //

export default function FeatureBlock() {
  const featureCaseData = getFeatureCaseData();
  return (
    <ContainerWrapper>
      <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Grid size={12}>
          <Grid container spacing={1} sx={{ mb: 4, textAlign: 'center', justifyContent: 'center' }}>
            <Grid size={{ sm: 10, md: 6 }}>
              <SectionTypeset
                caption="Powering the next generation of AI prompts"
                heading="Featured Use Cases"
                description="Top-rated prompt collections for enterprise workflows."
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {featureCaseData.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCaseCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}

FeatureCaseCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isPro: PropTypes.bool,
  animationVariants: PropTypes.any,
  categorySlug: PropTypes.string,
  promptId: PropTypes.string
};
