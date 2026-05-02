// ─────────────────────────────────────────────────────────────────────────────
// Central Theme Architecture — "Vibrant-Subtle" Blue System
// Primary Palette: Navy → Electric Blue → Ice Blue
// Secondary: Mint Green (success) | Soft Rose (danger) | Deep Lavender (info)
// Warning: Orange-600 (#EA580C) — no amber/gold allowed
// ─────────────────────────────────────────────────────────────────────────────

// ── Dark Mode Core ────────────────────────────────────────────────────────────
export const dashboardPalette = {
  // Backgrounds (deep desaturated blue-greys)
  page: "#070B14",
  shell: "#0B1120",
  shellElevated: "#0F1929",
  surface: "#121F35",
  surfaceAlt: "#172540",
  surfaceSoft: "#1D2E50",

  // Borders (blue-tinted, 1px glassmorphism style)
  border: "rgba(59, 130, 246, 0.14)",
  borderStrong: "#253A5E",
  borderAccent: "rgba(59, 130, 246, 0.28)",

  // Text (crisp white-blue → muted azure)
  text: "#EDF2FF",
  textMuted: "#8AAAC8",
  textSoft: "#5A7FA8",

  // Primary Accent — Electric Blue
  accent: "#3B82F6",
  accentStrong: "#60A5FA",
  accentSoft: "rgba(59, 130, 246, 0.12)",
  accentGlow: "rgba(59, 130, 246, 0.22)",

  // Semantic — Mint Green (success)
  success: "#34D399",
  successSoft: "rgba(52, 211, 153, 0.12)",
  successBorder: "rgba(52, 211, 153, 0.24)",

  // Semantic — Orange-600 (warning — strictly no gold/amber)
  warning: "#EA580C",
  warningSoft: "rgba(234, 88, 12, 0.10)",
  warningBorder: "rgba(234, 88, 12, 0.22)",

  // Semantic — Soft Rose (danger)
  danger: "#F87171",
  dangerSoft: "rgba(248, 113, 113, 0.12)",
  dangerBorder: "rgba(248, 113, 113, 0.24)",

  // Semantic — Deep Lavender (info)
  info: "#818CF8",
  infoSoft: "rgba(129, 140, 248, 0.10)",
  infoBorder: "rgba(129, 140, 248, 0.22)",
} as const;

// ── Hero Gradient ─────────────────────────────────────────────────────────────
// Dark: Navy mesh gradient — deep blue atmosphere
export const dashboardHeroGradient =
  "linear-gradient(145deg, #07111F 0%, #0C1D38 50%, #091A40 100%)";

// Light hero (for SellerOverview, MerchantHeroSection, etc.)
export const dashboardHeroGradientLight =
  "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)";

// ── Order Status Color System ─────────────────────────────────────────────────
// Blue/Cyan shades for progress states — keeps UI "colorful" through function
export const orderStatusPalette = {
  created: {
    label: "Placed",
    color: "#60A5FA",        // Electric Blue light
    bg: "rgba(59, 130, 246, 0.10)",
    border: "rgba(59, 130, 246, 0.22)",
    colorScheme: "blue",
  },
  pending: {
    label: "Pending",
    color: "#60A5FA",
    bg: "rgba(59, 130, 246, 0.10)",
    border: "rgba(59, 130, 246, 0.22)",
    colorScheme: "blue",
  },
  confirmed: {
    label: "Confirmed",
    color: "#22D3EE",        // Cyan-400
    bg: "rgba(34, 211, 238, 0.10)",
    border: "rgba(34, 211, 238, 0.22)",
    colorScheme: "cyan",
  },
  processing: {
    label: "Processing",
    color: "#22D3EE",
    bg: "rgba(34, 211, 238, 0.10)",
    border: "rgba(34, 211, 238, 0.22)",
    colorScheme: "cyan",
  },
  shipped: {
    label: "Shipped",
    color: "#818CF8",        // Indigo/Lavender
    bg: "rgba(129, 140, 248, 0.10)",
    border: "rgba(129, 140, 248, 0.22)",
    colorScheme: "purple",
  },
  delivered: {
    label: "Delivered",
    color: "#34D399",        // Mint Green
    bg: "rgba(52, 211, 153, 0.10)",
    border: "rgba(52, 211, 153, 0.22)",
    colorScheme: "green",
  },
  cancelled: {
    label: "Cancelled",
    color: "#F87171",        // Soft Rose
    bg: "rgba(248, 113, 113, 0.10)",
    border: "rgba(248, 113, 113, 0.22)",
    colorScheme: "red",
  },
} as const;

// ── Category Badge Palette ────────────────────────────────────────────────────
// For Shop/Products — diverse but harmonious palette avoiding gold
export const categoryBadgePalette = [
  { color: "#818CF8", bg: "rgba(129, 140, 248, 0.12)", border: "rgba(129, 140, 248, 0.24)" }, // Indigo
  { color: "#2DD4BF", bg: "rgba(45, 212, 191, 0.12)",  border: "rgba(45, 212, 191, 0.24)" },  // Teal
  { color: "#A78BFA", bg: "rgba(167, 139, 250, 0.12)", border: "rgba(167, 139, 250, 0.24)" }, // Violet
  { color: "#22D3EE", bg: "rgba(34, 211, 238, 0.12)",  border: "rgba(34, 211, 238, 0.24)" },  // Cyan
  { color: "#F472B6", bg: "rgba(244, 114, 182, 0.12)", border: "rgba(244, 114, 182, 0.24)" }, // Rose-Pink
  { color: "#60A5FA", bg: "rgba(96, 165, 250, 0.12)",  border: "rgba(96, 165, 250, 0.24)" },  // Blue
  { color: "#34D399", bg: "rgba(52, 211, 153, 0.12)",  border: "rgba(52, 211, 153, 0.24)" },  // Mint
] as const;

