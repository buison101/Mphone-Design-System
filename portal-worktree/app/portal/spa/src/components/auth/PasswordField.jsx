import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

// third-party
import { useIntl } from 'react-intl';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ==============================|| AUTH - PASSWORD FIELD ||============================== //
//
// A password input that can be read back. Four screens need one, and each of
// them getting its own reveal button is four chances for the toggle to behave
// differently or lose its label.
//
// The reveal is the one control on these screens that costs nothing on the
// server and helps most: this password is typed on a phone keyboard often
// enough that "wrong password" is usually a typo the reader cannot see.
//
// Visibility is deliberately per-field state rather than lifted: on the reset
// screen the new password and its confirmation are revealed independently,
// which is what makes comparing them by eye worth anything.

export default function PasswordField({ label, value, onChange, name, autoComplete = 'current-password', ...others }) {
  const intl = useIntl();
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      type={visible ? 'text' : 'password'}
      name={name}
      autoComplete={autoComplete}
      label={label}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisible((prev) => !prev)}
                edge="end"
                color="secondary"
                // the label states what the button will do next, not what the
                // field is doing now, which is what a reader acts on
                aria-label={intl.formatMessage({ id: visible ? 'login.hidePassword' : 'login.showPassword' })}
              >
                {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      {...others}
    />
  );
}

PasswordField.propTypes = {
  label: PropTypes.node,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  autoComplete: PropTypes.string
};
