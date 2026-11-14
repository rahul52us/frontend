/**
 * CENTRALIZED FONT CONFIGURATION
 *
 * To switch fonts, comment out the active set and uncomment another set.
 * Don't change anything else.
 */

// ============================================================================
// SET 1 (ACTIVE): Bricolage Grotesque (heading) + Figtree (body)
// Quirky, modern, playful-but-polished. Great all-round pick.
// ============================================================================
import { Bricolage_Grotesque, Figtree } from "next/font/google";

export const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const bodyFont = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// ============================================================================
// SET 2: Unbounded (heading) + Plus Jakarta Sans (body)
// Wide, rounded, futuristic. Bold and eye-catching for trendy brands.
// ============================================================================
// import { Unbounded, Plus_Jakarta_Sans } from "next/font/google";

// export const headingFont = Unbounded({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-heading",
// });

// export const bodyFont = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });

// ============================================================================
// SET 3: Fraunces (heading) + Manrope (body)
// Soft, quirky, characterful serif. Warm and premium, great for lifestyle/decor.
// ============================================================================
// import { Fraunces, Manrope } from "next/font/google";

// export const headingFont = Fraunces({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-heading",
// });

// export const bodyFont = Manrope({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });

// ============================================================================
// SET 4: Syne (heading) + DM Sans (body)
// Artsy, bold, wide headings. Very distinctive, creative-store feel.
// ============================================================================
// import { Syne, DM_Sans } from "next/font/google";

// export const headingFont = Syne({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-heading",
// });

// export const bodyFont = DM_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });

// ============================================================================
// SET 5: Instrument Serif (heading) + Instrument Sans (body)
// Elegant, editorial, fashion-magazine look. Sleek and high-end.
// ============================================================================
// import { Instrument_Serif, Instrument_Sans } from "next/font/google";

// export const headingFont = Instrument_Serif({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-heading",
//   weight: "400",
// });

// export const bodyFont = Instrument_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });

// ============================================================================
// SET 6: Gabarito (heading) + Figtree (body)
// Geometric, friendly, punchy. Fun, colorful, app-like feel.
// ============================================================================
// import { Gabarito, Figtree } from "next/font/google";

// export const headingFont = Gabarito({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-heading",
// });

// export const bodyFont = Figtree({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });