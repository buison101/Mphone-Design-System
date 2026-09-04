import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

const surfacePaths = {
  overview: '/mphone',
  calls: '/mphone/calls',
  contacts: '/mphone/contacts',
  webphone: '/mphone/webphone',
  appPhone: '/mphone/app-phone',
  analytics: '/mphone/analytics',
  designSystem: '/mphone/design-system'
};

function getSurfaceCopy(surface) {
  const copy = {
    overview: {
      title: 'Overview',
      description: 'A separate workspace for upcoming Mphone product experiences, kept apart from the current Mantis interface library.'
    },
    calls: { title: 'Calls', description: 'Shape the future call overview and call-management experience.' },
    contacts: { title: 'Contacts', description: 'Shape the future customer and business contact experience.' },
    webphone: { title: 'Webphone', description: 'Explore a simulated browser calling experience without connecting to a real PBX.' },
    appPhone: { title: 'App Phone', description: 'Explore the future Mphone mobile experience inside a simulated device frame.' },
    analytics: {
      title: 'Analytics',
      description: 'Explore call trends, service quality, queues, channels, and cost with sample data.'
    },
    designSystem: {
      title: 'Design System',
      description: 'Review the shared foundations, components, patterns, and product guidance.'
    }
  };

  return copy[surface];
}

export default function MphoneLabPage({ surface }) {
  const current = getSurfaceCopy(surface);
  const links = surface === 'overview' ? [{ title: 'Mphone Lab' }] : [{ title: 'Mphone Lab', to: '/mphone' }, { title: current.title }];

  return (
    <>
      <Breadcrumbs custom isFormatted={false} heading={current.title} links={links} />
      <Stack sx={{ gap: 2.5 }}>
        <Alert color="info" severity="info">
          UI Lab prototype using local sample data only. No live Mphone, PBX, or customer-data connection is active.
        </Alert>

        <MainCard>
          <Stack sx={{ gap: 1.5 }}>
            <Box>
              <Chip size="small" color="primary" variant="outlined" label="Upcoming" />
            </Box>
            <Typography variant="h3">{current.title}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
              {current.description}
            </Typography>
          </Stack>
        </MainCard>
      </Stack>
    </>
  );
}

MphoneLabPage.propTypes = { surface: PropTypes.oneOf(Object.keys(surfacePaths)).isRequired };
