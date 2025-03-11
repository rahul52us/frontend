import { action, makeObservable, observable } from "mobx";
import _ from "lodash";
import { LOCALSTORAGE_THEME_STORE } from "../config/utils/variables";

class ThemeStore {
  openThemeDrawer = {
    open: false,
  };

  backthemeConfig = {
    fonts: {
      size: {
        xs: "0.75rem",  // Smaller base for mobile
        sm: "0.875rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "1.875rem",
        "3xl": "2.25rem",
        "4xl": "3rem",
      },
    },
    colors: {
      brand: {
        50: "#f0fdfa",  // Light teal for subtle backgrounds
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6", // Primary teal for buttons/CTAs
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a",
      },
      light: {
        primary: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15", // Bright yellow for promotions
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        secondary: "#ffffff", // Clean white for backgrounds
        text: "#1f2937",      // Dark gray for readable text
      },
      dark: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c", // Warm orange for dark mode CTAs
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        secondary: "#111827", // Dark gray for backgrounds
        text: "#e5e7eb",      // Light gray for readable text
      },
      custom: {
        light: {
          primary: "#14b8a6", // Teal for consistency
          secondary: "#ffffff",
          accent: "#facc15",  // Yellow for highlights
        },
        dark: {
          primary: "#fb923c", // Orange for dark mode
          secondary: "#111827",
          accent: "#fed7aa",  // Softer orange accent
        },
      },
      gray: { // Added for neutral elements (borders, secondary text)
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },
    },
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
  };

  themeConfig = { ...this.backthemeConfig };

  constructor() {
    makeObservable(this, {
      themeConfig: observable,
      openThemeDrawer: observable,
      setOpenThemeDrawer: action,
      setThemeConfig: action,
      resetTheme: action,
    });

    if (typeof window !== "undefined") {
      const storedThemeConfig = localStorage.getItem(LOCALSTORAGE_THEME_STORE!);
      if (storedThemeConfig) {
        try {
          this.themeConfig = JSON.parse(storedThemeConfig);
        } catch ({}) {
          this.resetTheme();
        }
      }
    }
  }

  setThemeConfig = (key: string, value: any) => {
    _.set(this.themeConfig, key, value);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALSTORAGE_THEME_STORE!, JSON.stringify(this.themeConfig));
    }
  };

  setOpenThemeDrawer = () => {
    this.openThemeDrawer.open = !this.openThemeDrawer.open;
  };

  resetTheme = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCALSTORAGE_THEME_STORE!);
    }
    this.themeConfig = { ...this.backthemeConfig };
  };
}

export const theme = new ThemeStore();