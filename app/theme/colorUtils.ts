/**
 * Color utility functions for deriving scales, alpha variants,
 * and tints/shades from the centralized brand colors.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  [key: string]: string;
}

/**
 * Converts a hex color string to an RGB object.
 */
export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace("#", "").trim();

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    // Fallback safe RGB if invalid hex
    return { r: 6, g: 95, b: 104 };
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts an RGB object to a hex string.
 */
export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Returns an rgba string with the specified opacity (0 to 1).
 */
export function alpha(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Blends a color towards white (positive percent) or towards black (negative percent).
 * @param hex Base hex color
 * @param percent Between -100 and 100
 */
export function adjustLightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;

  let newR: number;
  let newG: number;
  let newB: number;

  if (factor > 0) {
    // Lighten towards 255
    newR = r + (255 - r) * factor;
    newG = g + (255 - g) * factor;
    newB = b + (255 - b) * factor;
  } else {
    // Darken towards 0
    const absFactor = Math.abs(factor);
    newR = r * (1 - absFactor);
    newG = g * (1 - absFactor);
    newB = b * (1 - absFactor);
  }

  return rgbToHex({ r: newR, g: newG, b: newB });
}

/**
 * Generates a full 10-step Chakra color scale (50-900) centered on base color at 500.
 */
export function generateColorScale(baseHex: string): ColorScale {
  return {
    50: adjustLightness(baseHex, 88),
    100: adjustLightness(baseHex, 75),
    200: adjustLightness(baseHex, 55),
    300: adjustLightness(baseHex, 35),
    400: adjustLightness(baseHex, 18),
    500: baseHex,
    600: adjustLightness(baseHex, -12),
    700: adjustLightness(baseHex, -24),
    800: adjustLightness(baseHex, -38),
    900: adjustLightness(baseHex, -52),
  };
}
