import { ThemeColors } from "./themeConfig";
import { adjustLightness, alpha, generateColorScale } from "./colorUtils";

export interface SemanticModeTokens {
  // Brand colors & variants
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryLight: string;
  primarySoft: string;
  primaryGlow: string;
  primaryBorder: string;
  primaryText: string;

  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  secondaryLight: string;
  secondarySoft: string;
  secondaryBorder: string;

  accent: string;
  accentHover: string;
  accentActive: string;
  accentLight: string;
  accentSoft: string;
  accentBorder: string;

  // Backgrounds & Surfaces
  bg: string;
  bgSubtle: string;
  shell: string;
  shellElevated: string;
  surface: string;
  surfaceAlt: string;
  surfaceSoft: string;
  surfaceElevated: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;

  // Borders
  border: string;
  borderStrong: string;
  borderAccent: string;

  // Form Inputs
  inputBg: string;
  inputBorder: string;
  inputPlaceholder: string;
  inputFocusBorder: string;

  // Interactive States
  hover: string;
  active: string;
  disabled: string;
  disabledBg: string;

  // Feedback & Status
  success: string;
  successSoft: string;
  successBorder: string;

  warning: string;
  warningSoft: string;
  warningBorder: string;

  error: string;
  errorSoft: string;
  errorBorder: string;

  info: string;
  infoSoft: string;
  infoBorder: string;
}

export interface SemanticTokens {
  light: SemanticModeTokens;
  dark: SemanticModeTokens;
}

/**
 * Computes semantic tokens for both light and dark mode derived from
 * the three main brand colors in themeConfig.
 */
export function getSemanticTokens(colors: ThemeColors): SemanticTokens {
  const { primary, secondary, accent } = colors;

  const light: SemanticModeTokens = {
    // Brand
    primary,
    primaryHover: adjustLightness(primary, -10),
    primaryActive: adjustLightness(primary, -18),
    primaryLight: adjustLightness(primary, 86),
    primarySoft: alpha(primary, 0.12),
    primaryGlow: alpha(primary, 0.22),
    primaryBorder: alpha(primary, 0.28),
    primaryText: primary,

    secondary,
    secondaryHover: adjustLightness(secondary, -10),
    secondaryActive: adjustLightness(secondary, -18),
    secondaryLight: adjustLightness(secondary, 86),
    secondarySoft: alpha(secondary, 0.12),
    secondaryBorder: alpha(secondary, 0.28),

    accent,
    accentHover: adjustLightness(accent, -10),
    accentActive: adjustLightness(accent, -18),
    accentLight: adjustLightness(accent, 86),
    accentSoft: alpha(accent, 0.14),
    accentBorder: alpha(accent, 0.28),

    // Backgrounds & Surfaces (clean bright surfaces)
    bg: "#F8FAFC",
    bgSubtle: "#F1F5F9",
    shell: "#FFFFFF",
    shellElevated: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFC",
    surfaceSoft: "#EDF2F7",
    surfaceElevated: "#FFFFFF",

    // Typography
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#64748B",
    textSubtle: "#94A3B8",

    // Borders
    border: "#E2E8F0",
    borderStrong: "#CBD5E1",
    borderAccent: alpha(primary, 0.28),

    // Form inputs
    inputBg: "#FFFFFF",
    inputBorder: "#CBD5E1",
    inputPlaceholder: "#94A3B8",
    inputFocusBorder: primary,

    // Interactive States
    hover: "rgba(0, 0, 0, 0.04)",
    active: "rgba(0, 0, 0, 0.08)",
    disabled: "#94A3B8",
    disabledBg: "#F1F5F9",

    // Feedback
    success: "#10B981",
    successSoft: "rgba(16, 185, 129, 0.12)",
    successBorder: "rgba(16, 185, 129, 0.28)",

    warning: "#F59E0B",
    warningSoft: "rgba(245, 158, 11, 0.12)",
    warningBorder: "rgba(245, 158, 11, 0.28)",

    error: "#EF4444",
    errorSoft: "rgba(239, 68, 68, 0.12)",
    errorBorder: "rgba(239, 68, 68, 0.28)",

    info: "#3B82F6",
    infoSoft: "rgba(59, 130, 246, 0.12)",
    infoBorder: "rgba(59, 130, 246, 0.28)",
  };

  const dark: SemanticModeTokens = {
    // Brand - vibrant and legible on dark backgrounds
    primary,
    primaryHover: adjustLightness(primary, 42),
    primaryActive: adjustLightness(primary, 50),
    primaryLight: alpha(primary, 0.22),
    primarySoft: alpha(primary, 0.18),
    primaryGlow: alpha(primary, 0.35),
    primaryBorder: alpha(primary, 0.35),
    primaryText: adjustLightness(primary, 48),

    secondary,
    secondaryHover: adjustLightness(secondary, 14),
    secondaryActive: adjustLightness(secondary, 22),
    secondaryLight: alpha(secondary, 0.22),
    secondarySoft: alpha(secondary, 0.18),
    secondaryBorder: alpha(secondary, 0.35),

    accent,
    accentHover: adjustLightness(accent, 14),
    accentActive: adjustLightness(accent, 22),
    accentLight: alpha(accent, 0.24),
    accentSoft: alpha(accent, 0.20),
    accentBorder: alpha(accent, 0.35),

    // Backgrounds & Surfaces (comfortable dark slate, not pitch black)
    bg: "#070B14",
    bgSubtle: "#0B1120",
    shell: "#0B1120",
    shellElevated: "#0F1929",
    surface: "#111C30",
    surfaceAlt: "#15223A",
    surfaceSoft: "#1B2A47",
    surfaceElevated: "#182642",

    // Typography
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#8AAAC8",
    textSubtle: "#5A7FA8",

    // Borders
    border: "rgba(255, 255, 255, 0.10)",
    borderStrong: "#253A5E",
    borderAccent: alpha(primary, 0.35),

    // Form inputs
    inputBg: "#0B1120",
    inputBorder: "#253A5E",
    inputPlaceholder: "#5A7FA8",
    inputFocusBorder: primary,

    // Interactive States
    hover: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.09)",
    disabled: "#475569",
    disabledBg: "#0E172A",

    // Feedback
    success: "#34D399",
    successSoft: "rgba(52, 211, 153, 0.14)",
    successBorder: "rgba(52, 211, 153, 0.28)",

    warning: "#FBBF24",
    warningSoft: "rgba(251, 191, 36, 0.14)",
    warningBorder: "rgba(251, 191, 36, 0.28)",

    error: "#F87171",
    errorSoft: "rgba(248, 113, 113, 0.14)",
    errorBorder: "rgba(248, 113, 113, 0.28)",

    info: "#60A5FA",
    infoSoft: "rgba(96, 165, 250, 0.14)",
    infoBorder: "rgba(96, 165, 250, 0.28)",
  };

  return { light, dark };
}

