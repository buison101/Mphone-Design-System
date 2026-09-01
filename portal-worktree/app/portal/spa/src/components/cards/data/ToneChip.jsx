import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';

// project imports
import { DATA_TONES, toneFillSX } from './dataInk';

// ==============================|| DATA CARDS - TONE CHIP ||============================== //
//
// One filled chip, in Mantis's five fills, with the ink chosen by measurement
// rather than copied. See dataInk.js for the table; the short version is that
// Mantis writes white on all five and three of them measure under 3:1.
//
// The chip always carries a word. Colour is the second signal here, never the
// only one: success #52c41a and warning #faad14 sit 0.3 ΔE apart under
// simulated protanopia, so a reader who cannot separate them still has the
// label to read.

export default function ToneChip({ label, tone = 'primary', size = 'small', ...others }) {
  return <Chip size={size} label={label} sx={toneFillSX(tone)} {...others} />;
}

ToneChip.propTypes = {
  label: PropTypes.node,
  tone: PropTypes.oneOf(DATA_TONES),
  size: PropTypes.oneOf(['small', 'medium']),
  others: PropTypes.any
};
