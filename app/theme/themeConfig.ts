export interface ThemeColors {
  /**
   * Main brand color used for primary buttons, active navigation,
   * links, important UI elements, and selected states.
   */
  primary: string;

  /**
   * Supporting UI elements, secondary buttons, complementary components,
   * badges, and borders.
   */
  secondary: string;

  /**
   * Used for highlights, badges, indicators, notifications, charts,
   * and other elements that need visual emphasis.
   */
  accent: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
}

/**
 * Centralized theme configuration acting as the single source of truth
 * for the entire application's brand colors.
 *
 * Changing these three hex values will immediately update all brand
 * colors and derived tokens across every page and component.
 */
export const themeConfig: ThemeConfig = {
  colors: {
    primary: "#065F68",
    secondary: "#2A8A94",
    accent: "#DF837C",
  },
};

export default themeConfig;
