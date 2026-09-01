import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import { passwordStrength, STRENGTH_MAX } from 'sections/auth/passwordStrength';

// ==============================|| AUTH - PASSWORD STRENGTH METER ||============================== //
//
// Five segments and a word.
//
// Segments rather than one continuous bar: the score is five discrete points,
// and a smooth bar invites the reader to chase a percentage that does not
// exist. The word is not decoration either — it is what carries the meaning for
// anyone who cannot separate the amber band from the green one, and it is why
// the meter is never the only thing on screen (PasswordRules says what to fix).
//
// Nothing here blocks the submit. The meter reports; the rules list is what the
// form actually validates against.

export default function PasswordStrengthMeter({ value = '' }) {
  const { score, level, color } = passwordStrength(value);

  return (
    <Stack sx={{ gap: 0.75 }} aria-live="polite">
      <Stack direction="row" sx={{ gap: 0.5 }} aria-hidden="true">
        {Array.from({ length: STRENGTH_MAX }, (_, index) => (
          <Box
            key={index}
            sx={{
              flexGrow: 1,
              height: 4,
              borderRadius: 2,
              bgcolor: index < score ? `${color}.main` : 'divider',
              transition: 'background-color 0.2s ease-in-out'
            }}
          />
        ))}
      </Stack>
      <Typography variant="caption" sx={{ color: level ? `${color}.main` : 'text.secondary' }}>
        {level ? <FormattedMessage id={`password.strength.${level}`} /> : <FormattedMessage id="password.strength.empty" />}
      </Typography>
    </Stack>
  );
}

PasswordStrengthMeter.propTypes = { value: PropTypes.string };
