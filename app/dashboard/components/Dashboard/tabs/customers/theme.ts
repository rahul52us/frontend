"use client";

import { useColorMode, useColorModeValue, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  dashboardPalette,
  dashboardHeroGradient,
  dashboardMobileLedgerPalette as mobileLedgerPalette,
  dashboardMobileLedgerDetailTheme as androidTheme,
} from "../../../../../layouts/dashboardLayout/dashboardPalette";

export const MotionBox = motion(Box);

export const useCustomerTheme = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.500", dashboardPalette.textSoft);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cPage = useColorModeValue("white", dashboardPalette.page);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
  const cSuccess = useColorModeValue("green.500", dashboardPalette.success);
  const cHeroGradient = useColorModeValue("white", dashboardHeroGradient);
  const cGlassSurface = useColorModeValue("white", "rgba(11, 17, 32, 0.82)");
  const cSoftShadow = useColorModeValue(
    "0 4px 6px rgba(15, 23, 42, 0.04)",
    "0 22px 48px rgba(0, 0, 0, 0.32)",
  );
  const cStrongShadow = useColorModeValue(
    "0 24px 56px rgba(15, 23, 42, 0.12)",
    "0 28px 60px rgba(0, 0, 0, 0.38)",
  );
  const cInputBg = useColorModeValue("white", dashboardPalette.surfaceAlt);
  const cInputMutedBg = useColorModeValue("gray.50", dashboardPalette.surfaceSoft);
  const cInputBorder = useColorModeValue("gray.200", dashboardPalette.borderStrong);
  const cPlaceholder = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cSuccessSoftBg = useColorModeValue("green.50", dashboardPalette.successSoft);
  const cDangerSoftBg = useColorModeValue("red.50", dashboardPalette.dangerSoft);
  const cFormInfoBg = useColorModeValue("rgba(69, 104, 255, 0.06)", "rgba(59, 130, 246, 0.12)");
  const cSurfaceElevated = useColorModeValue("white", dashboardPalette.shellElevated);
  const cSurfaceMuted = useColorModeValue("gray.50", dashboardPalette.shell);
  const cBadgeBg = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cDangerAccentSoft = useColorModeValue("red.50", dashboardPalette.dangerSoft);
  const cSuccessAccentSoft = useColorModeValue("green.50", dashboardPalette.successSoft);
  const cIconButtonHover = useColorModeValue("blackAlpha.100", "whiteAlpha.120");
  const cIconButtonMutedBg = useColorModeValue("gray.50", dashboardPalette.surfaceSoft);
  const cCardShadow = useColorModeValue("0 1px 6px rgba(0,0,0,0.04)", "0 16px 32px rgba(0,0,0,0.22)");
  const cFabShadow = useColorModeValue("0 4px 16px rgba(0,0,0,0.18)", "0 18px 36px rgba(0,0,0,0.34)");

  return {
    colorMode,
    isDarkMode,
    cAccentSoft,
    cAccentStrong,
    cAccent,
    cTextMuted,
    cText,
    cTextSoft,
    cSurface,
    cSurfaceAlt,
    cBorder,
    cBorderStrong,
    cSurfaceSoft,
    cPage,
    cDanger,
    cSuccess,
    cHeroGradient,
    cGlassSurface,
    cSoftShadow,
    cStrongShadow,
    cInputBg,
    cInputMutedBg,
    cInputBorder,
    cPlaceholder,
    cSuccessSoftBg,
    cDangerSoftBg,
    cFormInfoBg,
    cSurfaceElevated,
    cSurfaceMuted,
    cBadgeBg,
    cDangerAccentSoft,
    cSuccessAccentSoft,
    cIconButtonHover,
    cIconButtonMutedBg,
    cCardShadow,
    cFabShadow,
    mobileLedgerPalette,
    androidTheme,
    dashboardPalette,
    dashboardHeroGradient,
  };
};
