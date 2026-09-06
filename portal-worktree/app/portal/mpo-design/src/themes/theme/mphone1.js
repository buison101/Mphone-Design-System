// project imports
import { ThemeMode } from 'config';

// ==============================|| PRESET THEME - MPHONE 1 ||============================== //

export default function Mphone1(_, mode) {
  const numericGrey =
    mode === ThemeMode.DARK
      ? ['#000000', '#0F0F11', '#252527', '#3A3A3C', '#636366', '#AEAEB2', '#BABABF', '#C7C7CC', '#E5E5EA', '#F2F2F7', '#FFFFFF']
      : ['#FCFCFD', '#F6F6F9', '#F4F4F8', '#D1D1D6', '#AEAEB2', '#8E8E93', '#636366', '#48484A', '#2C2C2E', '#1C1C1E', '#000000'];
  const greyAColors =
    mode === ThemeMode.DARK
      ? {
          50: '#0F0F11',
          100: '#1C1C1E',
          200: '#545458',
          400: '#8E8E93',
          700: '#EBEBF5',
          800: '#FFFFFF'
        }
      : {
          50: '#F5F5F9',
          100: '#FCFCFD',
          200: '#3C3C43',
          400: '#48484A',
          700: '#3C3C43',
          800: '#000000'
        };
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

  let primaryColors = ['#EAF4FF', '#E0EFFF', '#B8DAFF', '#80BDFF', '#409CFF', '#278BFF', '#0068D9', '#0056B3', '#00438C', '#003166'];
  let errorColors = ['#FFF2F1', '#FFB4AE', '#FF6254', '#D70015', '#7A0010'];
  let warningColors = ['#FFF8E6', '#FFD28A', '#FFA53C', '#C93400', '#7A2E00'];
  let infoColors = ['#E6F9FC', '#7DDDE8', '#35B4C2', '#007A85', '#004A51'];
  let successColors = ['#EDFAF0', '#A4E8B2', '#58D071', '#248A3D', '#0D4F20'];

  if (mode === ThemeMode.DARK) {
    primaryColors = ['#002650', '#003166', '#00438C', '#0056B3', '#007AFF', '#1E8AFF', '#409CFF', '#80BDFF', '#B8DAFF', '#E0EFFF'];
    errorColors = ['#2C1212', '#5C1A17', '#D43A31', '#FF6961', '#FFB4AE'];
    warningColors = ['#2B200D', '#6B4700', '#D88806', '#FFB340', '#FFD28A'];
    infoColors = ['#0D2529', '#155E66', '#48ACBA', '#7ADBE5', '#B8EEF3'];
    successColors = ['#102A17', '#176B2C', '#2AB64D', '#4CD964', '#A9EFB8'];
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
