import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import { useColorScheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Loadable from 'components/Loadable';
import { ThemeDirection, ThemeMode } from 'config';
import { withAlpha } from 'utils/colorUtils';

const AIPromptsHero = Loadable(lazy(() => import('sections/ai/Hero')));
const FeatureBlock = Loadable(lazy(() => import('sections/ai/FeatureBlock')));
const AutomationSection = Loadable(lazy(() => import('sections/ai/AutomationSection')));
const FreeSamplesSection = Loadable(lazy(() => import('sections/ai/FreeSamplesSection')));
const AgentBlock = Loadable(lazy(() => import('sections/ai/AgentBlock')));
const InformationBlock = Loadable(lazy(() => import('sections/ai/InformationBlock')));
const Workflow = Loadable(lazy(() => import('sections/ai/Workflow')));
const Pricing = Loadable(lazy(() => import('sections/ai/Pricing')));
const ContactBanner = Loadable(lazy(() => import('sections/landing/ContactBanner')));

// ==============================|| AI PROMPTS PAGE ||============================== //

export default function AIPromptsPage() {
  const { colorScheme } = useColorScheme();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // Poll for the element since it may be lazily loaded via Suspense
      const interval = setInterval(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          clearInterval(interval);
          // Clean up the hash from the URL so the same hash can trigger scrolling again
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname);
          }, 800);
        }
      }, 100);
      // Safety timeout to stop polling after 5 seconds
      const timeout = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [hash]);

  return (
    <>
      <Box
        sx={(theme) => ({
          height: { xs: 680, sm: 738, md: 878 },
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          zIndex: -1,
          bgcolor: colorScheme === ThemeMode.DARK ? 'grey.50' : 'grey.800',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 2,
            background:
              theme.direction === ThemeDirection.RTL
                ? {
                    xs: 'radial-gradient(50% 110% at 50% 50%, rgb(0, 0, 0) 25.79%, rgba(67, 67, 67, 0.28) 64.86%)',
                    md: 'radial-gradient(50% 110% at 50% 50%, rgb(0, 0, 0) 25.79%, rgba(67, 67, 67, 0.28) 64.86%)',
                    xl: 'radial-gradient(50% 110% at 50% 50%, rgb(0, 0, 0) 25.79%, rgba(67, 67, 67, 0.28) 64.86%)'
                  }
                : 'radial-gradient(50% 110% at 50% 50%, rgb(0, 0, 0) 25.79%, rgba(67, 67, 67, 0.28) 64.86%)'
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 3,
            background: `radial-gradient(50% 50% at 50% 50%, ${withAlpha(theme.vars.palette.primary.main, 0.25)} 0%, transparent 100%)`
          }
        })}
      />
      <Stack sx={{ gap: { xs: 7.5, sm: 12.5 } }}>
        <Box sx={{ position: 'relative', zIndex: 5 }}>
          <Toolbar />
          <AIPromptsHero />
        </Box>

        <Suspense fallback={null}>
          <FeatureBlock />
        </Suspense>

        <Suspense fallback={null}>
          <AutomationSection />
        </Suspense>

        <Suspense fallback={null}>
          <FreeSamplesSection />
        </Suspense>

        <Suspense fallback={null}>
          <AgentBlock />
        </Suspense>

        <Suspense fallback={null}>
          <InformationBlock />
        </Suspense>

        <Suspense fallback={null}>
          <Workflow />
        </Suspense>

        <Suspense fallback={null}>
          <Pricing />
        </Suspense>

        <Suspense fallback={null}>
          <Box sx={{ mb: { xs: -7.5, sm: -12 } }}>
            <ContactBanner />
          </Box>
        </Suspense>
      </Stack>
    </>
  );
}
