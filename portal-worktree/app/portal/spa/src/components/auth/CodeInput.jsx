import PropTypes from 'prop-types';
import { useRef } from 'react';

// material-ui
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import { useIntl } from 'react-intl';

// ==============================|| AUTH - CODE INPUT ||============================== //
//
// One box per digit, with the caret moved for the reader.
//
// Six boxes, not the four Mantis draws. Four digits is ten thousand codes; with
// the rate limits Bước 3 already calls for that is defensible, but six is what
// every mail client and authenticator has taught people to expect, and the cost
// of two more boxes is nothing.
//
// The whole group is one value. Each box is an input only so the caret lands
// where the reader looks — paste anywhere fills the row, Backspace on an empty
// box steps back, and the arrow keys move without editing. A code arrives from
// a phone by copy and paste far more often than it is typed, and a row of boxes
// that only accepts one character per paste is the classic way to break that.
//
// inputMode="numeric" brings up the digits keyboard on a phone; type stays
// "text" so a leading zero survives and the box is never given spinner arrows.

export default function CodeInput({ length = 6, value = '', onChange, onComplete, disabled = false, autoFocus = true }) {
  const intl = useIntl();
  const refs = useRef([]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  const commit = (next) => {
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const focus = (index) => refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const handleChange = (index, raw) => {
    const typed = raw.replace(/\D/g, '');
    if (!typed) return;

    // A paste lands in whichever box had focus, so it fills from there rather
    // than only replacing the one character under the caret.
    const next = (value.slice(0, index) + typed).slice(0, length);
    commit(next);
    focus(next.length >= length ? length - 1 : next.length);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        commit(value.slice(0, index) + value.slice(index + 1));
        return;
      }
      if (index > 0) {
        commit(value.slice(0, index - 1));
        focus(index - 1);
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focus(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focus(index + 1);
    }
  };

  return (
    <Stack direction="row" sx={{ gap: { xs: 0.75, sm: 1 }, justifyContent: 'space-between' }}>
      {digits.map((digit, index) => (
        <OutlinedInput
          key={index}
          inputRef={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          slotProps={{
            input: {
              inputMode: 'numeric',
              autoComplete: index === 0 ? 'one-time-code' : 'off',
              maxLength: length,
              'aria-label': intl.formatMessage({ id: 'code.digitLabel' }, { index: index + 1, total: length }),
              style: { textAlign: 'center', padding: '12px 0' }
            }
          }}
          sx={{ flex: 1, minWidth: 0, '& input': { fontSize: '1.125rem', fontWeight: 600 } }}
        />
      ))}
    </Stack>
  );
}

CodeInput.propTypes = {
  length: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool
};
