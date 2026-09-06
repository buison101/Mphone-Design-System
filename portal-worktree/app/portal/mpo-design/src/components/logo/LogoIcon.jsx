import { useTheme } from '@mui/material/styles';

import mphoneLogo from 'assets/images/icon-logo-mphone.svg';

// ==============================|| MPHONE LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 512 337.33"
      role="img"
      aria-label="Mphone"
      style={{ '--mphone-logo-icon': theme.vars.palette.primary.main }}
    >
      <use href={`${mphoneLogo}#Layer_1`} />
    </svg>
  );
}
