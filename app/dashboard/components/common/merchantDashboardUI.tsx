import {
  Badge,
  Box,
  ButtonProps,
  Circle,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  // keyframes,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React from "react";
import { dashboardHeroGradient, dashboardHeroGradientLight, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { useMerchantFormSx } from "../../shop/component/merchantTheme";

type MerchantBadgeTone = "accent" | "success" | "danger" | "soft" | "info" | "warning";

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const merchantSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const merchantPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
  70%  { box-shadow: 0 0 0 7px transparent; opacity: 0.85; }
  100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
`;

/** Staggered entrance animation. Usage: <Box animation={merchantFadeUp(index * 60)} /> */
export const merchantFadeUp = (delay = 0) =>
  `${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`;

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

export const merchantBadgeStyles = {
  borderRadius: "full",
  px: 3,
  py: 1.5,
  border: "1px solid",
  fontWeight: "700",
};

export const MerchantBadge = ({
  tone = "soft",
  children,
  ...props
}: {
  tone?: MerchantBadgeTone;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const toneMap: Record<MerchantBadgeTone, { bg: string; color: string; borderColor: string }> = {
    accent: {
      bg: useColorModeValue("brand.50", dashboardPalette.accentSoft),
      color: useColorModeValue("brand.700", dashboardPalette.accentStrong),
      borderColor: useColorModeValue("brand.200", dashboardPalette.borderAccent),
    },
    success: {
      bg: useColorModeValue("green.50", dashboardPalette.successSoft),
      color: useColorModeValue("green.700", dashboardPalette.success),
      borderColor: useColorModeValue("green.200", dashboardPalette.successBorder),
    },
    danger: {
      bg: useColorModeValue("red.50", dashboardPalette.dangerSoft),
      color: useColorModeValue("red.600", dashboardPalette.danger),
      borderColor: useColorModeValue("red.200", dashboardPalette.dangerBorder),
    },
    info: {
      bg: useColorModeValue("purple.50", dashboardPalette.infoSoft),
      color: useColorModeValue("purple.700", dashboardPalette.info),
      borderColor: useColorModeValue("purple.200", dashboardPalette.infoBorder),
    },
    warning: {
      bg: useColorModeValue("orange.50", dashboardPalette.warningSoft),
      color: useColorModeValue("orange.700", dashboardPalette.warning),
      borderColor: useColorModeValue("orange.200", dashboardPalette.warningBorder),
    },
    soft: {
      bg: useColorModeValue("gray.50", dashboardPalette.surfaceAlt),
      color: useColorModeValue("gray.600", dashboardPalette.textMuted),
      borderColor: useColorModeValue("gray.200", dashboardPalette.borderStrong),
    },
  };

  const toneStyles = toneMap[tone];

  return (
    <Badge
      {...merchantBadgeStyles}
      bg={toneStyles.bg}
      color={toneStyles.color}
      borderColor={toneStyles.borderColor}
      {...props}
    >
      {children}
    </Badge>
  );
};

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export const merchantGhostButtonProps: ButtonProps = {
  borderRadius: "14px",
  border: "1px solid",
  borderColor: "var(--merchant-border-strong)",
  bg: "var(--merchant-surface-alt)",
  color: "var(--merchant-text-muted)",
  fontWeight: "600",
  transition: "all 0.2s ease",
  _hover: { bg: "var(--merchant-surface-soft)", color: "var(--merchant-text)" },
  _active: { transform: "scale(0.98)" },
};

export const merchantPrimaryButtonProps: ButtonProps = {
  borderRadius: "14px",
  bg: "var(--merchant-accent)",
  color: "white",
  fontWeight: "600",
  transition: "all 0.2s ease",
  _hover: { bg: "var(--merchant-accent-strong)" },
  _active: { transform: "scale(0.98)" },
};

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

export const MerchantPageShell = ({
  children,
  maxW = "100%",
}: {
  children: React.ReactNode;
  maxW?: any;
}) => {
  const formSx = useMerchantFormSx();

  // CSS variables shared by every child component
  const themeVars = {
    "--merchant-border": useColorModeValue("var(--chakra-colors-gray-200)", dashboardPalette.border),
    "--merchant-border-strong": useColorModeValue("var(--chakra-colors-brand-100)", dashboardPalette.borderStrong),
    "--merchant-surface": useColorModeValue("var(--chakra-colors-white)", dashboardPalette.surface),
    "--merchant-surface-alt": useColorModeValue("var(--chakra-colors-gray-50)", dashboardPalette.surfaceAlt),
    "--merchant-surface-soft": useColorModeValue("var(--chakra-colors-gray-100)", dashboardPalette.surfaceSoft),
    "--merchant-text-muted": useColorModeValue("var(--chakra-colors-gray-500)", dashboardPalette.textMuted),
    "--merchant-text": useColorModeValue("var(--chakra-colors-gray-800)", dashboardPalette.text),
    "--merchant-accent": useColorModeValue("var(--color-primary, #065F68)", "var(--color-primary, #3b82f6)"),
    "--merchant-accent-strong": useColorModeValue("var(--color-primary-hover, #044249)", "var(--color-primary, #2563eb)"),
    "--merchant-page-bg": useColorModeValue("var(--chakra-colors-gray-50)", dashboardPalette.page),
  };

  return (
    <Box minH="100%" bg="transparent" style={themeVars as any}>
      <Container
        maxW={maxW}
        px={{ base: 3, sm: 4, md: 5 }}
        py={{ base: 2, md: 3 }}
        sx={{
          ...(formSx as any),
          "@media (prefers-reduced-motion: reduce)": {
            "*": { animation: "none !important", transition: "none !important" },
          },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Page header — one slim row on mobile                                */
/* ------------------------------------------------------------------ */

export const MerchantPageHeader = ({
  icon,
  title,
  description,
  badges,
  actions,
  mobileActions,
  mb = { base: 2, md: 6 },
}: {
  icon?: any;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Desktop only */
  badges?: React.ReactNode;
  /** Desktop only */
  actions?: React.ReactNode;
  /** Mobile only — keep it to compact icon buttons */
  mobileActions?: React.ReactNode;
  mb?: any;
}) => {
  const iconBg = useColorModeValue("brand.50", dashboardPalette.accentSoft);
  const iconColor = useColorModeValue("brand.600", dashboardPalette.accentStrong);

  return (
    <Flex justify="space-between" align="center" gap={3} mb={mb} animation={merchantFadeUp(0)}>
      <HStack spacing={{ base: 2.5, md: 3 }} align="center" minW={0}>
        {icon ? (
          <Circle size={{ base: "9", md: "12" }} bg={iconBg} flexShrink={0}>
            <Icon as={icon} boxSize={{ base: 4, md: 6 }} color={iconColor} />
          </Circle>
        ) : null}
        <Box minW={0}>
          <Heading
            as="h1"
            fontSize={{ base: "lg", md: "2xl" }}
            fontWeight="800"
            letterSpacing="-0.02em"
            lineHeight="1.2"
            color="var(--merchant-text)"
            noOfLines={1}
          >
            {title}
          </Heading>
          {description ? (
            <Text
              display={{ base: "none", md: "block" }}
              fontSize="sm"
              color="var(--merchant-text-muted)"
              mt={0.5}
              noOfLines={1}
            >
              {description}
            </Text>
          ) : null}
        </Box>
      </HStack>

      {mobileActions ? (
        <HStack display={{ base: "flex", md: "none" }} spacing={2} flexShrink={0}>
          {mobileActions}
        </HStack>
      ) : null}

      {(badges || actions) && (
        <Flex display={{ base: "none", md: "flex" }} align="center" gap={2} flexWrap="wrap" justify="flex-end">
          {badges}
          {actions}
        </Flex>
      )}
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/* Section title                                                       */
/* ------------------------------------------------------------------ */

export const MerchantSectionHeader = ({
  title,
  subtitle,
  right,
  mb = 4,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  mb?: any;
}) => (
  <Flex
    justify="space-between"
    align={{ base: "flex-start", sm: "center" }}
    direction={{ base: "column", sm: "row" }}
    gap={{ base: 2, sm: 3 }}
    mb={mb}
  >
    <Box minW={0} flex={1}>
      <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color="var(--merchant-text)" lineHeight="1.3">
        {title}
      </Text>
      {subtitle ? (
        <Text fontSize="xs" color="var(--merchant-text-muted)" mt={0.5}>
          {subtitle}
        </Text>
      ) : null}
    </Box>
    {right ? (
      <Box alignSelf={{ base: "stretch", sm: "auto" }}>
        {right}
      </Box>
    ) : null}
  </Flex>
);

/* ------------------------------------------------------------------ */
/* Hero (kept for other pages that still use it)                       */
/* ------------------------------------------------------------------ */

export const MerchantHeroSection = ({
  icon,
  primaryBadge,
  extraBadges,
  title,
  description,
  leftFooter,
  rightContent,
  maxW = "3xl",
  mb = 6,
  gap = 6,
  align = { base: "start", xl: "center" },
  direction = { base: "column", xl: "row" },
  descriptionMaxW = "2xl",
  glowProps,
}: {
  icon: any;
  primaryBadge: React.ReactNode;
  extraBadges?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  leftFooter?: React.ReactNode;
  rightContent?: React.ReactNode;
  maxW?: any;
  mb?: any;
  gap?: any;
  align?: any;
  direction?: any;
  descriptionMaxW?: any;
  glowProps?: Record<string, any>;
}) => {
  const bgImage = useColorModeValue(dashboardHeroGradientLight, dashboardHeroGradient);
  const borderColor = useColorModeValue("transparent", dashboardPalette.border);
  const textColor = useColorModeValue("white", dashboardPalette.text);
  const textMuted = useColorModeValue("whiteAlpha.800", dashboardPalette.textMuted);
  const iconColor = useColorModeValue("white", dashboardPalette.accentStrong);
  const glowBg = useColorModeValue("whiteAlpha.200", dashboardPalette.accentSoft);

  return (
    <Box
      bgImage={bgImage}
      borderRadius="30px"
      border="1px solid"
      borderColor={borderColor}
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 8 }}
      boxShadow={useColorModeValue("0 20px 40px -10px rgba(37, 99, 235, 0.38)", "0 32px 70px rgba(0, 0, 0, 0.32)")}
      position="relative"
      overflow="hidden"
      mb={mb}
    >
      <Box
        position="absolute"
        top="-84px"
        right="-34px"
        w="220px"
        h="220px"
        borderRadius="full"
        bg={glowBg}
        filter="blur(20px)"
        {...glowProps}
      />
      <Flex
        justify="space-between"
        align={align}
        direction={direction}
        gap={gap}
        position="relative"
        zIndex={1}
      >
        <Box maxW={maxW}>
          <HStack spacing={3} mb={4} flexWrap="wrap">
            <Circle bg="whiteAlpha.300" size="12" backdropFilter="blur(10px)">
              <Icon as={icon} boxSize={5} color={iconColor} />
            </Circle>
            <MerchantBadge
              tone="accent"
              letterSpacing="0.12em"
              textTransform="uppercase"
              bg="whiteAlpha.300"
              color="white"
              border="none"
              px={3}
              py={1.5}
              borderRadius="full"
              backdropFilter="blur(10px)"
            >
              {primaryBadge}
            </MerchantBadge>
            {extraBadges}
          </HStack>
          <Heading size="2xl" color={textColor} fontWeight="900" letterSpacing="-0.02em" mb={2}>
            {title}
          </Heading>
          <Text fontSize="lg" color={textMuted} maxW={descriptionMaxW}>
            {description}
          </Text>
          {leftFooter ? <Box mt={5}>{leftFooter}</Box> : null}
        </Box>
        {rightContent}
      </Flex>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

export const MerchantPanel = ({
  children,
  p = { base: 4, md: 6 },
  ...props
}: {
  children: React.ReactNode;
  p?: any;
  [key: string]: any;
}) => {
  const bg = useColorModeValue("white", dashboardPalette.shell);
  const borderColor = useColorModeValue("gray.200", dashboardPalette.border);

  return (
    <Box
      bg={bg}
      borderRadius={{ base: "20px", md: "24px" }}
      border="1px solid"
      borderColor={borderColor}
      boxShadow={useColorModeValue(
        "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04)",
        "0 20px 48px rgba(0, 0, 0, 0.26)"
      )}
      p={p}
      {...props}
    >
      {children}
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

export { default as MerchantStatCard } from "./DashboardCard/DashboardMetricCard";

/* ------------------------------------------------------------------ */
/* Quick action tile                                                   */
/* ------------------------------------------------------------------ */

export const MerchantActionTile = ({
  icon,
  label,
  onClick,
  color,
  bg,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
  color?: string;
  bg?: string;
}) => {
  const border = useColorModeValue("gray.200", dashboardPalette.border);
  const hoverBorder = useColorModeValue("brand.300", dashboardPalette.borderAccent);
  const tileBg = useColorModeValue("white", dashboardPalette.surface);
  const hoverBg = useColorModeValue("brand.50", dashboardPalette.surfaceAlt);
  const defaultColor = useColorModeValue("brand.600", dashboardPalette.accentStrong);
  const defaultBg = useColorModeValue("brand.50", dashboardPalette.accentSoft);

  return (
    <Flex
      as="button"
      type="button"
      onClick={onClick}
      direction="column"
      align="center"
      justify="center"
      gap={2}
      py={{ base: 3, md: 4 }}
      px={2}
      bg={tileBg}
      border="1px solid"
      borderColor={border}
      borderRadius="16px"
      transition="all 0.2s ease"
      _hover={{ bg: hoverBg, borderColor: hoverBorder, transform: "translateY(-2px)" }}
      _active={{ transform: "scale(0.97)" }}
      _focusVisible={{ outline: "2px solid", outlineColor: hoverBorder, outlineOffset: "2px" }}
    >
      <Circle size="9" bg={bg || defaultBg}>
        <Icon as={icon} boxSize={4} color={color || defaultColor} />
      </Circle>
      <Text fontSize="xs" fontWeight="600" color="var(--merchant-text)" noOfLines={1}>
        {label}
      </Text>
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/* Table props                                                         */
/* ------------------------------------------------------------------ */

export const getMerchantTableProps = (height = "62vh") => ({
  variant: "merchant" as const,
  tableProps: {
    tableBox: {
      minH: { base: "auto", md: height },
      maxH: { base: "none", md: height },
      px: 0,
    },
    table: {
      sx: {
        tbody: {
          tr: {
            td: {
              borderBottom: "1px solid",
              borderColor: "var(--chakra-colors-brand-100)",
            },
          },
          "tr:last-of-type td": {
            borderBottom: "none",
          },
        },
      },
    },
  },
});