import React from "react";
import { Box, Circle, Flex, Icon, Text } from "@chakra-ui/react";
import { dashboardFormPalette, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

export const merchantFormSx = {
  "--dashboard-shell-bg": dashboardPalette.shell,
  "--dashboard-surface": dashboardPalette.surface,
  "--dashboard-surface-alt": dashboardPalette.surfaceAlt,
  "--dashboard-surface-soft": dashboardPalette.surfaceSoft,
  "--dashboard-border": dashboardPalette.border,
  "--dashboard-border-strong": dashboardPalette.borderStrong,
  "--dashboard-accent": dashboardPalette.accent,
  "--dashboard-accent-strong": dashboardPalette.accentStrong,
  "--dashboard-accent-soft": dashboardPalette.accentSoft,
  "--dashboard-text": dashboardPalette.text,
  "--dashboard-text-muted": dashboardPalette.textMuted,
  "--dashboard-text-soft": dashboardPalette.textSoft,
  "--dashboard-danger": dashboardPalette.danger,
  "--dashboard-success": dashboardPalette.success,
  "--dashboard-input-bg": dashboardFormPalette.inputBg,
  "--dashboard-input-border": dashboardFormPalette.inputBorder,
  "--dashboard-input-text": dashboardPalette.text,
  "--dashboard-input-placeholder": dashboardFormPalette.inputPlaceholder,
  "--dashboard-tag-bg": dashboardFormPalette.tagBg,
  "--dashboard-tag-text": dashboardPalette.accentStrong,
  "--dashboard-tag-button-bg": dashboardFormPalette.tagButtonBg,
  "--dashboard-tag-button-text": dashboardPalette.accentStrong,
  "--dashboard-file-drop-bg": dashboardFormPalette.fileDropBg,
  "--dashboard-file-drop-border": dashboardFormPalette.fileDropBorder,
  "--dashboard-file-drop-text": dashboardPalette.textMuted,
  "--dashboard-file-drop-button-bg": "transparent",
  "--dashboard-file-drop-button-text": dashboardPalette.accentStrong,
  "--dashboard-file-row-bg": dashboardFormPalette.fileRowBg,
  "--dashboard-file-row-border": dashboardFormPalette.fileRowBorder,
  "--dashboard-file-row-text": dashboardPalette.text,
  "--dashboard-checkbox-bg": dashboardFormPalette.checkboxBg,
  "--dashboard-checkbox-border": dashboardFormPalette.checkboxBorder,
  "--dashboard-checkbox-active-bg": dashboardFormPalette.checkboxActiveBg,
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
    bg: "rgba(255,255,255,0.04)",
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
    color: "var(--dashboard-accent)",
  },
  "& .chakra-checkbox__label": {
    color: "var(--dashboard-text-muted)",
  },
};

export const merchantSectionCardStyles = {
  bg: "var(--dashboard-surface)",
  borderRadius: "22px",
  border: "1px solid",
  borderColor: "var(--dashboard-border)",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
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
  return (
    <Box className="merchant-section-card" {...merchantSectionCardStyles}>
      <Flex
        bg="rgba(255,255,255,0.02)"
        px={{ base: 4, md: 5 }}
        py={4}
        align="center"
        gap={3}
        borderBottom="1px solid"
        borderColor="var(--dashboard-border)"
      >
        <Circle size="44px" bg="rgba(214, 183, 114, 0.10)">
          <Icon as={icon} color="var(--dashboard-accent)" boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color="var(--dashboard-text)">
            {title}
          </Text>
          {description ? (
            <Text fontSize="sm" color="var(--dashboard-text-soft)" lineHeight="1.4">
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
