// ─────────────────────────────────────────────────────────────────────────────
// Central Theme Architecture — Dynamic Theme Tokens & Semantic System
// Driven by app/theme/themeConfig.ts and CSS variables.
// Supports full Light Mode, Dark Mode, and System Default.
// ─────────────────────────────────────────────────────────────────────────────

// ── Theme Core Palette (Dynamic via CSS variables) ───────────────────────────
export const dashboardPalette = {
  // Backgrounds & Surfaces
  page: "var(--color-bg)",
  shell: "var(--color-shell)",
  shellElevated: "var(--color-shell-elevated)",
  surface: "var(--color-surface)",
  surfaceAlt: "var(--color-surface-alt)",
  surfaceSoft: "var(--color-surface-soft)",

  // Borders (adapts to light / dark with brand accent tint)
  border: "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  borderAccent: "var(--color-border-accent)",

  // Text
  text: "var(--color-text-primary)",
  textMuted: "var(--color-text-muted)",
  textSoft: "var(--color-text-secondary)",

  // Primary Accent & Brand (configured via themeConfig)
  accent: "var(--color-primary)",
  accentStrong: "var(--color-primary-hover)",
  accentSoft: "var(--color-primary-soft)",
  accentGlow: "var(--color-primary-glow)",

  // Semantic Status
  success: "var(--color-success)",
  successSoft: "var(--color-success-soft)",
  successBorder: "var(--color-success-border)",

  warning: "var(--color-warning)",
  warningSoft: "var(--color-warning-soft)",
  warningBorder: "var(--color-warning-border)",

  danger: "var(--color-error)",
  dangerSoft: "var(--color-error-soft)",
  dangerBorder: "var(--color-error-border)",

  info: "var(--color-info)",
  infoSoft: "var(--color-info-soft)",
  infoBorder: "var(--color-info-border)",
} as const;

// ── Hero Gradient ─────────────────────────────────────────────────────────────
export const dashboardHeroGradient =
  "linear-gradient(145deg, var(--color-surface-alt) 0%, var(--color-surface) 50%, var(--color-bg) 100%)";

export const dashboardHeroGradientLight =
  "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)";

// ── Order Status Color System ─────────────────────────────────────────────────
export const orderStatusPalette = {
  created: {
    label: "Placed",
    color: "var(--color-info)",
    bg: "var(--color-info-soft)",
    border: "var(--color-info-border)",
    colorScheme: "blue",
  },
  pending: {
    label: "Pending",
    color: "var(--color-warning)",
    bg: "var(--color-warning-soft)",
    border: "var(--color-warning-border)",
    colorScheme: "yellow",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--color-secondary)",
    bg: "var(--color-secondary-soft)",
    border: "var(--color-secondary-border)",
    colorScheme: "cyan",
  },
  processing: {
    label: "Processing",
    color: "var(--color-secondary)",
    bg: "var(--color-secondary-soft)",
    border: "var(--color-secondary-border)",
    colorScheme: "cyan",
  },
  shipped: {
    label: "Shipped",
    color: "var(--color-info)",
    bg: "var(--color-info-soft)",
    border: "var(--color-info-border)",
    colorScheme: "purple",
  },
  delivered: {
    label: "Delivered",
    color: "var(--color-success)",
    bg: "var(--color-success-soft)",
    border: "var(--color-success-border)",
    colorScheme: "green",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--color-error)",
    bg: "var(--color-error-soft)",
    border: "var(--color-error-border)",
    colorScheme: "red",
  },
} as const;

// ── Category Badge Palette ────────────────────────────────────────────────────
export const categoryBadgePalette = [
  { color: "var(--color-primary)", bg: "var(--color-primary-soft)", border: "var(--color-primary-border)" },
  { color: "var(--color-secondary)", bg: "var(--color-secondary-soft)", border: "var(--color-secondary-border)" },
  { color: "var(--color-accent)", bg: "var(--color-accent-soft)", border: "var(--color-accent-border)" },
  { color: "var(--color-success)", bg: "var(--color-success-soft)", border: "var(--color-success-border)" },
  { color: "var(--color-info)", bg: "var(--color-info-soft)", border: "var(--color-info-border)" },
  { color: "var(--color-warning)", bg: "var(--color-warning-soft)", border: "var(--color-warning-border)" },
] as const;

// ── Form Palette ──────────────────────────────────────────────────────────────
export const dashboardFormPalette = {
  inputBg: "var(--color-input-bg)",
  inputBorder: "var(--color-input-border)",
  inputPlaceholder: "var(--color-input-placeholder)",
  tagBg: "var(--color-primary-soft)",
  tagButtonBg: "var(--color-primary-soft)",
  fileDropBg: "var(--color-surface-alt)",
  fileDropBorder: "var(--color-border)",
  fileRowBg: "var(--color-surface)",
  fileRowBorder: "var(--color-border)",
  checkboxBg: "var(--color-input-bg)",
  checkboxBorder: "var(--color-input-border)",
  checkboxActiveBg: "var(--color-primary)",
} as const;

