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
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { dashboardHeroGradient, dashboardHeroGradientLight, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { useMerchantFormSx } from "../../shop/component/merchantTheme";
// import { merchantFormSx } from "../../shop/component/merchantTheme";

type MerchantBadgeTone = "accent" | "success" | "danger" | "soft" | "info" | "warning";

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
      bg: useColorModeValue("blue.50", dashboardPalette.accentSoft),
      color: useColorModeValue("blue.700", dashboardPalette.accentStrong),
      borderColor: useColorModeValue("blue.200", dashboardPalette.borderAccent),
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

export const merchantGhostButtonProps: ButtonProps = {
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "var(--merchant-border-strong)",
  bg: "var(--merchant-surface-alt)",
  color: "var(--merchant-text-muted)",
  _hover: { bg: "var(--merchant-surface-soft)", color: "var(--merchant-text)" },
  _active: { transform: "scale(0.98)" },
};

export const merchantPrimaryButtonProps: ButtonProps = {
  borderRadius: "16px",
  bg: "var(--merchant-accent)",
  color: "white",
  _hover: { bg: "var(--merchant-accent-strong)" },
  _active: { transform: "scale(0.98)" },
};

export const MerchantPageShell = ({
  children,
  maxW = "8xl",
}: {
  children: React.ReactNode;
  maxW?: any;
}) => {
  const pageBg = useColorModeValue("white", dashboardPalette.page);

  // CSS variables — blue-tinted tokens for all child components
  const themeVars = {
    "--merchant-border-strong": useColorModeValue("var(--chakra-colors-blue-100)", dashboardPalette.borderStrong),
    "--merchant-surface-alt": useColorModeValue("var(--chakra-colors-gray-50)", dashboardPalette.surfaceAlt),
    "--merchant-surface-soft": useColorModeValue("var(--chakra-colors-gray-100)", dashboardPalette.surfaceSoft),
    "--merchant-text-muted": useColorModeValue("var(--chakra-colors-gray-500)", dashboardPalette.textMuted),
    "--merchant-text": useColorModeValue("var(--chakra-colors-gray-800)", dashboardPalette.text),
    "--merchant-accent": useColorModeValue("var(--chakra-colors-blue-600)", dashboardPalette.accent),
    "--merchant-accent-strong": useColorModeValue("var(--chakra-colors-blue-700)", dashboardPalette.accentStrong),
    "--merchant-page-bg": useColorModeValue("white", dashboardPalette.page),
  };

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 4, md: 6 }} style={themeVars as any}>
      <Container maxW={maxW} sx={useMerchantFormSx()}>
        {children}
      </Container>
    </Box>
  );
};

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
  // Blue glassmorphism glow orb — replaces amber
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
          <Heading
            size="2xl"
            color={textColor}
            fontWeight="900"
            letterSpacing="-0.02em"
            mb={2}
          >
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

export const MerchantPanel = ({
  children,
  p = { base: 5, md: 7 },
  ...props
}: {
  children: React.ReactNode;
  p?: any;
  [key: string]: any;
}) => {
  const bg = useColorModeValue("white", dashboardPalette.shell);
  // Blue-tinted border — gives panels the "alive" quality
  const borderColor = useColorModeValue("blue.100", dashboardPalette.border);
  
  return (
    <Box
      bg={bg}
      borderRadius="30px"
      border="1px solid"
      borderColor={borderColor}
      boxShadow={useColorModeValue("0 4px 20px rgba(37, 99, 235, 0.06)", "0 28px 60px rgba(0, 0, 0, 0.28)")}
      p={p}
      {...props}
    >
      {children}
    </Box>
  );
};

export const MerchantStatCard = ({
  label,
  value,
  valueColor,
  icon,
  iconColor,
  iconBg,
  variant = "hero",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  valueColor?: string;
  icon?: any;
  iconColor?: string;
  iconBg?: string;
  variant?: "hero" | "panel";
}) => {
  const isPanel = variant === "panel";
  
  const defaultText = useColorModeValue("gray.800", dashboardPalette.text);
  const defaultTextSoft = useColorModeValue("gray.500", dashboardPalette.textSoft);
  const defaultIconColor = useColorModeValue("blue.600", dashboardPalette.accentStrong);
  // Electric Blue icon bg — replaces amber
  const defaultIconBg = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const defaultBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const panelBg = useColorModeValue("white", dashboardPalette.surface);
  const heroBg = useColorModeValue("whiteAlpha.50", "rgba(59, 130, 246, 0.04)");

  return (
    <Box
      bg={isPanel ? panelBg : heroBg}
      border="1px solid"
      borderColor={defaultBorder}
      borderRadius={isPanel ? "24px" : "22px"}
      px={isPanel ? 5 : 4}
      py={isPanel ? 5 : 4}
      boxShadow={isPanel ? useColorModeValue("0 2px 12px rgba(37,99,235,0.06)", "0 18px 40px rgba(0, 0, 0, 0.28)") : "none"}
    >
      <Stat>
        <HStack spacing={3} mb={3} align="center">
          {icon ? (
            <Circle size="10" bg={iconBg || defaultIconBg}>
              <Icon as={icon} color={iconColor || defaultIconColor} />
            </Circle>
          ) : null}
          <StatLabel
            color={defaultTextSoft}
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.12em"
            mb={0}
          >
            {label}
          </StatLabel>
        </HStack>
        <StatNumber color={valueColor || defaultText}>{value}</StatNumber>
      </Stat>
    </Box>
  );
};

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
              // Blue-tinted row separator
              borderColor: "var(--chakra-colors-blue-100)",
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
