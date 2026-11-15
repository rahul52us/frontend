// Theme-aware CSS variable tokens that automatically adapt to light / dark mode
// without needing runtime hook evaluations or causing flash of light theme
export const startColor = "var(--skeleton-start, var(--color-surface-soft, #EDF2F7))";
export const endColor = "var(--skeleton-end, var(--color-border-strong, #CBD5E1))";
