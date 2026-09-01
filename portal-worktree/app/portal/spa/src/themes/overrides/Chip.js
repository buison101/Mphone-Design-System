// project imports
import getColors from 'utils/getColors';

const CHIP_COLORS = ['primary', 'secondary', 'error', 'info', 'success', 'warning'];

// ==============================|| CHIP - COLORS ||============================== //

function getColor({ color, theme }) {
  const colors = getColors(theme, color);
  const { dark } = colors;

  return {
    '&.Mui-focusVisible': {
      outline: `2px solid ${dark}`,
      outlineOffset: 2
    }
  };
}

function getColorStyle({ color, theme }) {
  const colors = getColors(theme, color);
  const { light, lighter, main, darker } = colors;

  // The ink is the ramp's darkest step in *both* schemes. Dark mode already did
  // this; light mode wrote `main` on `lighter`, which measures 1.83 on warning,
  // 2.21 on success and 2.97 on error off the rendered page — the light and
  // combined chips were unreadable in one scheme and fine in the other, from one
  // line. No fill or border moves.
  return {
    color: darker,
    backgroundColor: lighter,
    borderColor: light,
    ...theme.applyStyles('dark', { color: darker }),
    '& .MuiChip-deleteIcon': {
      color: main,
      '&:hover': {
        color: light
      }
    }
  };
}

/**
 * Generate color variant styles for a given variant type
 * @param theme - MUI theme object
 * @param variantType - Type of variant ('root' or 'light' or 'combined')
 * @returns Object with color-specific selectors and their styles
 */
function generateColorVariants(theme, variantType) {
  const styleBuilder = variantType === 'root' ? getColor : getColorStyle;

  return CHIP_COLORS.reduce((acc, color) => {
    acc[`&.MuiChip-color${color.charAt(0).toUpperCase() + color.slice(1)}`] = styleBuilder({
      color: color,
      theme
    });
    return acc;
  }, {});
}

// ==============================|| OVERRIDES - CHIP ||============================== //

export default function Chip(theme) {
  const defaultLightChip = getColorStyle({ color: 'secondary', theme });
  const colorVariants = generateColorVariants(theme, 'light');

  return {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:active': {
            boxShadow: 'none'
          },
          ...generateColorVariants(theme, 'root')
        },
        sizeLarge: {
          fontSize: '1rem',
          height: 40
        },
        light: {
          ...defaultLightChip,
          ...colorVariants
        },
        combined: {
          border: '1px solid',
          ...defaultLightChip,
          ...colorVariants
        }
      }
    }
  };
}
