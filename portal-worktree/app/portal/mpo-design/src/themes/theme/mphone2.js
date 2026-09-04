// project imports
import Mphone1 from './mphone1';
import Theme1 from './theme1';

// ==============================|| PRESET THEME - MPHONE 2 ||============================== //

export default function Mphone2(colors, mode) {
  const mphoneNeutral = Mphone1(colors, mode);
  const theme1Color = Theme1(colors, mode);

  return {
    ...mphoneNeutral,
    primary: theme1Color.primary,
    error: theme1Color.error,
    warning: theme1Color.warning,
    info: theme1Color.info,
    success: theme1Color.success
  };
}
