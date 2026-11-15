"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorMode } from "@chakra-ui/react";
import { themeConfig, ThemeConfig, ThemeColors } from "./themeConfig";
import { generateCssVariables, getSemanticTokens, SemanticTokens } from "./tokens";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  tokens: SemanticTokens;
  config: ThemeConfig;
}

const STORAGE_KEY = "app_theme_mode";
const CHAKRA_STORAGE_KEY = "chakra-ui-color-mode";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  config = themeConfig,
}: {
  children: React.ReactNode;
  config?: ThemeConfig;
}) {
  let chakraColorMode: string | undefined;
  let setColorMode: ((val: string) => void) | undefined;
  try {
    const chakra = useColorMode();
    chakraColorMode = chakra?.colorMode;
    setColorMode = chakra?.setColorMode;
  } catch {
    // ChakraProvider context not available
  }

  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  const tokens = useMemo(() => getSemanticTokens(config.colors), [config.colors]);
  const cssVariables = useMemo(() => generateCssVariables(config.colors), [config.colors]);

  // Determine system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  // Compute resolved mode based on mode setting
  const computeResolvedTheme = useCallback(
    (currentMode: ThemeMode): ResolvedTheme => {
      if (currentMode === "system") {
        return getSystemTheme();
      }
      return currentMode;
    },
    [getSystemTheme]
  );

  // Apply attributes to DOM
  const applyThemeToDom = useCallback((resolved: ResolvedTheme) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute("data-theme", resolved);
    body.setAttribute("data-theme", resolved);

    if (resolved === "dark") {
      root.classList.add("chakra-ui-dark");
      root.classList.remove("chakra-ui-light");
      body.classList.add("chakra-ui-dark");
      body.classList.remove("chakra-ui-light");
    } else {
      root.classList.add("chakra-ui-light");
      root.classList.remove("chakra-ui-dark");
      body.classList.add("chakra-ui-light");
      body.classList.remove("chakra-ui-dark");
    }
  }, []);

  // Change theme mode
  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      setModeState(nextMode);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, nextMode);
        } catch {
          // ignore localStorage access errors
        }
      }

      const nextResolved = computeResolvedTheme(nextMode);
      setResolvedTheme(nextResolved);
      if (typeof setColorMode === "function") {
        setColorMode(nextResolved);
      }
      applyThemeToDom(nextResolved);

      try {
        localStorage.setItem(CHAKRA_STORAGE_KEY, nextResolved);
      } catch {
        // ignore
      }
    },
    [computeResolvedTheme, setColorMode, applyThemeToDom]
  );

  // Initialize from storage on mount
  useEffect(() => {
    setMounted(true);

    let savedMode: ThemeMode = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        savedMode = stored;
      } else {
        const chakraStored = localStorage.getItem(CHAKRA_STORAGE_KEY);
        if (chakraStored === "dark" || chakraStored === "light") {
          savedMode = chakraStored;
        }
      }
    } catch {
      // fallback
    }

    setModeState(savedMode);
    const resolved = computeResolvedTheme(savedMode);
    setResolvedTheme(resolved);
    if (typeof setColorMode === "function") {
      setColorMode(resolved);
    }
    applyThemeToDom(resolved);
  }, [computeResolvedTheme, setColorMode, applyThemeToDom]);

  // Listen for OS system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (mode === "system") {
        const nextResolved = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        if (typeof setColorMode === "function") {
          setColorMode(nextResolved);
        }
        applyThemeToDom(nextResolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, setColorMode, applyThemeToDom]);

  // Keep Chakra's colorMode in sync if modified elsewhere
  useEffect(() => {
    if (mounted && mode !== "system" && chakraColorMode) {
      if (chakraColorMode !== resolvedTheme) {
        setResolvedTheme(chakraColorMode as ResolvedTheme);
        setModeState(chakraColorMode as ThemeMode);
      }
    }
  }, [chakraColorMode, mounted, mode, resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      colors: config.colors,
      tokens,
      config,
    }),
    [mode, resolvedTheme, setMode, config, tokens]
  );

  return (
    <ThemeContext.Provider value={value}>
      {/* Inject CSS variables into head */}
      <style
        id="app-theme-variables"
        dangerouslySetInnerHTML={{ __html: cssVariables }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