// ── Form Palette ──────────────────────────────────────────────────────────────
export const dashboardFormPalette = {
  inputBg: "#111E33",
  inputBorder: "#253A5E",
  inputPlaceholder: "#5A7FA8",
  tagBg: "rgba(59, 130, 246, 0.12)",
  tagButtonBg: dashboardPalette.accentSoft,
  fileDropBg: "#0B1120",
  fileDropBorder: "#1D2E50",
  fileRowBg: "#121F35",
  fileRowBorder: "#1D2E50",
  checkboxBg: "#070B14",
  checkboxBorder: "#253A5E",
  checkboxActiveBg: "rgba(59, 130, 246, 0.18)",
} as const;

// ── Mobile Ledger Detail Theme (blue-migrated, Indigo accents) ────────────────
export const dashboardMobileLedgerDetailTheme = {
  colors: {
    primary: dashboardPalette.accent,
    primaryDark: dashboardPalette.accentStrong,
    primarySoft: dashboardPalette.accentSoft,
    primaryBorder: dashboardPalette.borderAccent,
    surface: "#F0F6FF",
    surfaceMuted: "#F5F9FF",
    surfaceElevated: "#FFFFFF",
    border: "#BFDBFE",
    borderStrong: "#93C5FD",
    text: "#0F172A",
    textMuted: "#3B5A82",
    textSubtle: "#6B92B8",
    success: "#059669",
    successSoft: "#ECFDF5",
    successBorder: "#A7F3D0",
    danger: "#DC2626",
    dangerSoft: "#FEF2F2",
    dangerBorder: "#FECACA",
    warning: "#EA580C",
    warningSoft: "#FFF7ED",
    warningBorder: "#FED7AA",
    // Indigo for info — replaces old amber/gold infoSoft
    infoSoft: "rgba(99, 102, 241, 0.08)",
    infoBorder: "rgba(99, 102, 241, 0.18)",
    fabStart: "#2563EB",
    fabEnd: "#3B82F6",
  },
  spacing: {
    pageX: { base: 3, sm: 4 },
    sectionGap: 4,
    fixedInset: "12px",
  },
  header: {
    bgGradient: dashboardHeroGradient,
    boxShadow: "0 18px 38px rgba(7, 11, 20, 0.36)",
    borderBottomRadius: "30px",
  },
  card: {
    bg: "#FFFFFF",
    borderWidth: "1px",
    borderColor: "#BFDBFE",
    borderRadius: "24px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
  },
  sectionCard: {
    bg: "#FFFFFF",
    borderWidth: "1px",
    borderColor: "#DBEAFE",
    borderRadius: "22px",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  },
  infoCard: {
    bg: "#FFFFFF",
    borderWidth: "1px",
    borderColor: "#DBEAFE",
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
    bg: "#F0F6FF",
    borderRadius: "16px",
    borderColor: "#BFDBFE",
    _placeholder: { color: "#6B92B8" },
    _focus: {
      borderColor: dashboardPalette.accent,
      bg: "#FFFFFF",
      boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
    },
  },
  actionBar: {
    bg: "rgba(7, 11, 20, 0.94)",
    borderRadius: "22px",
    p: 3,
    borderWidth: "1px",
    borderColor: dashboardPalette.border,
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
      borderColor: dashboardPalette.borderAccent,
      bg: "#FFFFFF",
      color: "#1E3A5F",
      fontSize: "sm",
      fontWeight: "700",
      _hover: { bg: "#EFF6FF" },
      _active: { transform: "scale(0.97)", bg: dashboardPalette.accentSoft },
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
    boxShadow: "0 18px 34px rgba(37, 99, 235, 0.38)",
    _active: { transform: "scale(0.97)" },
  },
  tones: {
    sale: {
      // Blue-tinted "sale" tone (replaces old amber)
      softBg: "linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(59, 130, 246, 0.06) 100%)",
      softBorder: "rgba(59, 130, 246, 0.20)",
    },
    payment: {
      softBg: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
      softBorder: "#A7F3D0",
    },
    adjustment: {
      softBg: "linear-gradient(135deg, rgba(129, 140, 248, 0.14) 0%, rgba(129, 140, 248, 0.06) 100%)",
      softBorder: "rgba(129, 140, 248, 0.22)",
    },
  },
} as const;

// ── Mobile Ledger Palette (migrated to Blue/Indigo, no purple drift) ──────────
export const dashboardMobileLedgerPalette = {
  page: "#070B14",
  section: "#0B1120",
  panel: "#172540",
  panelSoft: "#1D2E50",
  card: "#121F35",
  cardBorder: "rgba(59, 130, 246, 0.18)",
  text: "#EDF2FF",
  textMuted: "#8AAAC8",
  textSoft: "#5A7FA8",
  // Indigo accents for colorful variety — avoids full purple drift
  indigoText: "#818CF8",
  indigoGradient: "linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)",
  indigoGlow: "0 14px 28px rgba(99, 102, 241, 0.28)",
  // Mint for positive states
  green: "#34D399",
  greenCard: "#0F2A20",
  greenSoft: "rgba(16, 68, 48, 0.48)",
  greenBorder: "rgba(52, 211, 153, 0.24)",
  // Soft Rose for danger
  danger: "#F87171",
  footer: "#070B14",
  contactBg: "#080E1C",
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
