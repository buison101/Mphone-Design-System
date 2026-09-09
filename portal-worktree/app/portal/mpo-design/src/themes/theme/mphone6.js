// project imports
import { ThemeMode } from 'config';

// ==============================|| PRESET THEME - MPHONE 6 ||============================== //

// Independent Mphone palette:
// - Mphone 3 brand blue
// - Mphone 2 semantic colors
// - Mphone grey primitives selected by visual role and contrast, not token number
export default function Mphone6(_, mode) {
  const numericGrey =
    mode === ThemeMode.DARK
      ? ['#000000', '#121213', '#252526', '#393A3C', '#616468', '#ACAFB2', '#B9BCBE', '#C7C9CB', '#E5E6E7', '#F1F1F2', '#FFFFFF']
      : ['#FCFCFD', '#F4F6F7', '#F1F3F5', '#D0D2D4', '#ABAFB4', '#8A8F95', '#5D6063', '#46484A', '#2D2E30', '#1C1D1E', '#000000'];
  const greyAColors =
    mode === ThemeMode.DARK
      ? { 50: '#121213', 100: '#1C1C1D', 200: '#535659', 400: '#8B8F94', 700: '#ECECED', 800: '#FFFFFF' }
      : { 50: '#F4F6F7', 100: '#FCFCFD', 200: '#3A3B3E', 400: '#46484A', 700: '#3A3B3E', 800: '#000000' };
  const greyColors = {
    0: numericGrey[0],
    50: numericGrey[1],
    100: numericGrey[2],
    200: numericGrey[3],
    300: numericGrey[4],
    400: numericGrey[5],
    500: numericGrey[6],
    600: numericGrey[7],
    700: numericGrey[8],
    800: numericGrey[9],
    900: numericGrey[10],
    A50: greyAColors[50],
    A100: greyAColors[100],
    A200: greyAColors[200],
    A400: greyAColors[400],
    A700: greyAColors[700],
    A800: greyAColors[800]
  };
  const contrastText = '#fff';

  let primaryColors = ['#E6F0FF', '#D7E7FF', '#B5D1F7', '#8AB8F2', '#5798ED', '#1A6FE8', '#135BD1', '#0D45AF', '#08317F', '#041D50'];
  let errorColors = ['#FFE7D3', '#FF805D', '#FF4528', '#DB271D', '#930C1A'];
  let warningColors = ['#FFF6D0', '#FFCF4E', '#FFB814', '#DB970E', '#935B06'];
  let infoColors = ['#DCF0FF', '#7EB9FF', '#549BFF', '#3D78DB', '#1A3D93'];
  let successColors = ['#EAFCD4', '#8AE65B', '#58D62A', '#3DB81E', '#137C0D'];

  if (mode === ThemeMode.DARK) {
    primaryColors = ['#142846', '#17385F', '#1C4B7E', '#2461A4', '#347BD1', '#4A96F7', '#6BAAF8', '#92C3FA', '#BCD9FC', '#E4F0FF'];
    errorColors = ['#341D1B', '#B03725', '#DD3F27', '#E9664D', '#FBD6C9'];
    warningColors = ['#342A1A', '#83631A', '#DDA116', '#E9BA3A', '#FBEFB5'];
    infoColors = ['#202734', '#416FB0', '#4C88DD', '#74A8E9', '#ECF4FB'];
    successColors = ['#1F2E1C', '#449626', '#4FBA28', '#74CF4D', '#E3FBD2'];
  }

  return {
    primary: {
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9],
      contrastText
    },
    secondary: {
      lighter: greyColors[50],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500],
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0]
    },
    error: {
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
      contrastText: greyColors[100]
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText
    },
    success: {
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText
    },
    grey: greyColors
  };
}
