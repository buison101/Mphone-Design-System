import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import Avatar from 'components/@extended/Avatar';
import ContainerWrapper from 'components/ContainerWrapper';
import PromptExplorer from 'components/pages/PromptExplorer';
import { withAlpha } from 'utils/colorUtils';
import getColors from 'utils/getColors';

// assets
import AimOutlined from '@ant-design/icons/AimOutlined';
import SlidersOutlined from '@ant-design/icons/SlidersOutlined';
import ThunderboltOutlined from '@ant-design/icons/ThunderboltOutlined';

// ==============================|| FEATURE ITEM ||============================== //

function FeatureItem({ icon, iconColor = 'primary', title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 30, delay }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 1.5, alignItems: { xs: 'center', md: 'flex-start' } }}>
        <Avatar
          variant="rounded"
          type="combined"
          color={iconColor}
          sx={(theme) => ({ bgcolor: withAlpha(getColors(theme, iconColor).darker, 0.15) })}
        >
          {icon}
        </Avatar>
        <Stack sx={{ gap: 0.25, alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'grey.400', textAlign: { xs: 'center', md: 'left' } }}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </motion.div>
  );
}

// ==============================|| LANDING - CODE SECTION ||============================== //

export default function CodeSection() {
  const theme = useTheme();

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'secondary.800',
        py: 5,
        ...theme.applyStyles('dark', { bgcolor: 'grey.100' })
      })}
    >
      <ContainerWrapper>
        <Grid
          container
          spacing={2}
          sx={{ pt: { md: 0, xs: 8 }, pb: { md: 0, xs: 5 }, alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <Grid
              container
              spacing={2}
              sx={(theme) => ({
                pr: { xs: 0, md: 4 },
                [theme.breakpoints.down('md')]: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' }
              })}
            >
              {/* title */}
              <Grid size={12}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    TECHNICAL DEEP DIVE
                  </Typography>
                </motion.div>
              </Grid>

              {/* Heading */}
              <Grid size={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.1 }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'common.white',
                      fontSize: { xs: '1.825rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 700,
                      lineHeight: { xs: 1.3, sm: 1.3, md: 1.3 }
                    }}
                  >
                    <span>Global context via </span>
                    <Box component="span" sx={{ color: 'primary.main' }}>
                      <span>Agents.md</span>
                    </Box>
                  </Typography>
                </motion.div>
              </Grid>

              {/* Description */}
              <Grid size={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'secondary.light',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      fontWeight: 400,
                      lineHeight: { xs: 1.4, md: 1.4 }
                    }}
                  >
                    Don&apos;t repeat yourself. Define your project&apos;s soul in a single{' '}
                    <Box
                      component="span"
                      sx={{
                        color: 'white',
                        bgcolor: withAlpha('#ffffff', 0.1),
                        p: 0.25,
                        borderRadius: 0.5,
                        fontFamily: 'monospace',
                        border: '1px solid',
                        borderColor: withAlpha('#ffffff', 0.1)
                      }}
                    >
                      Agents.md
                    </Box>{' '}
                    file and let Mantis handle the context window management automatically.
                  </Typography>
                </motion.div>
              </Grid>

              {/* Feature List */}
              <Grid size={12} sx={{ mt: { xs: 5, md: 2 } }}>
                <Stack
                  direction={{ xs: 'row', md: 'column' }}
                  divider={
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'block', md: 'none' }, borderColor: 'grey.700' }} />
                  }
                  sx={{ gap: 2, width: 1, justifyContent: { xs: 'space-around', md: 'flex-start' } }}
                >
                  <FeatureItem
                    icon={<ThunderboltOutlined style={{ fontSize: '1rem' }} />}
                    title="Auto-context injection"
                    description="Pre-load your tech stack rules into every agent session."
                    delay={0.3}
                  />
                  <FeatureItem
                    icon={<AimOutlined style={{ fontSize: '1rem' }} />}
                    iconColor="warning"
                    title="Role Definition"
                    description='Assign strict person like "Senior React Engineer" globally.'
                    delay={0.4}
                  />
                  <FeatureItem
                    icon={<SlidersOutlined style={{ fontSize: '1rem' }} />}
                    iconColor="info"
                    title="Directory Guards"
                    description="Enforce architectural boundaries across folders."
                    delay={0.5}
                  />
                </Stack>
              </Grid>

              {/* CTA Buttons */}
              <Grid sx={{ mt: 4 }} size={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
                >
                  <Stack direction={{ xs: 'row', sm: 'row' }} sx={{ gap: 2, width: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <AnimateButton>
                      <Button
                        component={RouterLink}
                        to="/prompts-overview/free"
                        target="_blank"
                        color="secondary"
                        variant="outlined"
                        sx={{
                          '&:hover': {
                            color: 'grey.100',
                            borderColor: 'grey.100',
                            ...theme.applyStyles('dark', { color: 'grey.900', borderColor: 'grey.900' })
                          }
                        }}
                      >
                        Free Prompts
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button component={RouterLink} to="/prompts-overview/pro" target="_blank" size="medium" variant="contained">
                        View Pro Prompts
                      </Button>
                    </AnimateButton>
                  </Stack>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Content - Floating Cards */}
          <Grid
            size={{ xs: 12, md: 6, lg: 7 }}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}
          >
            <PromptExplorer />
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Box>
  );
}

FeatureItem.propTypes = {
  icon: PropTypes.node,
  iconColor: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  delay: PropTypes.number
};
