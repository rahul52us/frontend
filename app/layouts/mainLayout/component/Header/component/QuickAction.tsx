"use client";

import {
  Badge,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface QuickActionProps {
  icon: any;
  label: string;
  onClick: () => void;
  badge?: number | string | null;
  color?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
  badge,
  color = "gray.600",
}) => {
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const activeBg = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Flex
      as="button"
      w="full"
      align="center"
      gap={3}
      py={2.5}
      px={3}
      borderRadius="lg"
      bg="transparent"
      _hover={{ bg: hoverBg, color: "var(--color-primary)" }}
      _active={{ bg: activeBg }}
      transition="all 0.15s ease"
      onClick={onClick}
      textAlign="left"
    >
      <Icon as={icon} color={color} boxSize={4} flexShrink={0} />
      <Text fontWeight="500" fontSize="sm" color={textColor} flex="1" noOfLines={1}>
        {label}
      </Text>
      {badge ? (
        <Badge colorScheme="brand" borderRadius="full" px={2} py={0.5} fontSize="2xs">
          {badge}
        </Badge>
      ) : null}
    </Flex>
  );
};

export default QuickAction;

