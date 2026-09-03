// project imports
import { ThemeMode } from 'config';

// ==============================|| PRESET THEME - MPHONE 1 ||============================== //

export default function Mphone1(colors, mode) {
  const { grey } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };
  const contrastText = '#fff';

  let primaryColors = ['#EAF5FF', '#D6EBFF', '#ADD7FF', '#7ABEFF', '#339CFF', '#0071E3', '#0058B0', '#00458A', '#003366', '#002244'];
  let errorColors = ['#FFF2F1', '#FFB4AE', '#FF3B30', '#D70015', '#7A0010'];
  let warningColors = ['#FFF8E6', '#FFD28A', '#FF9500', '#C93400', '#7A2E00'];
  let infoColors = ['#E8F8FC', '#7DD7EE', '#32ADE6', '#087EA4', '#04546F'];
  let successColors = ['#EDFAF0', '#A4E8B2', '#34C759', '#248A3D', '#0D4F20'];

  if (mode === ThemeMode.DARK) {
    primaryColors = ['#071B2E', '#092846', '#0A3963', '#0A4D87', '#0965B5', '#0A84FF', '#409CFF', '#64B5FF', '#8CC8FF', '#B8DDFF'];
    errorColors = ['#2C1212', '#5C1A17', '#FF453A', '#FF6961', '#FFB4AE'];
    warningColors = ['#2B200D', '#6B4700', '#FF9F0A', '#FFB340', '#FFD28A'];
    infoColors = ['#0B2028', '#164959', '#32A6CC', '#67C4DF', '#A6E1F0'];
    successColors = ['#102A17', '#176B2C', '#30D158', '#4CD964', '#A9EFB8'];
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
      lighter: greyColors[100],
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
