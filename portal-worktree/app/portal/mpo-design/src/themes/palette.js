// third-party
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';
import { ThemeMode } from 'config';
import { extendPaletteWithChannels, withAlpha } from 'utils/colorUtils';

const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];

// ==============================|| GREY COLORS BUILDER ||============================== //

function buildGrey(mode) {
  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  if (mode === ThemeMode.DARK) {
    greyPrimary = ['#000000', '#141414', '#1e1e1e', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#f0f0f0', '#f5f5f5', '#fafafa', '#ffffff'];
    greyConstant = ['#121212', '#d3d8db'];
  }

  return [...greyPrimary, ...greyAscent, ...greyConstant];
}

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export function buildPalette(presetColor = 'default') {
  const useMphoneGreyA = ['mphone1', 'mphone2', 'mphone3', 'mphone4', 'mphone5', 'mphone6'].includes(presetColor);

  // light colors
  const lightColors = { ...presetPalettes, grey: buildGrey(ThemeMode.LIGHT) };
  const lightPaletteColor = ThemeOption(lightColors, presetColor, ThemeMode.LIGHT);

  // dark colors
  const darkColors = { ...presetDarkPalettes, grey: buildGrey(ThemeMode.DARK) };
  const darkPaletteColor = ThemeOption(darkColors, presetColor, ThemeMode.DARK);

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPaletteColor);
  const extendedDark = extendPaletteWithChannels(darkPaletteColor);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight,
      text: {
        primary: useMphoneGreyA ? withAlpha(extendedLight.grey.A800, 0.97) : extendedLight.grey[700],
        secondary: useMphoneGreyA ? withAlpha(extendedLight.grey.A800, 0.63) : extendedLight.grey[500],
        disabled: useMphoneGreyA ? withAlpha(extendedLight.grey.A800, 0.3) : extendedLight.grey[400]
      },
      action: { disabled: extendedLight.grey[300] },
      divider: useMphoneGreyA ? withAlpha(extendedLight.grey.A200, 0.1) : extendedLight.grey[200],
      background: {
        paper: useMphoneGreyA ? extendedLight.grey.A100 : extendedLight.grey[0],
        default: extendedLight.grey.A50
      }
    },
    dark: {
      mode: 'dark',
      ...extendedCommon,
      ...extendedDark,
      text: {
        primary: useMphoneGreyA ? withAlpha(extendedDark.grey.A800, 0.97) : withAlpha(extendedDark.grey[900], 0.87),
        secondary: useMphoneGreyA ? withAlpha(extendedDark.grey.A800, 0.63) : withAlpha(extendedDark.grey[900], 0.45),
        disabled: useMphoneGreyA ? withAlpha(extendedDark.grey.A800, 0.3) : withAlpha(extendedDark.grey[900], 0.1)
      },
      action: { disabled: extendedDark.grey[300] },
      divider: useMphoneGreyA ? withAlpha(extendedDark.grey.A200, 0.2) : withAlpha(extendedDark.grey[900], 0.05),
      background: {
        paper: useMphoneGreyA ? extendedDark.grey.A100 : extendedDark.grey[100],
        default: extendedDark.grey.A50
      }
    }
  };
}
