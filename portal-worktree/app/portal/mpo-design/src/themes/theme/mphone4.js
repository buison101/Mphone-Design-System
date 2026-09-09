// project imports
import { ThemeMode } from 'config';
import Mphone2 from './mphone2';

// ==============================|| PRESET THEME - MPHONE 4 ||============================== //

export default function Mphone4(colors, mode) {
  const mphone2Color = Mphone2(colors, mode);
  const primaryColors =
    mode === ThemeMode.DARK
      ? ['#0B2137', '#002B54', '#003365', '#004288', '#0053A9', '#0064C8', '#0980F2', '#50AEFF', '#A0CEF3', '#CBE4F8']
      : ['#D8E5F4', '#D8E5F4', '#9DC8F8', '#6EB2FF', '#4499FF', '#0071EC', '#0F60D5', '#134AA2', '#12408B', '#12408B'];

  return {
    ...mphone2Color,
    primary: {
      ...mphone2Color.primary,
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9]
    }
  };
}
