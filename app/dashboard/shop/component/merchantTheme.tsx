import {
  Box,
  Circle,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import RegisterInput, {
  type RegisterInputProps,
} from "../../../(authentication)/signUp/components/RegisterInput";
import {
  dashboardFormPalette,
  dashboardPalette,
} from "../../../layouts/dashboardLayout/dashboardPalette";

export type MerchantSectionTint =
  | "blue"
  | "green"
  | "violet"
  | "cyan"
  | "amber"
  | "rose";

type MerchantTone = {
  gradient: string;
  glow: string;
  soft: string;
  iconBg: string;
  iconColor: string;
  text: string;
  border: string;
};

const MERCHANT_TONES: Record<"light" | "dark", Record<MerchantSectionTint, MerchantTone>> = {
  light: {
    blue: {
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      glow: "rgba(59, 130, 246, 0.14)",
      soft: "rgba(59, 130, 246, 0.08)",
      iconBg: "#EAF2FF",
      iconColor: "#2563EB",
      text: "#1D4ED8",
      border: "rgba(59, 130, 246, 0.16)",
    },
    green: {
      gradient: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
      glow: "rgba(34, 197, 94, 0.14)",
      soft: "rgba(34, 197, 94, 0.08)",
      iconBg: "#EAFBF0",
      iconColor: "#15803D",
      text: "#15803D",
      border: "rgba(34, 197, 94, 0.16)",
    },
    violet: {
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      glow: "rgba(139, 92, 246, 0.14)",
      soft: "rgba(139, 92, 246, 0.08)",
      iconBg: "#F1EBFF",
      iconColor: "#7C3AED",
      text: "#6D28D9",
      border: "rgba(139, 92, 246, 0.16)",
    },
    cyan: {
      gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
      glow: "rgba(6, 182, 212, 0.14)",
      soft: "rgba(6, 182, 212, 0.08)",
      iconBg: "#E6FBFF",
      iconColor: "#0891B2",
      text: "#0E7490",
      border: "rgba(6, 182, 212, 0.16)",
    },
    amber: {
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      glow: "rgba(245, 158, 11, 0.14)",
      soft: "rgba(245, 158, 11, 0.08)",
      iconBg: "#FFF6E2",
      iconColor: "#D97706",
      text: "#B45309",
      border: "rgba(245, 158, 11, 0.18)",
    },
    rose: {
      gradient: "linear-gradient(135deg, #FB7185 0%, #E11D48 100%)",
      glow: "rgba(251, 113, 133, 0.14)",
      soft: "rgba(251, 113, 133, 0.08)",
      iconBg: "#FFE8EE",
      iconColor: "#E11D48",
      text: "#BE123C",
      border: "rgba(251, 113, 133, 0.18)",
    },
  },
  dark: {
    blue: {
      gradient: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
      glow: "rgba(59, 130, 246, 0.22)",
      soft: "rgba(59, 130, 246, 0.12)",
      iconBg: "rgba(59, 130, 246, 0.14)",
      iconColor: "#93C5FD",
      text: "#93C5FD",
      border: "rgba(59, 130, 246, 0.24)",
    },
    green: {
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      glow: "rgba(16, 185, 129, 0.22)",
      soft: "rgba(16, 185, 129, 0.12)",
      iconBg: "rgba(16, 185, 129, 0.14)",
      iconColor: "#6EE7B7",
      text: "#6EE7B7",
      border: "rgba(16, 185, 129, 0.24)",
    },
    violet: {
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
      glow: "rgba(139, 92, 246, 0.22)",
      soft: "rgba(139, 92, 246, 0.12)",
      iconBg: "rgba(139, 92, 246, 0.14)",
      iconColor: "#C4B5FD",
      text: "#C4B5FD",
      border: "rgba(139, 92, 246, 0.24)",
    },
    cyan: {
      gradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
      glow: "rgba(6, 182, 212, 0.22)",
      soft: "rgba(6, 182, 212, 0.12)",
      iconBg: "rgba(6, 182, 212, 0.14)",
      iconColor: "#67E8F9",
      text: "#67E8F9",
      border: "rgba(6, 182, 212, 0.24)",
    },
    amber: {
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      glow: "rgba(245, 158, 11, 0.22)",
      soft: "rgba(245, 158, 11, 0.12)",
      iconBg: "rgba(245, 158, 11, 0.14)",
      iconColor: "#FCD34D",
      text: "#FCD34D",
      border: "rgba(245, 158, 11, 0.24)",
    },
    rose: {
      gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
      glow: "rgba(244, 63, 94, 0.22)",
      soft: "rgba(244, 63, 94, 0.12)",
      iconBg: "rgba(244, 63, 94, 0.14)",
      iconColor: "#FDA4AF",
      text: "#FDA4AF",
      border: "rgba(244, 63, 94, 0.24)",
    },
  },
};

export const useMerchantTone = (tint: MerchantSectionTint = "blue") =>
  useColorModeValue(MERCHANT_TONES.light[tint], MERCHANT_TONES.dark[tint]);

export const useMerchantFormSx = () => {
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("#F3F7FD", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("#CBD5E1", dashboardPalette.borderStrong);
  const cAccent = useColorModeValue("#2563EB", dashboardPalette.accent);
  const cAccentStrong = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);
  const cAccentSoft = useColorModeValue("rgba(37, 99, 235, 0.08)", dashboardPalette.accentSoft);
  const cText = useColorModeValue("#0F172A", dashboardPalette.text);
  const cTextMuted = useColorModeValue("#475569", dashboardPalette.textMuted);
  const cTextSoft = useColorModeValue("#64748B", dashboardPalette.textSoft);
  const cDanger = useColorModeValue("#EF4444", dashboardPalette.danger);
  const cSuccess = useColorModeValue("#22C55E", dashboardPalette.success);
  const cInputBg = useColorModeValue("#F8FAFD", dashboardFormPalette.inputBg);
  const cInputBorder = useColorModeValue("#E2E8F0", dashboardFormPalette.inputBorder);
  const cInputPlaceholder = useColorModeValue("#94A3B8", dashboardFormPalette.inputPlaceholder);
  const cTagBg = useColorModeValue("rgba(37, 99, 235, 0.08)", dashboardFormPalette.tagBg);
  const cTagButtonBg = useColorModeValue("#EFF6FF", dashboardFormPalette.tagButtonBg);
  const cFileDropBg = useColorModeValue("rgba(148, 163, 184, 0.06)", dashboardFormPalette.fileDropBg);
  const cFileDropBorder = useColorModeValue("#CBD5E1", dashboardFormPalette.fileDropBorder);
  const cFileRowBg = useColorModeValue("#FFFFFF", dashboardFormPalette.fileRowBg);
  const cFileRowBorder = useColorModeValue("#E2E8F0", dashboardFormPalette.fileRowBorder);
  const cCheckboxBg = useColorModeValue("white", dashboardFormPalette.checkboxBg);
  const cCheckboxBorder = useColorModeValue("#CBD5E1", dashboardFormPalette.checkboxBorder);
  const cCheckboxActiveBg = useColorModeValue("#2563EB", dashboardPalette.accent);

  return {
    "--dashboard-surface": cSurface,
    "--dashboard-surface-alt": cSurfaceAlt,
    "--dashboard-surface-soft": cSurfaceSoft,
    "--dashboard-border": cBorder,
    "--dashboard-border-strong": cBorderStrong,
    "--dashboard-accent": cAccent,
    "--dashboard-accent-strong": cAccentStrong,
    "--dashboard-accent-soft": cAccentSoft,
    "--dashboard-text": cText,
    "--dashboard-text-muted": cTextMuted,
    "--dashboard-text-soft": cTextSoft,
    "--dashboard-danger": cDanger,
    "--dashboard-success": cSuccess,
    "--dashboard-input-bg": cInputBg,
    "--dashboard-input-border": cInputBorder,
    "--dashboard-input-text": cText,
    "--dashboard-input-placeholder": cInputPlaceholder,
    "--dashboard-tag-bg": cTagBg,
    "--dashboard-tag-text": cAccentStrong,
    "--dashboard-tag-button-bg": cTagButtonBg,
    "--dashboard-tag-button-text": cAccentStrong,
    "--dashboard-file-drop-bg": cFileDropBg,
    "--dashboard-file-drop-border": cFileDropBorder,
    "--dashboard-file-drop-text": cTextMuted,
    "--dashboard-file-drop-button-bg": "transparent",
    "--dashboard-file-drop-button-text": cAccentStrong,
    "--dashboard-file-row-bg": cFileRowBg,
    "--dashboard-file-row-border": cFileRowBorder,
    "--dashboard-file-row-text": cText,
    "--dashboard-checkbox-bg": cCheckboxBg,
    "--dashboard-checkbox-border": cCheckboxBorder,
    "--dashboard-checkbox-active-bg": cCheckboxActiveBg,
    "& .chakra-divider": {
      borderColor: "var(--dashboard-border)",
    },
    "& .chakra-checkbox__control": {
      bg: "var(--dashboard-checkbox-bg)",
      borderColor: "var(--dashboard-checkbox-border)",
      borderRadius: "6px",
    },
    "& .chakra-checkbox__control[data-checked]": {
      bg: "var(--dashboard-checkbox-active-bg)",
      borderColor: "var(--dashboard-accent)",
      color: "white",
    },
    "& .chakra-checkbox__label": {
      color: "var(--dashboard-text-muted)",
    },
  };
};

type MerchantTextFieldProps = RegisterInputProps & {
  showError?: boolean;
};

export function MerchantTextField({
  showError,
  error,
  accentColor,
  ...props
}: MerchantTextFieldProps) {
  const defaultAccent = useColorModeValue("#2563EB", dashboardPalette.accentStrong);

  return (
    <RegisterInput
      {...props}
      accentColor={accentColor || defaultAccent}
      error={showError ? error : undefined}
    />
  );
}

export function MerchantSectionCard({
  icon,
  title,
  description,
  tint = "blue",
  children,
}: {
  icon: any;
  title: string;
  description?: string;
  tint?: MerchantSectionTint;
  children: React.ReactNode;
}) {
  const tone = useMerchantTone(tint);
  const bg = useColorModeValue("rgba(255, 255, 255, 0.98)", "rgba(11, 17, 32, 0.94)");
  const borderColor = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const titleColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const descColor = useColorModeValue("#64748B", dashboardPalette.textSoft);

  return (
    <Box
      className="merchant-section-card"
      bg={bg}
      borderRadius={{ base: "0", sm: "28px" }}
      border="1px solid"
      borderColor={borderColor}
      borderLeftWidth={{ base: "0", sm: "1px" }}
      borderRightWidth={{ base: "0", sm: "1px" }}
      overflow="hidden"
      position="relative"
      boxShadow={{ base: "none", md: `0 4px 8px ${tone.glow}` }}
    >
      <Box position="absolute" insetX={0} top={0} h="3px" bg={tone.gradient} />
      <Box
        position="absolute"
        top="-32px"
        right="-24px"
        w={{ base: "120px", md: "160px" }}
        h={{ base: "120px", md: "160px" }}
        borderRadius="full"
        bg={tone.soft}
        filter="blur(26px)"
        pointerEvents="none"
      />

      <Box px={{ base: 4, sm: 5, md: 6 }} py={{ base: 5, md: 6 }} position="relative" zIndex={1}>
        <Flex direction="column" gap={{ base: 5, md: 6 }}>
          <Flex align="center" gap={4}>
            <Circle
              size={{ base: "44px", md: "50px" }}
              bg={tone.iconBg}
              boxShadow={{ base: "none", md: `0 8px 18px ${tone.glow}` }}
            >
              <Icon as={icon} color={tone.iconColor} boxSize={{ base: 5, md: 6 }} />
            </Circle>
            <Box>
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color={titleColor} letterSpacing="-0.02em">
                {title}
              </Text>
              {description ? (
                <Text mt={1} fontSize={{ base: "sm", md: "md" }} color={descColor} maxW="2xl">
                  {description}
                </Text>
              ) : null}
            </Box>
          </Flex>

          {children}
        </Flex>
      </Box>
    </Box>
  );
}
