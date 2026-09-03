import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project imports
import ContainerWrapper from 'components/ContainerWrapper';
import MainCard from 'components/MainCard';
import SectionTypeset from 'components/pages/SectionTypeset';
import { ThemeDirection } from 'config';
import { withAlpha } from 'utils/colorUtils';
import SyntaxHighlight from 'utils/SyntaxHighlight';

// assets
import BulbFilled from '@ant-design/icons/BulbFilled';
import SettingFilled from '@ant-design/icons/SettingFilled';
import Avatar from 'components/@extended/Avatar';
import getColors from 'utils/getColors';

const codeString = `# Mantis React JavaScript Admin Template - Complete AI Instructions

## Role & Context
You are a 'Frontend Template Architect'. Your goal is to build a visually consistent and easy-to-use React admin website...

## Project Overview
 - Mantis is a Material-UI-based admin dashboard template with two variants:
  1. full-version (/full-version): All features, components, and integrations
  2. seed (/seed): Minimal scaffold for custom development
  ...

## Tech Stack
- **Framework**: React (Functional Components)
`;

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

// ==============================|| FLOATING CARD ||============================== //

function FloatingCard({ title, description, icon, color, sx, delay = 0 }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: delay
      }}
      style={{ position: 'absolute', zIndex: 1, ...sx }}
    >
      <MainCard
        content={false}
        sx={{
          width: 280,
          bgcolor: withAlpha(theme.palette.secondary.darker, 0.85),
          border: `1px solid ${withAlpha(theme.vars.palette.common.white, 0.1)}`,
          p: 2,
          boxShadow: theme.customShadows.z1
        }}
      >
        <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start' }}>
          <Stack
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: withAlpha(theme.vars.palette[color].main, 0.15),
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`
            }}
          >
            {icon}
          </Stack>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.vars.palette.grey[500], lineHeight: 1.5 }}>
              {description}
            </Typography>
          </Stack>
        </Stack>
      </MainCard>
    </motion.div>
  );
}

// ==============================|| CODE EDITOR CARD ||============================== //

export default function AgentBlock() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const isRTL = theme.direction === ThemeDirection.RTL;

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.vars.palette.grey[800],
        py: 5,
        ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.grey[100] })
      })}
    >
      <ContainerWrapper>
        <Stack sx={{ gap: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Stack
            sx={{
              gap: 1,
              textAlign: 'center',
              justifyContent: 'center',
              maxWidth: { sm: (10 / 12) * 100 + '%', md: (6 / 12) * 100 + '%' }
            }}
          >
            <SectionTypeset
              caption="Power under the hood"
              heading="Super charged with Agents.md"
              description="Once loaded, your own AI model will automatically index your entire codebase and file structure, making it context aware."
              headingProps={{ sx: { color: 'common.white' } }}
            />
          </Stack>

          <Box sx={{ position: 'relative' }}>
            {/* Left Bottom Card - Reasoning */}
            <FloatingCard
              title="Reasoning"
              description="Advanced logic for complex refactors."
              icon={<BulbFilled style={{ fontSize: 20 }} />}
              color="success"
              sx={{ bottom: 60, ...(downMD && { display: 'none' }), ...(isRTL ? { right: -60 } : { left: -150 }) }}
              delay={0}
            />

            {/* Right Top Card - Context Injection */}
            <FloatingCard
              title="Context Injection"
              description="Agents automatically index your entire repo."
              icon={<SettingFilled style={{ fontSize: 20 }} />}
              color="primary"
              sx={{ top: 100, ...(downMD && { display: 'none' }), ...(isRTL ? { left: -60 } : { right: -190 }) }}
              delay={1.5}
            />

            <MainCard
              content={false}
              sx={{
                bgcolor: withAlpha(theme.vars.palette.grey[700], 0.98),
                width: { xs: 350, sm: 520, lg: 780 },
                borderColor: theme.vars.palette.grey[600],
                backdropFilter: 'blur(20px)',
                boxShadow: `0 25px 50px ${withAlpha(theme.vars.palette.common.black, 0.4)}`,
                borderRadius: 2,
                overflow: 'hidden',
                p: 0,
                '& .MuiCardContent-root': {
                  p: 0
                },
                ...theme.applyStyles('dark', {
                  bgcolor: theme.vars.palette.secondary[100],
                  borderColor: withAlpha(theme.vars.palette.secondary.darker, 0.05)
                })
              }}
            >
              {/* Window Title Bar */}
              <Stack
                direction="row"
                sx={{
                  gap: 0.75,
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  bgcolor: withAlpha(theme.vars.palette.grey[800], 0.6),
                  borderBottom: `1px solid ${withAlpha(theme.vars.palette.grey[600], 0.2)}`,
                  ...theme.applyStyles('dark', {
                    bgcolor: withAlpha(theme.vars.palette.secondary.darker, 0.05),
                    borderColor: withAlpha(theme.vars.palette.secondary.darker, 0.05)
                  })
                }}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.vars.palette.error.main }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.vars.palette.warning.main }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.vars.palette.success.main }} />
                <Typography
                  variant="caption"
                  sx={{ color: theme.vars.palette.grey[400], pl: 1.5, flexGrow: 1, textAlign: 'center', pr: 6 }}
                  noWrap
                >
                  Agent.md
                </Typography>
              </Stack>

              {/* Code content */}
              <Stack
                direction="column"
                sx={{
                  flex: 1,
                  display: 'flex',
                  bgcolor: withAlpha(theme.vars.palette.grey[900], 0.5),
                  overflow: 'hidden',
                  '& pre': {
                    background: 'transparent !important'
                  },
                  ...theme.applyStyles('dark', { bgcolor: withAlpha(theme.vars.palette.grey[100], 0.98) })
                }}
              >
                <SyntaxHighlight language="markdown" wrapLongLines={true} darkStyle>
                  {codeString}
                </SyntaxHighlight>
              </Stack>
            </MainCard>
          </Box>

          <Stack direction="row" sx={{ gap: 6, justifyContent: 'space-around', ...(!downMD && { display: 'none' }) }}>
            <FeatureItem
              title="Reasoning"
              description="Advanced logic for complex refactors."
              icon={<BulbFilled style={{ fontSize: 20 }} />}
              delay={0.3}
              iconColor="success"
            />
            <FeatureItem
              title="Context Injection"
              description="Agents automatically index your entire repo."
              icon={<SettingFilled style={{ fontSize: 20 }} />}
              delay={0.4}
              iconColor="primary"
            />
          </Stack>
        </Stack>
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

FloatingCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'success']),
  sx: PropTypes.any,
  delay: PropTypes.number
};