/**
 * Builds CSS variable assignments from a mode tokens object.
 */
function buildCssVariablesBlock(tokens: SemanticModeTokens): string {
  return `
    --color-primary: ${tokens.primary};
    --color-primary-hover: ${tokens.primaryHover};
    --color-primary-active: ${tokens.primaryActive};
    --color-primary-light: ${tokens.primaryLight};
    --color-primary-soft: ${tokens.primarySoft};
    --color-primary-glow: ${tokens.primaryGlow};
    --color-primary-border: ${tokens.primaryBorder};
    --color-primary-text: ${tokens.primaryText};
    --color-primary-hover-text: ${tokens.primaryHover};

    --color-secondary: ${tokens.secondary};
    --color-secondary-hover: ${tokens.secondaryHover};
    --color-secondary-active: ${tokens.secondaryActive};
    --color-secondary-light: ${tokens.secondaryLight};
    --color-secondary-soft: ${tokens.secondarySoft};
    --color-secondary-border: ${tokens.secondaryBorder};

    --color-accent: ${tokens.accent};
    --color-accent-hover: ${tokens.accentHover};
    --color-accent-active: ${tokens.accentActive};
    --color-accent-light: ${tokens.accentLight};
    --color-accent-soft: ${tokens.accentSoft};
    --color-accent-border: ${tokens.accentBorder};

    --color-bg: ${tokens.bg};
    --color-background: ${tokens.bg};
    --color-bg-subtle: ${tokens.bgSubtle};
    --color-shell: ${tokens.shell};
    --color-shell-elevated: ${tokens.shellElevated};
    --color-surface: ${tokens.surface};
    --color-surface-alt: ${tokens.surfaceAlt};
    --color-surface-soft: ${tokens.surfaceSoft};
    --color-surface-elevated: ${tokens.surfaceElevated};

    --color-text-primary: ${tokens.textPrimary};
    --color-text-secondary: ${tokens.textSecondary};
    --color-text-muted: ${tokens.textMuted};
    --color-text-subtle: ${tokens.textSubtle};

    --color-border: ${tokens.border};
    --color-border-strong: ${tokens.borderStrong};
    --color-border-accent: ${tokens.borderAccent};

    --color-input-bg: ${tokens.inputBg};
    --color-input-border: ${tokens.inputBorder};
    --color-input-placeholder: ${tokens.inputPlaceholder};
    --color-input-focus-border: ${tokens.inputFocusBorder};

    --color-hover: ${tokens.hover};
    --color-active: ${tokens.active};
    --color-disabled: ${tokens.disabled};
    --color-disabled-bg: ${tokens.disabledBg};

    --color-success: ${tokens.success};
    --color-success-soft: ${tokens.successSoft};
    --color-success-border: ${tokens.successBorder};

    --color-warning: ${tokens.warning};
    --color-warning-soft: ${tokens.warningSoft};
    --color-warning-border: ${tokens.warningBorder};

    --color-error: ${tokens.error};
    --color-error-soft: ${tokens.errorSoft};
    --color-error-border: ${tokens.errorBorder};

    --color-info: ${tokens.info};
    --color-info-soft: ${tokens.infoSoft};
    --color-info-border: ${tokens.infoBorder};
  `;
}

/**
 * Returns complete CSS styling string that registers variables on :root for light mode
 * and [data-theme="dark"], .chakra-ui-dark, html[data-theme="dark"] for dark mode.
 */
export function generateCssVariables(colors: ThemeColors): string {
  const { light, dark } = getSemanticTokens(colors);

  return `
    :root, [data-theme="light"], .chakra-ui-light {
      ${buildCssVariablesBlock(light)}
    }

    [data-theme="dark"], .chakra-ui-dark, html[data-theme="dark"], body.chakra-ui-dark {
      ${buildCssVariablesBlock(dark)}
    }
  `;
}
