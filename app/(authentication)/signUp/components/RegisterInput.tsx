"use client";

import { Box, FormControl, Text, useColorModeValue } from "@chakra-ui/react";
import React, { forwardRef, useId, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────*/
interface RegisterInputBaseProps {
  label: string;
  error?: string;
  /** Icon node rendered on the left */
  leftIcon?: React.ReactNode;
  /** Icon node rendered on the right (input only) */
  rightIcon?: React.ReactNode;
  required?: boolean;
  /** Subtle helper text shown below the field when there's no error */
  hint?: string;
  /** Accent color used for focus ring, label, and icon */
  accentColor?: string;
}

export interface RegisterTextInputProps
  extends RegisterInputBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  as?: "input";
  rows?: never;
}

export interface RegisterTextareaProps
  extends RegisterInputBaseProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  as: "textarea";
  /** Number of visible text rows – defaults to 3 */
  rows?: number;
}

export type RegisterInputProps = RegisterTextInputProps | RegisterTextareaProps;

/* ─────────────────────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────────────────────────*/
type InputTokens = {
  borderIdle: string;
  bgIdle: string;
  bgFocus: string;
  textMain: string;
  textLabel: string;
  textMuted: string;
  placeholder: string;
  iconIdle: string;
  errorColor: string;
  errorBorder: string;
};

const LIGHT_TOKENS: InputTokens = {
  borderIdle: "#E2E8F0",
  bgIdle: "#F8FAFD",
  bgFocus: "#FFFFFF",
  textMain: "#1A202C",
  textLabel: "#4A5568",
  textMuted: "#718096",
  placeholder: "#B0BAC9",
  iconIdle: "#B0BAC9",
  errorColor: "#E53E3E",
  errorBorder: "#FC8181",
} as const;

const DARK_TOKENS: InputTokens = {
  borderIdle: "rgba(138, 170, 200, 0.22)",
  bgIdle: "rgba(10, 18, 32, 0.88)",
  bgFocus: "rgba(15, 25, 41, 0.98)",
  textMain: "#EDF2FF",
  textLabel: "#C2D5EA",
  textMuted: "#8AAAC8",
  placeholder: "#6C86A4",
  iconIdle: "#6C86A4",
  errorColor: "#F87171",
  errorBorder: "rgba(248, 113, 113, 0.58)",
} as const;

/* ─────────────────────────────────────────────────────────────
   Style helpers – pure inline styles, no Chakra sx overhead
   (keeps field rendering fast on low-end mobile)
───────────────────────────────────────────────────────────────*/
const getInputStyle = (opts: {
  isFocused: boolean;
  hasError: boolean;
  hasLeft: boolean;
  hasRight: boolean;
  accent: string;
  tokens: InputTokens;
}): React.CSSProperties => {
  const { isFocused, hasError, hasLeft, hasRight, accent, tokens } = opts;

  const borderColor = hasError
    ? tokens.errorBorder
    : isFocused
      ? accent
      : tokens.borderIdle;

  const borderWidth = isFocused ? "2px" : "1.5px";

  const boxShadow = isFocused
    ? `0 0 0 3px ${accent}1f, 0 8px 24px rgba(15, 23, 42, 0.08)`
    : hasError
      ? `0 0 0 2px ${tokens.errorBorder}36`
      : "none";

  return {
    width: "100%",
    background: isFocused ? tokens.bgFocus : tokens.bgIdle,
    border: `${borderWidth} solid ${borderColor}`,
    borderRadius: "14px",
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: hasLeft ? "42px" : "14px",
    paddingRight: hasRight ? "42px" : "14px",
    fontSize: "14px",
    lineHeight: "1.55",
    color: tokens.textMain,
    outline: "none",
    transition: "border 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
    boxShadow,
    WebkitAppearance: "none",
    appearance: "none",
    WebkitTapHighlightColor: "transparent",
    fontFamily: "inherit",
  };
};

const getTextareaStyle = (opts: {
  isFocused: boolean;
  hasError: boolean;
  hasLeft: boolean;
  rows: number;
  accent: string;
  tokens: InputTokens;
}): React.CSSProperties => ({
  ...getInputStyle({ ...opts, hasRight: false }),
  resize: "none",
  minHeight: `${opts.rows * 44}px`,
  paddingTop: "12px",
  paddingBottom: "12px",
  overflowY: "auto",
});

/* ─────────────────────────────────────────────────────────────
   Placeholder colour – injected once via a <style> tag
   (inline styles cannot target ::placeholder)
───────────────────────────────────────────────────────────────*/
const PLACEHOLDER_CSS = `
.reg-field::placeholder { color: var(--reg-placeholder-color); }
`;

