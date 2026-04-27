import React from "react";
import {
  Badge,
  Box,
  ButtonProps,
  Circle,
  Container,
  HStack,
  Heading,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Flex,
} from "@chakra-ui/react";
import { dashboardHeroGradient, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { merchantFormSx } from "../../shop/component/merchantTheme";

type MerchantBadgeTone = "accent" | "success" | "danger" | "soft";

export const merchantBadgeStyles = {
  borderRadius: "full",
  px: 3,
  py: 1.5,
  border: "1px solid",
  fontWeight: "700",
};

const merchantBadgeToneMap: Record<
  MerchantBadgeTone,
  { bg: string; color: string; borderColor: string }
> = {
  accent: {
    bg: dashboardPalette.accentSoft,
    color: dashboardPalette.accentStrong,
    borderColor: dashboardPalette.border,
  },
  success: {
    bg: "rgba(70, 201, 139, 0.14)",
    color: dashboardPalette.success,
    borderColor: "rgba(70, 201, 139, 0.22)",
  },
  danger: {
    bg: "rgba(239, 107, 107, 0.14)",
    color: dashboardPalette.danger,
    borderColor: "rgba(239, 107, 107, 0.22)",
  },
  soft: {
    bg: dashboardPalette.surfaceAlt,
    color: dashboardPalette.textMuted,
    borderColor: dashboardPalette.borderStrong,
  },
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
  const toneStyles = merchantBadgeToneMap[tone];

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
  borderColor: dashboardPalette.borderStrong,
  bg: dashboardPalette.surfaceAlt,
  color: dashboardPalette.textMuted,
  _hover: { bg: dashboardPalette.surfaceSoft, color: dashboardPalette.text },
  _active: { transform: "scale(0.98)" },
};

export const merchantPrimaryButtonProps: ButtonProps = {
  borderRadius: "16px",
  bg: dashboardPalette.accent,
  color: dashboardPalette.page,
  _hover: { bg: dashboardPalette.accentStrong },
  _active: { transform: "scale(0.98)" },
};

export const MerchantPageShell = ({
  children,
  maxW = "8xl",
}: {
  children: React.ReactNode;
  maxW?: any;
}) => (
  <Box minH="100vh" bg={dashboardPalette.page} py={{ base: 4, md: 6 }}>
    <Container maxW={maxW} sx={merchantFormSx}>
      {children}
    </Container>
  </Box>
);

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
}) => (
  <Box
    bgImage={dashboardHeroGradient}
    borderRadius="30px"
    border="1px solid"
    borderColor={dashboardPalette.border}
    px={{ base: 5, md: 8 }}
    py={{ base: 6, md: 8 }}
    boxShadow="0 32px 70px rgba(0, 0, 0, 0.28)"
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
      bg="rgba(214, 183, 114, 0.08)"
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
          <Circle bg="rgba(214, 183, 114, 0.12)" size="12">
            <Icon as={icon} boxSize={5} color={dashboardPalette.accent} />
          </Circle>
          <MerchantBadge
            tone="accent"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            {primaryBadge}
          </MerchantBadge>
          {extraBadges}
        </HStack>
        <Heading
          size="2xl"
          color={dashboardPalette.text}
          fontWeight="500"
          mb={2}
          fontFamily='Georgia, "Times New Roman", serif'
        >
          {title}
        </Heading>
        <Text fontSize="lg" color={dashboardPalette.textMuted} maxW={descriptionMaxW}>
          {description}
        </Text>
        {leftFooter ? <Box mt={5}>{leftFooter}</Box> : null}
      </Box>
      {rightContent}
    </Flex>
  </Box>
);

export const MerchantPanel = ({
  children,
  p = { base: 5, md: 7 },
  ...props
}: {
  children: React.ReactNode;
  p?: any;
  [key: string]: any;
}) => (
  <Box
    bg={dashboardPalette.shell}
    borderRadius="30px"
    border="1px solid"
    borderColor={dashboardPalette.border}
    boxShadow="0 28px 60px rgba(0, 0, 0, 0.24)"
    p={p}
    {...props}
  >
    {children}
  </Box>
);

export const MerchantStatCard = ({
  label,
  value,
  valueColor = dashboardPalette.text,
  icon,
  iconColor = dashboardPalette.accentStrong,
  iconBg = "rgba(214, 183, 114, 0.10)",
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

  return (
    <Box
      bg={isPanel ? dashboardPalette.surface : "rgba(255,255,255,0.03)"}
      border="1px solid"
      borderColor={dashboardPalette.border}
      borderRadius={isPanel ? "24px" : "22px"}
      px={isPanel ? 5 : 4}
      py={isPanel ? 5 : 4}
      boxShadow={isPanel ? "0 18px 40px rgba(0, 0, 0, 0.28)" : "none"}
    >
      <Stat>
        <HStack spacing={3} mb={3} align="center">
          {icon ? (
            <Circle size="10" bg={iconBg}>
              <Icon as={icon} color={iconColor} />
            </Circle>
          ) : null}
          <StatLabel
            color={dashboardPalette.textSoft}
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.12em"
            mb={0}
          >
            {label}
          </StatLabel>
        </HStack>
        <StatNumber color={valueColor}>{value}</StatNumber>
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
              borderColor: dashboardPalette.borderStrong,
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
