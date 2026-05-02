import React from "react";
import { Box, Circle, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { dashboardFormPalette, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

export const useMerchantFormSx = () => {
  const cShell = useColorModeValue(dashboardPalette.shell, dashboardPalette.shell);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cTextSoft = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
  const cSuccess = useColorModeValue("green.500", dashboardPalette.success);
  const cInputBg = useColorModeValue("white", dashboardFormPalette.inputBg);
  const cInputBorder = useColorModeValue("gray.200", dashboardFormPalette.inputBorder);
  const cInputPlaceholder = useColorModeValue("gray.400", dashboardFormPalette.inputPlaceholder);
  const cTagBg = useColorModeValue("blue.50", dashboardFormPalette.tagBg);
  const cTagButtonBg = useColorModeValue("blue.100", dashboardFormPalette.tagButtonBg);
  const cFileDropBg = useColorModeValue("gray.50", dashboardFormPalette.fileDropBg);
  const cFileDropBorder = useColorModeValue("gray.300", dashboardFormPalette.fileDropBorder);
  const cFileRowBg = useColorModeValue("white", dashboardFormPalette.fileRowBg);
  const cFileRowBorder = useColorModeValue("gray.100", dashboardFormPalette.fileRowBorder);
  const cCheckboxBg = useColorModeValue("white", dashboardFormPalette.checkboxBg);
  const cCheckboxBorder = useColorModeValue("gray.300", dashboardFormPalette.checkboxBorder);
  const cCheckboxActiveBg = useColorModeValue("blue.600", dashboardPalette.accent);

  return {
    "--dashboard-shell-bg": cShell,
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
    "& .chakra-form__label": {
      color: "var(--dashboard-text-muted)",
      fontSize: "0.72rem",
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: 2,
    },
    "& .chakra-input, & .chakra-textarea": {
      bg: "var(--dashboard-input-bg)",
      borderColor: "var(--dashboard-input-border)",
      color: "var(--dashboard-input-text)",
      borderRadius: "16px",
      minHeight: "52px",
    },
    "& .chakra-input::placeholder, & .chakra-textarea::placeholder": {
      color: "var(--dashboard-input-placeholder)",
    },
    "& .chakra-input:hover, & .chakra-textarea:hover": {
      borderColor: "var(--dashboard-accent)",
    },
    "& .chakra-input:focus-visible, & .chakra-textarea:focus-visible": {
      borderColor: "var(--dashboard-accent)",
      boxShadow: "0 0 0 1px var(--dashboard-accent)",
    },
    "& .chakra-input[disabled], & .chakra-textarea[disabled]": {
      opacity: 0.72,
      cursor: "not-allowed",
    },
    "& .chakra-divider": {
      borderColor: "var(--dashboard-border)",
    },
    "& .chakra-progress": {
      bg: useColorModeValue("gray.100", "rgba(255,255,255,0.04)"),
      borderRadius: "999px",
      overflow: "hidden",
    },
    "& .chakra-progress__filled-track": {
      background: "linear-gradient(90deg, var(--dashboard-accent) 0%, var(--dashboard-accent-strong) 100%)",
    },
    "& .chakra-checkbox__control": {
      bg: "var(--dashboard-checkbox-bg)",
      borderColor: "var(--dashboard-checkbox-border)",
    },
    "& .chakra-checkbox__control[data-checked]": {
      bg: "var(--dashboard-checkbox-active-bg)",
      borderColor: "var(--dashboard-accent)",
      color: useColorModeValue("white", "var(--dashboard-accent)"),
    },
    "& .chakra-checkbox__label": {
      color: "var(--dashboard-text-muted)",
    },
  };
};

export const MerchantSectionCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  const bg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("gray.100", dashboardPalette.border);
  const headerBg = useColorModeValue("gray.50", "rgba(255,255,255,0.02)");
  const titleColor = useColorModeValue("gray.800", dashboardPalette.text);
  const descColor = useColorModeValue("gray.500", dashboardPalette.textSoft);
  const iconBg = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const iconColor = useColorModeValue("blue.600", dashboardPalette.accentStrong);

  return (
    <Box
      className="merchant-section-card"
      bg={bg}
      borderRadius="22px"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      boxShadow={useColorModeValue("sm", "0 18px 40px rgba(0, 0, 0, 0.28)")}
    >
      <Flex
        bg={headerBg}
        px={{ base: 4, md: 5 }}
        py={4}
        align="center"
        gap={3}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Circle size="44px" bg={iconBg}>
          <Icon as={icon} color={iconColor} boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color={titleColor}>
            {title}
          </Text>
          {description ? (
            <Text fontSize="sm" color={descColor} lineHeight="1.4">
              {description}
            </Text>
          ) : null}
        </Box>
      </Flex>
      <Box px={{ base: 4, md: 5 }} py={{ base: 5, md: 6 }}>
        {children}
      </Box>
    </Box>
  );
};