let placeholderStyleInjected = false;
function ensurePlaceholderStyle() {
  if (typeof document === "undefined" || placeholderStyleInjected) return;
  const el = document.createElement("style");
  el.textContent = PLACEHOLDER_CSS;
  document.head.appendChild(el);
  placeholderStyleInjected = true;
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────*/
const RegisterInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  RegisterInputProps
>((props, ref) => {
  const {
    label,
    error,
    leftIcon,
    rightIcon,
    required,
    hint,
    accentColor = "#3B82F6",
    as,
    ...rest
  } = props;

  const uid = useId();
  const [isFocused, setIsFocused] = useState(false);
  const tokens = useColorModeValue(LIGHT_TOKENS, DARK_TOKENS);

  // Inject placeholder style once on first render
  React.useEffect(ensurePlaceholderStyle, []);

  const hasError = Boolean(error);
  const hasLeft = Boolean(leftIcon);
  const hasRight = Boolean(rightIcon) && as !== "textarea";

  const rows =
    as === "textarea" ? ((props as RegisterTextareaProps).rows ?? 3) : 0;

  const fieldStyle =
    as === "textarea"
      ? getTextareaStyle({
          isFocused,
          hasError,
          hasLeft,
          rows,
          accent: accentColor,
          tokens,
        })
      : getInputStyle({
          isFocused,
          hasError,
          hasLeft,
          hasRight,
          accent: accentColor,
          tokens,
        });

  const sharedEventProps = {
    id: uid,
    className: "reg-field",
    onFocus: (e: any) => {
      setIsFocused(true);
      (rest as any).onFocus?.(e);
    },
    onBlur: (e: any) => {
      setIsFocused(false);
      (rest as any).onBlur?.(e);
    },
    style: fieldStyle,
  };

  const labelColor = isFocused
    ? accentColor
    : hasError
      ? tokens.errorColor
      : tokens.textLabel;

  return (
    <FormControl isInvalid={hasError} w="full">

      {/* ── Label ── */}
      <Box
        as="label"
        htmlFor={uid}
        display="block"
        fontSize={{ base: "10.5px", md: "11.5px" }}
        fontWeight="700"
        letterSpacing="0.055em"
        textTransform="uppercase"
        mb="6px"
        style={{ color: labelColor, transition: "color 0.18s ease" }}
      >
        {label}
        {required && (
          <Box as="span" ml="2px" style={{ color: tokens.errorColor }}>
            *
          </Box>
        )}
      </Box>

      {/* ── Field wrapper ── */}
      <Box position="relative">

        {/* Left icon */}
        {hasLeft && (
          <Box
            position="absolute"
            left="13px"
            top={as === "textarea" ? "14px" : "50%"}
            transform={as === "textarea" ? "none" : "translateY(-50%)"}
            zIndex={1}
            pointerEvents="none"
            style={{
              color: isFocused ? accentColor : tokens.iconIdle,
              transition: "color 0.18s ease",
              display: "flex",
              alignItems: "center",
            }}
          >
            {leftIcon}
          </Box>
        )}

        {/* Native input / textarea */}
        {as === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows || 3}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            {...sharedEventProps}
            style={{
              ...fieldStyle,
              ["--reg-placeholder-color" as string]: tokens.placeholder,
            }}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            {...sharedEventProps}
            style={{
              ...fieldStyle,
              ["--reg-placeholder-color" as string]: tokens.placeholder,
            }}
          />
        )}

        {/* Right icon (input only) */}
        {hasRight && (
          <Box
            position="absolute"
            right="13px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={1}
            style={{
              color: isFocused ? accentColor : tokens.iconIdle,
              transition: "color 0.18s ease",
              display: "flex",
              alignItems: "center",
            }}
          >
            {rightIcon}
          </Box>
        )}
      </Box>

      {/* ── Error / Hint ── */}
      {hasError ? (
        <Text
          mt="5px"
          fontSize={{ base: "11px", md: "12px" }}
          fontWeight="500"
          lineHeight="1.4"
          style={{ color: tokens.errorColor }}
          display="flex"
          alignItems="flex-start"
          gap="4px"
        >
          <Box as="span" flexShrink={0} mt="1px">⚠</Box>
          {error}
        </Text>
      ) : hint ? (
        <Text
          mt="5px"
          fontSize={{ base: "11px", md: "12px" }}
          lineHeight="1.4"
          style={{ color: tokens.textMuted }}
        >
          {hint}
        </Text>
      ) : null}
    </FormControl>
  );
});

RegisterInput.displayName = "RegisterInput";

export default RegisterInput;
