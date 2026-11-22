"use client";

import {
  Badge,
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

export interface DashboardMetricCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  valueColor?: string;
  icon?: any;
  iconColor?: string;
  iconBg?: string;
  delta?: React.ReactNode;
  helper?: React.ReactNode;
  variant?: "hero" | "panel" | "compact";
  isLoading?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  valueColor,
  icon,
  iconColor,
  iconBg,
  delta,
  helper,
  variant = "panel",
  isLoading = false,
  onClick,
  ...rest
}) => {
  const defaultText = useColorModeValue("gray.800", dashboardPalette.text);
  const defaultTextSoft = useColorModeValue("gray.500", dashboardPalette.textSoft);
  const defaultIconColor = useColorModeValue("brand.600", dashboardPalette.accentStrong);
  const defaultIconBg = useColorModeValue("brand.50", dashboardPalette.accentSoft);
  const defaultBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const hoverBorder = useColorModeValue("brand.300", dashboardPalette.borderAccent);
  const panelBg = useColorModeValue("white", dashboardPalette.surface);
  const heroBg = useColorModeValue("whiteAlpha.50", "rgba(59, 130, 246, 0.04)");
  const panelShadow = useColorModeValue("0 1px 2px rgba(15, 23, 42, 0.04)", "0 18px 40px rgba(0, 0, 0, 0.28)");
  const hoverShadow = useColorModeValue("0 10px 24px rgba(37, 99, 235, 0.10)", "0 22px 44px rgba(0, 0, 0, 0.36)");

  const interactiveProps = onClick
    ? {
        as: "button" as const,
        onClick,
        cursor: "pointer",
        textAlign: "left" as const,
        w: "full",
        _hover: { transform: "translateY(-2px)", borderColor: hoverBorder, boxShadow: hoverShadow },
        _active: { transform: "scale(0.98)" },
        _focusVisible: { outline: "2px solid", outlineColor: hoverBorder, outlineOffset: "2px" },
      }
    : {};

  /* ---- Hero variant (used inside hero sections) ---- */
  if (variant === "hero") {
    return (
      <Box bg={heroBg} border="1px solid" borderColor={defaultBorder} borderRadius="22px" px={4} py={4} {...rest}>
        <Stat>
          <HStack spacing={3} mb={3} align="center">
            {icon ? (
              <Circle size="10" bg={iconBg || defaultIconBg}>
                <Icon as={icon} color={iconColor || defaultIconColor} />
              </Circle>
            ) : null}
            <StatLabel color={defaultTextSoft} fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" mb={0}>
              {label}
            </StatLabel>
          </HStack>
          <StatNumber color={valueColor || defaultText}>{value}</StatNumber>
        </Stat>
      </Box>
    );
  }

  /* ---- Compact variant (secondary metrics) ---- */
  const compactAccentColor = iconColor || defaultIconColor;

  if (variant === "compact") {
    return (
      <Flex
        align="center"
        gap={3}
        bg={panelBg}
        border="1px solid"
        borderColor={defaultBorder}
        borderTop="3px solid"
        borderTopColor={compactAccentColor}
        borderRadius="16px"
        px={{ base: 3, md: 4 }}
        py={{ base: 3, md: 3.5 }}
        boxShadow={panelShadow}
        transition="all 0.25s ease"
        {...(interactiveProps as any)}
        {...rest}
      >
        {icon ? (
          <Circle size={{ base: "8", md: "9" }} bg={iconBg || defaultIconBg} flexShrink={0}>
            <Icon as={icon} boxSize={4} color={iconColor || defaultIconColor} />
          </Circle>
        ) : null}
        <Box minW={0}>
          {isLoading ? (
            <Skeleton h="18px" w="36px" borderRadius="md" mb={1} />
          ) : (
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="800" lineHeight="1.2" color={valueColor || defaultText}>
              {value}
            </Text>
          )}
          <Text fontSize="xs" color={defaultTextSoft} fontWeight="500" noOfLines={1}>
            {label}
          </Text>
        </Box>
      </Flex>
    );
  }

  /* ---- Panel variant (Primary KPIs: clean, original layout with crisp typography & watermark) ---- */
  const accentBorderColor = iconColor || defaultIconColor;

  return (
    <Flex
      direction="column"
      justify="space-between"
      gap={{ base: 2, md: 3 }}
      position="relative"
      overflow="hidden"
      bg={panelBg}
      border="1px solid"
      borderColor={defaultBorder}
      borderTop="3.5px solid"
      borderTopColor={accentBorderColor}
      borderRadius={{ base: "18px", md: "22px" }}
      px={{ base: 3, md: 5 }}
      py={{ base: 3, md: 4 }}
      boxShadow={panelShadow}
      transition="all 0.25s ease"
      {...(interactiveProps as any)}
      {...rest}
    >
      {icon ? (
        <Icon
          as={icon}
          position="absolute"
          right={{ base: "-10px", md: "-8px" }}
          bottom={{ base: "-14px", md: "-12px" }}
          boxSize={{ base: "70px", md: "96px" }}
          color={iconColor || defaultIconColor}
          opacity={0.07}
          pointerEvents="none"
        />
      ) : null}

      <Flex justify="space-between" align="center" gap={2} position="relative">
        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600" color={defaultTextSoft} noOfLines={1}>
          {label}
        </Text>
        {icon ? (
          <Circle size={{ base: "8", md: "10" }} bg={iconBg || defaultIconBg} flexShrink={0}>
            <Icon as={icon} boxSize={{ base: 4, md: 5 }} color={iconColor || defaultIconColor} />
          </Circle>
        ) : null}
      </Flex>

      <Box position="relative">
        {isLoading ? (
          <Skeleton h={{ base: "26px", md: "32px" }} w="90px" borderRadius="md" />
        ) : (
          <Text
            fontSize={{ base: "lg", md: "3xl" }}
            fontWeight="700"
            letterSpacing="-0.02em"
            lineHeight="1.1"
            color={valueColor || defaultText}
            noOfLines={1}
          >
            {value}
          </Text>
        )}
        {(delta || helper) ? (
          <Text fontSize="xs" color={defaultTextSoft} mt={1}>
            {delta || helper}
          </Text>
        ) : null}
      </Box>
    </Flex>
  );
};

export default React.memo(DashboardMetricCard);
