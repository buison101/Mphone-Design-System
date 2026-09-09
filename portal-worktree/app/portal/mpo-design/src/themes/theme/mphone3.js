// project imports
import { ThemeMode } from 'config';

// ==============================|| PRESET THEME - MPHONE 3 ||============================== //

// Each swatch maps directly to the corresponding primitive level in
// /bang-mau-mphone. Grey A values are role-based surface, divider and text tones.
export default function Mphone3(_, mode) {
  const numericGrey =
    mode === ThemeMode.DARK
      ? ['#000000', '#1C1C1D', '#2C2C2D', '#393A3C', '#46484B', '#616468', '#8B8F94', '#9C9FA3', '#ACAFB2', '#C7C9CB', '#E2E3E4']
      : ['#FFFFFF', '#F1F3F5', '#E4E6E8', '#D0D2D4', '#C5C8CC', '#ABAFB4', '#8A8F95', '#7A7E83', '#6A6D70', '#3A3B3E', '#101112'];
  const greyAColors =
    mode === ThemeMode.DARK
      ? { 50: '#050505', 100: '#1C1C1D', 200: '#535659', 400: '#8B8F94', 700: '#ECECED', 800: '#FFFFFF' }
      : { 50: '#F1F3F5', 100: '#FFFFFF', 200: '#3A3B3E', 400: '#46484A', 700: '#3A3B3E', 800: '#000000' };
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

  let primaryColors = ['#F0F5FB', '#E1EBF7', '#B4CFEA', '#6EB2FF', '#3791FF', '#0071EC', '#0069E0', '#0F60D5', '#113673', '#030E28'];
  let errorColors = ['#FEF5F5', '#FDA49D', '#FB4041', '#E52332', '#2E0405'];
  let warningColors = ['#FEFAEF', '#FACB90', '#FC8F33', '#C25511', '#250D02'];
  let infoColors = ['#DFF3F7', '#95DAE7', '#2CC1D3', '#297F96', '#04151B'];
  let successColors = ['#F3FAF5', '#9FE2AD', '#3EC65D', '#128836', '#021706'];

  if (mode === ThemeMode.DARK) {
    primaryColors = ['#000102', '#020711', '#0D243C', '#004288', '#0064C8', '#1E8AFF', '#379EFF', '#59B3FF', '#A0CEF3', '#D0E6F9'];
    errorColors = ['#140203', '#7E1F20', '#FB4849', '#FC6568', '#FBD0CD'];
    warningColors = ['#140903', '#7F4718', '#FC9439', '#FDA15B', '#FCE1CD'];
    infoColors = ['#040F11', '#1A6670', '#31D0E3', '#5BDAEC', '#D2F3F8'];
    successColors = ['#030F04', '#19672A', '#3CD05D', '#52D86C', '#CFF3D1'];
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
    info: { lighter: infoColors[0], light: infoColors[1], main: infoColors[2], dark: infoColors[3], darker: infoColors[4], contrastText },
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
