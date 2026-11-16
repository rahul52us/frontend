"use client";

import { Box, IconButton, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useAppTheme } from "./ThemeContext";

const iconTransition = {
  duration: 0.5,
  ease: [0.34, 1.56, 0.64, 1], // springy back-ease overshoot
};

const exitTransition = {
  duration: 0.3,
  ease: [0.5, 0, 0.75, 0],
};

/**
 * Single-click Theme Toggle — Light ↔ Dark.
 * Smooth morph between sun and moon.
 */
export const ThemeModeSwitcher: React.FC = () => {
  const { resolvedTheme, setMode } = useAppTheme();
  const isDark = resolvedTheme === "dark";

  const toggle = () => setMode(isDark ? "light" : "dark");

  const bgBtn = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.06)");
  const borderBtn = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.12)");
  const textBtn = useColorModeValue("gray.700", "gray.200");
  const hoverBg = useColorModeValue("gray.100", "rgba(255, 255, 255, 0.1)");

  return (
    <Tooltip label={isDark ? "Switch to Light" : "Switch to Dark"} openDelay={300}>
      <IconButton
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        onClick={toggle}
        variant="ghost"
        bg={bgBtn}
        color={textBtn}
        border="1px solid"
        borderColor={borderBtn}
        borderRadius="12px"
        _hover={{
          color: "var(--color-primary)",
          bg: hoverBg,
          borderColor: "var(--color-primary-border)",
        }}
        _active={{ transform: "scale(0.92)" }}
        icon={
          <Box position="relative" width="18px" height="18px">
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                /* ---------- MOON ---------- */
                <motion.div
                  key="moon"
                  style={{ position: "absolute", inset: 0, display: "flex" }}
                  initial={{ rotate: -140, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 140, scale: 0, opacity: 0 }}
                  transition={iconTransition}
                >
                  {/* halo glow behind the moon */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(120,140,255,0.25) 0%, transparent 70%)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  />
                  <Box as={FiMoon} size="18px" />
                </motion.div>
              ) : (
                /* ---------- SUN ---------- */
                <motion.div
                  key="sun"
                  style={{ position: "absolute", inset: 0, display: "flex" }}
                  initial={{ rotate: 140, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -140, scale: 0, opacity: 0 }}
                  transition={iconTransition}
                >
                  {/* slow perpetual spin once settled */}
                  <motion.div
                    style={{ display: "flex" }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 24,
                      ease: "linear",
                      // repeat: 2,
                      delay: 0.5,
                    }}
                  >
                    <Box as={FiSun} size="18px" />
                  </motion.div>

                  {/* warm pulse ring on arrival */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: -3,
                      borderRadius: "50%",
                      border: "1.5px solid currentColor",
                      opacity: 0,
                    }}
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        }
      />
    </Tooltip>
  );
};

export default ThemeModeSwitcher;