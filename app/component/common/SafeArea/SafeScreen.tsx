"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

export interface SafeScreenProps extends Omit<BoxProps, "top" | "bottom" | "left" | "right"> {
  children: React.ReactNode;
  /** Apply top safe-area inset (status bar / notch). Default: true */
  safeTop?: boolean;
  /** Apply bottom safe-area inset (home indicator / gesture bar). Default: true */
  safeBottom?: boolean;
  /** Apply left safe-area inset. Default: true */
  safeLeft?: boolean;
  /** Apply right safe-area inset. Default: true */
  safeRight?: boolean;
  /** Specific edges to protect. If omitted, safeTop/Bottom/Left/Right booleans are used */
  edges?: Array<"top" | "bottom" | "left" | "right">;
  /** Include clearance for the floating MobileBottomNav bar (~84px). Default: false */
  includeBottomNav?: boolean;
}

/**
 * SafeScreen component for mobile view.
 * Ensures UI is never cut off by notches, dynamic islands, status bars,
 * software navigation gestures, or floating mobile navbars.
 */
export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  safeTop = true,
  safeBottom = false,
  safeLeft = true,
  safeRight = true,
  edges,
  includeBottomNav = false,
  pt,
  pb,
  pl,
  pr,
  ...rest
}) => {
  const hasTop = edges ? edges.includes("top") : safeTop;
  const hasBottom = edges ? edges.includes("bottom") : safeBottom;
  const hasLeft = edges ? edges.includes("left") : safeLeft;
  const hasRight = edges ? edges.includes("right") : safeRight;

  const topPadding = hasTop
    ? pt !== undefined
      ? `calc(env(safe-area-inset-top, 0px) + ${typeof pt === "number" ? `${pt}px` : pt})`
      : "env(safe-area-inset-top, 0px)"
    : pt;

  const bottomPadding = hasBottom
    ? pb !== undefined
      ? `calc(env(safe-area-inset-bottom, 0px) + ${includeBottomNav ? "84px + " : ""}${typeof pb === "number" ? `${pb}px` : pb})`
      : includeBottomNav
      ? "calc(84px + env(safe-area-inset-bottom, 0px))"
      : "env(safe-area-inset-bottom, 0px)"
    : includeBottomNav
    ? "84px"
    : pb;

  const leftPadding = hasLeft
    ? pl !== undefined
      ? `calc(env(safe-area-inset-left, 0px) + ${typeof pl === "number" ? `${pl}px` : pl})`
      : "env(safe-area-inset-left, 0px)"
    : pl;

  const rightPadding = hasRight
    ? pr !== undefined
      ? `calc(env(safe-area-inset-right, 0px) + ${typeof pr === "number" ? `${pr}px` : pr})`
      : "env(safe-area-inset-right, 0px)"
    : pr;

  return (
    <Box
      w="full"
      maxW="100vw"
      overflowX="hidden"
      boxSizing="border-box"
      pt={topPadding}
      pb={bottomPadding}
      pl={leftPadding}
      pr={rightPadding}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default SafeScreen;
