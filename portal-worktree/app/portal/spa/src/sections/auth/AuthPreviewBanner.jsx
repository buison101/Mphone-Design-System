import PropTypes from 'prop-types';

// material-ui
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| AUTH - PREVIEW BANNER ||============================== //
//
// Only ever rendered in a preview build. It does two jobs a reviewer needs and a
// customer must never see.
//
// It switches the screen's state. Several of these screens spend most of their
// life in a state that cannot be reached by clicking — a reset link that expired,
// a verification still in flight — and those are exactly the states worth
// reviewing, because they are the ones nobody remembers to design.
//
// It carries a way back. These routes render outside the portal shell, so once a
// reviewer is here the browser's back button is the only other exit.

export default function AuthPreviewBanner({ states = [], value, onChange }) {
  const intl = useIntl();

  return (
    <Alert severity="info" square sx={{ borderRadius: 0 }}>
      <AlertTitle sx={{ mb: 0.25 }}>
        <FormattedMessage id="authPreview.title" />
      </AlertTitle>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2">
          <FormattedMessage id="authPreview.detail" />
        </Typography>

        {states.length > 1 && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={value}
            onChange={(event, next) => next && onChange?.(next)}
            aria-label={intl.formatMessage({ id: 'authPreview.stateLabel' })}
          >
            {states.map((state) => (
              <ToggleButton key={state.value} value={state.value} sx={{ textTransform: 'none', py: 0.25 }}>
                {state.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}

        <Link component={RouterLink} to={APP_DEFAULT_PATH} variant="body2">
          <FormattedMessage id="login.preview.back" />
        </Link>
      </Stack>
    </Alert>
  );
}

AuthPreviewBanner.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.node })),
  value: PropTypes.string,
  onChange: PropTypes.func
};
