import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project imports
import Avatar from 'components/@extended/Avatar';
import ContainerWrapper from 'components/ContainerWrapper';
import MainCard from 'components/MainCard';
import SectionTypeset from 'components/pages/SectionTypeset';

import { withAlpha } from 'utils/colorUtils';

// assets
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CodeOutlined from '@ant-design/icons/CodeOutlined';
import CrownFilled from '@ant-design/icons/CrownFilled';

import imgdemo1 from 'assets/images/landing/default-home-page.jpg';
import imgdemo2 from 'assets/images/landing/global-rebrand.jpg';

// ==============================|| AI PROMPTS - FREE SAMPLES DATA ||============================== //

const freeSamplesData = [
  {
    image: imgdemo1,
    tag: 'Free',
    title: 'Change Home Page',
    description: 'This prompt set the Login page as the default home page (`/`)',
    promptText: 'Please configure the React routing...',
    categorySlug: 'auth',
    promptId: 'set-login-as-default-page-free'
  },
  {
    image: imgdemo2,
    tag: 'Free',
    title: 'Change Branding',
    description: 'The "Global Rebrand" Prompt This prompt completely rebrands the application by ...',
    promptText: 'Your goal is to rebrand this application ...',
    categorySlug: 'core',
    promptId: 'change-branding-free'
  },
  {
    tag: 'Pro',
    title: 'Unlock 50+ Pro Prompts',
    description:
      'Unlocks the complete library of predefined prompts, including advanced prompts designed for handling complex and repetitive work.',
    promptText: 'Includes lifetime updates & support',
    proList: ['Pro Agents.md integration', '8+ prompts categories', 'Custom logic support']
  }
];

// ==============================|| AI PROMPTS - FREE SAMPLES DATA ||============================== //

function FreePromptsCard({ image, title, description, promptText, tag, proList, animationVariants, categorySlug, promptId }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const variants = animationVariants || {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Handler to navigate to prompt details page
  const handlePromptClick = () => {
    if (categorySlug && promptId) {
      navigate(`/prompts-overview/category/${categorySlug}/${promptId}`);
    }
  };

  const isClickable = !!(categorySlug && promptId);

  return (
    <Box sx={{ '&>div': { height: 1 }, height: 1 }}>
      <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <MainCard contentSX={{ p: 0, '&:last-child': { pb: 0 } }} sx={{ height: 1, overflow: 'hidden', '&>div': { height: 1 } }}>
          {tag === 'Free' ? (
            <Box
              onClick={handlePromptClick}
              sx={{
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': isClickable
                  ? { '& img': { transform: 'scale(1.03)' }, '& .prompt-alert': { transform: 'translateY(-1px)', boxShadow: 2 } }
                  : {}
              }}
            >
              <CardMedia
                component="img"
                src={image}
                alt={title}
                sx={{
                  width: 1,
                  height: 1,
                  objectFit: 'cover',
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  transition: 'transform 0.3s ease'
                }}
              />
              <Box sx={{ p: 3 }}>
                <Stack sx={{ gap: 1 }}>
                  <Typography variant="h4">{title}</Typography>
                  <Typography variant="body1" sx={{ color: 'secondary.main' }}>
                    {description}
                  </Typography>
                </Stack>
                <Divider sx={{ pt: 2.5, mb: 2.5, width: 1 }} />
                <Alert
                  variant="border"
                  color="primary"
                  icon={<CodeOutlined />}
                  className="prompt-alert"
                  sx={{
                    transition: 'all 0.2s ease'
                  }}
                >
                  {promptText}
                </Alert>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                position: 'relative',
                height: 1,
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #0a1628 0%, #132f4c 100%)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: 'rgba(58, 130, 246, 0.12)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -40,
                  left: -40,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'rgba(96, 165, 250, 0.08)'
                }
              }}
            >
              <Stack
                sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', height: 1, p: 3, position: 'relative', zIndex: 1 }}
              >
                {/* Badge */}
                <Chip
                  label="PRO ACCESS"
                  color="secondary"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontSize: '0.7rem',
                    mb: 1.5,
                    bgcolor: withAlpha(theme.vars.palette.secondary.main, 0.35)
                  }}
                />

                {/* Icon */}
                <Avatar type="outlined" size="lg" color="primary" sx={{ borderWidth: 2, bgcolor: 'transparent' }}>
                  <CrownFilled style={{ fontSize: 26, color: 'inherit' }} />
                </Avatar>

                {/* Title & Description */}
                <Typography variant="h4" sx={{ color: 'common.white', textAlign: 'center' }}>
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: withAlpha(theme.vars.palette.common.white, 0.65), maxWidth: 280, textAlign: 'center' }}
                >
                  {description}
                </Typography>

                {/* Feature List */}
                <List
                  component="ul"
                  sx={{ width: 1, my: 1.5, p: 0, '& > li': { px: 0, py: 0.75, '& svg': { fill: theme.vars.palette.success.main } } }}
                >
                  {proList?.map((feature, index) => (
                    <ListItem
                      key={index}
                      divider={index < (proList?.length || 0) - 1}
                      sx={{ borderColor: withAlpha(theme.vars.palette.common.white, 0.1) }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckOutlined style={{ color: theme.vars.palette.success.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        slotProps={{ primary: { variant: 'body2', sx: { color: withAlpha(theme.vars.palette.common.white, 0.75) } } }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* CTA */}
                <Button
                  variant="contained"
                  size="large"
                  color="success"
                  endIcon={<ArrowRightOutlined />}
                  component={Link}
                  to="https://mui.com/store/items/mantis-react-admin-dashboard-template/"
                  target="_blank"
                  sx={{ width: 1 }}
                >
                  Get Pro Access
                </Button>
                <Typography variant="caption" sx={{ color: withAlpha(theme.vars.palette.common.white, 0.75) }}>
                  {promptText}
                </Typography>
              </Stack>
            </Box>
          )}
        </MainCard>
      </motion.div>
    </Box>
  );
}

// ==============================|| AI PROMPTS - FREE SAMPLES SECTION ||============================== //

export default function FreeSamplesSection() {
  return (
    <ContainerWrapper>
      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1, justifyContent: 'center' }}>
        <Grid size={12} sx={{ textAlign: 'center', mb: 5 }}>
          <SectionTypeset
            caption="Explore the possibilities"
            heading="Free Samples"
            description="Get a taste of what's possible before upgrading to Pro."
          />
        </Grid>

        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
          {freeSamplesData.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <FreePromptsCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}

FreePromptsCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  promptText: PropTypes.string,
  tag: PropTypes.string,
  proList: PropTypes.array,
  animationVariants: PropTypes.any,
  categorySlug: PropTypes.string,
  promptId: PropTypes.string
};
