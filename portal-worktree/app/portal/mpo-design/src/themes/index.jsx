import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { viVN } from '@mui/material/locale';
import { viVN as viVNPickers } from '@mui/x-date-pickers/locales';
import CssBaseline from '@mui/material/CssBaseline';

// project imports
import { CSS_VAR_PREFIX, DEFAULT_THEME_MODE, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import CustomShadows from './custom-shadows';
import GlobalStyles from './GlobalStyles';
import componentsOverride from './overrides';
import dateLocaleVi from 'locales-mphone/date-locale-vi';
import { buildPalette } from './palette';
import Typography from './typography';

// ==============================|| DEFAULT THEME - MAIN ||============================== //

export default function ThemeCustomization({ children }) {
  const { state } = useConfig();

  const themeTypography = useMemo(() => {
    const typography = Typography(state.fontFamily);
    // Mantis title-cases button labels with `textTransform: 'capitalize'`, which
    // is the intended look in English. In Vietnamese it is a spelling error:
    // `Tiếp theo` renders as `Tiếp Theo`, `Xác nhận và gửi` as `Xác Nhận Và Gửi`.
    // Measured across all 78 routes, this one line accounts for every
    // wrongly-capitalised Vietnamese label. English keeps the vendor look.
    // §2.5 exception, approved by the product owner 2026-09-02.
    if (state.i18n === 'vi') typography.button = { ...typography.button, textTransform: 'none' };
    return typography;
  }, [state.fontFamily, state.i18n]);

  const palette = useMemo(() => buildPalette(state.presetColor), [state.presetColor]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: state.themeDirection,
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      typography: themeTypography,
      colorSchemes: {
        light: {
          palette: palette.light,
          customShadows: CustomShadows(palette.light, ThemeMode.LIGHT)
        },
        dark: {
          palette: palette.dark,
          customShadows: CustomShadows(palette.dark, ThemeMode.DARK)
        }
      },
      cssVariables: {
        cssVarPrefix: CSS_VAR_PREFIX,
        colorSchemeSelector: 'data-color-scheme'
      }
    }),
    [state.themeDirection, themeTypography, palette]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  // MUI writes some chrome itself and the vendor never passes text for it:
  // `Rows per page:`, the autocomplete empty state, rating labels. MUI ships
  // those translations, so they are merged in rather than re-typed. The
  // vendor's own defaultProps win on every key it sets; `en` keeps MUI's
  // defaults. Assigning themes.components above replaces the object wholesale,
  // which is why this merge has to come after it. See docs/15 §4.7.
  if (state.i18n === 'vi') {
    // Fifteen `LocalizationProvider` call sites, not one of them passing
    // `adapterLocale` or `localeText`, so every picker formats and labels
    // itself in English. LocalizationProvider reads theme defaults under
    // `MuiLocalizationProvider`, which reaches all fifteen without touching one
    // vendor file. The adapter locale is the project's own Vietnamese date
    // vocabulary (`T2`, `Tháng 9`, `SA`/`CH`), not date-fns's stock `vi`;
    // `localeText` is MUI's own translation of the picker chrome. §2.5
    // exception, approved 2026-09-02.
    const localizationProvider = themes.components.MuiLocalizationProvider ?? {};
    const pickerLocaleText = viVNPickers.components.MuiLocalizationProvider.defaultProps.localeText;
    themes.components.MuiLocalizationProvider = {
      ...localizationProvider,
      defaultProps: { adapterLocale: dateLocaleVi, localeText: pickerLocaleText, ...localizationProvider.defaultProps }
    };

    for (const [component, spec] of Object.entries(viVN.components ?? {})) {
      const existing = themes.components[component] ?? {};
      themes.components[component] = {
        ...existing,
        defaultProps: { ...spec.defaultProps, ...existing.defaultProps }
      };
    }
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider disableTransitionOnChange theme={themes} modeStorageKey="theme-mode" defaultMode={DEFAULT_THEME_MODE}>
        <CssBaseline enableColorScheme />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = { children: PropTypes.node };
