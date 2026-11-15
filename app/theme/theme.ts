import { extendTheme, StyleFunctionProps, ThemeConfig as ChakraThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { themeConfig, ThemeConfig } from "./themeConfig";
import { generateColorScale } from "./colorUtils";
import { getSemanticTokens } from "./tokens";

const bodyFontStack =
  "var(--font-body), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const headingFontStack =
  "var(--font-heading), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
};

/**
 * Creates the Chakra UI theme extended with brand colors from themeConfig
 * and semantic design tokens for light and dark modes.
 */
export function createAppTheme(config: ThemeConfig = themeConfig) {
  const brandColors = config.colors;
  const brandScale = generateColorScale(brandColors.primary);
  const secondaryScale = generateColorScale(brandColors.secondary);
  const accentScale = generateColorScale(brandColors.accent);
  const tokens = getSemanticTokens(brandColors);

  const chakraConfig: ChakraThemeConfig = {
    initialColorMode: "system",
    useSystemColorMode: true,
  };

  const colors = {
    // Primary brand scale
    brand: brandScale,
    primary: brandScale,

    // Secondary brand scale
    secondaryBrand: secondaryScale,
    secondary: secondaryScale,

    // Accent brand scale
    accentBrand: accentScale,
    accent: accentScale,

    // Custom compatibility
    custom: {
      light: {
        primary: brandColors.primary,
        secondary: brandColors.secondary,
      },
      dark: {
        primary: brandColors.primary,
        secondary: brandColors.secondary,
      },
    },
  };

  const semanticTokens = {
    colors: {
      // Primary & Secondary Brand Tokens
      "brand.primary": {
        default: tokens.light.primary,
        _dark: tokens.dark.primary,
      },
      "brand.secondary": {
        default: tokens.light.secondary,
        _dark: tokens.dark.secondary,
      },
      "brand.accent": {
        default: tokens.light.accent,
        _dark: tokens.dark.accent,
      },

      // Surfaces & Backgrounds
      "app.bg": {
        default: tokens.light.bg,
        _dark: tokens.dark.bg,
      },
      "app.surface": {
        default: tokens.light.surface,
        _dark: tokens.dark.surface,
      },
      "app.surfaceElevated": {
        default: tokens.light.surfaceElevated,
        _dark: tokens.dark.surfaceElevated,
      },
      "app.surfaceAlt": {
        default: tokens.light.surfaceAlt,
        _dark: tokens.dark.surfaceAlt,
      },
      "app.surfaceSoft": {
        default: tokens.light.surfaceSoft,
        _dark: tokens.dark.surfaceSoft,
      },

      // Text
      "app.text": {
        default: tokens.light.textPrimary,
        _dark: tokens.dark.textPrimary,
      },
      "app.textSecondary": {
        default: tokens.light.textSecondary,
        _dark: tokens.dark.textSecondary,
      },
      "app.textMuted": {
        default: tokens.light.textMuted,
        _dark: tokens.dark.textMuted,
      },

      // Borders
      "app.border": {
        default: tokens.light.border,
        _dark: tokens.dark.border,
      },
      "app.borderStrong": {
        default: tokens.light.borderStrong,
        _dark: tokens.dark.borderStrong,
      },

      // Inputs
      "app.inputBg": {
        default: tokens.light.inputBg,
        _dark: tokens.dark.inputBg,
      },
    },
  };

  const components = {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "10px",
      },
      variants: {
        solid: (props: StyleFunctionProps) => {
          if (!props.colorScheme || props.colorScheme === "brand" || props.colorScheme === "primary") {
            return {
              bg: "brand.500",
              color: "white",
              _hover: {
                bg: "brand.600",
                _disabled: {
                  bg: "brand.500",
                },
              },
              _active: {
                bg: "brand.700",
              },
            };
          }
          return {};
        },
        ghost: (props: StyleFunctionProps) => ({
          _hover: {
            bg: mode("blackAlpha.50", "whiteAlpha.100")(props),
          },
        }),
        outline: (props: StyleFunctionProps) => {
          if (!props.colorScheme || props.colorScheme === "brand" || props.colorScheme === "primary") {
            return {
              borderColor: "brand.500",
              color: mode("brand.500", "brand.300")(props),
              _hover: {
                bg: mode("brand.50", "whiteAlpha.100")(props),
              },
            };
          }
          return {};
        },
      },
    },
    Card: {
      baseStyle: (props: StyleFunctionProps) => ({
        container: {
          bg: mode(tokens.light.surface, tokens.dark.surface)(props),
          color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
          borderColor: mode(tokens.light.border, tokens.dark.border)(props),
        },
      }),
    },
    Modal: {
      baseStyle: (props: StyleFunctionProps) => ({
        dialog: {
          bg: mode(tokens.light.surface, tokens.dark.surface)(props),
          color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
          borderColor: mode(tokens.light.border, tokens.dark.border)(props),
          borderWidth: mode("0px", "1px")(props),
        },
        dialogContainer: {
          paddingTop: "var(--safe-area-top, env(safe-area-inset-top, 0px))",
          paddingBottom: "0px",
          paddingLeft: "var(--safe-area-left, env(safe-area-inset-left, 0px))",
          paddingRight: "var(--safe-area-right, env(safe-area-inset-right, 0px))",
        },
      }),
    },
    Drawer: {
      baseStyle: (props: StyleFunctionProps) => ({
        dialog: {
          bg: mode(tokens.light.surface, tokens.dark.surface)(props),
          color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
        },
        header: {
          paddingTop: "max(16px, calc(16px + var(--safe-area-top, env(safe-area-inset-top, 0px))))",
        },
        closeButton: {
          top: "max(16px, calc(16px + var(--safe-area-top, env(safe-area-inset-top, 0px))))",
        },
      }),
    },
    Menu: {
      baseStyle: (props: StyleFunctionProps) => ({
        list: {
          bg: mode(tokens.light.surface, tokens.dark.surface)(props),
          borderColor: mode(tokens.light.border, tokens.dark.border)(props),
          color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
          boxShadow: mode("lg", "0 18px 38px rgba(0, 0, 0, 0.45)")(props),
        },
        item: {
          bg: "transparent",
          color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
          _hover: {
            bg: mode(tokens.light.surfaceAlt, tokens.dark.surfaceSoft)(props),
          },
          _focus: {
            bg: mode(tokens.light.surfaceAlt, tokens.dark.surfaceSoft)(props),
          },
        },
      }),
    },
    Popover: {
      baseStyle: (props: StyleFunctionProps) => ({
        content: {
          bg: mode(tokens.light.surface, tokens.dark.surface)(props),
          borderColor: mode(tokens.light.border, tokens.dark.border)(props),
          color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
          boxShadow: mode("lg", "0 18px 38px rgba(0, 0, 0, 0.45)")(props),
        },
      }),
    },
    Table: {
      variants: {
        simple: (props: StyleFunctionProps) => ({
          th: {
            borderColor: mode(tokens.light.border, tokens.dark.border)(props),
            color: mode(tokens.light.textMuted, tokens.dark.textMuted)(props),
            bg: mode(tokens.light.surfaceAlt, tokens.dark.surfaceAlt)(props),
          },
          td: {
            borderColor: mode(tokens.light.border, tokens.dark.border)(props),
            color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
          },
        }),
      },
    },
    Input: {
      variants: {
        outline: (props: StyleFunctionProps) => ({
          field: {
            bg: mode(tokens.light.inputBg, tokens.dark.inputBg)(props),
            borderColor: mode(tokens.light.inputBorder, tokens.dark.inputBorder)(props),
            color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
            _placeholder: {
              color: mode(tokens.light.inputPlaceholder, tokens.dark.inputPlaceholder)(props),
            },
            _hover: {
              borderColor: mode(tokens.light.borderStrong, tokens.dark.borderStrong)(props),
            },
            _focus: {
              borderColor: "brand.500",
              boxShadow: `0 0 0 1px ${tokens.light.primary}`,
            },
          },
        }),
      },
    },
    Select: {
      variants: {
        outline: (props: StyleFunctionProps) => ({
          field: {
            bg: mode(tokens.light.inputBg, tokens.dark.inputBg)(props),
            borderColor: mode(tokens.light.inputBorder, tokens.dark.inputBorder)(props),
            color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
            _hover: {
              borderColor: mode(tokens.light.borderStrong, tokens.dark.borderStrong)(props),
            },
            _focus: {
              borderColor: "brand.500",
              boxShadow: `0 0 0 1px ${tokens.light.primary}`,
            },
          },
        }),
      },
    },
    Tooltip: {
      baseStyle: (props: StyleFunctionProps) => ({
        bg: mode(tokens.dark.surface, tokens.light.surface)(props),
        color: mode(tokens.dark.textPrimary, tokens.light.textPrimary)(props),
        borderRadius: "md",
        boxShadow: "md",
        px: 2,
        py: 1,
      }),
    },
    Skeleton: {
      baseStyle: (props: StyleFunctionProps) => ({
        $$startColor: mode("var(--color-surface-soft, #EDF2F7)", "var(--color-surface-soft, #1B2A47)")(props),
        $$endColor: mode("var(--color-border-strong, #CBD5E1)", "var(--color-surface-alt, #253A5E)")(props),
        borderRadius: "md",
      }),
      defaultProps: {
        startColor: undefined,
        endColor: undefined,
      },
    },
    Tabs: {
      variants: {
        line: (props: StyleFunctionProps) => ({
          tab: {
            color: mode(tokens.light.textSecondary, tokens.dark.textSecondary)(props),
            _selected: {
              color: mode("brand.500", "brand.300")(props),
              borderColor: "brand.500",
            },
            _hover: {
              color: mode("brand.600", "brand.200")(props),
            },
          },
        }),
      },
    },
  };

  const styles = {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode(tokens.light.bg, tokens.dark.bg)(props),
        color: mode(tokens.light.textPrimary, tokens.dark.textPrimary)(props),
        fontFamily: bodyFontStack,
      },
      "::placeholder": {
        color: mode(tokens.light.textMuted, tokens.dark.textMuted)(props),
      },
    }),
  };

  const fonts = {
    heading: headingFontStack,
    body: bodyFontStack,
  };

  return extendTheme({
    config: chakraConfig,
    colors,
    semanticTokens,
    fonts,
    breakpoints,
    components,
    styles,
  });
}

export const theme = createAppTheme(themeConfig);
export { bodyFontStack, headingFontStack };
export default theme;
