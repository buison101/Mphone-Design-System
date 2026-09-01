import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';

// project imports
import { isLowercaseChar, isNumber, isSpecialChar, isUppercaseChar, minLength } from 'utils/password-validation';

// ==============================|| AUTH - PASSWORD RULES ||============================== //
//
// What the password still needs, in words, one line each.
//
// Mantis shows a strength bar and nothing else, which tells a reader that their
// password is "Poor" without telling them what would make it better. The list
// is the half that can actually be acted on, so it is the half the form
// validates against — the meter beside it is only a summary.
//
// Met and unmet are two different icons, not two colours of the same one. This
// list is read at the moment someone is already frustrated, and a green tick
// against a grey tick has to survive being looked at quickly.
//
// The predicates come from utils/password-validation.js, which shipped with the
// template and had never been called. Changing a rule means changing it there,
// not here, so the form and the list cannot drift apart.

export const PASSWORD_RULES = [
  { id: 'length', test: minLength },
  { id: 'lowercase', test: isLowercaseChar },
  { id: 'uppercase', test: isUppercaseChar },
  { id: 'number', test: isNumber },
  { id: 'special', test: isSpecialChar }
];

export function passwordMeetsRules(value) {
  return typeof value === 'string' && value.length > 0 && PASSWORD_RULES.every((rule) => rule.test(value));
}

export default function PasswordRules({ value = '' }) {
  return (
    <Stack component="ul" sx={{ gap: 0.5, listStyle: 'none', m: 0, p: 0 }}>
      {PASSWORD_RULES.map((rule) => {
        const met = value.length > 0 && rule.test(value);
        return (
          <Stack key={rule.id} component="li" direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            {met ? (
              <CheckCircleFilled style={{ fontSize: '0.75rem' }} aria-hidden="true" />
            ) : (
              <MinusCircleOutlined style={{ fontSize: '0.75rem' }} aria-hidden="true" />
            )}
            <Typography variant="caption" sx={{ color: met ? 'success.main' : 'text.secondary' }}>
              <FormattedMessage id={`password.rule.${rule.id}`} />
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

PasswordRules.propTypes = { value: PropTypes.string };
