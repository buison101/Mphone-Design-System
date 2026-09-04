import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SwapOutlined from '@ant-design/icons/SwapOutlined';

const areas = [
  { id: 'mantis', to: '/dashboard/analytics' },
  { id: 'mphone', to: '/mphone' }
];

function AreaLabel({ area }) {
  return area === 'mantis' ? <>Mantis UI</> : <>Mphone Lab</>;
}

export default function PortalAreaSwitcher({ compact = false }) {
  const { pathname } = useLocation();
  const activeArea = pathname === '/mphone' || pathname.startsWith('/mphone/') ? 'mphone' : 'mantis';
  const visibleAreas = compact ? areas.filter((area) => area.id !== activeArea) : areas;

  return (
    <Stack
      component="nav"
      direction="row"
      aria-label="Switch between Mantis UI and Mphone Lab"
      sx={{
        flexShrink: 0,
        gap: 0.25,
        p: 0.25,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.default'
      }}
    >
      {visibleAreas.map((area) => {
        const isActive = area.id === activeArea;

        return (
          <ButtonBase
            key={area.id}
            component={Link}
            to={area.to}
            aria-current={isActive ? 'page' : undefined}
            sx={{
              minHeight: 30,
              px: { xs: 1, sm: 1.25 },
              borderRadius: 0.75,
              color: isActive ? 'primary.main' : 'text.secondary',
              bgcolor: isActive ? 'primary.lighter' : 'transparent',
              '&:hover': { bgcolor: isActive ? 'primary.lighter' : 'action.hover' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 1 }
            }}
          >
            {compact && <SwapOutlined style={{ marginRight: 6 }} />}
            <Typography component="span" variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              <AreaLabel area={area.id} />
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}

PortalAreaSwitcher.propTypes = { compact: PropTypes.bool };
AreaLabel.propTypes = { area: PropTypes.oneOf(['mantis', 'mphone']).isRequired };