// ── Mobile Ledger Detail Theme ───────────────────────────────────────────────
export const dashboardMobileLedgerDetailTheme = {
  colors: {
    primary: "var(--color-primary)",
    primaryDark: "var(--color-primary-hover)",
    primarySoft: "var(--color-primary-soft)",
    primaryBorder: "var(--color-border-accent)",
    surface: "var(--color-surface)",
    surfaceMuted: "var(--color-surface-alt)",
    surfaceElevated: "var(--color-surface-elevated)",
    border: "var(--color-border)",
    borderStrong: "var(--color-border-strong)",
    text: "var(--color-text-primary)",
    textMuted: "var(--color-text-muted)",
    textSubtle: "var(--color-text-secondary)",
    success: "var(--color-success)",
    successSoft: "var(--color-success-soft)",
    successBorder: "var(--color-success-border)",
    danger: "var(--color-error)",
    dangerSoft: "var(--color-error-soft)",
    dangerBorder: "var(--color-error-border)",
    warning: "var(--color-warning)",
    warningSoft: "var(--color-warning-soft)",
    warningBorder: "var(--color-warning-border)",
    infoSoft: "var(--color-info-soft)",
    infoBorder: "var(--color-info-border)",
    fabStart: "var(--color-primary)",
    fabEnd: "var(--color-secondary)",
  },
  spacing: {
    pageX: { base: 3, sm: 4 },
    sectionGap: 4,
    fixedInset: "12px",
  },
  header: {
    bgGradient: dashboardHeroGradient,
    boxShadow: "0 18px 38px rgba(0, 0, 0, 0.24)",
    borderBottomRadius: "30px",
  },
  card: {
    bg: "var(--color-surface)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    borderRadius: "24px",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
  },
  sectionCard: {
    bg: "var(--color-surface)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    borderRadius: "22px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.06)",
  },
  infoCard: {
    bg: "var(--color-surface)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    borderRadius: "18px",
    px: 3,
    py: 3,
    minH: "72px",
  },
  badge: {
    borderRadius: "full",
    px: 2.5,
    py: 1,
    fontSize: "10px",
    fontWeight: "800",
  },
  input: {
    h: "48px",
    bg: "var(--color-input-bg)",
    borderRadius: "16px",
    borderColor: "var(--color-input-border)",
    _placeholder: { color: "var(--color-input-placeholder)" },
    _focus: {
      borderColor: "var(--color-primary)",
      bg: "var(--color-surface)",
      boxShadow: "0 0 0 1px var(--color-primary)",
    },
  },
  actionBar: {
    bg: "var(--color-surface-elevated)",
    borderRadius: "22px",
    p: 3,
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
    backdropFilter: "blur(18px)",
  },
  button: {
    primary: {
      h: "48px",
      borderRadius: "14px",
      fontWeight: "700",
      fontSize: "sm",
      _active: { transform: "scale(0.97)" },
    },
    secondary: {
      h: "48px",
      borderRadius: "14px",
      fontWeight: "700",
      fontSize: "sm",
      _active: { transform: "scale(0.97)" },
    },
    small: {
      h: "34px",
      minH: "34px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "800",
      px: 4,
      _active: { transform: "scale(0.97)" },
    },
    pagination: {
      h: "36px",
      minW: "86px",
      borderRadius: "full",
      variant: "outline",
      borderColor: "var(--color-border-accent)",
      bg: "var(--color-surface)",
      color: "var(--color-text-primary)",
      fontSize: "sm",
      fontWeight: "700",
      _hover: { bg: "var(--color-surface-soft)" },
      _active: { transform: "scale(0.97)", bg: "var(--color-primary-soft)" },
    },
    segment: {
      flex: "1",
      h: "44px",
      borderRadius: "16px",
      fontWeight: "800",
      fontSize: "sm",
      _active: { transform: "scale(0.98)" },
    },
    headerPill: {
      h: "40px",
      borderRadius: "full",
      fontWeight: "700",
      fontSize: "sm",
      _active: { transform: "scale(0.97)" },
    },
  },
  fab: {
    h: "48px",
    minW: "0",
    px: 5,
    borderRadius: "full",
    fontSize: "sm",
    fontWeight: "900",
    letterSpacing: "0.02em",
    boxShadow: "0 18px 34px var(--color-primary-glow)",
    _active: { transform: "scale(0.97)" },
  },
  tones: {
    sale: {
      softBg: "linear-gradient(135deg, var(--color-primary-soft) 0%, transparent 100%)",
      softBorder: "var(--color-border-accent)",
    },
    payment: {
      softBg: "linear-gradient(135deg, var(--color-success-soft) 0%, transparent 100%)",
      softBorder: "var(--color-success-border)",
    },
    adjustment: {
      softBg: "linear-gradient(135deg, var(--color-info-soft) 0%, transparent 100%)",
      softBorder: "var(--color-info-border)",
    },
  },
} as const;

// ── Mobile Ledger Palette ────────────────────────────────────────────────────
export const dashboardMobileLedgerPalette = {
  page: "var(--color-bg)",
  section: "var(--color-shell)",
  panel: "var(--color-surface-alt)",
  panelSoft: "var(--color-surface-soft)",
  card: "var(--color-surface)",
  cardBorder: "var(--color-border)",
  text: "var(--color-text-primary)",
  textMuted: "var(--color-text-muted)",
  textSoft: "var(--color-text-secondary)",
  indigoText: "var(--color-primary)",
  indigoGradient: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
  indigoGlow: "0 14px 28px var(--color-primary-glow)",
  green: "var(--color-success)",
  greenCard: "var(--color-surface)",
  greenSoft: "var(--color-success-soft)",
  greenBorder: "var(--color-success-border)",
  danger: "var(--color-error)",
  footer: "var(--color-bg)",
  contactBg: "var(--color-surface-alt)",
} as const;

// ── Composed Theme Export ─────────────────────────────────────────────────────
export const dashboardTheme = {
  palette: dashboardPalette,
  heroGradient: dashboardHeroGradient,
  heroGradientLight: dashboardHeroGradientLight,
  form: dashboardFormPalette,
  orderStatus: orderStatusPalette,
  categoryBadge: categoryBadgePalette,
  mobileLedger: dashboardMobileLedgerPalette,
  mobileLedgerDetail: dashboardMobileLedgerDetailTheme,
} as const;
