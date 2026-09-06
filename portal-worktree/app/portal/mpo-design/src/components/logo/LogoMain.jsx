import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';

import mphoneLogo from 'assets/images/icon-logo-mphone.svg';

// ==============================|| MPHONE LOGO SVG ||============================== //

export default function LogoMain({ reverse }) {
  const theme = useTheme();

  return (
    <svg
      width="135"
      height="28"
      viewBox="0 0 1841.98 381.79"
      role="img"
      aria-label="Mphone"
      style={{
        '--mphone-logo-icon': theme.vars.palette.primary.main,
        '--mphone-logo-text': reverse ? theme.vars.palette.common.white : theme.vars.palette.grey[500]
      }}
    >
      <use href={`${mphoneLogo}#Layer_1`} />
    </svg>
  );
}

LogoMain.propTypes = { reverse: PropTypes.bool };
